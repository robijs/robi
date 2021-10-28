import { Start } from './Core/Actions.js'
import Home from './Routes/Home/Home.js'

Start({
    routes: [
        {
            path: 'Home',
            hide: true,
            go() {
                Home();
            }  
        },
        {
            path: 'Test',
            icon: 'book',
            go() {
                console.log('it works!');
            }  
        },
    ],
    settings: {
        mode: 'prod',
        dev: {
            LoginName: '0987654321@mil',
            Name: 'First Last',
            ErrorLogging: 'on'
        },
        title: 'Measures Library',
        logo: 'dha-logo-no-label-90w.png',
        logoSmall: 'https://carepoint.health.mil/sites/J5/AED/MRB/ML/dev/App/src/Images/dha-logo-no-label-40w.png',
        logoLarge: 'https://carepoint.health.mil/sites/J5/AED/MRB/ML/dev/App/src/Images/dha-logo-no-label-386w.png',
        primaryColor: '#24292f',
        primaryColorRGB: '45, 61, 80',
        secondaryColor: 'ghostwhite',
        sidebarBackgroundColor: 'ghostwhite',
        sidebarTextColor: '#24292f',
        sidebarBorderColor: '#d4d4d499', // rgba(212, 212, 212, 0.6)
        defaultColor: '#24292f',
        defaultBorder: 'solid 1px rgba(0, 0, 0, .125)',
        defaultRoute: 'Home',
        domain: 'http://127.0.0.1:8080',
        site: 'https://carepoint.health.mil/sites/J5/AED/MRB/ML/dev',
        usersList: 'Users',
        usersFields: [
            {
                name: 'Id',
                type: 0
            },
            {
                name: 'Title',
                type: 0
            },
            {
                name: 'LoginName',
                type: 2
            },
            {
                name: 'Email',
                type: 2
            },
            {
                name: 'Role',
                type: 2
            },
            {
                name: 'Settings',
                type: 3
            }
        ],
        userSettings: '{}',
        userDefaultRole: 'User',
        links: [
            {
                rel: 'preload',
                as: 'image',
                href: 'https://carepoint.health.mil/sites/J5/AED/MRB/ML/dev/App/src/Images/dha-logo-no-label-40w.png'
            },
            {
                rel: 'preload',
                as: 'image',
                href: 'https://carepoint.health.mil/sites/J5/AED/MRB/ML/dev/App/src/Images/dha-logo-no-label-90w.png'
            },
            {
                rel: 'preload',
                as: 'image',
                href: 'https://carepoint.health.mil/sites/J5/AED/MRB/ML/dev/App/src/Images/dha-logo-no-label-386w.png'
            }
        ],
        questionTypes: [
            {
                title: 'General',
                path: 'General'
            }
        ],
        defaultQueryParameters: ''
        // lists: [
            // {
            //     list: 'FiscalYears',
            //     select: 'Id,Title,EventDate,EndDate'
            // }
        // ],
        // sessionStorageData: [
            // {
            //     key: '',
            //     value: ''
            // }
        // ],
        // sidebarDropdown: {
        //     label: 'Fiscal Year',
        //     getSelected() {
        //         return '2021-222';
        //     },
        //     action(event) {
    
        //     },
        //     items: [
        //         {
        //             label: '',
        //             key: '',
        //             value: ''
        //         }
        //     ]
        // },
        // beforeLoad() {
          
        // }
    }
});
