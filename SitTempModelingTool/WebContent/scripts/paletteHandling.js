$(document).ready(function() {

	//Binding click function to Palette
    $("#palette").click(function() {
        if($("#palette").hasClass("shrunk")) {
           showPalette();
		}
        else {
           hidePalette();
		}
    });
});

function showPalette() {

	// reset width to original CSS width
	$("#palette").removeClass("shrunk");

	// show all palette entries
	$("#paletteLabel").hide();

	$(".paletteEntrySituation").show();
	$(".paletteEntryContextCondition").show();
	$(".paletteEntryOperation").show();
}

function hidePalette() {

	$("#palette").addClass("shrunk");

	// hide all palette entries
	$(".paletteEntrySituation").hide();
	$(".paletteEntryContextCondition").hide();
	$(".paletteEntryOperation").hide();

	$("#paletteLabel").show();
}