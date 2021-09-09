/** Actions */
import Action_Store from '../Actions/Action_Store.js'

/** Components */
import Component_Title from '../Components/Component_Title.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default async function View_Home() {
    /** View Parent */
    const parent = Action_Store.get('maincontainer');

    // /** View Title */
    // const viewTitle = Component_Title({
    //     title: Setting_App.title,
    //     subTitle: `Subtitle (Ex: Application/Abbreviation Full Name)`,
    //     parent,
    //     date: new Date().toLocaleString('en-US', {
    //         dateStyle: 'full'
    //     }),
    //     type: 'across'
    // });

    // viewTitle.add();

    /** Turn off Main Container Padding */
    parent.paddingOff();

    /** Markets */
    const markets = Action_Store.get('Markets');

    /** Market */
    const market = markets.find(item => item.MarketId === marketId);

    if (!market) {
        Action_Route('404');

        return;
    }

    const {
        Title
    } = market;

    /** Facility */
    const facility = Action_Store.get('Facilities').find(item => item.DMISID === facilityId);

    if (!facility) {
        Action_Route('404');

        return;
    }

    /** Facilities */
    const facilities = Action_Store.get('Facilities')
        .filter(item => item.MarketID === marketId); /** filter on current market */
        // .filter(item => item.MarketID === marketId && item.DMISID !== facilityId); /** filter out current facility */

    const {
        QPP_DropDown
    } = facility;

    /** View Container */
    const container = Component_Container({
        height: '100%',
        width: '100%',
        overflowX: 'hidden',
        parent
    });

    container.add();

    /** Left Container */
    const leftContainer = Component_Container({
        // background: '#ebebff',
        overflow: 'overlay',
        height: '100%',
        minWidth: 'fit-content',
        direction: 'column',
        parent: container
    });

    leftContainer.add();

    /** Right Container */
    const rightContainer = Component_Container({
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
    /** @todo add /${section} to breadcrumb links */
    const viewTitle = Component_Title({
        title: Setting_App.title,
        margin: '20px 50px',
        maxTextWidth: '385px',
        breadcrumb: [
            {
                label: 'Markets',
                path: 'Markets',
            },
            // {
            //     label: Title,
            //     path: `Markets/${marketId}/${section}`
            // }
        ],
        dropdownGroups: [
            {
                name: Title,
                items: markets.map(facility => {
                    const {
                        Title,
                        MarketId
                    } = facility;
        
                    return {
                        label: Title,
                        path: `Markets/${MarketId}/${section}`
                    };
                })
            },
            {
                name: QPP_DropDown,
                items: facilities.map(facility => {
                    const {
                        QPP_DropDown,
                        DMISID
                    } = facility;
        
                    return {
                        label: QPP_DropDown,
                        path: `Markets/${marketId}/${DMISID}/${section}`
                    };
                })
            }
        ],
        route(path) {
            Action_Route(path);
        },
        parent: rightContainer,
        type: 'across'
    });

    viewTitle.add();

    // const stickyToolbar = Component_StickyToolbar({
    //     parent: rightContainer,
    //     position: 'afterend'
    // });

    // stickyToolbar.add();

    /** Fiscal Year */
    const fiscalYear = sessionStorage.getItem('fiscalYear');
    const startYear = parseInt(fiscalYear.split('-'));
    const thisYear = new Date().getFullYear();

    /** Project Container */
    const projectContainer = Component_Container({
        padding: '0px',
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
    const fiscalYearHeading = Component_Heading({
        text: /*html*/ `
            <span><strong>Fiscal Year:</strong></span>
            <span>${fiscalYear}</span>
        `,
        color: 'mediumslateblue',
        width: '100%',
        margin: '0px 0px 20px 0px',
        padding: '0px 50px',
        parent: projectContainer
    });

    fiscalYearHeading.add();

    /** Plan Container */
    const planContainer = Component_Container({
        width: '100%',
        // align: 'center',
        padding: '0px 50px',
        direction: 'column',
        /** @todo setting overflow-x causing projectContainer scroll event listener to not work right */
        /** @todo should fiscal year be affixed on scroll? */
        // overflowX: 'overlay',
        /** @todo z-index: -1 breaks iframe scroll -> find another way to make box-shadow look right */
        // zIndex: '-1', 
        parent: projectContainer
    });

    planContainer.add();

    /** @todo remove hard coded year */
    const sectionStatus = startYear < thisYear ? 
        'complete' : 
        startYear === thisYear ? 
        'started' :
        'not-started';

    let sections = [
        { 
            name: 'Readiness',
            status: sectionStatus
        },
        { 
            name: 'Health Services Delivery',
            status: sectionStatus
        },
        { 
            name: 'Summary of Initiatives',
            status: sectionStatus
        },
        { 
            name: 'Executive Summary',
            status: sectionStatus
        },
        { 
            name: 'Supporting Files',
            status: sectionStatus
        }
    ];

    /** document.Sections added to reference section status used in: ViewPart_HSDEnrollmentTable.js | @author Wilfredo Pacheco 20210818 */
    document.Sections = sections

    /** Section Stepper */
    const sectionStepper = Component_SectionStepper({
        title: {
            text: 'Facility Plan',
            action(event) {
                Action_Route(`Markets/${marketId}/${facilityId}`);
            }
        },
        // scrollElement: projectContainer,
        action(event) {
            console.log(event);
        },
        sections,
        // topOffset: -stickyToolbar.get().getBoundingClientRect().height, /** Subtract stickyToolbar height on scroll */
        parent: leftContainer
    });

    sectionStepper.add();
    /** Changed the the title for section stepper to button letting user know it will take them to the Facility Plan @author Wilfredo Pacheco 20210809 */
    const TitleEl = sectionStepper.find('div.section-title')
    TitleEl.classList.add('btn')
    TitleEl.classList.add('btn-primary')
    TitleEl.classList.add('text-white')
    TitleEl.classList.add('d-flex')
    TitleEl.classList.add('justify-content-center')
}
