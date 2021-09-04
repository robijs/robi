/** RHC-C SharePoint Team */

/** Actions */
import Action_Get from '../Actions/Action_Get.js'

/* Components */
import Component_DropDownField from '../Components/Component_DropDownField.js'
import Component_Alert from '../Components/Component_Alert.js'
import Component_Link from '../Components/Component_Link.js'
import Component_Container from '../Components/Component_Container.js'
import Component_MultiLineTextField from '../Components/Component_MultiLineTextField.js'

/**
 * @param {Object} param
 * @param {(Object|String)} param.parent
 * 
 * @returns {Object} - @method {getFieldValues} call that return values for User
 */
export default async function ViewPart_StatusForm(param) {
    const {
        parent,
        defaultShift,
        defaultShiftEnd,
        currentStatus,
        modal
    } = param;
    
    /** Statuses */
    const statuses = await Action_Get({
        list: 'Statuses'
    });

    /** Status */
    let comment;

    const statusField = Component_DropDownField({
        list: 'Statuses',
        label: 'Status',
        value: currentStatus,
        dropDownOptions: statuses.map(item => {
            const {
                Id,
                Status
            } = item;
            return {
                id: Id,
                value: Status 
            };
        }),
        width: '200px',
        fieldMargin: '0px 0px 20px 0px',
        parent,
        onEmpty() {
            modal.getButton('Set status').disabled = true;
        },
        onError(value) {
            modal.getButton('Set status').disabled = true;
        },
        onSetValue(data) {
            const {
                newValue
            } = data;

            if (newValue && newValue.Status && statuses.map(item => item.Status).includes(newValue.Status)) {
                if (newValue.Status === 'Other' && !comment) {
                    /** Add comment field */
                    comment = Component_MultiLineTextField({
                        label: 'Comment',
                        minHeight: '100px',
                        parent: statusField,
                        position: 'afterend'
                    });

                    comment.add();
                    comment.focus();
                } else if (newValue.Status !== 'Other' && comment) {
                    comment.remove();
                    comment = undefined;
                }

                modal.getButton('Set status').disabled = false;
            } else {
                if (comment) {
                    comment.remove();
                    comment = undefined;
                }

                modal.getButton('Set status').disabled = true;
            }
        }
    });

    statusField.add();

    /** Change Shift */
    const showShift = Component_Link({
        displayText: 'Change shift?',
        action(event) {
            if (event.target.innerText === 'Change shift?') {
                event.target.innerText = 'Hide change shift?';

                shiftContainer.show();
            } else {
                event.target.innerText = 'Change shift?';

                /** Set shift back to default */
                shiftField.value(defaultShift);

                /** @todo remove container instead of hide */
                if (shiftEndField) {
                    shiftEndField.remove();
                }

                shiftContainer.hide();
            }
        },
        parent
    });

    showShift.add();

    /** Shift Container */
    const shiftContainer = Component_Container({
        parent,
        margin: '20px 0px 0px 0px',
        display: 'none'
    });

    shiftContainer.add();

    /** Info alert */
    const infoAlert = Component_Alert({
        type: 'info',
        text: `This person normally works <b>${defaultShift}s</b>. Selecting a different option will update today's shift only.`,
        // margin,
        // width,
        parent: shiftContainer
    });

    infoAlert.add();

    /** Shifts */
    const shifts = await Action_Get({
        list: 'Shifts'
    });

    /** Shift */
    let shiftEndField;

    const shiftField = Component_DropDownField({
        list: 'Shifts',
        label: 'Shift',
        value: defaultShift,
        dropDownOptions: shifts.map(item => {
            const {
                Id,
                ShiftName
            } = item;
            return {
                id: Id,
                value: ShiftName 
            };
        }),
        width: '200px',
        fieldMargin: '0px 0px 20px 0px',
        parent: shiftContainer,
        onEmpty() {
            modal.getButton('Set status').disabled = true;
        },
        onError(value) {
            modal.getButton('Set status').disabled = true;
        },
        onSetValue(data) {
            const {
                newValue
            } = data;

            if (newValue && newValue.ShiftName && shifts.map(item => item.ShiftName).includes(newValue.ShiftName)) {
                // modal.getButton('Set status').disabled = false;

                if (newValue.ShiftName === 'Night') {
                    shiftEndField = Component_DropDownField({
                        label: 'When does this shift end?',
                        value: defaultShift,
                        dropDownOptions: buildHours(),
                        width: '100px',
                        fieldMargin: '0px 0px 20px 0px',
                        parent: shiftContainer,
                        onEmpty() {
                
                        },
                        onError(value) {
                
                        },
                        onSetValue(data) {
                            
                        }
                    });
                
                    shiftEndField.add();
                }
            } else {
                if (shiftEndField) {
                    shiftEndField.remove();
                }

                // modal.getButton('Set status').disabled = true;
            }
        }
    });

    shiftField.add();

    function buildHours() {
        let hours = [];

        for (let i = 0; i < 24; i++) {
            hours.push({
                id: 0,
                value: `${i}:00`
            });
        }

        return hours;
    }

    return {
        getFieldValues() {
            const data = {};

            /** Status */
            if (statusField.value()) {
                data.Status = statusField.value();
            }

            /** Shift */
            if (shiftField.value()) {
                data.ShiftStatus = shiftField.value();
            }

            /** Shift End */
            if (shiftEndField && shiftEndField.value()) {
                data.ShiftEnd = shiftEndField.value();
            } else {
                data.ShiftEnd = defaultShiftEnd;
            }

            /** Comment */
            if (comment && comment.value()) {
                data.Comment = comment.value();
            }

            if (Object.keys(data).length === 0 && data.constructor === Object) {
                return false;
            } else {
                return data;
            }
        }
    };
}
