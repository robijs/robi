<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">
    <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
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
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@100;300;400;500;700;800;900&display=swap" rel="stylesheet">
        <!-- Preloaded images dynamically imported here -->
    
<!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef,i3e7b0477ad24f0693a0b6cb17b27bf1,TaxCatchAllLabel,_dlc_DocId,_dlc_DocIdUrl,_dlc_DocIdPersistId,mb7b7c6cb3b94febb95b36ae1f78ffc5,ba60022a341749df97d7a0ab674012b7"><xml>
<mso:CustomDocumentProperties>
<mso:_dlc_DocId msdt:dt="string">K75DWSHUVDYD-384991697-40</mso:_dlc_DocId>
<mso:_dlc_DocIdItemGuid msdt:dt="string">d89a13f5-1822-4a9c-a016-73d306b19e80</mso:_dlc_DocIdItemGuid>
<mso:_dlc_DocIdUrl msdt:dt="string">https://info.health.mil/staff/analytics/cp/ModernDev/InstallDemo/_layouts/15/DocIdRedir.aspx?ID=K75DWSHUVDYD-384991697-40, K75DWSHUVDYD-384991697-40</mso:_dlc_DocIdUrl>
</mso:CustomDocumentProperties>
</xml></SharePoint:CTFieldRefs><![endif]-->
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
