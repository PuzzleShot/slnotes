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

function Note(id,type,note,follows){
    
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
    var info = JSON.parse(this.responseText);
    cgen.categories = info[0];
    for(var i=0;i<info[0].length;i++){
        cgen.categories[i] = new NoteCategory(scaffolds.categories[i].name);
    }
    cgen.notes = info[1];
    for(var i=0;i<info[1].length;i++){
        cgen.notes[i] = new Section(scaffolds.categories[i].name);
        $("#wsp-ext_comments div.wsp-ext_window").append(cgen.categories[i].element);
    }
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
        removeFollow(this.attachedTo.parent.note);
        $(this.attachedTo).remove();
        delete this;
    });
}

function Tool(icon,action){
    this.element = createElement("div.tool.fa.fa-"+);
    if(typeof action === "function"){
        this.action = action;
    }
    $(this.element).on("click",this.action);
}

newNote = function(){
    $("#action")[0].id = "new_note";
}

addFollow = function(note){
    
}

removeFollow = function(){
    
}

editNote = function(){
    var active = $("#notesPanel li.active").not("#notesPanel li.sub");
    if(active.length == 1){
        active = active[0]
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
    }
    
}

trash = function(){
    if($("#notesPanel li.sub.active").length == 1){
        $("#action")[0].value = "delete_cat";
    }else $("#action")[0].value = "delete_note";
}

$("#toolbar").append(new Tool("plus"),new Tool("arrow-right"),new Tool("pencil"),new Tool("trash"));
