/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_Store from '../Actions/Action_Store.js'
import Action_Route from '../Actions/Action_Route.js'

/** Components */
import Component_Title from '../Components/Component_Title.js'
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_Container from '../Components/Component_Container.js'
import Component_Alert from '../Components/Component_Alert.js'

/** Models */
import Model_Questions from '../Models/Model_Questions.js'

/** Settings */
import { App } from '../Core/Settings.js'

/** View Parts */
import ViewPart_Question from '../ViewParts/ViewPart_Question.js'

export default async function View_Quesiton(param) {
    const {
        path,
        itemId
    } = param;

    /** View Parent */
    const parent = Action_Store.get('maincontainer');

    /** View Title */
    let viewTitle;

    /** Check local storage for questionTypes */
    let questionTypes = localStorage.getItem(`${App.get('title').split(' ').join('-')}questionTypes`);

    if (questionTypes) {
        console.log('Found questionTypes in local storage.');

       setTitle(questionTypes);
    } else {
        console.log('questionTypes not in local storage. Adding...');

        /** Set temporary title  */
        viewTitle = Component_Title({
            title: App.get('title'),
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions'
                },
                {
                    label: /*html*/ `
                        <div class='spinner-grow text-primary' role='status'>
                            <span class='sr-only'>Loading...</span>
                        </div>
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

        const questionTypesResponse = await Action_Get({
            list: 'View_Questions',
            filter: `Title eq 'QuestionTypes'`
        });

        localStorage.setItem(`${App.get('title').split(' ').join('-')}questionTypes`, questionTypesResponse[0].Value);

        console.log('questionTypes added to local storage.');
        
        setTitle(localStorage.getItem(`${App.get('title').split(' ').join('-')}questionTypes`))
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
        viewTitle = Component_Title({
            title: App.get('title'),
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
                            title,
                            path
                        } = facility;
            
                        return {
                            label: title,
                            path: `Questions/${path}`
                        };
                    })
                },
                {
                    name:  /*html*/ `
                        <span class='spinner-grow text-primary' role='status'>
                            <span class='sr-only'>Loading...</span>
                        </span>
                    `,
                    dataName: 'loading-questions',
                    items: []
                }
            ],
            route(path) {
                Action_Route(path);
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
    const viewContainer = Component_Container({
        display: 'block',
        margin: '30px 0px',
        maxWidth: '800px',
        parent
    });

    viewContainer.add();

    /** Loading Indicator */
    const loadingIndicator = Component_FoldingCube({
        label: 'Loading Question',
        margin: '40px 0px',
        parent: viewContainer
    });
    
    loadingIndicator.add();

    let questions = Action_Store.get('Model_Questions');

    if (questions) {
        console.log('Model_Questions found.');

        questions = questions.filter(question => question.QuestionType === path);
    } else {
        console.log('Model_Questions missing. Fetching...');

        const fetchedQuestions = await Model_Questions({
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
                    Id,
                    Title
                } = question;

                return {
                    label: Title,
                    path: `Questions/${path}/${Id}`
                }
            })
        }
    });

    /** Question */
    ViewPart_Question({
        question,
        parent: viewContainer
    });
    
    /** Remove Loading Indicator */
    loadingIndicator.remove();
}
