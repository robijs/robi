/** RHC-C SharePoint Team */

/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_CreateItem from '../Actions/Action_CreateItem.js'

/** Components */
import Component_DataTable from '../Components/Component_DataTable.js'
import Component_Modal from '../Components/Component_Modal.js'
import Component_DashboardBanner from '../Components/Component_DashboardBanner.js'
import Component_Alert from '../Components/Component_Alert.js'
import Component_MultiLineTextField from '../Components/Component_MultiLineTextField.js'
import Component_Heading from '../Components/Component_Heading.js'

/** View Parts */
import ViewPart_StatusForm from './ViewPart_StatusForm.js'
import ViewPart_NewUser from './ViewPart_NewUser.js'

export default async function ViewPart_Dashboard(param) {
    const {
        filter,
        paging,
        parent
    } = param;

    /** Roster */
    const roster = await Action_Get({
        list: 'Roster',
        select: 'Id,FullName,LastName,FirstName,Category,Rank,Section,Account,ActiveShift,ShiftStart,ShiftEnd,Role',
        filter
    });

    // console.log(roster);
    
    /** Accountability */
    function formatDate(d = new Date()) {
        var mm = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
        var dd = d.getDate() < 10 ? "0" + d.getDate() : d.getDate(); 
     
        return d.getFullYear() + "-" + mm + "-" + dd; // Return ISO date string
    }

    function formatTime(operator, time, date) {
        return `(Date ${operator} datetime'${formatDate(date)}T${time}')`;
    }

    const todayStatuses = await Action_Get({
        list: 'Accountability',
        /** greater than or equal to 12:00 AM this morning and less than or equal to 11:59 PM tonight */
        filter: `${filter ? `${filter} and `: ''}${formatTime('ge', '00:00:00')} and ${formatTime('le', '23:59:59')}`,
        orderby: 'Id desc'
    });

    // console.log(todayStatuses);

    function getYesterday() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() -1);

        return yesterday;
    }

    /** @todo if user is normally day/mid shift but marked themselves night shift yesterday, update entry on accountability set -> pull in all accountability items with Shift === 'Night' */
    
    // console.log(getYesterday());

    const nightShiftStatuses = await Action_Get({
        list: 'Accountability',
        /** greater than or equal to 12:00 AM yesterday morning and less than or equal to 11:59 PM last night */
        filter: `${filter ? `${filter} and `: ''}ShiftStatus eq 'Night' and ${formatTime('ge', '00:00:00', getYesterday())} and ${formatTime('le', '23:59:59', getYesterday())}`,
        orderby: 'Id desc'
    });

    // console.log('Night shifts', nightShiftStatuses);

    const statuses = await Action_Get({
        list: 'Statuses',
        orderby: 'SortOrder asc'
    });

    const data = roster.map(user => {
        const {
            Id,
            LastName,
            FirstName,
            Section,
            Category,
            Rank,
            Account,
            ActiveShift,
            ShiftStart,
            ShiftEnd,
            Role
        } = user;

        /** Get Accountability item */
        let Status = todayStatuses.find(item => item.Account === Account);

        /** Check Night shift */
        if (!Status) {
            // console.log(`${Account} - no status - checking night shift`);
            const nightShift = nightShiftStatuses.find(item => item.Account === Account);
            
            if (nightShift) {
                const currentHour = new Date().getHours();
                const endHour = parseInt(nightShift.ShiftEnd.split(':')[0]);
                
                // console.log('\t', nightShift.Status);
                // console.log(`\t Current Hour:\t${currentHour}`);
                // console.log(`\t End Hour:\t${endHour}`);

                if (endHour > currentHour) {
                    Status = nightShift;

                    // console.log(`\t End hour > Current hour`);
                    // console.log(`\t show status`);
                }
            }
        }
        
        /** Always make sure Status === 'Not Accounted For' is sorted at top */
        const StatusSortOrder = Status ? getStatusSortOrder(Status.Status) : 0;

        /** Marked By might not be in this team */
        let MarkedBy;

        if (Status) {
            let rosterItem = roster.find(item => item.Account === Status.MarkedBy);

            if (!rosterItem) {
               const splitAccount = Status.MarkedBy.split('.');
               const lastIndex = splitAccount.length - 1;

               MarkedBy = splitAccount[lastIndex].toTitleCase();

               if (splitAccount.length > 1) {
                   MarkedBy += `, ${splitAccount[0].toTitleCase()}`;
               }
            } else {
                MarkedBy = rosterItem.FullName;
            }

        } else {
            MarkedBy = '';
        }

        return {
            Id,
            Account,
            Section,
            LastName,
            FirstName,
            Category,
            Rank,
            Status: Status ? Status.Status : 'Not Accounted For',
            Comment: Status ? Status.Comment : '',
            StatusSortOrder, /** For datatables orthongonal data api {@link https://datatables.net/reference/option/columns.data}*/
            Shift: Status ? Status.ShiftStatus : ActiveShift,
            ShiftEnd: Status ? Status.ShiftEnd : ShiftEnd,
            Date: Status ? Status.Date : '',
            Time: Status ? Status.Date : '',
            MarkedBy
        }
    });

    // console.log(data);

    let selectedUser;
    let selectedRow;
    let statusForm;
    let messageExists;
    let messageValid;

    /** Status colors */
    function getStatusColors() {
        let colors = /*css*/ `
            /* Cell */
            #id_wrapper tbody td {
                vertical-align: middle;
            }

            /* Shared */
            #id_wrapper td span.status {
                display: block;
                text-align: center;
                padding: 2px;
                margin: 5px;
                border-radius: 4px;
                color: white;
            }

            /** Not Accounted For */
            #id_wrapper td span.status[data-status='Not Accounted For'] {
                color: gray;
            }
        `

        statuses.forEach(item => {
            const {
                Status,
                Color
            } = item;

            colors += /*css*/ `
                #id_wrapper td span.status[data-status='${Status}'] {
                    background-color: ${Color || 'transparent'};
                }
            `;
        });

        return colors;
    }

    /** Banner ***************************************************************/

    function toPercent(num, den) {
        return Math.round((num / den) * 100);
    }

    function buildBannerData(data) {
        let bannerData = statuses.map(item => {
            const {
                Status,
                Color
            } = item;
    
            const count = data.filter(item => item.Status === Status).length;
    
            return {
                label: Status,
                value: count,
                description: `${toPercent(count, data.length) || 0}%`,
                action: true,
                color: 'white',
                background: Color
            }
        });
    
        /** Total */
        const accountedFor = data.filter(item => item.Status !== 'Not Accounted For').length;
    
        bannerData.unshift({
            label: 'Team Members',
            value: `${accountedFor}/${data.length}`,
            description: `${Math.ceil((accountedFor / data.length) * 100) || 0}%` /** using Math.ciel to make sure this value and not account for === 100% */
        });
    
        /** Not Accounted For */
        const notAccountedFor = data.filter(item => item.Status === 'Not Accounted For').length;
    
        bannerData.push({
            label: 'Not Accounted For',
            value: `${notAccountedFor}`,
            description: `${Math.floor((notAccountedFor / data.length) * 100) || 0}%`, /** using Math.floor to make sure total and this value aren't > 100% */
        });

        return bannerData;
    }

    const dashboard = Component_DashboardBanner({
        margin: '20px 0px',
        // data: bannerData,
        data: buildBannerData(data),
        async action(event) {
            /** Get selected rows */
            const selectedRows = rosterTable.selected();

            /** Get button label */
            const Status = this.dataset.label;

            /** Alert if no one is selected */
            if (selectedRows.length === 0) {
                const alertModal = Component_Modal({
                    title: Status,
                    addContent(modalBody) {
                        const infoAlert = Component_Alert({
                            type: 'info',
                            text: `Please choose one (1) or more rows to set all selected this status.`,
                            parent: modalBody
                        });

                        infoAlert.add();
                    },
                    parent
                });

                alertModal.add();

                return;
            }

            let comment;

            if (Status === 'Other') {
                const commentModal = Component_Modal({
                    title: Status,
                    addContent(modalBody) {
                        comment = Component_MultiLineTextField({
                            label: 'Comment',
                            minHeight: '100px',
                            parent: modalBody
                        });
    
                        comment.add();
                        comment.focus();

                        commentModal.showFooter();
                    },
                    buttons: {
                        footer: [
                            {
                                value: 'Cancel',
                                classes: 'btn-secondary',
                                data: [
                                    {
                                        name: 'dismiss',
                                        value: 'modal'
                                    }
                                ]
                            },
                            {
                                value: 'Set status',
                                classes: 'btn-primary',
                                async onClick(event) {
                                    /** Disable button - Prevent user from clicking this item more than once */
                                    $(event.target)
                                        .attr('disabled', '')
                                        .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Setting status');
    
                                    await createItems({
                                        selectedRows,
                                        Status,
                                        Comment: comment.value()
                                    });
    
                                    /** Enable button */
                                    $(event.target)
                                        .removeAttr('disabled')
                                        .text('Complete!');
    
                                    /** Hide modal */
                                    commentModal.getModal().modal('hide');
                                }
                            }
                        ]
                    },
                    parent
                });

                commentModal.add();

                return;
            }

            await createItems({
                selectedRows,
                Status
            });
        },
        parent
    });

    dashboard.add();

    async function createItems(param) {
        const {
            selectedRows,
            Status,
            Comment
        } = param;

        /** Create Accountabiliy list items */
        const newItems = await Promise.all(selectedRows.map(user => {
            return setStatus({
                Status,
                Comment,
                user
            });
        }));

        /** Update rows */
        newItems.forEach((statusItem, index) => {
            const row = rosterTable.findRowById(selectedRows[index].Id);
            
            row.deselect();

            updateRow({
                row,
                statusItem,
                data: selectedRows[index]
            });
        });
    }

    /** END ***************************************************************/

    const rosterTable = Component_DataTable({
        headers: [
            /* 0 */  '',
            /* 1 */  'Id',
            /* 2 */  'Account',
            /* 3 */  'Section',
            /* 4 */  'Last Name',
            /* 5 */  'First Name',
            /* 6 */  'Category',
            /* 7 */  'Rank',
            /* 8 */  'Status',
            /* 9 */  'Comment',
            /* 10 */ 'Shift',
            /* 11 */ 'Date',
            /* 12 */ 'Time',
            /* 13 */ 'Marked By'
        ],
        checkboxes: true,
        striped: false,
        border: false,
        paging,
        columns: [
            {
                data: null,
            },
            {
                data: 'Id',
                visible: false
            },
            {
                data: 'Account',
                visible: false
            },
            {
                data: 'Section',
                visible: false
            },
            {
                data: 'LastName',
                type: 'string',
                render(data, type, row) {
                    return data;
                }
            },
            {
                data: 'FirstName',
                type: 'string',
                render(data, type, row) {
                    return data;
                }
            },
            {
                data: 'Category',
                type: 'string',
                render(data, type, row) {
                    return data;
                }
            },
            {
                data: 'Rank',
                type: 'string',
                render(data, type, row) {
                    return data;
                }
            },
            {
                /** {@link https://datatables.net/manual/data/orthogonal-data} */
                data: {
                    _: 'StatusSortOrder',
                    display: 'Status',
                    sort: 'StatusSortOrder',
                    filter: 'Status'
                },
                type: 'html-num',
                render(data, type, row) {
                    return /*html*/`
                        <span class='status' data-status='${data}'>${data}</span>
                    `;
                }
            },
            {
                data: 'Comment',
                type: 'string',
                visible: false,
                render(data, type, row) {
                    return data;
                }
            },
            {
                data: 'Shift',
                type: 'string',
                render(data, type, row) {
                    return data;
                }
            },
            /** Date */
            {
                data: {
                    _: 'Time',
                    display: 'Time',
                    sort: 'Time',
                    filter: 'Time'
                },
                type: 'date',
                visible: false,
                render(data, type, row) {
                    return data ? new Date(data).toLocaleDateString('default', {dateStyle: 'short'}) : ''
                }
            },
            /** Time */
            {
                data: {
                    _: 'Time',
                    display: 'Time',
                    sort: 'Time',
                    filter: 'Time'
                },
                type: 'date',
                render(data, type, row) {
                    return data ? new Date(data).toLocaleTimeString('default', {timeStyle: 'short'}) : ''
                }
            },
            {
                data: 'MarkedBy',
                type: 'string',
                render(data, type, row) {
                    return data;
                }
            }
        ],
        addCSS: getStatusColors(),
        data,
        rowId: 'Id',
        // order: [[4, 'asc']],
        /**
         * Sort by Status then Last Name 
         * {@link https://datatables.net/reference/api/order()}
         */
        order: [[ 8, 'asc' ], [ 4, 'asc' ]],
        buttons: [
            {
                text: /*html*/ `
                    <svg class='icon'>
                        <use href='#icon-user'></use>
                    </svg>
                    <span>Add team member</span>
                `,
                className: 'add-item',
                action: function (e, dt, node, config) {
                    /** Add team member */
                    let userForm;

                    const userModal = Component_Modal({
                        title: `New User`,
                        async addContent(modalBody) {
                            userForm = await ViewPart_NewUser({
                                parent: modalBody
                            });
        
                            userModal.showFooter();
                        },
                        buttons: {
                            footer: [
                                {
                                    value: 'Cancel',
                                    classes: 'btn-secondary',
                                    data: [
                                        {
                                            name: 'dismiss',
                                            value: 'modal'
                                        }
                                    ]
                                },
                                {
                                    value: 'Create',
                                    classes: 'btn-primary',
                                    // async onClick(event) {
                                    //     /** Disable button - Prevent user from clicking this item more than once */
                                    //     $(event.target).attr('disabled', '');

                                    //     /** Get field values from userForm View Part */
                                    //     const data = userForm.getFieldValues();

                                    //     /** Check required values */
                                    //     if (!data) {
                                    //         if (messageValid) {
                                    //             messageValid.remove();
                                    //         }

                                    //         messageValid = Component_Alert({
                                    //             type: 'danger',
                                    //             text: `Missing requried information. Please check that all fields are valid.`,
                                    //             close: true,
                                    //             parent: userModal.getModalBody(),
                                    //             position: 'beforeend'
                                    //         });

                                    //         messageValid.add();

                                    //         /** Enable button */
                                    //         $(event.target).removeAttr('disabled')

                                    //         return;
                                    //     }

                                    //     /** Create AllowSwitchGroups items */
                                    //     const Account = data.Account;

                                    //     /** Check if account already exists */
                                    //     if (Account)  {
                                    //         const userItem = await Action_Get({
                                    //             list: 'Users',
                                    //             select: 'Id,Account',
                                    //             filter: `Account eq '${Account}'`
                                    //         });
                            
                                    //         if (userItem[0]) {
                                    //             if (messageExists) {
                                    //                 messageExists.remove();
                                    //             }

                                    //             const link = `${location.href.split('#')[0]}#Users/${userItem[0].Id}`

                                    //             messageExists = Component_Alert({
                                    //                 type: 'danger',
                                    //                 text: /*html*/ `
                                    //                     An account for this user already exists. <a href='${link}' class='alert-link'>Click here to view it.</a>
                                    //                 `,
                                    //                 close: true,
                                    //                 parent: userModal.getModalBody(),
                                    //                 position: 'afterbegin'
                                    //             });

                                    //             messageExists.add();

                                    //             /** Enable button */
                                    //             $(event.target).removeAttr('disabled')

                                    //             return;
                                    //         }
                                    //     }

                                    //     /** Update button value */
                                    //     $(event.target).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating user');

                                    //     /** Create new user */
                                    //     const newItem = await Action_CreateItem({
                                    //         list: 'Users',
                                    //         data
                                    //     });

                                    //     /** Craete AllowedSwitchGroups items */
                                    //     const groups = userForm.getAllowedGroups();

                                    //     await Promise.all(groups.map(Group => {
                                    //         return Action_CreateItem({
                                    //             list: 'AllowedSwitchGroups',
                                    //             data: {
                                    //                 Account,
                                    //                 Group
                                    //             }
                                    //         });
                                    //     }));

                                    //     /** Add new user to table */
                                    //     usersTable.addRow({
                                    //         data: newItem
                                    //     });

                                    //     // Enable button;
                                    //     $(event.target)
                                    //         .removeAttr('disabled')
                                    //         .text('Complete!')
        
                                    //     /** Hide modal */
                                    //     userModal.getModal().modal('hide');
                                    // }
                                }
                            ]
                        },
                        parent
                    });
        
                    userModal.add();
                }
            },
            {
                text: 'All shifts',
                action: function (e, dt, node, config) {
                    rosterTable.search('');
                }
            },
            {
                text: 'Day',
                action: function (e, dt, node, config) {
                    rosterTable.search('Day', 10);

                    /** Update dashboard */
                    
                }
            },
            {
                text: 'Mid',
                action: function (e, dt, node, config) {
                    rosterTable.search('Mid', 10);
                }
            },
            {
                text: 'Night',
                action: function (e, dt, node, config) {
                    rosterTable.search('Night', 10);
                }
            },
            {
                extend: 'excelHtml5',
                className: 'ml-50',
                exportOptions: {
                    header: false,
                    footer: false,
                    columns: [3,4,5,6,7,8,9,10,11,12,13]
                }
            },
            {
                extend: 'csvHtml5',
                exportOptions: {
                    header: false,
                    footer: false,
                    columns: [3,4,5,6,7,8,9,10,11,12,13]
                }
            },
            {
                extend: 'pdfHtml5',
                exportOptions: {
                    columns: [3,4,5,6,7,8,9,10,11,12,13]
                }
            }
            // {
            //     extend: 'copyHtml5',
            //     exportOptions: {
            //         columns: [3,4,5,6,7,8,9,10,11]
            //     }
            // },
        ],
        onRowClick(param) {
            const {
                row,
                item
            } = param;

            /** Set row */
            selectedRow = row;

            /** Set user */
            selectedUser = item;

            const title = `${selectedUser.FirstName} ${selectedUser.LastName}`;

            /** Show User */
            const statusModal = Component_Modal({
                title,
                async addContent(modalBody) {
                    statusForm = await ViewPart_StatusForm({
                        modal: statusModal,
                        defaultShift: selectedUser.Shift,
                        defaultShiftEnd: selectedUser.ShiftEnd,
                        currentStatus: selectedUser.Status,
                        parent: modalBody
                    });

                    statusModal.showFooter();
                },
                buttons: {
                    footer: [
                        {
                            value: 'Cancel',
                            classes: 'btn-secondary',
                            data: [
                                {
                                    name: 'dismiss',
                                    value: 'modal'
                                }
                            ]
                        },
                        {
                            value: 'Set status',
                            disabled: true,
                            classes: 'btn-primary',
                            async onClick(event) {
                                /** Disable button - Prevent user from clicking this item more than once */
                                $(event.target)
                                    .attr('disabled', '')
                                    .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Setting status');

                                /** Get form data */
                                const formValues = statusForm.getFieldValues();

                                if (formValues) {
                                    formValues.user = selectedUser;

                                    const statusItem = await setStatus(formValues);

                                    updateRow({
                                        row: selectedRow,
                                        data: selectedUser,
                                        statusItem
                                    });
                                }

                                /** Enable button */
                                $(event.target)
                                    .removeAttr('disabled')
                                    .text('Complete!');

                                /** Hide modal */
                                statusModal.getModal().modal('hide');
                            }
                        }
                    ]
                },
                parent
            });

            statusModal.add();
        },
        onSelect(param) {
            const selected = rosterTable.selected();

            console.log('select', selected);
        },
        onDeselect(param) {
            const selected = rosterTable.selected();

            console.log('deselect', selected);
        },
        onDraw(param) {
            const {
                jqevent,
                table
            } = param;

            /* Set dashboard on table filter */
            const data = table.rows({ search: 'applied' }).data().toArray();

            dashboard.update(buildBannerData(data));
        },
        parent
    });

    rosterTable.add();

    function getStatusSortOrder(status) {
        return status ? statuses.find(item => item.Status === status).SortOrder : 0;
    }

    async function setStatus(param) {
        const {
            Status,
            ShiftStatus,
            ShiftEnd,
            Comment,
            user
        } = param;

        const {
            Account,
            Section,
            Shift
        } = user;

        const data = {
            Account,
            Section,
            Status,
            ShiftStatus: ShiftStatus || Shift,
            ShiftEnd: ShiftEnd || user.ShiftEnd,
            Comment: Comment || null,
            Date: new Date().toISOString(),
            MarkedBy: App.user.Account
        };

        console.log(data);

        const newItem = await Action_CreateItem({
            list: 'Accountability',
            data
        });

        return newItem;
    }

    function updateRow(param) {
        const {
            row,
            statusItem,
            data
        } = param;
        
        /** Decrement dashboard */
        decrementDashboard(data.Status);

        /** Increment dashboad */
        incrementDashboard(statusItem.Status);

        /** Update user properties */
        data.Status = statusItem.Status;
        data.StatusSortOrder = getStatusSortOrder(statusItem.Status);
        data.Shift = statusItem.ShiftStatus;
        data.Date = statusItem.Date;
        data.Time = statusItem.Date;
        data.Comment = statusItem.Comment;
        data.MarkedBy = roster.find(item => item.Account === statusItem.MarkedBy).FullName

        rosterTable.updateRow({
            row,
            data
        });
    }

    function incrementDashboard(label) {
        updateDashboardGroup(label, 1);
        incrementTotal();
    }

    function decrementDashboard(label) {
        updateDashboardGroup(label, -1);
    }

    function incrementTotal() {
        const count = dashboard.group('Team Members').data.value;
        const currentValue = parseInt(count.split('/')[0]);
        const newValue = currentValue + 1;
        const value = newValue > roster.length ? roster.length : newValue;

        console.log(`+ Team Members: ${currentValue}/${roster.length} -> ${value}/${roster.length} ${toPercent(value, roster.length)}%`);

        dashboard.update(
            [
                {
                    label: 'Team Members',
                    value: `${value}/${roster.length}`,
                    description: `${Math.ceil((value / roster.length) * 100)}%`
                }
            ]
        );
    }

    function updateDashboardGroup(label, num) {
        const currentValue = getDashboardValue(label);
        const newValue = currentValue + num;
        const value = newValue < 0 ? 0 : newValue;
        const percent = label === 'Not Accounted For' ? Math.floor((value / roster.length) * 100) : toPercent(value, roster.length);

        console.log(`${num === 1 ? '+' : '-'} ${label}: ${currentValue}/${roster.length} -> ${value}/${roster.length} ${percent}%`);

        dashboard.update(
            [
                {
                    label,
                    value,
                    description: `${percent}%`
                }
            ]
        );
    }

    function getDashboardValue(label) {
        return parseInt(dashboard.group(label).data.value);
    }

    /** Legend */

    const legendData = statuses.map(item => {
        const {
            Id,
            Status,
            Description,
            SortOrder
        } = item;

        return {
            Id,
            Status,
            Description,
            SortOrder
        }
    });

    const legendHeading = Component_Heading({
        text: 'Legend',
        margin: '50px 0px 5px 0px',
        parent
    });

    legendHeading.add();

    const legnedTable = Component_DataTable({
        addCSS: getStatusColors(),
        headers: [
            /* 0 */ 'Status',
            /* 1 */ 'Description',
            /* 2 */ 'Id',
            /* 3 */ 'SortOrder'
        ],
        striped: false,
        border: false,
        paging: false,
        search: false,
        info: false,
        columns: [
            {
                data: 'Status',
                type: 'string',
                render(data, type, row) {
                    return /*html*/ `
                        <span class='status' data-status='${data}'>${data}</span>
                    `;
                }
            },
            {
                data: 'Description',
                type: 'string',
                render(data, type, row) {
                    return data;
                }
            },
            {
                data: 'Id',
                visible: false,
            },
            {
                data: 'SortOrder',
                visible: false,
            }
        ],
        data: legendData,
        rowId: 'Id',
        order: [[ 3, 'asc' ]],
        parent
    });

    legnedTable.add();

    return rosterTable;
}
