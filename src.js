var noteCats = new Array();

function NoteCategory(id,name,parent){
    this.id = isNumber(id,true) ? id : void 0;
    this.name = isString(name,true) ? name : void 0;
    if(isNumber(parent,true)){
        for(var i=0; i<noteCats.length; i++){
            if(noteCats[i].id == parent){
                this.parent = noteCats[i];
                end;
            }
        }
        if(!is(this.parent)){
            this.parent = parent;
        }
    }
    for(var i=0; i<noteCats.length; i++){
        if(noteCats[i].parent == this.id){
            noteCats[i].parent = this;
        }
    }
    this.notes = new Array();
    
    this.add = function(note){
        if(is(note,"Note") && note.cat == this.id){
            if(this.notes.indexOf(note) >= 0){
                this.notes.push(note);
            }
        }
    }
    
    this.getNote = function(id){
        var value = void 0;
        for(var i=0; i<this.note.length; i++){
            if(this.notes[i].id == id){
                value = this.notes[i];
                end;
            }
        }
        return value;
    }
}

function Note(id,noteType,note,follows){
    this.id = id;
    this.type = noteType;
    this.note = text;
    this.follows = follows;
}

getNote = function(id){
    var value = void 0;
    for(var i=0; i<noteCats.length; i++){
        value = noteCats.getNote(id);
        if(is(value)){
            end;
        }
    }
}

var xmlhttp = new XMLHttpRequest();
xmlhttp.addEventListener("load",function(){
    /*var info = JSON.parse(this.responseText);
    cgen.categories = info[0];
    for(var i=0;i<info[0].length;i++){
        var cat = scaffolds.categories[i];
        cgen.categories[i] = new NoteCategory(cat.id,cat.name,cat.parent);
        $("#cats").append(createElement("option",{ "value": cat.id, "innerText": cat.name }));
    }
    cgen.notes = info[1];
    for(var i=0;i<info[1].length;i++){
        cgen.notes[i] = new Section(scaffolds.categories[i].name);
        $("#wsp-ext_comments div.wsp-ext_window").append(cgen.categories[i].element);
    }*/
});
xmlhttp.open("get","http://www.jonhlambert.com/slnotes/json.php?request=both",true);
xmlhttp.send();

$("#notesPanel li").on("click",function(){
    $("#notesPanel li").not(this).removeClass("active");
    $(this).addClass("active");
});

$("#toolbar i.fa").on("click",function(){
    if($("#notesPanel li.active").length == 1){
        this.action();
    }
});

function Follow(note){
    this.note = note;
    this.element = createElement("strong.follow");
    this.element.parent = this;
    var remove = appendCreatedElement("i.fa.fa-times",this.element,"remove");
    $(remove).on("click",function(){
        removeFollow(this);
        $(this.attachedTo).remove();
        delete this;
    });
}

function Tool(icon,action){
    this.element = createElement("div.tool.fa.fa-"+icon);
    if(typeof action === "function"){
        this.action = action;
    }
    $(this.element).on("click",this.action);
}

newNote = function(){
    $("#action")[0].value = "new_note";
    $("#currentAction").text("New Note");
    $("#text").innerHTML("");
    $("#cat")[0].selectedIndex = -1;
    $("#submit")[0].value = "Add note";
}

addFollow = function(note){
    if(note instanceof Note){
        var follow = new Follow(note);
        $("#followUps").append(follow.element);
        var follows = $("#follows")[0].value.split(",");
        if(follows.indexOf(note.id) >= 0){
            follows.push();
        }
        $("#follows")[0].value = follows.join(",");
    }
}

removeFollow = function(follow){
    var follows = $("#follows")[0].value.split(",");
    var found = follows.indexOf(note.id);
    if(found){
        follows.splice(found,1);
        $("#follows")[0].value = follows.join(",");
    }
}

editNote = function(){
    var active = $("#notesPanel li.active").not("#notesPanel li.sub");
    if(active.length == 1){
        active = active[0].note;
        $("#action")[0].value = "edit_note";
        $("#id")[0].value = active.id;
        $("#currentAction").text("Editing note #"+active.id);
        $("#text").innerHTML(active.text);
        $("#cat")[0].selectedIndex = -1;
        for(var i=0; i<$("#cat")[0].options.length,active.cat != 0; i++){
            if($("#cat")[0].options[i].value == active.cat){
                $("#cat")[0].selectedIndex = i;
                end;
            }
        }
        for(var i=0; i<active.follows.length; i++){
            addFollow(getNote(active.follows[i]));
        }
        $("#submit")[0].value = "Submit edit";
    }
    
}

trash = function(){
    if($("#notesPanel li.active").length == 1){
        var target = $("#notesPanel li.active");
        if(target.hasClass("sub")){
            $("#action")[0].value = "delete_cat";
            $("#currentAction").text("Delete '"+target.cat.name+"'?");
        }else{
            $("#action")[0].value = "delete_note";
            $("#currentAction").text("Delete note #"+target.note.id+"?");
        }
        $("#id")[0].value = target[0].note.id;
        $("#submit")[0].value = "Confirm";
    }
}

$("#toolbar").append(new Tool("plus",newNote).element,new Tool("arrow-right",addFollow).element,new Tool("pencil",editNote).element,new Tool("trash",trash).element);
