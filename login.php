<?php
require_once("backend.php");
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Log in</title>
    </head>
    <body>
        <form method="post" action="">
            <?php
            if(isset($_SESSION["failure"]) && ($_SESSION[""] == true)){
                echo "<p style='color:red'>Failed to log in.</p>";
            }
            ?>
            <input type="text" name="clock_id">
            <input type="password" name="password">
            <input type="submit" value="login">
        </form>
    </body>
</html>
