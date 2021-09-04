import Action_Get from '../Actions/Action_Get.js'

/** HDS Enrollee Form @author Wilfredo Pacheco 20210810 */

/** Note: adding a status column in the ReclamaData property may help keeping track of the approved items
 * as well as the users that submited them. One may argue why we don't just create these items on the list,
 * that can be decided at a later date; @author Wilfredo Pacheco 20210823
*/

/** TODO: HSD Funtional Review and Screenshots with SMD Document states:
 * 
 * The following was requested: 
 * 
 * Prompt Eight of the HSD Workload Modal:
 * Need to add a 'Prompt Eight' to account for the fact the facility will need to indicat which FY(s) the reclama
 * is applicable to, given that the HSD module will shift from 1 yr to 3 yr planning. (REQ ID R031 and R151)
 * 
 * @author Wilfredo Pacheco 20210824
 */

const ListTitle = 'FacilityHSDWorkloadReclama'
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
}

/** Fields Used in the form id="add-reclama" */
const Adjustment = 'Adjustment';
const ChangeRequest = 'ChangeRequest';
const DMIS = 'DMIS';
const ServiceLine = 'ServiceLine';
const Program =  'Program';
const MEPRS = 'MEPRS';
const StaffSpeciality = 'StaffSpeciality';

export default async function ShowForm(param){

    const { modal, parent, table, event, Item } = param;
    const List = await Route.Get(ListUrl, {
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
    <h5>Health Services Delivery Workload Modal - Reclama</h5>`

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
            <!-- ${Adjustment} Question -->
            <div class="col-xl-4 col-lg-12 mt-2" id="input${Adjustment}-container">
                <label for="input${Adjustment}" class="form-label">Is this adjustment an increase or decrease?</label>
                <select id="input${Adjustment}" name="${Adjustment}" class="form-control form-control-sm" required>
                    <option value="">Choose...</option>
                    <option value="Increase">Increase</option>
                    <option value="Decrease">Decrease</option>
                </select>
            </div>

            <!-- ${ChangeRequest} Question -->
            <div class="col-xl-5 col-lg-12 mt-2" id="input${ChangeRequest}-container">
                <label for="input${ChangeRequest}" class="form-label"
                >Is your reclama for a capability change request (ie: adding or eliminating a service) or a capacity change?</label>
                <select id="input${ChangeRequest}" name="${ChangeRequest}" class="form-control form-control-sm" required>
                    <option value="">Choose...</option>
                    <option value="Capability">Capability</option>
                    <option value="Capacity">Capacity</option>
                </select>
            </div>
        </div>

        <div class="row">
            <!-- ${DMIS} Question -->
            <div class="col-xl-4 col-lg-12 mt-2" id="input${DMIS}-container">
                <label for="input${DMIS}" class="form-label">DMIS:</label>
                <select id="input${DMIS}" name="${DMIS}" class="form-control form-control-sm" required>
                    <option value="">Choose...</option>
                </select>
            </div>

            <!-- ${ServiceLine} Question -->
            <div class="col-xl-3 col-lg-12 mt-2" id="input${ServiceLine}-container">
                <label for="input${ServiceLine}" class="form-label">Service Line:</label>
                <select id="input${ServiceLine}" name="${ServiceLine}" class="form-control form-control-sm" required>
                    <option value="">Choose...</option>
                </select>
            </div>

            <!-- ${Program} Question -->
            <div class="col-xl-3 col-lg-12 mt-2" id="input${Program}-container">
                <label for="input${Program}" class="form-label">Program:</label>
                <select id="input${Program}" name="${Program}" class="form-control form-control-sm" required>
                    <option value="">Choose...</option>
                </select>
            </div>

            <!-- ${MEPRS} Question -->
            <div class="col-xl-3 col-lg-12 mt-2" id="input${MEPRS}-container">
                <label for="input${MEPRS}" class="form-label">MEPRS:</label>
                <select id="input${MEPRS}" name="${MEPRS}" class="form-control form-control-sm" required>
                    <option value="">Choose...</option>
                </select>
            </div>

            <!-- ${StaffSpeciality} Question -->
            <div class="col-xl-3 col-lg-12 mt-2" id="input${StaffSpeciality}-container">
                <label for="input${StaffSpeciality}" class="form-label">Staff Speciality:</label>
                <select id="input${StaffSpeciality}" name="${StaffSpeciality}" class="form-control form-control-sm" required>
                    <option value="">Choose...</option>
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

            <!-- List Options -->
            <div class="col-xl-2 col-lg-12 mt-2" id="inputAPC-container">
                <label for="inputAPC" class="form-label">APC:</label>
                <input id="inputAPC" type="number" name="APC" class="form-control form-control-sm">
            </div>

            <div class="col-xl-2 col-lg-12 mt-2" id="inputPERVU-container">
                <label for="inputPERVU" class="form-label">PERVU:</label>
                <input id="inputPERVU" type="number" name="PERVU" class="form-control form-control-sm">
            </div>

            <div class="col-xl-2 col-lg-12 mt-2" id="inputWRVU-container">
                <label for="inputWRVU" class="form-label">WRVU:</label>
                <input id="inputWRVU" type="number" name="WRVU" class="form-control form-control-sm">
            </div>

            <div class="col-xl-2 col-lg-12 mt-2" id="inputRWP-container">
                <label for="inputRWP" class="form-label">RWP:</label>
                <input id="inputRWP" type="number" name="RWP" class="form-control form-control-sm">
            </div>

            <div class="col-xl-2 col-lg-12 mt-2" id="inputMHBD-container">
                <label for="inputMHBD" class="form-label">MHBD:</label>
                <input id="inputMHBD" type="number" name="MHBD" class="form-control form-control-sm">
            </div>

            <div class="col-xl-2 col-lg-12 mt-2" id="inputDWV-container">
                <label for="inputDWV" class="form-label">DWV:</label>
                <input id="inputDWV" type="number" name="DWV" class="form-control form-control-sm">
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
    const inputAdjustment = AddReclamaForm.querySelector(`div#input${Adjustment}-container`) // Increase/Decrease
    const inputChangeRequest = AddReclamaForm.querySelector(`div#input${ChangeRequest}-container`) // Adding/Eliminating Service, Capacity Change
    const inputDMIS = AddReclamaForm.querySelector(`div#input${DMIS}-container`) // DMIS;
    const inputServiceLine = AddReclamaForm.querySelector(`div#input${ServiceLine}-container`) // Service Line
    const inputProgram = AddReclamaForm.querySelector(`div#input${Program}-container`) // Program
    const inputMEPRS = AddReclamaForm.querySelector(`div#input${MEPRS}-container`) // StaffSpeciality 
    const inputStaffSpeciality = AddReclamaForm.querySelector(`div#input${StaffSpeciality}-container`) // StaffSpeciality

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
                            <th>Service Line</th>
                            <th>Program</th>
                            <th>MEPERS</th>
                            <th>Staff Speciality</th>
                            <th>Reason</th>
                            <th>APC</th>
                            <th>PERVU</th>
                            <th>WRVU</th>
                            <th>RWP</th>
                            <th>MHBD</th>
                            <th>DWV</th>
                            <th class="col-2"></th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>`

                const TableBody = DisplayEl.querySelector('table tbody')

                Store.forEach((item, index) => {

                    const tr = document.createElement('tr')

                    const { DMIS, Adjustment, ChangeRequest, ServiceLine, Program, MEPRS, StaffSpeciality, Reason,
                        APC, PERVU, WRVU, RWP, MHBD, DWV } = item;

                    tr.innerHTML = /*html*/`
                    <td>${DMIS}</td>
                    <td>${Adjustment}</td>
                    <td>${ChangeRequest}</td>
                    <td>${ServiceLine}</td>
                    <td>${Program}</td>
                    <td>${MEPRS}</td>
                    <td>${StaffSpeciality}</td>
                    <td>${Reason}</td>
                    <td>${APC || 0}</td>
                    <td>${PERVU || 0}</td>
                    <td>${WRVU || 0}</td>
                    <td>${RWP || 0}</td>
                    <td>${MHBD || 0}</td>
                    <td>${DWV || 0}</td>
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
            inputServiceLine.querySelector('select'),
            inputProgram.querySelector('select'),
            inputMEPRS.querySelector('select'),
            inputStaffSpeciality.querySelector('select')
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
            const CurrentDutyStatusValue = inputServiceLine.querySelector('select').value
            const CurrentGenderValue = inputProgram.querySelector('select').value
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

    function ServiceLineChangeAction(event){

        /** Program is based off Service Line selections; 
         * If the user selects BHSL & PCSL: options are Other, Multi-D
         * - ALSO -
         * The current list should hold values that match these options with the program options;
         * @author Wilfredo Pacheco 20210824
        */

        const ServiceLineSelectEl = this
        const ServiceLineValue = this.value
        const ProgramSelectEl = inputProgram.querySelector('select')
        const MULTID_TOKEN = 'Multi-D'
        const OTHER_TOKEN = 'Other'
        const filterOptions = ServiceLineValue === 'BHSL' || ServiceLineValue === 'PCSL' ? 
        true : 
        false;

        /** If this value changes then the reason for adjust must be reset; */
        ProgramSelectEl.value = !event.isTrusted ? 
        CurrentValue : 
        ''

        Array.from(ProgramSelectEl.querySelectorAll('option')).map(option => {

            const value = option.value
            const hasToken = option.getAttribute('data-token')

            /** If the options need to be filtered (user selected BHSL || PCSL) */
            if ( filterOptions ){
                if ( hasToken ) $(option).show()
                else $(option).hide()
            }
            else if ( !filterOptions  ){
                if ( hasToken ) $(option).hide()
                else $(option).show()
            }
        })

        ShowHiddenFields()
    }

    /** Event Listeners */
    inputAdjustment.querySelector('select').addEventListener('change', AdjustmentChangeAction)
    inputChangeRequest.querySelector('select').addEventListener('change', ShowHiddenFields)
    inputDMIS.querySelector('select').addEventListener('change', ShowHiddenFields)
    inputServiceLine.querySelector('select').addEventListener('change', ServiceLineChangeAction)
    inputProgram.querySelector('select').addEventListener('change', ShowHiddenFields)
    inputMEPRS.querySelector('select').addEventListener('change', ShowHiddenFields)
    inputStaffSpeciality.querySelector('select').addEventListener('change', ShowHiddenFields)

    /** Dynamically load DMIS options; */
    Action_Get({ list: 'DMIS', select: 'Title,Id' }) // Get all items from list;
    .then(data => {
        // For each item create an option element;
        data.forEach(option => {
            const { Title } = option;
            const OptionEl = document.createElement('option')
            OptionEl.value = Title // Define the value property on the option element;
            OptionEl.innerText = Title // Define the inner text property on the option element;
            /** FIXME: This accounts for the column value fragments found on this list & should be removed when the data is updated; @author Wilfredo Pacheco 20210824 */
            if ( document.FacilitySelected.QPP_DropDown.includes(Title) ){ OptionEl.setAttribute('selected', '') } 
            inputDMIS.querySelector('select').append(OptionEl) // Add to parent select element;
        })
    })

    /** Dynamically load Service Lines options; */
    Action_Get({ list: 'Service Lines', select: 'Title,Id' })
    .then(data => {
        data.forEach(option => {
            const { Title } = option;
            const OptionEl = document.createElement('option')
            OptionEl.value = Title
            OptionEl.innerText = Title
            inputServiceLine.querySelector('select').append(OptionEl)
        })
    })

    /** Dynamically load Programs options; */
    Action_Get({ list: 'Programs', select: 'Title,Id' })
    .then(data => {
        const MULTID_TOKEN = 'Multi-D'
        const OTHER_TOKEN = 'Other'
        data.forEach(option => {
            const { Title } = option;
            const OptionEl = document.createElement('option')
            OptionEl.value = Title
            OptionEl.innerText = Title
            if ( Title === MULTID_TOKEN || Title === OTHER_TOKEN ){ OptionEl.setAttribute('data-token', 'token') }
            inputProgram.querySelector('select').append(OptionEl)
        })
    })

    /** Dynamically load StaffTypes options; */
    Action_Get({ list: 'StaffTypes', select: 'Title,Id' })
    .then(data => {
        data.forEach(option => {
            const { Title } = option;
            const OptionEl = document.createElement('option')
            OptionEl.value = Title
            OptionEl.innerText = Title
            inputStaffSpeciality.querySelector('select').append(OptionEl)
        })
    })

    /** Dynamically load MEPRs options; */
    Action_Get({ list: 'MEPRs', select: 'Title,Id' })
    .then(data => {
        data.forEach(option => {
            const { Title } = option;
            const OptionEl = document.createElement('option')
            OptionEl.value = Title
            OptionEl.innerText = Title
            inputMEPRS.querySelector('select').append(OptionEl)
        })
    })

    /** Save event for added reclamas; */
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

    /** NOTE: Change event for First question;
     * The first question for the second form will trigger requirments for the user;
     * If the user selects: 
     * 
     * 'No'  - No other questions are required
     * 'Yes' - (Any 'yes' question) The user is required to answer and provide data for the questions that appear
     *  @author Wilfredo Pacheco 20210824
     */
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

    /** Click event for Continue Btn */
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

    /** Edit event for items in the display table, fills the form; */
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