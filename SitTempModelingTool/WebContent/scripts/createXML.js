function getSituationTemplateAsXML(templateName) {

    var xmlw = new XMLWriter("utf-8");
    xmlw.writeStartDocument();
    xmlw.writeStartElement("SituationTemplate");
    xmlw.writeAttributeString("name", templateName);
    xmlw.writeAttributeString("id", templateName);
    xmlw.writeAttributeString("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
    xmlw.writeAttributeString("xsi:noNamespaceSchemaLocation", "situation_template.xsd");

    var modelled = {
        "situation": [],
        "condition": [],
        "context": [],
        "operation": []
    };

    //Situation Node details for xml file

    var situations = $("div[type|='situationnode']:not(.hidden)");
    var connections = jsPlumb.getConnections();
    for (var i = 0; i < situations.length; i++) {
        var id = $(situations[i]).attr("id");
        if (modelled.situation.indexOf(id) > -1) {
            continue;
        } else {
            modelled.situation.push(id);
        }
        xmlw.writeStartElement("Situation");
        var cons = connections.filter(function (con) {
            return con.targetId === id;
        });
        var operations = cons.map(function (con) {
            return $("div#" + con.sourceId + ":not(.hidden)");
        });

        var sitname = $("#" + id + " div").attr("sitvalue");
        xmlw.writeAttributeString("id", id);
        xmlw.writeAttributeString("name", sitname);

        xmlw.writeStartElement("situationNode");
        xmlw.writeAttributeString("id", id);
        xmlw.writeAttributeString("name", sitname);
        // SituationNode
        xmlw.writeEndElement();

        for (var j = 0; j < operations.length; j++) {
            var operationCon = cons[j];
            var opid = operationCon.sourceId;
            var opname = $("#" + opid + " div").attr("oprname");
            var optype = $("#" + opid + " div").attr("oprvalue");
            var negated = $("#" + opid + " div").attr("oprnegated");
            if (modelled.operation.indexOf(opid) > -1) {
                continue;
            } else {
                modelled.operation.push(opid);
            }

            xmlw.writeStartElement("operationNode");
            xmlw.writeAttributeString("id", opid);
            xmlw.writeAttributeString("name", opname);

            var cons = jsPlumb.getConnections().filter(function (con) {
                return con.sourceId === opid;
            });
            for (var m = 0; m < cons.length; m++) {
                xmlw.writeStartElement("parent");
                xmlw.writeAttributeString("parentID", cons[m].targetId);
                // parent
                xmlw.writeEndElement();
            }

            xmlw.writeElementString("type", optype);
            xmlw.writeElementString("negated", negated);

            // operationNode
            xmlw.writeEndElement();

            var conditionOperation = jsPlumb.getConnections().filter(function (con) {
                return con.targetId === opid;
            });
            var conditions = conditionOperation.map(function (con) {
                return $("div#" + con.sourceId + ":not(.hidden)");
            });

            for (var k = 0; k < conditions.length; k++) {
                var conOp = conditionOperation[k];
                var conditionId = conOp.sourceId;
                var conType = $("#" + conditionId + " div").attr("operator");
                var conName = $("#" + conditionId + " div").attr("conditionname");
                var numIntervals = $("#" + conditionId + " div").attr("numberofintervals");
                var value1 = $("#" + conditionId + " div").attr("sensorvalue");
                var value2 = $("#" + conditionId + " div").attr("sensorsecondvalue");
                value2 = value2 === "undefined" ? "" : value2;
                if (modelled.condition.indexOf(conditionId) > -1) {
                    continue;
                } else {
                    modelled.condition.push(conditionId);
                }

                xmlw.writeStartElement("conditionNode");
                xmlw.writeAttributeString("id", conditionId);
                xmlw.writeAttributeString("name", conName);
                if (conType.startsWith("interval")) {
                    xmlw.writeAttributeString("xsi:type", "tTimeNode");
                    xmlw.writeElementString("amountIntervals", numIntervals);
                }
                xmlw.writeElementString("opType", conType);
                var cons = jsPlumb.getConnections().filter(function (con) {
                    return con.sourceId === conditionId;
                });
                for (var m = 0; m < cons.length; m++) {
                    xmlw.writeStartElement("parent");
                    xmlw.writeAttributeString("parentID", cons[m].targetId);
                    // parent
                    xmlw.writeEndElement();
                }
                xmlw.writeStartElement("condValues");

                xmlw.writeElementString("value", value1);
                
                if (value2 != null && value2 !== "") {
                    xmlw.writeElementString("value", value2);
                }

                // condValues
                xmlw.writeEndElement();

                // conditionNode
                xmlw.writeEndElement();

                var contextCondition = jsPlumb.getConnections().filter(function (con) {
                    return con.targetId === conditionId;
                });
                var contexts = contextCondition.map(function (con) {
                    return $("div#" + con.sourceId + ":not(.hidden)");
                });
                for (var l = 0; l < contexts.length; l++) {
                    var conCon = contextCondition[l];
                    var contextId = conCon.sourceId;
                    var contextName = $("#" + contextId + " div").attr("contextname");
                    var sensorType = $("#" + contextId + " div").attr("sensortype");
                    var measureName = $("#" + contextId + " div").attr("sensorunit");
                    if (modelled.context.indexOf(contextId) > -1) {
                        continue;
                    } else {
                        modelled.context.push(contextId);
                    }

                    xmlw.writeStartElement("contextNode");
                    xmlw.writeAttributeString("name", contextName);
                    xmlw.writeAttributeString("id", contextId);
                    xmlw.writeAttributeString("type", sensorType);
                    xmlw.writeElementString("measureName", measureName);
                    var cons = jsPlumb.getConnections().filter(function (con) {
                        return con.sourceId === contextId;
                    });
                    for (var m = 0; m < cons.length; m++) {
                        xmlw.writeStartElement("parent");
                        xmlw.writeAttributeString("parentID", cons[m].targetId);
                        // parent
                        xmlw.writeEndElement();
                    }

                    // contextNode
                    xmlw.writeEndElement();
                }
            }
        }

        // Situation
        xmlw.writeEndElement();
    }

    xmlw.writeEndElement();
    xmlw.writeEndDocument();

    return xmlw.flush();
}
	