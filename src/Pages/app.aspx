<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="shortcut icon" href="../Images/favicon.ico">
        <link rel="stylesheet" href="../Libraries/datatables.min.css">
        <link rel="stylesheet" href="../Libraries/bootstrap.min.css">
        <link rel="stylesheet" href="../Libraries/fullcalendar.css">
        <link rel="stylesheet" href="../Libraries/Chart.min.css">
        <!-- Preloaded images dynamically imported here -->
    </head>
    <body>
        <div id="app"></div>
        <script>
            var ua = window.navigator.userAgent;
            var isIE = /MSIE|Trident/.test(ua);

            if (isIE) {
                location.href = "ie.aspx";
            }
        </script>
        <script src="../Libraries/jquery-3.4.1.js"></script>
        <script src="../Libraries/bootstrap.bundle.min.js"></script>
        <script src="../Libraries/datatables.min.js"></script>
        <script src="../Libraries/dataTables.buttons.min.js"></script>
        <script src="../Libraries/Chart.min.js"></script>
        <script src="../Libraries/fullcalendar.js"></script>
        <!-- DEV -->
        <script type="module" src="../app.js"></script>
        <!-- PROD -->
        <!-- <script src="bundle.js"></script> -->
    </body>
</html>
