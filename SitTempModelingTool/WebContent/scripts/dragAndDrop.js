var countSituation = 0;
var countCondition = 0;
var countContext = 0;
var countOpr = 0;

$(document).ready(function() {

    //Drag and Drop functionality for Situation Nodes
    $(function() {
        //Make element draggable
        $(".paletteEntrySituation").draggable({
            cursor: 'move',
            revert: 'invalid',
            helper: function(event) {
                var newObjSit = $("#nodeSit").clone();
                newObjSit.removeClass("hidden");
                newObjSit.css("z-index", "2000");
                return newObjSit;
            },
            appendTo: '.drawingArea',
            containment: '.drawingArea'
        });

        //Drag and Drop functionality for Condition Nodes
        $(function() {
            //Make element draggable
            $(".paletteEntryCondition").draggable({
                cursor: 'move',
                revert: 'invalid',
                helper: function(event) {
                    var newObjCon = $("#nodeCondition").clone();
                    newObjCon.removeClass("hidden");
                    newObjCon.css("z-index", "2000");
                    return newObjCon;
                },
                appendTo: '.drawingArea',
                containment: '.drawingArea'
            });

            //Drag and Drop functionality for Context Nodes
            $(function() {
                //Make element draggable
                $(".paletteEntryContext").draggable({
                    cursor: 'move',
                    revert: 'invalid',
                    helper: function(event) {
                        var newObjCon = $("#nodeContext").clone();
                        newObjCon.removeClass("hidden");
                        newObjCon.css("z-index", "2000");
                        return newObjCon;
                    },
                    appendTo: '.drawingArea',
                    containment: '.drawingArea'
                });

                //Drag and Drop functionality for Operation Nodes
                $(function() {
                    //Make element draggable
                    $(".paletteEntryOperation").draggable({
                        cursor: 'move',
                        revert: 'invalid',
                        helper: function (event) {
                            var newObjOpr = $("#nodeOpr").clone();
                            newObjOpr.removeClass("hidden");
                            newObjOpr.css("z-index", "2000");
                            return newObjOpr;
                        },
                        appendTo: '.drawingArea',
                        containment: '.drawingArea'
                    });

                    //Make element droppable
                    $(".drawingArea").droppable({
                        tolerance: 'pointer',
                        drop: function (event, ui) {

                            var nodeAttributes = event.originalEvent.target.attributes;

                            // check if it was dragged from the palette or the drawingArea
                            var fromDrawingArea = false;

                            for (var i = 0; i < nodeAttributes.length; i++) {
                                if (nodeAttributes[i].nodeName == 'indrawingarea' && nodeAttributes[i].nodeValue == 'true') {
                                    fromDrawingArea = true;
                                }
                            }

                            // TODO: hack
                            if (!fromDrawingArea && nodeAttributes.length > 0) {
                                var tempClone = null;
                                if (ui.helper[0].getAttribute("type") == "situationnode") {
                                    tempClone = $("#nodeSit").clone();
                                    tempClone.attr("id", "Situation" + ++countSituation);
                                    tempClone.attr("inDrawingArea", 'true');
                                    tempClone.addClass("nodeTemplateSituation");
                                } else if (ui.helper[0].getAttribute("type") == "conditionnode") {
                                    tempClone = $("#nodeCondition").clone();
                                    tempClone.attr("id", "Condition" + ++countCondition);
                                    tempClone.attr("inDrawingArea", 'true');
                                    tempClone.addClass("nodeTemplateCondition");
                                } else if (ui.helper[0].getAttribute("type") == "contextnode") {
                                    tempClone = $("#nodeContext").clone();
                                    tempClone.attr("id", "Context" + ++countContext);
                                    tempClone.attr("inDrawingArea", 'true');
                                    tempClone.addClass("nodeTemplateContext");
                                } else if (ui.helper[0].getAttribute("type") == "operationnode") {
                                    tempClone = $("#nodeOpr").clone();
                                    tempClone.attr("id", "Operation" + ++countOpr);
                                    tempClone.attr("inDrawingArea", 'true');
                                    tempClone.addClass("nodeTemplateOperation");
                                }

                                // Dynamically creating the hidden div for the cloned nodes
                                var propertyDiv = document.createElement("div");
                                propertyDiv.id = "propertyDiv";
                                tempClone.append(propertyDiv);

                                tempClone.removeClass("ui-draggable");
                                tempClone.removeClass("ui-droppable");
                                tempClone.removeClass("hidden");

                                //Code to drop node at mouse position
                                var parentOffset = $(this).parent().offset();
                                var x = event.pageX - parentOffset.left;
                                var left = Math.max(x, 0);
                                var y = event.pageY - parentOffset.top;
                                var top = Math.max(y, 0);
                                tempClone.css("top", top);
                                tempClone.css("left", left);

                                tempClone.appendTo($(".drawingArea"));

                                $(".selected").removeClass("selected");

                                $("#sitForm").addClass("hidden");
                                $("#oprForm").addClass("hidden");
                                $("#contextForm").addClass("hidden");
                                $("#conditionForm").addClass("hidden");

                                //Remove the second value field for new nodes
                                $("label[for=value1]").remove();
                                $("#secondValue").remove();

                                makeDraggable(tempClone);
                            }
                        }
                    });
                });
            });
        });
    });

});