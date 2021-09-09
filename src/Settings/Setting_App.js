// import Action_GetQueryParameters from '../Actions/Action_GetQueryParameters.js'
// import Action_Store from '../Actions/Action_Store.js'

export default {
    mode: 'dev',
    title: 'App',
    logo: '../src/Images/dha-logo-no-label-90w.png',
    logoSmall: '../src/Images/dha-logo-no-label-40w.png',
    primaryColor: '#24292f',
    primaryColorRGB: '45, 61, 80',
    secondaryColor: 'ghostwhite',
    sidebarBackgroundColor: 'ghostwhite',
    sidebarTextColor: '#24292f',
    sidebarBorderColor: '#d4d4d499', // rgba(212, 212, 212, 0.6)
    defaultColor: '#24292f',
    defaultBorder: 'solid 1px rgba(0, 0, 0, .125)',
    defaultRoute: 'Home',
    domain: 'https://carepoint.health.mil',
    site: '',
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
            href: '../src/Images/dha-logo-no-label-40w.png'
        },
        {
            rel: 'preload',
            as: 'image',
            href: '../src/Images/dha-logo-no-label-90w.png'
        }
    ],
    lists: [
        // {
        //     list: 'View_Home',
        //     select: 'Id,Title,Value,FiscalYear'
        // },
    ],
    sessionStorageData: [
        // {
        //     key: '',
        //     value: ''
        // }
    ],
    // sidebarDropdown: {
    //     label: 'Fiscal Year',
    //     getSelected() {
    //         return sessionStorage.getItem('fiscalYear')
    //     },
    //     action(event) {
    //
    //     },
    //     items: [
    //         {
    //             label: '',
    //             key: '', // sessionStorage key
    //             value: ''
    //         }
    //     ]
    // },
    sidebarDropdown: {
        label: 'Fiscal Year',
        getSelected() {
            // return sessionStorage.getItem('fiscalYear')
        },
        action(event) {
            // const fiscalYear = event.target.dataset.value;
            // const queryParameters = Action_GetQueryParameters;

            // queryParameters.fy = fiscalYear;

            // let newParam = '';

            // for (let prop in queryParameters) {
            //     newParam += `${prop}=${queryParameters[prop]}`;
            // }

            // location.href = location.href.split('?')[0] + '?' + newParam;
        },
        items: [ // FIXME: This is hard coded!
            {
                label: '2019-2020',
                key: 'fiscalYear',
                value: '2019-2020'
            },
            {
                label: '2020-2021',
                key: 'fiscalYear',
                value: '2020-2021'
            },
            {
                label: '2021-2022',
                key: 'fiscalYear',
                value: '2021-2022'
            },
            {
                label: '2022-2023',
                key: 'fiscalYear',
                value: '2022-2023'
            },
            {
                label: '2023-2024',
                key: 'fiscalYear',
                value: '2023-2024'
            },
            {
                label: '2024-2025',
                key: 'fiscalYear',
                value: '2024-2025'
            }
        ]
    },
    // beforeLoad() {
      
    // },
    getDefaultQueryParameters() {
        return ``
    }
}
