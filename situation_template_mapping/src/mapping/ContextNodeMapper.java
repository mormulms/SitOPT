package mapping;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import constants.Properties;
import situationtemplate.model.TConditionNode;
import situationtemplate.model.TContextNode;
import situationtemplate.model.TOperationNode;
import situationtemplate.model.TParent;
import situationtemplate.model.TSituation;
import situationtemplate.model.TSituationTemplate;
import utils.NodeREDUtils;

/**
 * This class maps context nodes to HTTP nodes in NodeRED
 */
public class ContextNodeMapper {

	/**
	 * constants
	 */
	public static final String TYPE = "http request";
	public static final String METHOD = "GET";

	/**
	 * Maps the context nodes to corresponding NodeRED nodes
	 * 
	 * @param situationTemplate
	 * 				 the situation template JAXB node
	 * @param nodeREDModel
	 * 				 the Node-RED flow as JSON
	 * @param objectID
	 * 				 the URL of the machine
	 * 
	 * @return the mapped JSON model
	 */
	@SuppressWarnings("unchecked")
	public JSONArray mapContextNodes(TSituationTemplate situationTemplate, JSONArray nodeREDModel, String objectID, boolean debug) {

		int xCoordinate = 300;
		int yCoordinate = 50;
		// the z coordinate is used to assign the nodes to a corresponding sheet
		String zCoordinate = situationTemplate.getId();

		String url = "";
		StringBuilder builder = new StringBuilder();
		builder.append(Properties.getResourceProtocol());
		builder.append("://");
		builder.append(Properties.getResourceServer());
		builder.append(':');
		builder.append(Properties.getResourcePort());
		builder.append(builder.charAt(builder.length() - 1) == '/' ? "" : '/');
		builder.append("rmp/sensordata/");
		url = builder.toString();	

		for (TSituation situation : situationTemplate.getSituation()) {
			for (TContextNode sensorNode : situation.getContextNode()) {
				Properties.getContextNodes().add(sensorNode);

				String sensorURL = url +  objectID + "/" + sensorNode.getName();

				// create the corresponding NodeRED JSON node
				JSONObject nodeREDNode = NodeREDUtils.createNodeREDNode(situationTemplate.getId() + "." + sensorNode.getId(), sensorNode.getName(), TYPE, Integer.toString(xCoordinate), Integer.toString(yCoordinate), zCoordinate);
				nodeREDNode.put("method", METHOD);
				nodeREDNode.put("url", sensorURL);

				// now connect the node to the flow
				JSONArray wiresNode = new JSONArray();
				JSONArray connections = new JSONArray();

				if (debug) {
					// map the sensor node to a debug node
					// TODO X/Y coordinates
					JSONObject debugNode = NodeREDUtils.generateDebugNode("600", "500", zCoordinate);
					debugNode.put("name", sensorNode.getName());
					debugNode.put("console", "true");
					nodeREDModel.add(debugNode);
					connections.add(debugNode.get("id"));
				}
				// connect to the parents
				for (TParent parent : sensorNode.getParent()) {
					if (parent.getParentID() instanceof TConditionNode) {
						String a = ((TConditionNode)parent.getParentID()).getId();
						connections.add(situationTemplate.getId() + "." +((TConditionNode) parent.getParentID()).getId());
					} else if (parent.getParentID() instanceof TOperationNode) {
						connections.add(situationTemplate.getId() + "." +((TOperationNode) parent.getParentID()).getId());
					}
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
