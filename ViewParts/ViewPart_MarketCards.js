/** Actions */
import Action_Store from '../Actions/Action_Store.js'

/** Components */
import Component_Container from '../Components/Component_Container.js'
import Component_Heading from '../Components/Component_Heading.js'
import Component_Alert from '../Components/Component_Alert.js'
import Component_QPPMarketCard from '../Components/Component_QPPMarketCard.js'

export default function ViewPart_MarketCards(param) {
    const {
        parent,
        markets
    } = param;

    /** Info Alert Container */
    const alertContainer = Component_Container({
        parent,
        display: 'flex',
        width: '100%',
        justify: 'space-between',
        align: 'center'
    });

    alertContainer.add();

    /** Plans Heading */
    const plansHeading = Component_Heading({
        text: 'Plans',
        margin: '0px',
        parent: alertContainer
    });

    plansHeading.add();

    /** Light Alert */
    const lightAlert = Component_Alert({
        type: 'blank',
        text: markets.length > 0 ? 
            `Showing ${markets.length} Markets and ${markets.map(m => m.facilities.length).reduce((a, c) => a + c)} Facilities` :
            'Showing 0 markets 0 facilities',
        margin: '0px 0px -10px 0px',
        parent: alertContainer
    });

    lightAlert.add();

    /** Add cards */
    markets
        .sort((a, b) => {
            a = a.Title.toUpperCase();
            b = b.Title.toUpperCase();
            
            if (a < b) {
                return -1;
            }
            
            if (a > b) {
                return 1;
            }
        
            // names must be equal
            return 0;
        })
        .forEach(market => {
            const {
                Title,
                MarketId,
                status,
                pinned,
                facilities
            } = market;

            const card = Component_QPPMarketCard({
                title: Title,
                subTitle: 'Market',
                marketId: MarketId,
                status,
                facilities,
                pinned,
                onPin(param) {
                    const {
                        type,
                        item
                    } = param;

                    Action_Store
                        .get(type)
                        .addItem({
                            item
                        });
                },
                margin: '20px 0px',
                parent
            });
            
            card.add();
        });
}
