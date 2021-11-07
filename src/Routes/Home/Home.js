import ExampleComponent from '../../Components/ExampleComponent.js'
import { Authorize, Get, CreateItem, UpdateItem, DeleteItem, Route, AttachFiles, UploadFiles, SendEmail, AddStyle } from '../../Core/Actions.js'
import { Title, Alert, Container, FoldingCube, Card, Modal, BootstrapButton, SingleLineTextField, NumberField } from '../../Core/Components.js'
import { App } from '../../Core/Settings.js'
import Store from '../../Core/Store.js'
import { Table } from '../../Core/ViewParts.js'

export default async function Home() {
    // View parent
    const parent = Store.get('maincontainer');

    // View title
    const viewTitle = Title({
        title: App.get('title'),
        subTitle: `Home`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    const exampleComponent = ExampleComponent({
        title: 'This was passed in',
        parent
    });

    exampleComponent.add();

    const testTable = await Table({
        list: 'Test',
        parent
    });

    const newListTable = await Table({
        list: 'NewList',
        parent
    });
}