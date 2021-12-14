import { Title } from './Title.js'
import { UpgradeAppButton } from './UpgradeAppButton.js'
import { AccountInfo } from './AccountInfo.js'
import { BuildInfo } from './BuildInfo.js'
import { DeveloperLinks } from './DeveloperLinks.js'
import { ReleaseNotesContainer } from './ReleaseNotesContainer.js'
import { SiteUsageContainer } from './SiteUsageContainer.js'
import { Store } from '../Core/Store.js'

// @START-File
/**
 * 
 * @param {*} param 
 */
export async function Settings(param) {
    const { parent } = param;

    const viewTitle = Title({
        title: `Settings`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    AccountInfo({
        parent
    });

    /** Authorize */
    if (Store.user().Role === 'Developer') {
        DeveloperLinks({
            parent
        });
    }

    ReleaseNotesContainer({
        parent
    });

    /** Authorize */
    if (Store.user().Role === 'Developer') {
        SiteUsageContainer({
            parent
        });

        BuildInfo({
            parent
        });

        const upgrade = UpgradeAppButton({
            parent
        });

        upgrade.add();
    }
}
