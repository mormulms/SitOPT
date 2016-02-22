/**
 * Created by armin on 21.11.15.
 */
function validate() {
    var errors = [];
    var starts = [];
    var ends = [];
    var connections = jsPlumb.getConnections();
    // iterate over all connections
    for (var i = 0; i < connections.length; i++) {
        var connection = connections[i];
        var start = connection.sourceId;
        starts.push(start);
        var end = connection.targetId;
        ends.push(end);
        // check for illegal connections
        // Condition -> (Condition | Situation)
        // Operation -> Condition
        // Context -> (Operation | Situation)
        if (start.startsWith("Condition") && !end.startsWith("Operation")) {
            errors.push("Illegal Connection: " + $("#" + start).text() + " -> " + $("#" + end).text())
        } else if (start.startsWith("Operation") && !(end.startsWith("Operation") || end.startsWith("Situation"))) {
            errors.push("Illegal Connection: " + $("#" + start).text() + " -> " + $("#" + end).text())
        } else if (start.startsWith("Context") && !end.startsWith("Condition")) {
            errors.push("Illegal Connection: " + $("#" + start).text() + " -> " + $("#" + end).text())
        }
    }

    var draggables = $(".ui-draggable");

    // iterate over all nodes
    for (var i = 0; i < draggables.length; i++) {
        var drag = draggables[i];
        if ($(drag).hasClass("ui-droppable") || $(drag).hasClass("unselectable")) {
            continue;
        }
        var id = $(drag).attr("id");
        var div = $("#" + id + " div")[0];
        // validate the attributes
        if (id.startsWith("Situation")) {
            errors = validateSituation(id, div, starts, ends, errors);
        } else if (id.startsWith("Operation")) {
            errors = validateOperation(id, div, starts, ends, errors);
        } else if (id.startsWith("Condition")) {
            errors = validateCondition(id, div, starts, ends, errors);
        } else if (id.startsWith("Context")) {
            errors = validateContext(id, div, starts, ends, errors);
        }
    }
    recognizeCycles(errors);
    var message = "";
    for (var i = 0; i < errors.length; i++) {
        message += errors[i] + "<br/>";
    }
    message = message.substr(0, message.length - 5);
    $("#errors").html(message);
    $("#errors").show();
    return errors.length == 0;
}

/**
 * Recognizes cycles in Operations since those are the only ones, which can produce a cycle in an otherwise valid template.
 * @param errors array, that contains the error messages
 * @returns {*}
 */
function recognizeCycles(errors) {
    var ops = $('div[type^="operation"]:not(.hidden)');
    var visited = {};
    var finished = {};

    // preparations, sets all nodes to not visited and not finished (all outgoing connections tested)
    for (var i = 0; i < ops.length; i++) {
        var op = ops[i];
        var id = $(op).attr("id");
        visited[id] = false;
        finished[id] = false;
    }

    for (var i = 0; i < ops.length; i++) {
        var op = ops[i];
        // recursive depth first search.
        if (!(function dfs(o) {
                var id = $(o).attr("id");
                if (id in finished && finished[id]) {
                    return true;
                }
                if (id in visited && visited[id]) {
                    return false;
                }
                visited[id] = true;
                var parents = jsPlumb.getConnections().filter(function (connection) {
                    return connection.sourceId === id;
                });
                for (var j = 0; j < parents.length; j++) {
                    var parent = parents[j];
                    if ($("#" + parent.targetId).attr("type").startsWith("operation")) {
                        if (!dfs($("#" + parent.targetId))) {
                            return false;
                        }
                    }
                }
                finished[id] = true;
                return true;
            })(op)) {
            // add error to errors.
            errors.push("Invalid Operation Node: Cycle detected in " + $(op).attr("id"));
        }
    }
    return errors;
}

/**
 * Checks if the situation node has unset attributes.
 * @param id
 * @param div
 * @param starts
 * @param ends
 * @param errors
 * @returns {*}
 */
function validateSituation(id, div, starts, ends, errors) {
    var value = div.getAttribute("sitvalue");
    if (value == null || value == "") {
        errors.push("At least one situation does not have a name");
    } else if (ends.indexOf(id) == -1) {
        errors.push("Situation " + value + " not being used");
    } else if (ends.filter(function(end){return end === id}).length > 1) {
        errors.push("Situation " + value + " has too many inputs");
    }
    return errors;
}

/**
 * Checks if the operation node has unset attributes.
 * @param id
 * @param div
 * @param starts
 * @param ends
 * @param errors
 * @returns {*}
 */
function validateOperation(id, div, starts, ends, errors) {
    var name = div.getAttribute("oprname");
    var oprvalue = div.getAttribute("oprvalue");
    var negated = div.getAttribute("oprnegated");

    if (name == null || name == "") {
        errors.push("At least one operation does not have a name");
    } else if (oprvalue == null || oprvalue == "" || oprvalue == "null") {
        errors.push("Operation " + name + " does not have an operation value");
    } else if (negated == null || negated == "" || negated == "null") {
        errors.push("Operation " + name + " has not determined negation state");
    } else if (starts.indexOf(id) == -1) {
        errors.push("Operation " + name + " is never propagated");
    } else if (ends.indexOf(id) == -1) {
        errors.push("Operation " + name + " has no input");
    }
    return errors;
}

/**
 * Checks if the condition node has unset attributes.
 * @param id
 * @param div
 * @param starts
 * @param ends
 * @param errors
 * @returns {*}
 */
function validateCondition(id, div, starts, ends, errors) {
    var intervalTypes = ["intervalMinEqual", "intervalMin", "intervalMaxEqual", "intervalMax"];
    var name = div.getAttribute("conditionname");
    var operator = div.getAttribute("operator");
    var value1 = div.getAttribute("sensorvalue");
    var value2 = div.getAttribute("sensorsecondvalue");
    var numIntervals = div.getAttribute("numberofintervals");

    if (name == null || name == "") {
        errors.push("At least one condition does not have a name");
    } else if (operator == null || operator == "") {
        errors.push("Condition " + name + " does not have an operator");
    } else if (value1 == null || value1 == "") {
        errors.push("Condition " + name + " does not have a value for comparison");
    } else if (operator === "between" && (value2 == null || value2 == "")) {
        errors.push("Condition " + name + " does not have a second value for comparison");
    } else if (intervalTypes.indexOf(operator) > -1 && (numIntervals == null || numIntervals == "")) {
        errors.push("Condition " + name + " misses the amount of intervals");
    } else if (starts.indexOf(id) == -1) {
        errors.push("Condition " + name + " is not used in Operations");
    } else if (ends.indexOf(id) == -1) {
        errors.push("Condition " + name + " has no input");
    } else if (ends.filter(function (end) {return end === id;}).length > 1) {
        errors.push("Condition " + name + " has too many inputs");
    }
    return errors;
}

/**
 * Checks if the context node has unset attributes.
 * @param id
 * @param div
 * @param starts
 * @param ends
 * @param errors
 * @returns {*}
 */
function validateContext(id, div, starts, ends, errors) {
    var name = div.getAttribute("contextname");
    var type = div.getAttribute("sensortype");
    var unit = div.getAttribute("sensorunit");
    var inputtype = div.getAttribute('inputtype');
    var inputtypevalues = ['sensor', 'situation', 'static'];

    if (name == null || name == "") {
        errors.push("At least one context does not have a name");
    } else if (type == null || type == "") {
        errors.push("Context " + name + " does not have a type");
    } else if (unit == null || unit == "") {
        errors.push("Context " + name + " does not have a unit");
    } else if (starts.indexOf(id) == -1) {
        errors.push("Context " + name + " is never used");
    } else if (inputtype == null || inputtype == '') {
        errors.push('Context ' + name + ' has no input type');
    } else if (inputtypevalues.indexOf(inputtype) == -1) {
        errors.push('Context ' + name + ' has invalid input type');
    }
    return errors;
}