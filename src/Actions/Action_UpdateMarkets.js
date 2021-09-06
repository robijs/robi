/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_CreateItem from '../Actions/Action_CreateItem.js'
import Action_UpdateItem from '../Actions/Action_UpdateItem.js'
// import Action_GetADUsers from '../Actions/Action_GetADUsers.js'

/** Components */
import Component_Title from '../Components/Component_Title.js'
import Component_DashboardBanner from '../Components/Component_DashboardBanner.js'
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_Heading from '../Components/Component_Heading.js'
import Component_Timer from '../Components/Component_Timer.js'
import Component_DataTable from '../Components/Component_DataTable.js'
import Component_Container from '../Components/Component_Container.js'

export default function Action_UpdateMarkets(param) {
    const {

    } = param;

     /** Get Facilities */
     const facilities = await Action_Get({
        list: 'Facilities',
        select: 'Id,Title,DMISID,DashboardFilter,DashboardLevel,FacilityID,FacilityName,Grouping,IsActive,MarketID,QPP_DropDown,SubGrouping,Market/Id,Market/Title',
        expand: 'Market'
    });

    /** Get Markets */
    const markets = await Action_Get({
        list: 'Markets',
        select: 'Id,Title,MarketId',
    });

    /** Update items */
    async function update() {
        /** Set items */
        for (const [index, value] of facilities.entries()) {
            if (run) {
                const {
                    Id,
                    Title, /** @todo remove concatenated Market name (if present) from Title field */
                    FacilityName, /** @todo remove concatenated Market name (if present) from FacilityName field */
                    MarketID,
                    MarketId,
                    Market
                } = value;

                if (MarketId) {
                    console.log(`%c Market already set. Id: ${Id}, Title: ${Title}, MarketId: ${MarketId}, Market: ${Market}`, 'color: green');
                } else {
                    console.log('');
                    console.log(`%c Missing Market! Id: ${Id}, Title: ${Title}`, 'background: red; color: white');

                    /** Market */
                    const market = markets.find(market => market.MarketId === MarketID);
    
                    if (!market) {
                        console.log('\tMissing MarketID.');
                        
                        return;
                    }
    
                    console.log(`\tMarket List Item. Id: ${market.Id}, Title: ${market.Title}, MarketId: ${market.MarketId}`);
    
                    console.log(`\tUpdating ${Title}...`);
                    const updatedItem = await Action_UpdateItem({
                        list: 'Facilities',
                        itemId: value.Id,
                        select: 'Id,Title,DMISID,DashboardFilter,DashboardLevel,FacilityID,FacilityName,Grouping,IsActive,MarketID,QPP_DropDown,SubGrouping,Market/Id,Market/Title',
                        expand: 'Market',
                        data: {
                            MarketId: market.Id
                        }
                    });
    
                    /** Completed message */
                    console.log(`\t%c Updated! Id: ${Id}, Title: ${Title}, MarketId: ${updatedItem.MarketId}, Market: ${updatedItem.Market.Title}`, 'color: green');
                }
                
                if (index === facilities.length - 1) {
                    timer.stop();
                }
            } else {
                console.log('stoped');
                
                break;
            }
        }
    }

    /** Set Markets Table */
    setTable({
        title: 'Markets',
        headers: [
            'Title',
            'MarketId'
        ],
        data: markets
    });

    /** Set Facilities Table */
    setTable({
        title: 'Facilities',
        headers: [
            'Title',
            'DMISID',
            'DashboardFilter',
            'DashboardLevel',
            'FacilityID',
            'FacilityName',
            'Grouping',
            'IsActive',
            'MarketID',
            'QPP_DropDown',
            'SubGrouping',
            'MarketID',
            'Market'
        ],
        data: facilities.map(item => {
            if (item.Market.Title) {
                item.Market = item.Market.Title;
            } else {
                item.Market = '';
            }

            return item;
        })
    });
         
    /** Remove loading indicator from DOM */
    loadingIndicator.remove();

    /** @todo should be a ViewPart */
    function setTable(param) {
        const {
            title,
            headers,
            data
        } = param;

        const viewContainer = Component_Container({
            display: 'block',
            margin: '20px 0px',
            parent
        });

        viewContainer.add();

        const heading = Component_Heading({
            text: title,
            parent: viewContainer
        });

        heading.add();

        const simpleTable = Component_DataTable({
            headers,
            // striped: false,
            // border: false,
            // paging: false,
            // search: false,
            width: '100%',
            columns: headers.map(column => {
                return {
                    data: column,
                    type: 'string'
                };
            }),
            data,
            rowId: 'id',
            order: [[ 1, 'desc' ], [0, 'asc' ]],
            onRowClick(param) {
                const {
                    row,
                    item
                } = param;
    
                console.log(param);
            },
            rowCallback(row, data) {
                const {
                    Progress
                } = data;
    
                if (Progress === 100) {
                    row.classList.add('table-success');
                }
            },
            onDraw(param) {
                const {
                    jqevent,
                    table
                } = param;
    
                /* Set dashboard on table filter */
                // const data = table.rows({ search: 'applied' }).data().toArray();
    
                // dashboard.update(buildBannerData(data));
            },
            parent: viewContainer
        });
    
        simpleTable.add();
    }
}