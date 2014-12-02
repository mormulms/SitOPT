package constants;

import situationtemplate.model.TNode;
import utils.NodeREDUtils;

/**
 * This class offers methods to generate the Node-RED function nodes as JSON
 */
public class Nodes {

	/**
	 * Generates the "greater than" node as JSON object
	 * 
	 * @param comparisonValue
	 *            the value to be compared
	 * @param sheetId
	 * 			 the id of the sheet to be used
	 * @param node
	 * 			 the JAXB node
	 * 
	 * @return the node as JSON string
	 */
	public static String getGreaterThanNode(String comparisonValue, String sheetId, TNode node, String x, String y) {
		return "{\"id\":\""
				+ NodeREDUtils.generateNodeREDId()
				+ "\",\"type\":\"function\",\"name\":\"" + node.getName() + "\",\"func\":\"var curr = msg.payload;\n\nif (curr > "
				+ comparisonValue
				+ ") {\n\tmsg.payload = true;\n} else {\n\tmsg.payload = false;\n}\n\nreturn msg;\",\"outputs\":1,\"x\":" + x + ",\"y\":" + y + ",\"z\":\"" + sheetId + "\",\"wires\":[[]]}";
	}

	/**
	 * Generates the "lower than" node as JSON object
	 * 
	 * @param comparisonValue
	 *            the value to be compared
	 * @param sheetId
	 * 			 the id of the sheet to be used
	 * @param node
	 * 			 the JAXB node
	 * 
	 * @return the node as JSON string
	 */
	public static String getLowerThanNode(String comparisonValue, String sheetId, TNode node, String x, String y) {
		return "{\"id\":\""
				+ NodeREDUtils.generateNodeREDId()
				+ "\",\"type\":\"function\",\"name\":\"" + node.getName() + "\",\"func\":\"var curr = msg.payload;\n\nif (curr < "
				+ comparisonValue
				+ ") {\n\tmsg.payload = true;\n} else {\n\tmsg.payload = false;\n}\n\nreturn msg;\",\"outputs\":1,\"x\":" + x + ",\"y\":" + y + ",\"z\":\"" + sheetId + "\",\"wires\":[[]]}";
	}

	/**
	 * Generates the "equals" node as JSON object
	 * 
	 * @param comparisonValue
	 *            the value to be compared
	 * @param sheetId
	 * 			 the id of the sheet to be used
	 * @param node
	 * 			 the JAXB node
	 * 
	 * @return the node as JSON string
	 */
	public static String getEqualsNode(String comparisonValue, String sheetId, TNode node, String x, String y) {
		return "{\"id\":\""
				+ NodeREDUtils.generateNodeREDId()
				+ "\",\"type\":\"function\",\"name\":\"" + node.getName() + "\",\"func\":\"var curr = msg.payload;\n\nif (curr == "
				+ comparisonValue
				+ ") {\n\tmsg.payload = true;\n} else {\n\tmsg.payload = false;\n}\n\nreturn msg;\",\"outputs\":1,\"x\":" + x + ",\"y\":" + y + ",\"z\":\"" + sheetId + "\",\"wires\":[[]]}";
	}

	/**
	 * Generates the "status code" node as JSON object
	 * 
	 * @param conditionValues
	 * 			 the status code to be checked
	 * @param sheetId
	 * 			 the id of the sheet to be used
	 * @param node
	 * 			 the JAXB node
	 * @return the node in JSON
	 */
	public static String getNotStatusCodeNode(String conditionValues, String sheetId, TNode node, String x, String y) {
		return "{\"id\":\"" + NodeREDUtils.generateNodeREDId() + "\",\"type\":\"function\",\"name\":\"" + node.getName() + "\",\"func\":\"if (msg.statusCode == " + conditionValues + ") {\n  msg.payload = true;\n return msg;  \n} else {\n  msg.payload = false;\n return msg;\n}\n\nreturn null;\",\"outputs\":1,\"x\":" + x + ",\"y\":" + y + ",\"z\":\"" + sheetId + "\",\"wires\":[[]]}";
	}
	
	/**
	 * Generates the JavaScript code of the "AND" node
	 * 
	 * @return the AND Node in JavaScript
	 */
	public static String getANDNode(String numberOfInputs) {
		return "context.values = context.values || new Array();\ncontext.values.push(msg.payload);\n\nvar inputs = " + numberOfInputs + ";\nif (context.values.length == inputs) {\n  var returnValue = true;\n  for (var i = 0; i < context.values.length; i++) {\n\tif (!(context.values[i])) {\n\t  returnValue = false;\n\t}\n  }\n  msg.payload = returnValue; \n  context.values = null;\n  \n  return msg;\n} else {\n  return null;\n}\n\n";
	}
	
	/**
	 * Generates the JavaScript code of the "OR" node
	 * 
	 * @return the OR Node in JavaScript
	 */
	public static Object getORNode(String numberOfInputs) {
		return "context.values = context.values || new Array();\ncontext.values.push(msg.payload);\n\nvar inputs = " + numberOfInputs + ";\nif (context.values.length == inputs) {\n  var returnValue = false;\n  for (var i = 0; i < inputs; i++) {\n\tif (context.values[i]) {\n\t  returnValue = true;\n\t}\n  }\n\n  msg.payload = returnValue;\n  context.values = null;\n  \n  return msg;\n} else {\n  return null;\n}\n\n";
	}
}