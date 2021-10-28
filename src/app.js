import { Start } from './Core/Actions.js'
import Home from './Routes/Home/Home.js'
import MeasureRefreshStatus from './Routes/MeasureRefreshStatus/MeasureRefreshStatus.js'
import MeasureDevelopmentChecklist from './Routes/MeasureDevelopmentChecklist/MeasureDevelopmentChecklist.js'
import PlaceMeasureOnHold from './Routes/PlaceMeasureOnHold/PlaceMeasureOnHold.js'
import MeasureIntakeForm from './Routes/MeasureIntakeForm/MeasureIntakeForm.js'
import MeasureOperationsPortal from './Routes/MeasureOperationsPortal/MeasureOperationsPortal.js'
import NewAccessRequest from './Routes/NewAccessRequest/NewAccessRequest.js'
import ResourceLibrary from './Routes/ResourceLibrary/ResourceLibrary.js'
import HelpRequest from './Routes/HelpRequest/HelpRequest.js'
import Instructions from './Routes/Instructions/Instructions.js'
import Administration from './Routes/Administration/Administration.js'
import MissingFieldsReport from './Routes/MissingFieldsReport/MissingFieldsReport.js'

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
            path: 'MeasureRefreshStatus',
            icon: 'bs-activity',
            go() {
                MeasureRefreshStatus();
            }  
        },
        {
            path: 'MeasureDevelopmentChecklist',
            icon: 'bs-clipboard-check',
            go() {
                MeasureDevelopmentChecklist();
            }  
        },
        {
            path: 'PlaceMeasureOnHold',
            icon: 'bs-pause-btn',
            go() {
                PlaceMeasureOnHold();
            }  
        },
        {
            path: 'MeasureIntakeForm',
            icon: 'drawer',
            go() {
                MeasureIntakeForm();
            }  
        },
        {
            path: 'MeasureOperationsPortal',
            icon: 'bs-cloud-arrow-up',
            go() {
                MeasureOperationsPortal();
            }  
        },
        {
            path: 'NewAccessRequest',
            icon: 'bs-person-plus',
            go() {
                NewAccessRequest();
            }  
        },
        {
            path: 'ResourceLibrary',
            icon: 'bs-book',
            go() {
                ResourceLibrary();
            }  
        },
        {
            path: 'HelpRequest',
            icon: 'question',
            go() {
                HelpRequest();
            }  
        },
        {
            path: 'Instructions',
            icon: 'play3',
            go() {
                Instructions();
            }  
        },
        {
            path: 'Administration',
            icon: 'bs-wrench',
            go() {
                Administration();
            }  
        },
        {
            path: 'MissingFieldsReport',
            icon: 'bs-file-earmarked-ruled',
            go() {
                MissingFieldsReport();
            }  
        }
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
        logoSmall: 'dha-logo-no-label-40w.png',
        logoLarge: 'https://carepoint.health.mil/sites/J5/AED/MRB/ML/dev/App/src/Images/dha-logo-no-label-386w.png',
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
