import Action_Get from '../Actions/Action_Get.js'

/** HDS Enrollee Form @author Wilfredo Pacheco 20210810 */

/** Note: adding a status column in the ReclamaData property may help keeping track of the approved items
 * as well as the users that submited them. One may argue why we don't just create these items on the list,
 * that can be decided at a later date; @author Wilfredo Pacheco 20210823
*/

/** FIXME: [BUT FINISH THE 3 YEAR CYCLE VIEW FIRST]
 * 
 * [ ] - This form needs to be updated to handle the list items defined for the list as well as making a call to
 * render in the display table for the user; 
 * 
 * [ ] -  The same thing needs to be done to the workload table; The good news is if the logic for enrollment is complete 
 * then the logic for workload should go much smoother;
 * 
 * [ ] - The questions at the end of the form also need to be added to each individual entry;
 * 
 * @author Wilfredo Pacheco 20210826
 */

const ListTitle = 'FacilityHSDEnrollmentReclama'
const SiteCollectionUrl = `${location.origin}/sites/j5/QPP`
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

async function SubmitRequest(event){

    /** Prevent default value from submit button if type === submit */
    event.preventDefault();
    event.stopPropagation();

    const BtnEl = event.target
    const Form = BtnEl.getForm()
    const Url = BtnEl.getAttribute('src')
    const Callback = BtnEl.Callback
    const RequestType = BtnEl.getAttribute('data-request-type')
    const ItemData = BtnEl.getData ? BtnEl.getData() : null;
    const List = BtnEl.List
    const Route = BtnEl.Route
    const SendRequest = RequestType === 'POST' ? Route.Post : Route.Patch
    const request = {
        __metadata: { type: List.ListItemEntityTypeFullName },
        DMISIDId: document.FacilitySelected.Id,
        FiscalYearId: document.FiscalYearValue.Id
    }

    /** Form Validation; */
    if ( Form.checkValidity() === false ){
        Form.classList.add('was-validated')
        return null;
    }

    // Disable button until the request is complete;
    $(BtnEl).attr('disabled', '')
    .html(/*html*/`<!-- Spinner Element -->
    <div class="spinner-border spinner-grow-sm text-light" role="status">
        <span class="visually-hidden"></span>
    </div> Sending Request...`)

    const ReqDigest = await Route.GetRequestDigest();

    Array.from(Form).forEach(el => {
        const Name = el.getAttribute('name')
        const isTypeDate = el.getAttribute('type') === 'date' // Identify Date Fields;
        if ( !!Name ){
            request[Name] = el.value
            if ( isTypeDate && !!el.value ){
                request[Name] = new Date(el.value).toISOString()
            }
        }
    })

    await SendRequest(Url, request, ReqDigest).done((data, textStatus, xhr) => {
        if ( xhr.status >= 200 && xhr.status < 300 ){
            if ( Callback ){
                Callback()
            }
            document.querySelector('span.section-name-text.selected').parentNode.click()
        }
    }).catch(response => {
        $(BtnEl).text(response.statusText)
        return alert(response.responseJSON.error.message.value)
    })

    // Note: This might still be the format we use, the list still needs to updated to handle the data;
    // console.info({
    //     DMISID: null,
    //     FiscalYear: null,

    //     // Questions Highlighted in REQ ID_R030_reclama document;
    //     PotentialChanges: null, // Required, also needs to be added to the List;
    //     ReclamaData: JSON.stringify([
    //         // NOTE: Example of what the data should look like multiple line of text field;
    //         {
    //             DMIS: null,
    //             IncreaseDecrease: null,
    //             Capacity: null,
    //             AD: null,
    //             Gender: null,
    //             PrimaryReason: null,
    //             NetworkStaffing: null,
    //             SPIDRID: null,
    //             MIL_FTE: null,
    //             CIV_FTE: null,
    //             CNTR_FTE: null,
    //             // NOTE: Should be more but the REQ ID_R030_reclama questions document limits the view;
    //         }
    //     ]),
    //     __metadata: {
    //         type: List.ListItemEntityTypeFullName
    //     }
    // })
}

export default async function ShowForm(param){

    const { modal, parent, table, event, Item } = param;
    const List = window.List = await Route.Get(ListUrl, {
        $select: 'Fields,ItemCount,ListItemEntityTypeFullName',
        $expand: 'Fields'
    }).then(data => data.d)

    /** Define the different parts of the modal; */
    const modalBody = parent;
    const modalHeader = modal.find('div.modal-header')
    const modalFooter = modal.find('div.modal-footer')
    const RequestType = event.currentTarget ? event.currentTarget.getAttribute('data-request-type') : event.target.getAttribute('data-request-type')
    const CreateBtn = modalFooter.querySelector('button[data-value="Create"]') || modalFooter.querySelector('button[data-value="Submit"]')
    const TableData = Array.from(table.DataTable().data())
    const ModalDialog = modal.get().querySelector('.modal-dialog')

    ModalDialog.classList.add('modal-xl')
    CreateBtn.innerText = 'Submit'
    modalHeader.innerHTML = /*html*/`<!-- Modal Header -->
    <h5>Health Services Delivery Enrollee Modal - Reclama</h5>`

    const FormContainer = document.createElement('div') /** Create Form & Elements  */
    FormContainer.innerHTML = /*html*/`
    <div class="text-right">
        <button type="button" 
                class="btn btn-light btn-sm" 
                id="show-form" 
                data-toggle="collapse" 
                data-target="#add-reclama" 
                aria-expanded="false" 
                aria-controls="add-reclama"
        >Add New</button>
        <button class="btn btn-light btn-sm d-none" id="clear-reclama">Clear Form</button>
    </div>

    <form id="add-reclama" class="collapse">

        <div class="row" id="section-one">
            <!-- Adjustment Question -->
            <div class="col-xl-4 col-lg-12 mt-2" id="inputAdjustment-container">
                <label for="inputAdjustment" class="form-label">Is this adjustment an increase or decrease?</label>
                <select id="inputAdjustment" name="Adjustment" class="form-control form-control-sm" required>
                    <option value="">Choose...</option>
                    <option value="Increase">Increase</option>
                    <option value="Decrease">Decrease</option>
                </select>
            </div>

            <!-- ChangeRequest Question -->
            <div class="col-xl-5 col-lg-12 mt-2" id="inputChangeRequest-container">
                <label for="inputChangeRequest" class="form-label"
                >Is your reclama for a capability change request (ie: adding or eliminating a service) or a capacity change?</label>
                <select id="inputChangeRequest" name="ChangeRequest" class="form-control form-control-sm" required>
                    <option value="">Choose...</option>
                    <option value="Capability">Capability</option>
                    <option value="Capacity">Capacity</option>
                </select>
            </div>
        </div>

        <div class="row">
            <!-- DMIS Question -->
            <div class="col-xl-4 col-lg-12 mt-2" id="inputDMIS-container">
                <label for="inputDMIS" class="form-label">DMIS:</label>
                <select id="inputDMIS" name="DMIS" class="form-control form-control-sm" required>
                    <option value="">Choose...</option>
                </select>
            </div>

            <!-- DutyStatus Question -->
            <div class="col-xl-3 col-lg-12 mt-2" id="inputDutyStatus-container">
                <label for="inputDutyStatus" class="form-label">Active Duty or Non Active Duty:</label>
                <select id="inputDutyStatus" name="DutyStatus" class="form-control form-control-sm" required>
                    <option value="">Choose...</option>
                    <option value="Active Duty">Active Duty</option>
                    <option value="Non-Active Duty">Non-Active Duty</option>
                </select>
            </div>

            <!-- Gender Question -->
            <div class="col-xl-3 col-lg-12 mt-2" id="inputGender-container">
                <label for="inputGender" class="form-label">Gender:</label>
                <select id="inputGender" name="Gender" class="form-control form-control-sm" required>
                    <option value="">Choose...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
        </div>
        
        <div class="row" id="section-two">

            <!-- Reason Question -->
            <div class="col-xl-4 col-lg-12 mt-2" id="inputReason-container">
                <label for="inputReason" class="form-label">Primary Reason For Adjustment:</label>
                <select id="inputReason" name="Reason" class="form-control form-control-sm" required>
                    <option value="">Choose...</option>
                    <option data-content="Increase" value="ERSA">ERSA</option>
                    <option data-content="Increase" value="Facility Update">Facility Update</option>
                    <option data-content="Increase" value="Market Initiative">Market Initiative</option>
                    <option data-content="Increase" value="MILPER Primary Care Manager Staff Increase">MILPER Primary Care Manager Staff Increase</option>
                    <option data-content="Increase" value="Other">Other (specify in comments)</option>
                    <option data-content="Decrease" value="CivCont Primary Care Manager Reduction">CivCont Primary Care Manager Reduction</option>
                    <option data-content="Decrease" value="Compliance with DHA Policy">Compliance with DHA Policy</option>
                    <option data-content="Decrease" value="Facility Changes">Facility Changes (e.f. renovation)</option>
                    <option data-content="Decrease" value="MILPER Primary Care Manager Staff Reduction">MILPER Primary Care Manager Staff Reduction</option>
                    <option data-content="Decrease" value="Mission Change">Mission Change</option>
                </select>
            </div>

            <!-- NetworkStaffingRequest Question -->
            <div class="col-xl-4 col-lg-12 mt-2" id="inputNetworkStaffingRequest-container">
                <label for="inputNetworkStaffingRequest" class="form-label">Network Staffing Request:</label>
                <select id="inputNetworkStaffingRequest" name="NetworkStaffingRequest" class="form-control form-control-sm" required>
                    <option value="">Choose...</option>
                    <option value="Network">Network</option>
                    <option value="Staffing">Staffing</option>
                    <option value="N/A">N/A</option>
                </select>
            </div>

            <!-- SPIDRID -->
            <div class="col-xl-4 col-lg-12 mt-2" id="inputSPIDRID-container">
                <label for="inputSPIDRID" class="form-label">SPIDR ID:</label>
                <input id="inputSPIDRID" type="text" name="SPIDRID" class="form-control form-control-sm" placeholder="QPP-XXX">
            </div>

            <!-- FTE Values -->
            <div class="col-xl-2 col-lg-12 mt-2" id="inputMIL-container">
                <label for="inputMIL" class="form-label">MIL FTE</label>
                <input id="inputMIL" type="number" name="MILFTE" class="form-control form-control-sm">
            </div>

            <div class="col-xl-2 col-lg-12 mt-2" id="inputCIV-container">
                <label for="inputCIV" class="form-label">CIV FTE</label>
                <input id="inputCIV" type="number" name="CIVFTE" class="form-control form-control-sm">
            </div>

            <div class="col-xl-2 col-lg-12 mt-2" id="inputCNTR-container">
                <label for="inputCNTR" class="form-label">CNTR FTE</label>
                <input id="inputCNTR" type="number" name="CNTRFTE" class="form-control form-control-sm">
            </div>

            <div class="col-12 mt-3" id="display-forecast"></div>

            <!-- Age Group Options -->
            <div class="col-xl-2 col-lg-12 mt-2" id="inputAgeGroup1-container">
                <label for="inputAgeGroup1" class="form-label">Age 0-4:</label>
                <input id="inputAgeGroup1" type="number" name="AgeGroup1" class="form-control form-control-sm">
            </div>

            <div class="col-xl-2 col-lg-12 mt-2" id="inputAgeGroup2-container">
                <label for="inputAgeGroup2" class="form-label">Age 5-17:</label>
                <input id="inputAgeGroup2" type="number" name="AgeGroup2" class="form-control form-control-sm">
            </div>

            <div class="col-xl-2 col-lg-12 mt-2" id="inputAgeGroup3-container">
                <label for="inputAgeGroup3" class="form-label">Age 18-24:</label>
                <input id="inputAgeGroup3" type="number" name="AgeGroup3" class="form-control form-control-sm">
            </div>

            <div class="col-xl-2 col-lg-12 mt-2" id="inputAgeGroup4-container">
                <label for="inputAgeGroup4" class="form-label">Age 25-34:</label>
                <input id="inputAgeGroup4" type="number" name="AgeGroup4" class="form-control form-control-sm">
            </div>

            <div class="col-xl-2 col-lg-12 mt-2" id="inputAgeGroup5-container">
                <label for="inputAgeGroup5" class="form-label">Age 35-44:</label>
                <input id="inputAgeGroup5" type="number" name="AgeGroup5" class="form-control form-control-sm">
            </div>

            <div class="col-xl-2 col-lg-12 mt-2" id="inputAgeGroup6-container">
                <label for="inputAgeGroup6" class="form-label">Age 45-64:</label>
                <input id="inputAgeGroup6" type="number" name="AgeGroup6" class="form-control form-control-sm">
            </div>

            <div class="col-xl-2 col-lg-12 mt-2" id="inputAgeGroup7-container">
                <label for="inputAgeGroup7" class="form-label">Age 65+:</label>
                <input id="inputAgeGroup7" type="number" name="AgeGroup7" class="form-control form-control-sm">
            </div>
            
            <!-- Start Date -->
            <div class="col-xl-4 col-lg-12 mt-2" id="inputStartDate-container">
                <label for="inputStartDate" class="form-label">Approximate Start Date:</label>
                <input id="inputStartDate" type="date" name="StartDate" class="form-control form-control-sm" required>
            </div>

            <!-- End Date -->
            <div class="col-xl-4 col-lg-12 mt-2" id="inputEndDate-container">
                <label for="inputEndDate" class="form-label">Approximate End Date:</label>
                <input id="inputEndDate" type="date" name="EndDate" class="form-control form-control-sm" required>
            </div>

            <!-- Comment Textarea -->
            <div class="col-12 mt-2" id="inputComment-container">
                <label for="inputComment" class="form-label">Comment:</label>
                <textarea class="form-control form-control-sm" id="inputComment" name="Comment" rows="3"></textarea>
            </div>

            <div class="col-12 text-right mt-3">
                <button type="button" id="submit-reclama" class="btn btn-success btn-sm">Add Reclama</button>
            </div>
        </div>
    </form>

    <div id="display">No items to display, please add a reclama.</div>

    <hr>
    <form id="reclama"> 

        <textarea name="ReclamaData" id="inputReclamaData" class="w-100" hidden></textarea>
        <input type="text" class="col-4" hidden>
        <div id="final-questions" class="row p-3 mt-4">
            <div class="form-group col-xl-8 col-lg-12">
                <label for="Q1"
                >Will this proposed action potentially result in changes to a military medical personnel's ability to achieve their KSA Readiness speciality threshold?</label>
                <select name="PotentialReadinessChanges" class="form-control form-control-sm" id="Q1" required>
                    <option value="">Please Select...</option>
                    <option value="Yes,Increase">Yes, potential increases in achieving KSA Readiness speciality thresholds are possible with this proposal</option>
                    <option value="Yes,Decrease">Yes, potential decreases in achieving KSA Readiness speciality thresholds are possible with this proposal</option>
                    <option value="No">No, anticipated KSA Readiness speciality thresholds are possible with this proposal</option>
                </select>
            </div>
            <!-- If NO is selected the submit option appears and ends the logic sequence -->

            <!-- If YES is selected from Q1 -->
            <div class="form-group col-xl-6 col-lg-12" id="Q2-container">
                <label for="Q2"
                >Has an initiative been created, or will one be, <br>to address the potential impacts of this action?</label>
                <select name="CreatedInitiative" class="form-control form-control-sm" id="Q2">
                    <option value="">Please Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>

            <!-- If YES is selected the folowing needs to be added to the screen -->
            <div class="form-group col-xl-6 col-lg-12" id="Q3-container">
                <div for="Q3" >If an initiative has already been created, please provide initiative name and SPIDR #:</div>
                <input type="text" id="Q3" class="form-control form-control-sm mb-1" placeholder="SPIDR #" name="SPIDRID">
                <input type="text" id="Q4" class="form-control form-control-sm" placeholder="Initiative Name" name="InitiativeName">
            </div>
        </div>
    </form>
    <div class="text-right">
        <button type="button" id="continue" class="btn btn-success btn-sm">Continue</button>
    </div>`

    /** Containers for form elements;  */
    const AddReclamaForm = FormContainer.querySelector('form#add-reclama')
    const FinalQuestions = AddReclamaForm.querySelector('div#final-questions')
    const SectionTwo = FormContainer.querySelector('div#section-two')
    const ShowFormBtn = FormContainer.querySelector('button#show-form')
    const ClearButton = FormContainer.querySelector('button#clear-reclama')
    const SubmitReclamaBtn = AddReclamaForm.querySelector('button#submit-reclama')
    const ReclamaForm = FormContainer.querySelector('form#reclama')
    const ReclamaDisplayEl = FormContainer.querySelector('div#display')
    const ForecastDisplayEl = FormContainer.querySelector('div#display-forecast')
    const ContinueBtn = FormContainer.querySelector('button#continue')
    const TextAreaEl = ReclamaForm.querySelector('textarea#inputReclamaData')
    const SubmitFormEl = CreateBtn

    /** Select Elements */
    const inputAdjustment = AddReclamaForm.querySelector('div#inputAdjustment-container') // Increase/Decrease
    const inputChangeRequest = AddReclamaForm.querySelector('div#inputChangeRequest-container') // Adding/Eliminating Service, Capacity Change
    const inputDMIS = AddReclamaForm.querySelector('div#inputDMIS-container') // DMIS;
    const inputDutyStatus = AddReclamaForm.querySelector('div#inputDutyStatus-container') // Active/Non Active Duty
    const inputGender = AddReclamaForm.querySelector('div#inputGender-container') // Gender
    const inputReason = AddReclamaForm.querySelector('div#inputReason-container') // Reason
    const inputNetworkStaffingRequest = AddReclamaForm.querySelector('div#inputNetworkStaffingRequest-container') // Network Staffing Request
    const inputSPIDRID = AddReclamaForm.querySelector('div#inputSPIDRID-container') //inputSPIDRID
    const StartDate = AddReclamaForm.querySelector('div#inputStartDate-container')
    const EndDate = AddReclamaForm.querySelector('div#inputEndDate-container')
    const CommentEl = AddReclamaForm.querySelector('div#inputComment-container')
        
    function Store(El, FormEl){
            
        var Store = new Array()
        var DisplayEl;
        var Form;

        const Get = function Get(){ return Store }
        const Clear = function Clear(){ Store = new Array() }
        const Add = function Add(item){
            Store.push(item)
            Display()
        }

        const Update = function Update(tr){

            $(tr).fadeOut()

            const item = tr.DataSet
            const ItemIndex = tr.DataIndex
            Array.from(Form).forEach(el => {
                const Name = el.getAttribute('name')
                const isTypeDate = el.getAttribute('type') === 'date' // Identify Date Fields;
                if ( !!Name ){
                    el.value = item[Name]
                    if ( isTypeDate ){
                        const selectedDate = new Date(item[Name]).toISOString().split('T')[0]
                        el.value = selectedDate
                    }
                }
            })

            if ( Form.ShowForm ){ Form.ShowForm() }
            Store.splice(ItemIndex, 1)

            /** Handles business rules for increase and decrease options; */
            inputAdjustment.querySelector('select').dispatchEvent(new Event('change'))
        }

        // TODO: A better way to do this should be used;
        const Remove = function Remove(item){
            const message = 'Would you like to remove this item from the form?'
            if ( confirm(message) ){
                const ItemIndex = Store.findIndex(storedItem => JSON.stringify(storedItem) === JSON.stringify(item))
                Store.splice(ItemIndex, 1)
                Display()
            }
        }

        const Display = function Display(){
            
            if ( DisplayEl ){

                $(DisplayEl).empty()

                DisplayEl.innerHTML = /*html*/`
                <table class="table table-hover table-sm mt-3 text-center" style="font-size: 12px;">
                    <thead>
                        <tr>
                            <th>DMIS</th>
                            <th>Adjustment</th>
                            <th>ChangeRequest</th>
                            <th>Gender</th>
                            <th>Duty Status</th>
                            <th>Reason</th>
                            <th>Age 0-4</th>
                            <th>Age 15-17</th>
                            <th>Age 18-24</th>
                            <th>Age 25-34</th>
                            <th>Age 35-44</th>
                            <th>Age 45-64</th>
                            <th>Age 65+</th>
                            <th class="col-2"></th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>`

                const TableBody = DisplayEl.querySelector('table tbody')

                Store.forEach((item, index) => {

                    const tr = document.createElement('tr')

                    const { DMIS, Adjustment, ChangeRequest, Gender, DutyStatus, Reason,
                        AgeGroup1, AgeGroup2, AgeGroup3, AgeGroup4, AgeGroup5, AgeGroup6, AgeGroup7 } = item;

                    tr.innerHTML = /*html*/`
                    <td>${DMIS}</td>
                    <td>${Adjustment}</td>
                    <td>${ChangeRequest}</td>
                    <td>${Gender}</td>
                    <td>${DutyStatus}</td>
                    <td>${Reason}</td>
                    <td>${AgeGroup1 || 0}</td>
                    <td>${AgeGroup2 || 0}</td>
                    <td>${AgeGroup3 || 0}</td>
                    <td>${AgeGroup4 || 0}</td>
                    <td>${AgeGroup5 || 0}</td>
                    <td>${AgeGroup6 || 0}</td>
                    <td>${AgeGroup7 || 0}</td>
                    <td class="text-right">
                        <div>
                            <button class="btn btn-primary btn-sm edit">Edit</button>
                            <button class="btn btn-danger btn-sm remove">Remove</button>
                        </div>
                    </td>`

                    tr.DataSet = item;
                    tr.DataIndex = index;
                    tr.querySelector('button.edit').addEventListener('click', function(event){
                        Update(tr)
                        $(SectionTwo).fadeIn()
                    })
                    tr.querySelector('button.remove').addEventListener('click', function(event){ Remove(tr.DataSet) })
                    TableBody.append(tr)
                })
            }
            else { return console.warn('DisplayEl Not defined!!') }

            TextAreaEl.value = JSON.stringify(Store)
            if ( Store.length ){ ContinueBtn.removeAttribute('disabled') }
            else {
                ContinueBtn.setAttribute('disabled', '')
                $(ReclamaForm).hide()
                $(SubmitFormEl).hide()
            }
        }

        const SetDisplay = function SetDisplay(displayEl){ DisplayEl = displayEl }
        const SetForm = function SetForm(formEl){ Form = formEl }

        if ( El ){ SetDisplay(El) }
        if ( FormEl ){ SetForm(FormEl) }

        this.Get = Get
        this.Clear = Clear
        this.Add = Add
        this.Update = Update
        this.Remove = Remove
        this.Display = Display
        this.SetDisplay = SetDisplay
        this.DisplayEl = DisplayEl
    }

    /** This will handle the data for the changes made by the user; */
    const FormStore = ReclamaForm.Store = new Store(ReclamaDisplayEl, AddReclamaForm)
    AddReclamaForm.ShowForm = function(){ ShowFormBtn.click() }

    // Focus on the first field in the form;
    ShowFormBtn.addEventListener('click', function(event){
        setTimeout(function(){
            if ( AddReclamaForm.classList.contains('show') ){  Array.from(AddReclamaForm)[0].focus() }
        },600)
    })

    // Clear the form;
    ClearButton.addEventListener('click', function(event){ AddReclamaForm.reset() })

    // Hide Section two;
    $(SectionTwo).hide()
    $(ReclamaForm).hide()
    $(SubmitFormEl).hide()
    $(ContinueBtn).attr('disabled', '')

    function checkRequiredFields(){
        // Checks if the selects are valid before the rest of the form is displayed;
        const FormFields = [
            inputAdjustment.querySelector('select'),
            inputChangeRequest.querySelector('select'),
            inputDMIS.querySelector('select'),
            inputDutyStatus.querySelector('select'),
            inputGender.querySelector('select')
        ]
        
        const result = FormFields.map(select => !!select.value).filter(valid => valid)
        return result.length === FormFields.length
    }
    
    function DisplayAgeGroups(filteredData){

        $(ForecastDisplayEl).empty()

        var ForecastString = '<b>Forecast Data: </b>'
        filteredData.forEach(item => {
            const { Forecast, AgeGroup }= item;
            ForecastString += `<span class="badge badge-pill badge-primary mx-1">Age ${AgeGroup}: ${Forecast}</span>`
        })

        ForecastDisplayEl.innerHTML = `<div>${ForecastString}</div>`
    }

    function ShowHiddenFields(){
        if ( checkRequiredFields() ){
            const CurrentDutyStatusValue = inputDutyStatus.querySelector('select').value
            const CurrentGenderValue = inputGender.querySelector('select').value
            const TableDataResult = TableData.filter(item => item.ADStatus === CurrentDutyStatusValue).filter(item => item.Gender === CurrentGenderValue)
            $(ForecastDisplayEl).empty()
            DisplayAgeGroups(TableDataResult)
            $(SectionTwo).fadeIn()
        }
    }

    function AdjustmentChangeAction(event){

        const UserSelected = this.value // Holds the value of the select element the user selected;
        const INCREASE = 'Increase'
        const DECREASE = 'Decrease'
        const ReasonForAdjustSelectEl = inputReason.querySelector('select') // Identify the select element to send the options;
        const NetworkStaffingRequestSelectEl = inputNetworkStaffingRequest.querySelector('select')
        const SPIDEREl = inputSPIDRID.querySelector('input')
        const CurrentValue = ReasonForAdjustSelectEl.value
        
        /** If this value changes then the reason for adjust must be reset; */
        ReasonForAdjustSelectEl.value = !event.isTrusted ? 
        CurrentValue : 
        ''
    
        if ( UserSelected === INCREASE ){
            
            /** Clear the values just in case the users data; */
            SPIDEREl.value = ''
            NetworkStaffingRequestSelectEl.value = ''
    
            /** Remove required property to prevent form from locking up; */
            NetworkStaffingRequestSelectEl.removeAttribute('required')
            SPIDEREl.removeAttribute('required')
    
            /** Toggle disabled property; */
            NetworkStaffingRequestSelectEl.setAttribute('disabled', '')
            SPIDEREl.setAttribute('disabled', '')            
        }
    
        if ( UserSelected === DECREASE ){
            
            NetworkStaffingRequestSelectEl.removeAttribute('disabled')
            SPIDEREl.removeAttribute('disabled')
            NetworkStaffingRequestSelectEl.setAttribute('required', '')
            SPIDEREl.setAttribute('required', '')
        }
    
        /** Select all the Select Element options; */
        Array.from(ReasonForAdjustSelectEl.querySelectorAll('option')).map(el => {
            const DataContent = el.getAttribute('data-content')
            /** If the Element data-content value matches the UserSelected value or the Element value is set to an empty string => show; */
            if ( DataContent && DataContent === UserSelected || el.value === '' ){
                $(el).show()
            }
            else { $(el).hide() }
        })
    
        ShowHiddenFields()
    }

    /** Event Listeners */
    inputAdjustment.querySelector('select').addEventListener('change', AdjustmentChangeAction)
    inputChangeRequest.querySelector('select').addEventListener('change', ShowHiddenFields)
    inputDMIS.querySelector('select').addEventListener('change', ShowHiddenFields)
    inputDutyStatus.querySelector('select').addEventListener('change', ShowHiddenFields)
    inputGender.querySelector('select').addEventListener('change', ShowHiddenFields)

    /** Dynamically load DMIS options; */
    Action_Get({ list: 'DMIS', select: '*' })
    .then(data => {
        data.forEach(option => {
            const { Title } = option;
            const OptionEl = document.createElement('option')
            OptionEl.value = Title
            OptionEl.innerText = Title
            if ( document.FacilitySelected.QPP_DropDown.includes(Title) ){ OptionEl.setAttribute('selected', '') }
            inputDMIS.querySelector('select').append(OptionEl)
        })
    })

    function SaveReclama(event){

        /** Prevent default value from submit button if type === submit */
        event.preventDefault();
        event.stopPropagation();

        const BtnEl = event.target
        const Form = BtnEl.getForm()
        const Reclama = new Object()

        /** Form Validation; */
        if ( Form.checkValidity() === false ){
            Form.classList.add('was-validated')
            return null;
        }

        Array.from(Form).forEach(el => {
            const Name = el.getAttribute('name')
            const isTypeDate = el.getAttribute('type') === 'date' // Identify Date Fields;
            if ( !!Name ){ Reclama[Name] = el.value
                if ( isTypeDate && !!el.value ){
                    Reclama[Name] = new Date(el.value).toISOString()
                }
            }
        })

        FormStore.Add(Reclama)
        ShowFormBtn.click()
        $(SectionTwo).hide()
        Form.classList.remove('was-validated')
        Form.reset()
    }

    const FirstQuestion = ReclamaForm.querySelector('select#Q1')
    const SecondQuestion = ReclamaForm.querySelector('div#Q2-container')
    const ThirdQuestion = ReclamaForm.querySelector('div#Q3-container')

    $(SecondQuestion).hide()
    $(ThirdQuestion).hide()

    FirstQuestion.addEventListener('change', function(event){

        const Q2SelectEl = SecondQuestion.querySelector('select')
        
        if ( this.value === 'No' || this.value === '' ){
            $(SecondQuestion).hide()
            $(ThirdQuestion).hide()
            Q2SelectEl.value = ''
            Q2SelectEl.removeAttribute('required')
            Array.from(ThirdQuestion.querySelectorAll('input')).forEach(el => el.value = '')
        }
        else {
            $(SecondQuestion).fadeIn()
            $(ThirdQuestion).fadeIn()
            Q2SelectEl.setAttribute('required', '')
        }
    })

    function ShowFinalQuestions(event){

        /** Prevent default value from submit button if type === submit */
        event.preventDefault();
        event.stopPropagation();

        $(ReclamaForm).fadeIn()
        $(this).attr('disabled', '')
        $(SubmitFormEl).fadeIn()
    }

    SubmitReclamaBtn.addEventListener('click', SaveReclama)
    SubmitReclamaBtn.getForm = () => AddReclamaForm
    ContinueBtn.addEventListener('click', ShowFinalQuestions)
    SubmitFormEl.setAttribute('data-request-type', RequestType)
    SubmitFormEl.setAttribute('src', `${List.__metadata.uri}/Items`) 

    function EditReclamaRequest(Form, item){
        Array.from(Form).forEach(el => {
            const Name = el.getAttribute('name')
            const isTypeDate = el.getAttribute('type') === 'date' // Identify Date Fields;
            if ( !!Name ){
                el.value = item[Name]
                if ( isTypeDate ){
                    const selectedDate = new Date(item[Name]).toISOString().split('T')[0]
                    el.value = selectedDate
                }
            }
        })

        // Check if the ReclamaData property has a value;
        if ( item.ReclamaData ){
            JSON.parse(item.ReclamaData).forEach(reclama => FormStore.Add(reclama))
        }
    }

    if ( RequestType === 'PATCH' ){
        SubmitFormEl.setAttribute('src', Item.__metadata.uri)
        EditReclamaRequest(ReclamaForm, Item)
        ContinueBtn.click()
        FirstQuestion.dispatchEvent(new Event('change'))
    }

    SubmitFormEl.getForm = () => ReclamaForm
    SubmitFormEl.Route = Route
    SubmitFormEl.List = List
    SubmitFormEl.Callback = () => $(modal.get()).modal('hide')
    SubmitFormEl.addEventListener('click', SubmitRequest)
    modalBody.append(FormContainer)
}