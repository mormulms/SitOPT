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

import org.apache.commons.io.FileUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.ContentBody;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;

public class TestSave {

	public static void main(String[] args) {
		try {
			
			// String situationTemplateXML = request.getParameter("sitTemplate");
			String situationTemplateXML = "<Situation id=\"test124345\"> </Situation>";
			
			// String sitTemplateName = request.getParameter("name";)
			String sitTemplateName = "test123";
			
			// String sitTemplateName = request.getParameter("name";)
			String name = "test123";
			
			// String saveId = request.getParameter("name");
			String saveId = "test123";
			
			String description = "description";

			String body = "{" + "\"id\": \"" + saveId + "\"," + "\"name\": \""
					+ name + "\"," + "\"situation\": \"" + sitTemplateName + "\","
					+ "\"description\": \"" + description + "\"" + "}";

			URL url = null;
			HttpURLConnection connection = null;

			url = new URL("http://192.168.209.246:10010/situationtemplates/");

			connection = (HttpURLConnection) url.openConnection(); // get a URLConnection object

			// setup parameters and general request properties before connecting:
			connection.setRequestMethod("POST");
			connection.setDoInput(true);
			connection.setDoOutput(true); 
			connection.setUseCaches(false);
			connection.setRequestProperty("Content-Type", "application/json");
			connection.setRequestProperty("charset", "UTF-8");

			OutputStreamWriter writer = new OutputStreamWriter(
					connection.getOutputStream());

			writer.write(body);
			writer.flush();

			BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));

			writer.close();
			reader.close();

			// next request
			sendFileRequest(saveId, situationTemplateXML);

		} catch (MalformedURLException e) {
			// new URL() failed: the arguments to the constructor refer to a null or unknown protocol
			e.printStackTrace();
		} catch (IOException e) {
			// openConnection() failed
			e.printStackTrace();
		}
	}

	private static void sendFileRequest(String saveId, String sitTemplate) {
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
				System.out.println(EntityUtils.toString(resEntity));
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
		} catch (IOException e) {
			// openConnection() failed
			e.printStackTrace();
		}
	}
}
