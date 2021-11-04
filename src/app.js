import { Start } from './Core/Actions.js'
import lists from './lists.js'
import Home from './Routes/Home/Home.js'

Start({
    routes: [
        {
            path: 'Home',
            hide: true,
            go() {
                Home();
            }  
        }
    ],
    settings: {
        mode: 'dev', // choose 'dev' || 'prod'
        dev: {
            user: {
                Title: "First Last",
                Email: "first.mi.last.ctr@mail.mil",
                LoginName: "0987654321@mil",
                Role: "Developer"
            },
            ErrorLogging: 'on',
            // testLoading: true, // choose true || false
        },
        title: 'App', // enter app name
        site: '', // optional: enter site
        library: '', // optional: enter src document library
        logo: 'dha-logo-no-label-90w.png',
        logoSmall: 'dha-logo-no-label-40w.png',
        logoLarge: 'dha-logo-no-label-386w.png',
        primaryColor: '#24292f',
        primaryColorRGB: '45, 61, 80',
        secondaryColor: 'white',
        sidebarBackgroundColor: '#F8F8FC',
        sidebarTextColor: '#24292f',
        sidebarBorderColor: '#d4d4d499',
        defaultColor: '#24292f',
        titleColor: '#1c6cbb',
        defaultBorder: 'solid 1px rgba(0, 0, 0, .125)',
        defaultRoute: 'Home',
        usersList: 'Users',
        usersFields: [
            {
                name: 'Id',
                type: 'number'
            },
            {
                name: 'Title',
                type: 'slot'
            },
            {
                name: 'LoginName',
                type: 'slot'
            },
            {
                name: 'Email',
                type: 'slot'
            },
            {
                name: 'Role',
                type: 'slot'
            },
            {
                name: 'Settings',
                type: 'mlot'
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
        lists,
        defaultQueryParameters: '',
        questionTypes: [
            {
                title: 'General',
                path: 'General'
            }
        ]
    }
});
