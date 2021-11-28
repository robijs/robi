import { Authorize } from '../Actions/Authorize.js'
import { Title } from './Title.js'
import { Table } from './Table.js'
import { NewUser } from './NewUser.js'

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
