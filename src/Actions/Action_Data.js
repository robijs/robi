

/* Actions */
import Action_Get from './Action_Get.js'
import Action_Store from './Action_Store.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js';

/* Components */
import Component_LoadingBar from '../Components/Component_LoadingBar.js'

export default async function Action_Data(lists) {
    const loadingBar = Component_LoadingBar({
        displayLogo: Setting_App.logo,
        displayTitle: Setting_App.title,
        displayText: 'Loading',
        totalCount: lists?.length || 0
    });

    loadingBar.add();

    let responses;
    
    if (lists) {
        responses = await Promise.all(lists.map(param => {
            const {
                list,
                label,
                select,
                expand,
                filter,
                orderby
            } = param;
    
            return Action_Get({
                list,
                select,
                expand,
                filter,
                orderby,
                action() {
                    loadingBar.update({
                        newDisplayText: label
                    });
                }
            });
        }));
    }

    await loadingBar.end();

    return responses
}
