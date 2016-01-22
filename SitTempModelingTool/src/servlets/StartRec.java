package servlets;

import mapping.Main;
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Created on 13.12.15.
 *
 * @author Armin Hüneburg
 */
@WebServlet(name = "StartRec")
public class StartRec extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String xml = request.getParameter("xml");
        JSONArray mapping;
        try {
            String map = request.getParameter("mapping");
            Object parseResult = new JSONParser().parse(map == null ? "[]" : map);
            if (!(parseResult instanceof JSONArray)) {
                response.getWriter().write("mapping is not an array");
                return;
            }
            mapping = (JSONArray)parseResult;
        } catch (ParseException e) {
            String message = e.getMessage() + "\n" + e.getStackTrace()[0].toString();
            response.getWriter().write(message);
            return;
        }
        Path tempFile = Files.createTempFile(null, ".json");
        BufferedWriter writer = Files.newBufferedWriter(tempFile);
        writer.write(mapping.toJSONString());
        if (xml == null) {
            response.getWriter().write("xml is null");
            return;
        }
        if (System.getProperty("os.name").toLowerCase().startsWith("win")) {
            xml = xml.replace(" ", " ").replace("\"", "\"");
        } else {
            xml = xml.replace("\"", "\"").replace(" ", " ");
        }
        PrintStream origErr = System.err;
        try (ByteArrayOutputStream stream = new ByteArrayOutputStream();
             PrintStream newErr = new PrintStream(stream)) {
            System.setErr(newErr);
            Main.main(new String[]{tempFile.getFileName().toAbsolutePath().toString(), xml, "false"});
            String errors = stream.toString();
            if (errors != null && errors.trim().length() > 0) {
                throw new IOException(errors.trim());
            }
        } catch (IOException e) {
            response.getWriter().write("error while deploying\n" + e.getMessage());
        } finally {
            System.setErr(origErr);
        }
        response.getWriter().write("XML is deployed");
    }
}
