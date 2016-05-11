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

/**
 * Class for mapping sensors and their ids.
 * This is needed when the mapping of a contextId is provided in a json file
 */
public class ObjectIdSensorIdMapping {
	private JSONObject json = null;
	private String object = null;

	/**
	 * Constructor.
	 * Reads the json file
	 * @param filePath the filepath where the json file is located
	 */
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

	/**
	 * Returns the sensors for a sensor id
	 * @param sensor the sensor id whose sensors should be found
	 * @return
     */
	public String[] getObjects(String sensor) {
		if (json != null) {
			JSONArray array = (JSONArray) json.get(sensor);
			ArrayList<String> values = new ArrayList<>();
			for (Object o : array) {
				values.add((String) o);
			}
			return values.toArray(new String[0]);
		}
        return new String[] { object };
	}

	/**
	 * Returns a string that represents the sensors in the list as comma seperated list.
	 * @param sensors list containing sensor ids
	 * @return
     */
	public String map(ArrayList<TContextNode> sensors) {
		if (json != null) {
			StringBuilder builder = new StringBuilder();
			HashSet<String> set = new HashSet<>();
			for (TContextNode node : sensors) {
				for (String o : getObjects(node.getId())) {
					if (!set.contains(o)) {
						set.add(o);
					}
				}
			}
			for (String object : set) {
				builder.append("\'");
				builder.append(object);
				builder.append("\',");
			}
			builder.setLength(builder.length() - 1);
			return builder.toString();
		}
        return object;
	}

	/**
	 *
	 * @return Returns all things in the json file
     */
    public String getObjects() {
        ArrayList<Object> things = new ArrayList<>();
        if (json != null) {
            for (Object key : json.keySet()) {
                JSONArray array = (JSONArray) json.get(key);
                for (Object thing : array) {
                    if (things.indexOf(thing) == -1) {
                        things.add(thing);
                    }
                }
            }
            StringBuilder builder = new StringBuilder();
            for (Object thing : things) {
                builder.append('\'');
                builder.append(thing.toString());
                builder.append("', ");
            }
            builder.setLength(builder.length() - 2);
            return "";
        }
        return "";
    }

}
