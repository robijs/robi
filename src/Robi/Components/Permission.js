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
                        <th>Measure Development Checklist</th>
                        <th>Measure Intake Form</th>
                        <th>Data Files</th>
                        <th>New Access Request</th>
                        <th>Resource Library</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>ML Action Officer</td>
                        <td><a href="/sites/J5/AED/MRB/ML/_layouts/15/people.aspx?MembershipGroupId=753" target="_blank">Manage</a></td>
                        <td>R</td>
                        <td>C</td>
                        <td></td>
                        <td>C</td>
                        <td>C</td>
                        <td>R</td>
                        <td data-page="Help Requests">R</td>
                        <td data-page="Instructions">R</td>
                        <td data-page="Admin">R</td>
                    </tr>
                    <tr>
                        <td>
                            ML Data Scientist
                        </td>
                        <td><a href="/sites/J5/AED/MRB/ML/_layouts/15/people.aspx?MembershipGroupId=754" target="_blank">Manage</a></td>
                        <td>C</td>
                        <td>C</td>
                        <td></td>
                        <td>C</td>
                        <td>C</td>
                        <td>R</td>
                        <td data-page="Help Requests">R</td>
                        <td data-page="Instructions">R</td>
                        <td data-page="Admin">R</td>
                    </tr>
                    <tr>
                        <td>ML Data Administrator</td>
                        <td><a href="/sites/J5/AED/MRB/ML/_layouts/15/people.aspx?MembershipGroupId=755" target="_blank">Manage</a></td>
                        <td>C</td>
                        <td>C</td>
                        <td></td>
                        <td>C</td>
                        <td>C</td>
                        <td>C</td>
                        <td data-page="Help Requests">X</td>
                        <td data-page="Instructions">R</td>
                        <td data-page="Admin">R</td>
                    </tr>
                    <tr>
                        <td>Everyone</td>
                        <td>AD Group</td>
                        <td></td>
                        <td>R</td>
                        <td></td>
                        <td></td>
                        <td>C</td>
                        <td>R</td>
                        <td data-page="Help Requests">R</td>
                        <td data-page="Instructions">R</td>
                        <td data-page="Admin">R</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="alert alert-robi-secondary mt-4 w-100">
            <div><strong>Read</strong> = R</div>
            <div><strong>Access</strong> = X</div>
            <div><strong>Contributor</strong> = C</div>
        </div>
    `);
}
// @END-File
