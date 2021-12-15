import { Container, Alert } from '../../Robi/RobiUI.js'

export function LastEdited({ item, parent }) {
    const { Modified, Editor } = item;
    const { Title } = Editor;
    const date = new Date(Modified).toLocaleDateString();
    const time = new Date(Modified).toLocaleTimeString('en-US', {hour: 'numeric', hour12: true, minute:'2-digit'});

    const bannerContainer = Container({
        width: '100%',
        padding: '0px 30px 10px 30px',
        parent
    });

    bannerContainer.add();

    const banner = Alert({
        type: '',
        classes: ['w-100', 'm-0', 'pt-0', 'pb-0', 'text-right'],
        text: /*html*/ `
            <span style='font-size: 13px;'>Last edited ${date} ${time} • ${Title}</span>
        `,
        parent: bannerContainer,
    });
    
    banner.add();
}