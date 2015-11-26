package validation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import model.TConditionNode;
import model.TContextNode;
import model.TOperationNode;
import model.TParent;
import model.TSituation;
import model.TSituationNode;
import model.TSituationTemplate;

public class ValidateOperationNodes {
	Map<TOperationNode, Boolean> visited = new HashMap<TOperationNode, Boolean>();
	Map<TOperationNode, Boolean> onStack = new HashMap<TOperationNode, Boolean>();
	Map<TOperationNode, Boolean> finished = new HashMap<TOperationNode, Boolean>();
	
	
	/* Check if an operation node has a forbidden parent node type. */
	public String checkParents(TSituationTemplate sitTemplate) {
		String errMsg = "";
		for (TSituation s : sitTemplate.getSituation()) {
			for (TOperationNode on : s.getOperationNode()) {
				for (TParent p : on.getParent()) {
					if (p.getParentID() instanceof TOperationNode) {
					} else if (p.getParentID() instanceof TSituationNode) {
					} else if (p.getParentID() instanceof TContextNode) {
						errMsg += "ERROR! Operation node \"" + on.getName() + "\" must not be a child of a context node.\n";					
					} else if (p.getParentID() instanceof TConditionNode) {
						errMsg += "ERROR! Operation node \"" + on.getName() + "\" must not be a child of a condition node.\n";
					} else {
						errMsg += "ERROR! Operation node \"" + on.getName() + "\" has a parent node with unknown type.\n";
					}
				}
			}
		}
		return errMsg;
	}
	
	/* Check if an operation node has too less/many children. (simplify if some precondition is satisfied?) */
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
		
		// count all children per operation node
		int numbChildren;
		for (TOperationNode on1 : opNodes) {
			numbChildren = 0;
			for (TOperationNode on2 : opNodes) {
				for (TParent p : on2.getParent()) {
					if (p.getParentID().equals(on1)) {
						numbChildren++;
					}
				}
			}
			for (TConditionNode cdn : condNodes) {
				for (TParent p : cdn.getParent()) {
					if (p.getParentID().equals(on1)) {
						numbChildren++;
					}
				}
			}
			
			for (TContextNode ctxtn : contxtNodes) {
				for (TParent p : ctxtn.getParent()) {
					if (p.getParentID().equals(on1)) {
						numbChildren++;
					}
				}
			}
					
			// evaluation
			switch (numbChildren) {
				case 0: 
					if (on1.getType().equals("NOT")) {  // NOT
						errMsg += "ERROR! Operation node \"" + on1.getName() + "\"(" + on1.getType() + ") has " + numbChildren + " child nodes. Required is exactly one.\n";
					} else {  // AND, OR, XOR
						errMsg += "ERROR! Operation node \"" + on1.getName() + "\"(" + on1.getType() + ") has " + numbChildren + " child nodes. Required are at least two.\n";
					}					
					break;
				case 1:
					if (!on1.getType().equals("NOT")) {  // AND, OR, XOR
						errMsg += "ERROR! Operation node \"" + on1.getName() + "\"(" + on1.getType() + ") has only " + numbChildren + " child node. Required are at least two.\n";
					}
					else {  // NOT
					}					
					break;
				default:  // >= 2
					if (on1.getType().equals("NOT")) {  // NOT
						errMsg += "ERROR! Operation node \"" + on1.getName() + "\"(" + on1.getType() + ") has " + numbChildren + " child nodes. Required is exactly one.\n";
					}
					else {  // AND, OR, XOR
					}
					break;			
			} 			
		}
		return errMsg;
	}
	
	/* Decide if there is (at least) one cycle inside the set of operation nodes.
	 * This is a simplified form of Tarjan's algorithm, proposed by Manfred Kufleitner,
	 * cf. https://en.wikipedia.org/wiki/Tarjan%27s_strongly_connected_components_algorithm.
	 */
	public String existsCycleTarjan(TSituationTemplate sitTemplate) {
		// initialization
		for (TSituation s : sitTemplate.getSituation()) {
			for (TOperationNode on : s.getOperationNode()) {
				visited.put(on, false);
				onStack.put(on, false);
			}
		}		
		// visit all nodes
		for (TOperationNode on : visited.keySet()) {
			if (!visited.get(on)) {  // == false
				if (!sc(on)) {
					return "ERROR! It exists a cycle in the set of operation nodes. Detected at operation node \"" + on.getName() + "\".\n";
				}
			}
		}
		return "";
	}
			
	private boolean sc(TOperationNode on) {
		visited.replace(on, true);
		onStack.replace(on, true);		
		for (TParent p : on.getParent()) {
			if (p.getParentID() instanceof TOperationNode) {
				if (onStack.get(p.getParentID())) {
					return false;
				} else {
					if (!sc((TOperationNode) p.getParentID())) {
						return false;
					}
				}
			}		
		}			
		onStack.replace(on, false);
		return true;
	}
	
	
	/* Detection of cycles inside operation nodes using DFS
	 * cf. https://de.wikipedia.org/wiki/Zyklus_%28Graphentheorie%29
	 */
	public String existsCycleDFS(TSituationTemplate sitTemplate) {
		// initialization
		for (TSituation s : sitTemplate.getSituation()) {
			for (TOperationNode on : s.getOperationNode()) {
				visited.put(on, false);
				finished.put(on, false);
			}
		}
		// visit all nodes
		for (TOperationNode on : visited.keySet()) {
			if (!dfs(on)) {
				return "ERROR! It exists a cycle in the set of operation nodes. Detected at operation node: \"" + on.getName() + "\".\n";
			}
		}
		return "";
	}

	private boolean dfs(TOperationNode on) {
		if (finished.get(on)) {
			return true;
		}
		if (visited.get(on)) {
			return false;  // abort
		}
		visited.replace(on, true);
		// visit all successors
		for (TParent p : on.getParent()) {
			if (p.getParentID() instanceof TOperationNode) {
				if (!dfs((TOperationNode) p.getParentID())) {
					return false;
				}
			}
		}		
		finished.replace(on, true);
		return true;
	}
}