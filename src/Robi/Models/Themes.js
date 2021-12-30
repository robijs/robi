// @START-File
/*
Other dark options considered:
    secondary: '#1e1e1e'
    background: '#2d2d2d'
    background: '#151515'
    background: '#242424'
*/
const Themes = [
    { 
        name: 'Blue',
        light: {
            primary: '#167EFB',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#167EFB',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#343a40',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Brown',
        light: {
            primary: '#A52A2A',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#A52A2A',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#343a40',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Gray',
        light: {
            primary: '#708090',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#708090',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#343a40',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Green',
        light: {
            primary: '#2E8B57',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#2E8B57',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#343a40',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Gold',
        light: {
            primary: '#B8860B',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#B8860B',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#343a40',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Magenta',
        light: {
            primary: '#8B008B',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#8B008B',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#343a40',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Orange',
        light: {
            primary: '#FF8C00',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#FF8C00',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#343a40',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Pink',
        light: {
            primary: '#C71585',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#C71585',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#343a40',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Purple',
        light: {
            primary: '#6A5ACD',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 20,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#9370DB',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#d4d4d4',
            selectedRowOpacity: 20,
            buttonBackgroundColor: '#343a40',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Red',
        light: {
            primary: '#e63e44',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#343a4080'
        },
        dark: {
            primary: '#e63e44',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#343a40',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Slate',
        light: {
            primary: '#2F4F4F',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#2F4F4F',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#343a40',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Teal',
        light: {
            primary: '#008080',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 1,
            buttonBackgroundColor: '#343a40',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#008080',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#24292f',
            selectedRowOpacity: 1,
            buttonBackgroundColor: '#343a40',
            borderColor: '#343a4080'
        }
    },
]

export { Themes };
// @END-File
