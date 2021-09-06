

/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_Store from '../Actions/Action_Store.js'

/** Models */
import Model_Question from './Model_Question.js';

export default async function Model_Questions(param) {
    const {
        filter
    } = param;

    /** Get Questions */
    const messages = await Action_Get({
        list: 'Questions',
        filter,
        select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
        orderby: 'Id desc',
        expand: `Author/Id,Editor/Id`
    });

    /** Questions */
    const questions = messages.filter(question => question.ParentId === 0);

    /** Replies */
    const replies = messages.filter(question => question.ParentId !== 0);

    /** Model */
    const Model_Questions = questions.map(question => {
        // question.replies = replies.filter(reply => reply.QuestionId === question.Id);

        // return question;

        return Model_Question({
            question,
            replies: replies.filter(reply => reply.QuestionId === question.Id)
        });
    });

    Action_Store.add({
        type: 'model',
        name: 'Model_Questions',
        model: Model_Questions
    });
    
    return Model_Questions;
}
