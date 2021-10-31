import { Authorize, Get, CreateItem, UpdateItem, DeleteItem, Route, AttachFiles, UploadFiles, SendEmail, AddStyle } from '../../Core/Actions.js'
import { Title, Alert, Container, FoldingCube, Card, Modal, BootstrapButton } from '../../Core/Components.js'
import { App } from '../../Core/Settings.js'
import Store from '../../Core/Store.js'
import { Table } from '../../Core/ViewParts.js'

/**
 * 
 */
export default async function Home() {
    // View parent
    const parent = Store.get('maincontainer');

    // View title
    const viewTitle = Title({
        title: App.get('title'),
        subTitle: `Subtitle`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    AddStyle({
        name: 'console-box',
        style: /*css*/ `
            .line-number {
                display: inline-block;
                font-weight: 600;
                width: 30px;
            }
        `
    });

    const alertInfo = Alert({
        margin: '20px 0px',
        type: 'info',
        text: /*html*/ `

        `,
        parent
    });

    alertInfo.add();

    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            alertInfo.append(/*html*/ `
                <div>
                    <code class='line-number'>${i + 1}</code>
                    <code>Test line ${i + 1}</code>
                </div>
            `);
        }, (i + 1) * 1000);
    }
}