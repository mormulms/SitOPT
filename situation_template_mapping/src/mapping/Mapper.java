package mapping;

import java.sql.Timestamp;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import situationtemplate.model.TSituationNode;
import situationtemplate.model.TSituationTemplate;
import utils.IOUtils;
import utils.NodeREDUtils;

import java.sql.Timestamp;
import java.util.Date;

/**
 * This is the entry point of the rule-based mapping library. The pattern-based
 * model will be transformed into a Node-RED-processable model.
 *
 */
public class Mapper {

	/**
	 * The situation template to be mapped
	 */
	TSituationTemplate situationTemplate;

	/**
	 * Class constructor
	 * 
	 * @param situation
	 * 			 instance of the situation template
	 */
	public Mapper(TSituationTemplate situation) {
		this.situationTemplate = situation;
	}

	/**
	 * Main class of the mapping that receives the pattern-based model as XML
	 * and invokes methods to transform it into an executable model in JSON.
	 * 
	 * @param url
	 * 				 the URL of the machine 
	 * @param debug 
	 */
	@SuppressWarnings("unchecked")
	public void map(boolean doOverwrite, String url, long timestamp, boolean debug) {
		try {

			JSONArray nodeREDModel = new JSONArray();
			
			JSONObject debugNode = NodeREDUtils.generateDebugNode("100", "100", situationTemplate.getId());
			debugNode.put("name", "begin" + situationTemplate.getId());
			
			nodeREDModel.add(debugNode);
			
			// each NodeRED flow needs an inject input node, which is generated and added at this point
			JSONObject input = NodeREDUtils.generateInputNode(situationTemplate.getId(), situationTemplate, debugNode);
			nodeREDModel.add(input);

			// first, map all the operation nodes, then map the other nodes
			OperationNodeMapper lnm = new OperationNodeMapper();
			lnm.mapOperationNodes(situationTemplate, nodeREDModel);
			
			ContextNodeMapper snm = new ContextNodeMapper();
			nodeREDModel = snm.mapContextNodes(situationTemplate, nodeREDModel, url, debug);
			
			ConditionNodeMapper nm = new ConditionNodeMapper();
			JSONArray finalModel = nm.mapConditionNodes(situationTemplate, nodeREDModel, debug);
						
			// write the JSON file (just for debug reasons), remember to change the path when using this method
			//IOUtils.writeJSONFile(finalModel, situationTemplate);
			
			java.util.Date beginDate= new java.util.Date();
//			System.out.println("Mapping Time: " + (date.getTime() - timestamp));	
			
			final long begin = beginDate.getTime();
			// deploy the flow to NodeRED
			IOUtils.deployToNodeRED(finalModel, situationTemplate, doOverwrite);
			
			Date endDate = new Date();
			System.out.println("Deploy Time: " + (begin-endDate.getTime()));
		} catch (ParseException e) {
			System.err.println("Could not parse JSON, an error occurred.");
			e.printStackTrace();
		}
	}
}
