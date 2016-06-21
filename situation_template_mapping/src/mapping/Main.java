package mapping;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.StringReader;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.transform.stream.StreamSource;

import situationtemplate.model.TSituationTemplate;
import utils.IOUtils;

public class Main {

	/**
	 * main method for debug reasons
	 *  
	 * @param args
	 * 			  0 Path to objectID<->SensorID mapping
	 *            1 path to a valid situation template defined in XML
	 *            2 debug flag
	 */
	public static void main(String[] args) {
		try {
			
			// connects each node to a corresponding debug node
			// deactivate this flag for measurements
		    boolean debug;
		    if (args.length < 3) {
		        debug = false;
		    } else {
		        debug = Boolean.getBoolean(args[2]);
		    }
			
			java.util.Date date= new java.util.Date();
			
			// if no input is defined, we just define an exemplary situation
			// template using JAXB
			if (args.length == 1) {
				/*// we create an exemplary situation template using JAXB to test our code
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
			
				long timestamp = date.getTime();
				Mapper mapper = new Mapper(situationTemplate);
				mapper.map(false, url, timestamp, debug);*/
			} else {
				
				IOUtils.clearNodeRED();
				
				ObjectIdSensorIdMapping sensorMapping = new ObjectIdSensorIdMapping(args[0]);
				
				// input is defined, parse the XML model
				JAXBContext jc = JAXBContext.newInstance(TSituationTemplate.class);
				Unmarshaller u = jc.createUnmarshaller();
				JAXBElement<TSituationTemplate> root;
				if (args[1].toLowerCase().endsWith(".xml")) {
					File file = new File(args[1]);
	                root = u.unmarshal(new StreamSource(file), TSituationTemplate.class);
				} else {
					String xml = args[1].replace("\n", "").replace("\r", "").replace("\t", "").replace("\\n", "").replace("\\r", "").replace("\\t", "");
					root = u.unmarshal(new StreamSource(new StringReader(xml)), TSituationTemplate.class);
				}
				
				TSituationTemplate situationTemplate = root.getValue();
				// begin load test
				
//				for (int i = 0; i < 10; i++) {
					situationTemplate.setId(situationTemplate.getId());
					
					long timestamp = date.getTime();
					
					Mapper mapper = new Mapper(situationTemplate);
					mapper.map(false, sensorMapping, timestamp, debug);
//				}
			}
		} catch (JAXBException e) {
			e.printStackTrace();
		}
	}
}
