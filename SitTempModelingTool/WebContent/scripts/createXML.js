function getSituationTemplateAsXML(templateName) {
    var i, j;
    var cons;
    var id = "";
    var xmlw = new XMLWriter("utf-8");
    xmlw.writeStartDocument();
    xmlw.writeStartElement("SituationTemplate");
    xmlw.writeAttributeString("name", templateName);
    xmlw.writeAttributeString("id", templateName);
    xmlw.writeAttributeString("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
    xmlw.writeAttributeString("xsi:noNamespaceSchemaLocation", "situation_template.xsd");

    var situations = $("div[type|='situationnode']:not(.hidden)");
    var operations = $("div[type|='operationnode']:not(.hidden)");
    var conditions = $("div[type|='conditionnode']:not(.hidden)");
    var contexts = $("div[type|='contextnode']:not(.hidden)");

    for (i = 0; i < situations.length; i++) {
        var sit = situations[i];
        id = $(sit).attr("id");
        var sitname = $("#" + id + " div").attr("sitvalue");
        xmlw.writeStartElement("situationNode");
        xmlw.writeAttributeString("id", id);
        xmlw.writeAttributeString("name", sitname);
        xmlw.writeEndElement();
    }

    for (i = 0; i < operations.length; i++) {
        var op = operations[i];
        id = $(op).attr("id");
        var opname = $("#" + id + " div").attr("oprname");
        var optype = $("#" + id + " div").attr("oprvalue");
        var negated = $("#" + id + " div").attr("oprnegated");

        xmlw.writeStartElement("operationNode");
        xmlw.writeAttributeString("id", id);
        xmlw.writeAttributeString("name", opname);
        cons = jsPlumb.getConnections().filter(function (con) {
            return con.sourceId === id;
        });
        for (j = 0; j < cons.length; j++) {
            xmlw.writeStartElement("parent");
            xmlw.writeAttributeString("parentID", cons[j].targetId);
            xmlw.writeEndElement();
        }
        xmlw.writeElementString("type", optype);
        xmlw.writeElementString("negated", negated);
        xmlw.writeEndElement();
    }

    for (i = 0; i < conditions.length; i++) {
        var condition = conditions[i];
        id = $(condition).attr("id");
        var conType = $("#" + id + " div").attr("operator");
        var conName = $("#" + id + " div").attr("conditionname");
        var numIntervals = $("#" + id + " div").attr("numberofintervals");
        var value1 = $("#" + id + " div").attr("sensorvalue");
        var value2 = $("#" + id + " div").attr("sensorsecondvalue");

        xmlw.writeStartElement("conditionNode");
        xmlw.writeAttributeString("id", id);
        xmlw.writeAttributeString("name", conName);
        if (conType.startsWith("interval")) {
            xmlw.writeAttributeString("xsi:type", "tTimeNode");
            xmlw.writeElementString("amountIntervals", numIntervals);
        }
        xmlw.writeElementString("opType", conType);
        xmlw.writeStartElement("condValues");
        xmlw.writeElementString("value", value1);
        if (conType === "between") {
            xmlw.writeElementString("value", value2);
        }
        //condValues
        xmlw.writeEndElement();
        cons = jsPlumb.getConnections().filter(function (con) {
            return con.sourceId === id;
        });
        for (j = 0; j < cons.length; j++) {
            xmlw.writeStartElement("parent");
            xmlw.writeAttributeString("parentID", cons[j].targetId);
            xmlw.writeEndElement();
        }
        //conditionNode
        xmlw.writeEndElement();
    }

    for (i = 0; i < contexts.length; i++) {
        var context = contexts[i];
        id = $(context).attr("id");

        var contextName = $("#" + id + " div").attr("contextname");
        var sensorType = $("#" + id + " div").attr("sensortype");
        var measureName = $("#" + id + " div").attr("sensorunit");
        var inputtype = $("#" + id + ' div').attr('inputtype');

        xmlw.writeStartElement("contextNode");
        xmlw.writeAttributeString("id", id);
        xmlw.writeAttributeString("name", contextName);
        xmlw.writeAttributeString("type", sensorType);
        xmlw.writeElementString("measureName", measureName);
        xmlw.writeElementString('inputType', inputtype);

        cons = jsPlumb.getConnections().filter(function (con) {
            return con.sourceId === id;
        });

        for (j = 0; j < cons.length; j++) {
            xmlw.writeStartElement("parent");
            xmlw.writeAttributeString("parentID", cons[j].targetId);
            xmlw.writeEndElement();
        }
        xmlw.writeEndElement();
    }

    xmlw.writeEndElement();
    xmlw.writeEndDocument();

    return xmlw.flush();
}
	