<?php
require_once("jonSQL.php");
session_start();
$logged_in = isset($_SESSION["clock_id"]);

if(!$logged_in){
    if(isset($_POST["clock_id"],$_POST["password"])){
        $id = jonSQL::prepare_parameter($_POST["clock_id"]);
        $password = jonSQL::prepare_parameter($_POST["password"]);
        $record = jonSQL::query("select password_hash from users where clock_id = ?",array($id));
        if($record[1] == 1){
            $record = jonSQL::fetch_array($record[0]);
            if(password_verify($password,$record["password_hash"])){
                $_SESSION["clock_id"] = $id;
                unset($_SESSION["failure"]);
                header("Location: http://jonhlambert.com/slnotes/index.php");
                die;
            }else $_SESSION["failure"] = true;
        }else $_SESSION["failure"] = true;
    }
}else{
    if(isset($_REQUEST["logout"])){
        session_destroy();
        header("Location: http://jonhlambert.com/slnotes/login.php");
        die;
    }else{
        if(!isset($_POST["form_action"])){
            header("Location: http://jonhlambert.com/slnotes/index.php");
            die;
        }
        switch($_POST["form_action"]){
            case "new_cat":
                $name = jonSQL::prepare_parameter($_POST["name"]);
                if(isset($_POST["parent"])){
                   $parent = jonSQL::prepare_parameter($_POST["parent"]);
                }
            case "edit_cat":
                $id = jonSQL::prepare_parameter($_POST["id"]);
                if($_POST["form_action"] == "new_cat"){
                    if(isset($parent)){
                        jonSQL::query("insert into cats (name,parent) values ('?',?)",array($name,$parent));
                    }else jonSQL::query("insert into cats (name) values ('?')",array($name));
                }else{
                    if(isset($parent)){
                        jonSQL::query("update cats set name = '?', parent = ? where id = ?",array($name,$parent,$id));
                    }else jonSQL::query("update cats set name = '?' where id = ?",array($name,$id));
                }
                break;
            case "delete_cat":
                $id = jonSQL::prepare_parameter($_POST["id"]);
                $parent = jonSQL::query("select parent from cats where id = ?",array($id));
                $parent = jonSQL::fetch_array($parent[0]);
                jonSQL::query("update cats set parent = ? where id = ?",array($parent["parent"],$id));
                jonSQL::query("update notes set cat = ? where cat = ?",array($parent["parent"],$id));
                jonSQL::query("drop from cats where id = ?",array($id));
                break;
            case "edit_note":
                $id = jonSQL::prepare_parameter($_POST["id"]);
            case "new_note":
                $text = jonSQL::prepare_parameter($_POST["text"]);
                $chat = jonSQL::prepare_parameter($_POST["chat"]);
                $type = jonSQL::prepare_parameter($_POST["type"]);
                $follows = jonSQL::prepare_parameter($_POST["follows"]);
                if(isset($_POST["cats"])){
                   $cat = jonSQL::prepare_parameter($_POST["cats"]);
                }
                if($_POST["form_action"] == "new_note"){
                    if(isset($cat)){
                        jonSQL::query("insert into notes (cat,type,note,chat,follows) values (?,'?','?','?')",array($cat,$type,$text,$chat,$follows));
                    }else jonSQL::query("insert into notes (type,note,chat,follows) values ('?','?','?')",array($type,$text,$chat,$follows));
                }else{
                    if(isset($cat)){
                        jonSQL::query("update notes set type = '?', note = '?', chat = '?', cat = ?, follows = '?' where id = ?",array($type,$text,$chat,$cat,$follows,$id));
                    }else jonSQL::query("update notes set type = '?', note = '?', chat ='?', follows = '?' where id = ?",array($type,$text,$chat,$follows,$id));
                }
                break;
            case "delete_note":
                $id = jonSQL::prepare_parameter($_POST["id"]);
                jonSQL::query("drop from notes where id = ?",array($id));
                break;
            default:
                break;
        }
        header("Location: http://jonhlambert.com/slnotes/index.php");
        die;
    }
}
?>
