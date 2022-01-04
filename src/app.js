// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made with GUI tools will not render properly.

import { Start } from './Robi/Robi.js'
import lists from './lists.js'
// @START-IMPORTS
import Test from './Routes/Test/Test.js'
import SortTables from './Routes/SortTables/SortTables.js'
import LookupField from './Routes/LookupField/LookupField.js'
import SelectIcon from './Routes/SelectIcon/SelectIcon.js'
// @END-IMPORTS

// @START
Start({
    lists,
    // Routes are directly addressable. Ex: https://site#path.
    routes: [
        // @START-ROUTES        
        // @START-Test
        {
            path: 'Test',
            title: 'Test',
            icon: 'bs-tools',
            go: Test
        }
        // @END-Test
        , // @ROUTE        
        // @START-SortTables
        {
            path: 'SortTables',
            title: 'Sort Tables',
            icon: 'bs-card-checklist',
            go: SortTables
        }
        // @END-SortTables
        , // @ROUTE
        // @START-LookupField
        {
            path: 'LookupField',
            title: 'Lookup Field',
            icon: 'bs-file-earmarked-ruled',
            go: LookupField
        }
        // @END-LookupField
        , // @ROUTE
        // @START-SelectIcon
        {
            path: 'SelectIcon',
            title: 'Select Icon',
            icon: 'bs-circle-fill',
            go: SelectIcon
        }
        // @END-SelectIcon
        // @END-ROUTES
    ],
    settings: {
        // @START-SETTINGS
        // REQUIRED PROPERTIES
        // -------------------
        // defaultBorder: border style for core comoponents
        // defaultColor: text color
        // defaultRoute: route navigated to if no #path is present in URL, defaults to first path in routes array
        // name: app name (AUTOPOPULATED if created by Robi)
        // primaryColor: set theme color, used by core components
        // primaryColorRGB: same as above, but in rgb format, used by core components
        // questionTypes: define at least one questionType with title and path props
        // secondaryColor: main container background color
        // backgroundColor: nav background color
        // theme: ('Blue' | 'Brown' | 'Gray' | 'Green' | 'Gold' | 'Magenta' | 'Orange' | 'Pink' | 'Purple' | 'Red' | 'Slate' | 'Teal')
        // title: site title (AUTOPOPULATED if created with CREATE APP)
        // titleColor: core Title component text color
        // userDefaultRole: default role for newly created use accounts
        // userSettings: new user account 'Settings' field default JSON value
        defaultBorder: 'solid 1px rgba(0, 0, 0, .125)',
        defaultRoute: '',
        name: /* @START-name */'App'/* @END-name */,
        questionTypes: [
            {
                title: 'General',
                path: 'General'
            }
        ],
        theme: /* @START-theme */'Teal'/* @END-theme */,
        title: /* @START-title */'Title'/* @END-title */,
        userDefaultRole: 'User',
        userSettings: /* @START-userSettings */JSON.stringify({ searches: {}, actions: {} })/* @END-userSettings */,
        // OPTIONAL PROPERTIES
        // -------------------
        // appcontainer: replace default sidebar with your component (type function, typically imported from /Components/myComponent.js)
        // dev.user: local dev user props
        // dev.user.LoginName: placeholder account props for local dev
        // dev.testInstall: (true | false) - if true, will bring up install console and simulate app installation process 
        // errorLogging: ('on' | 'off') - if on, sends errors to SharePoint list 'Errors' (list is created by default)
        // library: document library where src directory lives, defaults is 'App'
        // maincontainer: replace default maincontainer with your component (type function, typically imported from /Components/myComponent.js)
        // sidebar: replace default sidebar with your component (type function, typically imported from /Components/myComponent.js)
        // usersLists: override default name for 'Users' lists
        appcontainer: null,
        dev: {
            user: {
                Title: "First Last",
                Email: "first.mi.last.ctr@mail.mil",
                LoginName: "0987654321@mil",
                Role: "Developer",
                SiteId: 1
            },
            testInstall: false,
        },
        library: '',
        maincontainer: null,
        sidebar: null,
        usersList: 'Users'
        // @END-SETTINGS
    }
});
// @END
