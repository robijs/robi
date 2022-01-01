import { App } from '../Core/App.js'
import { Title } from './Title.js'
import { Table } from './Table.js'
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
import { Get } from '../Actions/Get.js'
import { Route } from '../Actions/Route.js'
import { LoadingSpinner } from './LoadingSpinner.js'
import { ErrorForm } from './ErrorForm.js'
import { LogForm } from './LogForm.js'
import { MyTheme } from './MyTheme.js'

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
        }
    ];

    // Developers can see additional options
    if (Store.user().Role === 'Developer') {
        sections.splice(1, 0, { name: 'App',path: 'App'});
        sections = sections.concat([
            {
                name: 'Build',
                path: 'Build'
            },
            {
                name: 'Logs',
                path: 'Logs'
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
        borderRight: `solid 1px ${App.get('borderColor')}`,
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
            projectContainer.get().style.borderTop = `solid 1px #d6d8db80`;
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
        sections,
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

            const preferences = Card({
                width: '100%',
                title: 'Preferences',
                titleBorder: 'none',
                radius: '20px',
                parent: planContainer
            });

            preferences.add();

            const themePreference = MyTheme({
                parent: planContainer
            });

            themePreference.add();
            break;
        case 'Release Notes':

            break;
        case 'App':
            if (Store.user().Role === 'Developer') {
                const devConsole = DevConsole({
                    parent: planContainer
                });
            
                devConsole.add();
    
                DeveloperLinks({
                    parent: planContainer
                });
            }

            ReleaseNotesContainer({
                parent: planContainer
            });
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
                background: App.get('backgroundColor'),
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
                background: App.get('backgroundColor'),
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
        default:
            Route('404');
            break;
    }
}
// @END-File
