/** Actions */
import Action_Get from '../Actions/Action_Get.js'

/* Components */
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_SingleLineTextField from '../Components/Component_SingleLineTextField.js'
import Component_DropDownField from '../Components/Component_DropDownField.js'
import Component_Card from '../Components/Component_Card.js';
import Component_Container from '../Components/Component_Container.js';

/**
 * ViewPart_EditUser
 * @description
 * @returns {Object} - @method {getFieldValues} call that return values for User
 */
export default async function ViewPart_RDSSummaryDisplayForm(param) {
    const {
        item,
        parent
    } = param;

    const fields = [
        {
            internalFieldName: 'Title',
            displayName: 'Subtotal'
        },
        {
            internalFieldName: 'MEPRSCode',
            displayName: 'MEPRS Code'
        },
        {
            internalFieldName: 'MEPRSDescription',
            displayName: 'MEPRS Description'
        },
        {
            internalFieldName: 'TotalAvailableNonAvailableFTEs',
            displayName: 'Total Available Non-available FTEs'
        },
        {
            internalFieldName: 'TotalLeaveFTEs',
            displayName: 'Total Leave FTEs'
        },
        {
            internalFieldName: 'TotalOtherFTEs',
            displayName: 'Total Other FTEs'
        },
        {
            internalFieldName: 'TotalSickFTEs',
            displayName: 'Total Sick FTEs'
        },
        {
            internalFieldName: 'TotalNonAvailableFTEs',
            displayName: 'Total NonAvailable FTEs'
        },
        {
            internalFieldName: 'TotalFAdjustedFTEs',
            displayName: 'Total F Adjusted FTEs'
        },
        {
            internalFieldName: 'AdjustedBaseline',
            displayName: 'Adjusted Baseline'
        },
        {
            internalFieldName: 'ServiceReadinessActivities',
            displayName: 'Service Readiness Activities'
        },
        {
            internalFieldName: 'DeployReadinessActivities',
            displayName: 'Deploy Readiness Activities'
        },
        {
            internalFieldName: 'DHAPredictedQuarterlyFTEs',
            displayName: 'DHA Predicted Quarterly FTEs'
        },
        {
            internalFieldName: 'PercentageDHAPredictedFTEs',
            displayName: 'Percentage DHA Predicted FTEs'
        }
    ];

    const lightBlueTitles = [
        `SUBTOTAL OF 'A' INPATIENT CARE`,
        `SUBTOTAL OF 'B' AMBULATORY CARE`,
        `SUBTOTAL OF 'C' DENTAL CARE`,
        `SUBTOTAL OF 'D' ANCILLARY SERVICES`,
        `SUBTOTAL OF 'E' SUPPORT SERVICES`,
        `SUBTOTAL OF 'F' SPECIAL PROGRAMS - HEALTHCARE`,
        `TOTAL FTES REQUIRED FOR READINESS DEMAND SIGNAL`,
        `TOTAL FTES REQUIRED FOR READINESS DEMAND SIGNAL:`
    ];

    const orangeTitles = [
        `SUBTOTAL OF 'F' SPECIAL PROGRAMS - ADJUSTED`,
    ];

    const blueTitles = [
        `SUBTOTAL - FTES FOR ADJUSTED BASELINE`,
    ];

    const greenTitles = [
        `SUBTOTAL SERVICE READINESS ACTIVITY (SRA) FTES`,
        `SUBTOTAL SERVICE READINESS ACTIVITY (SRA) FTES:`
    ];

    const greyTitles = [
        `SUBTOTAL DEPLOYMENT READINESS ACTIVITY (DRA) FTES`,
        `SUBTOTAL DEPLOYMENT READINESS ACTIVITY (DRA) FTES:`
    ];

    const container = Component_Container({
        direction: 'column',
        width: '100%',
        padding: '0px 20px 20px 20px',
        parent
    });

    container.add();

    const {
        Title
    } = item;

    const subtotal = Title.toUpperCase();

    if (lightBlueTitles.includes(subtotal)) {
        addLightBlueCard();
    }

    else if (orangeTitles.includes(subtotal)) {
        addOrangeCard();
    }

    else if (blueTitles.includes(subtotal)) {
        addBlueCard();
    }

    else if (greenTitles.includes(subtotal)) {
        addGreenCard();
    }

    else if (greyTitles.includes(subtotal)) {
        addGreyCard();
    }

    /** Light Blue */
    function addLightBlueCard() {
        /** Light Blue */
        const lightBlueCard = Component_Card({
            background: 'rgb(189,215,238)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: container
        });

        lightBlueCard.add();

        fields.slice(0, 8).forEach(field => addField(field, lightBlueCard));

        /** Orange */
        const orangeCard = Component_Card({
            background: 'rgb(252,228,214)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: container
        });

        orangeCard.add();

        addField(fields[8], orangeCard);

        /** Blue */
        const blueCard = Component_Card({
            background: 'rgb(000,176,240)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: container
        });

        blueCard.add();

        addField(fields[9], blueCard);

        /** Green */
        const greenCard = Component_Card({
            background: 'rgb(226,239,218)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: container
        });

        greenCard.add();

        addField(fields[10], greenCard);

        /** Grey */
        const greyCard = Component_Card({
            background: 'rgb(217,217,217)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: container
        });

        greyCard.add();

        addField(fields[11], greyCard);

        /** Light Blue (2) */
        const lightBlueCard_2 = Component_Card({
            background: 'rgb(189,215,238)',
            width: '100%',
            parent: container
        });

        lightBlueCard_2.add();

        fields.slice(12).forEach(field => addField(field, lightBlueCard_2));
    }

    /** Orange */
    function addOrangeCard() {
        /** Orange */
        const orangeCard = Component_Card({
            background: 'rgb(252,228,214)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: container
        });

        orangeCard.add();

        fields.slice(0, 9).forEach(field => addField(field, orangeCard));

        /** Blue */
        const blueCard = Component_Card({
            background: 'rgb(000,176,240)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: container
        });

        blueCard.add();

        addField(fields[9], blueCard);

        /** Green */
        const greenCard = Component_Card({
            background: 'rgb(226,239,218)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: container
        });

        greenCard.add();

        addField(fields[10], greenCard);

        /** Grey */
        const greyCard = Component_Card({
            background: 'rgb(217,217,217)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: container
        });

        greyCard.add();

        addField(fields[11], greyCard);

        /** Light Blue (2) */
        const lightBlueCard_2 = Component_Card({
            background: 'rgb(189,215,238)',
            width: '100%',
            parent: container
        });

        lightBlueCard_2.add();

        fields.slice(12).forEach(field => addField(field, lightBlueCard_2));
    }

    /** Blue */
    function addBlueCard() {
        /** Blue */
        const blueCard = Component_Card({
            background: 'rgb(000,176,240)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: container
        });

        blueCard.add();

        fields.slice(0, 10).forEach(field => addField(field, blueCard));

        /** Green */
        const greenCard = Component_Card({
            background: 'rgb(226,239,218)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: container
        });

        greenCard.add();

        addField(fields[10], greenCard);

        /** Grey */
        const greyCard = Component_Card({
            background: 'rgb(217,217,217)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: container
        });

        greyCard.add();

        addField(fields[11], greyCard);

        /** Light Blue (2) */
        const lightBlueCard_2 = Component_Card({
            background: 'rgb(189,215,238)',
            width: '100%',
            parent: container
        });

        lightBlueCard_2.add();

        fields.slice(12).forEach(field => addField(field, lightBlueCard_2));
    }

    /** Green */
    function addGreenCard() {
        /** Green */
        const greenCard = Component_Card({
            background: 'rgb(226,239,218)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: container
        });

        greenCard.add();

        fields.slice(0, 11).forEach(field => addField(field, greenCard));

        /** Grey */
        const greyCard = Component_Card({
            background: 'rgb(217,217,217)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: container
        });

        greyCard.add();

        addField(fields[11], greyCard);

        /** Light Blue (2) */
        const lightBlueCard_2 = Component_Card({
            background: 'rgb(189,215,238)',
            width: '100%',
            parent: container
        });

        lightBlueCard_2.add();

        fields.slice(12).forEach(field => addField(field, lightBlueCard_2));
    }

    /** Grey */
    function addGreyCard() {
        /** Grey */
        const greyCard = Component_Card({
            background: 'rgb(217,217,217)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: container
        });

        greyCard.add();

        fields.slice(0, 12).forEach(field => addField(field, greyCard));

        /** Light Blue (2) */
        const lightBlueCard_2 = Component_Card({
            background: 'rgb(189,215,238)',
            width: '100%',
            parent: container
        });

        lightBlueCard_2.add();

        fields.slice(12).forEach(field => addField(field, lightBlueCard_2));
    }

    /** Add Field */
    function addField(field, parent) {
        const {
            internalFieldName,
            displayName
        } = field;
        
        const value = internalFieldName.includes('Percent') ? `${Math.round(parseFloat(item[internalFieldName]) * 100)}%` : item[internalFieldName]?.toString();

        const component = Component_SingleLineTextField({
            label: displayName,
            value: value || /*html*/ `<span style='font-size: 1em; display: inline' class='badge badge-dark'>No data to display</span>`,
            readOnly: true,
            parent
        });

        component.add();
    }

    return {
        getFieldValues() {
            const data = {};

            return data;
        }
    };
}
