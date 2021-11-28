import { Get, Route } from '../Core/Actions.js';
import {
    Title, Container,
    FoldingCube
} from '../Core/Components.js';
import { App } from '../Core.js';
import Store from '../Core/Store.js';
import { QuestionContainer } from '../Core/ViewParts.js';
import { QuestionsModel } from './Models.js';

/**
 *
 * @param {*} param
 */

export async function QuestionAndReplies(param) {
    const { parent, path, itemId } = param;

    /** View Title */
    let viewTitle;

    /** Check local storage for questionTypes */
    let questionTypes = localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`);

    if (questionTypes) {
        console.log('Found questionTypes in local storage.');

        setTitle(questionTypes);
    } else {
        console.log('questionTypes not in local storage. Adding...');

        /** Set temporary title  */
        viewTitle = Title({
            title: App.get('name'),
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions'
                },
                {
                    label: /*html*/ `
                        <div style='height: 20px; width: 20px;' class='spinner-grow text-secondary' role='status'></div>
                    `,
                    path: '',
                    currentPage: true
                }
            ],
            parent,
            date: new Date().toLocaleString('en-US', {
                dateStyle: 'full'
            }),
            type: 'across'
        });

        viewTitle.add();

        const questionTypesResponse = await Get({
            list: 'Settings',
            filter: `Key eq 'QuestionTypes'`
        });

        localStorage.setItem(`${App.get('name').split(' ').join('-')}-questionTypes`, questionTypesResponse[0].Value);

        console.log('questionTypes added to local storage.');

        // setTitle(localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`))
    }

    function setTitle(items) {
        /** If View Tile exists, remove from DOM */
        if (viewTitle) {
            viewTitle.remove();
        }

        /** Parse types */
        const types = JSON.parse(items);

        /** Find question type from passed in path */
        const currentType = types.find(item => item.path === path);

        /** Set new title with drop down options */
        viewTitle = Title({
            title: App.get('name'),
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions',
                }
            ],
            dropdownGroups: [
                {
                    name: currentType.title,
                    items: types.map(facility => {
                        const {
                            title, path
                        } = facility;

                        return {
                            label: title,
                            path: `Questions/${path}`
                        };
                    })
                },
                {
                    name: /*html*/ `
                        <div style='height: 20px; width: 20px;' class='spinner-grow text-secondary' role='status'></div>
                    `,
                    dataName: 'loading-questions',
                    items: []
                }
            ],
            route(path) {
                Route(path);
            },
            parent,
            position: 'afterbegin',
            date: new Date().toLocaleString('en-US', {
                dateStyle: 'full'
            }),
            type: 'across'
        });

        viewTitle.add();
    }

    /** View Container */
    const viewContainer = Container({
        display: 'block',
        margin: '30px 0px',
        maxWidth: '800px',
        parent
    });

    viewContainer.add();

    /** Loading Indicator */
    const loadingIndicator = FoldingCube({
        label: 'Loading Question',
        margin: '40px 0px',
        parent: viewContainer
    });

    loadingIndicator.add();

    let questions = Store.get('Model_Questions');

    if (questions) {
        console.log('Model_Questions found.');

        questions = questions.filter(question => question.QuestionType === path);
    } else {
        console.log('Model_Questions missing. Fetching...');

        const fetchedQuestions = await QuestionsModel({
            // filter: `QuestionType eq '${path}'`
        });

        questions = fetchedQuestions.filter(question => question.QuestionType === path);

        console.log('Model_Questions stored.');
    }

    const question = questions.find(question => question.Id === itemId);

    viewTitle.updateDropdown({
        name: 'loading-questions',
        replaceWith: {
            name: question.Title,
            dataName: question.Id,
            items: questions
                //.filter(question => question.Id !== itemId) /** filter out current question */
                .map(question => {
                    const {
                        Id, Title
                    } = question;

                    return {
                        label: Title,
                        path: `Questions/${path}/${Id}`
                    };
                })
        }
    });

    /** Question */
    QuestionContainer({
        question,
        parent: viewContainer
    });

    /** Remove Loading Indicator */
    loadingIndicator.remove();
}
