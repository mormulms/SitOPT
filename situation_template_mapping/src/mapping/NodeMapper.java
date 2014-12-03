package mapping;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
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
			
			String conditionValues = node.getCondValue().getValue();
			JSONObject nodeREDNode = new JSONObject();
			nodeREDNode.put("id", situationTemplate.getId() + "." + node.getId());
			nodeREDNode.put("type", "function");
			nodeREDNode.put("name", node.getName());
			nodeREDNode.put("x", xCoordinate);
			nodeREDNode.put("y", yCoordinate);
			nodeREDNode.put("z", situationTemplate.getId());
			
			if (node.getOpType().equals("greaterThan")) {
				nodeREDNode.put("func", Nodes.getGreaterThanNode(conditionValues));
			} else if (node.getOpType().equals("lowerThan")) {
				nodeREDNode.put("func", Nodes.getLowerThanNode(conditionValues));
			} else if (node.getOpType().equals("equals")) {
				nodeREDNode.put("func", Nodes.getEqualsNode(conditionValues));
			} else if (node.getOpType().equals("notStatusCode")) {
				nodeREDNode.put("func", Nodes.getNotStatusCodeNode(conditionValues));
			}
		
			// connect node to the existing flow or to a debug node
			JSONArray wiresNode = new JSONArray();
			JSONArray connections = new JSONArray();

			// add parents
			for (TParent parent : node.getParent()) {
				if (parent.getParentID() instanceof TNode) {
					connections.add(situationTemplate.getId() + "." + ((TNode) parent.getParentID()).getId());
				} else if (parent.getParentID() instanceof TLogicNode) {
					connections.add(situationTemplate.getId() + "." +((TLogicNode) parent.getParentID()).getId());
				}
			}

			// also connect to a debug node
			JSONObject debugNode = NodeREDUtils.generateDebugNode("600", "500", situationTemplate.getId());
			nodeREDModel.add(debugNode);
			connections.add(debugNode.get("id"));
			wiresNode.add(connections);

			nodeREDNode.put("wires", wiresNode);

			nodeREDModel.add(nodeREDNode);
			yCoordinate += 100;
		}
		
		return nodeREDModel;
	}
}
