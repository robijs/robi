import { Title } from '../../Robi/RobiUI.js'
import { MeasureIntakeForm } from './MeasureIntakeForm.js'
import { AllMeasures } from './AllMeasures.js'

export default async function Measures({ parent, pathParts, props }) {
    // TODO: Move to Table()
    // TODO: pass in form components and path as params
    // TODO: immediately route to form if path is list/new or list/#
    // FIXME: User shouldn't have to define route selection logic
    let itemId;

    if (pathParts.length >= 2) {
        itemId = parseInt(pathParts[1]);

        if (typeof itemId === 'number' && !isNaN(itemId)) {
            MeasureIntakeForm({
                parent,
                itemId: itemId,
                path: pathParts[2],
                props
            });

            return;
        } else if (pathParts[1] === 'New') {
            MeasureIntakeForm({
                parent,
                path: pathParts[2],
                props
            });

            return;
        }
    }

    // View title
    const viewTitle = Title({
        title: `Measures`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    AllMeasures({ parent });

    // TODO: Move to Table()
    // Open modal
    if (itemId) {
        const row = measuresTable.findRowById(itemId);

        if (row) {
            if (row.show) {
                row.show().draw(false).node().click();
            } else {
                row.draw(false).node().click();
            }
        }
    }
}