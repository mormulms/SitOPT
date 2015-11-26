function getSituationTemplateAsXML(templateName) {

    var xmlw = new XMLWriter("utf-8");
    xmlw.writeStartDocument();
    xmlw.writeStartElement("SituationTemplate");
    xmlw.writeAttributeString("name", templateName);
    xmlw.writeAttributeString("id", templateName);
    xmlw.writeAttributeString("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
    xmlw.writeAttributeString("xsi:noNamespaceSchemaLocation", "situation_template.xsd");

    //Situation Node details for xml file

    var situations = $("div[type|='situationnode']:not(.hidden)");
    var connections = jsPlumb.getConnections();
    for (var i = 0; i < situations.length; i++) {
        xmlw.writeStartElement("Situation");
        var id = $(situations[i]).attr("id");
        var cons = connections.filter(function (con) {
            return con.targetId === id;
        });
        var operations = cons.map(function (con) {
            return $("div#" + con.sourceId + ":not(.hidden)");
        });
        var opcons = [];
        for (var j = 0; j < operations.length; j++) {
            var opid = $(operations[j]).attr("id");
            opcons = connections.filter(function (con) {
                return con.targetId === opid;
            });
        }
        var contexts = opcons.map(function (con) {
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

            xmlw.writeStartElement("operationNode");
            xmlw.writeAttributeString("id", opid);
            xmlw.writeAttributeString("name", opname);

            xmlw.writeStartElement("parent");
            xmlw.writeAttributeString("parentID", sitname);
            // parent
            xmlw.writeEndElement();

            xmlw.writeElementString("type", optype);
            xmlw.writeElementString("negated", "false");


            // operationNode
            xmlw.writeEndElement();
        }

        for (var index = 0; index < opcons.length; index++) {
            var con = opcons[index];
            var conid = con.sourceId;
            var opid = con.targetId;
            var conname = $("#" + conid + " div").attr("conname");
            var contype = $("#" + conid + " div").attr("sensortype");
            var conop = $("#" + conid + " div").attr("operator");
            var value1 = $("#" + conid + " div").attr("sensorvalue");
            var value2 = $("#" + conid + " div").attr("sensorsecondvalue");
            var unit = $("#" + conid + " div").attr("sensorunit");
            var numbOfIntervals = $("#" + conid + " div").attr("numberOfIntervals");

            xmlw.writeStartElement("conditionNode");
            if (numbOfIntervals != null) {
                xmlw.writeAttributeString("xsi:type", "tTimeNode");
            }
            xmlw.writeAttributeString("id", conid + "Condition");
            xmlw.writeAttributeString("name", conname);
            xmlw.writeElementString("opType", conop);
            xmlw.writeElementString("measureName", unit);
            xmlw.writeStartElement("condValue");
            xmlw.writeElementString("value", value1);
            if (value2 !== "undefined") {
                xmlw.writeElementString("value", value2);
            }
            if (numbOfIntervals != null) {
                xmlw.writeElementString("amountIntervals", numbOfIntervals);
            }
            // condValue
            xmlw.writeEndElement();
            xmlw.writeStartElement("parent");
            xmlw.writeAttributeString("parentID", opid);
            // parent
            xmlw.writeEndElement();
            // conditionNode
            xmlw.writeEndElement();

            xmlw.writeStartElement("contextNode");
            xmlw.writeStartElement("parent");
            xmlw.writeAttributeString("parentID", conid + "Condition");
            //parent
            xmlw.writeEndElement();
            xmlw.writeAttributeString("id", conid);
            xmlw.writeAttributeString("name", conname);
            xmlw.writeAttributeString("type", contype);
            //contextNode
            xmlw.writeEndElement();
        }

        // Situation
        xmlw.writeEndElement();
    }
    /*$(document).ready(function(){
        $.each( $(".drawingArea"), function(i, drawingArea) {
            $("div", drawingArea).each(function() {
                var nodeAttributes = this.attributes;
                for (var i = 0; i < nodeAttributes.length; i++) {
                    if (nodeAttributes[i].name == "id") {
                        var nodeId = nodeAttributes[i].value;
                    };
                    if (nodeAttributes[i].name == "type") {
                        var nodeType = nodeAttributes[i].value;
                    };
                };
                if (!(this.classList.contains("hidden"))) {
                    if (nodeType == "situationnode") {
                        var nodeProperties = this.children[0].attributes;
                        for (var i = 0; i < nodeProperties.length; i++) {
                            if (nodeProperties[i].name == "sitvalue") {
                                var nodeName = nodeProperties[i].value;
                            };
                        };
                        xmlw.writeAttributeString("id", nodeName);
                        xmlw.writeAttributeString("name", nodeName);
                        xmlw.writeStartElement("situationNode");
                        xmlw.writeAttributeString("id", nodeId);
                        xmlw.writeAttributeString("name", nodeName);
                        xmlw.writeEndElement();
                    };
                };
            });
        });
        //Operation Node details for xml file
        $.each( $(".drawingArea"), function(i, drawingArea) {
            $("div", drawingArea).each(function() {
                var nodeAttributes = this.attributes;
                for (var i = 0; i < nodeAttributes.length; i++) {
                    if (nodeAttributes[i].name == "id") {
                        var nodeId = nodeAttributes[i].value;
                    };
                    if (nodeAttributes[i].name == "type") {
                        var nodeType = nodeAttributes[i].value;
                    };
                };
                if (!(this.classList.contains("hidden"))) {
                    if (nodeType == "operationnode") {
                        var nodeProperties = this.children[0].attributes;
                        for (var i = 0; i < nodeProperties.length; i++) {
                            if (nodeProperties[i].name == "oprname") {
                                var nodeName = nodeProperties[i].value;
                            };
                            if (nodeProperties[i].name == "oprvalue") {
                                var nodeValue = nodeProperties[i].value;
                            };
                        };
                        xmlw.writeStartElement("operationNode");
                        xmlw.writeAttributeString("id", nodeId);
                        xmlw.writeAttributeString("name", nodeName);
                        jsPlumb.select().each(function(connection) {
                            if (connection.sourceId == nodeId) {
                                var targetId = connection.targetId;
                                xmlw.writeStartElement("parent");
                                xmlw.writeAttributeString("parentID", targetId);
                                xmlw.writeEndElement();
                            }
                        });
                        xmlw.writeElementString("type", nodeValue);
                        xmlw.writeEndElement();
                    };
                };
            });
        });
        //Condition Node details for xml file
        $.each( $(".drawingArea"), function(i, drawingArea) {
            $("div", drawingArea).each(function() {
                var nodeAttributes = this.attributes;
                for (var i = 0; i < nodeAttributes.length; i++) {
                    if (nodeAttributes[i].name == "id") {
                        var nodeId = nodeAttributes[i].value;
                    };
                    if (nodeAttributes[i].name == "type") {
                        var nodeType = nodeAttributes[i].value;
                    };
                };
                if (!(this.classList.contains("hidden"))) {
                    if (nodeType == "contcondnode") {
                        var nodeProperties = this.children[0].attributes;
                        for (var i = 0; i < nodeProperties.length; i++) {
                            if (nodeProperties[i].name == "sensorunit") {
                                var nodeUnit = nodeProperties[i].value;
                            };
                            if (nodeProperties[i].name == "operator") {
                                var nodeOprTyp = nodeProperties[i].value;
                            };
                            if (nodeProperties[i].name == "sensorvalue") {
                                var nodeSenVal = nodeProperties[i].value;
                            };
                            if (nodeProperties[i].name == "sensorsecondvalue") {
                                var nodeSenSecVal = nodeProperties[i].value;
                            };
                        };

                        xmlw.writeStartElement("conditionNode");
                        xmlw.writeAttributeString("id", nodeId);
                        xmlw.writeAttributeString("name", nodeUnit);
                        xmlw.writeElementString("opType", nodeOprTyp);
                        xmlw.writeStartElement("condValue");
                        xmlw.writeElementString("value", nodeSenVal);
                        if (nodeOprTyp == "between") {
                            xmlw.writeElementString("value", nodeSenSecVal);
                        };
                        xmlw.writeEndElement();
                        jsPlumb.select().each(function(connection) {
                            if (connection.sourceId == nodeId) {
                                var targetId = connection.targetId;
                                xmlw.writeStartElement("parent");
                                xmlw.writeAttributeString("parentID", targetId);
                                xmlw.writeEndElement();
                            }
                        });
                        xmlw.writeEndElement();
                    };
                };
            });
        });
        //Context Node details for xml file
        $.each( $(".drawingArea"), function(i, drawingArea) {
            $("div", drawingArea).each(function() {
                var nodeAttributes = this.attributes;
                for (var i = 0; i < nodeAttributes.length; i++) {
                    if (nodeAttributes[i].name == "id") {
                        var nodeId = nodeAttributes[i].value;
                        var nodeIdCntxt = nodeId + "extId";
                    };
                    if (nodeAttributes[i].name == "type") {
                        var nodeType = nodeAttributes[i].value;
                    };
                };
                if (!(this.classList.contains("hidden"))) {
                    if (nodeType == "contcondnode") {
                        var nodeProperties = this.children[0].attributes;
                        for (var i = 0; i < nodeProperties.length; i++) {
                            if (nodeProperties[i].name == "conname") {
                                var nodeName = nodeProperties[i].value;
                            };
                            if (nodeProperties[i].name == "sensortype") {
                                var nodeSenTyp = nodeProperties[i].value;
                            };
                        };
                        xmlw.writeStartElement("contextNode");
                        xmlw.writeAttributeString("id", nodeIdCntxt);
                        xmlw.writeAttributeString("name", nodeName);
                        xmlw.writeAttributeString("type", nodeSenTyp);
                        xmlw.writeStartElement("parent");
                        xmlw.writeAttributeString("parentID", nodeId);
                        xmlw.writeEndElement();
                        xmlw.writeEndElement();
                    };
                };
            });
        });
    });*/

    xmlw.writeEndElement();
    xmlw.writeEndDocument();

    console.log(xmlw.flush());
    return xmlw.flush();
};
	