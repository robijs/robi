// This file may be edited programmatically from the front end (GUI).
// Feel free to edit it manually. Just be sure to put @START and @END declarations in the right place.
// Otherwise, changes made from the front end may not save properly.

// @START-IMPORTS
import { Start } from './Core/Actions.js'
import lists from './lists.js'
import Home from './Routes/Home/Home.js'
import Measures from './Routes/Measures/Measures.js'
import Test from './Routes/Test/Test.js'
// @END-IMPORTS

// @START
Start({
    // Must include at least one default route.
    // Must include a 'Home' route or same value as settings.defaultRoute.
    // The default route's hide property value should be true (type: boolean) so it doesn't appear in the sidebar.
    // Clicking view titles and sidebar logo routes to settings.defaultRoute.
    // Routes can be linked to directly with hash fragment. Ex: https://site#defaultRoute.
    routes: [
        // @START-Default
        {
            path: 'Home',
            hide: true,
            go: Home
        }
        // @END-Default
        ,
        // @START-ROUTES
        // @START-Measures
        {
            path: 'Measures',
            icon: 'drawer',
            go: Measures
        }
        // @END-Measures
        , // @ROUTE
        // @START-Test
        {
            path: 'Test',
            icon: 'alarm',
            go: Test
        }
        // @END-Test
        // @END-ROUTES
    ]
    ,
    // REQUIRED PROPERTIES
    // -------------------
    // defaultBorder: default border style for core comoponents
    // defaultColor: text color
    // defaultRoute: default #route rendered if none present
    // logo: open sidebar logo
    // logoLarge: launch logo
    // logoSmall: logo when sidebar is collapsed
    // name: app name (AUTOPOPULATED if created by Robi)
    // primaryColor: set theme color, used by core components
    // primaryColorRGB: same as above, but in rgb format, used by core components
    // questionTypes: define at least one questionType with title and path props
    // secondaryColor: main container background color
    // backgroundColor: nav background color
    // sidebarTextColor: nav label text color
    // title: site title (AUTOPOPULATED if created with CREATE APP)
    // titleColor: core Title component text color
    // userDefaultRole: default role for newly created use accounts
    // userSettings: new user account 'Settings' field default JSON value
    //
    // OPTIONAL PROPERTIES
    // -------------------
    // appcontainer: replace default sidebar with your component (type function, typically imported from /Components/myComponent.js)
    // dev: local dev user props
    // dev.LoginName: placeholder account props for local dev
    // (true || false)
    // ('on' || 'off') - if on, sends errors to SharePoint list 'Errors' (list is created by default)
    // src document library, defaults to 'App'
    // recommend preloading assets (e.g., logos)
    // define app lists to be created on install
    // replace default sidebar with your component (type function, typically imported from /Components/myComponent.js)
    // replace default sidebar with your component (type function, typically imported from /Components/myComponent.js)
    // override default name for 'Users' lists
    settings: {
        // @START-SETTINGS
        // REQUIRED PROPERTIES
        defaultBorder: 'solid 1px rgba(0, 0, 0, .125)',
        defaultColor: '#24292f',
        defaultRoute: 'Home',
        logo: 'dha-logo-no-label-180w.png',
        logoLarge: 'dha-logo-no-label-386w.png',
        logoSmall: 'dha-logo-no-label-80w.png',
        name: '@App',
        primaryColor: '#24292f',
        primaryColorRGB: '45, 61, 80',
        questionTypes: [
            {
                title: 'General',
                path: 'General'
            }
        ],
        secondaryColor: 'white',
        backgroundColor: '#F8F8FC',
        sidebarTextColor: '#24292f',
        title: '@Title',
        titleColor: '#1c6cbb',
        userDefaultRole: 'User',
        userSettings: JSON.stringify({}),
        // OPTIONAL PROPERTIES (defaults)
        appcontainer: '',
        dev: {
            user: {
                Title: "First Last",
                Email: "first.mi.last.ctr@mail.mil",
                LoginName: "0987654321@mil",
                Role: "Developer"
            },
            testInstall: false,
        },
        errorLogging: 'on',
        library: '',
        links: [
            {
                rel: 'preload',
                as: 'image',
                href: '/Images/dha-logo-no-label-80w.png'
            },
            {
                rel: 'preload',
                as: 'image',
                href: '/Images/dha-logo-no-label-180w.png'
            },
            {
                rel: 'preload',
                as: 'image',
                href: '/Images/dha-logo-no-label-386w.png'
            }
        ],
        lists,
        maincontainer: '',
        sidebar: '',
        usersList: 'Users'
        // @END-SETTINGS
    }
});
// @END
