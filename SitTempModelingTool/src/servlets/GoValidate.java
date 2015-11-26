package servlets;


import java.io.File;
import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.XMLConstants;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.bind.ValidationEvent;
import javax.xml.bind.ValidationEventLocator;
import javax.xml.bind.util.ValidationEventCollector;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;

import model.TSituationTemplate;

import org.xml.sax.SAXException;

import validation.ValidateConditionNodes;
import validation.ValidateContextNodes;
import validation.ValidateOperationNodes;
import validation.ValidateSituationNode;

/**
 * Servlet implementation class GoValidate
 * 
 * Validate SituationTemplate XML
 */
@WebServlet("/goValidate")
public class GoValidate extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GoValidate() {
        super();
        // TODO Auto-generated constructor stub
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	// TODO Auto-generated method stub
    }
    	

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String situationTemplate = request.getParameter("sitTemplate");
		int sitNodeNumb = Integer.parseInt(request.getParameter("sitNodeNumb"));
		
    	System.out.println(situationTemplate);    	
    	if (sitNodeNumb != 1) {
    		response.getWriter().write("The validation completed, at least 1 syntax error was discovered:\n" + sitNodeNumb + " situation nodes detected. Required is exactly one.\n");
    		return;
    	}
    	
    	Reader reader = new StringReader(situationTemplate);
    	XMLInputFactory factory = XMLInputFactory.newInstance(); // Or newFactory()
    	XMLStreamReader xmlReader = null;
		try {
			xmlReader = factory.createXMLStreamReader(reader);
		} catch (XMLStreamException e1) {
			e1.printStackTrace();
		}
    	
    	boolean syntError = false;
    	String syntErrMsg = "";
		String endMessage = "";  // detected errors inside the situation template
		
		System.out.println("Validating XML against the scheme:");
			
		File xsdFile = new File("res/situation_template.xsd");  // TODO
//		File xmlFile = new File("C://Users//eigen//workspace//SitTempModelingTool//res//20-Cycle_20_OperationNodes."
//				+ "xml");
		
		// Pass a ValidationEventCollector to the unmarshaller which will store validation events into it so that one can retrieve an event and query its individual attributes.
		ValidationEventCollector vec = new ValidationEventCollector();  
		try {
			JAXBContext jc = JAXBContext.newInstance(TSituationTemplate.class);
			Unmarshaller u = jc.createUnmarshaller();  //  Establish an Unmarshaller object  and...

			u.setEventHandler( vec );
			
			SchemaFactory sf = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);  // Setting up a schema factory for the chosen schema language
			Schema mySchema = sf.newSchema(xsdFile);  //  Create the Schema object
			
			u.setSchema( mySchema );  // ...pass it the schema			
			
			/* Validation */
			
			// Unmarshal XML and return the resulting content tree
			JAXBElement<TSituationTemplate> root = u.unmarshal(xmlReader, TSituationTemplate.class);
			TSituationTemplate sitTemplate = root.getValue();			
			
			// validate context-, condition-, operation nodes and situation node
			ValidateContextNodes val_ContxtNode = new ValidateContextNodes();
			ValidateConditionNodes val_CondNode = new ValidateConditionNodes();
			ValidateOperationNodes val_OpNode = new ValidateOperationNodes();
			ValidateSituationNode valSitNode = new ValidateSituationNode();
			
			endMessage += val_ContxtNode.checkParents(sitTemplate);  // 1)
			endMessage += val_CondNode.checkParents(sitTemplate);  // 2)
			endMessage += val_OpNode.checkParents(sitTemplate);  // 3)
			
			endMessage += val_ContxtNode.checkParentNumb(sitTemplate);  // 4)
			endMessage += val_CondNode.checkChildrenNumb(sitTemplate);  // 5)
			endMessage += val_OpNode.checkChildrenNumb(sitTemplate);  // 6)
			endMessage += valSitNode.checkChildrenNumb(sitTemplate);  // 7)
			
			long startTime = System.nanoTime();
//			endMessage += val_OpNode.existsCycleTarjan(sitTemplate);  // 8) Alternative algorithm
			endMessage += val_OpNode.existsCycleDFS(sitTemplate);  // 8) 
			long endTime = System.nanoTime();
			long duration = (endTime - startTime);  // in nanoseconds
			System.out.println("Cycle detection algorithm runtime: " + duration / 1000000.0 + " ms");			
						
			
		} catch (JAXBException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		}
		finally {  // checking the event collector
			if( vec != null && vec.hasEvents() ){
			    for( ValidationEvent ve: vec.getEvents() ){
			        String msg = ve.getMessage();
			        ValidationEventLocator vel = ve.getLocator();
			        int line = vel.getLineNumber();
			        int column = vel.getColumnNumber();
			        URL origin = vel.getURL(); // ???
					System.err.println("\n" + origin + ": Line " + line + ", column " + column + ": " + msg ); 
					System.err.println("Syntax error during validation against the scheme (see previous line).");
					syntError = true;
					
					// replacing umlauts
					syntErrMsg = msg;
					syntErrMsg = syntErrMsg.replace("ä", "ae");
					syntErrMsg = syntErrMsg.replace("ö", "oe");
					syntErrMsg = syntErrMsg.replace("ü", "ue");
					syntErrMsg = syntErrMsg.replace("Ä", "Ae");
					syntErrMsg = syntErrMsg.replace("Ö", "Oe");
					syntErrMsg = syntErrMsg.replace("Ü", "Ue");
					syntErrMsg = syntErrMsg.replace("ß", "ss");
					System.out.println(msg);
			    }
			}		
		}	
		
		if (syntError) {
			endMessage = "The validation completed, at least 1 syntax error was discovered:\n" + syntErrMsg;
		}
		else if (endMessage.equals("")) {
			endMessage = "The validation completed with no errors.";
		}
	
    	response.getWriter().write(endMessage);
	}
}