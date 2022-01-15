import { Style, App } from '../Robi.js';

// @START-File
/**
 *
 * @param {*} param
 */
export async function Permission({ parent }) {
    console.log(App.get('roles'));

    Style({
        name: 'permissions',
        style: /*css*/ `
            .permissions-container {
                width: 100%;
                overflow: overlay;
                padding-bottom: 30px;
            }

            .permissions {
                font-size: 14px;
                width: 100%;
            }

            .permissions td,
            .permissions th {
                vertical-align: top;
                padding: 6px 12px;
            }

            .permissions td:not(:last-child),
            .permissions th:not(:last-child) {
                border-right: solid 1px var(--borderColor);
            }

            .permissions thead tr,
            .permissions tbody tr:not(:last-child) {
                border-bottom: solid 1px var(--borderColor);
            }

            .permissions td:not(:first-child):not(:nth-child(1)) {
                vertical-align: middle;
                text-align: center;
            }
        `
    });

    parent.append(/*html*/ `
        <div class='permissions-container'>
            <table class="permissions">
                <thead>
                    <tr>
                        <th>Role</th>
                        <th>SharePoint Group</th>
                        <th>Settings</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Administrator</td>
                        <td><a href="/sites/J5/AED/MRB/ML/_layouts/15/people.aspx?MembershipGroupId=753" target="_blank">Manage</a></td>
                        <td>W</td>
                    </tr>
                    <tr>
                        <td>Developer</td>
                        <td><a href="/sites/J5/AED/MRB/ML/_layouts/15/people.aspx?MembershipGroupId=754" target="_blank">Manage</a></td>
                        <td>W</td>
                    </tr>
                    <tr>
                        <td>User</td>
                        <td>AD Group</td>
                        <td>R</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="alert alert-robi-secondary mt-4 w-100">
            <div><strong>Read</strong> = R</div>
            <div><strong>Write</strong> = W</div>
        </div>
    `);
}
// @END-File
