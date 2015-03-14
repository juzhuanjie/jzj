 
function postMessage2bg() {
	window.postMessage({
		type: "EXECUTE_SCRIPT_CALLBACK",
		command: "check_insert_status",
		data: scriptLoaded
	}, "*");
};

