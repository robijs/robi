import { CreateItem, Get } from '../../Robi/Robi.js'
import { BootstrapDropdown, DateField, MultiLineTextField, NumberField, SingleLineTextField, LookupField } from '../../Robi/RobiUI.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export async function NewForm(param) {
    console.log('custom new form');

    const { event, fields, list, modal, parent, table } = param;

    // Components
    const components = [];

    // Lookup Field
    const demisID = LookupField({
        label: 'DMIS Lookup',
        description: "Search any market, facility name, or DMIS ID",
        parent,
        onSelect({ event, item }) {
            console.log(event, item);
        },
        // onFocusout(event) {
        //     console.log('demisID on focus out');
        //     console.log(event);
        // }
    });

    demisID.add();
    components.push(demisID);

    // OLD
    async function onKeyup_old(event) {
        // Drop down Menu
        const query = event.target.value.toUpperCase();
        const menu = demisID.find('.dropdown-menu');

        console.log(query);

        if (query) {
            if (!menu) {
                console.log('add menu');

                const height = demisID.get().offsetHeight;
                const width = demisID.get().offsetWidth;

                demisID.find('.form-control').insertAdjacentHTML('afterend', /*html*/ `
                    <div class='dropdown-menu show' style='font-size: 13px; position: absolute; width: ${width}px; inset: 0px auto auto 0px; margin: 0px; transform: translate(0px, ${height + 5}px); max-height: 200px; overflow: overlay;'>
                        <div class='d-flex justify-content-between align-items-center mt-2 mb-2 ml-3 mr-3 items-container'>
                            <div style='color: var(--primary);'>Searching facilities...</div>
                            <div class='spinner-grow spinner-grow-sm' style='color: var(--primary);' role='status'></div>
                        </div> 
                    </div>
                `);
            } else {
                console.log('menu already added');
            }

            // Add lookup list items
            const listItems = await Get({
                path: 'https://carepoint.health.mil/sites/J5',
                list: 'DMISDemo',
                filter: `substringof('${query}', dmis_facility_name_label)`
            });

            console.log(listItems);

            const dropdownItems = listItems.map(item => {
                const { Title, dmis_facility_name } = item;

                return /*html*/ `
                    <div class='dropdown-item'>${Title} - ${dmis_facility_name}</div>
                `
            }).join('\n');

            parent.querySelector('.dropdown-menu').innerHTML = dropdownItems;
        } else {
            if (menu) {
                console.log('remove menu');
                menu.remove();
            } else {
                console.log('menu already removed');
            }
        }
    }

    // END TESTING

    const submitterName = SingleLineTextField({
        label: 'Name',
        parent
    });

    submitterName.add();

    const emailAddress = SingleLineTextField({
        label: 'E-Mail Address',
        parent
    });

    emailAddress.add();

    const numActivations = SingleLineTextField({
        label: '# of Code Purple Activations',
        parent
    });

    numActivations.add();

    const numDeliveries = SingleLineTextField({
        label: '# of Live Births/Deliveries',
        parent
    });

    numDeliveries.add();

    const reportDate = DateField({
        label: 'Report Date',
        parent
    });

    reportDate.add();

    // // MTF Field
    // const facilityName = SingleLineTextField({
    //     label: 'Facility Name',
    //     parent
    // });

    // facilityName.add();
    // components.push(facilityName);



    function createFields() {
        const fieldsToCreate = fields?.filter(field => field.name !== 'Id');
        const components = fieldsToCreate?.map((field, index) => {
            const { name, display, type, choices, action } = field;

            let component = {};

            switch (type) {
                case 'slot':
                    component = SingleLineTextField({
                        label: display || name,
                        parent
                    });
                    break;
                case 'mlot':
                    component = MultiLineTextField({
                        label: display || name,
                        parent
                    });
                    break;
                case 'number':
                    component = NumberField({
                        label: display || name,
                        parent
                    });
                    break;
                case 'choice':
                    component = BootstrapDropdown({
                        label: display || name,
                        value: choices[0],
                        options: choices.map(choice => {
                            return {
                                label: choice
                            };
                        }),
                        parent
                    });
                    break;
                case 'date':
                    component = DateField({
                        label: display || name,
                        value: '',
                        parent
                    });
                    break;
            }

            component.add();

            return {
                component,
                field
            };
        });
    }

    return {
        async onCreate(event) {
            const { Title, dmis_facility_name, parent_dmis, parent_dmis_name, market_name, reporting_market_name } = demisID.value();

            const data = {
                DMISID: Title,
                FacilityName: dmis_facility_name,
                ParentDMIS: parent_dmis,
                ParentName: parent_dmis_name,
                MarketName: market_name,
                ReportingMarketName: reporting_market_name
            };

            console.log(data);

            const newItem = await CreateItem({
                list,
                data
            });

            return newItem;
        }
    };
}
// @END-File