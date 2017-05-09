if(isset($_REQUEST["request"])){
    switch($_REQUEST["request"]){
        case "cats":
            $cats = jonSQL::query("select * from cats");
            if($cats[1] > 0){
                $result = new array();
                for(var $i=0; $i<$cats[1]; i++){
                    var $cat = jonSQL::fetch_array($cats[0]);
                    array_push($result,$cat);
                }
            }
            break;
        case "cat":
            $id = jonSQL::prepare_parameter($_REQUEST["id"]);
            $cat = jonSQL::query("select * from notes where id = ?",array($id));
            if($cat[1] == 1){
                $result = jonSQL::fetch_array($cat[0]);
            }
            break;
        case "notes":
            $notes = jonSQL::query("select * from notes");
            if($notes[1] > 0){
                $result = new array();
                for(var $i=0; $i<$notes[1]; i++){
                    var $note = jonSQL::fetch_array($notes[0]);
                    array_push($result,$note);
                }
            }
            break;
        case "note":
            $id = jonSQL::prepare_parameter($_REQUEST["id"]);
            $note = jonSQL::query("select * from notes where id = ?",array($id));
            if($note[1] == 1){
                $result = jonSQL::fetch_array($note[0]);
            }
            break;
        default:
            break;
    }
    print json_encode($result);
    die;
}
