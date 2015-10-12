<?php

  $gateway = '/home/pi/projects/astro-pi-web/python-gateway/astro-pi-cmd';

  function JsonClearMatrix() {
    $cmd = array($GLOBALS['gateway'], '--clear');
    if (isset($_REQUEST['r'])) array_push($cmd, '--red', $_REQUEST['r']);
    if (isset($_REQUEST['g'])) array_push($cmd, '--green', $_REQUEST['g']);
    if (isset($_REQUEST['b'])) array_push($cmd, '--blue', $_REQUEST['b']);
    $command = implode(' ', $cmd);
    shell_exec(sprintf('%s > /dev/null 2>&1 &', $command));
    return json_encode(['command' => $command], JSON_PRETTY_PRINT);
  }

  function JsonShowMessage() {
    $cmd = array($GLOBALS['gateway'], '--message', sprintf('"%s"', $_REQUEST['v']));
    if (isset($_REQUEST['r'])) array_push($cmd, '--red', $_REQUEST['r']);
    if (isset($_REQUEST['g'])) array_push($cmd, '--green', $_REQUEST['g']);
    if (isset($_REQUEST['b'])) array_push($cmd, '--blue', $_REQUEST['b']);
    $command = implode(' ', $cmd);
    shell_exec(sprintf('%s > /dev/null 2>&1 &', $command));
    return json_encode(['command' => $command], JSON_PRETTY_PRINT);
  }

  $json = '{ "status": "unknown query" }';

  if (isset($_REQUEST['q'])) {
    if (strcasecmp($_REQUEST['q'], 'clear') == 0) {
      $json = JsonClearMatrix();
    }
    else if (strcasecmp($_REQUEST['q'], 'message') == 0 && isset($_REQUEST['v'])) {
      $json = JsonShowMessage($_REQUEST['v']);
    }
  }

  header('Cache-Control: no-cache, must-revalidate');
  header('Content-type: application/json');
  echo($json);
?>