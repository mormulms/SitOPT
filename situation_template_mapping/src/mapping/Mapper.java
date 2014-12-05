package mapping;

import javax.swing.tree.TreeNode;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import situationtemplate.model.TSituationNode;
import situationtemplate.model.TSituationTemplate;
import utils.IOUtils;
import utils.NodeREDUtils;

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
	 */
	@SuppressWarnings("unchecked")
	public void map(boolean doOverwrite, String url) {
		try {

			JSONArray nodeREDModel = new JSONArray();

			// each NodeRED flow needs an inject input node, which is generated and added at this point
			JSONObject input = NodeREDUtils.generateInputNode(situationTemplate.getId(), situationTemplate);
			nodeREDModel.add(input);

			// first, map all the logic patterns, then map the other nodes
			OperationNodeMapper lnm = new OperationNodeMapper();
			lnm.mapOperationNodes(situationTemplate, nodeREDModel);
			
			ContextNodeMapper snm = new ContextNodeMapper();
			nodeREDModel = snm.mapContextNodes(situationTemplate, nodeREDModel, url);
			
			ConditionNodeMapper nm = new ConditionNodeMapper();
			JSONArray finalModel = nm.mapNodes(situationTemplate, nodeREDModel);
			
			// write the JSON file (just for debug reasons), remember to change the path when using this method
			//IOUtils.writeJSONFile(finalModel, situationTemplate);
						
			// deploy the flow to NodeRED
			IOUtils.deployToNodeRED(finalModel, situationTemplate, doOverwrite);
			
		} catch (ParseException e) {
			System.err.println("Could not parse JSON, an error occurred.");
			e.printStackTrace();
		}
	}
}
