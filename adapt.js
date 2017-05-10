var xmlhttp = new XMLHttpRequest();
xmlhttp.addEventListener("load",function(){
    var cats = JSON.parse(this.responseText);
    scaffolds.categories = cats.categories;
    scaffolds.comments = comments.comments;
    for(var i=0;i<scaffolds.categories.length;i++){
        categories.push(new Section(scaffolds.categories[i].name));
        $("#wsp-ext_comments div.wsp-ext_window").append(categories[i].element);
    }
    var comments = CommentFromJSON.apply(window,scaffolds.comments);
    for(var i=0;i<comments.length;i++){
        categories[comments[i].category].append(comments[i].element);
    }
});
xmlhttp.open("get","http://www.jonhlambert.com/slnotes/json.php?request=cats",true);
xmlhttp.send();
