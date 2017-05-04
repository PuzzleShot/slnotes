// Enable the passage of the 'this' object through the JavaScript timers
 
var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;
 
window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeST__(vCallback instanceof Function ? function () {
    vCallback.apply(oThis, aArgs);
  } : vCallback, nDelay);
};
 
window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeSI__(vCallback instanceof Function ? function () {
    vCallback.apply(oThis, aArgs);
  } : vCallback, nDelay);
};

// Helper functions for verifying object existence and type

function is(parameter,objectName){ // Use to check if argument is passed
	return /*arguments.length == 1 ? (*/typeof parameter !== "undefined"/*) : (parameter.constructor.name == objectName)*/;
}

function testIfString(given,needsContent){ // Check if parameter is a string (as well as, optionally, if it has content)
	var result = false;
	if(is(given)){
		if((typeof given === "string") || (given instanceof String)){
			result = true;
			if((arguments.length >= 2) && ((needsContent == true) && (given == ""))){
				result = false;
			}
		}
	}
	return result;
}

isString = testIfString; // alias for testIfString

function testIfNumber(given,isNotZero){ // Check if parameter is a number (as well as, optionally, if it is not zero)
	var result = false;
	if(is(given)){
		if((typeof given === "number") || (given instanceof Number)){
			result = true;
			if((arguments.length >= 2) && ((isNotZero == true) && (given == 0))){
				result = false;
			}
		}
	}
	return result;
}

isNumber = testIfNumber; // alias for testIfNumber

function testIfBoolean(given){ // Check if parameter is a boolean
	var result = false;
	if(is(given)){
		if((typeof given === "boolean") || (given instanceof Boolean)){
			result = true;
		}
	}
	return result;
}

isBoolean = testIfBoolean; // alias for testIfBoolean

function toBoolean(given){ // Convert 0, 1, "0", "1", "true", and "false" to appropriate boolean values
	var result = false;
	if(is(given)){
		if(isBoolean(given)){
			result = given;
		}else{
			if(isNumber(given)){
				result = given > 0 ? true : false;
			}else if(isString(given)){
				result = given == "true" ? true : given == "1" ? true : false ;
			}else result = false;
		}
	}
	return result;
}

// Pseudo associative array implementation
function AssocArray(){
	// Inheritance
	Array.apply(this,arguments);
	
	// Properties
	this.keys = new Array();
	
	// Methods
	this.add = function(key,value){ // Add element to array for easy discovery via keys
		var success = false;
		if(arguments.length == 2){
			if(isString(key)){
					var previousIndex = this.find(key,true);
					if(!is(previousIndex)){
						this.keys.push(new Array(key,this.length-1));
						this.push(value);
						success = this.length-1;
					}else{
						this[previousIndex] = value;
						success = previousIndex;
					}
			}
		}
		return success;
	}
	
	this.remove = function(key){ // Remove element(s) by key or reference
		var item = this.find(key);
		if(is(item)){
			var index = this.indexOf(item);
			this.splice(index,1);
			this.keys.splice(index,1);
		}
	}
	
	this.index.find = function(key,returnIndex){
		var result = void 0;
		for(var i=0;i<this.length;i++){
			if(this.keys[i][0] == key){
				if(is(returnIndex)){
					result = toBoolean(returnIndex) ? this.keys[i][1] : this[this.keys[i][1]];
				}
				i = this.length;
			}
		}
		return result;
	}
}

// XMLHttpRequest-powered asynchronous JSON loader

function JSONLoader(){
	if(window.XMLHttpRequest){
		this.xmlhttp = new XMLHttpRequest();
	}else this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	
	this.xmlhttp.parentJSONLoader = this;
	
	this.buffer = Object.create(null);
	
	this.queue = new Array();
	
	this.enqueue = function(url,thisArg,method/*,argument1,argument2,...argumentN*/){
		var args = Array.prototype.slice.call(arguments,3);
		var callback = new Callback(method,thisArg);
		callback.appendArrayAsArguments(args);
		var queueItem = new Array(url,callback);
		this.queue.push(queueItem);
	};
	
	this.processQueue = function(){
		if(this.queue.length > 0){
			this.xmlhttp.onload = function(){
				var data = this.responseText;
				if(isString(data,true)){
					data = JSON.parse(data);
				}
				this.parentJSONLoader.queue.shift()[1].execute(data);
				this.parentJSONLoader.processQueue();
			};
			this.xmlhttp.open("GET",this.queue[0][0],true);
			this.xmlhttp.setRequestHeader("Content-Type","application/json");
			this.xmlhttp.send();
		}
	}
	
	this.load = function(url){
		this.xmlhttp.onload = function(){ var data = this.responseText; this.parentJSONLoader.store(data); };
		this.xmlhttp.open("GET",url,true);
		this.xmlhttp.setRequestHeader("Content-Type","application/json");
		this.xmlhttp.send();
	}
	
	this.store = function(data){
		if(data != ""){
			this.buffer = JSON.parse(data);
			if("callback" in this){
				if(this.callback instanceof Callback){
					this.callback.execute(oThis.buffer);
				}else{
					oThis = this;
					thisArg = this.registrar;
					if("arg" in this){
						this.callback.call(thisArg,oThis.buffer,oThis.arg);
					}else this.callback.call(thisArg,oThis.buffer);
				}
			}
		}
	}
	
	this.registerCallback = function(thisArg,method,arg){
		if(thisArg instanceof Callback){
			this.callback = thisArg;
		}else{
			this.registrar = thisArg;
			this.callback = method;
			if(arguments.length == 3){
				this.arg = arg;
			}
		}
	}
}

// Callback object to allow building of callback functions at various points in code execution for call by JSONLoader, XMLHttpRequest, and others

function Callback(method,oThis/*,argument1,argument2,...argumentN*/){
	this.method = method;
	this.oThis = oThis;
	if(arguments.length > 2){
		this.args = Array.prototype.slice.call(arguments,2);
	}
	
	this.appendArguments = function(/*argument1,argument2,...argumentN*/){
		if(arguments.length > 0){
			if("args" in this){
				this.args = this.args.concat(Array.from(arguments));
			}else this.args = Array.from(arguments);
		}
	}
	
	this.appendArrayAsArguments = function(array){
		if("args" in this){
			this.args = this.args.concat(array);
		}else this.args = array;
	}
	
	this.prependArguments = function(/*argument1,argument2,...argumentN*/){
		if(arguments.length > 0){
			if("args" in this){
				this.args = Array.from(arguments).concat(this.args);
			}else this.args = Array.from(arguments);
		}
	}
	
	this.prependArrayAsArguments = function(array){
		if("args" in this){
			this.args = array.concat(this.args);
		}else this.args = array;
	}

	this.execute = function(/*argument1,argument2,...argumentN*/){
		if(arguments.length > 0){
			if("args" in this){
				var args = this.args.concat(Array.from(arguments));
			}else var args = Array.from(arguments);
		}else args = this.args;
		if(is(args)){
			this.method.apply(this.oThis,args);
		}else this.method.call(this.oThis);
	}
}

// Regular expression defining decimal numbers

var decimalNumber = "(-*[0-9]*\.*[0-9]+)";

// Helper functions for converting numerical data (file sizes, dates, etc.) into user-friendly text

function adaptByteSize(number){
	var names = [
		"kilobyte",
		"megabyte",
		"gigabyte"
	];
	if(number > 1024){
		var index = 0;
		var baseCheck = Math.floor((number/1024)*10)/10;
		while((baseCheck > 1024) && (index < (names.length-1))){
			baseCheck = Math.floor((baseCheck/1024)*10)/10;
			index++;
		}
		number = baseCheck;
		if(number == 1){
			number = number+" "+names[index];
		}else number = number+" "+names[index]+"s";
	}else if(number == 1){
		number = number+" byte";
	}else number = number+" bytes";
	return number;
}

// FormatBuffer helper object for wrapping text in HTML elements

function FormatBuffer(){
	// Object
	this.array = new Array();
	this.length = 0;
	
	// Methods
	this.format = function(type,data){
		var result = new Object(null);
		switch(type){
			case "heading":
				result = document.createElement("strong");
				$(result).addClass("name");
				$(result).text(data);
				break;
			case "subheading":
			case "note":
				result = document.createElement("p");
				$(result).addClass("note");
				$(result).text(data);
				break;
			case "paragraph":
				result = document.createElement("p");
				$(result).text(data);
				break;
			case "banner":
				var image = document.createElement("img");
				image.src = data;
				var container = document.createElement("div");
				$(container).addClass("container");
				$(container).append(image);
				result = document.createElement("div");
				$(result).addClass("image");
				$(result).append(container);
				break;
			case "image":
				result = document.createElement("img");
				result.src = data;
				break;
			default:
				console.log("No appropriate type defined for FormatBuffer.");
		}
		return result;
	}
	
	this.buffer = function(element/*,element2,element3...elementN*/){
		for(var i=0;i<arguments.length;i++){
			if(arguments[i] instanceof Element){
				this.array.push(arguments[i]);
				this.length = this.array.length;
			}else if(arguments[i] instanceof UIElement){
				this.array.push(arguments[i].element);
				this.length = this.array.length;
			}else console.log("FormatBuffer only accepts Element objects for buffering.");
		}
	}
	
	this.bundle = function(){
		var bundle = $();
		if(this.array.length > 0){
			do{
				if(this.array[0] instanceof UIElement){
					bundle = bundle.add(this.array.shift().element);
				}else bundle = bundle.add(this.array.shift());
			}while(this.array.length > 0);
		}
		this.length = this.array.length;
		return bundle;
	}
	
	this.expel = function(){
		var expulsion = "";
		if(this.array.length > 0){
			do{
				expulsion += this.array.shift().outerHTML;
			}while(this.array.length > 0);
		}
		this.length = this.array.length;
		return expulsion;
	}
	
	this.dump = function(){
		this.array = new Array();
		this.length = 0;
	}
}
