<!DOCTYPE html>
<html>
<head>
    <title>Please Launch App in Edge</title>
    <style>
        html,
        body {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            color: rgba(0, 0, 0, 0.8);
        }

        body {
            margin: 2.5em 0em;
            background: whitesmoke;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .title {
            font-size: 2.5em;
            margin-bottom: .5em;
        }

        .sub-title {
            font-size: 1.5em;
        }

        .sub-title a {
            color: #007bff;
            text-decoration: none;
            display: flex;
            align-items: center;
        }

        .list {
            margin: 20px 0px;
        }

        .list ol {
            padding-left: 0px;
        }

        .list ol li {
            display: flex;
            flex-direction: column;
        }

        /* https://stackoverflow.com/a/49095568 */
        .list ol li .fit-content {
            display: table;
        }

        .list ol li img {
            margin: 10px 0px 20px 10px;
            border-radius: 4px;
            box-shadow: 0px 8px 32px 0px lightgray;
        }

        .vertical-center {
            display: inline-flex;
            align-items: center;
        }
    </style>
</head>
<body>
    <div class="center">
        <div class="title">Internet Explorer (IE) does not support this application</div>
        <div class="sub-title">
            <a href="microsoft-edge:https://carepoint.health.mil/sites/J5/QPP">
                <span>Click here to launch it in Edge</span>
                <img src='../src/Images/IE/edge.png' height='64px'>
            </a>
        </div>
        <p>Or open Edge and copy and paste address into address bar</p>
        <div class="list">
            <ol>
                <li>
                    <span><a href="https://carepoint.health.mil/sites/J5/QPP/" id='link'>Right-click here</a> and select <strong>Copy shortcut</strong></span>
                    <div class="fit-content">
                        <img src="../src/Images/IE/copy-link.png">
                    </div>
                </li>
                <li>
                    <span>Open Edge (from Start Menu, Desktop or Toolbar Shortcut, or Windows Search</span>
                    <div class="fit-content">
                        <img src='../src/Images/IE/edge.png' height='64px'>
                    </div>
                    <div class="fit-content">
                        <img src='../src/Images/IE/win-search.png'>
                    </div>
                </li>
                <li>
                    <span>Right-click in the address bar and select "Paste and go to <span id='site'>https://carepoint.health.mil/sites/J5/QPP</span>"</span>
                    <div class="fit-content">
                        <img src="../src/Images/IE/paste-and-go.png">
                    </div>
                </li>
            </ol>
        </div>
    </div>
    </div>
</body>
</html>