package mapping;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import javax.management.RuntimeErrorException;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import constants.Nodes;
import constants.Properties;
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
	public JSONArray mapOperationNodes(TSituationTemplate situationTemplate, JSONArray nodeREDModel, String objectID) {
		
		// TODO those are just random values, write style function!
		int xCoordinate = 900;
		int yCoordinate = 50;

		// the z coordinate is used to assign the nodes to a corresponding sheet
		String zCoordinate = situationTemplate.getId();

		// get the number of children of the operation node
		int children = 0;
		for (TSituation situation : situationTemplate.getSituation()) {
		for (TOperationNode logicNode : situation.getOperationNode()) {
			for (TConditionNode node: situation.getConditionNode()) {
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
			Method m;
			
			try {
				m = Nodes.class.getMethod("get" + logicNode.getType().toUpperCase() + (logicNode.isNegated() ? "Not" : "") + "Node", String.class, String.class, String.class);
			} catch (NoSuchMethodException | SecurityException e) {
				e.printStackTrace();
				throw new RuntimeException(e);
			}
			
			try {
				nodeREDNode.put("func", m.invoke(null, Integer.toString(children), objectID, situationTemplate.getId()));
			} catch (IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
				e.printStackTrace();
				throw new RuntimeException(e);
			}
			
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
						debugNode.put("name", situationTemplate.getName());
						nodeREDModel.add(debugNode);

						// create the corresponding NodeRED JSON node
						JSONObject httpNode = NodeREDUtils.createNodeREDNode(NodeREDUtils.generateNodeREDId(), "situation", "http request", Integer.toString(200), Integer.toString(200), zCoordinate);
						httpNode.put("method", "POST");
						
						StringBuilder builder = new StringBuilder();
						builder.append(Properties.getSituationProtocol());
						builder.append("://");
						builder.append(Properties.getSituationServer());
						builder.append(":");
						builder.append(Properties.getSituationPort());
						if (!Properties.getSituationPath().startsWith("/")) {
							builder.append("/");
						}
						builder.append(Properties.getSituationPath());
						
						httpNode.put("url", builder.toString());
				
						JSONArray httpConn = new JSONArray();
						JSONArray httpWires = new JSONArray();
						httpConn.add(debugNode.get("id"));
						httpWires.add(httpConn);
						httpNode.put("wires", httpWires);
						
						connections.add(httpNode.get("id"));
						
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
		}
		
		return nodeREDModel;
	}
}
