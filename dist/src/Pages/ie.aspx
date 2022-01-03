<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">
<head>
    <title>Please Launch App in Edge</title>
    <link rel="shortcut icon" href="../Images/favicon.ico">
    <style>
        html,
        body {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            color: rgba(0, 0, 0, 0.8);
        }

        body {
            height: 100vh;
            width: 100vw;
            margin: 0px;
            padding: 0px;
            background: whitesmoke;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .title {
            font-size: 2em;
            margin-bottom: .5em;
        }

        .sub-title {
            font-size: 1.25em;
        }

        a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="center">
        <div class="title">This app requires a modern browser, like <a href='https://www.microsoft.com/en-us/edge' target='_blank'><strong>Microsoft Edge</strong></a></div>
        <div class="sub-title">
            <a id='launch'>
                <span>Click here to launch this app in Edge</span>
            </a>
        </div>
    </div>
    <script>
        document.querySelector('#launch').href = 'microsoft-edge:' + location.href.replace('ie.aspx', 'app.aspx');
    </script>
</body>
</html>