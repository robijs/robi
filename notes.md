If you see this message in the console

```sh
EPERM: operation not permitted, watch at FSEvent.FSWatcher._handle.onchange
```
or

```sh
EPERM: operation not permitted, rename './src/Routes/[RouteName]' -> './src/Routes/[Routename]_ARCHIVED'
```

check if there's another program using that directory. Sometimes antivirus and file sync apps (OneDrive, iCloud Drive, Dropbox, etc.) will lock up directories. Pause them and try again.

If that doesn't work, stop the server (ctrl+c), close your text editor and terminal, and relaunch.