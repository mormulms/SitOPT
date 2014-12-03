package mapping;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import situationtemplate.model.TLogicNode;
import situationtemplate.model.TNode;
import situationtemplate.model.TParent;
import situationtemplate.model.TSensorNode;
import situationtemplate.model.TSituationTemplate;
import utils.NodeREDUtils;

/**
 * This class maps sensor nodes to HTTP nodes in NodeRED
 */
public class SensorNodeMapper {

	/**
	 * constants
	 */
	public static final String TYPE = "http request";
	public static final String METHOD = "GET";

	/**
	 * Maps the sensor nodes to corresponding NodeRED nodes
	 * 
	 * @return the mapped JSON model
	 */
	@SuppressWarnings("unchecked")
	public JSONArray mapSensorNodes(TSituationTemplate situationTemplate, JSONArray nodeREDModel) {

		String url;

		int xCoordinate = 300;
		int yCoordinate = 50;
		// the z coordinate is used to assign the nodes to a corresponding sheet
		String zCoordinate = situationTemplate.getId();

		for (TSensorNode sensorNode : situationTemplate.getSituation().getSensorNode()) {

			// TODO: create real Registry
			url = MockUpRegistry.getURLForID(sensorNode.getName());

			// create the corresponding NodeRED JSON node
			JSONObject nodeREDNode = NodeREDUtils.createNodeREDNode(situationTemplate.getId() + "." + sensorNode.getId(), sensorNode.getName(), TYPE, Integer.toString(xCoordinate), Integer.toString(yCoordinate), zCoordinate);
			nodeREDNode.put("method", METHOD);
			nodeREDNode.put("url", url);

			// now connect the node to the flow
			JSONArray wiresNode = new JSONArray();
			JSONArray connections = new JSONArray();

			// map the sensor node to a debug node
			// TODO X/Y coordinates
			JSONObject debugNode = NodeREDUtils.generateDebugNode("600", "500", zCoordinate);
			nodeREDModel.add(debugNode);
			connections.add(debugNode.get("id"));

			// connect to the parents
			for (TParent parent : sensorNode.getParent()) {
				if (parent.getParentID() instanceof TNode) {
					connections.add(situationTemplate.getId() + "." +((TNode) parent.getParentID()).getId());
				} else if (parent.getParentID() instanceof TLogicNode) {
					connections.add(situationTemplate.getId() + "." +((TLogicNode) parent.getParentID()).getId());
				}
			}

			wiresNode.add(connections);

			nodeREDNode.put("wires", wiresNode);
			nodeREDModel.add(nodeREDNode);

			yCoordinate += 100;
		}

		return nodeREDModel;
	}
}
