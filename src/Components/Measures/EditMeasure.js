import { Get } from '../../Core/Actions.js'
import { Container, FoldingCube, Card, Alert } from '../../Core/Components.js'
import { App } from '../../Core/Settings.js'
import Store from '../../Core/Store.js'

export default async function EditMeasure(param = {}) {
    const {
        table,
        modal,
        parent
    } = param;

    const info = Alert({
        type: 'info',
        text: '<strong>Edit Measure Modal Form</strong> coming soon. Please stay tuned!',
        parent
    });

    info.add();
}