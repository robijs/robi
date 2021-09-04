/** RHC-C SharePoint Team */

/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_UpdateItem from '../Actions/Action_UpdateItem.js'
import Action_Store from '../Actions/Action_Store.js'

/** Components */
import Component_Card from '../Components/Component_Card.js'
import Component_Alert from '../Components/Component_Alert.js'
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_ReleaseNotes from '../Components/Component_ReleaseNotes.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default async function View_ReleaseNotes(param) {
    const {
        parent,
        margin
    } = param;

    const releaseNotesCard = Component_Card({
        title: 'Release Notes',
        titleColor: Setting_App.primaryColor,
        width: '100%',
        margin: margin || '20px 0px 0px 0px',
        parent
    });

    releaseNotesCard.add();

    /** Loading Indicator */
    const loadingIndicator = Component_FoldingCube({
        label: 'Loading release notes',
        margin: '40px 0px',
        parent: releaseNotesCard
    });
    
    loadingIndicator.add();

    /** Get Items */
    const releaseNotes = await Action_Get({
        list: 'ReleaseNotes',
        select: 'Id,Title,Description,MajorVersion,MinorVersion,PatchVersion,ReleaseType',
        filter: `Status eq 'Published'`
    });

    if (releaseNotes?.length === 0) {
        const alertInfo = Component_Alert({
            text: 'No release notes have been published for any version',
            type: 'secondary',
            margin: '20px 0px 0px 0px',
            parent: releaseNotesCard
        });

        alertInfo.add();
    }

    const groups = {};

    releaseNotes?.forEach(note => {
        const {
            MajorVersion,
            MinorVersion,
            PatchVersion
        } = note;

        const version = `${MajorVersion}.${MinorVersion}.${PatchVersion}`;

        if (!groups[version]) {
            groups[version] = [];
        }

        groups[version].push(note);
    });

    const versions = [];
    
    for (const key in groups) {
        versions.push(key);
    }
    
    for (let i = versions.length-1; i >= 0; i--) {
        const releaseNotesComponent = Component_ReleaseNotes({
            version: versions[i],
            notes: groups[versions[i]],
            parent: releaseNotesCard
        });
    
        releaseNotesComponent.add();
    }

    /** Remove loading indicator */
    loadingIndicator.remove();
}
