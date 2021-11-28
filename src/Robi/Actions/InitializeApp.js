import { LoadingBar } from '../Components/LoadingBar.js'
import { App, Store } from '../Core.js'
import { TestInstall } from './TestInstall.js'
import { LaunchApp } from './LaunchApp.js'
import { InstallApp } from './InstallApp.js'

/**
 *
 * @param {*} param
 */
export function InitializeApp(param) {
    const { settings, routes } = param;
    const { preLoadLists } = settings;

    if (App.get('mode') === 'prod') {
        console.log('Mode: prod');

        // Start loading bar animation
        const loadingBar = LoadingBar({
            displayLogo: App.get('logoLarge'),
            displayTitle: App.get('title'),
            totalCount: preLoadLists?.length || 0,
            loadingBar: 'hidden',
            async onReady() {
                // Check if app is already installed
                const isInstalled = await GetAppSetting('Installed');

                if (!isInstalled || isInstalled.Value === 'No') {
                    InstallApp({
                        isInstalled,
                        settings,
                        loadingBar,
                        routes
                    });

                    return;
                } else {
                    if (preLoadLists?.length) {
                        loadingBar.showLoadingBar();
                    }

                    LaunchApp(param);
                }
            }
        });

        loadingBar.add();

        Store.add({
            name: 'app-loading-bar',
            component: loadingBar
        });
    } else {
        console.log('Mode: dev');

        if (App.get('dev').testInstall) {
            TestInstall({
                settings,
                loadingBar
            });
        } else {
            LaunchApp(param);
        }
    }
}
