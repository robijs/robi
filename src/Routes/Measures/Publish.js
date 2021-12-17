import { Container, Modal, BootstrapButton, MultiLineTextField, DateField, Alert } from '../../Robi/RobiUI.js'
import { App, Store, UpdateItem, Route } from '../../Robi/Robi.js'

export function Publish({ item, bannerParent, buttonParent, path }) {
    const { Id, Published, Publisher } = item;

    // Not published
    if (!Published) {
        const bannerContainer = Container({
            width: '100%',
            padding: '0px 30px 10px 30px',
            parent: bannerParent
        });

        bannerContainer.add();

        const banner = Alert({
            type: 'robi-primary',
            margin: '0px',
            classes: ['w-100'],
            text: `<strong>Under Development</strong>`,
            parent: bannerContainer,
        });
        
        banner.add();

        const publishBtn = BootstrapButton({
            type: 'robi',
            classes: ['ml-2'],
            value: 'Publish',
            parent: buttonParent,
            async action() {
                publishBtn.get().disabled = true;
                publishBtn.get().innerHTML = /*html*/ `
                    <span class="spinner-border" role="status" aria-hidden="true" style="width: 20px; height: 20px; border-width: 3px"></span> Publishing
                `;

                await UpdateItem({
                    itemId: Id,
                    list: 'Measures',
                    data: {
                        Published: new Date().toISOString(),
                        Publisher: JSON.stringify(Store.user()),
                        Status: 'Published'
                    }
                });

                // Remove stored measure
                Store.removeData(`edit measure ${Id}`);

                Route(`Measures/${Id}${path ? `/${path}` : ''}`)
            }
        });

        publishBtn.add();
        
        return;
    }
    
    // Published
    if (Published) {
        const bannerContainer = Container({
            width: '100%',
            padding: '0px 30px 10px 30px',
            parent: bannerParent
        });

        bannerContainer.add();

        const user = JSON.parse(Publisher);
        const userName = user.Title.split(' ').slice(0, 2).join(' ');
        const userLink = Store.user().Role === 'Developer' || Store.user().Role === 'Administrator' ? `<a class='alert-link' href='${App.get('site')}#Users/${user.Id}' target='_blank'>${userName}</a>` : ''

        const banner = Alert({
            type: 'success',
            margin: '0px',
            classes: ['w-100'],
            text: `Published on <strong>${new Date(Published).toLocaleDateString()}</strong> by <strong>${userLink}</strong>`,
            parent: bannerContainer,
        });
        
        banner.add();

        const unpublishBtn = BootstrapButton({
            type: 'robi-light',
            classes: ['ml-2'],
            value: 'Unpublish',
            parent: buttonParent,
            async action() {
                unpublishBtn.get().disabled = true;
                unpublishBtn.get().innerHTML = /*html*/ `
                    <span class="spinner-border" role="status" aria-hidden="true" style="width: 20px; height: 20px; border-width: 3px"></span> Unpublishing
                `;

                await UpdateItem({
                    itemId: Id,
                    list: 'Measures',
                    data: {
                        Published: null,
                        Publisher: null,
                        Status: 'Under Development'
                    }
                });

                // Remove stored measure
                Store.removeData(`edit measure ${Id}`);

                Route(`Measures/${Id}${path ? `/${path}` : ''}`)
            }
        });

        unpublishBtn.add();

        return;
    }
}