import { Start } from './Core/Actions.js'
import lists from './lists.js'
import Home from './Routes/Home/Home.js'
import Measures from './Routes/Measures/Measures.js'
import MeasureIntakeForm from './Routes/Measures/MeasureIntakeForm.js'

Start({
    // ROUTES
    routes: [
        {
            path: 'Home',                                   // Must include at least one default route.
            hide: true,                                     // Must be 'Home' or same value for settings.defaultRoute.
            go(param) {                                     // The default route shouldn't be be listed in the sidebar.
                Home(param);                                // Instead, default route enaged on view titles and sidebar click.
            }                                               // Can be linked to directly with hash fragment.
        },                                                  // Ex: https://site#defaultRoute.
        {
            path: 'Measures',
            icon: 'drawer',
            go(param) {
                const {
                    parent,
                    pathParts,
                    props
                } = param;
    
                if (pathParts.length === 1) {
                    Measures(param);
                } else if (pathParts.length >= 2) {
                    const itemId = parseInt(pathParts[1]);

                    if (typeof itemId === 'number' && !isNaN(itemId)) {
                        console.log('edit form');
                        MeasureIntakeForm({
                            parent,
                            itemId: itemId,
                            path: pathParts[2],
                            props
                        });
                    } else if (pathParts[1] === 'New') {
                        MeasureIntakeForm({
                            parent,
                            path: pathParts[2],
                            props
                        });
                    }
                }
            }  
        }
    ],
    settings: {
        // REQUIRED PROPERTIES
        defaultBorder: 'solid 1px rgba(0, 0, 0, .125)',     // default border style for core comoponents
        defaultColor: '#24292f',                            // text color
        defaultRoute: 'Home',                               // default #route rendered if none present
        logo: 'dha-logo-no-label-180w.png',                 // open sidebar logo
        logoLarge: 'dha-logo-no-label-386w.png',            // launch logo
        logoSmall: 'dha-logo-no-label-80w.png',             // logo when sidebar is collapsed
        name: '@App',                                       // app name (AUTOPOPULATED if created by Robi)
        primaryColor: '#24292f',                            // set theme color, used by core components
        primaryColorRGB: '45, 61, 80',                      // same as above, but in rgb format, used by core components
        questionTypes: [                                    // define at least one questionType with title and path props
            {
                title: 'General',
                path: 'General'
            }
        ],
        secondaryColor: 'white',                            // main container background color
        backgroundColor: '#F8F8FC',                         // nav background color
        sidebarTextColor: '#24292f',                        // nav label text color
        title: '@Title',                                    // site title (AUTOPOPULATED if created with CREATE APP)
        titleColor: '#1c6cbb',                              // core Title component text color
        userDefaultRole: 'User',                            // default role for newly created use accounts
        userSettings: JSON.stringify({}),                   // new user account 'Settings' field default JSON value
        // OPTIONAL PROPERTIES
        appcontainer: '',                                   // replace default sidebar with your component (type function, typically imported from /Components/myComponent.js)
        dev: {                                              // local dev user props
            user: {                                         // placeholder account props for local dev
                Title: "First Last",
                Email: "first.mi.last.ctr@mail.mil",
                LoginName: "0987654321@mil",
                Role: "Developer"
            },
            testInstall: false,                             // (true || false)
        },
        errorLogging: 'on',                                 // ('on' ||| 'off') - if on, sends errors to SharePoint list 'Errors'
        library: '',                                        // src document library, defaults to 'App'
        links: [                                            // recommend preloading assets (e.g., logos)
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
        lists,                                              // define app lists to be created on install
        maincontainer: '',                                  // replace default sidebar with your component (type function, typically imported from /Components/myComponent.js)
        sidebar: '',                                        // replace default sidebar with your component (type function, typically imported from /Components/myComponent.js)
        usersList: 'Users'                                  // override default name for 'Users' lists,
    }
});
