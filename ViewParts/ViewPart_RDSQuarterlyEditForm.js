/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_AddStyle from '../Actions/Action_AddStyle.js'

/* Components */
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_SingleLineTextField from '../Components/Component_SingleLineTextField.js'
import Component_Container from '../Components/Component_Container.js'
import Component_Card from '../Components/Component_Card.js'
import Component_NumberField from '../Components/Component_NumberField.js'
import Component_PercentField from '../Components/Component_PercentField.js'
import Component_MultiLineTextField from '../Components/Component_MultiLineTextField.js'

function MakeDraggable(Element){

    Element.setAttribute('style', 'cursor: move !important;')

    $(Element).on('mousedown', function(mousedownEvt){
        var $draggable = $(this)
        var x = mousedownEvt.pageX - $draggable.offset().left,
            y = mousedownEvt.pageY - $draggable.offset().top;
        $('body').on('mousemove.draggable', function(mousemoveEvt){
            $draggable.closest('.modal-dialog').offset({
                'left': mousemoveEvt.pageX - x,
                'top': mousemoveEvt.pageY - y
            });
        });
        $('body').on('mouseup', function(){
            $('body').off('mousemove.draggable');
        })
        $draggable.closest('.modal').on('bs.modal.hide', function(){
            $('body').off('mousemove.draggable')
        });
    });
}

/**
 * ViewPart_EditUser
 * @description
 * @returns {Object} - @method {getFieldValues} call that return values for User
 */
export default function ViewPart_RDSQuarterlyEditForm(param) {
    const {
        item,
        parent
    } = param;

    /** Will allow the user to drag modal; */
    MakeDraggable(parent.parentNode.querySelector('div.modal-header'))

    const readOnlyFields = [
        {
            internalFieldName: 'Title',
            displayName: 'Quarter'
        },
        {
            internalFieldName: 'Subtotal',
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
            internalFieldName: 'DHAPredictedQuarterlyFTEs',
            displayName: 'DHA Predicted Quarterly FTEs'
        },
        {
            internalFieldName: 'PercentageDHAPredictedFTEs',
            displayName: 'Percentage DHA Predicted FTEs'
        }
    ];

    const lightPurpleTitles = [
        `SUBTOTAL OF 'A' INPATIENT CARE`,
        `SUBTOTAL OF 'B' AMBULATORY CARE`,
        `SUBTOTAL OF 'C' DENTAL CARE`,
        `SUBTOTAL OF 'D' ANCILLARY SERVICES`,
        `SUBTOTAL OF 'E' SUPPORT SERVICES`,
        `SUBTOTAL OF 'F' SPECIAL PROGRAMS - HEALTHCARE`,
    ];

    const orangeTitles = [
        `SUBTOTAL OF 'F' SPECIAL PROGRAMS - ADJUSTED`,
    ];

    const blueTitles = [
        `SUBTOTAL - FTES FOR ADJUSTED BASELINE`,
    ];

    const greenTitles = [
        `SUBTOTAL SERVICE READINESS ACTIVITY (SRA) FTES`,
        `SUBTOTAL SERVICE READINESS ACTIVITY (SRA) FTES:`,
    ];

    const greyTitles = [
        `SUBTOTAL DEPLOYMENT READINESS ACTIVITY (DRA) FTES`,
        `SUBTOTAL DEPLOYMENT READINESS ACTIVITY (DRA) FTES:`,
    ];

    const lightBlueTitles = [
        `TOTAL FTES REQUIRED FOR READINESS DEMAND SIGNAL`,
        `TOTAL FTES REQUIRED FOR READINESS DEMAND SIGNAL:`
    ];

    const readOnlyContainer = Component_Container({
        // direction: 'column',
        direction: 'row',
        width: '100%',
        padding: '0px 20px 20px 20px',
        parent
    });

    readOnlyContainer.add();

    const {
        Subtotal,
        DHAPredictedQuarterlyFTEs,
        MTFPredictedFTEs,
        MTFPredictedPercentage,
        MTFExplanation
    } = item;

    const subtotal = Subtotal.toUpperCase();

    if (lightPurpleTitles.includes(subtotal)) {
        addLightPurpleCard();
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

    else if (lightBlueTitles.includes(subtotal)) {
        addLightBlueCard();
    }

    /** Number Fields Container */
    const numberContainer = Component_Container({
        width: '100%',
        padding: '0px 20px 20px 20px',
        justify: 'space-between',
        parent
    });

    numberContainer.add();
    // $(numberContainer.get()).hide()

    /** FTEs */
    const mtfPredictedFtesField = Component_NumberField( {
        label: 'MTF Predicted FTEs',
        value: MTFPredictedFTEs,
        // margin: '0px 20px 0px 0px',
        parent: numberContainer,
        onKeyup(event) {
            const value = parseFloat(event.target.value);
            const percent = value / DHAPredictedQuarterlyFTEs;

            mtfPredictedPercentageField.value(percent);

            const delta = (DHAPredictedQuarterlyFTEs - value).toString();

            if (delta === 0 ) {
                mtfDeltaField.value(delta);
            } else if (delta > 0) {
                mtfDeltaField.value(`- ${Math.abs(delta)}`);
            } else if (delta < 0) {
                mtfDeltaField.value(`+ ${Math.abs(delta)}`);
            }
        }
    });

    mtfPredictedFtesField.add();
    // $(mtfPredictedFtesField.get()).hide()

    // TODO: Add difference (delta) between predicted an actual in addtion to already present %
    console.log(DHAPredictedQuarterlyFTEs, MTFPredictedFTEs);

    const mtfDeltaField = Component_SingleLineTextField({
        label: 'MTF Predicted Delta',
        value: (DHAPredictedQuarterlyFTEs - MTFPredictedFTEs).toString(),
        readOnly: true,
        fontSize: '1em',
        // fieldMargin: '0px 20px 0px 0px',
        parent: numberContainer
    });

    mtfDeltaField.add();

    /** Percent */
    const mtfPredictedPercentageField = Component_PercentField( {
        label: 'MTF Predicted Percentage',
        value: MTFPredictedPercentage,
        // margin: '0px 20px 0px 0px',
        readOnly: true,
        parent: numberContainer
    });

    mtfPredictedPercentageField.add();

    /** Text Fields Container */
    const textContainer = Component_Container({
        direction: 'column',
        width: '100%',
        padding: '0px 20px 20px 20px',
        parent
    });

    textContainer.add();

    /** Add Text Fields */
    const mtfExplanationField = Component_MultiLineTextField({
        label: 'MTF Explanation',
        value: MTFExplanation,
        margin: '0px 20px 0px 0px',
        parent: textContainer
    });

    mtfExplanationField.add();

    /** Light Blue */
    function addLightPurpleCard() {
        // readOnlyContainer.get().classList.add('row')
        /** Light Purple */
        const lightPurpleCard = Component_Card({
            background: 'rgb(217,225,242)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: readOnlyContainer
        });

        lightPurpleCard.add();
        // lightPurpleCard.get().classList.add('col-6')

        readOnlyFields.slice(0, 4).forEach(field => addReadOnlyField(field, lightPurpleCard));

        /** Light Blue */
        const lightBlueCard = Component_Card({
            background: 'rgb(189,215,238)',
            width: '100%',
            parent: readOnlyContainer
        });

        lightBlueCard.add();
        // lightBlueCard.get().classList.add('col-6')

        readOnlyFields.slice(4, 6).forEach(field => addReadOnlyField(field, lightBlueCard));
    }

    /** Orange */
    function addOrangeCard() {
        /** Orange */
        const orangeCard = Component_Card({
            background: 'rgb(252,228,214)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: readOnlyContainer
        });

        orangeCard.add();

        readOnlyFields.slice(0, 4).forEach(field => addReadOnlyField(field, orangeCard));

        /** Light Blue  */
        const lightBlueCard = Component_Card({
            background: 'rgb(189,215,238)',
            width: '100%',
            parent: readOnlyContainer
        });

        lightBlueCard.add();

        readOnlyFields.slice(4, 6).forEach(field => addReadOnlyField(field, lightBlueCard));
    }

    /** Blue */
    function addBlueCard() {
        /** Blue */
        const blueCard = Component_Card({
            background: 'rgb(000,176,240)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: readOnlyContainer
        });

        blueCard.add();

        readOnlyFields.slice(0, 4).forEach(field => addReadOnlyField(field, blueCard));

        /** Light Blue */
        const lightBlueCard = Component_Card({
            background: 'rgb(189,215,238)',
            width: '100%',
            parent: readOnlyContainer
        });

        lightBlueCard.add();

        readOnlyFields.slice(4, 6).forEach(field => addReadOnlyField(field, lightBlueCard));
    }

    /** Green */
    function addGreenCard() {
        /** Green */
        const greenCard = Component_Card({
            background: 'rgb(226,239,218)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: readOnlyContainer
        });

        greenCard.add();

        readOnlyFields.slice(0, 4).forEach(field => addReadOnlyField(field, greenCard));

        /** Light Blue */
        const lightBlueCard = Component_Card({
            background: 'rgb(189,215,238)',
            width: '100%',
            parent: readOnlyContainer
        });

        lightBlueCard.add();

        readOnlyFields.slice(4, 6).forEach(field => addReadOnlyField(field, lightBlueCard));
    }

    /** Grey */
    function addGreyCard() {
        /** Grey */
        const greyCard = Component_Card({
            background: 'rgb(217,217,217)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: readOnlyContainer
        });

        greyCard.add();

        readOnlyFields.slice(0, 4).forEach(field => addReadOnlyField(field, greyCard));

        /** Light Blue */
        const lightBlueCard = Component_Card({
            background: 'rgb(189,215,238)',
            width: '100%',
            parent: readOnlyContainer
        });

        lightBlueCard.add();

        readOnlyFields.slice(4, 6).forEach(field => addReadOnlyField(field, lightBlueCard));
    }
    
    /** Light Blue */
    function addLightBlueCard() {
        /** Light Blue */
        const lightBlueCard = Component_Card({
            background: 'rgb(189,215,238)',
            width: '100%',
            margin: '0px 0px 30px 0px',
            parent: readOnlyContainer
        });

        lightBlueCard.add();

        readOnlyFields.slice(0, 6).forEach(field => addReadOnlyField(field, lightBlueCard));
    }

    /** Add Read Only Field */
    function addReadOnlyField(field, parent) {
        const {
            internalFieldName,
            displayName
        } = field;

        const turnOff = [
            'Title',
            'Subtotal'
        ];

        if (turnOff.includes(internalFieldName)) {
            return;
        }
        
        const value = internalFieldName.includes('Percent') ? `${Math.round(parseFloat(item[internalFieldName]) * 100)}%` : item[internalFieldName]?.toString();

        const component = Component_SingleLineTextField({
            label: displayName,
            value: value || /*html*/ `<span style='font-size: 1em; display: inline' class='badge badge-dark'>No data</span>`,
            readOnly: true,
            fieldMargin: '0px',
            parent
        });

        component.add();
    }

    /** Add right padding to first card */
    Action_AddStyle({
        name: 'rds-edit-form-card-right-padding',
        style: /*css*/ `
            #${readOnlyContainer.get().id} .round-card:first-child {
                margin-right: calc(1rem + 20px);
                margin-bottom: 5px;
            }
        `
    });

    return {
        getFieldValues() {
            const data = {
                MTFPredictedFTEs: mtfPredictedFtesField.value(),
                MTFPredictedPercentage: mtfPredictedPercentageField.value(),
                MTFExplanation: mtfExplanationField.value(undefined, {plainText: true})
            };

            return data;
        }
    };
}
