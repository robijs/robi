/** Actions */
import Action_Store from '../Actions/Action_Store.js'

/** Components */
import Component_Container from '../Components/Component_Container.js'
import Component_Alert from '../Components/Component_Alert.js'
import Component_QPPQuestionCard from '../Components/Component_QPPQuestionCard.js'

export default function ViewPart_QuestionCards(param) {
    const {
        parent,
        path,
        questions
    } = param;

    if (typeof parent === 'object' && parent.empty) {
        parent.empty();
    }

    /** Info Alert Container */
    const alertContainer = Component_Container({
        parent,
        display: 'flex',
        width: '100%',
        justify: 'flex-end',
    });

    alertContainer.add();

    /** Light Alert */
    const lightAlert = Component_Alert({
        type: 'blank',
        text: `${questions.length} question${questions.length === 1 ? '' : 's'}`,
        margin: '20px 0px -10px 0px',
        parent: alertContainer
    });

    lightAlert.add();

    /** Questions */
    // questions.forEach(question => {
    //     const thisQuestionsReplies = replies.filter(reply => reply.QuestionId === question.Id);

    //     const questionCard = Component_QPPQuestionCard({
    //         question,
    //         replyCount: thisQuestionsReplies.length,
    //         lastReply: thisQuestionsReplies[0],
    //         path: `Questions/${path}`,
    //         margin: '20px 0px',
    //         parent
    //     });

    //     questionCard.add();
    // });

    questions
    .sort((a, b) => {
        a = a.Id;
        b = b.Id;
        
        /** Descending */
        if (a > b) {
            return -1;
        }
        
        if (a < b) {
            return 1;
        }
    
        // names must be equal
        return 0;
    })
    .forEach(question => {
        const questionCard = Component_QPPQuestionCard({
            question,
            path: `Questions/${path}`,
            margin: '15px 0px',
            parent
        });

        questionCard.add();
    });

    return {
        addCard(question) {
            /** Add card to DOM */
            const questionCard = Component_QPPQuestionCard({
                question,
                label: 'new',
                path: `Questions/${path}`,
                margin: '15px 0px',
                parent: alertContainer,
                position: 'afterend'
            });
    
            questionCard.add();

            /** Update count */
            const refreshedQuestions = Action_Store.get('Model_Questions').filter(question => question.QuestionType === path);

            lightAlert.get().innerHTML = `${refreshedQuestions.length} question${refreshedQuestions.length === 1 ? '' : 's'}`;
        }
    }
}
