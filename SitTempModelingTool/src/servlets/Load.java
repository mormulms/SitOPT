package servlets;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

/**
 * Servlet implementation class Load
 *
 * Get all situation templates in the database and display the ids to the user

 */
@WebServlet("/load")
public class Load extends HttpServlet {
        private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
                URL url;
                HttpURLConnection conn;
                BufferedReader rd;
                String line;
                String result = "";
                try {
                        url = new URL("http://192.168.209.246:10010/situationtemplates/");
                        conn = (HttpURLConnection) url.openConnection();
                        conn.setRequestMethod("GET");
                        conn.setRequestProperty("Content-Type", "application/json");
                        rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                        while ((line = rd.readLine()) != null) {
                                result += line;
                        }
                        rd.close();

//                    System.out.println(result);
                        JSONParser parser = new JSONParser();
                        JSONArray sitTemplates = (JSONArray) parser.parse(result);

                        JSONArray containedSitTemplates = new JSONArray();

                        for(int i = 0; i < sitTemplates.size(); i++) {
                                JSONObject sitTemplate = (JSONObject) sitTemplates.get(i);
//                            System.out.println(sitTemplate.toJSONString());
                                containedSitTemplates.add(sitTemplate.get("_id"));
                        }

//                        System.out.println(containedSitTemplates.toJSONString());

                        // return the entries through the variable containedSitTemplates
                        // format: ["id1", "id2", "id3"]
                        response.getWriter().println(containedSitTemplates);

                } catch (IOException e) {
                        e.printStackTrace();
                        response.getWriter().println("IOException occurred. Error message: " + e.getMessage());
                } catch (Exception e) {
                        e.printStackTrace();
                        response.getWriter().println("Exception occurred. Error message: " + e.getMessage());
                }
    }
}