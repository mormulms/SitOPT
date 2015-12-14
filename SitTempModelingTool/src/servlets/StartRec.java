package servlets;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Created on 13.12.15.
 *
 * @author Armin Hüneburg
 */
@WebServlet(name = "StartRec")
public class StartRec extends HttpServlet {
    private static AtomicInteger counter = new AtomicInteger(0);
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String xml = request.getParameter("xml");
        String name = request.getParameter("name");
        JSONObject mapping;
        try {
            mapping = (JSONObject)new JSONParser().parse(request.getParameter("mapping"));
        } catch (ParseException e) {
            response.getWriter().write(e.getMessage());
            return;
        }
        int index = counter.getAndIncrement();
        String path = "bufferMapping." + index + ".json";
        BufferedWriter writer = Files.newBufferedWriter(Paths.get(path));
        writer.write(mapping.toJSONString());
        xml = xml.replace("\t", "").replace("\n", "").replace("\r", "").replace("\"", "\\\"");
        Process p = Runtime.getRuntime().exec("java -jar " + new File(path).getAbsolutePath() +
                "situation_template_v01.jar " + xml + " " + name, null, new File("lib"));
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()))) {
            StringBuilder body = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                body.append('\n');
                body.append(line);
            }
            response.getWriter().write(body.toString());
        }
    }
}
