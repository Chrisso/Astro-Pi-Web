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
  
  $json = '{ "status": "unknown query" }';

  if (isset($_REQUEST['q'])) {
    if (strcasecmp($_REQUEST['q'], 'recent') == 0) {
      $json = JsonRecent();
    }
  }

  header('Cache-Control: no-cache, must-revalidate');
  header('Content-type: application/json');
  echo($json);
?>