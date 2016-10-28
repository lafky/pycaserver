$(window).load(function() {
	//function for text based reporting
	$(".monitor").each(function(){
		var elem = this
		var pv = $(this).data("pv");
		var ws = new WebSocket("ws://localhost:8888/monitor");
		//var ws = new WebSocket("ws://10.6.0.33:8888/monitor");
		ws.onopen = function() {
			ws.send(pv);
		};
		ws.onmessage = function(evt) {
			var data = JSON.parse(evt.data);
			if (data.msg_type === "monitor") {
				//if PV is number, truncate it
				if(typeof data.value == "number" && data.pvname!="SR00MOS01:FREQUENCY_MONITOR"){
					//Tunes need more precision
					if((data.pvname=="IGPF:X:SRAM:PEAKTUNE2") || (data.pvname=="IGPF:Y:SRAM:PEAKTUNE2")){
						$(elem).text((Math.round(data.value*1000))/1000);
					}else{
						$(elem).text((Math.round(data.value*100))/100);
					}
				}else{
        				$(elem).text(data.value);
				}
 
				//Build in overrides for PVs that return numbers instead of strings (i.e., TU Interlock)
				
				if (data.pvname == "SR02IR01MIR01:POSITION_STATUS"){
					if(data.value == "3"){$(elem).text("In");
					}else if(data.value == "4"){$(elem).text("Move");
					}else if(data.value == "2"){$(elem).text("Out");
					}else if(data.value == "1"){$(elem).text("Inv.");
					}else if(data.value == "0"){$(elem).text("Unk.");
					}
				}

 	      			if (data.pvname == "TS01TU01:TOPUP_INHIBIT_STATUS"){
					if(data.value == "1"){
						$(elem).text("Permitted");
					}else{
						$(elem).text("Inhibited");
					}
				}
				if (data.pvname == "TS01FPC01:FILL_STATUS"){
					if(data.value == "7"){
						$(elem).text("Top Up");
					}else if(data.value == "0"){
						$(elem).text("Unknown");
					}else if(data.value == "1"){
						$(elem).text("Stopped");
					}else if(data.value == "2"){
						$(elem).text("Continuous");
					}else if(data.value == "3"){
						$(elem).text("One Shot");
					}else if(data.value == "4"){
						$(elem).text("Pattern Fill");
					}else if(data.value == "5"){
						$(elem).text("Pattern Resume");
					}else if(data.value == "6"){
						$(elem).text("Next Shot");
					}else if(data.value == "8"){
						$(elem).text("Recovery");
					}else if(data.value == "9"){
						$(elem).text("Periodic");
					}else if(data.value == "10"){
						$(elem).text("Pattern Done");
					}else if(data.value == "11"){
						$(elem).text("Interlocked");
					}
				}
 				//Pass along severity in color form
				if (data.severity === 0){
					$(elem).css("color","#4cff4c");
				}else if  (data.severity === 1){
					$(elem).css("color","yellow");
				}else if (data.severity === 2){
					$(elem).css("color","red");
				}
			}
			if (data.msg_type === "connection") {
				//If communication is lost overwrite color of pv to white (as is the way of EPICs)
				if (data.conn===false){
					$(elem).css("color", "white");
				}
			}
		};
	});
	$(".statusMon").each(function(){
		var elem = this
		var pv = $(this).data("pv");
		var ws = new WebSocket("ws://localhost:8888/monitor");
		//var ws = new WebSocket("ws://10.6.0.33:8888/monitor");
		ws.onopen = function() {
			//window.alert("test0");
			ws.send(pv);
		};
		ws.onmessage = function(evt) {
			var data = JSON.parse(evt.data);
			//window.alert("fart");
			if (data.msg_type === "monitor") {
				var data = JSON.parse(evt.data);
				//window.alert("test");
				if (data.severity === 0){
					$(elem).css("background-color","#4cff4c");
					$(elem).css("color","black");
				}else if  (data.severity === 1){
					$(elem).css("background-color","yellow");
					$(elem).css("color","black");
				}else if (data.severity === 2){
					$(elem).css("background-color","red");
					$(elem).css("color","black");
				}
			}else if (data.msg_type === "connection"){	
				//window.alert("test1");	
				//If communication is lost overwrite color of pv to white (as is the way of EPICs)
				if (data.conn===false){
					$(elem).css("color", "white");
				}
			}
		};
	});
});
