<?php

  $db_file = '../../data/sensors.sqlite';

  function JsonRecent() {
    $result = [];
    $db = new PDO('sqlite:' . $GLOBALS['db_file']);
    $data = $db->query('SELECT [Timestamp], [Temperature], [Humidity], [Pressure] FROM [Sensors] ORDER BY [Timestamp] DESC LIMIT 1', PDO::FETCH_NUM);
    foreach ($data as $row) {
      $result['timestamp']   = date(DATE_ISO8601, strtotime($row[0]));
      $result['temperature'] = floatval($row[1]);
      $result['humidity']    = floatval($row[2]);
      $result['pressure']    = floatval($row[3]);
    }
    $db = null;
    return json_encode($result, JSON_PRETTY_PRINT);
  }
  
  function JsonHistory($sensor) {
    $result = [];
    $db = new PDO('sqlite:' . $GLOBALS['db_file']);
    $data = $db->query(sprintf('SELECT [Timestamp], %s FROM [Sensors] ORDER BY [Timestamp] DESC LIMIT 144', $sensor), PDO::FETCH_NUM);
    foreach ($data as $row) {
      array_push($result,
        [date(DATE_ISO8601, strtotime($row[0])),
         floatval($row[1])]);
    }
    $db = null;
    return json_encode(array_reverse($result), JSON_PRETTY_PRINT);
  }
  
  $json = '{ "status": "unknown query" }';

  if (isset($_REQUEST['q'])) {
    date_default_timezone_set('Etc/Universal');
    if (strcasecmp($_REQUEST['q'], 'recent') == 0) {
      $json = JsonRecent();
    }
    else if (strcasecmp($_REQUEST['q'], 'temperature') == 0) {
      $json = JsonHistory('[Temperature]'); // never feed user input directly!
    }
    else if (strcasecmp($_REQUEST['q'], 'humidity') == 0) {
      $json = JsonHistory('[Humidity]');
    }
    else if (strcasecmp($_REQUEST['q'], 'pressure') == 0) {
      $json = JsonHistory('[Pressure]');
    }
  }

  header('Cache-Control: no-cache, must-revalidate');
  header('Content-type: application/json');
  echo($json);
?>