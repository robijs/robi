/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_Store from '../Actions/Action_Store.js';

/** Components */
import Component_Title from '../Components/Component_Title.js'
import Component_Container from '../Components/Component_Container.js'
import Component_QuestionTypes from '../Components/Component_QuestionTypes.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'
import Component_Card from '../Components/Component_Card.js';

export default async function View_Quesitons() {
    /** View Parent */
    const parent = Action_Store.get('maincontainer');

    /** View Title */
    const viewTitle = Component_Title({
        title: Setting_App.get('title'),
        subTitle: `Questions`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    /** View Container */
    const viewContainer = Component_Container({
        display: 'inline-flex',
        direction: 'column',
        margin: '20px 0px 0px 0px',
        parent
    });

    viewContainer.add();

    /** Check local storage for questionTypes */
    let questionTypes = JSON.parse(localStorage.getItem(`${Setting_App.get('title').split(' ').join('-')}-questionTypes`));

    if (!questionTypes) {
        console.log('questionTypes not in local storage. Adding...');

        const questionTypesResponse = await Action_Get({
            list: 'View_Questions',
            filter: `Title eq 'QuestionTypes'`
        });

        localStorage.setItem(`${Setting_App.get('title').split(' ').join('-')}-questionTypes`, JSON.stringify(questionTypesResponse[0].Value));
        questionTypes = JSON.parse(localStorage.getItem(`${Setting_App.get('title').split(' ').join('-')}-questionTypes`));

        console.log('questionTypes added to local storage.');
    }

    questionTypes.forEach(type => {
        const {
            title,
            path
        } = type;

        const card = Component_Card({
            title,
            description: '',
            parent: viewContainer,
            margin: '0px 0px 20px 0px',
            width: '100%'
        });

        card.add();
    });

    // const qppQuestions = Component_QuestionTypes({
    //     parent: viewContainer
    // });

    // qppQuestions.add();
}
