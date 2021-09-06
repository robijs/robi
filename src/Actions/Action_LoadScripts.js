/**
 * App.LoadCSS.js
 * @directory App/Components
 * @build 2021.03.09
 * (C) 2021 Wilfredo Pacheco
 */

export default async function Action_LoadScripts(scripts){
    // TODO: This throws an error on first load,
    // the library FullCalendar takes to long to load and only loads right after the script gets cached;
    scripts.forEach(src => {
        const script = document.createElement('script');
            
        script.type = 'text/javascript';
        script.src = src;
        script.async = true;
        script.dataset.cfasync = false;  
        
        document.body.appendChild(script);
    });
}
