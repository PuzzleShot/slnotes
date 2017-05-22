<?php
require_once("jonSQL.php");

if(isset($_REQUEST["request"])){
    switch($_REQUEST["request"]){
        case "both":
            $cats = jonSQL::query("select * from cats");
            $result = array("cats" => array(),"notes" => array());
            for($i=0; $i<$cats[1]; $i++){
                $cat = jonSQL::fetch_array($cats[0],MYSQLI_ASSOC);
                $cat["id"] = (int)$cat["id"];
                $cat["parent"] = (int)$cat["parent"];
                array_push($result["cats"],$cat);
            }
            $notes = jonSQL::query("select * from notes");
            for($i=0; $i<$notes[1]; $i++){
                $note = jonSQL::fetch_array($notes[0],MYSQLI_ASSOC);
                $note["id"] = (int)$note["id"];
                $note["cat"] = (int)$note["cat"];
                $note["follows"] = explode(",",$note["follows"]);
                for($j=0; $j<count($note["follows"]); $j++){
                    $note["follows"][$j] = (int)$note["follows"][$j];
                }
                array_push($result["notes"],$note);
            }
            $result = (object)$result;
            break;
        case "cats":
            $cats = jonSQL::query("select * from cats");
            if($cats[1] > 0){
                $result = array("cats" => array());
                for($i=0; $i<$cats[1]; $i++){
                    $cat = jonSQL::fetch_array($cats[0],MYSQLI_ASSOC);
                    $cat["id"] = (int)$cat["id"];
                    $cat["parent"] = (int)$cat["parent"];
                    array_push($result["cats"],$cat);
                }
            }
            $result = (object)$result;
            break;
        case "cat":
            $id = jonSQL::prepare_parameter($_REQUEST["id"]);
            $cat = jonSQL::query("select * from cats where id = ?",array($id));
            if($cat[1] == 1){
                $result = jonSQL::fetch_array($cat[0],MYSQLI_ASSOC);
                $result["int"] = (int)$result["int"];
            }
            $result = (object)$result;
            break;
        case "notes":
            $notes = jonSQL::query("select * from notes");
            if($notes[1] > 0){
                $result = array("notes" => array());
                for($i=0; $i<$notes[1]; $i++){
                    $note = jonSQL::fetch_array($notes[0],MYSQLI_ASSOC);
                    $note["id"] = (int)$note["id"];
                    $note["cat"] = (int)$note["cat"];
                    $note["follows"] = explode(",",$note["follows"]);
                    for($j=0; $j<count($note["follows"]); $j++){
                        $note["follows"][$j] = (int)$note["follows"][$j];
                    }
                    array_push($result["notes"],$note);
                }
            }
            $result = (object)$result;
            break;
        case "note":
            $id = jonSQL::prepare_parameter($_REQUEST["id"]);
            $note = jonSQL::query("select * from notes where id = ?",array($id));
            if($note[1] == 1){
                $result = jonSQL::fetch_array($note[0],MYSQLI_ASSOC);
                $result["id"] = (int)$result["id"];
                $result["cat"] = (int)$result["cat"];
                $result["follows"] = explode(",",$result["follows"]);
                for($i=0; $i<count($result["follows"]); $i++){
                    $result["follows"][$i] = (int)$result["follows"][$i];
                }
            }
            $result = (object)$result;
            break;
        default:
            break;
    }
    print json_encode($result);
    die;
}
?>
