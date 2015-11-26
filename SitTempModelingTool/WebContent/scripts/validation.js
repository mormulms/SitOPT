/**
 * Created by armin on 21.11.15.
 */
function validate() {
    var errors = [];
    var starts = [];
    var ends = [];
    var connections = jsPlumb.getConnections();
    for (var i = 0; i < connections.length; i++) {
        var connection = connections[i];
        var start = connection.sourceId;
        starts.push(start);
        var end = connection.targetId;
        ends.push(end);
        if (start.startsWith("ContextCondition") && !end.startsWith("Operation")) {
            errors.push("Illegal Connection: " + $("#" + start).text() + " -> " + $("#" + end).text())
        } else if (start.startsWith("Operation") && !(end.startsWith("Operation") || end.startsWith("Situation"))) {
            errors.push("Illegal Connection: " + $("#" + start).text() + " -> " + $("#" + end).text())
        }
    }

    var draggables = $(".ui-draggable");
    var intervalTypes = ["intervalMinEquals", "intervalMin", "intervalMaxEquals", "intervalMax"];

    for (var i = 0; i < draggables.length; i++) {
        var drag = draggables[i];
        if ($(drag).hasClass("ui-droppable") || $(drag).hasClass("unselectable")) {
            continue;
        }
        var id = $(drag).attr("id");
        if (id.startsWith("Operation") && !(starts.indexOf(id) > -1 && ends.indexOf(id) > -1)) {
            errors.push("Unused Node: " + $("#" + id).text());
        } else if (id.startsWith("Situation") && ends.indexOf(id) == -1) {
            errors.push("Unused Node: " + $("#" + id).text());
        } else if (id.startsWith("ContextCondition") && starts.indexOf(id) == -1) {
            errors.push("Unused Node: " + $("#" + id).text());
        }
        if (id.startsWith("Operation") && $("#" + id + " div").length == 0) {
            errors.push("Invalid Operation Node: No Operation Type in " + $("#" + id).text());
        } else if (id.startsWith("ContextCondition") && $("#" + id + " div").length == 0) {
            errors.push("Invalid Context Condition Node: No Sensor Type, Operator, Value and Unit in " + $("#" + id).text());
        } else {
            var div = $("#" + id + " div")[0];
            if (id.startsWith("Operation") && (div.getAttribute("oprvalue") == null || div.getAttribute("oprnegated") == null)) {
                errors.push("Invalid Operation Node: No Operation Type or value for negation in " + $("#" + id).text());
            } else if (id.startsWith("ContextCondition") && !(div.getAttribute("sensortype") != null && div.getAttribute("operator") != null
                && div.getAttribute("sensorvalue") != null && div.getAttribute("sensorunit") != null || (div.getAttribute("numberOfIntervals") != null
                && intervalTypes.indexOf(div.getAttribute("sensortype")) > -1))) {
                errors.push("Invalid Context Condition Node: No Sensor Type, Operator, Value, numberOfIntervals or Unit in " + $("#" + id).text());
            } else if (id.startsWith("ContextCondition") && div.getAttribute("operator") == "between" && div.getAttribute("sensorsecondvalue") == null) {
                errors.push("Invalid Context Condition Node: No Second Value for between operator in " + $("#" + id).text());
            }
        }
    }
    var message = "";
    for (var i = 0; i < errors.length; i++) {
        message += errors[i] + "<br/>";
    }
    message = message.substr(0, message.length - 5);
    $("#errors").html(message);
    $("#errors").show();
}