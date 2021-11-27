import { 
    Modal,
    BootstrapButton,
    ProgressBar,
    InstallConsole,
    Container 
} from './Components.js'
import { Lists } from '../Models/Lists.js'
import lists from '../lists.js'
import { App, Store } from '../Core.js'
import { DeleteList } from './DeleteList.js'

/**
 * 
 * @param {*} event 
 */
export function DeleteApp() {
    const modal = Modal({
        title: false,
        disableBackdropClose: true,
        scrollable: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');

            // Core lists
            const coreLists = Lists();
            console.log(coreLists);

            // App lists
            const appLists = lists;
            console.log(coreLists);

            // All Lists
            const allLists = Lists().concat(lists);
            console.log(allLists);

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h4 class='mb-3'>All <strong>${App.get('name')}</strong> lists and items will be deleted</h4>
                <ul>
                    ${
                        appLists
                        .sort((a, b) => a.list - b.list)
                        .map(item => {
                            return /*html*/ `
                                <li>${item.list}</li>
                            `
                        }).join('\n')
                    }
                </ul>
                <h4 class='mt-3 mb-3'>All <strong>Core</strong> lists and items will be deleted</h4>
                <ul>
                    ${
                        coreLists
                        .sort((a, b) => a.list - b.list)
                        .map(item => {
                            return /*html*/ `
                                <li>${item.list}</li>
                            `
                        }).join('\n')
                    }
                </ul>
                <div class='alert alert-danger mt-5' style='border: none; border-radius: 10px;'>
                    This can't be undone. Proceed with caution.
                </div>
            `);

            const deleteBtn = BootstrapButton({
                async action(event) {
                    console.log('Delete');

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
                        <h3 class='console-title mb-0'>Deleting <strong>${App.get('name')}</strong></h3>
                    `);

                    let progressCount = allLists.length;

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

                    const deleteConsole = InstallConsole({
                        type: 'secondary',
                        text: '',
                        margin: '0px',
                        parent: deleteContainer
                    });

                    Store.add({
                        name: 'install-console',
                        component: deleteConsole
                    });

                    deleteConsole.add();
                    deleteConsole.get().classList.add('console');

                    // 1. CORE: Add core lists to install-console
                    deleteConsole.append(/*html*/ `
                            <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Delete core lists:</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    coreLists.forEach(item => {
                        const { list } = item;

                        deleteConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>- ${list}</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;
                    });

                    // Add spacer to console
                    deleteConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    // Add default lists first
                    for (let list in coreLists) {
                        // Create lists
                        await DeleteList(coreLists[list]);
                    }

                    // Add spacer to console
                    deleteConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    // 2. USER DEFINED: Add user defined lists to install-console
                    deleteConsole.append(/*html*/ `
                            <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Delete '${App.get('name')}' lists:</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    lists.forEach(item => {
                        const { list } = item;

                        deleteConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>- ${list}</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;
                    });

                    // Add spacer to console
                    deleteConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    // Add default lists first
                    for (let list in lists) {
                        // Create lists
                        await DeleteList(lists[list]);

                        // Add spacer to console
                        deleteConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code style='opacity: 0;'>Spacer</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;
                    }

                    console.log('App deleted');


                    let spacers = '==============';

                    for (let i = 0; i < App.get('name').length; i++) {
                        spacers = spacers + '=';
                    }
                    
                    // 3. Add to console
                    deleteConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: crimson !important;'>${spacers}</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: crimson !important;'>| '${App.get('name')}' deleted |</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: crimson !important;'>${spacers}</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <div class='mt-4 mb-2'>All lists and data for <strong>${App.get('name')}</strong> have been successfully deleted.</div>
                        <div class='mb-4'>You can install it again at <strong>Site Contents > App > src > pages > app.aspx</strong></div>
                    `);

                    // Show return button
                    const returnBtn = BootstrapButton({
                        type: 'primary',
                        value: 'Site Contents',
                        classes: ['w-100'],
                        action(event) {
                            // Bootstrap uses jQuery .trigger, won't work with .addEventListener
                            $(modal.get()).on('hidden.bs.modal', event => {
                                console.log('Modal close animiation end');
                                console.log('Launch');

                                // Go to SharePoint site home page
                                location = `${App.get('site')}/_layouts/15/viewlsts.aspx`;
                            });

                            modal.close();
                        },
                        parent: modalBody
                    });

                    returnBtn.add();

                    // Scroll console to bottom (after launch button pushes it up);
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;
                },
                classes: ['w-100'],
                width: '100%',
                parent: modalBody,
                type: 'danger',
                value: 'Delete all lists and data'
            });

            deleteBtn.add();

            const cancelBtn = BootstrapButton({
                action(event) {
                    console.log('Cancel delete');

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
