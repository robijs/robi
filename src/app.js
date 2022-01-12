// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made with GUI tools will not render properly.

import { Start } from './Robi/Robi.js'
import lists from './lists.js'

// @START-IMPORTS
import SortTables from './Routes/SortTables/SortTables.js'
import Test from './Routes/Test/Test.js'
import LookupField from './Routes/LookupField/LookupField.js'
import SelectIcon from './Routes/SelectIcon/SelectIcon.js'
import ChartDemo from './Routes/ChartDemo/ChartDemo.js'
import ModifyFile from './Routes/ModifyFile/ModifyFile.js'
import Button from './Routes/Button/Button.js'
import CustomForm from './Routes/CustomForm/CustomForm.js'
// @END-IMPORTS

// @START
Start({
    lists,
    // Routes are directly addressable. Ex: https://site#path.
    routes: [
        // @START-ROUTES
        // @START-CustomForm
        {
            path: 'CustomForm',
            title: 'Custom Form',
            icon: 'bs-checks-grid',
            go: CustomForm
        }
        // @END-CustomForm
        , // @ROUTE
        // @START-SortTables
        {
            path: 'SortTables',
            title: 'Sort Tables',
            icon: 'bs-table',
            go: SortTables
        }
        // @END-SortTables
        , // @ROUTE
        // @START-Test
        {
            path: 'Test',
            title: 'Test',
            icon: 'bs-tools',
            go: Test
        }
        // @END-Test
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
            icon: 'bs-app',
            go: SelectIcon
        }
        // @END-SelectIcon
        , // @ROUTE
        // @START-ChartDemo
        {
            path: 'ChartDemo',
            title: 'Chart Demo',
            icon: 'stats-bars',
            go: ChartDemo
        }
        // @END-ChartDemo
        , // @ROUTE
        // @START-ModifyFile
        {
            path: 'ModifyFile',
            title: 'Modify File',
            icon: 'bs-code-slash',
            go: ModifyFile
        }
        // @END-ModifyFile
        , // @ROUTE
        // @START-Button
        {
            path: 'Button',
            title: 'Button',
            icon: 'bs-stop-fill',
            go: Button
        }
        // @END-Button
        // @END-ROUTES
    ],
    settings: {
        // @START-SETTINGS
        // REQUIRED PROPERTIES
        // -------------------
        // name: app name (AUTOPOPULATED if created by Robi)
        // questionTypes: define at least one questionType with title and path props
        // theme: ('Blue' | 'Brown' | 'Gray' | 'Green' | 'Gold' | 'Magenta' | 'Orange' | 'Pink' | 'Purple' | 'Red' | 'Slate' | 'Teal')
        // title: site title
        // userDefaultRole: default role for newly created use accounts
        // userSettings: new user account 'Settings' field default JSON value
        name: /* @START-name */'App'/* @END-name */,
        questionTypes: [
            {
                title: 'General',
                path: 'General'
            }
        ],
        theme: /* @START-theme */'Purple'/* @END-theme */,
        title: /* @START-title */'Title'/* @END-title */,
        userDefaultRole: 'User',
        userSettings: /* @START-userSettings */JSON.stringify({ searches: {}, actions: [ { Name: 'Create SLOTs', FileNames: 'CreateSLOTItems.js' }, { Name: 'Update MLOT', FileNames: 'UpdateMLOT.js' } ] })/* @END-userSettings */,
        // OPTIONAL PROPERTIES
        // -------------------
        // appcontainer: replace default sidebar with your component (type function, typically imported from /Components/myComponent.js)
        // dev.user: local dev user props
        // dev.user.LoginName: placeholder account props for local dev
        // dev.testInstall: (true | false) - if true, will bring up install console and simulate app installation process 
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
