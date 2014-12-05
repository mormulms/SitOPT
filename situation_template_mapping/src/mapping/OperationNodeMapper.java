package mapping;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import constants.Nodes;
import situationtemplate.model.TConditionNode;
import situationtemplate.model.TOperationNode;
import situationtemplate.model.TParent;
import situationtemplate.model.TSituationNode;
import situationtemplate.model.TSituationTemplate;
import utils.NodeREDUtils;

/**
 * This class maps the logic nodes of the situation template to corresponding NodeRED implementations
 */
public class OperationNodeMapper {

	/**
	 * This method processes the mapping of logic nodes
	 * 
	 * @param situationTemplate
	 * 			 the situation template to be mapped
	 * @param nodeREDModel
	 * 			 the existing flow defined in NodeRed JSON
	 * 
	 * @return the mapped model
	 */
	@SuppressWarnings("unchecked")
	public JSONArray mapOperationNodes(TSituationTemplate situationTemplate, JSONArray nodeREDModel) {
		
		// TODO those are just random values, write style function!
		int xCoordinate = 900;
		int yCoordinate = 50;

		// the z coordinate is used to assign the nodes to a corresponding sheet
		String zCoordinate = situationTemplate.getId();

		// get the number of children of the logic node
		int children = 0;
		for (TOperationNode logicNode : situationTemplate.getSituation().getOperationNode()) {
			for (TConditionNode node: situationTemplate.getSituation().getConditionNode()) {
				for (TParent parent: node.getParent()) {
					
					if (parent.getParentID() instanceof TConditionNode) {
						if (((TConditionNode) parent.getParentID()).getId().equals(logicNode.getId())) {
							children++;
						}
					} else if (parent.getParentID() instanceof TOperationNode) {
						if (((TOperationNode) parent.getParentID()).getId().equals(logicNode.getId())) {
							children++;
						}
					}
				}
			}

			// create the comparison node in NodeRED
			JSONObject nodeREDNode = NodeREDUtils.createNodeREDNode(situationTemplate.getId() + "." + logicNode.getId(), logicNode.getName(), "function", Integer.toString(xCoordinate), Integer.toString(yCoordinate), zCoordinate);

			if (logicNode.getType().equals("and")) {
				nodeREDNode.put("func", Nodes.getANDNode(Integer.toString(children)));
			} else {
				nodeREDNode.put("func", Nodes.getORNode(Integer.toString(children)));
			}
			nodeREDNode.put("outputs", "1");
			
			// connect it to the parent(s)
			JSONArray wiresNode = new JSONArray();
			JSONArray connections = new JSONArray();
			
			if (!logicNode.getParent().isEmpty()) {
				for (TParent parent: logicNode.getParent()) {
					if (parent.getParentID() instanceof TConditionNode) {
						String parentId = ((TConditionNode) parent.getParentID()).getId();
						connections.add(situationTemplate.getId() + "." + parentId);
					} else if (parent.getParentID() instanceof TOperationNode) {
						String parentId = ((TOperationNode) parent.getParentID()).getId();
						connections.add(situationTemplate.getId() + "." + parentId);
					} else if (parent.getParentID() instanceof TSituationNode) {
						JSONObject debugNode = NodeREDUtils.generateDebugNode("600", "500", zCoordinate);
						nodeREDModel.add(debugNode);
						connections.add(debugNode.get("id"));
					} 
				}
			} else {
				JSONObject debugNode = NodeREDUtils.generateDebugNode("600", "500", zCoordinate);
				nodeREDModel.add(debugNode);
				connections.add(debugNode.get("id"));
			}
			
			wiresNode.add(connections);
			nodeREDNode.put("wires", wiresNode);
			nodeREDModel.add(nodeREDNode);
			
			yCoordinate += 100;
		}
		
		return nodeREDModel;
	}
}
