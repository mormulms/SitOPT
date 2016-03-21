package servlets;


import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.ContentBody;  // java.lang.ClassNotFoundException
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import java.io.FileInputStream;
import java.util.Properties;

/**
 * Servlet implementation class Save
 * 
 * Save SituationTemplate XML in database
 */
@WebServlet("/save")
public class Save extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Save() {
        super();
        // TODO Auto-generated constructor stub
    }
    	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			// dependent on client side
	    	String situationTemplateXML  = request.getParameter("xml");
	    	String saveId = request.getParameter("id");

			Properties properties = new Properties();
			InputStream input = new FileInputStream(System.getProperty("user.home") + File.separator + "settings.properties");
			properties.load(input);
			
			URL url = new URL(properties.getProperty("protocol") + "://" + properties.getProperty("server") + ":" +
					properties.getProperty("port") + "/situationTemplates/");
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();  // get a URLConnection object
			
			// setup parameters and general request properties before connecting
			connection.setRequestMethod("POST");
			connection.setDoInput(true);  // able to read
			connection.setDoOutput(true);  // able to write
			connection.setUseCaches(false);
			connection.setRequestProperty("Content-Type", "application/json");
			connection.setRequestProperty("charset", "UTF-8");

			// creates an output stream on the connection and opens an OutputStreamWriter on it (implicitly opens the connection)
			OutputStreamWriter writer = new OutputStreamWriter(connection.getOutputStream());  

			writer.write("");
			writer.flush();

			BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
					
			
			writer.close();
			reader.close();
			
			// next request
			String msg = sendFileRequest(saveId, situationTemplateXML);
			if (msg.equals("OK")) {
				response.getWriter().write("Situation Template successfully saved to database.");
			}
			else
			{
				response.getWriter().write("Error! Save failed: " + msg);

			}
		}
		catch (MalformedURLException e) {
			// new URL() failed: the arguments to the constructor refer to a null or unknown protocol
			e.printStackTrace();
			response.getWriter().write("MalformedURLException occurred. Error message: " + e.getMessage());
		}
		catch (IOException e) {
			// openConnection() failed
			e.printStackTrace();
			response.getWriter().write("IOException occurred. Error message: " + e.getMessage());
		}
	}

	
	private static String sendFileRequest(String saveId, String sitTemplate) {
		String msg = "Something went wrong.";		
		try {
			CloseableHttpClient httpClient = HttpClientBuilder.create().build();

			HttpPost httppost = new HttpPost("http://192.168.209.246:10010/situationtemplates/" + saveId + "/" + saveId);
			
			File file = new File("temp.xml");
			FileUtils.writeStringToFile(file, sitTemplate);
			
			MultipartEntityBuilder builder = MultipartEntityBuilder.create();  
			ContentBody cbFile = new FileBody(file, ContentType.TEXT_XML);
			builder.addPart("file", cbFile);

			HttpEntity entity = builder.build();
			
			httppost.setEntity(entity);
			System.out.println("executing request " + httppost.getRequestLine());
			HttpResponse response = httpClient.execute(httppost);
			HttpEntity resEntity = response.getEntity();

			System.out.println(response.getStatusLine());
			
			if (resEntity != null) {
				msg = EntityUtils.toString(resEntity).replace("\"", "");
				System.out.println("Message: " + msg);
			}
			
			if (resEntity != null) {
				if (entity.isStreaming()) {
			        final InputStream instream = resEntity.getContent();
			        if (instream != null) {
			            instream.close();
			        }
				}
			}
			
			httpClient.close();

			FileUtils.deleteQuietly(file);
			
		} catch (MalformedURLException e) {
			// new URL() failed: the arguments to the constructor refer to a
			// null or unknown protocol
			e.printStackTrace();
			msg = "MalformedURLException occurred.";
		} catch (IOException e) {
			// openConnection() failed
			e.printStackTrace();
			msg = "IOException occurred.";
		}
		return msg;
	}
}