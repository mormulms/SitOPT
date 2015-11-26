package servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Set;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class TestLoad {

	public static void main(String[] args) {
		// move this code to Load class
		URL url;
		HttpURLConnection conn;
		BufferedReader rd;
		String line;
		String result = "";

		try {
			url = new URL("http://192.168.209.246:10010/situationtemplates/");
			conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			conn.setRequestProperty("Content-Type", "application/json");
			rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			while ((line = rd.readLine()) != null) {
				result += line;
			}
			rd.close();
			
//			System.out.println(result);
			
			JSONParser parser = new JSONParser();
			JSONArray response = (JSONArray) parser.parse(result);
			
			JSONArray containedSitTemplates = new JSONArray();			
			
			for(int i = 0; i < response.size(); i++) {
				JSONObject sitTemplate = (JSONObject) response.get(i);
//				System.out.println(sitTemplate.toJSONString());
				containedSitTemplates.add(sitTemplate.get("_id"));
			}
			
			System.out.println(containedSitTemplates.toJSONString());
			
			// return the entries through the variable containedSitTemplates
			// format: [id1, id2, id3]
						
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
