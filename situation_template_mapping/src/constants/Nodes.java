package constants;

import situationtemplate.model.TNode;
import utils.NodeREDUtils;

/**
 * Constants for the nodeRED function nodes
 */
public class Nodes {

	/**
	 * Returns the greater than node as JSON object
	 * 
	 * @param comparisonValue
	 *            the value to be compared
	 * @param sheetId
	 * 			 the id of the sheet to be used
	 * @param node
	 * 			 the JAXB node
	 * @return the node as JSON string
	 */
	public static String getGreaterThanNode(String comparisonValue, String sheetId, TNode node) {
		return "{\"id\":\""
				+ NodeREDUtils.generateNodeREDId()
				+ "\",\"type\":\"function\",\"name\":\"" + node.getName() + "\",\"func\":\"var curr = msg.payload;\n\nif (curr > "
				+ comparisonValue
				+ ") {\n\tmsg.payload = true;\n} else {\n\tmsg.payload = false;\n}\n\nreturn msg;\",\"outputs\":1,\"x\":252.11666870117188,\"y\":178.11666870117188,\"z\":\"" + sheetId + "\",\"wires\":[[]]}";
	}

	/**
	 * Returns the lower than node as JSON object
	 * 
	 * @param comparisonValue
	 *            the value to be compared
	 * @param sheetId
	 * 			 the id of the sheet to be used
	 * @param node
	 * 			 the JAXB node
	 * @return the node as JSON string
	 */
	public static String getLowerThanNode(String comparisonValue, String sheetId, TNode node) {
		return "{\"id\":\""
				+ NodeREDUtils.generateNodeREDId()
				+ "\",\"type\":\"function\",\"name\":\"" + node.getName() + "\",\"func\":\"var curr = msg.payload;\n\nif (curr < "
				+ comparisonValue
				+ ") {\n\tmsg.payload = true;\n} else {\n\tmsg.payload = false;\n}\n\nreturn msg;\",\"outputs\":1,\"x\":252.11666870117188,\"y\":178.11666870117188,\"z\":\"" + sheetId + "\",\"wires\":[[]]}";
	}

	/**
	 * Returns the equals node as JSON object
	 * 
	 * @param comparisonValue
	 *            the value to be compared
	 * @param sheetId
	 * 			 the id of the sheet to be used
	 * @param node
	 * 			 the JAXB node
	 * @return the node as JSON string
	 */
	public static String getEqualsNode(String comparisonValue, String sheetId, TNode node) {
		return "{\"id\":\""
				+ NodeREDUtils.generateNodeREDId()
				+ "\",\"type\":\"function\",\"name\":\"" + node.getName() + "\",\"func\":\"var curr = msg.payload;\n\nif (curr == "
				+ comparisonValue
				+ ") {\n\tmsg.payload = true;\n} else {\n\tmsg.payload = false;\n}\n\nreturn msg;\",\"outputs\":1,\"x\":252.11666870117188,\"y\":178.11666870117188,\"z\":\"" + sheetId + "\",\"wires\":[[]]}";
	}

	/**
	 * Generates the AND node as JSON
	 * 
	 * @return the AND Node as JSON
	 */
	public static String getANDNode(String numberOfInputs) {
		return "context.values = context.values || new Array();\ncontext.values.push(msg.payload);\n\nvar inputs = " + numberOfInputs + ";\nif (context.values.length == inputs) {\n  var returnValue = true;\n  for (var i = 0; i < context.values.length; i++) {\n\tif (!(context.values[i])) {\n\t  returnValue = false;\n\t}\n  }\n  msg.payload = returnValue; \n  context.values = null;\n  \n  return msg;\n} else {\n  return null;\n}\n\n";
	}
	
	/**
	 * Generates the OR node as JSON
	 * 
	 * @return the OR Node as JSON
	 */
	public static Object getORNode(String numberOfInputs) {
		return "context.values = context.values || new Array();\ncontext.values.push(msg.payload);\n\nvar inputs = " + numberOfInputs + ";\nif (context.values.length == inputs) {\n  var returnValue = false;\n  for (var i = 0; i < inputs; i++) {\n\tif (context.values[i]) {\n\t  returnValue = true;\n\t}\n  }\n\n  msg.payload = returnValue;\n  context.values = null;\n  \n  return msg;\n} else {\n  return null;\n}\n\n";
	}

	/**
	 * Generates the status code node
	 * 
	 * @param conditionValues
	 * 			 the status code to be checked
	 * @param sheetId
	 * 			 the id of the sheet to be used
	 * @param node
	 * 			 the JAXB node
	 * @return the node in JSON
	 */
	public static String getNotStatusCodeNode(String conditionValues, String sheetId, TNode node) {
		return "{\"id\":\"" + NodeREDUtils.generateNodeREDId() + "\",\"type\":\"function\",\"name\":\"" + node.getName() + "\",\"func\":\"if (msg.statusCode == " + conditionValues + ") {\n  return true;  \n} else {\n  return false;\n}\n\nreturn null;\",\"outputs\":1,\"x\":181.11666870117188,\"y\":152.11666870117188,\"z\":\"" + sheetId + "\",\"wires\":[[]]}";
	}	
}