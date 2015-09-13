package constants;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

public class Properties {
	private static String resourceServer, resourcePort, resourceProtocol, protocol, server, port, situationProtocol, situationServer, situationPort, situationPath;
	
	public static String getResourceServer() {
		return resourceServer;
	}

	public static String getResourcePort() {
		return resourcePort;
	}

	public static String getResourceProtocol() {
		return resourceProtocol;
	}

	public static String getProtocol() {
		return protocol;
	}

	public static String getServer() {
		return server;
	}

	public static String getPort() {
		return port;
	}

	public static String getSituationProtocol() {
		return situationProtocol;
	}

	public static String getSituationServer() {
		return situationServer;
	}

	public static String getSituationPort() {
		return situationPort;
	}

	public static String getSituationPath() {
		return situationPath;
	}

	static {
		java.util.Properties prop = new java.util.Properties();
		try (InputStream in = new FileInputStream("settings.properties")) {
			prop.load(in);
			in.close();
			resourceServer = prop.getProperty("resourceServer");
			resourcePort = prop.getProperty("resourcePort");
			resourceProtocol = prop.getProperty("resourceProtocol");
			protocol = prop.getProperty("protocol");
			server = prop.getProperty("server");
			port = prop.getProperty("port");
			situationProtocol = prop.getProperty("situationProtocol");
			situationServer = prop.getProperty("situationServer");
			situationPort = prop.getProperty("situationPort");
			situationPath = prop.getProperty("situationPath");
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
}
