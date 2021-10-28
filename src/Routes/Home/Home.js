import { Authorize, Get, CreateItem, UpdateItem, DeleteItem, Route, AttachFiles, UploadFiles, SendEmail } from '../../Core/Actions.js'
import { Title, Alert, Container, FoldingCube, Card, Modal, BootstrapButton } from '../../Core/Components.js'
import { App } from '../../Core/Settings.js'
import Store from '../../Core/Store.js'
import { Table } from '../../Core/ViewParts.js'

/**
 * 
 */
export default async function Home() {
    /** View Parent */
    const parent = Store.get('maincontainer');

    /** View Title */
    const viewTitle = Title({
        title: App.get('title'),
        subTitle: ``,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();
}