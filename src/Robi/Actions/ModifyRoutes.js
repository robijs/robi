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
    // // If current route changed, updated URL
    // let route = location.href.split('#')[1].split('/');

    // if (route[0] === 'Sort2'); {
    //     route[0] = 'Sort3';
    //     location.href = location.href.split('#')[0] + '#' + route.join('/');
    // }

    // return;
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

            const fields = routes.map(route => {
                const { path, title, icon } = route;

                const row = Container({
                    classes: ['w-100', 'position-relative', path],
                    padding: '10px',
                    radius: '10px',
                    parent: modalBody
                });

                row.add();
                row.get().style.transition = 'background-color 300ms';
                row.append(/*html*/ `
                    <div style='position: absolute; top: 0px; left: -42px; height: 100%; padding: 10px; transition: opacity 300ms; opacity: 0;' class='d-flex justify-content-center align-items-center modified'>
                        <svg class="icon" style='fill: var(--primary); font-size: 22px;'>
                            <use href="#icon-bs-check-circle"></use>
                        </svg>
                    </div>
                `);

                const routeTitle = SingleLineTextField({
                    addon: 'Title',
                    classes: ['mb-0', 'mr-3', 'flex-grow-1'],
                    label: '',
                    value: title,
                    parent: row,
                    onKeyup(event) {
                        if (routeTitle.value() !== title) {
                            row.get().style.background = 'var(--primary20)';
                            row.find('.modified').style.opacity = '1';
                            // Use current path as key
                            
                        } else {
                            row.get().style.background = 'inherit';
                            row.find('.modified').style.opacity = '0';
                        }
                    }
                });

                routeTitle.add();

                const routePath = SingleLineTextField({
                    addon: `${App.get('site')}#`,
                    classes: ['mb-0', 'mr-3', 'flex-grow-1'],
                    label: '',
                    value: path,
                    parent: row,
                    onKeydown(event) {
                        if (event.code === 'Space' || event.code === 'Tab') {
                            return false;
                        }
                    },
                    onKeyup(event) {
                        if (routeTitle.value() !== title) {
                            row.get().style.background = 'var(--primary20)';
                            row.find('.modified').style.opacity = '1';
                        } else {
                            row.get().style.background = 'inherit';
                            row.find('.modified').style.opacity = '0';
                        }
                    }
                });

                routePath.add();

                // Route icon
                const routeIcon = BootstrapDropdown({
                    classes: ['mb-0', 'mr-0'],
                    label: '',
                    parent: row, 
                    maxHeight: '150px',
                    maxWidth: '100px',
                    valueType: 'html',
                    value: /*html*/ `
                        <div class='d-flex justify-content-center w-100' data-target='true'>
                            <svg class='icon' style='font-size: 18px; fill: var(--primary);'>
                                <use href='#icon-${icon}'></use>
                            </svg>
                        </div>
                    `,
                    options: Store.get('svgdefs').getIcons().map(icon => {
                        return {
                            label: /*html*/ `
                                <div class='d-flex justify-content-center w-100' data-target='true'>
                                    <svg class='icon' style='font-size: 18px; fill: var(--primary);'>
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

                return {
                    values() {
                        const pathValue = routePath.value();
                        const titleValue = routeTitle.value()
                        const iconValue = routeIcon.value().querySelector('use').href.baseVal.replace('#icon-', '');

                        // TODO: split into old. and new.
                        return {
                            name: path,
                            current: {
                                title,
                                icon
                            },
                            path: pathValue !== path ? pathValue : null,
                            title: titleValue !== title ? titleValue : null,
                            icon: iconValue !== icon ? iconValue : null
                        }   
                    }
                }
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
                                message: `<span style='color: var(--primary);'>Saving<span>`,
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

                    // Flag. True if any path, title, or icon has changed.
                    let changed = false;

                    // 1. Update Route files first.
                    for (let field of fields) {
                        const { name, path, title, icon } = field.values();

                        console.log(path, title, icon);

                        if (path || title || icon) {
                            // Set app.js flag
                            changed = true;

                            // If current route changed, updated URL
                            let route = location.href.split('#')[1].split('/');

                            if (route[0] === name); {
                                route[0] = path;
                                location.href = location.href.split('#')[0] + '#' + route.join('/');
                            }
                            
                            if (App.get('mode') === 'prod') {
                                await updateRoute({ name, path, title, icon });
                            }
                        } else {
                            console.log(`${name} not changed`);
                        }
                    }

                    // 2. If title, path, or icon has changed, update app.js.
                    if (changed) {
                        await updateApp();
                    }

                    if (App.get('mode') === 'prod') {
                        
                        await Wait(3000);
                        location.reload();
                    } else {
                        // FIXME: Can't update files in /src first, will trigger hot reload
                        for (let field of fields) {
                            const { name, path, title, icon } = field.values();
    
                            if (path || title || icon) {
                                await updateRoute({ name, path, title, icon });
                            } else {
                                console.log(`${name} not changed`);
                            }
                        }
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

                        // Set Imports
                        const newImports = fields.map(field => {
                            const { name, path } = field.values();
                            const route = path || name;

                            return `import ${route} from './Routes/${route}/${route}.js'`;
                        }).join('\n');
                    
                        updated = content.replace(/\/\/ @START-IMPORTS([\s\S]*?)\/\/ @END-IMPORTS/, `// @START-IMPORTS\n${newImports || '\n'}\n// @END-IMPORTS`);
                    
                        // Set routes
                        const newRoutes = fields.map(field => {
                            const { name, path, title, icon, current } = field.values();
                            const route = path || name;

                            return [
                                `        `,
                                `        // @START-${route}`,
                                `        {`,
                                `            path: '${route}',`,
                                `            title: '${title || current.title}',`,
                                `            icon: '${icon || current.icon}',`,
                                `            go: ${route}`,
                                `        }`,
                                `        // @END-${route}`,
                                `        `
                            ].join('\n');
                        }).join(', // @ROUTE');
                    
                        updated = updated.replace(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/, `// @START-ROUTES${newRoutes || '\n        '}// @END-ROUTES`);
                    
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
                                body: updated
                            });
                            await Wait(1000);
                        }

                        console.log('Saved:', setFile);
                    }

                    async function updateRoute({ name, title, path }) {
                        let digest;
                        let request;
            
                        // 1. If title has changed, update file.
                        if (title) {
                            if (App.get('mode') === 'prod') {
                                digest = await GetRequestDigest();
                                request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src/Routes/${name}')/Files('${name}.js')/$value`, {
                                    method: 'GET',
                                    headers: {
                                        'binaryStringRequestBody': 'true',
                                        'Accept': 'application/json;odata=verbose;charset=utf-8',
                                        'X-RequestDigest': digest
                                    }
                                });
                            } else {
                                request = await fetch(`http://127.0.0.1:8080/src/Routes/${name}/${name}.js`);
                                await Wait(1000);
                            }
                
                            const value = await request.text();
                            const updated = value.replace(/\/\* @START-Title \*\/([\s\S]*?)\/\* @END-Title \*\//, `/* @START-Title */'${title}'/* @END-Title */`);
                
                            console.log('OLD\n----------------------------------------\n', value);
                            console.log('\n****************************************');
                            console.log('NEW\n----------------------------------------\n', updated);
                            console.log('\n****************************************');
                
                            if (App.get('mode') === 'prod') {
                                // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
                                await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src/Routes/${name}')/Files/Add(url='${name}.js',overwrite=true)`, {
                                    method: 'POST',
                                    body: updated, 
                                    headers: {
                                        'binaryStringRequestBody': 'true',
                                        'Accept': 'application/json;odata=verbose;charset=utf-8',
                                        'X-RequestDigest': digest
                                    }
                                });
                            } else {
                                await fetch(`http://127.0.0.1:2035/?path=src/Routes/${name}&file=${name}.js`, {
                                    method: 'POST',
                                    body: updated
                                });
                                await Wait(1000);
                            }
                        } else {
                            console.log('Title not changed');
                        }

                        // 2. If path has changed, change file and dir name
                        if (path) {
                            if (App.get('mode') === 'prod') {
                                // TODO: Extract to new Action
                                // b. Rename file
                                await fetch(`${App.get('site')}/_api/web/GetFileByServerRelativeUrl('App/src/Routes/${name}/${name}.js')/moveto(newurl='App/src/Routes/${name}/${path}.js',flags=1)`, {
                                    method: 'MERGE',
                                    body: {
                                        "__metadata": {
                                          "type": getType.__metadata.type
                                        },
                                        "Title": "New name",
                                        "FileLeafRef": "New name"
                                    }, 
                                    headers: {
                                        'Accept': 'application/json;odata=verbose;charset=utf-8',
                                        'X-RequestDigest': digest
                                    }
                                });

                                // TODO: Extract to new Action
                                // a. Rename dir
                                const getType = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src/Routes/${name}')/ListItemAllFields`, {
                                    method: 'GET',
                                    headers: {
                                        'Accept': 'application/json;odata=verbose;charset=utf-8'
                                    }
                                });

                                console.log(getType);

                                return;

                                await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src/Routes/${name}')/ListItemAllFields`, {
                                    method: 'MERGE',
                                    body: {
                                        "__metadata": {
                                          "type": getType.__metadata.type
                                        },
                                        "Title": path,
                                        "FileLeafRef": path
                                    }, 
                                    headers: {
                                        'Accept': 'application/json;odata=verbose;charset=utf-8',
                                        'X-RequestDigest': digest
                                    }
                                });
                            } else {
                                // Rename dir
                                await fetch(`http://127.0.0.1:2035/?${name}&${path}`, {
                                    method: 'PUT'
                                });

                                await Wait(1000);
                            }
                        } else {
                            console.log('Path not changed');
                        }
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
