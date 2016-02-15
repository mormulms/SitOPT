
/*This Array containst the sensors and their respective units as array. 
 * Inorder to add a new sensor and its respective array of units please make an entry hier */


var sensorArray = [{"sensorName":"TempSensor", "sensorUnit":["Celcius", "Farenheit", "Kelvin"]},
                   {"sensorName":"RAMSensor", "sensorUnit":["MB RAM", "GB RAM", "TB RAM"]},
                   {"sensorName":"CPULoadSensor", "sensorUnit":["% CPU Load"]},
                   {"sensorName":"WatchDogSensor", "sensorUnit":["Response Code"]}
                   ];

// Iterate over the array and populate the sensor drop down list

for (var i = 0; i < sensorArray.length; i++) {
	var newOptionSensor = document.createElement("option");
	  newOptionSensor.textContent = sensorArray[i].sensorName;
	  $("#sensorType").append(newOptionSensor);
};
