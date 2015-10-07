package mapping;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Scanner;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import situationtemplate.model.TContextNode;

public class ObjectIdSensorIdMapping {
	private JSONObject json = null;
	private String object = null;

	public ObjectIdSensorIdMapping(String filePath) {
		JSONParser parser = new JSONParser();
		String file;
		Scanner scan = null;
		try {
			scan = new Scanner(new File(filePath));
			file = scan.useDelimiter("\\Z").next();
		} catch (FileNotFoundException e) {
			object = filePath;
			return;
		} finally {
			if (scan != null) {
				scan.close();
			}
		}
		try {
			json = (JSONObject) parser.parse(file);
		} catch (ParseException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	public String[] getObjects(String sensor) {
		if (json != null) {
			JSONArray array = (JSONArray) json.get(sensor);
			ArrayList<String> values = new ArrayList<>();
			for (Object o : array) {
				values.add((String) o);
			}
			return values.toArray(new String[0]);
		} else {
			return new String[] { object };
		}
	}

	public String map(ArrayList<TContextNode> sensors) {
		if (json != null) {
			StringBuilder builder = new StringBuilder();
			builder.append('[');
			HashSet<String> set = new HashSet<>();
			for (TContextNode node : sensors) {
				for (String o : getObjects(node.getId())) {
					if (!set.contains(o)) {
						set.add(o);
					}
				}
			}
			for (String object : set) {
				builder.append("'");
				builder.append(object);
				builder.append("',");
			}
			builder.setLength(builder.length() - 1);
			builder.append(']');
			return builder.toString();
		} else {
			return "[" + object + "]";
		}
	}

}
