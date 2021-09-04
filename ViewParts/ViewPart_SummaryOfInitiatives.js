/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_UpdateItem from '../Actions/Action_UpdateItem.js'
import Action_Store from '../Actions/Action_Store.js'

/** Components */
import Component_Card from '../Components/Component_Card.js'
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_SingleLineTextField from '../Components/Component_SingleLineTextField.js'
import Component_FormButton from '../Components/Component_FormButton.js'


const ListTitle = 'QPP-iTracker'
const SiteCollectionUrl = `${location.origin}/sites/SPIDR`
const ListUrl = `${SiteCollectionUrl}/_api/Web/Lists/getByTitle('${ListTitle}')`
const Route = {
    Get: function Get(Url, data){
        if ( !Url ){ return console.info('You are missing a url!') }
        return $.ajax({
            url: Url,
            method: 'GET',
            contentType: 'json',
            data: data || '',
            headers: { 'Content-Type': 'application/json; charset=UTF-8', 'Accept': 'application/json; odata=verbose' }
        })   
    },
    GetRequestDigest: function GetRequestDigest(Url){
        return $.ajax({
            url: `${Url || SiteCollectionUrl}/_api/contextinfo`,
            method: 'POST',
            dataType: 'json',
            headers: { 'Accept': 'application/json; odata=verbose' }
        })
        .then(data => data.d.GetContextWebInformation.FormDigestValue)
        .catch(e => console.info(e))
    },
    Post: function Post(Url, data, ReqDigest){
        if ( !Url  || ! ReqDigest ){ return console.info('You are missing items from your request!') }
        return $.ajax({
            url: Url,
            method: 'POST',
            dataType: 'json',
            data: typeof(data) === 'string' ? data : JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose',
                'X-RequestDigest': ReqDigest
            }
        })
    },
    Patch: function Patch(Url, data, ReqDigest, etag){
        if ( !Url  || ! ReqDigest ){ return console.info('You are missing items from your request!') }
        return $.ajax({
            url: Url,
            method: 'POST',
            dataType: 'json',
            data: typeof(data) === 'string' ? data : JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose',
                'IF-MATCH': etag || '*',
                'X-HTTP-Method': 'MERGE',
                'X-RequestDigest': ReqDigest
            }
        })
    },
    Delete: function Delete(Url, ReqDigest){
        if ( !Url  || ! ReqDigest ){ return console.info('You are missing items from your request!') }
        return $.ajax({
            url: Url,
            method: 'POST',
            dataType: 'json',
            data: typeof(data) === 'string' ? data : JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose',
                'IF-MATCH': '*',
                'X-HTTP-Method': 'DELETE',
                'X-RequestDigest': ReqDigest
            }
        })
    }
}

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default async function View_SummaryOfInitiatives(param) {
    const {
        facility,
        parent
    } = param;

    const FacilitySelected = document.FacilitySelected = facility
    const FacilityValue = document.FacilityValue
    const StartYearValue = FacilityValue.props.fy.split('-')[0]
    const EndYearValue = FacilityValue.props.fy.split('-')[1]

    const card = Component_Card({
        title: 'Summary of Initiatives',
        description: /*html*/ `
            <p class='mb-2'>The Summary of Initiatives is a list of initiatives that will be executed as part of the QPP plan to close high priority gaps (performance, capability or capacity gaps). Initiatives are documented in the Strategic Performance Improvement Data Repository (SPIDR) and feed the Summary of Initiatives tab if tagged “QPP”, include the current “QPP Plan Submission Year” and “Status” of either "proposed", "in-progress" or "hold". Market level initiatives must be entered under the “Plan 3 Market Name-HQ” level in the “Command” Field of the initiative in SPIDR to populate the Market Summary of Initiatives.</p>
            <p class='mb-2 mt-2'>
                <a href='https://carepoint.health.mil/sites/MHSP4I/SitePages/HomeMHS.aspx' target='_blank'>MHS Dashboard</a>
            </p>
            <p class='mb-2'>
                <a href='https://carepoint.health.mil/sites/SPIDR/SitePages/Home.aspx' target='_blank'>SPIDR</a>
            </p>
        `,
        titleColor: Setting_App.primaryColor,
        padding: '20px',
        width: '100%',
        parent
    });

    card.add();
    
    /** Loading Indicator */
    const loadingIndicator = Component_FoldingCube({
        label: 'Loading Initiatives from SPIDR ',
        margin: '40px 0px',
        parent
    });
    
    loadingIndicator.add();

    const spidrItems = await Action_Get({
        path: '/sites/SPIDR',
        list: 'QPP-iTracker',
        filter: encodeURIComponent(`QPP_x0020_Plan_x0020_Year_x0028_ eq '2021;#2022' and Command eq '${facility.Title}'`)
    });

    console.info(`QPP_x0020_Plan_x0020_Year_x0028_ eq '2021;#2022' and Command eq '${facility.Title}'`)
    console.info(encodeURIComponent(`QPP_x0020_Plan_x0020_Year_x0028_ eq '2021;#2022' and Command eq '${facility.Title}'`))
    console.log(spidrItems);

    // const SPIDR_SiteCollection = await Route.Get(`https://carepoint.health.mil/sites/SPIDR/_api/Web`).then(data => data.d)
    const SPIDR_QPP_iTracker = await Route.Get(ListUrl).then(data => data.d)
    const SPIDR_QPP_iTracker_Items = await Route.Get(SPIDR_QPP_iTracker.__metadata.uri + '/Items', {
        // $select: 'SPIDR,SPIDR_x002d_ID,QPP_x0020_Plan_x0020_Year_x0028_,Title,Phase,FieldValuesAsText',
        // https://carepoint.health.mil/sites/SPIDR/pp/QPP-29531
        $select: 'SPIDR,SPIDR_x002d_ID,QPP_x0020_Plan_x0020_Year_x0028_,Title,Phase',
        $filter: `QPP_x0020_Plan_x0020_Year_x0028_ eq '${EndYearValue}'`,
        // $expand: 'FieldValuesAsText',
        $top: SPIDR_QPP_iTracker.ItemCount
    }).then(data => data.d.results)

    console.info(SPIDR_QPP_iTracker)
    console.info(SPIDR_QPP_iTracker_Items)

    /** Remove Loading Indication */
    loadingIndicator.remove();
}
