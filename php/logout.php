<?php
session_start();
session_destroy();
header('Location: /MVIS/index.html');
exit();
?>
