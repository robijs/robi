import Action_Store from '../Actions/Action_Store.js'

/** Components */
import Component_Card from '../Components/Component_Card.js'
import Component_Heading from '../Components/Component_Heading.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/** View Parts */
import ViewPart_RDSSummaryTable from '../ViewParts/ViewPart_RDSSummaryTable.js'
import ViewPart_RDSQuarterlyTable from '../ViewParts/ViewPart_RDSQuarterlyTable.js'

async function CreateDataImportOption(card, facility, pageDetails){

    const Container = card.get()
    const SelectedYear = new Date().getFullYear().toString() // FIXME: this needs attention;
    const PreviousSelectedYear = Number(SelectedYear) - 1
    const FiscalYearValue = Action_Store.get('Fiscal Years').find(year => year.Title === SelectedYear)
    const PreviousFiscalYearValue = Action_Store.get('Fiscal Years').find(year => year.Title === PreviousSelectedYear.toString())
    const StartYearValue = new Date(FiscalYearValue.EventDate).getFullYear()
    const EndYearValue = new Date(FiscalYearValue.EndDate).getFullYear()
    const CurrentYear = new Date().getFullYear()

    const SiteCollectionUrl = `${location.origin}/sites/j5/QPP`
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
    
    const ButtonContainer = document.createElement('div')
    ButtonContainer.classList = 'mt-2 col-12 text-right'
    /** TODO: Double check the results for the selected year are empty before allowing an import;
     * The button is currently disabled, removing the property will allow the method to run;
     * Currently the button only uses the GET request (which should be a POST request when the todo is complete)
     * and console logs each request item along with the year value and id for the set FY. Then the selected stepper
     * is toggled when complete to update the lists.
     * @author Wilfredo Pacheco 20210825
     */
    ButtonContainer.innerHTML = /*html*/`<button type="button" class="btn btn-secondary import d-none">Import Data for Fiscal Year: ${
        new Date(PreviousFiscalYearValue.EventDate).getFullYear()
    }-${
        new Date(PreviousFiscalYearValue.EndDate).getFullYear()
    }</button>`

    const QuarterlyResults = await Route.Get(`${SiteCollectionUrl}/_api/Web/Lists/getByTitle('FacilityRDSQuarterly')/Items`,{
        $select: 'Id',
        $filter: `DMISID eq ${facility.Id} and FiscalYear eq ${FiscalYearValue.Id}`
    }).then(data => data.d.results)

    const SummaryResults = await Route.Get(`${SiteCollectionUrl}/_api/Web/Lists/getByTitle('FacilityRDSSummary')/Items`,{
        $select: 'Id',
        $filter: `DMISID eq ${facility.Id} and FiscalYear eq ${FiscalYearValue.Id}`
    }).then(data => data.d.results)

    // console.info(QuarterlyResults)
    // console.info(SummaryResults)

    async function ImportAction(event){

        const ButtonEl = event.target.tagName === 'BUTTON' ? 
        event.target :
        event.target.closest('button')

        $(ButtonEl).attr('disabled', '')
        .html(/*html*/`<!-- Spinner Element -->
        <div class="spinner-border spinner-grow-sm text-light" role="status">
            <span class="visually-hidden"></span>
        </div> Loading Data...`)

        const ConfirmationMessage = `Are you sure you want to create data for FY ${
            new Date(FiscalYearValue.EventDate).getFullYear()
        }-${
            new Date(FiscalYearValue.EndDate).getFullYear()
        } from FY ${
            new Date(PreviousFiscalYearValue.EventDate).getFullYear()
        }-${
            new Date(PreviousFiscalYearValue.EndDate).getFullYear()
        }?`

        // Track item count;
        var count = 0;
        var TotalCount = 0;
        function DisplayCount(){
            $(ButtonEl).text(`${count} of ${TotalCount}`)
        }

        if ( confirm(ConfirmationMessage) ){
            
            const ReqDigest = await Route.GetRequestDigest()
            const PrevQuarterlyResults = await Route.Get(`${SiteCollectionUrl}/_api/Web/Lists/getByTitle('FacilityRDSQuarterly')/Items`,{
                $select: '*',
                $filter: `DMISID eq ${facility.Id} and FiscalYear eq ${PreviousFiscalYearValue.Id}`
            }).then(data => data.d.results)
    
            const PrevSummaryResults = await Route.Get(`${SiteCollectionUrl}/_api/Web/Lists/getByTitle('FacilityRDSSummary')/Items`,{
                $select: '*',
                $filter: `DMISID eq ${facility.Id} and FiscalYear eq ${PreviousFiscalYearValue.Id}`
            }).then(data => data.d.results)

            TotalCount = PrevQuarterlyResults.length + PrevSummaryResults.length
            
            for ( const item of PrevQuarterlyResults ){

                const {
                    DHAPredictedQuarterlyFTEs,
                    DMISIDId,
                    FiscalYearId,
                    MEPRSCode,
                    MEPRSDescription,
                    MTFExplanation,
                    MTFPredictedFTEs,
                    MTFPredictedPercentage,
                    Subtotal,
                    Title,
                    __metadata
                } = item;

                const request = new Object({
                    DHAPredictedQuarterlyFTEs: DHAPredictedQuarterlyFTEs,
                    DMISIDId: DMISIDId,
                    FiscalYearId: FiscalYearValue.Id,
                    MEPRSCode: MEPRSCode,
                    MEPRSDescription: MEPRSDescription,
                    MTFExplanation: MTFExplanation,
                    MTFPredictedFTEs: MTFPredictedFTEs,
                    MTFPredictedPercentage: MTFPredictedPercentage,
                    Subtotal: Subtotal,
                    Title: Title,
                    __metadata: {
                        type: __metadata.type
                    }
                })

                await Route.Get(`${SiteCollectionUrl}/_api/Web/Lists/getByTitle('FacilityRDSQuarterly')/Items`, request, ReqDigest)
                .then(data => console.info(request, `FY ID: ${FiscalYearValue.Id} - FY Value: ${new Date(FiscalYearValue.EndDate).getFullYear()}`))

                count++
                DisplayCount()
            }

            for ( const item of PrevSummaryResults ){

                const {
                    DHAPredictedQuarterlyFTEs,
                    DMISIDId,
                    DeployReadinessActivities,
                    FiscalYearId,
                    MEPRSCode,
                    MEPRSDescription,
                    PercentageDHAPredictedFTEs,
                    ServiceReadinessActivities,
                    Title,
                    TotalAvailableNonAvailableFTEs,
                    TotalFAdjustedFTEs,
                    TotalLeaveFTEs,
                    TotalNonAvailableFTEs,
                    TotalOtherFTEs,
                    TotalSickFTEs,
                    __metadata
                } = item;

                const request = new Object({
                    DHAPredictedQuarterlyFTEs: DHAPredictedQuarterlyFTEs,
                    DMISIDId: DMISIDId,
                    DeployReadinessActivities: DeployReadinessActivities,
                    FiscalYearId: FiscalYearValue.Id,
                    MEPRSCode: MEPRSCode,
                    MEPRSDescription: MEPRSDescription,
                    PercentageDHAPredictedFTEs: PercentageDHAPredictedFTEs,
                    ServiceReadinessActivities: ServiceReadinessActivities,
                    Title: Title,
                    TotalAvailableNonAvailableFTEs: TotalAvailableNonAvailableFTEs,
                    TotalFAdjustedFTEs: TotalFAdjustedFTEs,
                    TotalLeaveFTEs: TotalLeaveFTEs,
                    TotalNonAvailableFTEs: TotalNonAvailableFTEs,
                    TotalOtherFTEs: TotalOtherFTEs,
                    TotalSickFTEs: TotalSickFTEs,
                    __metadata: {
                        type: __metadata.type
                    }
                })

                await Route.Get(`${SiteCollectionUrl}/_api/Web/Lists/getByTitle('FacilityRDSSummary')/Items`, request, ReqDigest)
                .then(data => console.info(request, `FY ID: ${FiscalYearValue.Id} - FY Value: ${new Date(FiscalYearValue.EndDate).getFullYear()}`))
                count++
                DisplayCount()
            }
        }

        $(ButtonEl).text('Complete!')
        document.querySelector('span.section-name-text.selected').parentNode.click()
    }

    // console.info( !QuarterlyResults.length && !SummaryResults.length && EndYearValue >= CurrentYear )
    if ( !QuarterlyResults.length && !SummaryResults.length && EndYearValue >= CurrentYear ){
        ButtonContainer.querySelector('button.import').addEventListener('click', ImportAction)
        Container.append(ButtonContainer)
    }
}

export default async function ViewPart_Readiness(param) {
    const {
        facility,
        facilities,
        parent
    } = param;

    /** RDS Card */
    const card = Component_Card({
        title: 'MTF Readiness Demand Signal',
        description: /*html*/ `
            <p>The DHA QPP Readiness Demand Signal (RDS) tracks all Active Duty, Reservists, and Guard personnel when they contribute to the Healthcare mission of the fixed MTFs/DTFs which in turn, provides these personnel the opportunity to sustain and enhance their <strong>Medical Readiness and Deployability</strong>. This also informs DHA of available AD FTEs for clinical care.</p>
        `,
        titleColor: Setting_App.primaryColor,
        padding: '20px',
        // magrin: '0px 20px', /** Changed margin to 20px to adjust for missing padding when showing the table @author Wilfredo Pacheco - 20210806 */
        width: '100%',
        parent
    });

    card.add();

    if (facilities) {
        facilities.forEach(facility => {
            /** Add Heading */
            const heading = Component_Heading({
                text: facility.QPP_DropDown,
                size: '1.7em',
                // color: 'mediumslateblue',
                width: '100%',
                margin: '30px 0px 0px 0px',
                // padding: '0px 50px',
                parent
            });
    
            heading.add();

            addViewParts(facility);
        }); 
    } else if (facility) {
        addViewParts(facility);
        CreateDataImportOption(card, facility, document.FacilityValue) // Will be used to import data to future Fiscal Years;
    }

    function addViewParts(facility) {
        /** RDS Summary Table */
        ViewPart_RDSSummaryTable({
            facility,
            parent
        });

        /** RDS Summary Table */
        ViewPart_RDSQuarterlyTable({
            facility,
            parent
        });
    }

}
