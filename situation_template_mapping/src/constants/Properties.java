package constants;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.ArrayList;
import java.util.Enumeration;

import situationtemplate.model.TContextNode;

/**
 * Class that reads the properties file and offers its content as static methods.
 */
public class Properties {
    private static String resourceServer, resourcePort, resourceProtocol, protocol, server, port, situationProtocol,
            situationServer, situationPort, situationPath;
    private final static ArrayList<TContextNode> CONTEXT_NODES = new ArrayList<>();

    /**
     *
     * @return Returns the RMP server IP/URL
     */
    public static String getResourceServer() {
        return resourceServer;
    }

    /**
     *
     * @return Returns the RMP server port
     */
    public static String getResourcePort() {
        return resourcePort;
    }

    /**
     *
     * @return Returns the RMP protocol (http/https)
     */
    public static String getResourceProtocol() {
        return resourceProtocol;
    }

    /**
     *
     * @return Returns the Node-Red protocol (http/https)
     */
    public static String getProtocol() {
        return protocol;
    }

    /**
     *
     * @return Returns the Node-Red server IP/URL
     */
    public static String getServer() {
        return server;
    }

    /**
     *
     * @return Returns the Node-Red port
     */
    public static String getPort() {
        return port;
    }

    /**
     *
     * @return Returns the Situationsverwaltung protocol (http/https)
     */
    public static String getSituationProtocol() {
        return situationProtocol;
    }

    /**
     *
     * @return Returns the Situationsverwaltung server IP/URL
     */
    public static String getSituationServer() {
        return situationServer;
    }

    /**
     *
     * @return Returns the Situationsverwaltung port
     */
    public static String getSituationPort() {
        return situationPort;
    }

    /**
     *
     * @return Returns the
     */
    public static String getSituationPath() {
        return situationPath;
    }

    /**
     *
     * @return Returns the conexts nodes
     */
    public static ArrayList<TContextNode> getContextNodes() {
        return CONTEXT_NODES;
    }

    static {
        java.util.Properties prop = new java.util.Properties();
        try (InputStream in = new FileInputStream("settings.properties")) {
            prop.load(in);
            in.close();
            resourceServer = prop.getProperty("resourceServer");
            resourcePort = prop.getProperty("resourcePort");
            resourceProtocol = prop.getProperty("resourceProtocol");
            if (resourceProtocol == null) {
                resourceProtocol = "http";
            }
            protocol = prop.getProperty("protocol");
            server = prop.getProperty("server");
            port = prop.getProperty("port");
            situationProtocol = prop.getProperty("situationProtocol");
            situationServer = prop.getProperty("situationServer");
            situationPort = prop.getProperty("situationPort");
            situationPath = prop.getProperty("situationPath");
        } catch (IOException ignored) {
            try (InputStream in = new FileInputStream(System.getProperty("user.home") + File.separator + "situation_mapping.properties")) {
                prop.load(in);
                in.close();
                resourceServer = prop.getProperty("resourceServer");
                resourcePort = prop.getProperty("resourcePort");
                resourceProtocol = prop.getProperty("resourceProtocol");
                if (resourceProtocol == null) {
                    resourceProtocol = "http";
                }
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

    /**
     *
     * @return Returns all local ip addresses
     */
    public static String[] getLocalIpAddresses() {
        ArrayList<String> ips = new ArrayList<>();
        Enumeration<NetworkInterface> n = null;
        try {
            n = NetworkInterface.getNetworkInterfaces();
        } catch (SocketException e1) {
            return new String[0];
        }
        for (; n.hasMoreElements();)
        {
            NetworkInterface e = n.nextElement();

            Enumeration<InetAddress> a = e.getInetAddresses();
            for (; a.hasMoreElements();)
            {
                InetAddress addr = a.nextElement();
                ips.add(addr.getHostAddress());
            }
        }
        return ips.toArray(new String[ips.size()]);
    }

    /**
     * Tries to find an ip address that is in the same subnet.
     * @param ip The ip address that should be in the same sub network
     * @return Returns one of the ip addresses that shares the most numbers with the given one.
     */
    public static String getRemoteIp(String ip) {
        if (ip.equals("127.0.0.1") || ip.equals("localhost")) {
            return "localhost";
        } else {
            String[] orig = ip.split(".");
            String[] ips = getLocalIpAddresses();
            int maxMatches = 0;
            String bestmatch = null;
            for (String i : ips) {
                int counter = 0;
                String[] splits = i.split(".");
                for (int j = 0; j < 4; j++) {
                    if (splits[j].equals(orig[j])) {
                        counter++;
                    }
                }
                if (counter > maxMatches) {
                    maxMatches = counter;
                    bestmatch = i;
                }
            }
            return bestmatch;
        }
    }
}
