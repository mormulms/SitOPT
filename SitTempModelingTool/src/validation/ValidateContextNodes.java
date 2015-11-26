package validation;

import model.TConditionNode;
import model.TContextNode;
import model.TOperationNode;
import model.TParent;
import model.TSituation;
import model.TSituationNode;
import model.TSituationTemplate;

public class ValidateContextNodes {
	
	/* Check if a context node has a forbidden parent node type. */
	public String checkParents(TSituationTemplate sitTemplate) {
		String errMsg = "";
		for (TSituation s : sitTemplate.getSituation()) {
			for (TContextNode cn : s.getContextNode()) {
				for (TParent p : cn.getParent()) {
					if (p.getParentID() instanceof TOperationNode) {
						errMsg += "ERROR! Context node \"" + cn.getName() + "\" must not be a child of an operation node.\n";
					} else if (p.getParentID() instanceof TSituationNode) {
						errMsg += "ERROR! Context node \"" + cn.getName() + "\" must not be a child of a situation node.\n";
					} else if (p.getParentID() instanceof TContextNode) {
						errMsg += "ERROR! Context node \"" + cn.getName() + "\" must not be a child of a context node.\n";						
					} else if (p.getParentID() instanceof TConditionNode) {
					} else {
						errMsg += "ERROR! Context node \"" + cn.getName() + "\" has a parent node with unknown type.\n";
					}
				}
			}
		}
		return errMsg;		
	}
	
	/* Check whether a context node has more than one parent node. */
	public String checkParentNumb(TSituationTemplate sitTemplate) {
		String errMsg = "";
		for (TSituation s : sitTemplate.getSituation()) {
			for (TContextNode cn : s.getContextNode()) {
				if (cn.getParent().size() > 1) {
					errMsg += "ERROR! Context node \"" + cn.getName() + "\" has " + cn.getParent().size() + " parent nodes. Required is exactly one parent node.\n";
				}
				else {
				}
			}
		}
		return errMsg;
	}
}