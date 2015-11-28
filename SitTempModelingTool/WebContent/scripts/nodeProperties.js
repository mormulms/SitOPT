$(document).ready(function(){

    var selected = null;
    var selectedNode = null;
    var properties = null;
    var fieldProperties = null;

    $(".drawingArea").on("click", ".nodeTemplateSituation, .nodeTemplateOperation, .nodeTemplateContextCondition", function() {

        $("#oprType").val('');
        $("#oprName").val('');
        $("#sitType").val('');
        $("#contCondType").val('');
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
            $("#gegay").addClass("hidden");
            $("#contCondForm").addClass("hidden");
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
                if (source == "fromModelling") {
                    selected.children[1].innerHTML = sitVal;
                } else {
                    selected.childNodes[0].nodeValue = sitVal;
                };

                properties = selected.children[0];
                properties.setAttribute("sitvalue", sitVal);

                $("#sitForm").addClass("hidden");
            });
        };

        if ($(this).hasClass("nodeTemplateOperation")) {

            // Code to deselct all nodes except Operation Nodes
            $(".selected").removeClass("selected");
            $(this).addClass("selected");

            // Code to hide all Forms except Form for Operation Node
            $("#sitForm").addClass("hidden");
            $("#contCondForm").addClass("hidden");
            $("#oprForm").removeClass("hidden");

            // Code to display the properties when Node selected
            selectedNode = $(".selected")[0];
            fieldProperties = selectedNode.children[0].attributes;

            for (var i = 0; i < fieldProperties.length; i++) {
                if (fieldProperties[i].name == "oprname") {
                    document.getElementById("oprName").value = fieldProperties[i].value;
                } else if (fieldProperties[i].name == "oprvalue") {
                    document.getElementById("oprType").value = fieldProperties[i].value;
                };
            };

            // Code to process save button click on the form
            $("#oprButton").click(function() {
                var oprVal = $("#oprType").val();
                var oprName = $("#oprName").val();
                var negated = $("#oprNegated").val();

                // Code to save the operator properties in hidden div
                selected = $(".selected")[0];

                // Code to Change the name of the node to user entered name
                var source = $(selected).attr("source");
                if (source == "fromModelling") {
                    selected.children[1].innerHTML = oprName;
                } else {
                    selected.childNodes[0].nodeValue = oprName;
                }

                properties = selected.children[0];
                properties.setAttribute("oprname", oprName);
                properties.setAttribute("oprvalue", oprVal);
                properties.setAttribute("oprnegated", negated);

                $("#oprForm").addClass("hidden");
            });
        };

        if ($(this).hasClass("nodeTemplateContextCondition")) {

            // Code to deselct all nodes except ContextCondition Nodes
            $(".selected").removeClass("selected");
            $(this).addClass("selected");

            // Code to hide all Forms except Form for ContextCondition Node
            $("#sitForm").addClass("hidden");
            $("#oprForm").addClass("hidden");
            $("#contCondForm").removeClass("hidden");


            // Code to display the properties when Node selected
            selectedNode = $(".selected")[0];
            fieldProperties = selectedNode.children[0].attributes;


            for (var i = 0; i < fieldProperties.length; i++) {
                if (fieldProperties[i].name == "conname") {
                    document.getElementById("contCondType").value = fieldProperties[i].value;
                } else if (fieldProperties[i].name == "sensortype") {
                    document.getElementById("sensorType").value = fieldProperties[i].value;
                    configureDropDownLists(document.getElementById("sensorType"), document.getElementById('unit'));
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
                } else if (fieldProperties[i].name == "sensorunit") {
                    document.getElementById("unit").value = fieldProperties[i].value;
                }
            }

            // Code to process save button click on the form
            $("#cntxButton").click(function() {
                var contCondVal = $("#contCondType").val();
                var senTyp = $("#sensorType").val();
                var opr = $("#operator").val();
                var val = $("#value").val();
                var secVal = $("#secondValue").val();
                var unit = $("#unit").val();
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
                if (source == "fromModelling") {
                    selected.children[1].innerHTML = contCondVal;
                } else {
                    selected.childNodes[0].nodeValue = contCondVal;
                }

                properties = selected.children[0];
                properties.setAttribute("conname", contCondVal);
                properties.setAttribute("sensortype", senTyp);
                properties.setAttribute("operator", opr);
                properties.setAttribute("sensorvalue", val);
                properties.setAttribute("sensorsecondvalue", secVal);
                properties.setAttribute("sensorunit", unit);
                properties.setAttribute("numberOfIntervals", numbOfIntervals);

                $("#contCondForm").addClass("hidden");
            });
        };
    });
});