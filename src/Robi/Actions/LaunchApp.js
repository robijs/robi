import { GenerateUUID } from './GenerateUUID.js'
import { GetCurrentUser } from './GetCurrentUser.js'
import { SetSession } from './SetSession.js'
import { Route } from './Route.js'
import { Log } from './Log.js'
import { Sidebar } from '../Components/Sidebar.js'
import { MainContainer } from '../Components/MainContainer.js'
import { FixedToast } from '../Components/FixedToast.js'
import { Modal } from '../Components/Modal.js'
import { ReleaseNotesContainer } from '../Components/ReleaseNotesContainer.js'
import { App } from '../Core/App.js'
import { Routes } from '../Core/Routes.js'
import { Store } from '../Core/Store.js'
import { Feedback } from '../Components/Feedback.js'
import { GetLocal } from './GetLocal.js'
import { SetLocal } from './SetLocal.js'
import { UpdateItem } from './UpdateItem.js'
import { GetAppSetting } from './GetAppSetting.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function LaunchApp(param) {
    const {
        releaseNotes,
        routes,
        settings
    } = param;

    const {
        debug,
        title,
        session,
        sidebar,
        maincontainer,
        allowFeedback,
        beforeLaunch,
        usersList
    } = settings;

    // Get/Set User
    Store.user(await GetCurrentUser({
        list: usersList
    }));

    // Before load
    if (beforeLaunch) {
        await new Promise((resolve) => {
            beforeLaunch({
                user: Store.user(),
                resolve
            });
        });
    }

    // Set session
    if (Array.isArray(session)) {
        session.forEach(({ key, value }) => {
            SetSession(key, value);
        });
    }

    // Get current route
    const path = location.href.split('#')[1];

    // Attach Router to browser back/forward event
    window.addEventListener('popstate', (event) => {
        if (event.state) {
            Route(event.state.url.split('#')[1], {
                scrollTop: Store.viewScrollTop()
            });
        }
    });

    // Store routes
    Store.setRoutes(routes.concat(Routes));

    // Get app container
    const appContainer = Store.get('appcontainer');

    // Sidebar
    const sidebarParam = {
        parent: appContainer,
        path
    };

    const sidebarComponent = sidebar ? sidebar(sidebarParam) : Sidebar(sidebarParam);

    Store.add({
        name: 'sidebar',
        component: sidebarComponent
    });

    sidebarComponent.add();

    // Main Container
    const mainContainerParam = {
        parent: appContainer
    };

    const mainContainer = maincontainer ? maincontainer(mainContainerParam) : MainContainer(mainContainerParam);

    Store.add({
        name: 'maincontainer',
        component: mainContainer
    });

    mainContainer.add();

    // Show App Container
    appContainer.show('flex');

    // Generate Session Id
    SetSession('sessionId', GenerateUUID());

    // Log in
    try {
        // TODO: Standarize LOG and ERROR format
        Log({
            Title: `Log in`,
            Message: `${Store.user().Email || 'User'} successfully loaded ${title}`,
            StackTrace: new Error().stack,
            Module: import.meta.url
        });
    } catch (error) {
        console.error(error);
    }

    if (allowFeedback) {
        Feedback();
    }

    // Debug mode enabled: attach App to window object (global)
    if (debug || App.isDev()) {
        window.App = App;
    }

    // Run current route on page load
    Route(path, {
        log: false
    });

    if (releaseNotes) {
        const { show, version, title, message } = releaseNotes;

        const isDismissed = GetLocal(`releaseNotesDismissed-${version}`);

        if (show && !isDismissed) {
            const toast = FixedToast({
                type: 'robi',
                title,
                message,
                bottom: '20px',
                right: '10px',
                action(event) {
                    const modal = Modal({
                        fade: true,
                        background: settings.secondaryColor,
                        centered: true,
                        close: true,
                        addContent(modalBody) {
                            ReleaseNotesContainer({
                                margin: '0px',
                                parent: modalBody,
                            });
                        },
                        parent: appContainer
                    });
    
                    modal.add();
                },
                onClose(event) {
                    SetLocal(`releaseNotesDismissed-${version}`);
                },
                parent: appContainer
            });
    
            toast.add();
        }
    }

    if (App.isDev()) {
        console.log(`Latest build loaded.`);

        return;
    }

    const BuildTimestamp_Installed = await GetAppSetting('BuildTimestamp');
    const BuildTimestamp_AppSetting = App.get('BuildTimestamp');
    const BuildTimestamp_Local = GetLocal('BuildTimestamp');

    if (BuildTimestamp_Installed.Value !== BuildTimestamp_AppSetting) {
        await UpdateItem({
            list: 'Settings',
            itemId: BuildTimestamp_Installed.Id,
            data: {
                Value: BuildTimestamp_AppSetting
            }
        });

        console.log(`Build timestamp '${BuildTimestamp_AppSetting}' is newer than installed '${BuildTimestamp_Installed.Value}'. Updated`);
    } else {
        console.log(`Latest build loaded.`);
    }

    if (BuildTimestamp_AppSetting !== BuildTimestamp_Local) {
        console.log(`Build timestamp '${BuildTimestamp_AppSetting}' is newer than local storage '${BuildTimestamp_Local}'. Updated.`);
        SetLocal('BuildTimestamp', BuildTimestamp_AppSetting);
    }
}
// @END-File
