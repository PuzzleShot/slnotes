<?php
session_start();
if(!isset($_SESSION["clock_id"])){
    header("Location: http://jonhlambert.com/slnotes/login.php");
    die;
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Workspace&plus; Notation Database</title>
        <link rel="stylesheet" type="text/css" href="style.css">
        <link rel="stylesheet" href="font-awesome-4.5.0/css/font-awesome.min.css">
        <script type="text/javascript" src="jquery-3.2.0.slim.min.js"></script>
        <script type="text/javascript" src="core.js"></script>
        <script type="text/javascript" src="jui.js"></script>
        <script type="text/javascript" src="src.js"></script>
    </head>
    <body id="body">
        <div id="notesPanel">
            <div class="toolbar" id="toolbar"></div>
            <ul class="notes"></ul>
        </div>
        <div id="editor">
            <form method="post" action="http://jonhlambert.com/slnotes/backend.php">
                <strong id="currentAction"></strong>
                <textarea name="note" id="text"></textarea>
                <p id="originalNote"></p>
                <div class="half">
                    <strong>Category</strong>
                    <select id="cats"></select>
                </div>
                <div class="half">
                    <strong>Follow-up notes</strong>
                    <ul id="followUps"></ul>
                    <input type="hidden" name="follows" id="follows">
                </div>
                <input type="hidden" name="form_action" value="new_note" id="action">
                <input type="hidden" name="id" id="id">
                <input type="submit" value="Add" id="submit">
            </form>
        </div>
    </body>
</html>
