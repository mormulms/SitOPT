package mapping;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import constants.Nodes;
import situationtemplate.model.TConditionNode;
import situationtemplate.model.TOperationNode;
import situationtemplate.model.TParent;
import situationtemplate.model.TSituation;
import situationtemplate.model.TSituationNode;
import situationtemplate.model.TSituationTemplate;
import utils.NodeREDUtils;

/**
 * This class maps the operation nodes of the situation template to corresponding NodeRED implementations
 */
public class OperationNodeMapper {

	/**
	 * This method processes the mapping of operation nodes
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

		// get the number of children of the operation node
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
				nodeREDNode.put("func", Nodes.getANDNode(Integer.toString(children), "1", situationTemplate.getId()));
			} else {
				nodeREDNode.put("func", Nodes.getORNode(Integer.toString(children), "1", situationTemplate.getId()));
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
						
						JSONObject switchNode = NodeREDUtils.createNodeREDNode(NodeREDUtils.generateNodeREDId(), "switch", "switch", Integer.toString(500), Integer.toString(500), zCoordinate);
						switchNode.put("property", "payload");
						JSONArray rules = new JSONArray();
						JSONObject operators = new JSONObject();
						operators.put("t", "eq");
						operators.put("v", "true");
						rules.add(operators);
						switchNode.put("rules", rules);
						switchNode.put("checkall", "true");
						switchNode.put("outputs", 1);
						
						JSONArray httpConn = new JSONArray();
						JSONArray httpWires = new JSONArray();
						
						JSONObject debugNode = NodeREDUtils.generateDebugNode("600", "500", zCoordinate);
						debugNode.put("name", situationTemplate.getName());
						nodeREDModel.add(debugNode);

						// create the corresponding NodeRED JSON node
						JSONObject httpNode = NodeREDUtils.createNodeREDNode(NodeREDUtils.generateNodeREDId(), "situation", "http request", Integer.toString(200), Integer.toString(200), zCoordinate);
						httpNode.put("method", "POST");
						// TODO change URL
						httpNode.put("url", "192.168.209.200:2222/situations");
						connections.add(switchNode.get("id"));
						
						httpConn.add(httpNode.get("id"));
						httpWires.add(httpConn);
						switchNode.put("wires", httpWires);
						nodeREDModel.add(switchNode);
						
						JSONArray switchConn = new JSONArray();
						JSONArray switchWires = new JSONArray();
						switchConn.add(debugNode.get("id"));
						switchWires.add(switchConn);
						httpNode.put("wires", switchWires);
						nodeREDModel.add(httpNode);
					}
				}
			} else {
				JSONObject debugNode = NodeREDUtils.generateDebugNode("600", "500", zCoordinate);
				debugNode.put("name", situationTemplate.getName());
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
