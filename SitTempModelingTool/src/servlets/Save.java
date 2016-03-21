package servlets;


import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.StringBody;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
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
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			// dependent on client side
	    	String situationTemplateXML  = request.getParameter("xml");
	    	String saveId = request.getParameter("id");

			MultipartEntity entity = new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE);
			entity.addPart("file", new StringBody(situationTemplateXML));

			Properties properties = new Properties();
			InputStream input = new FileInputStream(System.getProperty("user.home") + File.separator + "situation_mapping.properties");
			properties.load(input);
			
			URL url = new URL(properties.getProperty("protocol") + "://" + properties.getProperty("server") + ":" +
					properties.getProperty("port") + "/situationtemplates/" + saveId);
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();  // get a URLConnection object
			
			// setup parameters and general request properties before connecting
			connection.setRequestMethod("POST");
			connection.setDoInput(true);  // able to read
			connection.setDoOutput(true);  // able to write
			connection.setUseCaches(false);
			connection.setConnectTimeout(15000);
			connection.setRequestProperty("Connection", "Keep-Alive");
			connection.setRequestProperty("Content-Length", String.valueOf(entity.getContentLength()));
			connection.setRequestProperty(entity.getContentType().getName(), entity.getContentType().getValue());

			// creates an output stream on the connection and opens an OutputStreamWriter on it (implicitly opens the connection)
			OutputStream writer = connection.getOutputStream();

			entity.writeTo(writer);

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
		catch (Exception e) {
			e.printStackTrace();
			String stack = e.getMessage() + "\n";
			for (StackTraceElement stackTraceElement : e.getStackTrace()) {
				stack += stackTraceElement.toString() + "\n";
			}
			response.getWriter().write("Unexpected error. Error message: " + stack);
		}
	}

	
	private static String sendFileRequest(String saveId, String sitTemplate) {
		/*String msg = "Something went wrong.";
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
		return msg;*/
		return "";
	}
}