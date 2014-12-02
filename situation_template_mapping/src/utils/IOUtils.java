package utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import situationtemplate.model.TSituationTemplate;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Utils class for input and output
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
	public static void writeJSONFile(JSONArray nodeREDModel, TSituationTemplate situationTemplate) {
		// try {
		JSONArray flow = new JSONArray();
		JSONObject sheet = new JSONObject();

		// TODO create constant for tab
		sheet.put("type", "tab");
		sheet.put("id", situationTemplate.getId());
		sheet.put("label", situationTemplate.getId() + ": " + situationTemplate.getName());

		// add the sheet definition and all other components to the node red flow
		flow.add(sheet);

		for (int i = 0; i < nodeREDModel.size(); i++) {
			flow.add(nodeREDModel.get(i));
		}

		// TODO this shouldn't be called here
		IOUtils.deployToNodeRED(flow.toJSONString());

		// pretty print json
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		String json = gson.toJson(flow);
		System.out.println(json);

		// TODO DEBUG: use this code to write the json string to a local file

		// specify path here
		// String path = "";

		// Files.delete(Paths.get(path));
		// Files.write(Paths.get(path), json.getBytes(),
		// StandardOpenOption.CREATE);
		// } catch (IOException e) {
		// // TODO Auto-generated catch block
		// e.printStackTrace();
		// }
	}

	/**
	 * This method deploys the model to NodeRED
	 * 
	 * @param nodeREDJsonModelAsString
	 *            the JSON string to be deployed
	 */
	public static void deployToNodeRED(String nodeREDJsonModelAsString) {
		try {

			// we use this POST call to deploy the JSON
			// $.ajax({
			// url:"flows",
			// type: "POST",
			// data: JSON.,
			// contentType: "application/json; charset=utf-8"
			// });

			String body = nodeREDJsonModelAsString;

			URL url = new URL("http://localhost:1880/flows");
			HttpURLConnection connection = (HttpURLConnection) url
					.openConnection();
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

			// debug code
			for (String line; (line = reader.readLine()) != null;) {
				System.out.println(line);
			}

			writer.close();
			reader.close();

		} catch (IOException e) {
			System.err.println("Could not process HTTP request.");
			e.printStackTrace();
		}
	}

}
