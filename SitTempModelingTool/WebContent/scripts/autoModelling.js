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
        };
        r.readAsText(f);
    } else {
        alert("Failed to load file");
    }
}

function parseAndTraverseXML(contents) {
    // parse xml with jquery to allow xpath
    var xml = $($.parseXML(contents));
    var leftVal = 10 + "px";
    var topVal = 10 + "px";
    var leftDiff = 100;

    // get all nodes
    var situations = xml.xpath("//situationNode");
    var operations = xml.xpath("//operationNode");
    var conditions = xml.xpath("//conditionNode");
    var contexts = xml.xpath("//contextNode");

    // iterate over situations
    for (var i = 0; i < situations.length; i++) {
        var situation = situations[i];
        // create div and set attributes
        var div = document.createElement("div");
        $(div).addClass("nodeTemplateSituation");
        div.setAttribute("indrawingarea", "true");
        div.setAttribute("type", "situationnode");

        // set location
        topVal = parseInt(topVal, 10);
        div.style.top = (topVal) + "px";

        leftVal = parseInt(leftVal, 10);
        div.style.left = (leftVal + leftDiff) + "px";
        leftDiff = leftDiff + 300;

        // create div, which saves the properties of a node
        var propDiv = document.createElement("div");
        $(propDiv).hide();
        div.setAttribute("id", $(situation).attr("id"));
        propDiv.setAttribute("sitvalue", $(situation).attr("name"));
        $(div).text($(situation).attr("name"));
        $(div).append(propDiv);
        $(div).appendTo($(".drawingArea"));
        var count = parseInt($(situation).attr("id").match(/\d+$/));
        // set the amount of situations to hte highest index of situations.
        if (count != 'NaN') {
            countSituation = count > countSituation ? count : countSituation;
        }
        makeDraggable($(div));
    }

    leftDiff = 100;

    // iterate over operations
    for (var i = 0; i < operations.length; i++) {
        var operation = operations[i];
        // create div and set attributes
        var div = document.createElement("div");
        $(div).addClass("nodeTemplateOperation");
        div.setAttribute("indrawingarea", "true");
        div.setAttribute("type", "operationnode");
        div.setAttribute("source", "fromModelling");

        // set location
        topVal = parseInt(topVal, 10);
        div.style.top = (topVal + 200) + "px";

        leftVal = parseInt(leftVal, 10);
        div.style.left = (leftVal + leftDiff) + "px";
        leftDiff = leftDiff + 300;

        // create div, which saves the properties of a node
        var propDiv = document.createElement("div");
        $(propDiv).hide();
        div.setAttribute("id", $(operation).attr("id"));
        propDiv.setAttribute("oprname", $(operation).attr("name"));
        propDiv.setAttribute("oprvalue", $(operation).xpath("type").text());
        propDiv.setAttribute("oprnegated", $(operation).xpath("negated").text());
        $(div).text($(operation).attr("name"));
        var count = parseInt($(operation).attr("id").match(/\d+$/));
        // set the amount of situations to hte highest index of operations.
        if (count != 'NaN') {
            countOpr = count > countOpr ? count : countOpr;
        }
        $(div).append(propDiv);
        $(div).appendTo($(".drawingArea"));
        makeDraggable($(div));
    }

    leftDiff = 100;

    // iterate over conditions
    for (var i = 0; i < conditions.length; i++) {
        var condition = conditions[i];
        // create div and set attributes
        var div = document.createElement("div");
        var propDiv = document.createElement("div");
        $(div).addClass("nodeTemplateCondition");
        div.setAttribute("indrawingarea", "true");
        div.setAttribute("type", "conditionnode");
        div.setAttribute("id", $(condition).attr("id"));

        // set location
        topVal = parseInt(topVal, 10);
        div.style.top = (topVal + 400) + "px";
        leftVal = parseInt(leftVal, 10);
        div.style.left = (leftVal + leftDiff) + "px";
        leftDiff = leftDiff + 300;

        // create div, which saves the properties of a node
        $(propDiv).hide();
        propDiv.setAttribute("conditionname", $(condition).attr("name"));
        propDiv.setAttribute("operator", $(condition).xpath("opType").text());
        var values = $(condition).xpath("condValues");
        propDiv.setAttribute("sensorvalue", $(values[0]).text());
        if (values.length == 2) {
            propDiv.setAttribute("sensorsecondvalue", $(values[1]).text());
        }
        var numIntervals = $(condition).xpath("amountIntervals");
        if (numIntervals.length > 0) {
            propDiv.setAttribute("numberofintervals", $(numIntervals).text());
        }
        var count = parseInt($(condition).attr("id").match(/\d+$/));
        // set the amount of situations to hte highest index of conditions.
        if (count != 'NaN') {
            countCondition = count > countCondition ? count : countCondition;
        }
        $(div).text($(condition).attr("name"));
        $(div).append(propDiv);
        $(div).appendTo($(".drawingArea"));
        makeDraggable($(div));
    }

    leftDiff = 100;

    // iterate over contexts
    for (var i = 0; i < contexts.length; i++) {
        var context = contexts[i];
        // create div and set attributes
        var div = document.createElement("div");
        var propDiv = document.createElement("div");
        $(div).addClass("nodeTemplateContext");
        div.setAttribute("indrawingarea", "true");
        div.setAttribute("type", "contextnode");
        div.setAttribute("id", $(context).attr("id"));

        // set location
        topVal = parseInt(topVal, 10);
        div.style.top = (topVal + 600) + "px";
        leftVal = parseInt(leftVal, 10);
        div.style.left = (leftVal + leftDiff) + "px";
        leftDiff = leftDiff + 300;

        // create div, which saves the properties of a node
        $(propDiv).hide();
        propDiv.setAttribute("contextname", $(context).attr("name"));
        propDiv.setAttribute("sensortype", $(context).attr("type"));
        propDiv.setAttribute("sensorunit", $(context).xpath("measureName").text());
        propDiv.setAttribute("inputtype", $(context).xpath("inputType").text());
        $(div).text($(context).attr("name"));
        var count = parseInt($(context).attr("id").match(/\d+$/));
        // set the amount of situations to hte highest index of conditions.
        if (count != 'NaN') {
            countContext = count > countContext ? count : countContext;
        }
        $(div).append(propDiv);
        $(div).appendTo($(".drawingArea"));
        makeDraggable($(div));
    }

    // set connections that go into operations
    for (var i = 0; i < operations.length; i++) {
        var current = $(operations[i]).attr("id") + "_top";
        var parents = $(operations[i]).xpath("parent");
        for (var j = 0; j < parents.length; j++) {
            var parent = $(parents[j]).attr("parentID");
            jsPlumb.ready(function () {
                jsPlumb.connect({uuids: [current, parent]});
            });
        }
    }

    // set connections that go into conditions
    for (var i = 0; i < conditions.length; i++) {
        var current = $(conditions[i]).attr("id") + "_top";
        var parents = $(conditions[i]).xpath("parent");
        for (var j = 0; j < parents.length; j++) {
            var parent = $(parents[j]).attr("parentID");
            jsPlumb.ready(function () {
                jsPlumb.connect({uuids: [current, parent]});
            });
        }
    }

    // set connections that go into contexts
    for (var i = 0; i < contexts.length; i++) {
        var current = $(contexts[i]).attr("id");
        var parents = $(contexts[i]).xpath("parent");
        for (var j = 0; j < parents.length; j++) {
            var parent = $(parents[j]).attr("parentID");
            jsPlumb.ready(function () {
                jsPlumb.connect({uuids: [current, parent]});
            });
        }
    }
}