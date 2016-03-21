package servlets;


import org.apache.commons.io.FileUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.ContentBody;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
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
			String stack = e.getMessage() + "\n";
			for (StackTraceElement stackTraceElement : e.getStackTrace()) {
				stack += stackTraceElement.toString() + "\n";
			}
			response.getWriter().write("MalformedURLException occurred. Error message: " + stack);
		}
		catch (IOException e) {
			// openConnection() failed
			e.printStackTrace();
			String stack = e.getMessage() + "\n";
			for (StackTraceElement stackTraceElement : e.getStackTrace()) {
				stack += stackTraceElement.toString() + "\n";
			}
			response.getWriter().write("IOException occurred. Error message: " + stack);
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


	private static String sendFileRequest(String saveId, String sitTemplate) throws IOException {
		String msg = "Something went wrong.";
		CloseableHttpClient httpClient = HttpClientBuilder.create().build();

		Properties properties = new Properties();
		InputStream input = new FileInputStream(System.getProperty("user.home") + File.separator + "situation_mapping.properties");
		properties.load(input);
		HttpPost httppost = new HttpPost(properties.getProperty("situationProtocol") + "://" + properties.getProperty("situationServer") + ":" +
				properties.getProperty("situationPort") + "/situationtemplates/" + saveId);

		Path tempFile = Files.createTempFile("temp", "xml");
		Files.write(tempFile, sitTemplate.getBytes());

		MultipartEntityBuilder builder = MultipartEntityBuilder.create();
		ContentBody cbFile = new FileBody(tempFile.toFile(), ContentType.TEXT_XML);
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

		Files.delete(tempFile);
		return msg;
	}
}