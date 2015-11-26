var countSitEl = 0;
var countOprEl = 0;
var countCntCndEl = 0;

function importXML() {
//		clearAll();
        $("#fileinput").click();
        }
        document.getElementById('fileinput').addEventListener('change', readSingleFile, false);

        function readSingleFile(evt) {
                //Retrieve the first (and only!) File from the FileList object
                var f = evt.target.files[0];

                if (f) {
                var r = new FileReader();
                r.onload = function(e) {
                        var contents = e.target.result;
                        clearAll();
                        parseAndTraverseXML(contents);
                        connectXML(contents);
                }
                r.readAsText(f);
                } else {
                alert("Failed to load file");
                }
        }

        function parseAndTraverseXML (contents) {
                var xml = $.parseXML(contents);
                var leftVal = 10 + "px";
                var topVal = 10 + "px";
                var leftDiff = 100;
                var leftDiffCond = 100;

                for (var i = 0; i < xml.documentElement.childNodes[1].children.length; i++) {
                        if (xml.documentElement.childNodes[1].children[i].nodeName == "situationNode") {	
                                var div = document.createElement("div");
                                $(div).addClass("nodeTemplateSituation");
                                div.setAttribute("indrawingarea", "true");
								div.setAttribute("type", "situationnode");
								div.setAttribute("source", "fromModelling");
                                div.style.cssText = 'top:10px;left:500px;';
                                //Subdiv for Properties
                                var subDiv = document.createElement("div");
                                $(subDiv).addClass("hidden");

                                for (var j = 0; j < xml.documentElement.childNodes[1].children[i].attributes.length; j++) {
                                        if (xml.documentElement.childNodes[1].children[i].attributes[j].name == "id") {
                                                var sitId = xml.documentElement.childNodes[1].children[i].attributes[j].value;
                                                div.setAttribute("id", sitId);
                                                countSitEl++;
												countSituation = countSitEl;
                                        } else if (xml.documentElement.childNodes[1].children[i].attributes[j].name == "name") {
                                                var sitName = xml.documentElement.childNodes[1].children[i].attributes[j].value;
                                                div.setAttribute("name", sitName);
                                                //Code to populate properties div
                                                subDiv.setAttribute("sitvalue", sitName);
                                                $(subDiv).appendTo($(div));
                                                //Code to change the div display name
                                                var textNode = document.createElement("p");
                                                textNode.textContent = sitName;
                                                $(textNode).appendTo($(div));
                                        };
                                };
                                $(div).appendTo($(".drawingArea"));
                              // Var sitNodeCtr is used to track the number of situation nodes. When greater than 1, error displayed 
                                sitNodeCtr++;
                                makeDraggable($(div));

                        } else if (xml.documentElement.childNodes[1].children[i].nodeName == "operationNode") {
                                var div = document.createElement("div");
                                $(div).addClass("nodeTemplateOperation");
                                div.setAttribute("indrawingarea", "true");
								div.setAttribute("type", "operationnode");
								div.setAttribute("source", "fromModelling");
                                //Increment the css top and left position values
                                topVal = parseInt(topVal, 10);
                                div.style.top = (topVal + 200) + "px";
                                leftVal = parseInt(leftVal, 10);
                                leftDiff = leftDiff + 200;
                                div.style.left = (leftVal + leftDiff) + "px";
                                //Subdiv for Properties
                                var subDiv = document.createElement("div");
                                $(subDiv).addClass("hidden");
                                //Change div display name
                                var textNode = document.createElement("p");

                                for (var k = 0; k < xml.documentElement.childNodes[1].children[i].attributes.length; k++) {
                                        if (xml.documentElement.childNodes[1].children[i].attributes[k].name == "id") {
                                                var oprId = xml.documentElement.childNodes[1].children[i].attributes[k].value;
                                                div.setAttribute("id", oprId);
                                                countOprEl++;
												countOpr = countOprEl;

                                        } else if (xml.documentElement.childNodes[1].children[i].attributes[k].name == "name") {
                                                var oprName = xml.documentElement.childNodes[1].children[i].attributes[k].value;
                                                div.setAttribute("name", oprName);
                                                //Code to populate properties div
                                                subDiv.setAttribute("oprname", oprName);
                                        };
                                };
								for (var id = 0; id < xml.documentElement.childNodes[1].children[i].children.length; id++) {
                                        if (xml.documentElement.childNodes[1].children[i].children[id].nodeName == "type") {
                                                var oprType = xml.documentElement.childNodes[1].children[i].children[id].innerHTML;
                                                subDiv.setAttribute("oprvalue", oprType);
										};
								};
								$(subDiv).appendTo($(div));
                                //Code to change the div display name
                                textNode.textContent = oprName;
                                $(textNode).appendTo($(div));
                                $(div).appendTo($(".drawingArea"));
                                makeDraggable($(div));
                        } else if (xml.documentElement.childNodes[1].children[i].nodeName == "conditionNode") {
                                var condValue = new Array("", "");
                                var div = document.createElement("div");
                                $(div).addClass("nodeTemplateContextCondition");
                                div.setAttribute("indrawingarea", "true");
								div.setAttribute("type", "contcondnode");
								div.setAttribute("source", "fromModelling");
                                //Increment the css top and left position values
                                topVal = parseInt(topVal, 10);
                                div.style.top = (topVal + 400) + "px";
                                leftVal = parseInt(leftVal, 10);
                                div.style.left = (leftVal + leftDiffCond) + "px";
                                leftDiffCond = leftDiffCond + 300;
                                //Subdiv for Properties
                                var subDiv = document.createElement("div");
                                $(subDiv).addClass("hidden");
                                //Change div display name
                                var textNode = document.createElement("p");
								
                                for (var l = 0; l < xml.documentElement.childNodes[1].children[i].attributes.length; l++) {
                                        if (xml.documentElement.childNodes[1].children[i].attributes[l].name == "id") {
                                                var condId = xml.documentElement.childNodes[1].children[i].attributes[l].value;
                                                div.setAttribute("id", condId);
                                                countCntCndEl++;
												countCntxtCond = countCntCndEl;
                                        } else if (xml.documentElement.childNodes[1].children[i].attributes[l].name == "name") {
                                                var condName = xml.documentElement.childNodes[1].children[i].attributes[l].value;
                                        }
                                };

                                for (var idx = 0; idx < xml.documentElement.childNodes[1].children[i].children.length; idx++) {
                                        if (xml.documentElement.childNodes[1].children[i].children[idx].nodeName == "opType") {
                                                var oprType = xml.documentElement.childNodes[1].children[i].children[idx].innerHTML;
                                                subDiv.setAttribute("operator", oprType);
                                        } else if (xml.documentElement.childNodes[1].children[i].children[idx].nodeName == "condValue") {
                                                for (var index = 0; index < xml.documentElement.childNodes[1].children[i].children[idx].children.length; index++) {
                                                        condValue[index] = xml.documentElement.childNodes[1].children[i].children[idx].children[index].innerHTML;
                                                        subDiv.setAttribute("sensorvalue", condValue[0]);
                                                        subDiv.setAttribute("sensorsecondvalue", condValue[1]);
                                                };
                                        };
                                };
								
								for (var m = i; m < xml.documentElement.childNodes[1].children.length; m++) {
                                    if (xml.documentElement.childNodes[1].children[m].nodeName == "contextNode") {
                                        for (var ind = 0; ind < xml.documentElement.childNodes[1].children[m].children.length; ind++) {
                                            if (xml.documentElement.childNodes[1].children[m].children[ind].nodeName == "parent") {
                                                var parentContId = xml.documentElement.childNodes[1].children[m].children[ind].attributes[0].nodeValue;
                                                    if (parentContId == condId) {
                                                        for (var n = 0; n < xml.documentElement.childNodes[1].children[m].attributes.length; n++) {
                                                            if (xml.documentElement.childNodes[1].children[m].attributes[n].name == "name") {
                                                                var contextName = xml.documentElement.childNodes[1].children[m].attributes[n].value;
                                                                subDiv.setAttribute("conname", contextName);
                                                                div.setAttribute("name", contextName);
                                                            } else if (xml.documentElement.childNodes[1].children[m].attributes[n].name == "type") {
                                                                var senTyp = xml.documentElement.childNodes[1].children[m].attributes[n].value;
                                                                subDiv.setAttribute("sensortype", senTyp);
																subDiv.setAttribute("sensorunit", condName);
                                                            };
                                                            //Code to populate properties div
                                                            $(subDiv).appendTo($(div));
                                                        };
                                                        //Code to change the div display name
                                                        textNode.textContent = contextName;
                                                        $(textNode).appendTo($(div));
                                                    };
                                            };
                                        };
                                    };
                                };
								
                                $(div).appendTo($(".drawingArea"));
                                makeDraggable($(div));
                        }
                }
        }

        function connectXML(contents) {
                var xmlCon = $.parseXML(contents);
                for (var i = 0; i < xmlCon.documentElement.childNodes[1].children.length; i++) {
                        //Code to establish connections
                        for (var p = 0; p < xmlCon.documentElement.childNodes[1].children[i].children.length; p++) {
                                if (xmlCon.documentElement.childNodes[1].children[i].children[p].nodeName == "parent") {
                                        var current = xmlCon.documentElement.childNodes[1].children[i].attributes[0].nodeValue;
                                        var parentId = xmlCon.documentElement.childNodes[1].children[i].children[p].attributes[0].nodeValue;
                                        var parent = xmlCon.documentElement.childNodes[1].children[i].children[p].attributes[0].nodeValue;

                                        if (xmlCon.documentElement.childNodes[1].children[i].localName == "operationNode") {
                                                current += "_top";
                                        }

                                        jsPlumb.ready(function() {
                                                jsPlumb.connect({uuids: [current, parent]});
                                        });
                                }
                        }
                }
        }