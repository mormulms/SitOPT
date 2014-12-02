package mapping;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import constants.Nodes;
import situationtemplate.model.TLogicNode;
import situationtemplate.model.TNode;
import situationtemplate.model.TParent;
import situationtemplate.model.TSituationTemplate;
import utils.NodeREDUtils;

/**
 * This class maps the operational nodes from the situation template to
 * corresponding Node-RED nodes.
 */
public class NodeMapper {

	/**
	 * This method processes the mapping of operational nodes.
	 * 
	 * @param situationTemplate
	 *            the situation template to be mapped
	 * @param nodeREDModel
	 *            the nodeREDModel in JSON to be extended
	 *            
	 * @return the mapped model
	 * 
	 * @throws ParseException
	 *             this exception occurs if the JSON can't be parsed
	 */
	@SuppressWarnings("unchecked")
	public JSONArray mapNodes(TSituationTemplate situationTemplate, JSONArray nodeREDModel) throws ParseException {

		String xCoordinate = "600";
		int yCoordinate = 50;
		
		for (TNode node : situationTemplate.getSituation().getNode()) {
			
			JSONObject functionNodeAsJSON = null;
			
			if (node.getOpType().equals("greaterThan")) {
				String conditionValues = node.getCondValue().getValue();

				JSONParser parser = new JSONParser();
				functionNodeAsJSON = (JSONObject) parser.parse(Nodes.getGreaterThanNode(conditionValues, situationTemplate.getId(), node, xCoordinate, Integer.toString(yCoordinate)));

				String functionContent = (String) functionNodeAsJSON.get("func");
				functionContent = "var comparisonValue = " + conditionValues + ";\n" + functionContent;

				functionNodeAsJSON.remove("func");
				functionNodeAsJSON.put("func", functionContent);
				functionNodeAsJSON.put("id", node.getId());
			} else if (node.getOpType().equals("lowerThan")) {
				String conditionValues = node.getCondValue().getValue();

				JSONParser parser = new JSONParser();
				functionNodeAsJSON = (JSONObject) parser.parse(Nodes.getLowerThanNode(conditionValues, situationTemplate.getId(), node, xCoordinate, Integer.toString(yCoordinate)));

				String functionContent = (String) functionNodeAsJSON.get("func");
				functionContent = "var comparisonValue = " + conditionValues + ";\n" + functionContent;

				functionNodeAsJSON.remove("func");
				functionNodeAsJSON.put("func", functionContent);
				functionNodeAsJSON.put("id", node.getId());				
			} else if (node.getOpType().equals("equals")) {
				String conditionValues = node.getCondValue().getValue();

				JSONParser parser = new JSONParser();
				functionNodeAsJSON = (JSONObject) parser.parse(Nodes.getEqualsNode(conditionValues, situationTemplate.getId(), node, xCoordinate, Integer.toString(yCoordinate)));

				String functionContent = (String) functionNodeAsJSON.get("func");
				functionContent = "var comparisonValue = " + conditionValues + ";\n" + functionContent;

				functionNodeAsJSON.remove("func");
				functionNodeAsJSON.put("func", functionContent);
				functionNodeAsJSON.put("id", node.getId());				
			} else if (node.getOpType().equals("notStatusCode")) {
				String conditionValues = node.getCondValue().getValue();

				JSONParser parser = new JSONParser();
				functionNodeAsJSON = (JSONObject) parser.parse(Nodes.getNotStatusCodeNode(conditionValues, situationTemplate.getId(), node, xCoordinate, Integer.toString(yCoordinate)));

				String functionContent = (String) functionNodeAsJSON.get("func");
				functionContent = "var comparisonValue = " + conditionValues + ";\n" + functionContent;

				functionNodeAsJSON.remove("func");
				functionNodeAsJSON.put("func", functionContent);
				functionNodeAsJSON.put("id", node.getId());		
			}
			
			// connect node to the existing flow or to a debug node
			JSONArray wiresNode = (JSONArray) functionNodeAsJSON.get("wires");
			wiresNode.clear();
			JSONArray connections = new JSONArray();

			for (TParent parent : node.getParent()) {
				if (parent.getParentID() instanceof TNode) {
					connections.add(((TNode) parent.getParentID()).getId());
				} else if (parent.getParentID() instanceof TLogicNode) {
					connections.add(((TLogicNode) parent.getParentID()).getId());
				}
			}

			// also connect to a debug node
			JSONObject debugNode = NodeREDUtils.generateDebugNode("600", "500", situationTemplate.getId());
			nodeREDModel.add(debugNode);
			connections.add(debugNode.get("id"));
			wiresNode.add(connections);

			functionNodeAsJSON.put("wires", wiresNode);

			nodeREDModel.add(functionNodeAsJSON);
			yCoordinate += 100;
		}
		
		return nodeREDModel;
	}
}
