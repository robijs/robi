import { HexToHSL } from '../Actions/HexToHSL.js'
import { HexToRGB } from '../Actions/HexToRGB.js'
import { NameToHex } from '../Actions/NameToHex.js'
import { Themes } from '../Models/Themes.js'

// @START-File
let appSettings = {};
let appLists;

const App = {
    lists() {
        return appLists;
    },
    set(param) {
        const { lists, routes, settings } = param;
        const { library, defaultRoute, theme } = settings;

        // Set lists
        appLists = lists;

        // Set mode
        if (location.href.includes('localhost') || location.href.includes('127.0.0.1')) {
            settings.mode = 'dev';
        } else {
            settings.mode = 'prod';
        }

        // Set library
        if (!library) {
            settings.library = 'App';
        }

        // Set site
        if (settings.mode === 'prod') {
            console.log('Site:', location.href.split(library || '/App/')[0]);
            console.log('App library:', settings.library);

            settings.site = location.href.split(library || '/App/')[0];
        } else {
            settings.site = 'http://localhost';
        }

        // Set default route
        if (!defaultRoute) {
            settings.defaultRoute = routes.map(route => route.path)[0];
        }

        // Set colors
        let colors;

        if (window.matchMedia) {
            if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                colors = Themes.find(item => item.name === theme).light;
                settings.prefersColorScheme = 'light';
            } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                colors = Themes.find(item => item.name === theme).dark;
                settings.prefersColorScheme = 'dark';
            }
        } else {
            colors = Themes.find(item => item.name === theme).light;
        }

        const { primary, secondary, background, color, selectedRowOpacity, buttonBackgroundColor, borderColor } = colors;

        // Primary
        settings.primaryColor = NameToHex(primary);
        settings.primaryColorRGB = HexToRGB(settings.primaryColor);
        settings.primaryColorHSL = HexToHSL(settings.primaryColor);

        // Secondary
        settings.secondaryColor = secondary;

        // Backgrounds
        settings.backgroundColor = background;
        settings.buttonBackgroundColor = buttonBackgroundColor;

        // Border
        settings.borderColor = borderColor;

        // Default color
        settings.defaultColor = color;

        // Selected row opacity
        settings.selectedRowOpacity = selectedRowOpacity;

        // Set all
        appSettings = settings;
    },
    get(prop) {
        return appSettings[prop];
    }
}

Object.freeze(App);

export { App }
// @END-File
