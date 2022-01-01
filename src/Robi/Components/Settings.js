import { Title } from './Title.js'
import { Container } from './Container.js'
import { SectionStepper } from './SectionStepper.js'

import { UpgradeAppButton } from './UpgradeAppButton.js'
import { AccountInfo } from './AccountInfo.js'
import { BuildInfo } from './BuildInfo.js'
import { DeveloperLinks } from './DeveloperLinks.js'
import { ReleaseNotesContainer } from './ReleaseNotesContainer.js'
import { SiteUsageContainer } from './SiteUsageContainer.js'
import { Store } from '../Core/Store.js'
import { ChangeTheme } from './ChangeTheme.js'
import { Route } from '../Robi.js'

// @START-File
/**
 * 
 * @param {*} param 
 */
export async function Settings({ parent, pathParts }) {
    // Routed selection, default to Account if none
    const path = pathParts[1] || 'Account';

    const devPaths = [
        'Developer',
        'SiteUsage',
        'Theme',
        'Build'
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
            name: 'Release Notes',
            path: 'ReleaseNotes'
        }
    ];

    // Developers can see additional options
    if (Store.user().Role === 'Developer') {
        sections = sections.concat([
            {
                name: 'Developer',
                path: 'Developer'
            },
            {
                name: 'Site Usage',
                path: 'SiteUsage'
            },
            {
                name: 'Theme',
                path: 'Theme'
            },
            {
                name: 'Build',
                path: 'Build'
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
        borderRight: 'solid 1px #d6d8db80',
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
            break;
        case 'Release Notes':
            ReleaseNotesContainer({
                title: '',
                padding: '0px',
                parent: planContainer
            });
            break;
        case 'Developer':
            DeveloperLinks({
                parent: planContainer
            });
            break;
        case 'Site Usage':
            SiteUsageContainer({
                parent: planContainer
            });
            break;
        case 'Theme':
            ChangeTheme({
                parent: planContainer
            });
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
