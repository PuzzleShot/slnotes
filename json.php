<?php
require_once("jonSQL.php");

if(isset($_REQUEST["request"])){
    switch($_REQUEST["request"]){
        case "both":
            $cats = jonSQL::query("select * from cats");
            $result = array();
            array_push($result,array(),array());
            for($i=0; $i<$cats[1]; $i++){
                $cat = jonSQL::fetch_array($cats[0],MYSQLI_ASSOC);
                $cat["id"] = (int)$cat["id"];
                $cat["parent"] = (int)$cat["parent"];
                array_push($result[0],$cat);
            }
            $notes = jonSQL::query("select * from notes");
            for($i=0; $i<$notes[1]; $i++){
                $note = jonSQL::fetch_array($notes[0],MYSQLI_ASSOC);
                $note["follows"] = explode(",",$note["follows"]);
                for($i=0; $i<count($note["follows"]); $i++){
                    $note["follows"][$i] = (int)$note["follows"][$i];
                }
                array_push($result[1],$note);
            }
            break;
        case "cats":
            $cats = jonSQL::query("select * from cats");
            if($cats[1] > 0){
                $result = array();
                for($i=0; $i<$cats[1]; $i++){
                    $cat = jonSQL::fetch_array($cats[0],MYSQLI_ASSOC);
                    $cat["id"] = (int)$cat["id"];
                    $cat["parent"] = (int)$cat["parent"];
                    array_push($result,$cat);
                }
            }
            break;
        case "cat":
            $id = jonSQL::prepare_parameter($_REQUEST["id"]);
            $cat = jonSQL::query("select * from cats where id = ?",array($id));
            if($cat[1] == 1){
                $result = jonSQL::fetch_array($cat[0],MYSQLI_ASSOC);
                $result["int"] = (int)$result["int"];
            }
            break;
        case "notes":
            $notes = jonSQL::query("select * from notes");
            if($notes[1] > 0){
                $result = array();
                for($i=0; $i<$notes[1]; $i++){
                    $note = jonSQL::fetch_array($notes[0],MYSQLI_ASSOC);
                    $note["follows"] = explode(",",$note["follows"]);
                    for($i=0; $i<count($note["follows"]); $i++){
                        $note["follows"][$i] = (int)$note["follows"][$i];
                    }
                    array_push($result,$note);
                }
            }
            break;
        case "note":
            $id = jonSQL::prepare_parameter($_REQUEST["id"]);
            $note = jonSQL::query("select * from notes where id = ?",array($id));
            if($note[1] == 1){
                $result = jonSQL::fetch_array($note[0],MYSQLI_ASSOC);
                $result["follows"] = explode(",",$result["follows"]);
                for($i=0; $i<count($result["follows"]); $i++){
                    $result["follows"][$i] = (int)$result["follows"][$i];
                }
            }
            break;
        default:
            break;
    }
    print json_encode($result);
    die;
}
?>
