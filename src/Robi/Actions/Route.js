import { ViewContainer } from '../Components/ViewContainer.js'
import { ViewTools } from '../Components/ViewTools.js'
import { Title } from '../Components/Title.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { History } from './History.js'
import { Log } from './Log.js'
import { SaveDialog } from './SaveDialog.js'

// @START-File
/**
 *
 * @param {*} path
 * @param {*} options
 * @returns
 */
export function Route(path = App.get('defaultRoute'), options = {}) {
    const { scrollTop, title } = options;

    // NOTE: Experimental
    if (App.isDev()) {
        const canRoute = Store.getData('canRoute');

        // console.log('Can Route?', canRoute);
    
        if (canRoute === false) {
            SaveDialog({ 
                async no() {
                    Store.setData('canRoute', true);
                    await Store.getData('do not save action')(path, options);
                },
                async save() {
                    Store.setData('canRoute', true);
                    await Store.getData('save action')(path, options);
                }
            });
    
            return;
        } else {
            // Reset stored save dialog functions
            Store.setData('save funcion', undefined);
            Store.setData('do not save funcion', undefined);
            Store.setData('cancel funcion', undefined);
        }
    }
    // NOTE: END

    // Remove Palette
    const palette = Store.get('palette');
    
    if (palette) {
        palette.remove();
    }

    // Get references to core app components
    const appContainer = Store.get('appcontainer');
    const svgDefs = Store.get('svgdefs');
    const sidebar = Store.get('sidebar');
    const mainContainer = Store.get('maincontainer');

    // Store viewcontainer scrollTop
    Store.viewScrollTop(mainContainer.find('.viewcontainer')?.scrollTop || 0);

    // Remove all events attached to the maincontainer
    mainContainer.removeEvents();

    // Remove all child elements from maincontainer
    mainContainer.empty();

    // Remove all style elements added to head that aren't locked
    document.querySelectorAll(`head style[data-locked='no']`).forEach(node => node.remove());

    // Remove modal overlay
    const overlay = document.querySelector('.modal-backdrop');

    if (overlay) {
        overlay.remove();
    }

    // Abort all pending fetch requests
    Store.abortAll();

    // Terminate all running workers
    Store.terminateWorkers();

    // Empty store
    Store.empty();

    // TODO: store core components in props (Ex: Store.maincontainer), no need to re-add
    // Re-add core app component references to store
    Store.add({
        name: 'appcontainer',
        component: appContainer
    });
    Store.add({
        name: 'svgdefs',
        component: svgDefs
    });
    Store.add({
        name: 'maincontainer',
        component: mainContainer
    });
    Store.add({
        name: 'sidebar',
        component: sidebar
    });

    // View container
    const viewContainer = ViewContainer({
        parent: mainContainer,
    });

    viewContainer.add();

    Store.add({
        name: 'viewcontainer',
        component: viewContainer
    });

    // Check route path
    const pathAndQuery = path.split('?');
    const pathParts = pathAndQuery[0].split('/');

    // Only select first path, remove any ? that might be passed in
    const route = Store.routes().find(item => item.path === pathParts[0]);

    if (!route) {
        // TODO: Reset history state?
        // History({
        //     url: location.href.split('#')[0],
        //     title: App.get('title')
        // });

        Route('404');

        return;
    }

    // Route title
    let viewTitle;

    if (title !== false) {
        viewTitle = Title({
            title: route.title,
            parent: viewContainer,
            margin: '0px 0px 30px 0px'
        });

        viewTitle.add();

        Store.add({
            name: 'title',
            component: viewTitle
        });
    }

    // NOTE: Remove hard-coded banner when BannerMenu.js is ready
    // Style({
    //     name: 'global-banner',
    //     style: /*css*/ `
    //         .fixed-banner {
    //             position: fixed;
    //             top: 0px;
    //             left: 0px;
    //         }

    //         #global-banner span,
    //         #global-banner p,
    //         #global-banner li {
    //             color: #24292f;
    //         }
    //     `
    // });

    // viewContainer.prepend(/*html*/ `
    //     <div id='global-banner' class='p-3 w-100' style='z-index: 100;'>
    //         <div class='alert alert-warning w-100 mb-0' style='border-left: solid 10px gold; color: var(--color);'>
    //             <!--
    //             <div class='d-flex align-items-end'>
    //                 <h5 class='m-0'>
    //                     <a href='https://info.health.mil/hit/id/km/Official_Docs/LaunchPad_Azure_GovCloud_Migration.pdf' target='_blank' style='color: royalblue;'>LaunchPad Azure GovCloud Migration</a>
    //                 </h5>
    //                 <span class='ml-2' style='font-weight: 500;'>
    //                     (click for more information)
    //                 </span>
    //             </div>
    //             <hr>
    //             <p>
    //                 From <strong>Friday, March 18 at 1700 EST</strong> through <strong>Friday, March 25 1600 EST</strong> all LaunchPad Sites will be <strong><em>read-only</em></strong> during the migration.
    //             </p>
    //             <p>
    //                 <strong><em>Please upload new data files to the Measure Operations Portal (MOP) at the link below.</em></strong>
    //             </p>
    //             <p class='mb-0'>
    //                 <a class='alert-link' href='https://carepoint.health.mil/sites/J5/AED/MRB/ML/NewestMOP/Forms/AllItems.aspx' style='color: royalblue;'>https://carepoint.health.mil/sites/J5/AED/MRB/ML/NewestMOP/Forms/AllItems.aspx</div>
    //             </p>
    //             -->
    //             <div class='d-flex align-items-end'>
    //                 <h5 class='m-0'>
    //                     <a href='https://info.health.mil/hit/id/km/Official_Docs/LaunchPad_Azure_GovCloud_Migration.pdf' target='_blank' style='color: royalblue;'>LaunchPad Azure GovCloud Migration</a>
    //                 </h5>
    //                 <span class='ml-2' style='font-weight: 500;'>
    //                     (click for more information)
    //                 </span>
    //             </div>
    //             <hr>
    //             <p>
    //                 We're happy to report that the migration has been completed. 
    //                 However, some users may not be able to access LaunchPad sites until 
    //                 <strong>Monday, April 11, 2022</strong>.
    //             </p>
    //             <ol class='mb-2'>
    //                 <li class='mb-2'>
    //                     Measures Library is accessible from government furnished equipment (GFE) and AVHE.
    //                     If you have access to GFE or AVHE, please upload your data to 
    //                     <a href='https://info.health.mil/staff/analytics/apps/measures-library/App/Pages/app.aspx#DataFiles' target='_blank' style='color: royalblue;'>Data Files</a>.
    //                 </li>
    //                 <li>
                        
    //                     If you upload data from a non-GFE computer, please continue to use the 
    //                     <a href='https://carepoint.health.mil/sites/J5/AED/MRB/ML/NewestMOP/Forms/AllItems.aspx' target='_blank' style='color: royalblue;'>Measure Operations Portal</a>. 
    //                     Measures library will be accessible to commerical traffic on <strong>Monday, April 11, 2022</strong>. 
    //                 </li>
    //             </ol>
    //             <p class='mb-0 d-flex align-items-center'>
    //                 <span>
    //                     Please submitt feedback using the
    //                 </span>
    //                 <span class='ml-1 mr-1' style='display: inline-flex; align-items: center; justify-content:center; background: var(--primary); min-width: 30px; width: 30px; height: 30px; border-radius: 62px;'>
    //                     <svg class="icon" style="font-size: 22px; fill: var(--secondary);">
    //                         <use href="#icon-bs-emoji-laughing"></use>
    //                     </svg>
    //                 </span>
    //                 <span>
    //                     button on every page in the bottom right corner if you have any questions.
    //                 </span>
    //             </p>
    //         </div>
    //     </div>
    // `);
    // NOTE: END
    // Add tools
    if (route.type !== 'system' && App.isDev() && Store.user().hasRole('Developer')) {
        const viewTools = ViewTools({
            route,
            title,
            parent: viewContainer
        });

        viewTools.add();

        Store.add({
            name: 'viewtools',
            component: viewTools
        });
    }

    // Set browswer history state and window title
    History({
        url: `${location.href.split('#')[0]}${(path) ? `#${path}` : ''}`,
        title: `${App.get('title')}${(path) ? ` > ${route.title || pathParts.join(' > ')}` : ''}`
    });

    sidebar.selectNav(route.path);

    // Log route
    if (options.log !== false) {
        try {
            Log({
                Title: 'Route',
                Message: `${Store.user().Email || 'User'} routed to ${route.path}`,
                StackTrace: new Error().stack,
                Module: import.meta.url
            });
        } catch (error) {
            console.error(error);
        }
    }

    // Render selected route's go method
    route.go({
        title: viewTitle,
        route,
        parent: viewContainer,
        pathParts,
        props: queryStringToObject(path.split('?')[1]),
        scrollTop
    });

    /** Modified from {@link https://stackoverflow.com/a/61948784} */
    function queryStringToObject(queryString) {
        if (!queryString) {
            return {};
        };

        const pairs = queryString.split('&');
        // → ["foo=bar", "baz=buzz"]
        const array = pairs.map(el => {
            const parts = el.split('=');
            return parts;
        });
        // → [["foo", "bar"], ["baz", "buzz"]]
        return Object.fromEntries(array);
        // → { "foo": "bar", "baz": "buzz" }
    }

    // Set viewContainer Scroll Top
    // - maybe Views should always return a promise?
    // - or could just use a callback passed to the view
    if (scrollTop) {
        console.log(scrollTop);

        viewContainer.get().scrollTo({
            top: scrollTop
        });
    }
}
// @END-File
