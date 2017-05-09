<?php
class jonSQL{

	function __construct(){}
	
	private static function connect(){
		$con = mysqli_connect("localhost","jonhlamb_wsp","words&Phrases","jonhlamb_slnotes");
		return $con;
	}
	
	static function prepare_query($query,$params,$override = 0){
		$con = self::connect();
		$valid = false;
		$num_matches = preg_match_all("/\?/",$query,$matches);
		if($override <= 0){
			$compare = count($params);
		}else $compare = $override;
		if(($num_matches == $compare) || ($override < 0)){
			$valid = true;
			$query = explode("?",$query);
			$sanitized_query = "";
			while(count($query) > 1){
				if($override >= 0){
					$sanitized_query = mysqli_real_escape_string($con,array_pop($params)).array_pop($query).$sanitized_query;
				}else $sanitized_query = mysqli_real_escape_string($con,$params[0]).array_pop($query).$sanitized_query;
			}
			$sanitized_query = array_pop($query).$sanitized_query;
			$query = $sanitized_query;
			$valid = $query;
		}
		mysqli_close($con);
		return $valid;
	}
	
	static function query($query,$params = array(),$include_name = false){
		//require_once("error.php");
		$con = self::connect();
		$valid = false;
		$valid = self::prepare_query($query,$params);
		if($valid){
			$query_type = split(" ",trim($valid,"("));
			if(($include_name == true) && ($query_type[0] == "select")){
				preg_match_all("/ from ([a-zA-Z0-9_]+) /",$valid,$table_name);
				$valid = strtr($valid,array(" from" => ", '".$table_name[1][0]."' as table_name from"));
			}
			$valid = mysqli_query($con,$valid);
			if($valid && ($query_type[0] == "select")){
				$valid = array($valid,mysqli_num_rows($valid));
			}else if($valid && ($query_type[0] == "insert")){
				$valid = mysqli_insert_id($con);
			}else if(!$valid){
				$extra = array();
				if(isset($_SESSION["user_id"])){
					array_push($extra,"user_id:".$_SESSION["user_id"]);
				}
				array_push($extra,"query:".$query);
				//$error = new error("MySQL",mysqli_error($con),$extra);
			}
		}
		mysqli_close($con);
		return $valid;
	}

	static function fetch_array($query,$array_type = MYSQLI_BOTH){
		$con = self::connect();
		$return = mysqli_fetch_array($query,$array_type);
		mysqli_close($con);
		return $return;
	}
	
	static function step_array($query,$steps){
		$con = self::connect();
		for($i=0; $i<$steps; $i++){
			$step = mysqli_fetch_array($query);
			if(!$step){
				$i = $steps;
			}
		}
		mysqli_close($con);
		return $query;
	}
	
	static function error(){
		$con = self::connect();
		$error = mysqli_error($con);
		mysqli_close($con);
		return $error;
	}
	
	static function prepare_parameter($parameter,$mode = ""){
		if($mode == "full"){
			$parameter = strip_tags($parameter,"<a><img /><b><i><br><br /><big><p><small><ol><ul><li>");
			$break = "<br />";
		}else if($mode == "light"){
			$parameter = strip_tags($parameter,"<a><b><i>");
		}else if($mode == "break"){
			$parameter = strip_tags($parameter,"<br />");
			$break = "<br />";
		}else if($mode == "meta"){
			$parameter = strtr(strip_tags($parameter),array("\\" => "","'" => ""));
		}else if($mode == "title"){
			$parameter = urlencode(strtr(strip_tags($parameter),array(" " => "_","\\" => "")));
		}else $parameter = strip_tags($parameter);
		if(!isset($break)){
			$break = "";
		}
		$parameter = trim(strtr($parameter,array("\n\r" => $break,"\r\n" => $break,"\n" => $break,"\r" => $break)));
		if(($mode == "full") || ($mode == "break")){
			$parameter = "<p>".$parameter."</p>";
			$parameter = strtr($parameter,array("<br /><br />" => "</p><p>"));
			while(strlen($parameter) > strlen(strtr($parameter,array("<p><br />" => "<p>")))){
				$parameter = strtr($parameter,array("<p><br />" => "<p>"));
			}
			$parameter = strtr($parameter,array("<p></p>" => "<br />"));
			//$string = preg_replace("/<.+>{quote ([0-9]+)}<\/.+>/i","{quote $1}",$string);
		}
		return $parameter;
	}
	
	static function convert_text($text,$mode = ""){
		while(strlen($text) > strlen(strtr($text,array("\\" => "")))){
			$text = strtr($text,array("\\" => ""));
		}
		if($mode == "textarea"){
			$text = strtr($text,array("\\n" => ""));
			while(strlen(strtr($text,array("<p></p>"))) < strlen($text)){
				$text = strtr($text,array("<p></p>"));
			}
			$text = trim(strtr($text,array("</p><p>" => "\n\n","<p>" => "","</p>" => "","<br />" => "\n")));
		}
		return urldecode($text);
	}
	
	static function convert_timestamp($timestamp,$mode){
		if(substr($mode,max(strlen($mode)-6,0)) != "_cheat"){
			$timestamp = explode(" ",$timestamp);
			$date = explode("-",$timestamp[0]);
			$time = explode(":",$timestamp[1]);
		}
		if($mode == "date_time"){
			$time = mktime($time[0],$time[1],$time[2],$date[1],$date[2],$date[0]);
			$time = date("M d, Y",$time)." at ".date("g:i A",$time);
		}else if($mode == "date"){
			$time = mktime(0,0,0,$date[1],$date[2],$date[0]);
			$time = date("M d, Y",$time);
		}else if(substr($mode,0,min(strlen($mode),5)) == "delta"){
			if($mode == "delta"){
				$time = time()-mktime($time[0],$time[1],$time[2],$date[1],$date[2],$date[0]);
			}else $time = $timestamp;
			$array = array("31536000" => "year","2592000" => "month","604800" => "week","86400" => "day","3600" => "hour","60" => "minute","0" => "second");
			$times = array_keys($array);
			for($k=0; $k<count($array); $k++){
				if($time >= $times[$k]){
					$time = floor($time/max($times[$k],1));
					$key = $times[$k];
					$key = $array["$key"];
					if($time != 1){
						$time = "$time ".$key."s";
					}else $time = "$time $key";
					$k = count($array);
				}
			}
		}else if($mode == "unix"){
			$time = mktime($time[0],$time[1],$time[2],$date[1],$date[2],$date[0]);
		}
		return $time;
	}
	
}
?>
