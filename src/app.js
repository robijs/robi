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
    ],
    settings: {
        mode: 'dev', // 'dev' || 'prod'
        dev: {
            LoginName: '0987654321@mil',
            Name: 'First Last',
            ErrorLogging: 'on'
        },
        title: 'App',
        logo: 'dha-logo-no-label-90w.png',
        logoSmall: 'dha-logo-no-label-40w.png',
        logoLarge: 'dha-logo-no-label-386w.png',
        primaryColor: '#24292f',
        primaryColorRGB: '45, 61, 80',
        secondaryColor: 'white',
        sidebarBackgroundColor: '#F8F8FC',
        sidebarTextColor: '#24292f',
        sidebarBorderColor: '#d4d4d499', // rgba(212, 212, 212, 0.6)
        defaultColor: '#24292f',
        titleColor: '#1c6cbb',
        defaultBorder: 'solid 1px rgba(0, 0, 0, .125)',
        defaultRoute: 'Home',
        domain: 'http://127.0.0.1:8080',
        site: '', // enter site
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
                href: '/Images/dha-logo-no-label-40w.png'
            },
            {
                rel: 'preload',
                as: 'image',
                href: '/Images/dha-logo-no-label-90w.png'
            },
            {
                rel: 'preload',
                as: 'image',
                href: '/Images/dha-logo-no-label-386w.png'
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
