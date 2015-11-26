package servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 * Servlet implementation class LoadSituationTemplate
 * 
 * Load concrete Situation Template xml for given ID
 * 
 */
@WebServlet("/loadsituationtemplate")
public class LoadSituationTemplate extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		URL url;
		HttpURLConnection conn;
		BufferedReader rd;
		String line;
		String result = "";
		// dependent on client side
		String templateId = request.getParameter("templateId");

		try {		
			url = new URL("http://192.168.209.246:5984/situationtemplates/" + templateId + "/" + templateId);
			conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			conn.setRequestProperty("Content-Type", "application/json");
			rd = new BufferedReader(
					new InputStreamReader(conn.getInputStream()));
			while ((line = rd.readLine()) != null) {
				result += line;
			}
			rd.close();
			
			System.out.println(result);

			
		} catch (IOException e) {
			result = "IOException occurred! Is xml attached? Error message: " + e.getMessage();
			e.printStackTrace();
		} catch (Exception e) {
			result = "Exception occurred! Error message: " + e.getMessage();
			e.printStackTrace();
		}
		
		response.getWriter().println(result);
	}
}