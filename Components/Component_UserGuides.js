/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Components */
import Component from '../Actions/Action_Component.js'

export default function Component_UserGuides(param) {
    const {
        parent,
    } = param;

    const component = Component({
        type: 'card',
        html: /*html*/ `
            <div class='user-guides'>
                <h2>User Guide</h2>
                ${selectGuide()}
            </div>
        `,
        style: /*css*/ `
            #id h2 {
                font-size: 2em;
                font-weight: 400;
                color: firebrick;
            }
        `,
        parent,
        position: 'beforeend',
        events: [
            
        ]
    });

    function selectGuide() {
        const roles = App.data.user.roles ? App.data.user.roles.map(role => role.RoleId) : [];
        
        if (roles.find(role => role === 4)) {
            return /*html*/ `
                <a href='https://rhcc.amedd.army.mil/apps/ictl/UserGuides/ICTL%20Training%20Support%20Package%20-%20G3.pdf' target='_blank'>ICTL G3 (Application Administrator)</a>
            `
        }

        if (roles.find(role => role === 3)) {
            return /*html*/ `
                <a href='https://rhcc.amedd.army.mil/apps/ictl/UserGuides/ICTL%20Training%20Support%20Package%20-%20Command%20Training%20Manager.pdf' target='_blank'>ICTL Command Training Manager</a>
            `
        }

        if (roles.find(role => role === 2)) {
            return /*html*/ `
                <a href='https://rhcc.amedd.army.mil/apps/ictl/UserGuides/ICTL%20Training%20Support%20Package%20-%20Department%20Training%20Manager.pdf' target='_blank'>ICTL Department Training Manager</a>
            `
        }

        if (roles.length === 0) {
            return /*html*/ `
                <a href='https://rhcc.amedd.army.mil/apps/ictl/UserGuides/ICTL%20Training%20Support%20Package%20-%20Individual%20Soldier.pdf' target='_blank'>ICTL Individual Soldier</a>
            `
        }
    }

    return component;
}