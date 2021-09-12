

/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_CreateList from '../Actions/Action_CreateList.js'
import Action_CreateItem from '../Actions/Action_CreateItem.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'
import Setting_Dev from '../Settings/Setting_Dev.js';

export default async function Action_GetCurrentUser(param) {
    const {
        list,
        fields
    } = param;

    const url = Setting_App.mode === 'prod' ? `../../_api/web/CurrentUser` : `http://localhost:3000/users?LoginName=${Setting_Dev.LoginName}`;
    const fetchOptions = {
        headers : { 
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; odata=verbose'
        }
    };

    if (Setting_App.mode === 'prod') {
        const url = `../../_api/web/CurrentUser`;

        /** Check if Users list exists */
        // const usersList = await Action_Get({
        //     api: `../../_api/Web/Lists?$filter=title eq '${list || 'Users'}'`
        // });

        /** Create users list if it doesn't already exist */
        // if (usersList.length === 0) {
        //     console.log(`%cMissing ${list || 'Users'} list.`, 'color: red');
        //     console.log(`Creating ${list || 'Users'} list....`);

        //     await Action_CreateList({
        //         list: list || 'Users',
        //         fields
        //     });

        //     console.log(`%c${list || 'Users'} list created!`, 'color: mediumseagreen');
        // }

        const currentUser = await fetch(url, fetchOptions);
        const response = await currentUser.json();
        const email = response.d.Email;
        const appUser = await Action_Get({
            list: list || 'Users',
            select: fields.map(field => field.name),
            filter: `Email eq '${email}'`
        });

        if (appUser[0]) {
            console.log(`%cUser account for ${appUser[0].Title} found.`, 'color: mediumseagreen');
            return appUser[0];
        } else {
            console.log(response.d);

            const {
                Title,
                Email,
                LoginName
            } = response.d;

            console.log(`%cMissing user account.`, 'color: red');
            console.log(`Creating user account for ${Title}....`);

            /** Create user */
            const newUser = await Action_CreateItem({
                list: 'Users',
                data: {
                    Title,
                    Email,
                    LoginName: LoginName.split('|')[2],
                    Role: Setting_App.get('userDefaultRole') /** Default, can be changed later */,
                    Settings: Setting_App.get('userSettings')
                }
            });

            if (newUser) {
                console.log(`%cUser account for ${Title} created!`, 'color: mediumseagreen');
            } else {
                console.log(`%cFailed to create a user account for ${Title}. Check POST data.`, 'background: firebrick; color: white');
            }
            
            return newUser;
        }
    } else if (Setting_App.mode === 'dev') {
        const currentUser = await fetch(url, fetchOptions);
        const response = await currentUser.json();

        console.log(`%cUser account for ${response[0].Title} found.`, 'color: mediumseagreen');
        return response[0];
    }
}
