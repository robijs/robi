import { Title, UpgradeAppButton } from '../Core/Components.js';
import Store from '../Core/Store.js';
import {
    AccountInfo,
    BuildInfo,
    DeveloperLinks,
    ReleaseNotesContainer,
    SiteUsage
} from '../Core/ViewParts.js';

/**
 *
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
        SiteUsage({
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
