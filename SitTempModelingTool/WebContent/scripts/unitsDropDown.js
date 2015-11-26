
/* This function populates the units drop down list according to the selected sensor */

function configureDropDownLists(typeInput,unit) {

	
	for (var i = 0; i < sensorArray.length; i++) {
		if (typeInput.value == sensorArray[i].sensorName) {
			var unitArray = sensorArray[i].sensorUnit;
			unit.options.length = 0;
			for (var j = 0; j < unitArray.length; j++) {
				createOption(unit, unitArray[j], unitArray[j]);
			}
		}
		
	};
	
	function createOption(type, text, value) {
        
		var opt = document.createElement('option');
		opt.value = value;
		opt.text = text;
		type.options.add(opt);
	}
}