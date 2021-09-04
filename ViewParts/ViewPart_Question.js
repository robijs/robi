/** RHC-C SharePoint Team */

/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_CreateItem from '../Actions/Action_CreateItem.js'
import Action_UpdateItem from '../Actions/Action_UpdateItem.js'
import Action_Store from '../Actions/Action_Store.js'

/* Components */
import Component_Container from '../Components/Component_Container.js'
import Component_SingleLineTextField from '../Components/Component_SingleLineTextField.js'
import Component_MultiLineTextField from '../Components/Component_MultiLineTextField.js'
import Component_Alert from '../Components/Component_Alert.js'
import Component_QPPQuestion from '../Components/Component_QPPQuestion.js'
import Component_QPPReply from '../Components/Component_QPPReply.js'
import Component_NewReply from '../Components/Component_NewReply.js'
import Component_Modal from '../Components/Component_Modal.js'

/** Models */
import Model_Question from '../Models/Model_Question.js'

/** View Parts */
import ViewPart_EditQuestion from '../ViewParts/ViewPart_EditQuestion.js'

export default function ViewPart_Question(param) {
    const {
        question,
        parent
    } = param;

    /** New Question Form */
    let editQuestionForm;

    /** Question */
    const questionComponent = Component_QPPQuestion({
        question,
        parent,
        onEdit(event) {
            const modal = Component_Modal({
                title: 'Ask a question',
                showFooter: true,
                addContent(modalBody) {
                    editQuestionForm = ViewPart_EditQuestion({
                        question,
                        modal,
                        parent: modalBody
                    });
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
                            value: 'Update',
                            classes: 'btn-success',
                            async onClick(event) {
                                /** Disable button */
                                event.target.disabled = true;
                                event.target.innerHTML = /*html*/ `
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating
                                `;

                                /** Update question */
                                const updatedItem = await Action_UpdateItem({
                                    list: 'Questions',
                                    select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                                    expand: `Author/Id,Editor/Id`,
                                    itemId: question.Id,
                                    data: editQuestionForm.getFieldValues()
                                });

                                const updatedQuestion = Model_Question({
                                    question: updatedItem,
                                    replies: question.replies
                                });

                                const questions = Action_Store.get('Model_Questions');
                                const index = questions.indexOf(question);

                                console.log(index);

                                questions.splice(index, 1, updatedQuestion);

                                /** Add new quesiton card to DOM */
                                questionComponent.setQuestion(updatedQuestion);

                                /** Completed */
                                event.target.disabled = false;
                                event.target.innerHTML = 'Updated!';

                                /** close and remove modal */
                                modal.getModal().modal('hide');
                            }
                        }
                    ]
                },
                parent
            });
    
            modal.add();
        }
    });

    questionComponent.add();

    /** Replies */
    const {
        replies
    } = question;

    replies
    .sort((a, b) => {
        a = a.Id;
        b = b.Id;
        
        /** Ascending */
        if (a < b) {
            return -1;
        }
        
        if (a > b) {
            return 1;
        }
    
        // names must be equal
        return 0;
    })
    .forEach(reply => {
        const replyComponent = Component_QPPReply({
            reply,
            margin: '0px 0px 10px 0px',
            parent,
            onEdit(value) {
                replyOnEdit({
                    reply,
                    replyComponent,
                    value
                });
            }
        });
    
        replyComponent.add();
    });

    async function replyOnEdit(param) {
        const {
            reply,
            replyComponent,
            value
        } = param;

        if (value !== reply.Body) {
            /** Update question */
            const updatedItem = await Action_UpdateItem({
                list: 'Questions',
                select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                expand: `Author/Id,Editor/Id`,
                itemId: reply.Id,
                data: {
                    Body: value
                }
            });

            const index = replies.indexOf(reply);

            console.log('reply index: ', index);

            replies.splice(index, 1, updatedItem);

            /** Updated modified text */
            replyComponent.setModified(updatedItem);
        }
    }

    /** New Reply */
    const newReply = Component_NewReply({
        width: '100%',
        parent,
        async action(value) {
            // console.log(value);

            /** Create item */
            const newItem = await Action_CreateItem({
                list: 'Questions',
                select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                expand: `Author/Id,Editor/Id`,
                data: {
                    Title: 'Reply',
                    Body: value,
                    ParentId: question.Id,
                    QuestionId: question.Id,
                    QuestionType: question.QuestionType
                }
            });

            /** Update Last Reply footer */
            questionComponent.updateLastReply(newItem);

            /** Increment replies */
            questionComponent.addCount();

            /** Add to replies */
            replies.push(newItem);

            // console.log(newItem);

            /** Add to DOM */
            const replyComponent = Component_QPPReply({
                reply: newItem,
                label: 'new',
                margin: '0px 0px 10px 0px',
                parent: newReply,
                position: 'beforebegin',
                onEdit(value) {
                    replyOnEdit({
                        reply: newItem,
                        replyComponent,
                        value
                    });
                }
            });
        
            replyComponent.add();
        }
    });

    newReply.add();

    /** Register event */
    document.addEventListener('keydown', event => {
        if (event.ctrlKey && event.shiftKey && event.key === 'E') {
            questionComponent.editButton().click();
        }

        if (event.ctrlKey && event.altKey && event.key === 'r') {
            newReply.focus();
        }
    });
}
