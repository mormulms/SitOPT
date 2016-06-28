package constants;

import java.util.ArrayList;
import java.util.List;

import mapping.ObjectIdSensorIdMapping;
import situationtemplate.model.TContextNode;

/**
 * This class offers methods to generate the Node-RED function nodes as JSON
 */
public class Nodes {
	private final static String compareString = "var curr = parseInt(JSON.parse(msg.payload).payload.value);\n"
	        + "msg.situation = {\n"
	        + "  'sensor':'%s', 'value':curr,\n"
			+ "  'timestamp':new Date().toString(),\n"
			+ "  'quality':1"
			+ "};\n"
			+ "if (curr %s %s) {\n"
			+ "  msg.payload = true;\n"
			+ "} else {\n"
			+ "  msg.payload = false;\n"
			+ "}\n\n"
                        + "msg.headers = {\"Content-Type\": \"application/json\"};\n"
			+ "return msg;";
	private final static String statusCodeString = "var curr = parseInt(JSON.parse(msg.payload).value);\n"
	        + "msg.situation = {\n"
	        + "  'sensor':'%s', 'value':curr,\n"
			+ "  'timestamp':new Date().toString(),\n"
			+ "  'quality':1"
			+ "};\n\n"
			+ "if (msg.statusCode %s %s) {\n"
			+ "  msg.payload = true;\n"
                        + "  msgs[0].headers = {\"Content-Type\": \"application/json\"};\n"
			+ "  return msg;\n"
			+ "} else {\n"
			+ "  msg.payload = false;\n"
                        + "  msg.headers = {\"Content-Type\": \"application/json\"};\n"
			+ "  return msg;\n"
			+ "}"
			+ "\n\nreturn null;";
	private final static String accumulationString = "context.values = context.values || [];\n"
			+ "context.values.push(JSON.parse(msg.payload));\n\n"
			+ "context.sensorValues = context.sensorValues || [];\n"
			+ "context.sensorValues.push(msg.situation);\n\n"
			+ "var inputs = %s;\n"
			+ "if (context.values.length == inputs) {\n"
			+ "  msg.situation = [];\n"
			+ "  var returnValue = true;\n"
			+ "  var counter = 0;\n"
			+ "  var situations = [];\n"
			+ "  var values = [];\n"
			+ "  for (var i = 0; i < inputs; i++) {\n"
			+ "    values.push(context.sensorValues[i]);\n"
			+ "    %s\n"
			+ "  }\n\n"
			+ "  if (returnValue) {\n"
			+ "    var array = [%s];\n"
			+ "    for (var index in array) {\n"
			+ "      situations.push({'thing':array[index], 'name': array[index], 'timestamp':new Date().toString(), 'situationtemplate':'%s' , 'occured':true, 'sensorvalues': values});\n"
			+ "    }\n"
			+ "  } else {\n"
			+ "    var array = [%s];\n"
			+ "    for (var index in array) {\n"
			+ "      situations.push({'thing':array[index], 'name': array[index], 'timestamp':new Date().toString(), 'situationtemplate':'%s' , 'occured':false, 'sensorvalues': values});\n"
			+ "    }\n"
			+ "  }\n"
			+ "  context.values = null;\n"
			+ "  context.sensorValues = null;\n\n"
			+ "  var jsonStr = '{\"situation\": []}';\n"
			+ "  var obj = JSON.parse(jsonStr);\n\n"
			+ "  for (var i = 0; i < msg.situation.length; i++) {\n"
			+ "    obj.situation.push(msg.situation[i]);\n"
			+ "  }\n\n"
			+ "  var msgs = [];\n"
			+ "  for (var i = 0; i < situations.length; i++) {\n"
			+ "    msg.payload = situations[i];\n"
			+ "    msgs.push(msg);\n"
			+ "  }\n"
			+ "  msgs[0].headers = {\"Content-Type\": \"application/json\"};\n"
			+ "  return msgs[0];\n"
			+ "} else {\n"
			+ "  return null;\n"
			+ "}";
	private final static String betweenString = "var curr = parseInt(JSON.parse(msg.payload).value);\n"
	        + "msg.situation = {\n"
	        + "  'sensor':'%s',\n"
			+ "  'value':curr,\n"
			+ "  'timestamp':new Date().toString(),\n"
			+ "  'quality':1\n"
			+ "};\n"
			+ "if (%s < msg.statusCode && msg.statusCode < %s) {\n"
			+ "  msg.payload = true;\n"
                        + "  msg.headers = {\"Content-Type\": \"application/json\"};\n"
			+ "  return msg;\n"
			+ "} else {\n"
			+ "  msg.payload = false;\n"
                        + "  msg.headers = {\"Content-Type\": \"application/json\"};\n"
			+ "  return msg;\n"
			+ "}\n\n"
			+ "return null;";
	private final static String timeString = "context.values = context.values || new Array();\n"
            + "context.values.push(JSON.parse(msg.payload).value);\n\n"
            + "context.sensorValues = context.sensorValues || new Array();\n"
            + "context.sensorValues.push(msg.situation);\n\n"
            + "var intervals = %s;\n"
            + "var compareValue = %s;\n"
            + "msg.situation = [];\n"
            + "var returnValue = true;\n"
            + "var counter = 0;\n"
            + "context.min = compareValue;\n"
            + "context.max = compareValue;\n"
            + "var min = intervals > context.values.length ? 0 : context.values.length - intervals;\n"
            + "for (var i = context.values.length - 1; i >= min; i--) {\n"
            + "    msg.situation.push(context.sensorValues[i]);\n"
            + "%s"
            + "}\n\n"
            + "if (returnValue) {\n"
            + "  var array = [%s];"
            + "  for (var index in array) {\n"
            + "    msg.situation.push({'thing':array[index], 'timestamp':new Date().toString(), 'situationtemplate':'A0' , 'occured':true});\n"
            + "  }\n"
            + "} else {\n"
            + "  var array = [%s];"
            + "  for (var index in array) {\n"
            + "    msg.situation.push({'thing':array[index], 'timestamp':new Date().toString(), 'situationtemplate':'A0' , 'occured':false});\n"
            + "  }\n"
            + "}\n\n"
            + "if (context.values.length > 1000) {\n"
            + "    context.values = context.values.slice(context.values.length - intervals, context.values.length);\n"
            + "}\n\n"
            + "msg.payload = returnValue;\n"
            + "msg.headers = {\"Content-Type\": \"application/json\"};"
            + "return msg;";
	
	private final static String sensorComparisonString = 
			"var payload = msg.payload;\n"
			+ "var obj = JSON.parse(payload);\n"
			+ "var index;\n"
			+ "%s\n\n"
			+ "context.values = context.values || [];\n"
			+ "if (context.values.length > index) {\n"
			+ "    context.values[index] = obj.value;\n"
			+ "} else if (context.values.length == index) {\n"
			+ "    context.values.push(obj.value);\n"
			+ "}\n"
			+ "var bool = true;\n"
			+ "if (context.values.length == %s) {\n"
			+ "    for (var i = 0; i < %s - 1; i++) {\n"
			+ "        bool &= (context.values[i] %s context.values[i+1]);\n"
			+ "    }\n"
			+ "}\n"
                        + "msg.headers = {\"Content-Type\": \"application/json\"};"
			+ "msg.payload = bool;\n"
			+ "return msg;";
	
	/**
	 * Generates the JavaScript implementation of the "greater than" node
	 * 
	 * @param comparisonValue
	 *            the value to be compared
	 * 
	 * @return the node as JSON string
	 */
	public static String getGREATERTHANNode(List<String> conditionValues, String objectID, String situationTemplateID, String sensorId, String sensorQuality, String quality) {
		return String.format(compareString, sensorId, ">", conditionValues.get(0));
	}

	/**
	 * Generates the JavaScript implementation of the "lower than" node
	 * 
	 * @param comparisonValue
	 *            the value to be compared
	 * 
	 * @return the node as JSON string
	 */
	public static String getLOWERTHANNode(List<String> conditionValues, String objectID, String situationTemplateID, String sensorId, String sensorQuality, String quality) {
		return String.format(compareString, sensorId, "<", conditionValues.get(0));
	}

	/**
	 * Generates the JavaScript implementation of the "equals" node
	 * 
	 * @param comparisonValue
	 *            the value to be compared
	 * 
	 * @return the node as JSON string
	 */
	public static String getEQUALSNode(List<String> conditionValues, String objectID, String situationTemplateID, String sensorId, String sensorQuality, String quality) {
		return String.format(compareString, sensorId, "==", conditionValues.get(0));
	}

	/**
	 * Generates the JavaScript implementation of the "status code" node
	 * 
	 * @param conditionValue
	 * 			 the status code to be checked
	 * 
	 * @return the node in JSON
	 */
	public static String getNOTEQUALSNode(List<String> conditionValues, String objectID, String situationTemplateID, String sensorId, String sensorQuality, String quality) {
		return String.format(statusCodeString, sensorId, "!=", conditionValues.get(0));
	}
	
	/**
	 * Generates the JavaScript implementation of the "between" node
	 * 
	 * @param conditionValues
	 * 			 the status code to be checked
	 * 
	 * @return the node in JSON
	 */
	public static Object getBETWEENNode(List<String> conditionValues, String objectID, String situationTemplateID, String sensorId, String sensorQuality, String quality) {
		
		String condValue1 = conditionValues.get(0);
		String condValue2 = conditionValues.get(1);
		
		return String.format(betweenString, sensorId, condValue1, condValue2);
	}
	
	/**
	 * Generates the JavaScript implementation of the "AND" node
	 * 
	 * @return the AND Node in JavaScript
	 */
	public static String getANDNode(String numberOfInputs, String objectID, String situationTemplateID, ObjectIdSensorIdMapping mapping) {
		final String immediateReturnValue = "if (context.values[context.values.length - 1 - i]) {\n"
				+ "      counter++;\n"
				+ "    }\n"
				+ "    returnValue = counter == " + numberOfInputs + ";\n";
        String things = mapping.getObjects();
        if (things.equals("")) {
            things = "\'" + objectID + "\'";
        }
        return String.format(accumulationString, numberOfInputs, immediateReturnValue, things, situationTemplateID, things, situationTemplateID);
	}
	
	/**
	 * Generates the JavaScript implementation of the "OR" node
	 * 
	 * @return the OR Node in JavaScript
	 */
	
	public static Object getORNode(String numberOfInputs, String objectID, String situationTemplateID, ObjectIdSensorIdMapping mapping) {
		final String immediateReturnValue = "if (context.values[i]) {\n	  		counter++;}\n                returnValue = counter >= 1;\n";
        String things = mapping.getObjects();
        if (things.equals("")) {
            things = "\'" + objectID + "\'";
        }
        return String.format(accumulationString, numberOfInputs, immediateReturnValue, things, situationTemplateID, things, situationTemplateID);
	}
	
	/**
	 * Generates the JavaScript implementation of the "XOR" node
	 * 
	 * @return the XOR Node in JavaScript
	 */
	public static Object getXORNode(String numberOfInputs, String objectID, String situationTemplateID, ObjectIdSensorIdMapping mapping) {
		final String immediateReturnValue = "if (!context.values[i]) {\n            counter++;}\n            returnValue = counter == 1;\n";
        String things = mapping.getObjects();
        if (things.equals("")) {
            things = '\'' + objectID + '\'';
        }
        return String.format(accumulationString, numberOfInputs, immediateReturnValue, things, situationTemplateID, things, situationTemplateID);
	}
	
	/**
	 * Generates the JavaScript implementation of the "AND" node
	 * 
	 * @return the AND Node in JavaScript
	 */
	public static String getANDNotNode(String numberOfInputs, String objectID, String situationTemplateID, ObjectIdSensorIdMapping mapping) {
		final String immediateReturnValue = "if (context.values[i]) {\n	  		counter++;}\n            returnValue = counter < " + numberOfInputs + ";\n";
        String things = mapping.getObjects();
        if (things.equals("")) {
            things = '\'' + objectID + '\'';
        }
        return String.format(accumulationString, numberOfInputs, immediateReturnValue, things, situationTemplateID, things, situationTemplateID);
	}
	
	/**
	 * Generates the JavaScript implementation of the "OR" node
	 * 
	 * @return the OR Node in JavaScript
	 */
	public static Object getORNotNode(String numberOfInputs, String objectID, String situationTemplateID, ObjectIdSensorIdMapping mapping) {
		final String immediateReturnValue = "if (context.values[i]) {\n	  		counter++;}\n            returnValue = counter == 0;\n";
        String things = mapping.getObjects();
        if (things.equals("")) {
            things = '\'' + objectID + '\'';
        }
        return String.format(accumulationString, numberOfInputs, immediateReturnValue, things, situationTemplateID, things, situationTemplateID);
	}
	
	/**
	 * Generates the JavaScript implementation of the "XOR" node
	 * 
	 * @return the XOR Node in JavaScript
	 */
	public static Object getXORNotNode(String numberOfInputs, String objectID, String situationTemplateID, ObjectIdSensorIdMapping mapping) {
		final String immediateReturnValue = "if (context.values[i]) {\n            counter++;}\n            returnValue = counter != 1;\n";
		String things = mapping.getObjects();
		if (things.equals("")) {
		    things = '\'' + objectID + '\'';
		}
		return String.format(accumulationString, numberOfInputs, immediateReturnValue, things, situationTemplateID, things, situationTemplateID);
	}
	
	/**
	 * Generates the JavaScript implementation of the "Average" node
	 * 
	 * @return the Average Node in JavaScript
	 */
	public static Object getAVERAGENode(String intervals, String value, String objectID, String situationTemplateID, ObjectIdSensorIdMapping mapping) {
		final String immediateReturnValue = 
	                    "    counter += parseInt(context.values[i]);\n"
	                    + "    returnValue = counter / (max - min);\n";
        final String things = mapping.getObjects();
        
        return String.format(timeString, intervals, value, immediateReturnValue, things.equals("") ? ('\'' + objectID + '\'') : things, things.equals("") ? ('\'' + objectID + '\'') : things);
	}

	/**
	 * Generates the JavaScript implementation of the "Min" node
	 * 
	 * @return the Min Node in JavaScript
	 */
	public static Object getMINNode(String intervals, String value, String objectID, String situationTemplateID, ObjectIdSensorIdMapping mapping) {
		final String immediateReturnValue = 
				"    if (context.min > context.values[i]) {\n"
				+ "        context.min = context.values[i];\n"
				+ "    }\n"
				+ "    returnValue = context.max;\n";

        final String things = mapping.getObjects();
        
        return String.format(timeString, intervals, value, immediateReturnValue, things.equals("") ? ('\'' + objectID + '\'') : things, things.equals("") ? ('\'' + objectID + '\'') : things);
	}

	/**
	 * Generates the JavaScript implementation of the "Max" node
	 * 
	 * @return the Max Node in JavaScript
	 */
	public static Object getMAXNode(String intervals, String value, String objectID, String situationTemplateID, ObjectIdSensorIdMapping mapping) {
		final String immediateReturnValue = 
				"    if (context.max < context.values[i]) {\n"
				+ "        context.max = context.values[i];\n"
				+ "    }\n"
				+ "    returnValue = context.max;\n";

        final String things = mapping.getObjects();
        
        return String.format(timeString, intervals, value, immediateReturnValue, things.equals("") ? ('\'' + objectID + '\'') : things, things.equals("") ? ('\'' + objectID + '\'') : things);
	}

	/**
	 * Generates the JavaScript implementation of the "intervalMinEqual" node
	 * 
	 * @return the Interval Node in JavaScript
	 */
	public static Object getINTERVALMINEQUALNode(String intervals, String value, String objectID, String situationTemplateID, ObjectIdSensorIdMapping mapping) {
		final String immediateReturnValue = 
				"    if (context.values[i] == true) {\n"
				+ "        counter++;\n"
				+ "    }\n"
				+ "    returnValue = counter >= intervals;\n";

        final String things = mapping.getObjects();
        
        return String.format(timeString, intervals, value, immediateReturnValue, things.equals("") ? ('\'' + objectID + '\'') : things, things.equals("") ? ('\'' + objectID + '\'') : things);
	}
	
	/**
	 * Generates the JavaScript implementation of the "intervalMin" node
	 * 
	 * @return the Interval Node in JavaScript
	 */
	public static Object getINTERVALMINNode(String intervals, String value, String objectID, String situationTemplateID, ObjectIdSensorIdMapping mapping) {
		final String immediateReturnValue = 
				"    if (context.values[i] == true) {\n"
				+ "        counter++;\n"
				+ "    }\n"
				+ "    returnValue = counter > intervals;\n";

        final String things = mapping.getObjects();
        
        return String.format(timeString, intervals, value, immediateReturnValue, things.equals("") ? ('\'' + objectID + '\'') : things, things.equals("") ? ('\'' + objectID + '\'') : things);
	}
	
	/**
	 * Generates the JavaScript implementation of the "intervalMaxEqual" node
	 * 
	 * @return the Interval Node in JavaScript
	 */
	public static Object getINTERVALMAXEQUALNode(String intervals, String value, String objectID, String situationTemplateID, ObjectIdSensorIdMapping mapping) {
		final String immediateReturnValue = 
				"    if (context.values[i] == true) {\n"
				+ "        counter++;\n"
				+ "    }\n"
				+ "    returnValue = counter <= intervals;\n";

        final String things = mapping.getObjects();
        
        return String.format(timeString, intervals, value, immediateReturnValue, things.equals("") ? ('\'' + objectID + '\'') : things, things.equals("") ? ('\'' + objectID + '\'') : things);
	}
	
	/**
	 * Generates the JavaScript implementation of the "intervalMax" node
	 * 
	 * @return the Interval Node in JavaScript
	 */
	public static Object getINTERVALMAXNode(String intervals, String value, String objectID, String situationTemplateID, ObjectIdSensorIdMapping mapping) {
		final String immediateReturnValue = 
				"    if (context.values[i] == true) {\n"
				+ "        counter++;\n"
				+ "    }\n"
				+ "    returnValue = counter < intervals;\n";
		
		final String things = mapping.getObjects();
		
		return String.format(timeString, intervals, value, immediateReturnValue, things.equals("") ? ('\'' + objectID + '\'') : things, things.equals("") ? ('\'' + objectID + '\'') : things);
	}

	/**
	 * Generates the JavaScript implementation of the "sensorEquals" node
	 * 
	 * @return the sensor Node in JavaScript
	 */
	public static Object getSENSOREQUALSNode(ArrayList<TContextNode> contextNodes, String value, String objectID, String situationTemplateID) {
		String indexMapping = mapIndex(contextNodes);
		return String.format(sensorComparisonString, indexMapping, contextNodes.size(), contextNodes.size(), "==");
	}

	/**
	 * Generates the JavaScript implementation of the "sensorLowerThan" node
	 * 
	 * @return the sensor Node in JavaScript
	 */
	public static Object getSENSORLOWERTHANNode(ArrayList<TContextNode> contextNodes, String value, String objectID, String situationTemplateID) {
		String indexMapping = mapIndex(contextNodes);
		return String.format(sensorComparisonString, indexMapping, contextNodes.size(), contextNodes.size(), "<");
	}

	/**
	 * Generates the JavaScript implementation of the "sensorGreaterThan" node
	 * 
	 * @return the sensor Node in JavaScript
	 */
	public static Object getSENSORGREATERTHANNode(ArrayList<TContextNode> contextNodes, String value, String objectID, String situationTemplateID) {
		String indexMapping = mapIndex(contextNodes);
		return String.format(sensorComparisonString, indexMapping, contextNodes.size(), contextNodes.size(), ">");
	}

	/**
	 * Makes the index mapping for the sensor nodes.
	 * 
	 * @param contextNodes the sensors which are the input for the conditionNode
	 * @return String mapping each sensor to an id.
	 */
	private static String mapIndex(ArrayList<TContextNode> contextNodes) {
		int index = 0;
		StringBuilder builder = new StringBuilder();
		for (int i = 0; i < contextNodes.size(); i++) {
			if (i == 0) {
				builder.append("if (obj.sensor == \"");
			} else {
				builder.append("} else if (obj.sensor == \"");
			}
			builder.append(contextNodes.get(i).getName());
			builder.append("\") {\n    index = ");
			builder.append(index);
			index++;
			builder.append(";\n");
		}
		builder.append('}');
		return builder.toString();
	}
}
