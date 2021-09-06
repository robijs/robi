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
            <div class="container">
            <div class="row">
                <div class="center-box">
                    <img class="img-fluid DHAEmblem" src="/staff/analytics/COVID19VaccineVisualization/SiteAssets/Images/DHAlogo3Small.png"> 
                    </br>
                    <span class="splashText">Analytics and Evaluation Division (AED), J-5</br></br>COVID-19 Vaccine Reporting Data Entry Tool</br></span>
                    </br>
                    </br>
                    <div id="row1" class="row">
                        <div class="col-lg-4">
                        </div>
                        <div class="col-lg-4 centerThis">
                            <span><a href="#" data-toggle="modal" data-target="#CVVDModalCenter" role="button" id="StartButton" class="btn btn-outline-light btn-lg overrideFontColor switcher"><i class='fas fa-plus-square fa-2x'></i></br>Start your site's vaccination report</a></span>
                        </div>
                        <div class="col-lg-4">
                            <!--
                            <span><a href="#" data-toggle="modal" data-target="#CVVDModalCenter2" role="button" class="btn btn-outline-light btn-lg overrideFontColor switcher"><i class='fas fa-folder-open fa-2x'></i></br>My site's vaccination report</a></span>
                            -->
                        </div>
                    </div>
                    <hr>
                    </br>
                    </br>
                    </br>
                    <span class="lastSpan"></span>
                </div>
            </div>
        </div>
        
        <!-- Modal -->
        <div class="modal fade" id="CVVDModalCenter" tabindex="-1" role="dialog" aria-labelledby="CVVDModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="CVVDModalLongTitle"><img style="height: 32px; margin-right: 7px" src="/staff/analytics/COVID19VaccineVisualization/SiteAssets/Images/vaccinelogo2.png">Let's get started...</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <h6>We'll check to see if we've got COVID-19 vaccination records for your site in the system. If not, we'll create one for you automatically. Then we'll send you right over to the Daily Vaccine Report Log.</h6>
                <hr>
                <h6>1. First, enter your site name and then choose it from the available dropdown.</h6>
                <input id="txtLocation" class="form-control form-control-sm" type="text" placeholder="Start typing to select your MTF, Site, Installation or Base."><br>
                <p>Tip: The list of DOD facilities in this system are directly imported from the master MHS DISM tables and is inclusive of ALL DOD. You can search by any of the following criteria: <br>
                 - Facility site name<br>
                 - DMIS ID<br>
                 - Unit ID Code<br>
                 - DMIS Facility Name<br>
                 - Installation Name<br>
                 - Facility City Name
                </p>
                <input id="valSiteInternalSPid" class="form-control form-control-sm" type="text">
                <hr>
                <h6>2. Then, choose the manufacturer of the COVID-19 vaccine for your report.</h6>
                <div class="form-group">
                    <label for="vaccineSel1">Vaccine Manufacturer (select one):</label>
                    <select class="form-control" id="vaccineSel1">
                        <option selected value="abc"> -- select a COVID-19 vaccine manufacturer -- </option>
                    </select>
                </div>
                <input id="valVaccineInternalSPid" class="form-control form-control-sm" type="text">
                <hr>
                <div id="queryRow" class="row">
                    <div class="col-lg-4">
                    </div>
                    <div class="col-lg-4 centerThis">
                        <button id="queryReportSystem" type="button" class="btn btn-primary btn-lg"><i class='fas fa-notes-medical fa-2x'></i></br>Look it up</button>
                    </div>
                    <div class="col-lg-4">
                        <h6 id="varRecordFound">Records for your site have been found. Automatically redirecting to the Daily Vaccine report entry form in...</br><span id="countdown">5</span></h6>
                    </div>
                </div>
                <div id="foundRecords" class="row">
                    <div class="col-lg-12 centerThis">
                        <h6><span style="color:green"><i class="fas fa-check-square"></i></span>&nbsp;&nbsp;Good news, we found COVID-19 vaccination records for your site!</br></h6>
                    </div>
                    <div class="col-lg-3">
                    </div>
                    <div class="col-lg-3 centerThis">
                        <button id="MasterRecordPage" type="button" class="btn btn-primary"><i class="fas fa-notes-medical fa-2x"></i></br>View Master Record for my site</button>
                    </div>
                    <div class="col-lg-3 centerThis">
                        <button id="DailyRecordForm" type="button" class="btn btn-warning"><i class="fas fa-syringe fa-2x"></i></br>Submit Daily Vaccination Report</button>
                    </div>
                    <div class="col-lg-3">
                    </div>
                </div>
                <div id="createItemFunction" class="row">
                    <div class="col-lg-12 centerThis">
                        <h6><span style="color:red"><i class="fas fa-exclamation-triangle"></i></span>&nbsp;&nbsp;No record was found. Would you like to create one now?</h6>
                    </div>
                    <div class="col-lg-3">
                    </div>
                    <div class="col-lg-3 centerThis">
                        <button id="yesCreateItem" type="button" class="btn btn-success btn-lg"><i class='fas fa-check fa-2x'></i></br>Yes</button>
                    </div>
                    <div class="col-lg-3 centerThis">
                        <button id="noDoNotCreateItem" type="button" class="btn btn-danger btn-lg"><i class='fas fa-times-circle fa-2x'></i></br>No</button>
                    </div>
                    <div class="col-lg-3">
                    </div>
                </div>
              </div>
              <div class="modal-footer">
                <button id="closeModal" type="button" class="btn btn-secondary" data-dismiss="modal">Clear form and Close</button>
              </div>
            </div>
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
            /*
            *, ::after, ::before {
                box-sizing: content-box !important;
            }

            .ms-SPZone > .s4-wpcell, .ms-SPZone > .s4-wpcell-plain, .ms-rtestate-write > .ms-rte-wpbox > div > .s4-wpcell, .ms-rtestate-write > .ms-rte-wpbox > div > .s4-wpcell-plain {
                padding: 0;
            }
            */

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

            #s4-bodyContainer {
                height: 100% !important;
            }
            #contentRow {
                /*
                margin-top: 30px;
                background-color: #002e56;
                height: 100%;
                background-image: url("/sites/navmedkm/SA-MOU/SiteAssets/151207-N-ZZ999-435.jpg");
                background-size:     cover;                    
                background-repeat:   no-repeat;
                background-position: center center;
                */
            }

            #s4-workspace {
                height: 100%;
                background-image: url("/staff/analytics/COVID19VaccineVisualization/SiteAssets/Images/COVIDPRojectsHeader.jpg");
                background-size:     cover;                    
                background-repeat:   no-repeat;
                background-position: center center;
            }

            .center-box{
                position:absolute;
                top:0;
                right:0;
                bottom:0;
                left:0;
                z-index:99;
                margin:auto;
                height:600px;
                width:729px;
                border:1px solid #000;
                text-align:center;
                line-height:30px;
                background-color: rgba(0, 0, 0, 0.77);
                border-radius: 15px;
            }
            .splashText {
                color: white; 
                font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif;
                font-size: 28px;
                font-weight: bold;
            }
            .DHAEmblem {
                padding: 15px;
            }
            #pageTitle {
                display:none;
            }
            .overrideFontColor {
                color: white !important;
            }
            /*
            .menu-item-text {
                color: white !important;
            }
            */
            #row1 {
                margin-left: 0px !important;
                margin-right: 0px !important;
            }
            #CreateDocumentSetButton {
                display: none;
            }
            #ViewDocumentSetButton {
                display: none;
            }
            #ctl00_PlaceHolderSearchArea_SmallSearchInputBox1_csr_sboxdiv {
                height: 30px!important;
                background-color: white;
            }
            #ctl00_PlaceHolderSearchArea_SmallSearchInputBox1_csr_sbox {
                height: 25px!important;
            }
            #DeltaTopNavigation {
                display: none;
            }
            * html .ui-autocomplete {
                height: 200px !important;
                overflow-y: scroll;
                overflow-x: hidden;
            }
            .ui-autocomplete {
                height: 500px; 
                overflow-y: scroll; 
                overflow-x: hidden;
                z-index: 5000;
            }
            .modal-title {
                margin-left: 0px;
            }
            #valSiteInternalSPid {
                display:none;
            }
            #valVaccineInternalSPid {
                display:none;
            }
            .centerThis {
                text-align: center;
            }
            #varRecordFound {
                display:none;
            }
            #countdown {
                font-size: 20pt;
            }
            #createItemFunction {
                display: none;
            }
            .modal-header .close {
                margin: -1rem -3rem -1rem auto !important;
            }
            #queryRow {
                display: none;
            }
            #foundRecords {
                display: none;
            }
        `,
        parent,
        position
    });

    return component;
}