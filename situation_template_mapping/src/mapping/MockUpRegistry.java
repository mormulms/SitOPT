package mapping;

import situationtemplate.model.TContextNode;

/**
 * Just to debug
 */
public class MockUpRegistry {

	public static String getDataSourceIDs(int index) {

		switch (index) {

		case 0:
			return ("memorySensor");
		case 1:
			return ("cpuSensor");
		}

		return null;
	}

	public static String getURLForID(TContextNode node) {
		if (node != null) {
			return "o1/" + node.getName();
		}

		return null;
	}

}
