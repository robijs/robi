/** Actions */
import Action_Store from '../Actions/Action_Store.js'

/** Components */
import Component_Title from '../Components/Component_Title.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default async function View_Home() {
    /** View Parent */
    const parent = Action_Store.get('maincontainer');

    /** View Title */
    const viewTitle = Component_Title({
        title: Setting_App.title,
        subTitle: `Subtitle (Ex: Applications's Full Name)`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    parent.get().insertAdjacentHTML('beforeend', /*html*/ `
        <button class='collapse-sidebar' style='margin-top: 20px;'>Collapse</button>
        <button class='open-sidebar' style='margin-top: 20px;'>Open</button>
    `);

    parent.find('.collapse-sidebar').addEventListener('click', event => {
        Action_Store.get('sidebar').find('.logo').classList.add('closed');
        Action_Store.get('sidebar').findAll('.text').forEach(item => item.classList.add('closed'));
    });

    parent.find('.open-sidebar').addEventListener('click', event => {
        Action_Store.get('sidebar').find('.logo').classList.remove('closed');
        Action_Store.get('sidebar').findAll('.text').forEach(item => item.classList.remove('closed'));
    });
}
