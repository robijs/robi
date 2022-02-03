import { ActionsEditor } from './ActionsEditor.js'
import { Timer } from './Timer.js'
import { Get } from '../Actions/Get.js'
import { HTML } from '../Actions/HTML.js'
import { Store } from '../Core/Store.js'
import { Style } from '../Actions/Style.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export async function ActionsCards({ parent, path }) {
    // const measuresRes = await fetch('../../import.json');
    // const measures = await measuresRes.json();
    
    // console.log(measures);

    // const emailsRes = await fetch('../../emails.json');
    // const emails = await emailsRes.json();
    
    // console.log(emails);

    // const output = measures.map((measure, index) => {
    //     measure['Created By Email'] = emails[index]['Created By'];
    //     measure['Modified By Email'] = emails[index]['Modified By'];

    //     // https://stackoverflow.com/a/31102605
    //     const ordered = Object.keys(measure).sort().reduce(
    //         (obj, key) => {
    //           obj[
    //             key
    //             .replaceAll(`'`,'')
    //             .replaceAll(`-`,'')
    //             .replaceAll(`_`,'')
    //             .replaceAll(` `,'')
    //             .replaceAll(`/`,'')
    //             .replaceAll(`(`,'')
    //             .replaceAll(`)`,'')
    //             .replaceAll(`+`,'')
    //           ] = measure[key]; 
    //           return obj;
    //         }, 
    //         {}
    //     );

    //     return ordered;
    // });

    // console.log(output);

    const names = [
        // Override system fields
        {
            newName: 'Id',
            oldName: 'ID'
        },
        {
            newName: 'EditorId',
            oldName: 'ModifiedByEmail'
        },
        {
            newName: 'AuthorId',
            oldName: 'CreatedByEmail'
        },
        {
            newName: 'Modified',
            oldName: 'Modified'
        },
        {
            newName: 'Created',
            oldName: 'Created'
        },
        // Measures Fields
        {
            newName: 'AOEmail',
            oldName: 'AOsEmail'
        },
        {
            newName: 'AOName',
            oldName: 'ActionOfficer'
        },
        {
            newName: 'AOOffice',
            oldName: 'AOsOfficeDivision'
        },
        {
            newName: 'AltAOEmail',
            oldName: 'AltAOsEmail'
        },
        {
            newName: 'AltAOName',
            oldName: 'AlternateAO'
        },
        {
            newName: 'AltAOOffice',
            oldName: 'AltAOsOfficeDivision'
        },
        {
            newName: 'AltDSEmail',
            oldName: 'AltDSEmail'
        },
        {
            newName: 'AltDSName',
            oldName: 'AltDataScientist'
        },
        {
            newName: 'AltDSOffice',
            oldName: 'AltDSOfficeDivision'
        },
        {
            newName: 'AnnualUpdateSchedule',
            oldName: 'AnnualUpdateSchedule'
        },
        {
            newName: 'ArchivedDataSources',
            oldName: ''
        },
        {
            newName: 'Baseline',
            oldName: 'Baseline'
        },
        {
            newName: 'BaselineValue',
            oldName: 'BaselineValue'
        },
        {
            newName: 'Benchmarks',
            oldName: ''
        },
        {
            newName: 'BenchmarksExist',
            oldName: 'BenchmarksExist'
        },
        {
            newName: 'BenchmarkSources',
            oldName: 'BenchmarkSourceURL'
        },
        {
            newName: 'BenchmarkLocation',
            oldName: 'ExternalorInternal'
        },
        {
            newName: 'BenchmarkType',
            oldName: 'PublicorProprietary'
        },
        {
            newName: 'CareAvailability',
            oldName: ''
        },
        {
            newName: 'DSEmail',
            oldName: ''
        },
        {
            newName: 'DSName',
            oldName: ''
        },
        {
            newName: 'DSOffice',
            oldName: ''
        },
        {
            newName: 'DashboardLinks',
            oldName: ''
        },
        {
            newName: 'DataAggLevels',
            oldName: ''
        },
        {
            newName: 'DataLagUnit',
            oldName: ''
        },
        {
            newName: 'DataLagValue',
            oldName: ''
        },
        {
            newName: 'DataLatency',
            oldName: ''
        },
        {
            newName: 'DataSource',
            oldName: ''
        },
        {
            newName: 'DataThroughDate',
            oldName: ''
        },
        {
            newName: 'Denominator',
            oldName: ''
        },
        {
            newName: 'Description',
            oldName: ''
        },
        {
            newName: 'Exclusions',
            oldName: ''
        },
        {
            newName: 'ExistingTargets',
            oldName: ''
        },
        {
            newName: 'FileTypes',
            oldName: ''
        },
        // TODO: Map choices
        // Ex: Annual/Annually -> Yearly
        // Ex: Hoc/Ad Hoc -> Irregular
        {
            newName: 'Frequency',
            oldName: ''
        },
        {
            newName: 'GenesisIncluded',
            oldName: ''
        },
        {
            newName: 'Inclusions',
            oldName: ''
        },
        {
            newName: 'IsAllDataMIP',
            oldName: ''
        },
        {
            newName: 'IsAutomated',
            oldName: ''
        },
        {
            newName: 'Limitations',
            oldName: ''
        },
        {
            newName: 'MIPNameLoc',
            oldName: ''
        },
        {
            newName: 'MeasureAbr',
            oldName: ''
        },
        {
            newName: 'MeasureCategory',
            oldName: ''
        },
        {
            newName: 'MeasureId',
            oldName: ''
        },
        {
            newName: 'MeasureName',
            oldName: ''
        },
        {
            newName: 'MeasureSet',
            oldName: ''
        },
        {
            newName: 'MeasuresBranchRep',
            oldName: ''
        },
        {
            newName: 'MeasuresBranchRepEmail',
            oldName: ''
        },
        {
            newName: 'MeasureStatus',
            oldName: ''
        },
        {
            newName: 'MeasureType',
            oldName: ''
        },
        {
            newName: 'NumberOfUploads',
            oldName: ''
        },
        {
            newName: 'Numerator',
            oldName: ''
        },
        {
            newName: 'OnHoldComments',
            oldName: ''
        },
        {
            newName: 'OnHoldEnd',
            oldName: ''
        },
        {
            newName: 'OnHoldName',
            oldName: ''
        },
        {
            newName: 'OnHoldStart',
            oldName: ''
        },
        {
            newName: 'PQACategory',
            oldName: ''
        },
        {
            newName: 'ProgLang',
            oldName: ''
        },
        {
            newName: 'Publisher',
            oldName: ''
        },
        {
            newName: 'Published',
            oldName: ''
        },
        {
            newName: 'Rationale',
            oldName: ''
        },
        {
            newName: 'RawDataLocation',
            oldName: ''
        },
        {
            newName: 'ReviewFocusArea',
            oldName: ''
        },
        {
            newName: 'RiskAdjusted',
            oldName: ''
        },
        {
            newName: 'SQLNameLoc',
            oldName: ''
        },
        {
            newName: 'ScheduledRefreshDay',
            oldName: ''
        },
        {
            newName: 'Status',
            oldName: ''
        },
        {
            newName: 'Tags',
            oldName: ''
        },
        {
            newName: 'Target',
            oldName: ''
        },
        {
            newName: 'Title',
            oldName: ''
        }
    ];

    let run = false;

    const timer = Timer({
        parent,
        classes: ['mt-4', 'w-100'],
        start() {
            run = true;
            console.log(`Run: ${run}`);

            create();
        },
        stop() {
            run = false;
            console.log(`Run: ${run}`);
        },
        reset() {
            console.log('reset');
        }
    });
  
    timer.add();
  
    const items = []; // Get({ list: 'ListName' })

    async function create() {
        for (let item of items) {
            if (run) {



                if (i === items.length - 1) {
                    timer.stop();
                }
            } else {
                console.log('stoped');
  
                break;
            }
        }
    }

    return;

    // TODO: Make actions directably addressable ( how to make sure unique path betwen user and shared names/ids? )

    let userSettings = JSON.parse(Store.user().Settings);
    let myActions = userSettings.actions || [];
    const sharedActions = await Get({
        list: 'Actions'
    });

    Style({
        name: 'action-cards',
        style: /*css*/ `
            .actions-title {
                font-size: 20px;
                font-weight: 700;
                margin-bottom: 20px;
            }

            .action-card-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, 150px); /* passed in size or 22 plus (15 * 2 for padding) */
                justify-content: space-between;
                width: 100%;
            }

            .action-card {
                cursor: pointer;
                height: 150px;
                width: 150px;
                border-radius: 20px;
                background: var(--background);
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 16px;
                font-weight: 500;
            }

            .action-btn {
                margin-right: 12px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 32px;
                height: 32px;
                cursor: pointer;
            }

            .action-btn .icon {
                fill: var(--primary);
            }
        `
    });

    // My Actions
    parent.append(/*html*/ `
        <div class='actions-title'>My Actions</div>
        <div class='action-card-container'>
            ${
                HTML({
                    items: myActions,
                    each(item) {
                        const { Name, FileNames } = item;
                        
                        return /*html*/ `
                            <div class='action-card' data-files='${FileNames}'>${Name}</div>
                        `
                    }
                })
            }
        </div>
    `);

    parent.findAll('.action-card').forEach(card => {
        card.addEventListener('click', event => {
            parent.empty();

            ActionsEditor({ parent, files: event.target.dataset.files });
        });
    });
}
// @END-File
