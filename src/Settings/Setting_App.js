// import Action_GetQueryParameters from '../Actions/Action_GetQueryParameters.js'
// import Action_Store from '../Actions/Action_Store.js'

export default {
    mode: 'dev',
    title: 'App',
    logo: '../src/Images/dha-logo-no-label-90w.png',
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
            href: '../src/Images/dha-logo-no-label-90w.png'
        },
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
    // beforeLoad() {
      
    // },
    getDefaultQueryParameters() {
        return ``
    }
}
