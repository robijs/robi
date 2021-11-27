import {
    Modal,
    BootstrapButton,
    ProgressBar,
    InstallConsole,
    Container
} from './Components.js'
import { Lists } from '../Models/Lists.js'
import { App, Store } from '../Core.js'
import { Route } from './Route.js'
import { GetWebLists } from './GetWebLists.js'
import lists from '../lists.js'

/**
 *
 * @param {*} param
 */

export function UpdateApp() {
    const modal = Modal({
        title: false,
        disableBackdropClose: true,
        scrollable: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');

            // Show loading
            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <div class='loading-spinner w-100 d-flex flex-column justify-content-center align-items-center'>
                    <div class="mb-2" style='font-weight: 600; color: darkgray'>Loading lists</div>
                    <div class="spinner-grow" style='color: darkgray' role="status"></div>
                </div>
            `);

            // Check lists
            const listsToIgnore = ['App', 'Composed Looks', 'Documents', 'Master Page Gallery', 'MicroFeed', 'Site Assets', 'Site Pages'];
            const coreLists = Lists();
            const appLists = lists;
            const allLists = coreLists.concat(appLists);
            const webLists = await GetWebLists();
            const installedLists = webLists.map(item => item.Title).filter(x => allLists.map(item => item.list).includes(x));
            const diffToCreate = allLists.map(item => item.list).filter(x => !webLists.map(item => item.Title).includes(x));
            const diffToDelete = webLists.map(item => item.Title).filter(x => !allLists.map(item => item.list).includes(x) && !listsToIgnore.includes(x));
            console.log('All Lists:', allLists);
            console.log('Web Lists:', webLists);
            console.log('Installed Lists:', installedLists);
            console.log('Create:', diffToCreate);
            console.log('Delete:', diffToDelete);

            // News lists that need to be created
            const toCreate = diffToCreate.map(list => allLists.find(item => item.list === list));

            // Existing lists that need to be deleted
            // TODO: Show checklist of lists that could be deleted, default to DO NOT Delete
            const toDelete = diffToDelete.map(list => webLists.find(item => item.Title === list));

            // Has the schema changed on any lists?
            const fieldsToIgnore = ['ContentTypeId', 'Title', '_ModerationComments', 'File_x0020_Type', 'ID', 'Id', 'ContentType', 'Modified', 'Created', 'Author', 'Editor', '_HasCopyDestinations', '_CopySource', 'owshiddenversion', 'WorkflowVersion', '_UIVersion', '_UIVersionString', 'Attachments', '_ModerationStatus', 'Edit', 'LinkTitleNoMenu', 'LinkTitle', 'LinkTitle2', 'SelectTitle', 'InstanceID', 'Order', 'GUID', 'WorkflowInstanceID', 'FileRef', 'FileDirRef', 'Last_x0020_Modified', 'Created_x0020_Date', 'FSObjType', 'SortBehavior', 'PermMask', 'FileLeafRef', 'UniqueId', 'SyncClientId', 'ProgId', 'ScopeId', 'HTML_x0020_File_x0020_Type', '_EditMenuTableStart', '_EditMenuTableStart2', '_EditMenuTableEnd', 'LinkFilenameNoMenu', 'LinkFilename', 'LinkFilename2', 'DocIcon', 'ServerUrl', 'EncodedAbsUrl', 'BaseName', 'MetaInfo', '_Level', '_IsCurrentVersion', 'ItemChildCount', 'FolderChildCount', 'AppAuthor', 'AppEditor'];
            const schemaAdd = [];
            const schemaDelete = [];

            installedLists
                .map(listName => {
                    const { list, fields } = allLists.find(item => item.list === listName);

                    return { list, fields, web: webLists.find(item => item.Title === listName) };
                })
                .forEach(item => {
                    const { list, fields, web } = item;

                    const webFields = web.Fields.results.map(webField => {
                        const { StaticName, TypeDisplayName } = webField;

                        return { name: StaticName, type: TypeDisplayName };
                    });

                    const fieldsToCreate = fields.map(item => item.name).filter(x => !webFields.map(item => item.name).includes(x));
                    const fieldsToDelete = webFields.map(item => item.name).filter(x => !fields.map(item => item.name).includes(x) && !fieldsToIgnore.includes(x));

                    console.log();

                    if (fieldsToCreate.length) {
                        schemaAdd.push({
                            list,
                            fields: fieldsToCreate
                        });
                    }

                    if (fieldsToDelete.length) {
                        schemaDelete.push({
                            list,
                            fields: fieldsToDelete
                        });
                    }

                    console.log('List:', list);
                    console.log('--------------------');
                    // console.log('List Fields:', fields);
                    // console.log('Web Fields:', webFields);
                    console.log('Create fields:', fieldsToCreate);
                    console.log('Remove fields:', fieldsToDelete);
                    console.log(' ');
                });

            console.log('Fields to add:', schemaAdd);
            console.log('Fields to delete:', schemaDelete);

            // const { toCreate, toDelete, schemaAdd, schemaDelete } = await CheckLists();
            // Remove loading
            modal.find('.loading-spinner').remove();

            // Are there new lists in lists.js that need to be created?
            if (toCreate.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-success mb-4'>
                        <h4 class='mb-4'>Create lists</h4>
                        <div class='create-lists alert alert-light'>
                            ${toCreate
                        .sort((a, b) => a.list - b.list)
                        .map(item => {
                            return /*html*/ `
                                        <div class="form-check ml-2">
                                            <input class="form-check-input" type="checkbox" value="" id="checkbox-${item.list.split(' ').join('-')}" data-list='${item.list}' checked>
                                            <label class="form-check-label" for="checkbox-${item.list.split(' ').join('-')}">
                                                ${item.list}
                                            </label>
                                        </div>
                                    `;
                        }).join('\n')}
                        </div>
                    </div>
                `);
            }

            // Choose columns to add
            if (schemaAdd.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-success mb-4'>    
                        <h4 class='mb-4'>Add new fields to installed lists</h4>
                        <div class='schema-add'>
                            ${schemaAdd
                        .sort((a, b) => a.list - b.list)
                        .map(item => {
                            const { list, fields } = item;
                            return /*html*/ `
                                        <div class='alert alert-light'>
                                            <h5 data-list='${list}'>${list}</h5>
                                            ${fields.map(field => {
                                return /*html*/ `
                                                        <div class="form-check ml-2">
                                                            <input class="form-check-input" type="checkbox" value="${field}" id="checkbox-${field}" data-list='${list}' checked>
                                                            <label class="form-check-label" for="checkbox-${field}">
                                                                ${field}
                                                            </label>
                                                        </div>
                                                    `;
                            }).join('\n')}
                                        </div>
                                    `;
                        }).join('\n')}
                        </div>
                    </div>
                `);
            }

            // Have lists been removed from list.js that need to be removed?
            if (toDelete.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-danger mb-4'>
                        <h4 class='mb-4'>Delete lists</h4>
                        <div class='delete-lists alert alert-light'>
                            ${diffToDelete
                        // .sort((a, b) => a.list - b.list)
                        .sort((a, b) => a - b)
                        .map(item => {
                            return /*html*/ `
                                        <div class="form-check ml-2">
                                            <input class="form-check-input" type="checkbox" value="" id="checkbox-${item.split(' ').join('-')}" data-list='${item}'>
                                            <label class="form-check-label" for="checkbox-${item.split(' ').join('-')}">
                                                ${item}
                                            </label>
                                        </div>
                                    `;
                        }).join('\n')}
                        </div>
                    </div>
                `);
            }


            // Choose columns to delete (DESTRUCTIVE)
            if (schemaDelete.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-danger mb-4'>
                        <h4 class='mb-4'>Delete fields from installed lists</h4>
                        <div class='schema-delete'>
                            ${schemaDelete
                        .sort((a, b) => a.list - b.list)
                        .map(item => {
                            const { list, fields } = item;
                            return /*html*/ `
                                        <div class='alert alert-light'>
                                            <h5 data-list='${list}'>${list}</h5>
                                            ${fields.map(field => {
                                return /*html*/ `
                                                        <div class="form-check ml-2">
                                                            <input class="form-check-input" type="checkbox" value="${field}" id="checkbox-${field}" data-list='${list}'>
                                                            <label class="form-check-label" for="checkbox-${field}">
                                                                ${field}
                                                            </label>
                                                        </div>
                                                    `;
                            }).join('\n')}
                                        </div>
                                    `;
                        }).join('\n')}
                        </div>
                    </div>
                `);
            }

            if (toCreate.length || toDelete.length || schemaAdd.length || schemaDelete.length) {
                const installBtn = BootstrapButton({
                    async action(event) {
                        // Get checked lists
                        const checkedCreate = [...modal.findAll('.create-lists .form-check-input:checked')].map(node => allLists.find(item => item.list === node.dataset.list));
                        const checkedDelete = [...modal.findAll('.delete-lists .form-check-input:checked')].map(node => webLists.find(item => item.Title === node.dataset.list));
                        const checkedSchemaAdd = [...modal.findAll('.schema-add .form-check-input:checked')].map(node => {
                            const list = node.dataset.list;
                            const name = node.value;
                            const field = allLists.find(item => item.list === list).fields.find(item => item.name == name);

                            return {
                                list,
                                field
                            };
                        });
                        const checkedSchemaDelete = [...modal.findAll('.schema-delete .form-check-input:checked')].map(node => {
                            return { list: node.dataset.list, name: node.value };
                        });

                        console.log('Checked Add', checkedSchemaAdd);
                        console.log('Checked Delete', checkedSchemaDelete);

                        // if (!checkedCreate.concat(checkedDelete).length) {
                        //     alert('Select at least one list');
                        //     return;
                        // }
                        modal.find('.modal-content').style.width = 'unset';

                        modalBody.style.height = `${modalBody.offsetHeight}px`;
                        modalBody.style.width = `${modalBody.offsetWidth}px`;
                        modalBody.style.overflowY = 'unset';
                        modalBody.style.display = 'flex';
                        modalBody.style.flexDirection = 'column',
                            modalBody.style.transition = 'all 300ms ease-in-out';
                        modalBody.innerHTML = '';
                        modalBody.style.height = '80vh';
                        modalBody.style.width = '80vw';

                        modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                            <h3 class='console-title mb-0'>Updating <strong>lists</strong></h3>
                        `);

                        // List delete and schema delete only increment progressbar once for each pass
                        let progressCount = checkedDelete.length + +checkedSchemaDelete.length;

                        // Add progress count for lists to create
                        // TODO: Refactor to MAP => REDUCE
                        checkedCreate.forEach(item => {
                            const { fields } = item;

                            // List + 1 for install
                            progressCount = progressCount + 1;

                            fields.forEach(field => {
                                // Field +2 (add column to list and view)
                                progressCount = progressCount + 2;
                            });
                        });

                        // TODO: Refactor to MAP => REDUCE
                        checkedSchemaAdd.forEach(item => {
                            // +2 Create/Add to view
                            progressCount = progressCount + 2;
                        });

                        const progressBar = ProgressBar({
                            parent: modalBody,
                            totalCount: progressCount
                        });

                        Store.add({
                            name: 'install-progress-bar',
                            component: progressBar
                        });

                        progressBar.add();

                        const deleteContainer = Container({
                            padding: '10px',
                            parent: modalBody,
                            overflow: 'hidden',
                            width: '100%',
                            height: '100%',
                            radius: '10px',
                            background: '#1E1E1E'
                        });

                        deleteContainer.add();

                        const reinstallConsole = InstallConsole({
                            type: 'secondary',
                            text: '',
                            margin: '0px',
                            parent: deleteContainer
                        });

                        Store.add({
                            name: 'install-console',
                            component: reinstallConsole
                        });

                        reinstallConsole.add();
                        reinstallConsole.get().classList.add('console');

                        // CREATE LISTS ---------------------------------------------------------------------------------
                        if (checkedCreate.length) {
                            // 1. CORE: Add core lists to install-console
                            reinstallConsole.append(/*html*/ `
                                    <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>Create lists:</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            checkedCreate.forEach(item => {
                                const { list } = item;

                                reinstallConsole.append(/*html*/ `
                                    <div class='console-line'>
                                        <!-- <code class='line-number'>0</code> -->
                                        <code>- ${list}</code>
                                    </div>
                                `);

                                // Scroll console to bottom
                                reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                            });

                            // Add spacer to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='opacity: 0;'>Spacer</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            // Add default lists first
                            for (let list in checkedCreate) {
                                // Create lists
                                await CreateList(checkedCreate[list]);

                                // Add spacer to console
                                reinstallConsole.append(/*html*/ `
                                    <div class='console-line'>
                                        <!-- <code class='line-number'>0</code> -->
                                        <code style='opacity: 0;'>Spacer</code>
                                    </div>
                                `);

                                // Scroll console to bottom
                                reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                            }

                            // Add Release Notes
                            await CreateItem({
                                list: 'ReleaseNotes',
                                data: {
                                    Summary: `New app lists created`,
                                    Description: checkedCreate.map(item => item.list).join(', ') + '.',
                                    Status: 'Published',
                                    MajorVersion: '0',
                                    MinorVersion: '1',
                                    PatchVersion: '0',
                                    ReleaseType: 'Current'
                                }
                            });

                            console.log(`Added Release Note: ${App.get('name')} lists created - ${checkedCreate.map(item => item.list).join(', ')}.`);

                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>'New ${App.get('name')} lists created - ${checkedCreate.map(item => item.list).join(', ')}.' added to 'releaseNotes'</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            // Add spacer to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='opacity: 0;'>Spacer</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            let spacers = '===================';

                            // 3. Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: mediumseagreen !important;'>${spacers}</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: mediumseagreen !important;'>| Lists installed |</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: mediumseagreen !important;'>${spacers}</code>
                                </div>
                                ${checkedSchemaAdd.length || checkedDelete || checkedSchemaDelete.length ?
                                    /*html*/ `
                                        <div class='console-line'>
                                            <!-- <code class='line-number'>0</code> -->
                                            <code style='opacity: 0;'>Spacer</code>
                                        </div>
                                    ` :
                                    ''}
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                        }

                        // END CREATE -----------------------------------------------------------------------------------
                        // ADD COLUMNS ----------------------------------------------------------------------------------
                        if (checkedSchemaAdd.length) {
                            for (let item in checkedSchemaAdd) {
                                const { list, field } = checkedSchemaAdd[item];

                                await CreateColumn({
                                    list,
                                    field
                                });
                            }

                            let spacers = '===================';

                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='opacity: 0;'>Spacer</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: mediumseagreen !important;'>${spacers}</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: mediumseagreen !important;'>| Columns created |</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: mediumseagreen !important;'>${spacers}</code>
                                </div>
                                ${checkedDelete.length || checkedSchemaDelete.length ?
                                    /*html*/ `
                                        <div class='console-line'>
                                            <!-- <code class='line-number'>0</code> -->
                                            <code style='opacity: 0;'>Spacer</code>
                                        </div>
                                    ` :
                                    ''}
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                        }

                        // END ADD COLUMNS ------------------------------------------------------------------------------
                        // DELETE LISTS ---------------------------------------------------------------------------------
                        if (checkedDelete.length) {
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>Delete lists:</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            checkedDelete.forEach(item => {
                                const { Title } = item;

                                reinstallConsole.append(/*html*/ `
                                    <div class='console-line'>
                                        <!-- <code class='line-number'>0</code> -->
                                        <code>- ${Title}</code>
                                    </div>
                                `);

                                // Scroll console to bottom
                                reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                            });

                            // Add spacer to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='opacity: 0;'>Spacer</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            // Add default lists first
                            for (let list in checkedDelete) {
                                // Create lists
                                await DeleteList({
                                    list: checkedDelete[list].Title
                                });
                            }

                            // Add spacer to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='opacity: 0;'>Spacer</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            // Add Release Notes
                            await CreateItem({
                                list: 'ReleaseNotes',
                                data: {
                                    Summary: `App Lists deleted`,
                                    Description: checkedDelete.map(item => item.Title).join(', ') + '.',
                                    Status: 'Published',
                                    MajorVersion: '0',
                                    MinorVersion: '1',
                                    PatchVersion: '0',
                                    ReleaseType: 'Current'
                                }
                            });

                            console.log(`Added Release Note: App lists deleted - ${checkedDelete.map(item => item.Title).join(', ')}.`);

                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>'${App.get('name')} lists deleted - ${checkedDelete.map(item => item.list).join(', ')}.' added to 'releaseNotes'</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='opacity: 0;'>Spacer</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: crimson !important;'>=================</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: crimson !important;'>| Lists deleted |</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: crimson !important;'>=================</code>
                                </div>
                                ${checkedSchemaDelete.length ?
                                /*html*/ `
                                        <div class='console-line'>
                                            <!-- <code class='line-number'>0</code> -->
                                            <code style='opacity: 0;'>Spacer</code>
                                        </div>
                                    ` :
                                    ''}
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                        }

                        // END DELETE -----------------------------------------------------------------------------------
                        // DELETE COLUMNS -------------------------------------------------------------------------------
                        if (checkedSchemaDelete.length) {
                            for (let item in checkedSchemaDelete) {
                                const { list, name } = checkedSchemaDelete[item];

                                await DeleteColumn({
                                    list,
                                    name
                                });
                            }

                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='opacity: 0;'>Spacer</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: crimson !important;'>===================</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: crimson !important;'>| Columns deleted |</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: crimson !important;'>===================</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                        }

                        // END DELETE COLUMNS ---------------------------------------------------------------------------
                        modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                            <div class='mt-4 mb-4'><strong>${App.get('name')}</strong> updated.</div>
                        `);

                        // Close modal button
                        const returnBtn = BootstrapButton({
                            type: 'primary',
                            value: 'Close',
                            classes: ['w-100'],
                            action(event) {
                                // Bootstrap uses jQuery .trigger, won't work with .addEventListener
                                $(modal.get()).on('hidden.bs.modal', event => {
                                    console.log('Modal close animiation end');
                                    console.log('Reload');

                                    Route(location.href.split('#')[1] || '');
                                });

                                modal.close();
                            },
                            parent: modalBody
                        });

                        returnBtn.add();

                        // Scroll console to bottom (after launch button pushes it up);
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    },
                    classes: ['w-100', 'mt-2'],
                    width: '100%',
                    parent: modalBody,
                    type: 'primary',
                    value: `Update ${App.get('name')}`
                });

                installBtn.add();
            }

            if (!toCreate.length && !toDelete.length && !schemaAdd.length && !schemaDelete.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-success'><strong>${App.get('name')}</strong> is up-to-date</div>
                `);
            }

            const cancelBtn = BootstrapButton({
                action(event) {
                    console.log('Cancel install');

                    modal.close();
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: 'light',
                value: 'Cancel'
            });

            cancelBtn.add();
        },
        centered: true,
        showFooter: false,
    });

    modal.add();
}
