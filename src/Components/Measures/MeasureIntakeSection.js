import { Authorize, Get, CreateItem, UpdateItem, DeleteItem, Route, AttachFiles, UploadFiles, SendEmail } from '../../Core/Actions.js'
import { Title, Alert, Container, FoldingCube, Card, Modal, BootstrapButton, SectionStepper } from '../../Core/Components.js'
import { App } from '../../Core/Settings.js'
import Store from '../../Core/Store.js'
import { Table } from '../../Core/ViewParts.js'

/**
 * 
 */
export default async function MeasureIntakeForm() {
    // /** View Parent */
    // const parent = Store.get('maincontainer');

    // /** View Title */
    // const viewTitle = Title({
    //     title: App.get('title'),
    //     subTitle: `Measure Intake Form`,
    //     parent,
    //     date: new Date().toLocaleString('en-US', {
    //         dateStyle: 'full'
    //     }),
    //     type: 'across'
    // });

    // viewTitle.add();

    // const info = Alert({
    //     margin: '20px 0px',
    //     type: 'info',
    //     text: '<strong>Measure Intake Form</strong> coming soon. Please stay tuned!',
    //     parent
    // });

    // info.add();

    const {
        marketId,
        props
    } = param;

    // console.log(param);

    /** View Parent */
    const parent = Store.get('maincontainer');

    /** Turn off Main Container Padding */
    parent.paddingOff();
    
    /** View Container */
    const container = Container({
        height: '100%',
        width: '100%',
        parent
    });

    container.add();

    /** Left Container */
    const leftContainer = Container({
        // background: '#ebebff',
        overflow: 'overlay',
        height: '100%',
        minWidth: 'fit-content',
        direction: 'column',
        parent: container
    });

    leftContainer.add();

    /** Right Container */
    const rightContainer = Container({
        flex: '1',
        height: '100%',
        direction: 'column',
        overflowX: 'overlay',
        // padding: '20px 50px',
        // align: 'center',
        parent: container
    });

    rightContainer.add();

    /** View Title */
    const viewTitle = Title({
        title: App.get('title'),
        margin: '15px 20px 10px 20px',
        parent: rightContainer,
        type: 'across'
    });

    viewTitle.add();

    /** Project Container */
    const projectContainer = Container({
        padding: '0px 0px 5px 0px',
        width: '100%',
        direction: 'column',
        overflow: 'overlay',
        align: 'center',
        parent: rightContainer
    });

    projectContainer.add();

    /** Scroll listener */
    projectContainer.get().addEventListener('scroll', event => {
        if (event.target.scrollTop > 0) {
            projectContainer.get().style.borderTop = `solid 1px ${Setting_App.sidebarBorderColor}`;
        } else {
            projectContainer.get().style.borderTop = `none`;
        }
    });

    /** Fiscal Year Banner */
    const fiscalYearHeading = Heading({
        text: /*html*/ `
            <span><strong>Section Name</strong></span>
        `,
        color: 'mediumslateblue',
        width: '100%',
        margin: '0px 0px 10px 0px',
        padding: '0px 20px',
        parent: projectContainer
    });

    fiscalYearHeading.add();

    /** Plan Container */
    const planContainer = Container({
        width: '100%',
        // align: 'center',
        padding: '0px 20px',
        direction: 'column',
        /** @todo z-index: -1 breaks iframe scroll -> find another way to make box-shadow look right */
        // zIndex: '-1', 
        parent: projectContainer
    });

    planContainer.add();

    /** @todo remove hard coded year */
    const sectionStatus = 'not-started'

    let sections = [
        { 
            name: 'Ownership',
            status: sectionStatus
        },
        { 
            name: 'General Information',
            status: sectionStatus
        },
        { 
            name: 'Data Source',
            status: sectionStatus
        },
        { 
            name: 'Dashboard',
            status: sectionStatus
        },
        { 
            name: 'Formulas',
            status: sectionStatus
        },
        { 
            name: 'Timing',
            status: sectionStatus
        },
        { 
            name: 'Performance Target & Goals',
            status: sectionStatus
        },
        { 
            name: 'Miscellaneous',
            status: sectionStatus
        }
    ];

    /** Section Stepper */
    const sectionStepper = SectionStepper({
        title: {
            text: 'All Sections',
            action(event) {
                console.log('Route all sections');
            }
        },
        action(event) {
            switch (event.target.innerText) {
                case 'Ownership':
                    Route(`Measures/Ownership`);
                    break;
                case 'General Information':
                    Route(`Measures/GeneralInfo`);
                    break;
                case 'Data Source':
                    Route(`Markets/DataSource`);
                    break;
                case 'Dashboard':
                    Route(`Markets/Dashboard`);
                    break;
                case 'Formulas':
                    Route(`Markets/Formulas`);
                    break;
                case 'Timing':
                    Route(`Markets/Timing`);
                    break;
                case 'Performance Target & Goals':
                    Route(`Markets/Performance`);
                    break;
                case 'Miscellaneous':
                    Route(`Markets/Misc`);
                    break;
                default:
                    break;
            }
        },
        sections,
        parent: leftContainer
    });

    sectionStepper.add();

}