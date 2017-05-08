/*
*
*   All code herein is property of Jon H Lambert.
*   Do not claim as your own. I know you didn't write it.
*   http://www.jonhlambert.com/
*
*/

// Helper functions for use by objects that contain HTML elements
/*function jUI(selector){
  if($(selector).length > 0){
    this.target = $(selector);
  }
  
  this.attach = function(element,prop){
    for(var i=0;i<this.target.length;i++){
      this.target[i][prop] = element;
    }
  }
}

$j = new jUI();*/

function createElement(selector,props){
	// Helper function for creating elements that show up in objects' element property
  var tag = /^(?![#\.])([^#\.]+)/gi;
  var id = /#+(.*)(?![#\.])/gi;
  var classes = /\.+(.*)[\.#]/gi;
  var data = new Object();
  data.tag = tag.exec(selector)[1];
  tagId = id.exec();
  if(tagId != null){
    data.id = tagId[1];
  }
  tagClass = new Array();
  tagClass.push(classes.exec(selector));
  while(tagClass[0] != null){
    tagClass.push(tagClass[0][1]);
  }
  if(tagClass.length > 1){
    tagClass.shift();
    data.class = tagClass.join(" ");
  }
  var element = document.createElement(data.tag);
  if(is(data.class)){ element.className = data.class; }
  if(is(data.id)){element.id = data.id; }
  return element;
}

function attachCreatedElement(selector,props,target,key){
	// Expands createElement helper to allow creation and attachment in one line
	var element = is(props) ? createElement(selector,props) : createElement(selector);
	target[key] = element;
	element.parentElement = target;
	return element;
}

function appendCreatedElement(selector,props,target,key){
	// Expands attachCreatedElement helper to also append the new element to the target's DOM
	var element = attachCreatedElement(selector,props,target,key);
	$(target).append(element);
	return element;
}

function prependCreatedElement(selector,props,target,key){
	// Expands attachCreatedElement helper to also prepend the new element to the target's DOM
	var element = attachCreatedElement(selector,props,target,key);
	$(target).prepend(element);
	return element;
}

// Core UI framework objects

function UIElement(tag,classes){
	// Javascript
	if(arguments.length == 1){
		attachCreatedElement(tag,"",this,"element");
		this.tag = tag;
	}else if(arguments.length == 2){
		attachCreatedElement(tag,classes,this,"element");
	}else this.element;
	
	this.element.parentUIElement = this;
}

/*function IndexedUIElement(tag,classes){
	// Inheritance
	if(is(classes)){
		UIElement.call(this,tag,classes);
	}else if(is(tag)){
		UIElement.call(this,tag);
	}
	
	// Javascript
	this.index = new AssocArray();
	
	// Methods
	this.setParentElement = function(given){
		if(is(given)){
			if(isElement(given)){
				while(is(given.parentElement) && isElement(given.parentElement)){
					given = given.parentElement;
				}
				this.parentElement = given;
		}
	}
	
	this.appendElement = function(tag,classes,target,propname){
		
	}
}*/

function UIWidget(tag,classes){
	// Inheritance
	if(arguments.length == 1){
		UIElement.call(this,tag);
	}else if(arguments.length == 2){
		UIElement.call(this,tag,classes);
	}else UIElement.call(this);
	
	// Properties
	this.responseListeners = new Array();
	
	// Javascript	
	this.element.parentWidget = this;
	this.respond = function(){
		if(is(this.resize)){
			this.resize();
		}
		for(var i=0;i<this.responseListeners.length;i++){
			this.responseListeners[i].respond();
		}
	};
	resizeRegistry.push(this);
	
	this.registerResponseListener = function(given){
		var registered = new Array();
		if(given instanceof UIWidget){
			var index = this.responseListeners.indexOf(given);
			if(index < 0){
				this.responseListeners.push(given);
				registered.push(this.responseListeners.length-1);
			}
		}
		return registered;
	}
	
	this.deregiserResponseListener = function(given){
		var deregistered = new Array();
		if(given instanceof UIWidget){
			var index = this.responseListeners.indexOf(given);
			if(index >= 0){
				deregistered.concat(this.responseListeners.splice(index,1));
			}
		}
		return deregistered;
	}
}

UIWidget.prototype = Object.create(UIElement.prototype);
UIWidget.prototype.constructor = UIWidget;

function UIFormWidget(tag,classes,type){
	// Inheritance
	if(arguments.length >= 1){
		UIWidget.call(this,tag);
		if(arguments.length >= 2){
			UIWidget.call(this,tag,classes);
			if(arguments.length == 3){
				var input = prependCreatedElement("input","",this.element,"input"); //this.element.input
				input.type = type;
			}
		}
	}else UIWidget.call(this);
}

UIFormWidget.prototype = Object.create(UIWidget.prototype);
UIFormWidget.prototype.constructor = UIFormWidget;

function UIWidgetFocusable(tag,classes){
	// Inheritance
	if(arguments.length == 1){
		UIWidget.call(this,tag);
	}else if(arguments.length == 2){
		UIWidget.call(this,tag,classes);
	}else UIWidget.call(this);
	
	this.focus = function(){
		if(!("placeholder" in this)){
			togglePlanes();
			var placeholder = document.createElement(this.tag);
			$(placeholder).addClass("placeholder");
			$(placeholder).addClass(this.element.className);
			$(placeholder).css("height",$(this.element).innerHeight()+"px");
			var absoluteLeft = $(this.element).offset().left;
			var absoluteTop = $(this.element).offset().top-RegExp(decimalNumber,"g").exec($(this.element).css("margin-top"))[0].valueOf();
			var originalWidth = $(this.element).innerWidth();
			this.placeholder = placeholder;
			$(this.element).after(placeholder);
			$(this.element).detach();
			$("#focus").append(this.element);
			$(this.element).css("position","absolute");
			$(this.element).css("top",absoluteTop+"px");
			$(this.element).css("left",absoluteLeft+"px");
			$(this.element).css("width",originalWidth+"px");
			zoomFocusPlane();
			$("#foreground").addClass("shrink");
		}
	}
	
	this.unfocus = function(){
		if("placeholder" in this){
			togglePlanes();
			$(this.element).detach();
			$(this.placeholder).after(this.element);
			$(this.placeholder).remove();
			delete this.placeholder;
			$(this.element).css("position","");
			$(this.element).css("top","");
			$(this.element).css("left","");
			$(this.element).css("width","");
		}
	}
}

UIWidgetFocusable.prototype = Object.create(UIWidget.prototype);
UIWidgetFocusable.prototype.constructor = UIWidgetFocusable;

function TitleBar(logo,title,canFloat,subtitle,size,overThreshold){
	// Inheritance
	UIWidget.call(this,"div","bar title");
	
	// Javascript
	this.doesFloat = canFloat;
	if(testIfString(title,true)){
		this.title = title;
	}
	if(testIfString(subtitle,true)){
		this.subtitle = subtitle;
	}
	if(overThreshold instanceof UIElement){
		this.overTarget = overThreshold.element;
	}else if(overThreshold instanceof Element){
		this.overTarget = overThreshold;
	}else if(testIfNumber(overThreshold,false) && (overThreshold >= 0)){
		this.overTarget = overThreshold;
	}
	
	// HTML
	if(this.doesFloat == true){
		$(this.element).addClass("float");
	}
	var content = appendCreatedElement("div","content",this.element,"contents");
	switch(size){
		case "SD":
		case "qHD":
		case "HD":
		case "FHD":
		case "QuadHD":
			content = appendCreatedElement("div","pane "+size,this.element.contents,"pane");
		default:
			break;
	}
	var heading = appendCreatedElement("div","heading",content,"heading");
	if(testIfString(logo,true)){
		var barLogo = appendCreatedElement("img","logo",heading,"logo");
		barLogo.src = logo;
	}
	if("title" in this){
		var headingTitleBox = appendCreatedElement("div","title",heading,"titleBox");
		var headingTitle = appendCreatedElement("span","",headingTitleBox,"titleText");
		$(headingTitle).html(this.title);
		if("subtitle" in this){
			$(headingTitleBox).addClass("two");
			var headingSubtitle = appendCreatedElement("span","",headingTitleBox,"subtitleText");
			$(headingSubtitle).html(this.subtitle);
		}
	}
	if("overTarget" in this){
		$(document).on("scroll",null,this,function(evt){
			var contentStart = evt.data.overTarget;
			if(evt.data.overTarget instanceof Element){
				contentStart = $(evt.data.overTarget).offset().top-$(evt.data.element).outerHeight();
			}
			if(window.scrollY <= contentStart){
				$(evt.data.element).removeClass("over");
			}else $(evt.data.element).addClass("over");
		});
	}
	
	// Methods
	this.setTitle = function(given){
		if(testIfString(given,true)){
			this.title = given;
			$(this.getContentHolder().heading.titleBox.titleText).html(given);
		}
	}
	
	this.getTitle = function(){
		return this.title;
	}
	
	this.setSubtitle = function(given){
		if(testIfString(given,true)){
			this.subtitle = given;
			$(this.getContentHolder().heading.titleBox.subtitleText).html(given);
		}
	}
	
	this.getSubtitle = function(){
		return this.subtitle;
	}
	
	this.getContentHolder = function(){
		var contentHolder = this.element.contents;
		if("pane" in this.element.contents){
			contentHolder = this.element.contents.pane;
		}
		return contentHolder;
	}
	
	this.resize = function(){
		var start = this.getContentHolder();
		$(start.heading.titleBox).css("max-width",($(start).width()-$(start.heading.logo).outerWidth(true))+"px");
	}
}

/*function TabBar(sizePref,lookPref){
	// Inheritance
	UIWidget.call(this,"div","bar tabbed");
	
	// Javascript
	this.tabs = new Array();
	switch(sizePref){
		case "uniform":
			this.preference = sizePref;
		default:
			break;
	}
	
	// HTML
	var strip = appendCreatedElement("div","tabs",this.element,"tabs");
	switch(lookPref){
		case "up":
			$(this.element).addClass(lookPref);
		default:
			break;
	}
	var clear = appendCreatedElement("span","clear",this.element,"clear");
	
	// Methods
	this.add = function(given){
		for(var i=0;i<arguments.length;i++){
			if(arguments[i] instanceof Tab){
				var tab = arguments[i];
				var index = this.tabs.indexOf(tab);
				if(index < 0){
					if(!is(tab.getParentTabBar())){
						tab.setParentTabBar(this);
						this.tabs.push(tab);
						$(this.element.tabs).prepend(tab.element);
					}
				}
			}
		}
	}
	
	this.remove = function(given){
		var results = new Array();
		for(var i=0;i<arguments.length;i++){
			if(arguments[i] instanceof Tab){
				var tab = arguments[i];
				var index = this.tabs.indexOf(tab);
				if(index >= 0){
					results = results.concat(this.tabs.splice(index,1));
				}
				if(tab.getParentTabBar == this){
					tab.setParentTabBar();
				}
			}
		}
		return results;
	}
	
	this.resize = function(given){
		if(isString(given)){
			switch(given){
				case "uniform":
					this.preference = sizePref;
					break;
				case "none":
					delete this.preference;
				default:
					break;
			}
		}
		if(is(this.preference)){
			var preference = this.preference;
		}
		var tabs = $(this.element.tabs).children("div.tab");
		switch(preference){
			case "uniform":
				var width = $(this.element).width();
				var count = tabs.length;
				width /= count;
				$(tabs).css("width",width+"px");
				break;
			default:
				var width = 0;
				$(tabs).css("width","");
				for(var i=0;i<tabs.length;i++){
					width += $(tabs[i]).width();
				}
				$(this.element.tabs).css("width",width+"px");
				break;
		}
	}

	this.setCurrentTab = function(tab){
		if(is(tab)){
			if(tab instanceof Tab){
				var index = this.tabs.indexOf(tab);
				if(index >= 0){
					var tabs = $(this.element.tabs).children("div.tab");
					$(tabs).removeClass("active");
					$(tab.element).addClass("active");
				}
			}else if(isNumber(tab)){
				if((tab >= 0) && (tab < this.tabs.length)){
					var tabs = $(this.element.tabs).children("div.tab");
					$(tabs).removeClass("active");
					$(this.tabs[tab].element).addClass("active");
				}
			}
		}
	}
}

TabBar.prototype = Object.create(UIWidget.prototype);
TabBar.prototype.constructor = TabBar;

function Tab(text,callback){
	// Inheritance
	UIWidget.call(this,"div","tab");
	
	// Javascript
	if(isString(text,true)){
		this.text = text;
	}
	if(callback instanceof Callback){
		this.callback = callback;
	}
	
	// HTML
	var name = appendCreatedElement("div","",this.element,"tabText");
	$(name).html(text);
	$(this.element).on("click",function(){
		if(is(this.parentWidget.parentTabBar)){
			this.parentWidget.parentTabBar.setCurrentTab(this.parentWidget);
		}
		if(is(this.parentWidget.callback)){
			this.parentWidget.callback.execute();
		}
	});
	
	// Methods
	this.setParentTabBar = function(given){
		if(is(given) && (given instanceof TabBar)){
			if(is(this.parentTabBar)){
				this.parentTabBar.remove(this);
			}
			this.parentTabBar = given;
		}else{
			$(this.element).detach();
			delete this.parentTabBar;
		}
	}
	
	this.getParentTabBar = function(){
		return is(this.parentTabBar) ? this.parentTabBar : void 0;
	}
	
	this.setText = function(given){
		if(isString(given,true)){
			this.text = given;
			$(this.element.tabText).html(given);
		}
	}
	
	this.getText = function(){
		return this.text;
	}
}

Tab.prototype = Object.create(UIWidget.prototype);
Tab.prototype.constructor = Tab;*/

function Dialog(title,subtitle,showClose){
	// Inheritance
	UIWidget.call(this,"div");
	
	// HTML
	$(this.element).addClass("dialog");
	this.element.parentDialog = this;
	var titlebar = appendCreatedElement("div","titlebar",this.element,"titlebar"); // this.element.titlebar
	if((arguments.length >= 2) && testIfString(subtitle,true)){
		$(titlebar).addClass("two");
		var titlebarTitle = appendCreatedElement("strong","title",titlebar,"titlebarTitle"); // this.element.titlebar.titlebarTitle
		$(titlebarTitle).text(title);
		var titlebarSubtitle = appendCreatedElement("em","subtitle",titlebar,"subtitle"); // this.element.titlebar.subtitle
		$(titlebarSubtitle).text(subtitle);
	}else $(this.element.titlebar).text(title);
	if((arguments.length >= 3) && (showClose == true)){
		$(this.element).addClass("closeable");
		appendCreatedElement("span","close",this.element.titlebar,"closer");
		$(this.element.titlebar.closer).html("&#x00d7;");
		this.element.titlebar.closer.parentDialog = this;
		$(this.element.titlebar.closer).on("click",function(){
			this.parentDialog.close();
		});
	}
	appendCreatedElement("div","content",this.element,"content");
	appendCreatedElement("div","clear",this.element.content,"clear");
	
	// Javascript
	/*this.element.uiResponse = function(){
		this.parentDialog.resize();
	};
	resizeRegistry.push(this);*/
	
	// Methods
	this.resize = function(){
		var maxHeight = window.innerHeight-64-$(this.element.titlebar).height();
		$(this.element).css("max-height",maxHeight+"px");
		$(this.element.content).css("max-height",maxHeight+"px");
		$(this.element).css("max-width",(window.innerWidth-64)+"px");
		$(this.element).css("top",((window.innerHeight-$(this.element).outerHeight())/2)+"px");
	}
	
	this.setContent = function(content/*,content2,content3...contentN*/){
		$($(this.element.content).children()).detach();
		for(var i=0;i<arguments.length;i++){
			if(arguments[i] instanceof FormatBuffer){
				$(this.element.content).append(arguments[i].bundle());
			}else if(arguments[i] instanceof UIElement){
				$(this.element.content).append(arguments[i].element);
			}else if(arguments[i] instanceof Element){
				$(this.element.content).append(arguments[i]);
			}
		}
		$(this.element.content).append(this.element.content.clear);
	}
	
	this.addContent = function(content/*,content2,content3...contentN*/){
		for(var i=0;i<arguments.length;i++){
			if(arguments[i] instanceof FormatBuffer){
				$(this.element.content.clear).detach();
				$(this.element.content).html($(this.element.content).html()+arguments[i].expel());
				$(this.element.content).append(this.element.content.clear);
			}else if(arguments[i] instanceof UIElement){
				$(this.element.content.clear).before(arguments[i].element);
			}else if(arguments[i] instanceof Element){
				$(this.element.content.clear).before(arguments[i]);
			}
		}
	}
	
	this.setParentApp = function(given){
		if(given instanceof Engine){
			this.parentApp = given;
		}
	}
	
	this.close = function(){
		if("parentApp" in this){
			this.parentApp.closeDialog();
		}
	}
}

function OptionBox(showText,compact){
	// Inheritance
	UIWidget.call(this,"div","options");
	
	// Object
	this.options = new Array();
	this.parentUIWidget = false;
	if(is(compact) && (compact == true)){
		this.compact = true;
	}
	
	// HTML
	//$(this.element).addClass("options");
	if(is(showText) && (showText == true)){
		$(this.element).addClass("textual");
	}
	appendCreatedElement("img","button",this.element,"overflow"); //this.element.overflow
	this.element.overflow.src = "http://jonhlambert.com/ui/overflow.svg";
	this.element.overflow.parentOptionBox = this;
	$(this.element.overflow).on("click",function(){
		var widget = this.parentOptionBox.parentUIWidget;
		var menu = this.parentOptionBox.element.menu;
		$(menu).toggleClass("open");
		if(widget instanceof UIWidgetFocusable){
			if($(menu).hasClass("open")){
				widget.focus();
			}else widget.unfocus();
		}
	});
	appendCreatedElement("div","menu",this.element,"menu"); //this.element.menu
	
	// Methods
	this.add = function(option/*,option2,...optionN*/){
		var result = new Array();
		for(var i=0;i<arguments.length;i++){
			var current = arguments[i];
			if(current instanceof OptionBoxOption){
				this.options.push(current);
				current.setParentOptionBox(this);
				$(this.element.menu).before(current.element);
				result[i] = this.options.length;
				this.respond();
			}
		}
		return result;
	}
	
	this.remove = function(index){
		var result = new Array();
		for(var i=0;i<arguments.length;i++){
			current = arguments[i];
			if(current instanceof OptionBoxOption){
				var option = this.options.indexOf(current);
				if(option >= 0){
					result = result.concat(this.options.splice(option,1));
					$(this.options[option].element).detach();
				}
			}else if(isNumber(current)){
				if((current >= 0) && (current < this.options.length)){
					result = result.concat(this.options.splice(current,1));
					$(this.options[current].element).detach();
				}
			}
		}
		this.respond();
		return result;
	}
	
	this.setMaxWidth = function(maxWidth){
		if((maxWidth instanceof Number) || (typeof maxWidth === "number")){
			this.maxWidth = maxWidth;
		}
	}
	
	this.resize = function(){
		/*
		*	This function resizes the OptionBox responsively.
		*/
		
		// Start by making the overflow button visible so that maxWidth is enforced based on all buttons being visible
		$(this.element).addClass("excess");
		$(this.element).removeClass("noOverflow");
		if(!is(this.compact) || (this.compact != true)){
			// Put all buttons from overflow menu in the OptionBox's div element for width calculation
			var menuOptions = $(this.element.menu).children();
			$(menuOptions).detach();
			$(this.element).prepend($(menuOptions));
			// Get the element's current width (influenced by either buttons or CSS max-width, whichever is less
			var currentWidth = $(this.element).outerWidth();
			var buttons = $(this.element).children("strong.option");
			// Get the width of the overflow button
			var overflowWidth = $(this.element.overflow).outerWidth();
			if("maxWidth" in this){
				// OptionBox has a maximum width set via Javascript; enforce this by removing buttons one at a time until maxWidth is enforced
				while(($(this.element).outerWidth() > (this.maxWidth-overflowWidth)) && (buttons.length > 0)){
					// Sum width of non-overflow buttons not in overflow menu greater than max width
					$(buttons[buttons.length-1]).detach();
					$(this.element.menu).prepend(buttons[buttons.length-1]);
					// Update jQuery collection with remaining buttons
					buttons = $(this.element).children("strong.option");
				}
			}else{
				// With no maxWidth set in Javascript, calculate widths of individual buttons and remove until sum is less than current width (if limited by CSS)
				var width = 0;
				for(var i=0;i<buttons.length;i++){
					width += $(buttons[i]).outerWidth();
				}
				while((width > (currentWidth-overflowWidth)) && (buttons.length > 0)){
					// Remove buttons from div element until sum is less than current width
					$(buttons[buttons.length-1]).detach();
					width -= $(buttons[buttons.length-1]).outerWidth();
					$(this.element.menu).prepend(buttons[buttons.length-1]);
					buttons = $(this.element).children("strong.option");
				}
			}
			if($(this.element.menu).children("strong.option").length == 0){
				// If no buttons are in the overflow menu, overflow button should be hidden
				$(this.element).removeClass("excess");
				$(this.element).addClass("noOverflow");
			}
		}else{
			// Put all buttons from OptionBox's div element into the overflow menu
			var menuOptions = $(this.element).children("strong.option");
			$(menuOptions).detach();
			$(this.element.menu).prepend($(menuOptions));
		}
	}
	
	this.setCompactState = function(state){
		if(is(state) && (state == true)){
			this.compact = true;
		}else if(is(this.compact)){
			delete this.compact;
		}
	}
	
	this.registerParentUIWidget = function(widget){
		if(widget instanceof UIWidget){
			this.parentUIWidget = widget;
			this.element.menu.parentUIWidget = widget;
		}
	}
}

function OptionBoxOption(callback,name,image,textOption/**/){
	// Inheritance
	UIElement.call(this,"strong","option");
	
	// Object
	var text = appendCreatedElement("span","",this.element,"text"); //option.text
	$(text).html(name);
	this.element.title = name;
	if(isString(image,true)){
		this.image = image;
		var icon = prependCreatedElement("img","",this.element,"image"); //option.image
		icon.src = image;
	}
	switch(textOption){
		case "always":
		case "compact":
			$(this.element).addClass(textOption);
		default:
			break;
	}
	if(callback instanceof Callback){
		this.callback = callback;
		if(arguments.length > 4){
			callbackArgs = Array.prototype.slice.call(arguments,5);
			this.callback.appendArrayAsArguments(callbackArgs);
		}
	}
	$(this.element).on("click",function(){
		if(is(this.parentUIElement.callback)){
			this.parentUIElement.callback.execute();
		}
		if(is(this.parentOptionBox)){
			if(is(this.parentOptionBox.parentUIWidget)){
				if(this.parentUIWidget instanceof UIWidgetFocusable){
					this.parentUIWidget.unfocus();
				}
			}
			$(this.parentOptionBox.element.menu).removeClass("open");
		}
	});
	
	// Methods
	this.setParentOptionBox = function(given){
		if(given instanceof OptionBox){
			this.parentOptionBox = given;
		}else{
			if(is(this.parentOptionBox)){
				this.parentOptionBox.remove(this);
			}
			delete this.parentOptionBox;
		}
	}
	
	this.getParentOptionBox = function(){
		return is(this.parentOptionBox) ? this.parentOptionBox : void 0;
	}
	
	this.setCallback = function(callback/*,args*/){
		if(callback instanceof Callback){
			this.callback = callback;
			if(arguments.length > 1){
				this.callback.appendArrayAsArguments(Array.prototype.slice.call(arguments,1));
			}
		}
	}
	
	this.getCallback = function(){
		return is(this.callback) ? this.callback : void 0;
	}
	
	this.setImage = function(given){
		if(isString(given,true)){
			this.image = given;
			if(is(this.element.image)){
				this.element.image.src = image;
			}else{
				var image = prependCreatedElement("img","",this.element.text,"image");
				image.src = given;
			}
		}else{
			delete this.image;
			$(this.element.image).detach();
			delete this.element.image;
		}
	}
	
	this.getImage = function(){
		return is(this.image) ? this.image : void 0;
	}
	
	this.setName = function(given){
		if(isString(given,true)){
			$(this.element.text).html(given);
			if(is(this.image)){
				this.element.text.image.title = given;
			}
		}
	}
	
	this.getName = function(){
		return this.name;
	}

	this.setTextState = function(given){
		if(isString(textOption)){
			switch(textOption){
				case "always":
				case "compact":
					this.element.className = "";
					$(this.element).addClass(given);
					break;
				default:
					break;
			}
		}
	}
	
	/*this.getTextState = function(){
		
	}*/
	
	this.setHiddenState = function(given){
		given = toBoolean(given);
		this.hidden = given;
		if(given){
			$(this.element).addClass("hidden");
		}else $(this.element).removeClass("hidden");
	}
}

function resizeMenu(menu){
	var maxHeight = window.height-24;
	var maxItems = Math.floor(maxHeight/36);
	var itemCount = $(menu).children().length;
	if(itemCount > maxItems){
		if(((maxItems*36)+18) < maxHeight){
			maxHeight = ((maxItems*36)+18);
		}
	}else maxHeight = maxItems*36;
	$(menu).css("max-height",maxHeight+"px");
}

function repositionMenu(menu){
	var visibleItemCount = Math.floor($(menu).outerHeight()/36);
	var firstPosition = (Math.max(1,Math.floor(visibleItemCount/2))-1)*36;
	var start = $($(menu).parent()).offset().top;
	var height = $(menu).outerHeight();
	var position = Math.max(start-firstPosition,window.scrollY+12);
	position = Math.min(position,start);
	position = Math.min(position,(window.scrollY+(window.innerHeight-12))-height);
	position = Math.max(position,start-(height-36));
	position -= (start);
	$(menu).css("margin-top",position+"px");6.5
}

function contextAwareWord(type,target){
	type = type.toLowerCase();
	
	// Inheritance
	UIWidget.call(this,"span",type);
	
	// Javascript
	this.type = type;
	if(target instanceof UIElement){
		this.target = target.element;
	}else if(target instanceof Element){
		this.target = target;
	}
	
	// Methods
	this.resize = function(){
		switch(this.type){
			case "position":
			case "direction":
			case "compass":
				var thisXPosition = $(this.element).offset().left+($(this.element).outerWidth()/2);
				var thisYPosition = $(this.element).offset().top+($(this.element).outerHeight()/2);
				var targetXPosition = $(target).offset().left+($(target).outerWidth()/2);
				var targetYPosition = $(target).offset().top+($(target).outerHeight()/2);
				var atanX = targetXPosition-thisXPosition;
				var atanY = thisYPosition-targetYPosition;
				var angle = Math.atan2(atanX,atanY);
				var region = Math.ceil((angle+Math.PI)/(Math.PI/8));
				region += 1;
				if(region == 17){
					region = 1;
				}
				region = Math.floor(region/2);
				if(this.type == "position"){
					if(region == 1){ $(this.element).text("below and to the left"); }
					if(region == 2){ $(this.element).text("to the left"); }
					if(region == 3){ $(this.element).text("above and to the left"); }
					if(region == 4){ $(this.element).text("above"); }
					if(region == 5){ $(this.element).text("above and to the right"); }
					if(region == 6){ $(this.element).text("to the right"); }
					if(region == 7){ $(this.element).text("below and to the right"); }
					if(region == 8){ $(this.element).text("below"); }
				}else{
					if(this.type == "direction"){
						if(region == 1){ $(this.element).text("down and left"); }
						if(region == 2){ $(this.element).text("left"); }
						if(region == 3){ $(this.element).text("up and left"); }
						if(region == 4){ $(this.element).text("up"); }
						if(region == 5){ $(this.element).text("up and right"); }
						if(region == 6){ $(this.element).text("right"); }
						if(region == 7){ $(this.element).text("down and right"); }
						if(region == 8){ $(this.element).text("down"); }
					}else{
						if(region == 1){ $(this.element).text("southwest"); }
						if(region == 2){ $(this.element).text("west"); }
						if(region == 3){ $(this.element).text("northwest"); }
						if(region == 4){ $(this.element).text("north"); }
						if(region == 5){ $(this.element).text("northeast"); }
						if(region == 6){ $(this.element).text("east"); }
						if(region == 7){ $(this.element).text("southeast"); }
						if(region == 8){ $(this.element).text("south"); }

					}
				}
				break;
			default:
				break;
		}
	}
}

var resizeRegistry = new Array();

function togglePlanes(){
	/*if($("body").children("#focus").length == 0){
		
	}*/
	if(!$("#focus").hasClass("show")){
		$("#foreground").removeClass("noAnimate");
		$("#foreground").addClass("blur");
		$("#focus").addClass("show");
		$("#focus").css("height",$("#foreground").outerHeight(true)+"px");
	}else{
		$("#foreground").addClass("noAnimate");
		$("#foreground").removeClass("shrink");
		if($("body").children("#modal").length == 0){
			$("#foreground").removeClass("blur");
		}
		$("#focus").removeClass("show");
	}
}

function zoomFocusPlane(){
	if($("#focus").hasClass("show")){
		var focusOrigin = $("#focus").children()[0];
		var xCenter = $(focusOrigin).offset().left+($(focusOrigin).outerWidth()/2);
		var yCenter = $(focusOrigin).offset().top+($(focusOrigin).outerHeight()/2);
		$("#foreground").css("transform-origin",xCenter+"px "+yCenter+"px");
	}
}

OptionBox.prototype = Object.create(UIWidget.prototype);
OptionBox.prototype.constructor = OptionBox;

Option.prototype = Object.create(UIElement.prototype);
Option.prototype.constructor = Option;

contextAwareWord.prototype = Object.create(UIWidget.prototype);
contextAwareWord.prototype.constructor = contextAwareWord;
