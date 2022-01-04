import { App } from '../Core/App.js'
import { Title } from './Title.js'
import { Table } from './Table.js'
import { Timer } from './Timer.js'
import { Card } from './Card.js'
import { Container } from './Container.js'
import { SectionStepper } from './SectionStepper.js'
import { DevConsole } from './DevConsole.js'
import { UpgradeAppButton } from './UpgradeAppButton.js'
import { AccountInfo } from './AccountInfo.js'
import { BuildInfo } from './BuildInfo.js'
import { DeveloperLinks } from './DeveloperLinks.js'
import { ReleaseNotesContainer } from './ReleaseNotesContainer.js'
import { SiteUsageContainer } from './SiteUsageContainer.js'
import { Store } from '../Core/Store.js'
import { ChangeTheme } from './ChangeTheme.js'
import { LoadingSpinner } from './LoadingSpinner.js'
import { ErrorForm } from './ErrorForm.js'
import { LogForm } from './LogForm.js'
import { MyTheme } from './MyTheme.js'
import { CreateItem } from '../Actions/CreateItem.js'
import { Get } from '../Actions/Get.js'
import { Route } from '../Actions/Route.js'
import { Wait } from '../Actions/Wait.js'
import { Style } from '../Robi.js'

// @START-File
/**
 * 
 * @param {*} param 
 */
export async function Settings({ parent, pathParts }) {
    // Routed selection, default to Account if none
    const path = pathParts[1] || 'Account';

    const devPaths = [
        'Build',
        'Logs',
        'SiteUsage',
        'SharePoint',
        'Theme'
    ];

    if (devPaths.includes(path) && Store.user().Role !== 'Developer') {
        Route('403');
    }

    // All users see Account and Release Notes
    let sections = [
        {
            name: 'Account',
            path: 'Account'
        },
        {
            name: 'Preferences',
            path: 'Preferences'
        }
    ];

    // Developers can see additional options
    if (Store.user().Role === 'Developer') {
        sections.splice(1, 0, { name: 'App',path: 'App'});
        sections = sections.concat([
            {
                name: 'Actions',
                path: 'Actions'
            },
            {
                name: 'Build',
                path: 'Build'
            },
            {
                name: 'Logs',
                path: 'Logs'
            },
            {
                name: 'SharePoint',
                path: 'SharePoint'
            },
            {
                name: 'Theme',
                path: 'Theme'
            },
            {
                name: 'Usage',
                path: 'Usage'
            }
        ]);
    }

    // Turn off view container default padding
    parent.paddingOff();
        
    // Form Container
    const formContainer = Container({
        height: '100%',
        width: '100%',
        padding: '0px',
        parent
    });

    formContainer.add();

    // Left Container
    const leftContainer = Container({
        overflow: 'overlay',
        height: '100%',
        minWidth: 'fit-content',
        direction: 'column',
        padding: '20px',
        borderRight: `solid 1px var(--borderColor)`,
        parent: formContainer
    });

    leftContainer.add();

    // Right Container
    const rightContainer = Container({
        flex: '1',
        height: '100%',
        direction: 'column',
        overflowX: 'overlay',
        padding: '20px 0px 0px 0px',
        parent: formContainer
    });

    rightContainer.add();

    // Title Container
    const titleContainer = Container({
        display: 'block',
        width: '100%',
        parent: rightContainer
    });

    titleContainer.add();

    const section = sections.find(item => item.path === path)?.name;

    // Route Title
    const routeTitle = Title({
        title: 'Settings',
        subTitle: section || 'Account',
        padding: '0px 30px 10px 30px',
        width: '100%',
        parent: titleContainer,
        type: 'across',
        action(event) {
            projectContainer.get().scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });

    routeTitle.add();

    // Project Container
    const projectContainer = Container({
        name: 'project',
        padding: '0px',
        width: '100%',
        height: '100%',
        direction: 'column',
        overflow: 'overlay',
        align: 'center',
        parent: rightContainer
    });

    projectContainer.add();

    // TODO: Move to Container method
    // Scroll listener
    projectContainer.get().addEventListener('scroll', event => {
        if (event.target.scrollTop > 0) {
            projectContainer.get().style.borderTop = `solid 1px var(--borderColor)`;
        } else {
            projectContainer.get().style.borderTop = `none`;
        }
    });

    // Plan Container
    const planContainer = Container({
        width: '100%',
        name: 'plan',
        padding: '10px 30px 0px 30px;',
        direction: 'column',
        parent: projectContainer
    });

    planContainer.add();

    // Section Stepper
    const sectionStepperContainer = Container({
        direction: 'column',
        parent: leftContainer
    });

    sectionStepperContainer.add();

    const sectionStepper = SectionStepper({
        numbers: false,
        route: 'Settings',
        sections: sections.sort((a, b) => a.name.localeCompare(b.name)),
        selected: section,
        parent: sectionStepperContainer
    });

    sectionStepper.add();

    // Show section based on path
    switch (section) {
        case 'Account':
            AccountInfo({
                parent: planContainer
            });
            break;
        case 'App':
            if (Store.user().Role === 'Developer') {
                const devConsole = DevConsole({
                    parent: planContainer
                });
            
                devConsole.add();
            }

            ReleaseNotesContainer({
                parent: planContainer
            });
            break;
        case 'Actions':
            // actions();
            actionsISE();
            break;
        case 'Usage':
            SiteUsageContainer({
                parent: planContainer
            });
            break;
        case 'Theme':
            ChangeTheme({
                parent: planContainer
            });
            break;
        case 'Logs':
            const logLoadingIndicator = LoadingSpinner({
                message: 'Loading logs',
                type: 'robi',
                parent: planContainer
            });
        
            logLoadingIndicator.add();
        
            const log = await Get({
                list: 'Log',
                select: 'Id,Title,Message,Module,StackTrace,SessionId,Created,Author/Title',
                expand: 'Author/Id',
                orderby: 'Id desc',
                top: '25',
            });
        
            const logCard = Card({
                background: 'var(--background)',
                width: '100%',
                radius: '20px',
                padding: '20px 30px',
                margin: '0px 0px 40px 0px',
                parent: planContainer
            });
        
            logCard.add();
        
            await Table({
                heading: 'Logs',
                headingMargin: '0px 0px 20px 0px',
                fields: [
                    {
                        internalFieldName: 'Id',
                        displayName: 'Id'
                    },
                    {
                        internalFieldName: 'SessionId',
                        displayName: 'SessionId'
                    },
                    {
                        internalFieldName: 'Title',
                        displayName: 'Type'
                    },
                    {
                        internalFieldName: 'Created',
                        displayName: 'Created'
                    },
                    {
                        internalFieldName: 'Author',
                        displayName: 'Author'
                    }
                ],
                buttons: [],
                buttonColor: App.get('prefersColorScheme') === 'dark' ? '#303336' : '#dee2e6',
                showId: true,
                addButton: false,
                checkboxes: false,
                formTitleField: 'Id',
                order: [[0, 'desc']],
                items: log,
                editForm: LogForm,
                editFormTitle: 'Log',
                parent: logCard
            });
        
            logLoadingIndicator.remove();
        
            const errorsLoadingIndicator = LoadingSpinner({
                message: 'Loading errors',
                type: 'robi',
                parent: planContainer
            });
        
            errorsLoadingIndicator.add();
        
            const errors = await Get({
                list: 'Errors',
                select: 'Id,Message,Error,Source,SessionId,Status,Created,Author/Title',
                expand: 'Author/Id',
                orderby: 'Id desc',
                top: '25'
            });
        
            const errorsCard = Card({
                background: 'var(--background)',
                width: '100%',
                radius: '20px',
                padding: '20px 30px',
                margin: '0px 0px 40px 0px',
                parent: planContainer
            });
        
            errorsCard.add();
        
            await Table({
                heading: 'Errors',
                headingMargin: '0px 0px 20px 0px',
                fields: [
                    {
                        internalFieldName: 'Id',
                        displayName: 'Id'
                    },
                    {
                        internalFieldName: 'SessionId',
                        displayName: 'SessionId'
                    },
                    {
                        internalFieldName: 'Created',
                        displayName: 'Created'
                    },
                    {
                        internalFieldName: 'Author',
                        displayName: 'Author'
                    }
                ],
                buttonColor: '#dee2e6',
                showId: true,
                addButton: false,
                checkboxes: false,
                formFooter: false,
                formTitleField: 'Id',
                order: [[0, 'desc']],
                items: errors,
                editForm: ErrorForm,
                editFormTitle: 'Error',
                parent: errorsCard
            });
        
            errorsLoadingIndicator.remove();
            break;
        case 'Build':
            BuildInfo({
                parent: planContainer
            });

            const upgrade = UpgradeAppButton({
                parent: planContainer
            });

            upgrade.add();
            break;
        case 'Preferences':
            const themePreference = MyTheme({
                parent: planContainer
            });

            themePreference.add();
            break;
        case 'SharePoint':
            if (Store.user().Role === 'Developer') {
                DeveloperLinks({
                    parent: planContainer
                });
            }
            break;
        default:
            Route('404');
            break;
    }

    // Actions
    function actions() {
        // Toggle update
        let run = false;

        // Update clock and buttons
        const timer = Timer({
            parent: planContainer,
            classes: ['w-100'],
            start() {
                run = true;
                console.log(`Run: ${run}`);

                // create(25);
                // update();
            },
            stop() {
                run = false;
                console.log(`Run: ${run}`);
            },
            reset() {
                console.log('reset');
            }
        });

        timer.add();

        const items = []; // Get({ list: 'ListName' })

        async function create(limit) {
            /** Set items */
            for (let i = 0; i < limit; i++) {

                if (run) {
                    // Create Item
                    const newItem = await CreateItem({
                        list: '',
                        data,
                        wait: false
                    });

                    console.log(`Id: ${newItem.Id}.`);

                    if (i === limit - 1) {
                        timer.stop();
                    }
                } else {
                    console.log('stoped');

                    break;
                }
            }
        }

        async function update() {
            /** Set items */
            for (let i = 0; i < items.length; i++) {
                if (run) {

                    // update item
                    if (i === items.length - 1) {
                        timer.stop();
                    }
                } else {
                    console.log('stoped');

                    break;
                }
            }
        }

        // /** Test Attach Files Button */
        // const attachFilesButton = UploadButton({
        //     async action(files) {
        //         console.log(files);
        //         const uploadedFiles = await AttachFiles({
        //             list: 'View_Home',
        //             id: 1,
        //             files
        //         });
        //         console.log(uploadedFiles);
        //     },
        //     parent: planContainer,
        //     type: 'btn-outline-success',
        //     value: 'Attach file',
        //     margin: '20px 0px 20px 0px'
        // });
        // attachFilesButton.add();

        // /** Test Send Email */
        // const sendEmailButton = BootstrapButton({
        //     async action(event) {
        //         await SendEmail({
        //             From: 'stephen.a.matheis.ctr@mail.mil',
        //             To: 'stephen.a.matheis.ctr@mail.mil',
        //             CC: [
        //                 'stephen.a.matheis.ctr@mail.mil'
        //             ],
        //             Subject: `Test Subject`,
        //             Body: /*html*/ `
        //                 <div style="font-family: 'Calibri', sans-serif; font-size: 11pt;">
        //                     <p>
        //                         Test body. <strong>Bold</strong>. <em>Emphasized</em>.
        //                     </p>
        //                     <p>
        //                         <a href='https://google.com'>Google</a>
        //                     </p>
        //                 </div>
        //             `
        //         });
        //     },
        //     parent: planContainer,
        //     classes: ['mt-5'],
        //     type: 'outline-success',
        //     value: 'Send Email',
        //     margin: '0px 0px 0px 20px'
        // });
        // sendEmailButton.add();
    }

    // Actions Integrated Scripting Environment
    async function actionsISE() {
        Style({
            name: 'action-ise',
            style: /*css*/ `
                .code-box::-webkit-scrollbar-thumb {
                    min-height: 40px;
                }

                .CodeMirror-vscrollbar::-webkit-scrollbar-thumb {
                    min-height: 30px;
                }

                .CodeMirror-scrollbar-filler {
                    background: #1e1e1e;
                }
            `
        });
        
        planContainer.get().style.height = '100%';
        planContainer.append(/*html*/ `
            <div class='d-flex flex-column w-100' style='height: 100%; padding-bottom: 30px;'>
                <div class='rs-box alert w-100 mb-0' style='height: 40%; padding: 10px 10px 0px 10px; background: #1e1e1e; color: #d4d4d4;'>
                    <div class='code-box alert w-100 mb-0' style='height: 100%; padding: 0px; background: #1e1e1e; color: #d4d4d4; overflow: overlay;'></div>
                </div>
                <!-- <div class='rs-handle w-100' style='height: 10px; background: var(--primary); cursor: ns-resize;'></div> -->
                <div class='output-box alert alert-robi-secondary w-100 mb-0' style='flex: 1;'></div>
            </div>
        `);

        $('.rs-box').resizable({
            handles: 's'
        });

        // CodeMirror
        const path = 'App/src/Robi/Components';
        const file = 'Settings.js';

        const loading = LoadingSpinner({
            message: `Loading <span style='font-weight: 300;'>${path}/${file}</span>`,
            type: 'white',
            classes: ['h-100', 'loading-file'],
            parent:  planContainer.find('.code-box')
        });

        loading.add();

        document.querySelector('.code-box').insertAdjacentHTML('beforeend', /*html*/ `
            <textarea class='code-mirror-container robi-code-background h-100'></textarea>
        `);

        let shouldReload = false;

        const editor = CodeMirror.fromTextArea(planContainer.find('.code-mirror-container'), {
            mode: 'javascript',
            indentUnit: 4,
            lineNumbers: true,
            // lineWrapping: true,
            autoCloseBrackets: true,
            styleActiveLine: true,
            styleActiveLine: false,
            foldGutter: true,
            matchBrackets: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            keyword: {
                "import": "special",
                "export": "special",
                "default": "special",
                "await": "special",
            },
            // extraKeys: { "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); } },
        });
        editor.foldCode(CodeMirror.Pos(0, 0));
        editor.setSize(0, 0);
        editor.setOption('extraKeys', {
            'Tab': 'indentMore',
            'Shift-Tab': 'indentLess',
            'Ctrl-/'(cm) {
                editor.toggleComment({
                    // this prop makes sure comments retain indented code
                    // https://github.com/codemirror/CodeMirror/issues/3765#issuecomment-171819763
                    indent: true
                });
            },
            async 'Ctrl-S'(cm) {
                // TODO: only save file if changed
                console.log('save file');

                // Save file
                await saveFile();

                // Add changed message
                const changedMessaage = planContainer.find('.changed-message');

                if (!changedMessaage) {
                    planContainer.find('.file-title-text').insertAdjacentHTML('beforeend', /*html*/ `
                        <div class='changed-message' style='margin-left: 10px; color: seagreen'>CHANGED (will reload on close)</div>
                    `);
                }

                // Set reload flag
                shouldReload = true;

            }
        });

        let fileValueRequest;
        let requestDigest;

        if (App.get('mode') === 'prod') {
            const sourceSiteUrl = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files('${file}')/$value`;

            requestDigest = await GetRequestDigest();

            fileValueRequest = await fetch(sourceSiteUrl, {
                method: 'GET',
                headers: {
                    'binaryStringRequestBody': 'true',
                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                    'X-RequestDigest': requestDigest
                }
            });

        } else {
            const devPath = path.replace('App/', '');
            fileValueRequest = await fetch(`http://127.0.0.1:8080/${devPath}/${file}`);
            await Wait(1000);
        }

        // Overriden on save
        // FIXME: Doesn't work with app.js.
        let value = await fileValueRequest.text();

        // Always wait an extra 100ms for CodeMirror to settle.
        // For some reason, gutter width's won't apply 
        // correctly if the editor is modified too quickly.
        setTimeout(() => {
            // Remove loading message
            loading.remove();

            // Set codemirror
            setEditor();
        }, 100);

        // FIXME: Remember initial codemirorr doc value
        // compare this with current doc value
        let docValue;

        function setEditor() {
            editor.setSize('100%', '100%');
            editor.setOption('viewportMargin', Infinity);
            // editor.setOption('theme', 'material-palenight');
            editor.setOption('theme', 'vscode-dark');
            editor.getDoc().setValue(value);
            editor.focus();

            docValue = editor.doc.getValue();

            // Watch for changes
            editor.on('change', event => {
                if (docValue === editor.doc.getValue()) {
                    console.log('unchanged');

                    const dot = planContainer.find('.changed-dot');

                    if (dot) {
                        dot.remove();
                    }
                } else {
                    console.log('changed');

                    const dot = planContainer.find('.changed-dot');

                    if (!dot) {
                        // planContainer.find('.file-title').insertAdjacentHTML('beforeend', /*html*/ `
                        //     <div class='changed-dot' style='margin-left: 15px; width: 8px; height: 8px; background: white; border-radius: 50%;'></div>
                        // `);
                    }
                }
            });
        }
    }
}
// @END-File
