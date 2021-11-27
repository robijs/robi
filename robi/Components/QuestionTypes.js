import { Get } from '../Core/Actions.js';
import { Title, Container, QuestionType } from '../Core/Components.js';
import { App } from '../Core/Settings.js';

/**
 *
 */

export async function QuestionTypes(param) {
    const { parent } = param;

    /** View Title */
    const viewTitle = Title({
        title: `Questions`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    /** View Container */
    const viewContainer = Container({
        display: 'inline-flex',
        direction: 'column',
        margin: '20px 0px 0px 0px',
        parent
    });

    viewContainer.add();

    /** Check local storage for questionTypes */
    let questionTypes = JSON.parse(localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`));

    if (!questionTypes) {
        console.log('questionTypes not in local storage. Adding...');

        const questionTypesResponse = await Get({
            list: 'Settings',
            filter: `Key eq 'QuestionTypes'`
        });

        // localStorage.setItem(`${App.get('name').split(' ').join('-')}-questionTypes`, JSON.stringify(questionTypesResponse[0].Value));
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

        // const card = Card({
        //     title,
        //     description: '',
        //     parent: viewContainer,
        //     margin: '0px 0px 20px 0px',
        //     width: '100%',
        //     action(event) {
        //         Route(`Questions/${path}`);
        //     }
        // });
        // card.add();
        const questionType = QuestionType({
            title,
            path,
            questions: questions.filter(item => item.QuestionType === title),
            parent
        });

        questionType.add();
    });
}
