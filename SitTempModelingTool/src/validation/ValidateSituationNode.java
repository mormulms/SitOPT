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

public class ValidateSituationNode {
	
	/* Check if the situation node has no or more than one child node. (simplify if some precondition is satisfied?) */
	public String checkChildrenNumb(TSituationTemplate sitTemplate) {
		List<TOperationNode> opNodes = new ArrayList<TOperationNode>();  // all operation nodes
		List<TConditionNode> condNodes = new ArrayList<TConditionNode>();  // all condition nodes
		List<TContextNode> contxtNodes = new ArrayList<TContextNode>();  // all context nodes
		
		// initialization of node lists
		for (TSituation s : sitTemplate.getSituation()) {
			opNodes.addAll(s.getOperationNode());
			condNodes.addAll(s.getConditionNode());
			contxtNodes.addAll(s.getContextNode());
		}
		
		// count all children for the situation node
		int numbChildren = 0;
		TSituationNode sn = null;
		for (TSituation s : sitTemplate.getSituation()) {
			sn = s.getSituationNode();
			for (TOperationNode on : opNodes) {
				for (TParent p : on.getParent()) {
					if (p.getParentID().equals(sn)) {
						numbChildren++;
					}
				}
			}
			for (TConditionNode cdn : condNodes) {
				for (TParent p : cdn.getParent()) {
					if (p.getParentID().equals(sn)) {
						numbChildren++;
					}
				}
			}
			for (TContextNode ctxtn : contxtNodes) {
				for (TParent p : ctxtn.getParent()) {
					if (p.getParentID().equals(sn)) {
						numbChildren++;
					}
				}
			}
		}
		
		// evaluation
		switch (numbChildren) {
		case 0:
			return "ERROR! The situation node \"" + sn.getName() + "\" has " + numbChildren + " child nodes. Required is exactly one.\n";
		case 1:
			return "";
		default:
			return "ERROR! The situation node \"" + sn.getName() + "\" has " + numbChildren + " child nodes. Required is exactly one.\n";
		}		
	}
}