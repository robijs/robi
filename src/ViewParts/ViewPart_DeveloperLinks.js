/** Components */
import Component_Card from '../Components/Component_Card.js'
import Component_Button from '../Components/Component_Button.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default async function View_DeveloperLinks(param) {
    const {
        parent,
    } = param;

    addSection({
        title: 'Pages',
        buttons: [
            {
                value: 'Settings',
                url: '/sites/J5/QPP/_layouts/15/settings.aspx'
            },
            {
                value: 'Site Contents',
                url: '/sites/J5/QPP/_layouts/15/viewlsts.aspx'
            },
            {
                value: 'Add an app',
                url: '/sites/J5/QPP/_layouts/15/addanapp.aspx'
            }
        ]
    });

    addSection({
        title: 'Data',
        buttons: [

        ]
    });

    addSection({
        title: 'Lists',
        buttons: [
            {
                value: 'Errors',
                url: '/sites/J5/QPP/Lists/Errors'
            },
            {
                value: 'Log',
                url: '/sites/J5/QPP/Lists/Log'
            },
            {
                value: 'Questions',
                url: '/sites/J5/QPP/Lists/Questions'
            },
            {
                value: 'Users',
                url: '/sites/J5/QPP/Lists/Users'
            },
            {
                value: 'Release Notes',
                url: '/sites/J5/QPP/Lists/ReleaseNotes'
            }
        ]
    });

    addSection({
        title: 'Libraries',
        buttons: [
            {
                value: 'App',
                url: '/sites/J5/QPP/App'
            },
            {
                value: 'Docs',
                url: '/sites/J5/QPP/devdocs'
            }
        ]
    });

    addSection({
        title: 'Schemas',
        buttons: [

        ]
    });

    addSection({
        title: 'Business Rules',
        buttons: [

        ]
    });

    addSection({
        title: 'Settings',
        buttons: [
            {
                value: 'Home',
                url: '/sites/J5/QPP/Lists/View_Home'
            },
            {
                value: 'Questions',
                url: '/sites/J5/QPP/Lists/View_Questions'
            }
        ]
    });

    function addSection(param) {
        const {
            title,
            buttons
        } = param;

        /** Pages */
        const card = Component_Card({
            title,
            titleColor: Setting_App.primaryColor,
            width: '100%',
            margin: '20px 0px 0px 0px',
            parent
        });

        card.add();
        
        buttons.forEach(button => {
            const {
                value,
                url
            } = button;

            const settingsButton = Component_Button({
                type: 'normal',
                value,
                margin: '10px 0px',
                parent: card,
                async action(event) {
                    window.open(url);
                }
            });
        
            settingsButton.add();
        });
    }
}
