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


public class Properties {
    private static String resourceServer, resourcePort, resourceProtocol, protocol, server, port, situationProtocol,
            situationServer, situationPort, situationPath;
    private final static ArrayList<TContextNode> CONTEXT_NODES = new ArrayList<>();

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
