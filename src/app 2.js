// This file may be modified programmatically.
// If you know the API, feel free to edit it manually.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made from the frontend may not render properly.

import { Start, UpdateItem } from './Robi/Robi.js'
import { Modal, Button, SquareField, SingleLineTextField } from './Robi/RobiUI.js'

// @START-Imports:Lists
import List_Announcements from './Lists/Announcements/Schema.js'
import List_CodeSetFiles from './Lists/CodeSetFiles/Schema.js'
import List_CodeSetItems from './Lists/CodeSetItems/Schema.js'
import List_CodeSets from './Lists/CodeSets/Schema.js'
import List_DataFiles from './Lists/DataFiles/Schema.js'
import List_DenominatorSteps from './Lists/DenominatorSteps/Schema.js'
import List_Measures from './Lists/Measures/Schema.js'
import List_MeasuresChecklist from './Lists/MeasuresChecklist/Schema.js'
import List_MeasuresRTF from './Lists/MeasuresRTF/Schema.js'
import List_NumeratorSteps from './Lists/NumeratorSteps/Schema.js'
import List_Resources from './Lists/Resources/Schema.js'
import List_Terms from './Lists/Terms/Schema.js'
// @END-Imports:Lists

// @START-Imports:Routes
import Route_Checklist from './Routes/Checklist/Checklist.js'
import Route_Dashboard from './Routes/Dashboard/Dashboard.js'
import Route_DataFiles from './Routes/DataFiles/DataFiles.js'
import Route_Measures from './Routes/Measures/Measures.js'
import Route_Newform from './Routes/Newform/Newform.js'
import Route_QuillEditor from './Routes/QuillEditor/QuillEditor.js'
import Route_RefreshStatusReport from './Routes/RefreshStatusReport/RefreshStatusReport.js'
import Route_Resources from './Routes/Resources/Resources.js'
import Route_Terms from './Routes/Terms/Terms.js'
import Route_Test from './Routes/Test/Test.js'
import Route_Timing from './Routes/Timing/Timing.js'
import Route_Upload from './Routes/Upload/Upload.js'
// @END-Imports:Routes

// @START
Start({
    lists: [
        List_Announcements,
        List_CodeSetFiles,
        List_CodeSetItems,
        List_CodeSets,
        List_DataFiles,
        List_DenominatorSteps,
        List_Measures,
        List_MeasuresChecklist,
        List_MeasuresRTF,
        List_NumeratorSteps,
        List_Resources,
        List_Terms
    ],
    routes: [
        // @START-Routes
        // @START-Dashboard
        {
            path: 'Dashboard',
            title: 'Dashboard',
            icon: 'bs-speedometer',
            go: Route_Dashboard
        }
        // @END-Dashboard
        , // @Route
        // @START-RefreshStatusReport
        {
            path: 'RefreshStatusReport',
            title: 'Refresh Status Report',
            icon: 'bs-clock',
            go: Route_RefreshStatusReport
        }
        // @END-RefreshStatusReport
        , // @Route
        // @START-Measures
        {
            path: 'Measures',
            title: 'Measures',
            icon: 'bs-book',
            go: Route_Measures
        }
        // @END-Measures
        , // @Route
        // @START-DataFiles
        {
            path: 'DataFiles',
            title: 'Data Files',
            icon: 'bs-file-earmark-arrow-up',
            go: Route_DataFiles
        }
        // @END-DataFiles
        , // @Route
        // @START-Checklist
        {
            path: 'Checklist',
            title: 'Checklist',
            icon: 'bs-clipboard-check',
            go: Route_Checklist
        }
        // @END-Checklist
        , // @Route
        // @START-Test
        {
            hide: true,
            path: 'Test',
            title: 'Test',
            icon: 'bs-tools',
            go: Route_Test
        }
        // @END-Test
        , // @Route
        // @START-Resources
        {
            path: 'Resources',
            title: 'Resources',
            icon: 'bs-folder',
            go: Route_Resources
        }
        // @END-Resources
        , // @Route
        // @START-Timing
        {
            hide: true,
            path: 'Timing',
            title: 'Timing',
            icon: 'alarm',
            go: Route_Timing
        }
        // @END-Timing
        , // @Route
        // @START-Newform
        {
            path: 'Newform',
            title: 'NewForm',
            icon: 'bs-code-square',
            go: Route_Newform
        }
        // @END-Newform
        , // @Route
        // @START-QuillEditor
        {
            hide: true,
            path: 'QuillEditor',
            title: 'Quill Editor',
            icon: 'bs-pencil-square',
            go: Route_QuillEditor
        }
        // @END-QuillEditor
        , // @Route
        // @START-Terms
        {
            hide: true,
            path: 'Terms',
            title: 'Acronyms & Terms',
            icon: 'bs-info-circle',
            go: Route_Terms
        }
        // @END-Terms
        , // @Route
        // @START-Upload
        {
            path: 'Upload',
            title: 'Upload',
            icon: 'bs-arrow-up-cirlce-fill',
            go: Route_Upload
        }
        // @END-Upload
        // @END-Routes
    ],
    releaseNotes: {
        show: false,
        version: '2.0.0',
        title: 'New version now live',
        message: 'View release notes'
    },
    settings: {
        // @START-SETTINGS
        // REQUIRED PROPERTIES
        // -------------------
        name: /* @START-name */'MeasuresLibrary'/* @END-name */,
        questionTypes: [
            {
                title: 'General',
                path: 'General'
            }
        ],
        theme: /* @START-theme */'Purple'/* @END-theme */,
        title: /* @START-title */'Measures Library'/* @END-title */,
        userDefaultRole: 'User',
        userSettings: /* @START-userSettings */JSON.stringify({ searches: {}, watched: [] })/* @END-userSettings */,
        // OPTIONAL PROPERTIES
        // -------------------
        allowFeedback: true,
        appcontainer: null,
        dev: {
            user: {
                Title: 'First Last',
                Email: 'first.mi.last.ctr@mail.mil',
                LoginName: '0987654321@mil',
                Roles: {
                    results: [
                        'Developer'
                    ]
                },
                SiteId: 1
            },
            testInstall: false,
        },
        library: 'App',
        maincontainer: null,
        roles: [
            'Action Officer',
            'Data Scientist',
            'Visitor'
        ],
        sidebar: null,
        usersList: 'Users',
        autoCollapseWidth: 1260,
        beforeLaunch({ user, resolve }) {
            // Initialize app if user has already selected a role
            if (user.hasAnyRole()) {
                resolve();

                return;
            }

            // Verify user / select role form
            const modal = Modal({
                title: false,
                disableBackdropClose: true,
                scrollable: true,
                centered: true,
                showFooter: false,
                async addContent(modalBody) {
                    // Modify modal style
                    modalBody.classList.add('install-modal');
                    modal.find('.modal-dialog').style.maxWidth = 'fit-content';
                    modal.find('.modal-dialog').style.minWidth = '675px';
        
                    // Heading
                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <h3 class='mb-3'>
                            Welcome, ${user.Title}
                        </h3>
                        <p class='mb-3'>Please <strong>update your bookmarks</strong>, <strong>verify</strong> your name, <strong>choose your role</strong>, then select <strong>Start</strong>.
                        <div class='d-flex align-items-center mb-3'>
                            You can add this page to your bookmarks with 
                            <div class='btn btn-robi mr-2 ml-2' style='color: var(--color); padding: 3px 9px; cursor: auto;'>CTRL</div> 
                            <div style='font-size: 18px;'>+</div>
                            <div class='btn btn-robi mr-2 ml-2' style='color: var(--color); padding: 3px 9px; cursor: auto;'>D</div>
                        </div>
                    `);

                    // Name
                    const nameField = SingleLineTextField({
                        label: 'Name',
                        value: user.Title,
                        parent: modalBody
                    });

                    nameField.add();

                    // Role
                    const roleField = SquareField({
                        items: [
                            {
                                label: 'Action Officer',
                                html: /*html*/ `
                                    <div>
                                        <div style='font-size: 45px; font-weight: 500; text-align: center;'>AO</div>
                                        <div class='mt-2' style='text-align: center; font-weight: 500;'>Action Officer</div>
                                    </div>
                                `
                            },
                            {
                                label: 'Data Scientist',
                                html: /*html*/ `
                                    <div>
                                        <div style='font-size: 45px; font-weight: 500; text-align: center;'>DS</div>
                                        <div class='mt-2' style='text-align: center; font-weight: 500;'>Data Scientist</div>
                                    </div>
                                `
                            },
                            {
                                label: 'Visitor',
                                html: /*html*/ `
                                    <div class=''>
                                        <div class='d-flex align-items-center justify-content-center' style='height: 67.5px;'>
                                            <svg class='icon' style='font-size: 55px; fill: var(--color);'>
                                                <use href='#icon-bs-person-badge'></use>
                                            </svg>
                                        </div>
                                        <div class='mt-2' style='text-align: center; font-weight: 500;'>Visitor</div>
                                    </div>
                                `
                            }
                        ],
                        parent: modalBody
                    });

                    roleField.add();
        
                    // Start button
                    const startBtn = Button({
                        async action(event) {
                            startBtn.disable();
                            startBtn.get().innerHTML = /*html*/ `<span class="spinner-border" role="status" aria-hidden="true" style="width: 18px; height: 18px; border-width: 3px"></span>`;

                            // Modify user item
                            user.Title = nameField.value();


                            // Update user item
                            const updatedUser = await UpdateItem({
                                list: 'Users',
                                itemId: user.Id,
                                data: {
                                    Title: user.Title,
                                    Roles: {
                                        results: user.Roles.results.concat([roleField.value()])
                                    }
                                }
                            });

                            user.Roles.results = updatedUser.Roles.results;
                            
                            // Resolve promise on modal close
                            $(modal.get()).on('hidden.bs.modal', event => {
                                resolve();
                            });
    
                            modal.close();
                        },
                        classes: ['w-100 mt-5'],
                        width: '100%',
                        parent: modalBody,
                        type: 'robi',
                        value: 'Start'
                    });
        
                    startBtn.add();
                },
            });
        
            modal.add();
        }
        // @END-SETTINGS
    }
});
// @END
