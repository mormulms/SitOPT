function loadBtn() {
//	clearAll();
    $("#selectTempl").val('Choose a file');
    $("#loadbox").toggle();
    loadbox.setAttribute("indrawingarea", "true");
    $("#loadbox").draggable();
    if (loadCnt < 1) {
        load();
    };
}

var loadCnt = 0;
function load() {

    $(document).ready(function(){
        loadCnt++;
        $.ajax({
            type: "GET",
            url: "load",
            data: {test: "Datei Laden"}
        }).done(function( msg ) {
            //code to iterate situation templates, display choices in a list
            var templArray = JSON.parse(msg);
            for (var i=0; i < templArray.length; i++) {
                var newOption = document.createElement("option");
                newOption.textContent = templArray[i];
                $("#selectTempl").append(newOption);
            }
            $("#openTempl").click(function() {
                clearAll();
                var selTempl = $("#selectTempl").children(':selected').text();
                openSitTempl(selTempl);
            });
        });
    });
};

function save() {

    var savename = prompt("Unter welchem Namen soll das Template gespeichert werden?", "Unbenannt");

    if (savename == "") {
        alert("Geben sie einen Namen ein!");
    } else {
        var xml = getSituationTemplateAsXML(savename);
        xml = xml.replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, '');

        $.ajax({
            type: 'post',
            url: location.protocol + "//" + location.host + (location.port ? (":" + location.port) : "") + "/SitTempModelingTool/save",
            contentType: 'application/json',
            data: JSON.stringify({xml: xml, id: savename}),
            success: function() {
                alert("saved")
            },
            error: function (request, status, error) {
                alert("error occurred");
                alert(error);
                alert(status);
            }
        });
    }
}
function startRec() {
    if (!validate()) {
        $("errors").html($("#errors").html() + "<br>Please solve all problems above, before starting recognition");
        return;
    }

    var name = prompt("Unter welchen Namen soll das Template gespeichert werden?", "Unbenannt");
    while (name === "") {
        alert("Geben Sie einen Namen ein");
        name = prompt("Unter welchen Namen soll das Template gespeichert werden?", "Unbenannt");
    }
    var contexts = $("[type='contextnode']").not(".hidden");
    var mapping = new Array(contexts.length);
    for (var i = 0; i < contexts.length; i++) {
        var con = contexts[i];
        mapping[i] = prompt("Für welche Sensoren soll der Context \"" + $(con.children[0]).attr("contextname") + "\" verwendet werden?", "")
    }
    for (var i = 0; i < mapping.length; i++) {
        var result1 = mapping[i].split(",");
        mapping[i] = [];
        for (var j = 0; j < result1.length; j++) {
            var result2 = result1[j].trim();
            if (result2 !== "") {
                mapping[i].push(result2);
            }
        }
    }
    if (!mapping) {
        mapping = [];
    }

    $.ajax({
        "type": "POST",
        "url": "StartRec",
        "data": {
            "xml":getSituationTemplateAsXML(name).replace(/\r/g, "").replace(/\n/g, "").replace(/\t/g, ""),
            "mapping": mapping
        }
    }).done(function( msg ) {
        alert(msg)

    });
};

function clearAll() {
    var drawingArea = document.getElementById('drawingArea');
};

function exportXML() {

    if (!validate()) {
        $("#errors").html($("#errors").html() + "<br>Please solve all problems above, before you export as XML");
        return;
    }

    var exportname = prompt("Unter welchem Namen soll das Template exportiert werden?", "Unbenannt");

    if (exportname == "") {
        alert("Geben sie einen Namen ein!");
    } else {
        //Saving xml file locally
        var sitTemplateString = getSituationTemplateAsXML(exportname);
        var blob = new Blob([sitTemplateString], {type: "text/xml;charset=utf-8"});
        //saveAs(blob, "situationTemplate.xml");
        saveAs(blob, exportname+".xml");
    }
};

function openSitTempl(selTempl) {
    $(document).ready(function(){
        $("#loadbox").hide();
        //var templId = document.getElementById("selectTempl");
        $.ajax({
            type: "GET",
            url: "loadsituationtemplate",
            data: {templateId: selTempl}
        }).done(function( msg ) {
            //code to automodell the retrieved template
            parseAndTraverseXML(msg);
        });

    });
}
