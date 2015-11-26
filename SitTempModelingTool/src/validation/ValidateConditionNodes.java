package validation;

import java.util.ArrayList;
import java.util.List;

import model.TConditionNode;
import model.TContextNode;
import model.TOperationNode;
import model.TParent;
import model.TSituation;
import model.TSituationNode;
import model.TSituationTemplate;

public class ValidateConditionNodes {
	
	/* Check if a condition node has a forbidden parent node type. */
	public String checkParents(TSituationTemplate sitTemplate) {
		String errMsg = "";
		for (TSituation s : sitTemplate.getSituation()) {
			for (TConditionNode cn : s.getConditionNode()) {
				for (TParent p : cn.getParent()) {
					if (p.getParentID() instanceof TOperationNode) {
					} else if (p.getParentID() instanceof TSituationNode) {
					} else if (p.getParentID() instanceof TContextNode) {
						errMsg += "ERROR! Condition node \"" + cn.getName() + "\" must not be a child of a context node.\n";
					} else if (p.getParentID() instanceof TConditionNode) {
						errMsg += "ERROR! Condition node \"" + cn.getName() + "\" must not be a child of a condition node.\n";
					} else {
						errMsg += "ERROR! Condition node \"" + cn.getName() + "\" has a parent node with unknown type.\n";
					}
				}
			}
		}
		return errMsg;
	}

	/* Check whether a condition node has more than one child node. (simplify if some precondition is satisfied?) */
	public String checkChildrenNumb(TSituationTemplate sitTemplate) {
		String errMsg = "";
		List<TOperationNode> opNodes = new ArrayList<TOperationNode>();  // all operation nodes
		List<TConditionNode> condNodes = new ArrayList<TConditionNode>();  // all condition nodes
		List<TContextNode> contxtNodes = new ArrayList<TContextNode>();  // all context nodes
		
		// initialization of node lists
		for (TSituation s : sitTemplate.getSituation()) {
			opNodes.addAll(s.getOperationNode());
			condNodes.addAll(s.getConditionNode());
			contxtNodes.addAll(s.getContextNode());
		}
				
		// count all children per condition node
		int numbChildren;
		for (TConditionNode cdn1 : condNodes) {
			numbChildren = 0;
			
			for (TContextNode ctxtn : contxtNodes) {
				for (TParent p : ctxtn.getParent()) {
					if (p.getParentID().equals(cdn1)) {
						numbChildren++;
					}
				}
			}
			
			for (TConditionNode cdn2 : condNodes) {
				for (TParent p : cdn2.getParent()) {
					if (p.getParentID().equals(cdn1)) {
						numbChildren++;
					}
				}
			}
			
			for (TOperationNode ctxtn : opNodes) {
				for (TParent p : ctxtn.getParent()) {
					if (p.getParentID().equals(cdn1)) {
						numbChildren++;
					}
				}
			}
			
			// evaluation
			if (numbChildren > 1) {
				errMsg += "ERROR! Condition node \"" + cdn1.getName() + "\" has " + numbChildren + " child nodes. Required is exactly one.\n";
			}
			else {
			}			
			
		}
		return errMsg;
	}
}