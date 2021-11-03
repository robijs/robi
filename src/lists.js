export default [
    {
        list: 'TestFieldTypes',
        fields: [
            {
                name: 'SLOT',
                type: 'slot'
            },
            {
                name: 'MLOT',
                type: 'mlot'
            },
            {
                name: 'Number',
                type: 'number'
            },
            {
                name: 'choiceColumn',
                type: 'choice',
                choices: [
                    'One',
                    'Two',
                    'Three'
                ]
            }
        ]
    },
    {
        list: 'Measures',
        fields: [
            {
                name: 'Title',
                type: 'slot'
            },
            {
                name: 'MeasureId',
                type: 'number'
            },
            {
                name: 'MeasureStatus',
                type: 'choice',
                choices: [
                    'Under Development',
                    'Archived',
                    'Published'
                ]
            },
            {
                name: 'AOName',
                type: 'slot'
            },
            {
                name: 'AOEmail',
                type: 'slot'
            },
            {
                name: 'AOOffice',
                type: 'slot'
            },
            {
                name: 'AltAOName',
                type: 'slot'
            },
            {
                name: 'AltAOEmail',
                type: 'slot'
            },
            {
                name: 'AltAOOffice',
                type: 'slot'
            },
            {
                name: 'DSname',
                type: 'slot'
            },
            {
                name: 'DSEmail',
                type: 'slot'
            },
            {
                name: 'DSOffice',
                type: 'slot'
            },
            {
                name: 'MeasureName',
                type: 'slot'
            },
            {
                name: 'MeasureAbr',
                type: 'slot'
            },
            {
                name: 'MeasureReason',
                type: 'mlot'
            },
            {
                name: 'IsAutomated',
                type: 'choice',
                choices: [
                    'Yes',
                    'No'
                ]
            },
            {
                name: 'MeasureLimits',
                type: 'mlot'
            },
            {
                name: 'Description',
                type: 'mlot'
            },
            {
                name: 'Tags',
                type: 'mlot'
            },
            {
                name: 'MeasureSet',
                type: 'choice',
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
                name: 'MeasureType',
                type: 'choice',
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
                name: 'MeasureCategory',
                type: 'choice',
                choices: [
                    'Campaign Plan',
                    'Clinical Community Measure',
                    'Health Affairs Dashboard Measure',
                    'Market Review and Analysis Dashboard',
                    'MHS Dashboard'
                ]
            },
            {
                name: 'OtherDataSource',
                type: 'mlot'
            },
            {
                name: 'ArchivedDataSources',
                type: 'mlot'
            },
            {
                name: 'IsAllDataMIP',
                type: 'choice'
            },
            {
                name: 'RawDataLocation',
                type: 'choice'
            },
            {
                name: 'ProgLang',
                type: 'choice'
            },
            {
                name: 'OtherProgLang',
                type: 'slot'
            },
            {
                name: 'MIPNameLoc',
                type: 'slot'
            },
            {
                name: 'SQLNameLoc',
                type: 'slot'
            },
            {
                name: 'DashboardLinks',
                type: 'mlot'
            },
            {
                name: 'Inclusions',
                type: 'mlot'
            },
            {
                name: 'Exclusions',
                type: 'mlot'
            },
            {
                name: 'Numerator',
                type: 'mlot'
            },
            {
                name: 'Denominator',
                type: 'mlot'
            },
            {
                name: 'RiskAdjusted',
                type: 'choice'
            },
            {
                name: 'Frequency',
                type: 'choice'
            },
            {
                name: 'DataLagUnit',
                type: 'choice'
            },
            {
                name: 'DataLagValue',
                type: 'number'
            },
            {
                name: 'NumberOfUploads',
                type: 'number'
            },
            {
                name: 'AnnualUpdateSchedule',
                type: 'choice'
            },
            {
                name: 'Baseline',
                type: 'slot'
            },
            {
                name: 'BaslineValue',
                type: 'slot'
            },
            {
                name: 'ExistingBenchmarks',
                type: 'choice'
            },
            {
                name: 'ExistingTargets',
                type: 'choice'
            },
            {
                name: 'Target',
                type: 'mlot'
            },
            {
                name: 'Benchmarks',
                type: 'mlot'
            },
            {
                name: 'GenesisIncluded',
                type: 'choice'
            },
            {
                name: 'CareAvailability',
                type: 'choice'
            },
            {
                name: 'DataAggLevels',
                type: 'choice'
            },
            {
                name: 'PQACategory',
                type: 'Choic'
            }
        ]
    }
]