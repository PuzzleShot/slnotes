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
    </head>
    <body id="body">
        <div id="notesPanel">
            <div class="toolbar" id="toolbar"></div>
            <ul class="notes" id="notes"></ul>
        </div>
        <div id="editor">
            <form method="post" action="http://jonhlambert.com/slnotes/backend.php">
                <strong id="currentAction">New note</strong>
                <div class="field">
                    <strong>Type</strong>
                    <select name="type">
                        <option value="inq">INQ</option>
                        <option value="sts">STS</option>
                        <option value="req">REQ</option>
                        <option value="adv">ADV</option>
                    </select>
                    <p id="originalNote"></p>
                </div>
                <div class="field">
                    <strong>Text</strong>
                    <textarea name="note" id="text"></textarea>
                    <p id="originalNote"></p>
                </div>
                <div class="field">
                    <strong>Category</strong>
                    <select id="cats"></select>
                </div>
                <div class="field">
                    <strong>Follow-up notes</strong>
                    <div id="followUps"></div>
                    <input type="hidden" name="follows" id="follows">
                </div>
                <input type="hidden" name="form_action" value="new_note" id="action">
                <input type="hidden" name="id" id="id">
                <input type="submit" value="Add" id="submit">
            </form>
        </div>
        <script type="text/javascript" src="src.js"></script>
    </body>
</html>
