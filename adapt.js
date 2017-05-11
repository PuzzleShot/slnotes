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
