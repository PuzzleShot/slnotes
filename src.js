var noteCats = new Array();
var cgen = new Object();

function NoteCategory(id,name,parent){
    this.id = isNumber(id,true) ? id : void 0;
    this.name = isString(name,true) ? name : void 0;
    if(isNumber(parent,true)){
        for(var i=0; i<cgen.categories.length; i++){
            if(cgen.categories[i].id == parent){
                this.parent = cgen.categories[i];
                break;
            }
        }
        if(!is(this.parent)){
            this.parent = parent;
        }
    }
    for(var i=0; i<cgen.categories.length; i++){
        if(cgen.categories[i].parent == this.id){
            cgen.categories[i].parent = this;
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
        for(var i=0; i<this.notes.length; i++){
            if(this.notes[i].id == id){
                value = this.notes[i];
                break;
            }
        }
        return value;
    }
    
    this.hasParent = function(id){
        return is(this.parent) ? this.id == id || this.parent.hasParent(id) : this.id == id;
    }
}

function Note(id,cat,noteType,note,chat,follows,label){
    this.id = id;
    this.cat = cat;
    this.type = noteType;
    this.text = note;
    this.chat = chat;
    this.follows = isString(follows) ? follows.split(",") : follows;
    this.label = label;
}

function NoteType(id,cat,noteType,name,note){
    this.id = id;
    this.cat = cat;
    this.type = noteType;
    this.name = name;
    this.note = note;
}

getNote = function(id){
    var value = void 0;
    for(var i=0; i<cgen.notes.length; i++){
        if(cgen.notes[i].id == id){
            value = cgen.notes[i];
            break;
        }
    }
    return value;
}

getCat = function(id){
    var value = void 0;
    for(var i=0; i<cgen.categories.length; i++){
        if(cgen.categories[i].id == id){
            value = cgen.categories[i];
            break;
        }
    }
    return value;
}

var xmlhttp = new XMLHttpRequest();
xmlhttp.addEventListener("load",function(){
    var info = JSON.parse(this.responseText);
    cgen.categories = new Array();
    for(var i=0;i<info.cats.length;i++){
        var cat = info.cats[i];
        cgen.categories.push(new NoteCategory(cat.id,cat.name,cat.parent));
        $("#cats").append(createElement("option",{ "value": cat.id, "innerText": cat.name }));
    }
    cgen.notes = new Array();
    for(var i=0;i<info.notes.length;i++){
        var note = info.notes[i];
        cgen.notes.push(new Note(note.id,note.cat,note.type,note.note,note.chat,note.follows,note.label));
        note = cgen.notes[cgen.notes.length-1];
        for(var j=0; j<cgen.categories.length; j++){
            if(cgen.categories[j].id == note.cat){
                cgen.categories[j].add(note);
            }
        }
        var li = createElement("li",{ "innerHTML": "<b>"+note.type+"</b> "+note.text, "note": note });
        $("#notes").append(li);
    }
    cgen.types = new Array();
    for(var i=0;i<info.types.length;i++){
        var type = info.types[i];
        cgen.types.push(new NoteType(type.id,type.cat,type.type,type.name,type.note));
        $("#types").append(createElement("option",{ "value": type.id, "noteType": type, "innerText": type.name }));
    }
    listSort.populate();
});
xmlhttp.open("get","http://jonhlambert.com/slnotes/json.php?request=both",true);
xmlhttp.send();

$("#notes").on("click","li",function(evt){
    if(!evt.ctrlKey){
        $("#notesPanel li").not(this).removeClass("active");
    }
    $(this).toggleClass("active");
});

$(document).on("click",function(evt){
    if(!(evt.target instanceof HTMLLIElement)){
        $("#notesPanel li").removeClass("active");
    }
});

function Follow(note){
    this.note = note;
    this.element = createElement("strong.follow",{ "innerHTML": note.text });
    this.element.parent = this;
    var remove = appendCreatedElement("i.fa.fa-times",this.element,"remove");
    $(remove).on("click",function(){
        removeFollow(this.attachedTo.parent);
        $(this.attachedTo).remove();
        delete this;
    });
}

function Tool(icon,action){
    this.element = createElement("i.tool.fa.fa-"+icon);
    this.element.parent = this;
    if(typeof action === "function"){
        this.action = action;
        $(this.element).on("click",function(evt){
            evt.stopPropagation();
            evt.preventDefault();
            this.parent.action();
        });
    }
}

function SortSelect(){
    this.element = createElement("select");
    $(this.element).append(createElement("option"));
    this.options = [];
    
    $(this.element).on("click",function(){
        $("#notesPanel li").show();
        $("#types option").show();
        if(this.selectedIndex > 0){
            var option = this.options[this.selectedIndex];
            var notes = $("#notesPanel li");
            for(var i=0; i<notes.length; i++){
                if(!getCat(notes[i].note.cat).hasParent(option.value)){
                    $(notes[i]).hide();
                    $(notes[i]).removeClass("active");
                }
            }
            var types = $("#types option");
            for(var i=1; i<types.length; i++){
                if(!getCat(types[i].noteType.cat).hasParent(option.value)){
                    $(types[i]).hide();
                }
            }
        }
    });
    
    this.populate = function(){
        for(var i=0; i<cgen.categories.length; i++){
            var cat = cgen.categories[i];
            var option = createElement("option",{
                "textContent": cat.name,
                "value": cat.id, 
                "parent": this
            });
            this.options.push(option);
            $(this.element).append(option);
        }
    }
}

addNote = function(){
    $("div.field").show();
    $("#action")[0].value = "new_note";
    $("#currentAction").text("New note");
    $("#text").html("");
    $("#originalNote").html("");
    $("#chat").html("");
    $("#originalChat").html("");
    $("#cats")[0].selectedIndex = (0-1);
    $("#followUps").html("");
    $("#follows")[0].value = "";
    $("#types")[0].selectedIndex = 0;
    $("#id")[0].value = "";
    $("#submit")[0].value = "Add note";
}

addType = function(){
    $("div.field").show();
    $($("div.field")[4]).hide();
    $($("div.field")[5]).hide();
    $("#action")[0].value = "new_type";
    $("#currentAction").text("New type");
    $("#text").html("");
    $("#originalNote").html("");
    $("#chat").html("");
    $("#originalChat").html("");
    $("#cats")[0].selectedIndex = (0-1);
    $("#followUps").html("");
    $("#follows")[0].value = "";
    $("#types")[0].selectedIndex = 0;
    $("#id")[0].value = "";
    $("#submit")[0].value = "Add type";
}

addFollow = function(note){
    var active = $("#notesPanel li.active").not("#notesPanel li.sub");
    if((active.length > 0) || is(note)){
        var notes = new Array();
        if(active.length > 1){
            for(var i=0; i<active.length; i++){
                notes.push(active[i].note);
            }
        }else notes.push(is(note) ? note : active[0].note);
        var follows = $("#follows")[0].value.split(",");
        for(var i=0; i<notes.length; i++){
            var note = notes[i];
            if(follows.indexOf(String(note.id)) < 0){
                var follow = new Follow(note);
                $("#followUps").append(follow.element);
                if(follows[0] != ""){
                    follows.push(note.id);
                }else follows[0] = note.id;
            }
        }
        $("#follows")[0].value = follows.join(",");
    }
}

removeFollow = function(follow){
    var follows = $("#follows")[0].value.split(",");
    var found = follows.indexOf(follow.note.id);
    if(found){
        follows.splice(found,1);
        $("#follows")[0].value = follows.join(",");
    }
}

editType = function(){
    if($("#types")[0].selectedIndex > 0){
        $("div.field").show();
        $($("div.field")[4]).hide();
        $($("div.field")[5]).hide();
        var active = $("#types")[0].options[$("#types")[0].selectedIndex];
        $("#action")[0].value = "edit_type";
        $("#id")[0].value = active.noteType.id;
        for(var i=0; i<$("#type")[0].options.length; i++){
            if($("#type")[0].options[i].value == active.noteType.type){
                $("#type")[0].selectedIndex = i;
                break;
            }
        }
        $("#currentAction").text("Editing type #"+active.noteType.id);
        $("#text").html(active.noteType.name);
        $("#originalNote").html(active.noteType.name);
        $("#chat").html(active.noteType.note);
        $("#originalChat").html(active.noteType.note);
        $("#followUps").html("");
        $("#follows")[0].value = "";
        $("#submit")[0].value = "Submit edit";
    }
}

editNote = function(){
    $("div.field").show();
    var active = $("#notesPanel li.active").not("#notesPanel li.sub");
    if(active.length == 1){
        active = active[0].note;
        $("#action")[0].value = "edit_note";
        $("#id")[0].value = active.id;
        for(var i=0; i<$("#type")[0].options.length; i++){
            if($("#type")[0].options[i].value == active.type){
                $("#type")[0].selectedIndex = i;
                break;
            }
        }
        $("#currentAction").text("Editing note #"+active.id);
        $("#text").html(active.text);
        $("#originalNote").html(active.text);
        $("#chat").html(active.chat);
        $("#originalChat").html(active.chat);
        $("#followUps").html("");
        $("#follows")[0].value = "";
        for(var i=0; i<$("#cats")[0].options.length; i++){
            if($("#cats")[0].options[i].value == active.cat){
                $("#cats")[0].selectedIndex = i;
                break;
            }
        }
        for(var i=0; i<$("#types")[0].options.length; i++){
            if($("#types")[0].options[i].value == active.label){
                $("#types")[0].selectedIndex = i;
                break;
            }
        }
        for(var i=0; i<active.follows.length; i++){console.log(active,i);
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
            $("#originalNote").html(target.note.text);
        }
        $("#id")[0].value = target[0].note.id;
        $("#submit")[0].value = "Confirm";
    }
}

var listSort = new SortSelect();
$("#toolbar").append(listSort.element,new Tool("plus",addNote).element,new Tool("arrow-right",addFollow).element,new Tool("pencil",editNote).element,new Tool("trash",trash).element);
