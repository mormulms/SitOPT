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
		
		$.ajax({
	        type: "POST",
	        url: "save",
	        data: {sitTemplate: xml, name: savename, saveId: savename, sitTempName: savename, description: savename}
	      }).done(function( msg ) {
	    	  alert(msg)
	      });
	}
}
function startRec() {
	
	 $.ajax({
	        type: "GET",
	        url: "StartRec",
	        data: {test5: "Start Recognition"}
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
