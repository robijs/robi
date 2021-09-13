<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="apple-touch-icon" sizes="152x152" href="../Images/favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="../Images/favicons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="../Images/favicons/favicon-16x16.png">
        <link rel="shortcut icon" href="../Images/favicons/favicon.ico">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">
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
