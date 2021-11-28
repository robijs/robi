import { Card } from './Card.js'
import { Button } from './Button.js'
import { App } from '../Core.js'
import lists from '../../lists.js'

/**
 *
 * @param {*} param
 */

export async function DeveloperLinks(param) {
    const {
        parent,
    } = param;

    addSection({
        title: 'SharePoint',
        buttons: [
            {
                value: 'Site Settings',
                url: `${App.get('site')}/_layouts/15/settings.aspx`
            },
            {
                value: `Site Contents`,
                url: `${App.get('site')}/_layouts/15/viewlsts.aspx`
            },
            {
                value: `Add an app`,
                url: `${App.get('site')}/_layouts/15/addanapp.aspx`
            }
        ]
    });

    addSection({
        title: `App Lists`,
        buttons: lists.map(item => {
            const { list } = item;

            return {
                value: list,
                url: `${App.get('site')}/Lists/${list}`
            };
        })
    });

    addSection({
        title: `Core Lists`,
        buttons: [
            {
                value: `Errors`,
                url: `${App.get('site')}/Lists/Errors`
            },
            {
                value: `Log`,
                url: `${App.get('site')}/Lists/Log`
            },
            {
                value: `Questions`,
                url: `${App.get('site')}/Lists/Questions`
            },
            {
                value: `Settings`,
                url: `${App.get('site')}/Lists/Settings`
            },
            {
                value: `Users`,
                url: `${App.get('site')}/Lists/Users`
            },
            {
                value: `Release Notes`,
                url: `${App.get('site')}/Lists/ReleaseNotes`
            }
        ]
    });

    addSection({
        title: `Libraries`,
        buttons: [
            {
                value: `App`,
                url: `${App.get('site')}/App`
            },
            {
                value: `Documents`,
                url: `${App.get('site')}/Shared%20Documents`
            }
        ]
    });

    // addSection({
    //     title: `Schemas`,
    //     buttons: [
    //     ]
    // });
    // addSection({
    //     title: `Business Rules`,
    //     buttons: [
    //     ]
    // });
    function addSection(param) {
        const {
            title, buttons
        } = param;

        /** Pages */
        const card = Card({
            title,
            titleColor: App.get('primaryColor'),
            width: '100%',
            margin: '20px 0px 0px 0px',
            parent
        });

        card.add();

        buttons.forEach(button => {
            const {
                value, url
            } = button;

            const settingsButton = Button({
                type: 'normal',
                value,
                margin: '10px 0px 0px 0px',
                parent: card,
                async action(event) {
                    window.open(url);
                }
            });

            settingsButton.add();
        });
    }
}
