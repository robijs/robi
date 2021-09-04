/** RHC-C SharePoint Team */

/* Components */
import Component_Container from '../Components/Component_Container.js'
import Component_SingleLineTextField from '../Components/Component_SingleLineTextField.js'
import Component_MultiLineTextField from '../Components/Component_MultiLineTextField.js'
import Component_Alert from '../Components/Component_Alert.js'

export default function ViewPart_EditQuestion(param) {
    const {
        question,
        parent,
        modal
    } = param;
    
    const {
        Title,
        Body
    } = question;

    /** Title */
    const titleField = Component_SingleLineTextField({
        label: 'Question',
        description: '',
        value: Title,
        width: '100%',
        fieldMargin: '0px 40px 20px 40px',
        parent,
        onKeydown(event) {
            if (event.target.innerText) {
                modal.getButton('Update').disabled = false;
            } else {
                modal.getButton('Update').disabled = true;
            }
            
            submit(event);
        }
    });
    
    titleField.add();

    /** Body */
    const bodyField = Component_MultiLineTextField({
        label: 'Description',
        description: '',
        value: Body,
        width: '100%',
        fieldMargin: '20px 40px',
        optional: true,
        parent,
        onKeydown(event) {
            submit(event);
        }
    });
    
    bodyField.add();

    /** Control + Enter to submit */
    function submit(event) {
        if (event.ctrlKey && event.key === 'Enter') {
            const submit = modal.getButton('Update');
            
            if (!submit.disabled) {
                submit.click();
            }
        }
    }

    /** Focus on name field */
    titleField.focus();

    return {
        getFieldValues() {
            const data = {
                Title: titleField.value(),
                Body: bodyField.value(),
            }

            if (!data.Title) {
                /** @todo field.addError() */

                return false;
            }

            return data;
        }
    };
}
