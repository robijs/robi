# Robi

## Local Development
```console
npm install
npm start
```

## Deploy to SharePoint
Instructions coming soon.

## Troubleshooting
If you see this message in the terminal

```sh
EPERM: operation not permitted, watch at FSEvent.FSWatcher._handle.onchange
```
or
```sh
EPERM: operation not permitted, rename './src/Routes/OldRouteName' -> './src/Routes/NewRouteName'
```

check if there's another program using that directory. Sometimes antivirus and file sync apps (OneDrive, iCloud Drive, Dropbox, etc.) will lock up directories. Pause them and try again.

If that doesn't work, stop the server (ctrl+c), close your text editor and terminal, and relaunch. You'll probably need to fix broken paths since the server was in the middle of renaming files and directories.
