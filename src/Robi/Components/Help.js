import {
    Title, Container,
    RequestAssitanceInfo
} from '../Core/Components.js';

/**
 *
 */

export async function Help(param) {
    const { parent } = param;

    const viewTitle = Title({
        title: `Help`,
        parent,
        date: new Date().toLocaleString('default', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    /** View Container */
    const viewContainer = Container({
        display: 'block',
        margin: '20px 0px 0px 0px',
        parent
    });

    viewContainer.add();

    const requestAssistanceInfo = RequestAssitanceInfo({
        data: [
            {
                label: 'For help with this app, please contact:',
                name: 'First Last',
                title: 'TItle, Branch',
                email: 'first.last.civ@mail.mil',
                phone: '(555) 555-5555'
            }
        ],
        parent: viewContainer
    });

    requestAssistanceInfo.add();
}
