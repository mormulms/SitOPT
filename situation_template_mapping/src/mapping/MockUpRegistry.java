package mapping;

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
		case 2:
			return ("2");
		case 3:
			return ("3");
		}

		return null;
	}

	public static String getURLForID(String name) {

		if (name.equals("memorySensor")) {
			return "localhost:8080/memoryusage";
		} else if (name.equals("cpuSensor")) {
			return "localhost:8080/cpuusage";
		} else if (name.equals("watchdogSensor")) {
			return "localhost:1880/ping";
		}

		return null;
	}

}
