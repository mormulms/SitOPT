$(document).ready(function(){

    var selected = null;
    var selectedNode = null;
    var properties = null;
    var fieldProperties = null;

    $(".drawingArea").on("click", ".nodeTemplateSituation, .nodeTemplateOperation, .nodeTemplateContext, .nodeTemplateCondition", function() {

        $("#oprType").val('');
        $("#oprName").val('');
        $("#sitType").val('');
        $("#conditionType").val('');
        $("#contextType").val('');
        $("#sensorType").val('');
        $("#operator").val('');
        $("#value").val('');
        $("#unit").val('');
        $("label[for=value1]").remove();
        $("#secondValue").remove();


        if ($(this).hasClass("nodeTemplateSituation")) {

            // Code to deselct all nodes except Situation Nodes
            $(".selected").removeClass("selected");
            $(this).addClass("selected");

            // Code to hide all Forms except Form for Situation Node
            $("#oprForm").addClass("hidden");
            $("#contextForm").addClass("hidden");
            $("#conditionForm").addClass("hidden");
            $("#sitForm").removeClass("hidden");

            // Code to display the properties when Node selected
            selectedNode = $(".selected")[0];
            fieldProperties = selectedNode.children[0].attributes;


            for (var i = 0; i < fieldProperties.length; i++) {
                if (fieldProperties[i].name == "sitvalue") {
                    document.getElementById("sitType").value = fieldProperties[i].value;
                };
            }

            // Code to process save button click on the form
            $("#sitButton").click(function() {

                var sitVal = $("#sitType").val();

                // Code to save the Node properties in hidden div
                selected = $(".selected")[0];

                // Code to Change the name of the node to user entered name
                var source = $(selected).attr("source");
                selected.childNodes[0].nodeValue = sitVal;

                properties = selected.children[0];
                properties.setAttribute("sitvalue", sitVal);

                $("#sitForm").addClass("hidden");
            });
        } else if ($(this).hasClass("nodeTemplateOperation")) {

            // Code to deselct all nodes except Operation Nodes
            $(".selected").removeClass("selected");
            $(this).addClass("selected");

            // Code to hide all Forms except Form for Operation Node
            $("#sitForm").addClass("hidden");
            $("#contextForm").addClass("hidden");
            $("#conditionForm").addClass("hidden");
            $("#oprForm").removeClass("hidden");

            // Code to display the properties when Node selected
            selectedNode = $(".selected div")[0];

            var name = $(selectedNode).attr("oprname");
            var type = $(selectedNode).attr("oprvalue");
            var neg = $(selectedNode).attr("oprnegated");
            document.getElementById("oprName").value = name == undefined || name === "undefined" ? "" : name;
            document.getElementById("oprType").value = type == undefined || type === "undefined" ? "" : type;
            document.getElementById("oprNegated").value = neg == undefined || neg === "undefined" ? "" : neg;

            // Code to process save button click on the form
            $("#oprButton").click(function() {
                var oprVal = $("#oprType").val();
                var oprName = $("#oprName").val();
                var negated = $("#oprNegated").val();

                // Code to save the operator properties in hidden div
                selected = $(".selected")[0];

                // Code to Change the name of the node to user entered name
                var source = $(selected).attr("source");
                selected.childNodes[0].nodeValue = oprName;

                properties = selected.children[0];
                properties.setAttribute("oprname", oprName);
                properties.setAttribute("oprvalue", oprVal);
                properties.setAttribute("oprnegated", negated);

                $("#oprForm").addClass("hidden");
            });
        } else if ($(this).hasClass("nodeTemplateCondition")) {

            $(".selected").removeClass("selected");
            $(this).addClass("selected");

            $("#sitForm").addClass("hidden");
            $("#oprForm").addClass("hidden");
            $("#contextForm").addClass("hidden");
            $("#conditionForm").removeClass("hidden");


            // Code to display the properties when Node selected
            selectedNode = $(".selected")[0];
            fieldProperties = selectedNode.children[0].attributes;


            for (var i = 0; i < fieldProperties.length; i++) {
                if (fieldProperties[i].name == "conditionname") {
                    document.getElementById("conditionType").value = fieldProperties[i].value;
                } else if (fieldProperties[i].name == "operator") {
                    document.getElementById("operator").value = fieldProperties[i].value;
                    createNewValueField(document.getElementById("operator"));
                } else if (fieldProperties[i].name == "sensorvalue") {
                    document.getElementById("value").value = fieldProperties[i].value;
                } else if (fieldProperties[i].name == "sensorsecondvalue") {
                    var elem = document.getElementById("secondValue");
                    if(typeof elem !== 'undefined' && elem !== null) {
                        document.getElementById("secondValue").value = fieldProperties[i].value;
                    }
                }
            }

            // Code to process save button click on the form
            $("#conditionButton").click(function() {
                var conditionVal = $("#conditionType").val();
                var opr = $("#operator").val();
                var val = $("#value").val();
                var secVal = $("#secondValue").val();
                var numbOfIntervals = $("#numberOfIntervals").val();
                var numbPattern = new RegExp(/^\d*$/);
                if (numbOfIntervals != null && !numbPattern.test(numbOfIntervals)) {
                    $("#errors").html("Please enter a number as number of intervals.");
                    return;
                }

                // Code to populate the hidden div when user saves the filled in form
                selected = $(".selected")[0];

                // Code to Change the name of the node to user entered name

                var source = $(selected).attr("source");
                selected.childNodes[0].nodeValue = conditionVal;

                properties = selected.children[0];
                properties.setAttribute("conditionname", conditionVal);
                properties.setAttribute("operator", opr);
                properties.setAttribute("sensorvalue", val);
                properties.setAttribute("sensorsecondvalue", secVal);
                properties.setAttribute("numberOfIntervals", numbOfIntervals);

                $("#conditionForm").addClass("hidden");
            });
        } else if ($(this).hasClass("nodeTemplateContext")) {

            $(".selected").removeClass("selected");
            $(this).addClass("selected");

            $("#sitForm").addClass("hidden");
            $("#oprForm").addClass("hidden");
            $("#conditionForm").addClass("hidden");
            $("#contextForm").removeClass("hidden");


            // Code to display the properties when Node selected
            selectedNode = $(".selected")[0];
            fieldProperties = selectedNode.children[0].attributes;


            for (var i = 0; i < fieldProperties.length; i++) {
                if (fieldProperties[i].name == "contextname") {
                    document.getElementById("contextType").value = fieldProperties[i].value;
                } else if (fieldProperties[i].name == "sensortype") {
                    document.getElementById("sensorType").value = fieldProperties[i].value;
                    configureDropDownLists(document.getElementById("sensorType"), document.getElementById('unit'));
                } else if (fieldProperties[i].name == "sensorunit") {
                    document.getElementById("unit").value = fieldProperties[i].value;
                }
            }

            // Code to process save button click on the form
            $("#contextButton").click(function() {
                var contextVal = $("#contextType").val();
                var senTyp = $("#sensorType").val();
                var unit = $("#unit").val();
                var inputtype = $('#inputtype').val();
                unit = unit == null ? "" : unit;


                // Code to populate the hidden div when user saves the filled in form
                selected = $(".selected")[0];

                // Code to Change the name of the node to user entered name

                var source = $(selected).attr("source");
                selected.childNodes[0].nodeValue = contextVal;

                properties = selected.children[0];
                properties.setAttribute("contextName", contextVal);
                properties.setAttribute("sensortype", senTyp);
                properties.setAttribute("sensorunit", unit);
                if (inputtype.toLowerCase() == 'static context') {
                    properties.setAttribute('inputtype', 'static');
                } else {
                    properties.setAttribute('inputtype', inputtype.toLowerCase());
                }

                $("#contextForm").addClass("hidden");
            });
        }
    });
});