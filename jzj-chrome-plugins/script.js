
var scriptLoaded = true;
STATUS = {UNKNOW:0,FAIL:-1,SUCCESS:1}


/*如果执行需要返回，使用callback事件传递回到extension*/
function callback(obj) {
	window.postMessage({
		type: "EXECUTE_SCRIPT_CALLBACK",
		command: obj.command,
		message: obj.message,
		data: obj.data,
		status: obj.status,
		step: obj.step
	}, "*");
};

function go(stepIndex) {
	callback({
		status: 0,
		command: "go",
		step: stepIndex
	});
};

function run(stepIndex) {
	callback({
		status: 0,
		command: "run",
		step: stepIndex
	});
};

function pause(msg) {
	callback({
		status: 0,
		command: "pause",
		message: msg
	});
};

function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis * 1000;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
};

function getRandom(e,n){
     var list = [];
     if(e.length < n){
        n = e.length;
     }
     while(list.length < n){
         var bl = true;
         var r = Math.floor(Math.random() * e.length);
         for(var i=0; i<list.length; i++){
             if(list[i] == r){
                bl = false;
             }
        }
         if(bl){
            list.push(r);
         }
     }
     return list;
};

ISWAIT = false;

function nextCallBack(){
    while (true) {
        if (!ISWAIT){
        	callback({command:"next",message:null,data:null,status:0});   
        	return;
        }
    }
};

/*处理模板数据*/
function handlerTemplateData(obj) {
    var runStepScript = function(){
    	try{
			var node = document.createElement("script");
			node.setAttribute("type", "text/javascript");		
			node.setAttribute("name", "step_script_" + new Date().getTime());
			var _script = ['try{'];
			_script.push(obj.script);
			_script.push("	nextCallBack();");	
			_script.push("}catch(e){");
			_script.push("	callback({command:\"error\",message:e.stack,data:null,status:8});");
			_script.push("}");
			node.textContent = _script.join("");
			document.body.appendChild(node);
		}catch(e){
			console.log(e);
		}
    };		
	runStepScript();
	callback({message:'step script 处理完毕', data: null, status: 8});
}