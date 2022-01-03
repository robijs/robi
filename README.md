# Robi

## Local Development
```console
npm install
npm run dev
```

## Deploy to SharePoint
1. Create a build of your app.
```console
npm run build-sp min
```
2. Create a new SharePoint site (if one doesn't already exist). We recommend not deploying two apps to the same site.
3. Create a new document library named App.
4. Copy single /src directory from /dist to App, including the /src directory.
5. Launch App/src/Pages/app.aspx
6. Click Install.

## Troubleshooting
You might see error messages in the terminal session that's running the local development server. 

If you encounter either of these:

```console
EPERM: operation not permitted, watch at FSEvent.FSWatcher._handle.onchange
``` 
```console
EPERM: operation not permitted, rename './src/Routes/OldRouteName' -> './src/Routes/NewRouteName'
```

Check if there's another program using the named directory. Sometimes antivirus and file sync apps (OneDrive, iCloud Drive, Dropbox, etc.) will lock directories to changes. Pause them and try again.

If that doesn't work, stop the server (<kbd>ctrl</kbd>) + <kbd>c</kbd>), and close your text editor and terminal.

You'll probably need to fix broken paths since the server was in the middle of renaming files and directories.

Then restart the development server:
```console
npm run dev
```
