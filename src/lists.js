import { AddFileTypes } from './Routes/Measures/AddFileTypes.js'

export default [
    {
        list: 'Measures',
        options: {
            files: true
        },
        fields: [
            {
                name: 'AOEmail',
                display: `AO's Email`,
                type: 'slot'
            },
            {
                name: 'AOName',
                display: 'Action Officer (AO)',
                type: 'slot'
            },
            {
                name: 'AOOffice',
                display: `AO's Office/Division`,
                type: 'slot'
            },
            {
                name: 'AltAOEmail',
                display: 'Alternate AO Email',
                type: 'slot'
            },
            {
                name: 'AltAOName',
                display: 'Alternate AO',
                type: 'slot'
            },
            {
                name: 'AltAOOffice',
                display: 'Alternate AO Office/Division',
                type: 'slot'
            },
            {
                name: 'AltDSEmail',
                display: `Alternate DS's Email`,
                type: 'slot'
            },
            {
                name: 'AltDSName',
                display: 'Alternate DS',
                type: 'slot'
            },
            {
                name: 'AltDSOffice',
                display: `Alternate DS's Office/Division`,
                type: 'slot'
            },
            {
                name: 'AnnualUpdateSchedule',
                display: 'Annual Update Schedule',
                description: `What's the current update schedule?`,
                type: 'choice',
                value: null,
                choices: [
                    'Calendar Year',
                    'Fiscal Year'
                ]
            },
            {
                name: 'ArchivedDataSources',
                display: 'Archived Data Sources',
                type: 'mlot'
            },
            {
                name: 'Baseline',
                display: 'Baseline',
                type: 'slot'
            },
            {
                name: 'BaselineValue',
                display: 'Baseline Value',
                type: 'slot'
            },
            {
                name: 'BenchmarkSource',
                display: 'Benchmark Source',
                type: 'slot'
            },
            {
                name: 'Benchmarks',
                display: 'Benchmarks',
                type: 'mlot'
            },
            {
                name: 'CareAvailability',
                display: 'Care Availability',
                type: 'choice',
                value: null,
                choices: [
                    'Direct Care Only',
                    'Purchased Care Only',
                    'Both Available',
                    'N/A'
                ]
            },
            {
                name: 'DSEmail',
                display: `DS's Email`,
                type: 'slot'
            },
            {
                name: 'DSName',
                display: 'Data Scientist (DS)',
                type: 'slot'
            },
            {
                name: 'DSOffice',
                display: `DS's Office/Division`,
                type: 'slot'
            },
            {
                name: 'DashboardLinks',
                display: 'Dashboard Links',
                type: 'mlot',
                render(data, type, row) {
                    const links = JSON.parse(data);

                    return links ? links.map(link => {
                        const { url, display } = link;

                        return /*html*/ `
                            <a href='${url}' target='_blank'>${display.trim()}</a>
                        `
                    }).join(`<span class='text-robi ml-1 mr-1' style='font-weight: 500;'>•</span>`) : '';
                }
            },
            {
                name: 'DataAggLevels',
                display: 'Data Aggregation Levels',
                description: 'Select all that apply',
                type: 'multichoice',
                fillIn: false,
                choices: [
                    'Child MTF',
                    'Clinic',
                    'Encounter',
                    'Market',
                    'MHS',
                    'Parent MTF',
                    'Patient',
                    'Provider',
                    'Service',
                    'Service (Product) Line'
                ]
            },
            {
                name: 'DataLagUnit',
                display: 'Data Lag Unit',
                description: 'Select data update interval.',
                type: 'choice',
                value: null,
                choices: [
                    'Day',
                    'Month',
                    'Quarter',
                    'Week',
                    'Year'
                ]
            },
            {
                name: 'DataLagValue',
                display: 'Data Lag Value',
                description: 'Select how many days, months, quarters, weeks, or years data may be in the rears.',
                type: 'number'
            },
            {
                name: 'DataLatency',
                display: 'Data Latency',
                type: 'mlot'
            },
            {
                name: 'DataSource',
                display: 'Data Source',
                description: `Select all data sources associated with this measure. You can add additional data sources in the next field. Data sources are used by the Measures and Reporting teams to validate the methodology used and build visualizations and dashboards. If you don't know the sources of data for this measure, select 'Unknown'.`,
                type: 'multichoice',
                fillIn: true,
                choices: [
                    'AHLTA Tri-service Workflow Form(s) (TSWF)',
                    'AHLTA Vitals',
                    'Composite Health Care System (CHCS / COHORT / CACHE)',
                    'Immunizations (various sources)',
                    'Johns Hopkins ACG (Adjusted Clinical Groupings)',
                    'M2/MDR CAPER',
                    'M2/MDR CAPER, M2/MDR Direct Inpatient, M2/MDR Purchased Care',
                    'M2/MDR DEERS',
                    'M2/MDR Designated Provider',
                    'M2/MDR Direct Inpatient',
                    'M2/MDR Lab',
                    'M2/MDR PDTS (includes ESSENCE)',
                    'M2/MDR Purchased Care',
                    'M2/MDR Radiology',
                    'M2/MDR Referrals',
                    'MHS GENESIS',
                    'Unknown'
                ]
            },
            {
                name: 'DataThroughDate',
                display: 'Data Through Date',
                type: 'date'
            },
            {
                name: 'Denominator',
                display: 'Denominator',
                description: 'Describe your measure numerator.',
                type: 'mlot'
            },
            {
                name: 'Description',
                display: 'Description',
                description: 'Enter a description or definition of the measure.',
                type: 'mlot'
            },
            {
                name: 'Exclusions',
                display: 'Exclusions',
                description: 'What specific data elements are intentionally excluded?',
                type: 'mlot'
            },
            {
                name: 'ExistingBenchmarks',
                display: 'Existing Benchmarks?',
                type: 'choice',
                value: null,
                choices: [
                    'Yes',
                    'No'
                ]
            },
            {
                name: 'ExistingTargets',
                diplay: 'Existing Targets?',
                type: 'choice',
                value: null,
                choices: [
                    'Yes',
                    'No'
                ]
            },
            {
                name: 'FileTypes',
                diplay: 'File Types',
                type: 'mlot'
            },
            {
                name: 'Frequency',
                display: 'Reporting Frequency',
                description: 'Select how often your measure is refreshed.',
                type: 'choice',
                value: null,
                choices: [
                    'Hoc',
                    'Annually',
                    'Daily',
                    'Monthly',
                    'Quarterly',
                    'Annually',
                    'Unknown',
                    'Weekly'
                ]
            },
            {
                name: 'GenesisIncluded',
                display: 'GENESIS Included?',
                description: 'Is your measure available for drill down to our Genesis sites?',
                type: 'choice',
                value: null,
                choices: [
                    'Yes',
                    'No'
                ]
            },
            {
                name: 'Inclusions',
                display: 'Inclusions',
                description: 'What specific data elements are included in your measure calculation?',
                type: 'mlot'
            },
            {
                name: 'IsAllDataMIP',
                display: 'Is all data MIP?',
                type: 'choice',
                value: null,
                choices: [
                    'Yes',
                    'No'
                ]
            },
            {
                name: 'IsAutomated',
                display: 'Automated?',
                description: 'Is this measure refreshed without human involvment?',
                type: 'choice',
                value: null,
                choices: [
                    'Yes',
                    'No'
                ]
            },
            {
                name: 'Limitations',
                display: 'Limitations',
                description: 'This context is important for the Measurement and Reporting staff to understand when building the measure display.  It is also critical for users to understand when considering the usefulness of your measure in supporting a DHA effort/project. Please remember that the measures library is intended to be a resource for staff trying to understand DHA performance. A measure you develop may serve multiple users over time.',
                type: 'mlot'
            },
            {
                name: 'MIPNameLoc',
                display: 'MIP Location',
                type: 'slot'
            },
            {
                name: 'MeasureAbr',
                display: 'Measure Abbreviation',
                description: 'Optional acronymn or short phrase.',
                type: 'slot'
            },
            {
                name: 'MeasureCategory',
                display: 'Measure Category',
                type: 'multichoice',
                fillIn: true,
                choices: [
                    'Campaign Plan',
                    'Clinical Community Measure',
                    'Health Affairs Dashboard Measure',
                    'Market Review and Analysis Dashboard',
                    'MHS Dashboard'
                ]
            },
            {
                name: 'MeasureId',
                display: 'Measure Number',
                type: 'number'
            },
            {
                name: 'MeasureName',
                display: 'Measure Name',
                description: 'Enter the complete measure name.',
                type: 'slot'
            },
            {
                name: 'MeasureSet',
                display: 'Measure Set',
                type: 'choice',
                value: null,
                choices: [
                    'AHRQ-IQI',
                    'AHRQ-PQI',
                    'AHRQ-PSI',
                    'HCAP',
                    'HEDIS',
                    'HRQOL',
                    'Leapfrog',
                    'NPIC',
                    'NSQIP',
                    'ORYX'
                ]
            },
            {
                name: 'MeasureStatus',
                display: 'Measure Status',
                type: 'choice',
                value: null,
                choices: [
                    'Archived',
                    'Published',
                    'Under Development'
                ]
            },
            {
                name: 'MeasureType',
                display: 'Measure Type',
                type: 'multichoice',
                fillIn: true,
                choices: [
                    'Access to Care',
                    'Behavioral Health',
                    'Chronic Disease',
                    'Dental',
                    'Finance',
                    'HIV',
                    'Outcomes',
                    'Patient Safety',
                    'Pharmacy',
                    'Quality',
                    'Readiness',
                    'Substance Abuse'
                ]
            },
            {
                name: 'NumberOfUploads',
                display: 'Number of Uploads',
                type: 'number'
            },
            {
                name: 'Numerator',
                display: 'Numerator',
                description: 'Describe your measure numerator.',
                type: 'mlot'
            },
            {
                name: 'OnHoldComments',
                display: 'On Hold Comments',
                type: 'mlot'
            },
            {
                name: 'OnHoldEnd',
                display: 'On Hold Estimated End Date',
                type: 'date',
                value: null
            },
            {
                name: 'OnHoldName',
                display: 'On Hold Name',
                type: 'mlot',
            },
            {
                name: 'OnHoldStart',
                display: 'On Hold Start Date',
                type: 'date',
                value: null
            },
            {
                name: 'PQACategory',
                display: 'Primary Quad Aim Category',
                description: 'Which Quad Aim category is supported by your measure?',
                type: 'choice',
                value: null,
                choices: [
                    'Better Care',
                    'Better Health',
                    'Lower Cost',
                    'Readiness'
                ]
            },
            {
                name: 'ProgLang',
                display: 'Programming Language',
                description: 'Select all that apply',
                type: 'multichoice',
                fillIn: true,
                value: null,
                choices: [
                    'ANSI SQL',
                    'Excel',
                    'Other',
                    'PostgreSQL',
                    'Python',
                    'QlikView',
                    'R',
                    'SAS',
                    'Tableau',
                    'T-SQL'
                ]
            },
            {
                name: 'Publisher',
                display: 'Publisher',
                type: 'mlot',
            },
            {
                name: 'Published',
                display: 'Published Date',
                type: 'date'
            },
            {
                name: 'Rationale',
                display: 'Rationale',
                description: `In a few sentences, describe how this measure will help DHA. Please specify which AD or DAD level Key Performance Indicator this measure supports, along with the governance body that monitors its performance. For assistance with this section, please contact your PMAT representative.`,
                type: 'mlot',
            },
            {
                name: 'RawDataLocation',
                display: 'Raw Data Location',
                type: 'multichoice',
                fillIn: true,
                value: null,
                choices: [
                    'Other',
                    'Red Shift',
                    'SQL Farm',
                    'Teradata'
                ]
            },
            {
                name: 'ReviewFocusArea',
                display: 'MHS Review focus area',
                description: `Which MHS review focus area (if any) is linked to your measure?`,
                type: 'choice',
                value: null,
                choices: [
                    'Access',
                    'Safety',
                    'Quality'
                ]
            },
            {
                name: 'RiskAdjusted',
                display: 'Risk Adjusted',
                description: 'Has this measure already been risk adjusted?.',
                type: 'choice',
                value: null,
                choices: [
                    'Yes',
                    'No'
                ]
            },
            {
                name: 'SQLNameLoc',
                display: 'SQL Location',
                type: 'slot'
            },
            {
                name: 'ScheduledRefreshDay',
                display: 'Scheduled Refresh Day',
                type: 'choice',
                value: null,
                choices: [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '17',
                    '18',
                    '19',
                    '20',
                    '21',
                    '22',
                    '23',
                    '24',
                    '25',
                    '26',
                    '27',
                    '28',
                    '29',
                    '30',
                    '31'
                ],
            },
            {
                name: 'Status',
                display: 'Status',
                type: 'choice',
                value: null,
                choices: [
                    'Current',
                    'Late',
                    'Missing Information',
                    'On Hold'
                ]
            },
            {
                name: 'Tags',
                display: 'Tags',
                // description: 'Tags make it easier to search for measures.',
                description: 'Adding tags will make it easier to find this measure in search results.',
                type: 'mlot'
            },
            {
                name: 'Target',
                display: 'Target',
                type: 'mlot'
            },
            {
                name: 'Title',
                display: 'Title',
                type: 'slot',
                required: false
            }
        ],
        sections: [
            {
                name: 'General Information',
                path: 'GeneralInfo',
                rows: [
                    {
                        fields: [
                            {
                                name: 'MeasureName',
                                label: 'Individual Measure Name',
                                style: {
                                    flex: 2
                                }
                            },
                            {
                                name: 'MeasureAbr'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'Rationale',
                                label: 'What is the rationale behind this measure?'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'IsAutomated',
                                label: 'Is this measure automated?'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'Description'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'Limitations',
                                label: 'What are the limitations of this measure?'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'Description'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'Tags',
                                label: 'Add tags'
                            }
                        ]
                    },
                    {
                        name: 'Measure Grouping',
                        fields: [
                            {
                                name: 'MeasureSet',
                                style: {
                                    flex: 2
                                }
                            },
                            {
                                name: 'MeasureType',
                                style: {
                                    flex: 2
                                }
                            },
                            {
                                name: 'MeasureCategory',
                                style: {
                                    flex: 2
                                }
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Ownership',
                path: 'Ownership',
                info: /*html*/ `
                    <div>
                        Please share your contact information. 
                        You can also designate an alternate Action Officer. 
                        Make sure to let 
                        <strong><a href='mailto:paula.m.evans3.civ@mail.mil?subject=Measures Library - Access Request'>Paula Evans</a></strong> 
                        or 
                        <strong><a href='mailto:karen.p.leahy2.civ@mail.mil?subject=Measures Library - Access Request'>Karen Leahy</a></strong> 
                        know to grant them Edit access to the measures library.
                    </div>
                `,
                rows: [
                    {
                        name: 'Action Officer (AO)',
                        fields: [
                            {
                                name: 'AOName',
                                label: 'Name'
                            },
                            {
                                name: 'AOEmail',
                                label: 'Email'
                            },
                            {
                                name: 'AOOffice',
                                label: 'Office/Division'
                            }
                        ]
                    },
                    {
                        name: 'Alternate AO',
                        fields: [
                            {
                                name: 'AltAOName',
                                label: 'Name'
                            },
                            {
                                name: 'AltAOEmail',
                                label: 'Email'
                            },
                            {
                                name: 'AltAOOffice',
                                label: 'Office/Division'
                            }
                        ]
                    },
                    {
                        name: 'Data Scientist (DS)',
                        fields: [
                            {
                                name: 'DSName',
                                label: 'Name'
                            },
                            {
                                name: 'DSEmail',
                                label: 'Email'
                            },
                            {
                                name: 'DSOffice',
                                label: 'Office/Division'
                            }
                        ]
                    },
                    {
                        name: 'Alternate DS',
                        fields: [
                            {
                                name: 'AltDSName',
                                label: 'Name'
                            },
                            {
                                name: 'AltDSEmail',
                                label: 'Email'
                            },
                            {
                                name: 'AltDSOffice',
                                label: 'Office/Division'
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Data Source',
                path: 'DataSource',
                rows: [
                    {
                        fields: [
                            {
                                name: 'DataSource',
                                label: 'Select all sources of data'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'IsAllDataMIP',
                                label: 'Are all data sources needed to calculate the measure located within the MIP and accessible from AVHE?'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'RawDataLocation',
                                label: 'What is the current location of finalized raw measure data/results?'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'ProgLang',
                                label: 'Which programming language is the measure coded in? (more than one selection allowed)'
                            }
                        ]
                    },
                    {
                        description: 'For DBA/BI Developers Only',
                        type: 'robi-primary-high-contrast',
                        fields: [
                            {
                                name: 'MIPNameLoc',
                                label: 'What is the name and location of the data table in MHS Information Portal (MIP)?'
                            },
                            {
                                name: 'SQLNameLoc',
                                label: 'What is the name and location of the table in the Measures Libray SQL database?'
                            }
                        ]
                    },
                ]
            },
            {
                name: 'Dashboard',
                path: 'Dashboard',
                rows: [
                    {
                        fields: [
                            {
                                name: 'DashboardLinks',
                                label: 'Add links to dashboards displaying this measure'
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Formulas',
                path: 'Formulas',
                rows: [
                    {
                        fields: [
                            {
                                name: 'Inclusions'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'Exclusions'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'Numerator'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'Denominator'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'RiskAdjusted'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'Files',
                                label: 'Methodology Documentation',
                                description: 'Upload methodology files needed for the Measurement and Reporting team and future Measures Library users to understand and replicate this measure. Please do not upload draft documents.'
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Timing',
                path: 'Timing',
                rows: [
                    {
                        fields: [
                            {
                                name: 'Frequency',
                            }
                        ]
                    },
                    {
                        name: 'Data Lag Time (Latency)',
                        description: 'For example, if data is two (2) months in the rears, select "month" in the previous field and enter "2" for Data Lag Value. Then recipeients would expect data uploaded in April to go through February.',
                        fields: [
                            {
                                name: 'DataLagUnit',
                                style: {
                                    flex: 'unset'
                                }
                            },
                            {
                                name: 'DataLagValue',
                                style: {
                                    flex: 2
                                }
                            }
                        ]
                    },
                    {
                        name: 'Data Delivery',
                        description: /*html*/ `
                            <div class='mt-3 mb-1 font-weight-bold'>MEASURE AUTOMATION</div>
                            <div class='mb-2'>Automating <strong><em>data ingestion</strong></em> in the MIP requires that all files imported are formatted and labelled (file name) according to a specific set of rules. In the fields below, please specify how data will be delivered.</div>
                            <div class='mb-1 font-weight-bold'>EXAMPLE</div>
                            <div class='mb-2'>Third Next Metric Monthly (TNMM) is currently broken out by service due to file sizes. There are four (4) files to submit, one for each service: Air Force, Army, Navy, and DHA. For this measure you would enter <strong>4</strong> in the field below.</div>
                        `,
                        fields: [
                            {
                                name: 'NumberOfUploads',
                                label: 'How many files will be uploaded during each reporting period?'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                component({ parent, formData, getComponent }) {
                                    return AddFileTypes({
                                        files: formData.FileTypes,
                                        onChange() {
                                            formData.FileTypes = JSON.stringify(getComponent().value());
                                        },
                                        parent
                                    });
                                }
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Performance Target & Goals',
                path: 'PerformanceSection',
                rows: [
                    {
                        // name: 'Annual Update Schedule',
                        fields: [
                            {
                                name: 'AnnualUpdateSchedule',
                                label: false
                            }
                        ]
                    },
                    {
                        name: 'Baseline Information',
                        fields: [
                            {
                                name: 'Baseline',
                                label: 'What is the baseline time period?'
                            },
                            {
                                name: 'BaselineValue',
                                label: 'And what is the value?'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'ExistingBenchmarks',
                                label: 'Does this measure have existing benchmarks?'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'Benchmarks',
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'ExistingTargets',
                                label: 'Does this measure have existing targets?'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'Target',
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Miscellaneous',
                path: 'Misc',
                rows: [
                    {
                        fields: [
                            {
                                name: 'GenesisIncluded',
                                label: 'Is a GENESIS site included?'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'CareAvailability',
                                label: 'Direct Care versus Purchased Care Availability'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'DataAggLevels'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'PQACategory'
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                name: 'ReviewFocusArea'
                            }
                        ]
                    }
                ]
            }
        ],
        views: [
            {
                name: 'Measures',
                fields: [
                    'MeasureId',
                    'MeasureName',
                    'AOName',
                    'Frequency',
                    'DashboardLinks',
                    'Author',
                    'Status',
                ]
            }
        ]
    },
    {
        list: 'MeasuresChecklist',
        fields: [
            {
                name: 'MeasureId',
                display: `MeasureId`,
                type: 'number',
            },
            {
                name: 'Step',
                display: 'Step',
                type: 'choice',
                value: null,
                choices: [
                    '1. Request submitted in the MHS Request Portal (OCR)',
                    '2. Measures Library Intake Form created (AO)',
                    '3. DHA AO conducts work group meetings (AO)',
                    '4. A&E Measures team reviews the intake form with AO and the work group (DS)',
                    '5. Feasibility study completed (DS)',
                    '6. Feasibility study accepted by AO (AO)',
                    '7. Methodology developed (DS)',
                    '8. Checklist items reviewed (DS)',
                    '8.a. Quality check on data (i.e., data accuracy and data reliability) (DS)',
                    '8.b. Methodology validation (DS)',
                    '8.c. Data source validation (DS)',
                    '8.d. FY improvement target established (DS)',
                    '9. Methodology and data accepted by AO (AO)',
                    '10. Data delivered to MOP (DS)',
                    '11. Data delivery completed (Information Delivery)',
                    '12. Data visualization completed (BI)',
                    '13. Measure forwarded to Governance (OCR)',
                    '13.a. Intake Form completed, including methodology and all required information (DS)',
                    '13.b. Target established (DS)',
                    '13.c. Measure ready to be queried through the Measures Library query tool (DS)',
                    '13.d. Measure results are available in a database and ready to be exported (DS)',
                    '13.e. Measure visualization is available (DS)',
                    '14. Measure approved by Governance (OCR)',
                    '15. Measure published in library (DS)'
                ]
            },
            {
                name: 'SubStep',
                display: 'Sub Step',
                type: 'choice',
                value: null,
                choices: [
                    '8.a. Quality check on data (i.e., data accuracy and data reliability) (DS)',
                    '8.b. Methodology validation (DS)',
                    '8.c. Data source validation (DS)',
                    '8.d. FY improvement target established (DS)',
                    '13.a. Intake Form completed, including methodology and all required information (DS)',
                    '13.b. Target established (DS)',
                    '13.c. Measure ready to be queried through the Measures Library query tool (DS)',
                    '13.d. Measure results are available in a database and ready to be exported (DS)',
                    '13.e. Measure visualization is available (DS)'
                ]
            },
            {
                name: 'Assigned',
                display: 'Assigned',
                type: 'slot'
            },
            {
                name: 'Start',
                display: 'Start',
                type: 'date'
            },
            {
                name: 'End',
                display: 'End',
                type: 'date'
            },
            {
                name: 'Notes',
                display: 'Notes',
                type: 'mlot'
            },
            {
                name: 'Status',
                display: 'Status',
                value: 'Not Started',
                type: 'choice',
                description: 'Marking an item <strong>Completed</strong> confirms that the person assigned to this step has completed all required actions. (This does not mean that the same step assigned to a different person is also completed.)',
                choices: [
                    'Not Started',
                    'In Progress',
                    'Completed'
                ]
            }
        ],
        views: [
            {
                name: 'Checklist',
                fields: [
                    'Step',
                    'Notes',
                    'Assigned',
                    'Start',
                    'End',
                    'Status',
                ]
            }
        ]
    },
    {
        list: 'DataFiles',
        template: 101,
        fields: [
            {
                name: 'MeasureId',
                type: 'number'
            },
            {
                name: 'ShortTitle',
                display: 'Short Title',
                type: 'slot'
            },
            // {
            //     name: 'MIPLink',
            //     type: 'slot'
            // },
            {
                name: 'DataThroughDate',
                display: 'Through Date',
                type: 'date'
            },
            {
                name: 'DataPulledDate',
                display: 'Pulled Date',
                type: 'date'
            }
        ],
        views: [
            {
                name: 'DataFiles',
                fields: [
                    'Name',
                    'DataThroughDate',
                    'DataPulledDate',
                    'Created',
                    'Author'
                ]
            },
            {
                name: 'Form',
                fields: [
                    'ShortTitle',
                    'Name',
                    'DataThroughDate',
                    'DataPulledDate',
                    'Created',
                    'Author'
                ]
            }
        ]
    }
]