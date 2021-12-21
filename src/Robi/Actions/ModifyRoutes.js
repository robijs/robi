import { Modal } from '../Components/Modal.js'
import { BootstrapButton } from '../Components/BootstrapButton.js'
import { BootstrapDropdown } from '../Components/BootstrapDropdown.js'
import { LoadingSpinner } from '../Components/LoadingSpinner.js'
import { Alert } from '../Components/Alert.js'
import { SingleLineTextField } from '../Components/SingleLineTextField.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { CreateFolder } from './CreateFolder.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { Wait } from './Wait.js'
import { Container } from '../Components/Container.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function ModifyRoutes(event) {
    console.log('Modify routes');

    const routes = Store.routes().filter(item => item.type !== 'system');

    const addRouteModal = Modal({
        title: false,
        scrollable: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h3 class='mb-3'>Modify routes</h3>
            `);

            console.log(routes);

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <div class='w-100 d-flex'>
                    <div class='font-weight-bold w-100 flex-grow-1 mr-3'>Title</div>
                    <div class='font-weight-bold w-100 flex-grow-1 mr-3 ml-3'>Path</div>
                    <div class='font-weight-bold w-100 flex-grow-1 ml-3'>Icon</div>
                </div>
            `);

            routes.forEach(route => {
                const { path, label, icon } = route;

                const row = Container({
                    classes: ['w-100', path],
                    parent: modalBody
                });

                row.add();

                const routeTitle = SingleLineTextField({
                    classes: ['mb-1', 'mr-3', 'flex-grow-1'],
                    label: '',
                    value: label || path,
                    parent: row
                });

                routeTitle.add();

                const routePath = SingleLineTextField({
                    classes: ['mb-1', 'mr-3', 'flex-grow-1'],
                    label: '',
                    value: path,
                    parent: row,
                    // onKeydown(event) {
                    //     if (event.code === 'Space' || event.code === 'Tab') {
                    //         return false;
                    //     }
                    // },
                    // onKeyup(event) {
                    //     canEnable();
    
                    //     showMessage(routePath.value());
                    // }
                });

                routePath.add();

                // Route icon
                const routeIcon = BootstrapDropdown({
                    classes: ['mb-1', 'flex-grow-1'],
                    label: '',
                    parent: row, 
                    maxHeight: '150px',
                    maxWidth: '100px',
                    valueType: 'html',
                    value: /*html*/ `
                        <div class='d-flex justify-content-center w-100' data-target='true'>
                            <svg class='icon' style='font-size: 18px; fill: ${App.get('primaryColor')};'>
                                <use href='#icon-${icon}'></use>
                            </svg>
                        </div>
                    `,
                    options: Store.get('svgdefs').getIcons().map(icon => {
                        return {
                            label: /*html*/ `
                                <div class='d-flex justify-content-center w-100' data-target='true'>
                                    <svg class='icon' style='font-size: 18px; fill: ${App.get('primaryColor')};'>
                                        <use href='#${icon}'></use>
                                    </svg>
                                </div>
                            `
                        }
                    }),
                    action(event) {
                        // canEnable();
                    }
                });

                routeIcon.add();
            });

            const addRouteBtn = BootstrapButton({
                async action() {
                    // TODO: Generalize show save modal and blur background
                    // Update app.js first or live-server will reload when
                    // Route/Path/Path.js is created
                    const modal = Modal({
                        title: false,
                        disableBackdropClose: true,
                        scrollable: true,
                        shadow: true,
                        async addContent(modalBody) {
                            modal.find('.modal-content').style.width = 'unset';

                            const loading = LoadingSpinner({
                                message: `<span style='color: ${App.get('primaryColor')};'>Saving<span>`,
                                type: 'robi',
                                classes: ['p-4'],
                                parent: modalBody
                            });
                
                            loading.add();
                        },
                        centered: true,
                        showFooter: false,
                        position: 'afterend'
                    });

                    modal.add();

                    // Blur entire app
                    document.querySelector('#app').style.transition = 'filter 150ms';
                    document.querySelector('#app').style.filter = 'blur(5px)';

                    await updateApp();

                    if (App.get('mode') === 'prod') {
                        // Wait additional 2s
                        console.log('Waiting...');
                        await Wait(3000);
                        location.reload();
                    }

                    modal.close();

                    async function updateApp() {
                        // Update app.js
                        let digest;
                        let request;

                        if (App.get('mode') === 'prod') {
                            digest = await GetRequestDigest();
                            request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files('app.js')/$value`, {
                                method: 'GET',
                                headers: {
                                    'binaryStringRequestBody': 'true',
                                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                                    'X-RequestDigest': digest
                                }
                            });
                        } else {
                            request = await fetch(`http://127.0.0.1:8080/src/app.js`);
                            await Wait(1000);
                        }

                        let content = await request.text();
                        let updated = '';

                        // Modify Imports
                        const imports = content.match(/\/\/ @START-IMPORTS([\s\S]*?)\/\/ @END-IMPORTS/);
                        const importObjects = imports[1].split('\n');
                        const remainingImports= importObjects.filter(route => {
                            const name = route.split(' ')[1];
                    
                            if (!routes.includes(name)) {
                                return route;
                            }
                    
                        }).join('\n');
                    
                        updated = content.replace(/\/\/ @START-IMPORTS([\s\S]*?)\/\/ @END-IMPORTS/, `// @START-IMPORTS\n${remainingImports || '\n'}\n// @END-IMPORTS`);
                    
                        const allRoutes = content.match(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/);
                        const routeObjects = allRoutes[1].split(', // @ROUTE');
                    
                        // Modify routes
                        const remainingRoutes = routeObjects.filter(route => {
                            const [ query, path ] = route.match(/path: '([\s\S]*?)',/);
                    
                            console.log(routes, path);
                    
                            if (!routes.includes(path)) {
                                return route;
                            }
                    
                        }).join(', // @ROUTE');
                    
                        updated = updated.replace(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/, `// @START-ROUTES${remainingRoutes || '\n        '}// @END-ROUTES`);
                    
                        console.log('OLD\n----------------------------------------\n', content);
                        console.log('\n****************************************');
                        console.log('NEW\n----------------------------------------\n', updated);
                        console.log('\n****************************************');

                        let setFile;

                        if (App.get('mode') === 'prod') {
                            // TODO: Make a copy of app.js first
                            // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
                            setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files/Add(url='app.js',overwrite=true)`, {
                                method: 'POST',
                                body: updatedContent, 
                                headers: {
                                    'binaryStringRequestBody': 'true',
                                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                                    'X-RequestDigest': digest
                                }
                            });
                        } else {
                            setFile = await fetch(`http://127.0.0.1:2035/?path=src&file=app.js`, {
                                method: 'POST',
                                body: updatedContent
                            });
                            await Wait(1000);
                        }

                        console.log('Saved:', setFile);
                    }
                },
                // disabled: true,
                classes: ['w-100 mt-5'],
                width: '100%',
                parent: modalBody,
                type: 'robi',
                value: 'Save'
            });

            addRouteBtn.add();

            const cancelBtn = BootstrapButton({
                action(event) {
                    console.log('Cancel modify routes');

                    addRouteModal.close();
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: '',
                value: 'Cancel'
            });

            cancelBtn.add();

            // Show message if path already exists
            function showMessage(value) {
                if (paths.includes(value.toLowerCase())) {
                    // Show message
                    if (!pathExists) {
                        pathExists = Alert({
                            type: 'danger',
                            text: `A route with path <strong>${value}</strong> already exists`,
                            classes: ['alert-in', 'w-100'],
                            top: routePath.get().offsetHeight + 5,
                            parent: routePath
                        });

                        pathExists.add();
                    }
                } else {
                    // Remove message
                    if (pathExists) {
                        pathExists.remove();
                        pathExists = null;
                    }
                }
            }

            // Check if all fields are filled out and path doesn't already exist
            function canEnable() {
                if (routeTitle.value() && routePath.value() && !paths.includes(routePath.value().toLowerCase())) {
                    addRouteBtn.enable();
                } else {
                    addRouteBtn.disable();
                }
            }
        },
        centered: true,
        showFooter: false,
    });

    addRouteModal.add();
}
// @END-File
