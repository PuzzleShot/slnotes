var noteCats = new Array();
var cgen = new Object();

function NoteCategory(id,name,parent){
    this.id = isNumber(id,true) ? id : void 0;
    this.name = isString(name,true) ? name : void 0;
    if(isNumber(parent,true)){
        for(var i=0; i<noteCats.length; i++){
            if(noteCats[i].id == parent){
                this.parent = noteCats[i];
                break;
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
        for(var i=0; i<this.notes.length; i++){
            if(this.notes[i].id == id){
                value = this.notes[i];
                break;
            }
        }
        return value;
    }
}

function Note(id,cat,noteType,note,follows){
    this.id = id;
    this.cat = cat;
    this.type = noteType;
    this.text = note;
    this.follows = isString(follows) ? follows.split(",") : follows;
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
        cgen.notes.push(new Note(note.id,note.cat,note.type,note.note,note.follows));
        note = cgen.notes[cgen.notes.length-1];
        for(var j=0; j<cgen.categories.length; j++){
            if(cgen.categories[j].id == note.cat){
                cgen.categories[j].add(note);
            }
        }
        var li = createElement("li",{ "innerHTML": "<b>"+note.type+"</b> "+note.text, "note": note });
        $("#notes").append(li);
    }
});
xmlhttp.open("get","http://jonhlambert.com/slnotes/json.php?request=both",true);
xmlhttp.send();

function searchNotes(query){
    query = query.toLowerCase();
    var result = { "matches": [] };
    var types = ["inq","sts","req","adv"];
    var type = types.indexOf(query.substr(0,3));
    var useType = (type >= 0) || (query.trim().length <= 3);
    for(var i=0; i<query.length; i++){
        var regex = new RegExp(query.substr(0,query.length-i),"gi");
        for(var j=0; j<cgen.notes.length; j++){
            var note = cgen.notes[j];
            var test = note.text;
            if(useType){
                var test = note.type+" "+test;
                regex = new RegExp("^"+query.substr(0,query.length-i),"gi");
            }
            if(regex.test(test) && (result.matches.length < 5)){
                if((i == 0) && (query == test)){
                    result.exact = note;
                }else result.matches.push(note);
            }
        }
        if(result.matches.length == 5){
            break;
        }
    }
    return result;
}

function searchCategories(query){
    query = query.toLowerCase();
    var result = { "matches": [] };
    for(var i=0; i<query.length; i++){
        var regex = new RegExp(query.substr(0,query.length-j,"gi"));
        for(var j=0; j<cgen.categories.length; j++){
            var cat = cgen.categories[j];
            if((i == 0) && (query == cat.name)){
                result.exact = cat;
            }else if(regex.test(cat.name) && (result.matches.length < 5)){
                result.matches.push(cat);
            }
        }
        if(result.matches.length == 5){
            break;
        }
    }
    return result;
}
