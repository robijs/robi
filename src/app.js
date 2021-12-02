// This file may be edited programmatically from the front-end GUI.
// If you know the API feel free to edit it manually.
// Just be sure to put @START and @END declarations in the right place.
// Otherwise, changes made by other developers may not save properly.

// @START-IMPORTS
import { Start } from './Robi/Robi.js'
import Measures from './Routes/Measures/Measures.js'
import Test from './Routes/Test/Test.js'
// @END-IMPORTS

// @START
Start({
    // Must include at least one route with the same path value as settings.defaultRoute.
    // Routes can be linked to directly with hash fragment. Ex: https://site#path.
    routes: [
        // @START-ROUTES
        // @START-Measures
        {
            path: 'Measures',
            icon: 'bs-journals',
            go: Measures
        }
        // @END-Measures
        , // @ROUTE
        // @START-Test
        {
            path: 'Test',
            icon: 'bs-pause-btn',
            go: Test
        }
        // @END-Test
        // @END-ROUTES
    ]
    ,
    settings: {
        // @START-SETTINGS
        // REQUIRED PROPERTIES
        // -------------------
        // defaultBorder: default border style for core comoponents
        // defaultColor: text color
        // defaultRoute: set default route, defaults to first path in routes array
        // logo: open sidebar logo
        // logoLarge: launch logo
        // logoSmall: logo when sidebar is collapsed
        // name: app name (AUTOPOPULATED if created by Robi)
        // primaryColor: set theme color, used by core components
        // primaryColorRGB: same as above, but in rgb format, used by core components
        // questionTypes: define at least one questionType with title and path props
        // secondaryColor: main container background color
        // backgroundColor: nav background color
        // title: site title (AUTOPOPULATED if created with CREATE APP)
        // titleColor: core Title component text color
        // userDefaultRole: default role for newly created use accounts
        // userSettings: new user account 'Settings' field default JSON value
        defaultBorder: 'solid 1px rgba(0, 0, 0, .125)',
        defaultColor: '#24292f',
        defaultRoute: '',
        logo: 'dha-logo-no-label-180w.png',
        logoLarge: 'dha-logo-no-label-386w.png',
        logoSmall: 'dha-logo-no-label-80w.png',
        name: /* @START-Name */'App'/* @START-Name */,
        primaryColor: '#e63e44',
        questionTypes: [
            {
                title: 'General',
                path: 'General'
            }
        ],
        secondaryColor: 'white',
        backgroundColor: '#F8F8FC',
        title: /* @START-Name */'Title'/* @START-Name */,
        userDefaultRole: 'User',
        userSettings: JSON.stringify({}),
        // OPTIONAL PROPERTIES (defaults)
        // -------------------
        // appcontainer: replace default sidebar with your component (type function, typically imported from /Components/myComponent.js)
        // dev.user: local dev user props
        // dev.user.LoginName: placeholder account props for local dev
        // dev.testInstall: (true | false) - if true, will bring up install console and simulate app installation process 
        // errorLogging: ('on' | 'off') - if on, sends errors to SharePoint list 'Errors' (list is created by default)
        // library: document library where src directory lives, defaults is 'App'
        // links: adds preload links in head for stylesheets and images
        // maincontainer: replace default maincontainer with your component (type function, typically imported from /Components/myComponent.js)
        // sidebar: replace default sidebar with your component (type function, typically imported from /Components/myComponent.js)
        // usersLists: override default name for 'Users' lists
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
        maincontainer: '',
        sidebar: '',
        usersList: 'Users'
        // @END-SETTINGS
    }
});
// @END
