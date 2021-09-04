/** Settings */
import Setting_App from '../Settings/Setting_App.js'

import Action_Component from '../Actions/Action_Component.js'

/**
 * @link https://getbootstrap.com/docs/4.0/components/alerts/
 * 
 * @param {Object} param 
 */
export default function Component_Alert(param) {
    const {
        parent,
        position
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div>
                <div class='alert alert-primary' role='alert' style='margin: 20px 0px;' >
                    Pulled from: <a href ='https://info.health.mil/staff/analytics/COVID19VaccineVisualization/Lists/InpatientMtfDailySitrep/NewForm.aspx?Source=https://info.health.mil/staff/analytics/COVID19VaccineVisualization/SitePages/CommonOPTDailyReport.aspx'>Create new Common Operating Picture Daily Report</a>
                </div>
                <div id="COVID19WeeklyReportForm" class="container-fluid">
                <h1 id="createTitleHeader" class="centerText">Create new Common Operating Picture Daily Report</h1>
                <h1 id="modifyTitleHeader" class="centerText">Modify existing Common Operating Picture Daily Report</h1>
                <h1 id="viewTitleHeader" class="centerText">View Common Operating Picture Daily Report</h1>
                <h6 id="pDescriptor">Please fill out all fields to the best of your ability. All fields are required.</h6>
                <div id="mainRow" class="row">
                    <div class="col-xl-6 viewportAdjust">
                        <fieldset id="DetailsSection" class="group-border">
                            <legend class="group-border"><i style="color: #2f75b5; margin-right: 11px;" class="fas fa-clipboard"></i>Facility Information</legend>
                            <div class="form-group">
                                <label class="control-label" for="CommonOperatingPictureDailyReport-DMIS-ID"><span class="CircleBlue numberedCircle">1</span>Hello, World!</label><select id='dmisDropdown'></select>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Facility" data-displayName="restAPI"></span>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group">
                                <label class="control-label" for="CommonOperatingPictureDailyReport-Facility-Name">INSTALLATION/FACILITY NAME</label><div id='facUser'></div>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Facility-Name" data-displayName="restAPI"></span>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group">
                                <label class="control-label" for="CommonOperatingPictureDailyReport-Readiness-Code">READINESS SERVICE CODE</label><div id='readUser'></div>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Readiness-Code" data-displayName="restAPI"></span>
                                </div>
                            </div>
                            <hr>
                            
                            <div class="form-group">
                                <label class="control-label" for="CommonOperatingPictureDailyReport-ReportDate"><span class="CircleBlue numberedCircle">4</span>Report Date<span class="asteriskRequired"> *</span></label>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="CommonOperatingPictureDailyReport-ReportDate" data-displayName="Date"></span>
                                </div>
                                <!--<span><h6><small class="text-muted">(This field is auto-generated. When you click Save, it will be pre-populated...but you will be able to make changes to it later.)</small></h6></span>-->
                            </div>
            
                        </fieldset>
                    </div>
                
                
                    <div id="Capabilities" class="col-xl-6 viewportAdjust">
                        <fieldset class="group-border">
                            <legend class="group-border"><i style="color: #ed7c31; margin-right: 11px;" class="fas fa-clipboard"></i>MTF Capabilities</legend>
                            <div class="form-group">
                                <label class="control-label" for="COVID19WeeklyReport-ED-Status"><span class="CircleOrange numberedCircle">5</span>Emergency Department (ED) Status</label>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-ED-Status" data-displayName="Emergency Department (ED) Status"></span>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group">
                                <label class="control-label" for="COVID19WeeklyReport-Inpatient-Open"><span class="CircleOrange numberedCircle">6</span>Inpatient Surgery Open</label>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Inpatient-Open" data-displayName="Inpatient Surgery Open"></span>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group">
                                <label class="control-label" for="COVID19WeeklyReport-Outpatient-Open"><span class="CircleOrange numberedCircle">7</span>Outpatient Surgeries / Invasive Procedures Open</label>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Outpatient-Open" data-displayName="Outpatient Surgeries / Invasive Procedures Open"></span>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group">
                                <label class="control-label" for="COVID19WeeklyReport-Elective-Open"><span class="CircleOrange numberedCircle">8</span>Elective Surgeries Open</label>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Elective-Open" data-displayName="Elective Surgeries Open"></span>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group">
                                <label class="control-label" for="COVID19WeeklyReport-Staffed-OR"><span class="CircleOrange numberedCircle">9</span>Staffed OR Rooms</label>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Staffed-OR" data-displayName="Staffed OR Rooms"></span>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group">
                                <label class="control-label" for="COVID19WeeklyReport-Whole-Blood"><span class="CircleOrange numberedCircle">9</span>Whole Blood Units on Hand</label>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Whole-Blood" data-displayName="Whole Blood Units on Hand"></span>
                                </div>
                            </div>
                            <hr>
                        </fieldset>
                    </div>
                </div>
                <div id="Row2" class="row">
                    <div id="Staffing" class="col-xl-6 viewportAdjust">
                        <fieldset class="group-border">
                            <legend class="group-border"><i style="color: #a5a5a5; margin-right: 11px;" class="fas fa-clipboard "></i>MTF Clinical Staffing</legend>
                            <div class="form-group-number">
                                <label class="control-label" for="COVID19WeeklyReport-Total-Clinical-Staff"><span class="CircleGrey numberedCircle">8</span>Total Clinical Staff:</label>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Total-Clinical-Staff" data-displayName="Total Clinical Staff"></span>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group-number">
                                <label class="control-label" for="COVID19WeeklyReport-Staff-W-COVID"><span class="CircleGrey numberedCircle">9</span>Number of Clinical Staff w/ COVID-19 Positive or ROM:</label>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Staff-W-COVID" data-displayName="Number of Clinical Staff w/ COVID-19 Positive or ROM"></span>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group-number">
                                <label class="control-label" for="COVID19WeeklyReport-Deployed-Staff"><span class="CircleGrey numberedCircle">10</span>Number of Clinical Staff Deployed:</label>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Deployed-Staff" data-displayName="Number of Clinical Staff Deployed"></span>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group-number">
                                <label class="control-label" for="COVID19WeeklyReport-Staff-NA"><span class="CircleGrey numberedCircle">11</span>Number of Clinical Staff Not Available (TDY, Sick, etc.):</label>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Staff-NA" data-displayName="Number of Clinical Staff Not Available (TDY, Sick, etc.)"></span>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div id="Staffing" class="col-xl-6 viewportAdjust">
                        <fieldset class="group-border">
                            <legend class="group-border"><i style="color: #5178D0; margin-right: 11px;" class="fas fa-clipboard"></i>LAST MILE TRANSPORTATION</legend>
                            <div class="form-group-number">
                                <label class="control-label" for="COVID19WeeklyReport-Last-Mile"><span class="CircleBlue numberedCircle">8</span>Does the MTF have a "Last Mile Transportation Plan"?</label>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Last-Mile" data-displayName="Does the MTF have a Last Mile Transportation Plan?"></span>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group-number">
                                <label class="control-label" for="COVID19WeeklyReport-Last-Mile-Executable"><span class="CircleBlue numberedCircle">9</span>14. If yes, is the plan executable (resourced)?</label>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Last-Mile-Executable" data-displayName="If yes, is the plan executable (resourced)?"></span>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div id="Projections" class="col-xl-6 viewportAdjust">
                        <fieldset class="group-border">
                            <legend class="group-border"><i style="color: #5EA226; margin-right: 11px;" class="fas fa-clipboard"></i>MTF Projections</legend>
                            <div class="form-group">
                                <label class="control-label" for="COVID19WeeklyReport-Accept-ICU"><span class="CircleGreen numberedCircle">12</span>Ability to accept new ICU patients in two (2) days:</label>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Accept-ICU" data-displayName="Ability to accept new ICU patients in two (2) days"></span>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group">
                                <label class="control-label" for="COVID19WeeklyReport-Accept-non-ICU"><span class="CircleGreen numberedCircle">13</span>Ability to accept new non-ICU inpatients in two (2) days:</label>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Accept-non-ICU" data-displayName="Ability to accept new non-ICU inpatients in two (2) days"></span>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group">
                                <label class="control-label" for="COVID19WeeklyReport-Move-ICU"><span class="CircleGreen numberedCircle">14</span>Anticipate needing to move ICU patients in the next two (2) days?</label>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Move-ICU" data-displayName="Anticipate needing to move ICU patients in the next two (2) days?"></span>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group">
                                <label class="control-label" for="COVID19WeeklyReport-Move-non-ICU"><span class="CircleGreen numberedCircle">15</span>Anticipate needing to move non-ICU patients in the next two (2) days?</label>
                                <div class="col-sm-8r">
                                    <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Move-non-ICU" data-displayName="Anticipate needing to move non-ICU patients in the next two (2) days?"></span>
                                </div>
                            </div>
                            <hr>
                        </fieldset>
                    </div>
                </div>
                <div id="Row3" class="row">
                    <div id="Census" class=" viewportAdjust">
                        <fieldset id='census-fieldset' class="group-border" style="display: flex;">
                    <legend class="group-border"><i style="color: #faac32; margin-right: 11px;" class="fas fa-clipboard"></i>MEDICAL CENSUS REPORT FOR MEDICAL REGULATING (FOREIGN CIVILIAN / FOREIGN MILITARY ONLY)</legend>
                    <div id='census1'>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Total-Foreign-24"><span class="CircleGold numberedCircle">16</span>Total Foreign Civilians/Foreign Military Received in last 24 hours:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Total-Foreign-24" data-displayName="Total Foreign Civilians/Foreign Military Received in last 24 hours"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group">
                            <label class="control-label" for="COVID19WeeklyReport-Date-Received"><span class="CircleGold numberedCircle">17</span>Date/Time Received</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Date-Received" data-displayName="Date/Time Received"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number routine nohr">
                            <label class="control-label" for="COVID19WeeklyReport-Number-Ambulatory"><span class="CircleGold numberedCircle">18</span># Ambulatory (Routine): </label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Number-Ambulatory" data-displayName="# Ambulatory (Routine)"></span>
                            </div>
                        </div>
                        
                        <div class="form-group-number priority nohr">
                            <label class="control-label" for="COVID19WeeklyReport-Number-Litter"><span class="CircleGold numberedCircle">19</span># Litter (Priority): </label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Number-Litter" data-displayName="# Litter (Priority)"></span>
                            </div>
                        </div>
                        
                        <div class="form-group-number critical nohr">
                            <label class="control-label" for="COVID19WeeklyReport-Number-Critical"><span class="CircleGold numberedCircle">20</span># Critical Care (Urgent): </label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Number-Critical" data-displayName="# Critical Care (Urgent)"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Number-Admitted"><span class="CircleGold numberedCircle">21</span># Admitted: </label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Number-Admitted" data-displayName="# Admitted"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Number-ICU"><span class="CircleGold numberedCircle">22</span># in ICU: </label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Number-ICU" data-displayName="# in ICU"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Number-PACU"><span class="CircleGold numberedCircle">23</span># in PACU: </label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Number-PACU" data-displayName="# in PACU"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Number-PICU"><span class="CircleGold numberedCircle">24</span># in PICU:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Number-PICU" data-displayName="# in PICU"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Number-PICU"><span class="CircleGold numberedCircle">25</span># in NICU:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Number-PICU" data-displayName="# in NICU"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Number-BH"><span class="CircleGold numberedCircle">26</span># in Behavioral Health:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Number-BH" data-displayName="# in Behavioral Health"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Number-Intermediate-Care"><span class="CircleGold numberedCircle">27</span>#  in Intermediate Care Beds:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Number-Intermediate-Care" data-displayName="#  in Intermediate Care Beds"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Number-Minimal-Care"><span class="CircleGold numberedCircle">28</span># in Minimal Care Beds:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Number-Minimal-Care" data-displayName="# in Minimal Care Beds"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Number-non-Medical"><span class="CircleGold numberedCircle">29</span># of Non-Medical Attendants:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Number-non-Medical" data-displayName="# of Non-Medical Attendants"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Number-Unaccompanied-Children"><span class="CircleGold numberedCircle">30</span># of Unaccompanied Children:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Number-Unaccompanied-Children" data-displayName="# of Unaccompanied Children"></span>
                            </div>
                        </div>
                        <hr>
                        <div >
                            <label class="control-label" for="COVID19WeeklyReport-Disposition"><span class="CircleGold numberedCircle">31</span>Disposition of Foreign Civilians/Foreign Military Patients:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Disposition" data-displayName="Disposition of Foreign Civilians/Foreign Military Patients"></span>
                            </div>
                        </div>
                    </div>
                    <div id='census2'>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Census-ICU"><span class="CircleGold numberedCircle">32</span>Current Census: ICU:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Census-ICU" data-displayName="Current Census: ICU"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Census-PACU"><span class="CircleGold numberedCircle">33</span>Current Census: PACU:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Census-PACU" data-displayName="Current Census: PACU"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Census-PICU"><span class="CircleGold numberedCircle">34</span>Current Census: PICU:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Census-PICU" data-displayName="Current Census: PICU"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Census-NICU"><span class="CircleGold numberedCircle">35</span>Current Census: NICU:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Census-PICU" data-displayName="Current Census: NICU"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Census-BH-Beds"><span class="CircleGold numberedCircle">36</span>Current Census: Behavioral Health Beds:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Census-BH-Beds" data-displayName="Current Census: Behavioral Health Beds"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Census-Intermediate-Care-Beds"><span class="CircleGold numberedCircle">37</span>Current Census: Intermediate Care Beds:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Census-Intermediate-Care-Beds" data-displayName="Current Census: Intermediate Care Beds"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Census-Minimal-Care-Beds"><span class="CircleGold numberedCircle">38</span>Current Census: Minimal Care Beds:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Census-Minimal-Care-Beds" data-displayName="Current Census: Minimal Care Beds"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Total-non-Medical-Staff"><span class="CircleGold numberedCircle">39</span>Current Total: Non-Medical Attendants:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Total-non-Medical-Staff" data-displayName="Current Total: Non-Medical Attendants"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Total-Discharged"><span class="CircleGold numberedCircle">40</span>Current Total: Discharged:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Total-Discharged" data-displayName="Current Total: Discharged"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Total-Transitioned"><span class="CircleGold numberedCircle">41</span>Current Total: Transitioned to DOS or NGO care:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Total-Transitioned" data-displayName="Current Total: Transitioned to DOS or NGO care"></span>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group-number">
                            <label class="control-label" for="COVID19WeeklyReport-Total-Unaccompanied-Children"><span class="CircleGold numberedCircle">42</span>Current Total: Unaccompanied Children:</label>
                            <div class="">
                                <span class="COVID19WeeklyReportField" id="COVID19WeeklyReport-Total-Unaccompanied-Children" data-displayName="Current Total: Unaccompanied Children"></span>
                            </div>
                        </div>
                    </div>
                                </fieldset>
                    </div>
                </div>
            
            </div>
            <div id='buttonToolbar'>
            
            </div>
                
            </div>
            </div>
        `,
        style: /*css*/ `
            /* hide quick launch SharePoint 2013 */
            #sideNavBox {
                display: none;
            }
            /* adjust position of content */
            #contentBox {
                margin-left:10px!important;
            }

            #ms-help span:first-of-type {
                height: 30px !important;
                width: 30px !important;
                padding-left: 9px !important;
            }

            #fullscreenmode span:first-of-type {
                height: 22px !important;
                width: 25px !important;
            }

            #exitfullscreenmode span:first-of-type {
                height: 25px !important;
                width: 25px !important;
            }

            .ms-siteactions-root > span > a.ms-core-menu-root {
                width: 30px;
                height: 30px;
            }

            .ms-webpart-menuLink {
                padding-right: 7px;	
            }
            /*--------END restore SP 2013 look and feel--------*/

            legend.group-border {
            width: inherit;
            /* Or auto */
            padding: 0 10px;
            /* To give a bit of padding on the left and right */
            border-bottom: none;
            }
            fieldset.group-border {
            border: 1px groove #ddd !important;
            padding: 1.4em 1.4em 1.4em !important;
            /* margin: 1.6em 1.5em !important; */
            margin-top: 12px;
            -webkit-box-shadow: 0px 0px 0px 0px #000;
            box-shadow: 0px 0px 0px 0px #000;
            }
            .control-label {
                margin-bottom: 6px !important;
                margin-left: 0px !important;
                font-weight: bold;
                margin-right: 1rem !important;
            }

            hr {
                margin-top: 13px !important;
                margin-bottom: 13px !important;
            }

            label {
                margin-left: 5px !important;
            }

            input[type=checkbox], input[type=radio] {
                margin: 4px 5px 0px 0px !important;
            }

            legend {
                margin-bottom: 11px !important;
            }
            .centerText {
                text-align: center;
                font-weight: bold !important;
            }
            .asteriskRequired {
                color: red;
                font-weight: bold;
            }
            .ms-formline {
                border-top: 0px solid #c4c4c4 !important;
            }
            span.CircleBlue {
                background: #5178D0;
                border-radius: 0.8em;
                -moz-border-radius: 0.8em;
                -webkit-border-radius: 0.8em;
                color: #ffffff;
                display: inline-block;
                font-weight: bold;
                line-height: 1.6em;
                margin-right: 15px;
                text-align: center;
                width: 1.6em; 
            }
            span.CircleGreen {
                background: #5EA226;
                border-radius: 0.8em;
                -moz-border-radius: 0.8em;
                -webkit-border-radius: 0.8em;
                color: #ffffff;
                display: inline-block;
                font-weight: bold;
                line-height: 1.6em;
                margin-right: 15px;
                text-align: center;
                width: 1.6em; 
            }
            span.CircleRust {
                background: #bb4f00;
                border-radius: 0.8em;
                -moz-border-radius: 0.8em;
                -webkit-border-radius: 0.8em;
                color: #ffffff;
                display: inline-block;
                font-weight: bold;
                line-height: 1.6em;
                margin-right: 15px;
                text-align: center;
                width: 1.6em; 
            }
            span.CircleGold {
                background: #faac32;
                border-radius: 0.8em;
                -moz-border-radius: 0.8em;
                -webkit-border-radius: 0.8em;
                color: #ffffff;
                display: inline-block;
                font-weight: bold;
                line-height: 1.6em;
                margin-right: 15px;
                text-align: center;
                width: 1.6em; 
            }

            span.CircleOrange {
                background: #ed7c31;
                border-radius: 0.8em;
                -moz-border-radius: 0.8em;
                -webkit-border-radius: 0.8em;
                color: #ffffff;
                display: inline-block;
                font-weight: bold;
                line-height: 1.6em;
                margin-right: 15px;
                text-align: center;
                width: 1.6em;
            }

            span.CircleGrey {
                background: #a5a5a5;
                border-radius: 0.8em;
                -moz-border-radius: 0.8em;
                -webkit-border-radius: 0.8em;
                color: #ffffff;
                display: inline-block;
                font-weight: bold;
                line-height: 1.6em;
                margin-right: 15px;
                text-align: center;
                width: 1.6em;
            }



            span.CircleDeepBlue {
                background: #003759;
                border-radius: 0.8em;
                -moz-border-radius: 0.8em;
                -webkit-border-radius: 0.8em;
                color: #ffffff;
                display: inline-block;
                font-weight: bold;
                line-height: 1.6em;
                margin-right: 15px;
                text-align: center;
                width: 1.6em; 
            }
            span.CircleRed {
                background: #FF0000;
                border-radius: 0.8em;
                -moz-border-radius: 0.8em;
                -webkit-border-radius: 0.8em;
                color: #ffffff;
                display: inline-block;
                font-weight: bold;
                line-height: 1.6em;
                margin-right: 15px;
                text-align: center;
                width: 1.6em; 
            }
            #onetIDListForm {
                margin: auto !important;
            }
            .saveButtonColor {
                background-color: #327b00 !important;
                font-weight: bold !important;
                color: white !important;
            }
            .saveButtonColor:hover{
                background-color: #3e9800 !important;
                font-weight: bold !important;
                color: white !important;
            }
            .saveButtonColor:active{
                background-color: #215200 !important;
                font-weight: bold !important;
                color: white !important;
            }
            .cancelButtonColor {
                background-color: #bb323f !important;
                font-weight: bold !important;
                color: white !important;
            }
            .cancelButtonColor:hover{
                background-color: #dc3545 !important;
                font-weight: bold !important;
                color: white !important;
            }
            .cancelButtonColor:active{
                background-color: #982833 !important;
                font-weight: bold !important;
                color: white !important;
            }
            #viewTitleHeader {
                display:none;
            }
            #createTitleHeader {
                display:none;
            }
            #modifyTitleHeader {
                display:none;
            }
            #viewTitleHeader2 {
                display:none;
            }
            #createTitleHeader2 {
                display:none;
            }
            #modifyTitleHeader2 {
                display:none;
            }
            #COVID19WeeklyReportForm {
                margin-top: 10px;
            }
            #pDescriptor {
                margin-top: 20px;
                text-align: center;
            }
            #pageTitle {
                display:none;
            }
            #part1 {
                display:none;
            }
            /*
            .sp-peoplepicker-topLevel {
                width: 100% !important;
            }
            */
            /* .ms-long{
                width: 100% !important;
            } */
            .viewportAdjust {
                min-width: 540px !important;
            }
            .ms-formvalidation {
                color: #ff001d !important;
                font-weight: bold;
            }
            .disabledField {
                color: #0b0b0b;
                font-weight: bold;
                background-color: #e0e0e0;
                font-size: 16px;
            }
            .taskNotDue {
                display: none;
            }
            .taskAlmostDue {
                display: none;
            }
            .taskOverDue {
                display: none;
            }
            .tableHeaders {
                font-weight: 500;
            }
            .tableBorderBottom {
                border-bottom: 1px solid #000;
            }
            #vaccineDetailsTable .ms-long {
                width: 100%;
            }
            #vaccineDetailsTable .ms-dtinput {
                padding: 0;
            }
            #HoursTable {
                display: table;
                margin-bottom: 15px;
            }
            #HoursTable th {
                color: #fff;
                background-color: #346699;
                border-color: #454d55;
                text-align: center;
            }
            #HoursTable td {
                text-align: center;
            }
            #NotesSection .ms-long {
                width: 100%;
            }
            .ms-RadioText{
                margin-left: 20px;
            }
            .formHeader {
                margin-top: -24px !important;
                font-size: initial;
                text-align: center;
            }
            .vaccineLossTable {
                width: 100%;
                text-align: center;
            }
            .vaccineLossAlignment {
                vertical-align: bottom !important;
            }
            .vaccineLossHeader {
                vertical-align: middle !important;
            }
            .vaccineLossText {
                text-align: center !important;
            }
            .vaccineLossTable2 {
                text-align: center !important;
            }
            .vaccineFormFieldCenter {
                text-align: center;
            }

            .form-group-number{
            display:flex
            }

            .form-group{
            display:flex
            }

            .top-col{
                width:100%;
                margin:1rem;
            }

            #buttonToolbar{
                display: flex;
                justify-content: space-evenly;
                margin: 1rem;
            }

            .routine{
                background-color: #5ea226;
                border-radius: .5rem
            }
            .priority{
                background-color: #fadd32;
                border-radius: .5rem
                
            }.critical{
                background-color: #ce1717;
                border-radius: .5rem
            }

            .nohr{
                padding-top: 1rem;
                padding-bottom:1rem;
            }

            #Census{
                width: 100%;
            }
            #census-fieldset{
                margin:1rem;
            }

            #census1{
                width:50% !important
            }
            #census2{
                width:50% !important;
                margin-left:.5rem
            }
        `,
        parent,
        position
    });

    return component;
}