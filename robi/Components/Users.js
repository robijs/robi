import { Authorize } from '../Core/Actions.js';
import { Title } from '../Core/Components.js';
import {
    Table,
    NewUser
} from '../Core/ViewParts.js';

/**
 *
 * @param {*} param
 * @returns
 */

export async function Users(param) {
    const { parent, itemId } = param;

    /** Authorize */
    const isAuthorized = Authorize('Users');

    if (!isAuthorized) {
        return;
    }

    const viewTitle = Title({
        title: 'Users',
        date: `${new Date().toLocaleString('default', {
            dateStyle: 'full'
        })}`,
        type: 'across',
        parent
    });

    viewTitle.add();

    const usersTable = Table({
        list: 'Users',
        newForm: NewUser,
        parent
    });

    /** Open modal */
    if (itemId) {
        const row = usersTable.findRowById(itemId);

        if (row) {
            row.show().draw(false).node().click();
        }
    }
}
