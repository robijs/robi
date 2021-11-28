import { Get } from '../Actions/Get.js'
import { Title } from './Title.js'
import { Container } from './Container.js'
import { QuestionType } from './QuestionType.js'
import { App } from '../Core.js';

/**
 * 
 * @param {*} param 
 */
export async function QuestionTypes(param) {
    const { parent } = param;

    // View Title
    const viewTitle = Title({
        title: `Questions`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    // View Container
    const viewContainer = Container({
        display: 'inline-flex',
        direction: 'column',
        margin: '20px 0px 0px 0px',
        parent
    });

    viewContainer.add();

    // Check local storage for questionTypes
    let questionTypes = JSON.parse(localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`));

    if (!questionTypes) {
        console.log('questionTypes not in local storage. Adding...');

        const questionTypesResponse = await Get({
            list: 'Settings',
            filter: `Key eq 'QuestionTypes'`
        });

        localStorage.setItem(`${App.get('name').split(' ').join('-')}-questionTypes`, questionTypesResponse[0].Value);
        questionTypes = JSON.parse(localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`));

        console.log('questionTypes added to local storage.');
    }

    const questions = await Get({
        list: 'Questions'
    });

    console.log(questions);

    questionTypes.forEach(type => {
        const {
            title, path
        } = type;

        const questionType = QuestionType({
            title,
            path,
            questions: questions.filter(item => item.QuestionType === title),
            parent
        });

        questionType.add();
    });
}
