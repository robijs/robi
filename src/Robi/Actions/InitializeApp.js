import { LoadingBar } from '../Components/LoadingBar.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { LaunchApp } from './LaunchApp.js'
import { InstallApp } from './InstallApp.js'
import { GetAppSetting } from './GetAppSetting.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function InitializeApp(param) {
    const { settings, routes } = param;
    // TODO: Rethink this API (how to pre-load list data before launch
    const { preLoadLists } = settings;

    // Build Timestamp
    App.set('BuildTimestamp', /* @START-timestamp */null/* @END-timestamp */);

    if (App.isProd()) {
        console.log('Mode: prod');

        // Check if app is already installed
        const isInstalled = await GetAppSetting('Installed');

        if (!isInstalled || isInstalled.Value === 'No') {
            InstallApp({
                isInstalled,
                settings,
                routes
            });

            // FIXME: Need loading bar for pre loaded listss
            // // Start loading bar animation
            // const loadingBar = LoadingBar({
            //     displayLogo: App.get('logoLarge'),
            //     displayTitle: App.get('title'),
            //     totalCount: preLoadLists?.length || 0,
            //     loadingBar: 'hidden',
            //     async onReady() {
            //         InstallApp({
            //             isInstalled,
            //             settings,
            //             loadingBar,
            //             routes
            //         });
            //     }
            // });

            // loadingBar.add();

            // Store.add({
            //     name: 'app-loading-bar',
            //     component: loadingBar
            // });
            return;
        } else {
            LaunchApp(param);
        }

    } else {
        console.log('Mode: dev');

        if (App.get('dev').testInstall) {
            console.log('TODO: Mirror prod install process');
        } else {
            LaunchApp(param);
        }
    }
}
// @END-File
