package utils;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import situationtemplate.model.TSituationTemplate;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Utility class for input and output
 */
public class IOUtils {

	/**
	 * This methods writes the JSON string to a local file.
	 * 
	 * @param nodeREDModel
	 *            the nodeRED JSON flow model
	 * @param situationTemplate
	 *            the situation template of the model
	 */
	@SuppressWarnings("unchecked")
	public static void writeJSONFile(JSONArray nodeREDModel,
			TSituationTemplate situationTemplate) {
		try {
			JSONArray flow = new JSONArray();
			JSONObject sheet = new JSONObject();

			// TODO create constant for tab
			sheet.put("type", "tab");
			sheet.put("id", situationTemplate.getId());
			sheet.put("label", situationTemplate.getId() + ": "
					+ situationTemplate.getName());

			// add the sheet definition and all other components to the node red
			// flow
			flow.add(sheet);

			for (int i = 0; i < nodeREDModel.size(); i++) {
				flow.add(nodeREDModel.get(i));
			}

			// pretty print json
			Gson gson = new GsonBuilder().setPrettyPrinting().create();
			String json = gson.toJson(flow);
			System.out.println(json);

			// specify path here
			String path = "mappingOutput.json";

			Files.delete(Paths.get(path));
			Files.write(Paths.get(path), json.getBytes(),
					StandardOpenOption.CREATE);
		} catch (IOException e) {
			System.err.println("Could not write the json file, an error occurred.");
			e.printStackTrace();
		}
	}
	
	/**
	 * Clears all flows currently deployed in Node-RED
	 */
	public static void clearNodeRED() {
		try {
			
		JSONArray flow = new JSONArray();
		
		String body = flow.toJSONString();

		URL url;

		String server = constants.Properties.getServer();
		server = server == null ? "localhost" : server;
		String protocol = constants.Properties.getProtocol();
		protocol = protocol == null ? "http" : protocol;
		String port = constants.Properties.getPort();
		port = port == null ? "1880" : port;

		url = new URL(String.format("%s://%s:%s/flows", protocol, server, port));

		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		connection.setRequestMethod("POST");
		connection.setDoInput(true);
		connection.setDoOutput(true);
		connection.setUseCaches(false);
		connection.setRequestProperty("Content-Type", "application/json");
		connection.setRequestProperty("charset", "UTF-8");

		OutputStreamWriter writer = new OutputStreamWriter(connection.getOutputStream());

		writer.write(body);

		writer.flush();

		BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));

		writer.close();
		reader.close();
		
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * This method deploys the model to NodeRED
	 * 
	 * @param nodeREDModel
	 * 			 the model to be deployed
	 * @param situationTemplate
	 * 			 the situation template as XML
	 * @param doOverwrite
	 * 			 boolean determining whether the flow shall be overwritten or not
	 */
	@SuppressWarnings("unchecked")
	public static void deployToNodeRED(JSONArray nodeREDModel, TSituationTemplate situationTemplate, boolean doOverwrite) {
		try {
			Properties prop = new Properties();
			
			String server = "localhost";
			String protocol = "http";
			String port = "1880";
			
			try (InputStream input = new FileInputStream("settings.properties")) {
				prop.load(input);
				server = prop.getProperty("server");
				protocol = prop.getProperty("protocol");
				port = prop.getProperty("port");
			} catch (Exception e) {
			    e.printStackTrace();
			}
					
			JSONArray flow;
			
			if (doOverwrite) {
				flow = new JSONArray();
			} else {
				String currentFlows = getHTML(String.format("%s://%s:%s/flows", protocol, server, port));
				JSONParser parser = new JSONParser();
				flow = new JSONArray();//(JSONArray) parser.parse(currentFlows);
				
				List<JSONObject> toBeRemoved = new ArrayList<>();

				for (int i = 0; i < flow.size(); i++) {
					JSONObject flowElement = (JSONObject) flow.get(i);
					
					String id = (String) flowElement.get("id");
					String z = (String) flowElement.get("z");
					if (id != null && id.equals(situationTemplate.getId()) || (z != null && z.equals(situationTemplate.getId()))) {
						// this template already exists, delete it and replace it with the generated one
						toBeRemoved.add(flowElement);
					}
				}
				for (JSONObject remove: toBeRemoved) {
					flow.remove(remove);
				}
			}
			
			JSONObject sheet = new JSONObject();

			// TODO create constant for tab
			sheet.put("type", "tab");
			sheet.put("id", situationTemplate.getId());
			sheet.put("label", situationTemplate.getId() + ": "	+ situationTemplate.getName());

			// add the sheet definition and all other components to the node red flow
			flow.add(sheet);

			for (int i = 0; i < nodeREDModel.size(); i++) {
				flow.add(nodeREDModel.get(i));
			}
			
			// pretty print json
//			Gson gson = new GsonBuilder().setPrettyPrinting().create();
//			String json = gson.toJson(flow);
//			System.out.println(json);

			// we use this POST call to deploy the JSON
			// $.ajax({
			// url:"flows",
			// type: "POST",
			// data: JSON.,
			// contentType: "application/json; charset=utf-8"
			// });

			String body = flow.toJSONString();

			URL url = new URL(String.format("%s://%s:%s/flows", protocol, server, port));
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			System.out.println(url.getProtocol() + " " + url.getHost() + " " + url.getHost() + " " + url.getPath());
			connection.setRequestMethod("POST");
			connection.setDoInput(true);
			connection.setDoOutput(true);
			connection.setUseCaches(false);
			connection.setRequestProperty("Content-Type", "application/json");
			connection.setRequestProperty("charset", "UTF-8");

			OutputStreamWriter writer = new OutputStreamWriter(connection.getOutputStream());

			writer.write(body);

			writer.flush();

			BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));

			writer.close();
			reader.close();

		} catch (IOException e) {
			System.err.println("Could not process HTTP request.");
			e.printStackTrace();
		} catch (/*Parse*/Exception e) {
			System.err.println("Could not parse JSON.");
			e.printStackTrace();
		}
	}

	/**
	 * This methods gets the currently deployed flows in Node-RED 
	 * 
	 * @param urlToRead
	 * 				 the url of Node-RED
	 * @return the current flow
	 */
	public static String getHTML(String urlToRead) {
		URL url;
		HttpURLConnection conn;
		BufferedReader rd;
		String line;
		String result = "";
		try {
			url = new URL(urlToRead);
			conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			conn.setRequestProperty("Content-Type", "application/json");
			rd = new BufferedReader(
					new InputStreamReader(conn.getInputStream()));
			while ((line = rd.readLine()) != null) {
				result += line;
			}
			rd.close();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
}
