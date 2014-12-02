package mapping;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import constants.Nodes;
import situationtemplate.model.TLogicNode;
import situationtemplate.model.TNode;
import situationtemplate.model.TParent;
import situationtemplate.model.TSituationTemplate;
import utils.NodeREDUtils;

/**
 * This class maps the logic nodes of the situation template to corresponding NodeRED implementations
 */
public class LogicNodeMapper {

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
	public JSONArray mapLogicNodes(TSituationTemplate situationTemplate, JSONArray nodeREDModel) {
		
		// TODO those are just random values, write style function!
		int xCoordinate = 900;
		int yCoordinate = 50;

		// the z coordinate is used to assign the nodes to a corresponding sheet
		String zCoordinate = situationTemplate.getId();

		// get the number of children of the logic node
		int children = 0;
		for (TLogicNode logicNode : situationTemplate.getSituation().getLogicNode()) {
			for (TNode node: situationTemplate.getSituation().getNode()) {
				for (TParent parent: node.getParent()) {
					
					if (parent.getParentID() instanceof TNode) {
						if (((TNode) parent.getParentID()).getId().equals(logicNode.getId())) {
							children++;
						}
					} else if (parent.getParentID() instanceof TLogicNode) {
						if (((TLogicNode) parent.getParentID()).getId().equals(logicNode.getId())) {
							children++;
						}
					}
				}
			}

			// create the comparison node in NodeRED
			JSONObject nodeREDNode = new JSONObject();
			nodeREDNode.put("id", logicNode.getId());
			nodeREDNode.put("type", "function");
			if (logicNode.getType().equals("and")) {
				nodeREDNode.put("name", logicNode.getName());
				nodeREDNode.put("func", Nodes.getANDNode(Integer.toString(children)));
			} else {
				nodeREDNode.put("name", logicNode.getName());
				nodeREDNode.put("func", Nodes.getORNode(Integer.toString(children)));
			}
			nodeREDNode.put("outputs", "1");
			nodeREDNode.put("x", xCoordinate);
			nodeREDNode.put("y", yCoordinate);
			nodeREDNode.put("z", zCoordinate);
			
			// connect it to the parent
			JSONArray wiresNode = new JSONArray();
			JSONArray connections = new JSONArray();
			
			if (!logicNode.getParent().isEmpty()) {
				for (TParent parent: logicNode.getParent()) {
					if (parent.getParentID() instanceof TNode) {
						String parentId = ((TNode) parent.getParentID()).getId();
						connections.add(parentId);
					} else if (parent.getParentID() instanceof TLogicNode) {
						String parentId = ((TLogicNode) parent.getParentID()).getId();
						connections.add(parentId);
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
