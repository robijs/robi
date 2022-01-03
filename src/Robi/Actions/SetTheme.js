import { App } from '../Core/App.js'
import { HexToHSL } from './HexToHSL.js'
import { HexToRGB } from './HexToRGB.js'
import { HSLDarker } from './HSLDarker.js'
import { NameToHex } from './NameToHex.js'
import { GetLocal } from './GetLocal.js'
import { Themes } from '../Models/Themes.js'
import { Style } from './Style.js'

// @START-File
/**
 *
 * @param {*} param
 */
export function SetTheme() {
    const theme = App.get('theme');
    const userPreference = GetLocal('prefersColorScheme');

    // 1. Set user preference
    if (userPreference) {
        App.set('prefersColorScheme', userPreference);
    } 
    
    // 2. If user hasn't set a preference, set to OS preference
    else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        App.set('prefersColorScheme', 'light');
    } 
    
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        App.set('prefersColorScheme', 'dark');
    } 
    
    // 3. Default to light
    else {
        App.set('prefersColorScheme', 'light');
    }
    
    const colors = Themes.find(item => item.name === theme);
    const { primary, secondary, background, color, selectedRowOpacity, buttonBackgroundColor, borderColor } = colors[App.get('prefersColorScheme')];
    const hex = NameToHex(primary);
    const rgb = HexToRGB(hex);
    const hsl = HexToHSL(hex);
    const hsl5 = HSLDarker(hsl, 5);
    const hsl10 = HSLDarker(hsl, 10);

    // All Colors
    App.set('colors', colors);

    // Primary
    App.set('primaryColor', hex);
    App.set('primaryColorRGB', rgb);
    App.set('primaryColorHSL', hsl);

    // Secondary
    App.set('secondaryColor', secondary);

    // Backgrounds
    App.set('backgroundColor', background);
    App.set('buttonBackgroundColor', buttonBackgroundColor);

    // Border
    App.set('borderColor', borderColor);

    // Default color
    App.set('defaultColor', color);

    // Selected row opacity
    App.set('selectedRowOpacity', selectedRowOpacity);

    // Add new root style
    Style({
        name: 'root',
        locked: true,
        style: /*css*/ `
            /* Theme Colors */
            :root {
                --background: ${background};
                --borderColor: ${borderColor};
                --box-shadow: rgb(0 0 0 / ${App.get('prefersColorScheme') === 'dark' ? '40%' : '10%'}) 0px 0px 16px -2px;
                --buttonBackground: ${buttonBackgroundColor};
                --color: ${color};
                --inputBackground: ${App.get('prefersColorScheme') === 'dark' ? background : secondary};
                --primary: ${primary};
                --primaryHex: ${hex};
                --primaryHSL: hsl(${HexToHSL(primary)});
                --primaryHSL-5: hsl(${hsl5});
                --primaryHSL-10: hsl(${hsl10});
                --primaryRGB: ${HexToRGB(primary)};
                --primary6b: ${primary + '6b'};
                --primary19: ${primary + '19'}; 
                --primary20: ${primary + '20'};
                --scrollbar: ${App.get('prefersColorScheme') === 'dark' ? 'dimgray' : 'lightgray'};
                --secondary: ${secondary};
                --selectedRow: ${primary + (selectedRowOpacity || '10')}
            }
        `
    });
}
// @END-File
