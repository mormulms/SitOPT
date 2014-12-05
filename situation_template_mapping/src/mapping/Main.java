package mapping;

import java.io.File;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.transform.stream.StreamSource;

import situationtemplate.model.TConditionNode;
import situationtemplate.model.TConditionNode.CondValue;
import situationtemplate.model.TContextNode;
import situationtemplate.model.TOperationNode;
import situationtemplate.model.TParent;
import situationtemplate.model.TSituation;
import situationtemplate.model.TSituationTemplate;
import utils.NodeREDUtils;

public class Main {

	/**
	 * main method for debug reasons
	 * 
	 * TODO delete and create interface
	 * 
	 * @param args
	 *            a valid situation template defined in XML
	 */
	public static void main(String[] args) {
		try {
			
			String url = args[0];
			
			// if no input is defined, we just define an exemplary situation
			// template using JAXB
			if (args.length == 1) {
				// we create an exemplary situation template using JAXB to test our code
				TSituationTemplate situationTemplate = new TSituationTemplate();
				situationTemplate.setId(NodeREDUtils.generateNodeREDId());

				TSituation situation = new TSituation();
				situation.setId(NodeREDUtils.generateNodeREDId());

				TOperationNode myAND = new TOperationNode();
				String andId = NodeREDUtils.generateNodeREDId();
				myAND.setId(andId);
				myAND.setName("and");
				myAND.setType("and");
				situation.getOperationNode().add(myAND);
				
				// Operational Nodes
				TConditionNode cpuGreatherThanNode = new TConditionNode();
				cpuGreatherThanNode.setOpType("greaterThan");
				cpuGreatherThanNode.setType("CPU");
				String gtId = NodeREDUtils.generateNodeREDId();
				cpuGreatherThanNode.setId(gtId);
				CondValue cond = new CondValue();
				cond.getValue().add("90");
				cpuGreatherThanNode.setCondValue(cond);
				cpuGreatherThanNode.setMeasureName("Measure_CPU");
				TParent parent = new TParent();
				parent.setParentID(myAND);
				cpuGreatherThanNode.getParent().add(parent);
				
				TConditionNode freeRAMLowerThanNode = new TConditionNode();
				freeRAMLowerThanNode.setOpType("lowerThan");
				freeRAMLowerThanNode.setType("RAM");
				String ltId = NodeREDUtils.generateNodeREDId();
				freeRAMLowerThanNode.setId(ltId);
				CondValue condition = new CondValue();
				condition.getValue().add("2000");
				freeRAMLowerThanNode.setCondValue(condition);
				freeRAMLowerThanNode.setMeasureName("Measure_RAM");
				TParent parent2 = new TParent();
				parent2.setParentID(myAND);
				freeRAMLowerThanNode.getParent().add(parent2);
				
				// Sensor Nodes
				TContextNode sensorNode = new TContextNode();
				// this is necessary to map an ID to an URL due to a missing registry
				sensorNode.setId(MockUpRegistry.getDataSourceIDs(0));
				sensorNode.setName("memorySensor");
				TParent parent3 = new TParent();
				parent3.setParentID(freeRAMLowerThanNode);
				sensorNode.getParent().add(parent3);

				TContextNode sensorNode1 = new TContextNode();
				sensorNode1.setId(MockUpRegistry.getDataSourceIDs(1));
				sensorNode1.setName("cpuSensor");
				TParent parent4 = new TParent();
				parent4.setParentID(cpuGreatherThanNode);
				sensorNode1.getParent().add(parent4);

				situation.getContextNode().add(sensorNode);
				situation.getContextNode().add(sensorNode1);

				situation.getConditionNode().add(freeRAMLowerThanNode);
				situation.getConditionNode().add(cpuGreatherThanNode);

				situationTemplate.setSituation(situation);
				
				Mapper mapper = new Mapper(situationTemplate);
				mapper.map(false, url);
			} else {
				// input is defined, parse the XML model
				JAXBContext jc = JAXBContext.newInstance(TSituationTemplate.class);
				Unmarshaller u = jc.createUnmarshaller();
				File file = new File(args[1]);
				JAXBElement<TSituationTemplate> root = u.unmarshal(new StreamSource(file), TSituationTemplate.class);
				
				TSituationTemplate situationTemplate = root.getValue();
				
				Mapper mapper = new Mapper(situationTemplate);
				mapper.map(false, url);
			}
		} catch (JAXBException e) {
			System.err.println("Could not parse JAXB object.");
			e.printStackTrace();
		}
	}
}