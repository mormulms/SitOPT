package servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class TestLoadSituationTemplate {

	public static void main(String[] args) {
		
		// move this code to LoadSituationTemplate class
		URL url;
		HttpURLConnection conn;
		BufferedReader rd;
		String line;
		String result = "";
		String templateId = "test123";

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
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}