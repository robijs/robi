/** Actions */
import Action_Component from '../Actions/Action_Component.js'

export default function Component_QPPReclamaTracker(param) {
    const {
        parent,
        position
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div>
            <div class="k-tabstrip-wrapper" style="">
                <div id="tabstrip" style="" data-role="tabstrip" tabindex="0"
                    class="k-widget k-header k-tabstrip k-floatwrap k-tabstrip-top" role="tablist"
                    aria-activedescendant="enrollmentTabId">
                    <ul class="k-tabstrip-items k-reset">
                        <li id="enrollmentTabId" class="k-item k-state-default k-first k-tab-on-top k-state-active" role="tab"
                            aria-controls="tabstrip-1" aria-selected="true" style=""><span class="k-loading k-complete"></span><span
                                unselectable="on" class="k-link">
                                Enrollment
                            </span></li>
                        <li id="workloadTabId" class="k-item k-state-default k-last" role="tab" aria-controls="tabstrip-2" style="">
                            <span class="k-loading k-complete"></span><span unselectable="on" class="k-link">
                                Workload
                            </span></li>
                    </ul>
                    <div class="k-content k-state-active" id="tabstrip-1" role="tabpanel" aria-expanded="true"
                        style="display: block; opacity: 1;">
                        <div id="enrollmentTrackerGrid" data-role="tooltip"
                            class="k-grid k-widget k-display-block k-reorderable k-editable" style="">
                            <div class="k-header k-grid-toolbar"><a role="button" class="k-button k-button-icontext k-grid-excel"
                                    href="#"><span class="k-icon k-i-file-excel"></span>Export to Excel</a></div>
                            <div class="k-grouping-header" data-role="droptarget">Drag a column header and drop it here to group by
                                that column</div>
                            <div class="k-grid-header" style="padding-right: 17px;">
                                <div class="k-grid-header-wrap k-auto-scrollable" data-role="resizable">
                                    <table role="grid" tabindex="-1">
                                        <colgroup>
                                            <col style="width:100px">
                                            <col style="width:150px">
                                            <col style="width:200px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:200px">
                                            <col style="width:150px">
                                            <col style="width:200px">
                                            <col style="width:250px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:300px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:300px">
                                            <col style="width:300px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:250px">
                                            <col style="width:250px">
                                        </colgroup>
                                        <thead role="rowgroup">
                                            <tr role="row">
                                                <th scope="col" role="columnheader" data-field="EnrollmentReclamaReviewId"
                                                    aria-haspopup="true" rowspan="1" data-title="Review ID" data-index="0"
                                                    id="8a9507be-9537-4ab4-b4c8-b902cca4af3c" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Review ID</a></th>
                                                <th scope="col" role="columnheader" data-field="FY" aria-haspopup="true" rowspan="1"
                                                    data-title="FY" data-index="1" id="e5f08ed4-cff0-4ff2-acd6-b61dd2eb622c"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">FY</a></th>
                                                <th scope="col" role="columnheader" data-field="MarketName" aria-haspopup="true"
                                                    rowspan="1" data-title="Market Name" data-index="2"
                                                    id="df0691fa-42dc-4f2f-9556-77e272be38b6"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Market Name</a></th>
                                                <th scope="col" role="columnheader" data-field="PARENT_DMIS_NAME"
                                                    aria-haspopup="true" rowspan="1" data-title="Parent DMIS Name" data-index="3"
                                                    id="f36dfd42-6423-4b49-96d9-6851f4819246"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Parent DMIS Name</a></th>
                                                <th scope="col" role="columnheader" data-field="DMIS_NAME" aria-haspopup="true"
                                                    rowspan="1" data-title="DMIS Name" data-index="4"
                                                    id="bf18a341-135e-4d74-b12d-6387265facb9"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DMIS Name</a></th>
                                                <th scope="col" role="columnheader" data-field="DMIS_ID" aria-haspopup="true"
                                                    rowspan="1" data-title="DMIS ID" data-index="5"
                                                    id="486edd90-7411-4a82-937b-a0a5b6250020"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DMIS ID</a></th>
                                                <th scope="col" role="columnheader" data-field="GENDER" aria-haspopup="true"
                                                    rowspan="1" data-title="Gender" data-index="6"
                                                    id="1574c0f5-e10f-472f-ac3a-f728d5680b1a"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Gender</a></th>
                                                <th scope="col" role="columnheader" data-field="AD_FLAG" aria-haspopup="true"
                                                    rowspan="1" data-title="AD Status" data-index="7"
                                                    id="0447b4b0-ab87-472a-ae3e-33c665d36988"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">AD Status</a></th>
                                                <th scope="col" role="columnheader" data-field="AGE_0_4_FORECAST"
                                                    aria-haspopup="true" rowspan="1" data-title="Ages 0-4 Forecast" data-index="8"
                                                    id="e4f18dc3-b35a-4b09-9421-06dd12486603"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Ages 0-4 Forecast</a></th>
                                                <th scope="col" role="columnheader" data-field="AGE_5_14_FORECAST"
                                                    aria-haspopup="true" rowspan="1" data-title="Ages 5-14 Forecast" data-index="9"
                                                    id="6c615fee-e44e-476e-819a-b224de3b67de"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Ages 5-14 Forecast</a></th>
                                                <th scope="col" role="columnheader" data-field="AGE_15_17_FORECAST"
                                                    aria-haspopup="true" rowspan="1" data-title="Ages 15-17 Forecast"
                                                    data-index="10" id="e9f71850-f6ee-4521-835d-b33f10bfd9ce"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Ages 15-17 Forecast</a></th>
                                                <th scope="col" role="columnheader" data-field="AGE_18_24_FORECAST"
                                                    aria-haspopup="true" rowspan="1" data-title="Ages 18-24 Forecast"
                                                    data-index="11" id="d9486e6d-c0ab-48c4-934a-29825d921755"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Ages 18-24 Forecast</a></th>
                                                <th scope="col" role="columnheader" data-field="AGE_25_34_FORECAST"
                                                    aria-haspopup="true" rowspan="1" data-title="Ages 25-34 Forecast"
                                                    data-index="12" id="46a3fa7a-e339-40d0-9ce5-f58156d33f92"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Ages 25-34 Forecast</a></th>
                                                <th scope="col" role="columnheader" data-field="AGE_35_44_FORECAST"
                                                    aria-haspopup="true" rowspan="1" data-title="Ages 35-44 Forecast"
                                                    data-index="13" id="d90f7984-898e-43da-b175-35d3c1676f4a"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Ages 35-44 Forecast</a></th>
                                                <th scope="col" role="columnheader" data-field="AGE_45_64_FORECAST"
                                                    aria-haspopup="true" rowspan="1" data-title="Ages 45-64 Forecast"
                                                    data-index="14" id="94d414bc-c396-4a0a-8a28-d22148dbd9f5"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Ages 45-64 Forecast</a></th>
                                                <th scope="col" role="columnheader" data-field="AGE_65PLUS_FORECAST"
                                                    aria-haspopup="true" rowspan="1" data-title="Ages 65+ Forecast" data-index="15"
                                                    id="e57f06d6-18cd-4a19-a976-ad51c50b6321"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Ages 65+ Forecast</a></th>
                                                <th scope="col" role="columnheader" data-field="AGE_0_4_ADJUSTED"
                                                    aria-haspopup="true" rowspan="1" data-title="Ages 0-4 Adjusted" data-index="16"
                                                    id="b02ee6ac-5b1f-49ed-9ed1-8b850bd0faab"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Ages 0-4 Adjusted</a></th>
                                                <th scope="col" role="columnheader" data-field="AGE_5_14_ADJUSTED"
                                                    aria-haspopup="true" rowspan="1" data-title="Ages 5-14 Adjusted" data-index="17"
                                                    id="67dd05ac-143a-471f-95c8-64e04b78236c"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Ages 5-14 Adjusted</a></th>
                                                <th scope="col" role="columnheader" data-field="AGE_15_17_ADJUSTED"
                                                    aria-haspopup="true" rowspan="1" data-title="Ages 15-17 Adjusted"
                                                    data-index="18" id="c97c9a51-632b-4446-b545-1458ce64f1b4"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Ages 15-17 Adjusted</a></th>
                                                <th scope="col" role="columnheader" data-field="AGE_18_24_ADJUSTED"
                                                    aria-haspopup="true" rowspan="1" data-title="Ages 18-24 Adjusted"
                                                    data-index="19" id="a0b70c53-2932-4026-bc8d-f956e2fb01c7"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Ages 18-24 Adjusted</a></th>
                                                <th scope="col" role="columnheader" data-field="AGE_25_34_ADJUSTED"
                                                    aria-haspopup="true" rowspan="1" data-title="Ages 25-34 Adjusted"
                                                    data-index="20" id="19f912e3-f218-4def-bb4f-b794603b641a"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Ages 25-34 Adjusted</a></th>
                                                <th scope="col" role="columnheader" data-field="AGE_35_44_ADJUSTED"
                                                    aria-haspopup="true" rowspan="1" data-title="Ages 35-44 Adjusted"
                                                    data-index="21" id="b632722e-dd8a-4b75-a573-6672749c05ff"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Ages 35-44 Adjusted</a></th>
                                                <th scope="col" role="columnheader" data-field="AGE_45_64_ADJUSTED"
                                                    aria-haspopup="true" rowspan="1" data-title="Ages 45-64 Adjusted"
                                                    data-index="22" id="36f1df30-bcef-491b-9a4e-9bdad2309662"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Ages 45-64 Adjusted</a></th>
                                                <th scope="col" role="columnheader" data-field="AGE_65PLUS_ADJUSTED"
                                                    aria-haspopup="true" rowspan="1" data-title="Ages 65+ Adjusted" data-index="23"
                                                    id="922feff5-a974-464d-8301-19a406df3c26"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Ages 65+ Adjusted</a></th>
                                                <th scope="col" role="columnheader" data-field="AD_Value" aria-haspopup="true"
                                                    rowspan="1" data-title="AD Value" data-index="24"
                                                    id="92b4c66a-2c0b-4085-b397-ce480ae96fa8"
                                                    style="display:none;white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">AD Value</a></th>
                                                <th scope="col" role="columnheader" data-field="ADFM_Value" aria-haspopup="true"
                                                    rowspan="1" data-title="ADFM Value" data-index="25"
                                                    id="2810c64f-1e84-40d1-9f1e-3dd1b1a072e7"
                                                    style="display:none;white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">ADFM Value</a></th>
                                                <th scope="col" role="columnheader" data-field="RET_Value" aria-haspopup="true"
                                                    rowspan="1" data-title="RET Value" data-index="26"
                                                    id="0ef8bc2b-b1c7-4857-b62f-c6cdba62e620"
                                                    style="display:none;white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">RET Value</a></th>
                                                <th scope="col" role="columnheader" data-field="All_Other_Value"
                                                    aria-haspopup="true" rowspan="1" data-title="All Other Value" data-index="27"
                                                    id="b0a20722-3b6d-4594-9f00-e2711508d50c"
                                                    style="display:none;white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">All Other Value</a></th>
                                                <th scope="col" role="columnheader" data-field="Adjusted_AD_Value"
                                                    aria-haspopup="true" rowspan="1" data-title="Adjusted AD Value" data-index="28"
                                                    id="02b23adc-3f98-4fff-a060-d0c63ac6fe62"
                                                    style="display:none;white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Adjusted AD Value</a></th>
                                                <th scope="col" role="columnheader" data-field="Adjusted_ADFM_Value"
                                                    aria-haspopup="true" rowspan="1" data-title="Adjusted ADFM Value"
                                                    data-index="29" id="abd3fb7e-ce9b-4f84-886b-f13ea461ece7"
                                                    style="display:none;white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Adjusted ADFM Value</a></th>
                                                <th scope="col" role="columnheader" data-field="Adjusted_RET_Value"
                                                    aria-haspopup="true" rowspan="1" data-title="Adjusted RET Value" data-index="30"
                                                    id="2b0efc60-fd21-40f6-a6b9-7db0ba72460f"
                                                    style="display:none;white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Adjusted RET Value</a></th>
                                                <th scope="col" role="columnheader" data-field="Adjusted_All_Other_Value"
                                                    aria-haspopup="true" rowspan="1" data-title="Adjusted All Other Value"
                                                    data-index="31" id="2009128b-5caf-4794-a891-e7c5cb0ba041"
                                                    style="display:none;white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Adjusted All Other Value</a></th>
                                                <th scope="col" role="columnheader" data-field="FTE_MIL" aria-haspopup="true"
                                                    rowspan="1" data-title="FTE MIL" data-index="32"
                                                    id="d32565de-af22-4a32-95db-b56c9a511537"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">FTE MIL</a></th>
                                                <th scope="col" role="columnheader" data-field="FTE_CIV" aria-haspopup="true"
                                                    rowspan="1" data-title="FTE CIV" data-index="33"
                                                    id="9178954f-4688-443f-81f8-1fe3c377d1fe"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">FTE CIV</a></th>
                                                <th scope="col" role="columnheader" data-field="FTE_CNTR" aria-haspopup="true"
                                                    rowspan="1" data-title="FTE CNTR" data-index="34"
                                                    id="3bb4361e-e9a1-4712-922f-94c3f5a4bceb"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">FTE CNTR</a></th>
                                                <th scope="col" role="columnheader" data-field="INCREASE_DECREASE"
                                                    aria-haspopup="true" rowspan="1" data-title="Increase/Decrease" data-index="35"
                                                    id="f0181d24-40ff-41f9-9056-92926f19f1f6"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Increase/Decrease</a></th>
                                                <th scope="col" role="columnheader" data-field="Capability_Capacity"
                                                    aria-haspopup="true" rowspan="1" data-title="Capability/Capacity"
                                                    data-index="36" id="b92f0e0e-06f7-4d73-8c6c-3bbae8286b86"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Capability/Capacity</a></th>
                                                <th scope="col" role="columnheader" data-field="Adjustment_Reason"
                                                    aria-haspopup="true" rowspan="1" data-title="Adjustment Reason" data-index="37"
                                                    id="6ce9315c-8386-40aa-be6e-657aef503d41"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Adjustment Reason</a></th>
                                                <th scope="col" role="columnheader" data-field="NetworkStaffingRequest"
                                                    aria-haspopup="true" rowspan="1" data-title="Network/Staffing Request"
                                                    data-index="38" id="b0292220-9109-4ea6-b62a-0d1402813e38"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Network/Staffing Request</a></th>
                                                <th scope="col" role="columnheader" data-field="InitiativeNumber"
                                                    aria-haspopup="true" rowspan="1" data-title="SPIDR ID" data-index="39"
                                                    id="50aa9fbb-2eaf-41f7-908d-fc4dae915758"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">SPIDR ID</a></th>
                                                <th scope="col" role="columnheader" data-field="Expected_Start_Date"
                                                    aria-haspopup="true" rowspan="1" data-title="Expected Start Date"
                                                    data-index="40" id="27813300-7a59-4260-87d8-b39af43ee1fb"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Expected Start Date</a></th>
                                                <th scope="col" role="columnheader" data-field="Expected_End_Date"
                                                    aria-haspopup="true" rowspan="1" data-title="Expected End Date" data-index="41"
                                                    id="5741068f-9e54-4654-98ff-0bb81d8fe758"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Expected End Date</a></th>
                                                <th scope="col" role="columnheader" data-field="Created" aria-haspopup="true"
                                                    rowspan="1" data-title="Created" data-index="42"
                                                    id="ac4517e8-2777-4350-a280-73a14a27a2be"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Created</a></th>
                                                <th scope="col" role="columnheader" data-field="Comments" aria-haspopup="true"
                                                    rowspan="1" data-title="Comments" data-index="43"
                                                    id="53ff11c4-6926-43ae-8732-d77f1e60dc25"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Comments</a></th>
                                                <th scope="col" role="columnheader" data-field="Q1" aria-haspopup="true" rowspan="1"
                                                    data-title="DHA Market Integration Business Operations Specialist Review"
                                                    data-index="44" id="5fe5e78f-614a-4c6b-9ae9-d9d50f9595c6"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: orange;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA Market Integration Business Operations Specialist
                                                        Review</a></th>
                                                <th scope="col" role="columnheader" data-field="Q1_Comments" aria-haspopup="true"
                                                    rowspan="1"
                                                    data-title="DHA Market Integration Business Operations Specialist Review Comments"
                                                    data-index="45" id="aafb0982-d672-43cf-9909-2a837f46b898"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: orange;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA Market Integration Business Operations Specialist Review
                                                        Comments</a></th>
                                                <th scope="col" role="columnheader" data-field="Q3" aria-haspopup="true" rowspan="1"
                                                    data-title="DHA Health Care Optimization" data-index="46"
                                                    id="b1d55a16-b2d4-4825-ac8b-c04dd1f3cf22"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: orange;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA Health Care Optimization</a></th>
                                                <th scope="col" role="columnheader" data-field="Q3_Comments" aria-haspopup="true"
                                                    rowspan="1" data-title="DHA Health Care Optimization Comments" data-index="47"
                                                    id="b1c59867-7240-4baa-8557-93af85037015"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: orange;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA Health Care Optimization Comments</a></th>
                                                <th scope="col" role="columnheader" data-field="Q6" aria-haspopup="true" rowspan="1"
                                                    data-title="DHA Adjudication Recommendation (HCO Huddle)" data-index="48"
                                                    id="1752a539-8ac6-4a01-bb8f-fcf96306c30a"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: orange;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA Adjudication Recommendation (HCO Huddle)</a></th>
                                                <th scope="col" role="columnheader" data-field="Q6_Comments" aria-haspopup="true"
                                                    rowspan="1" data-title="DHA Adjudication Recommendation (HCO Huddle) Comments"
                                                    data-index="49" id="479e5368-54bf-4c3f-b10b-b05b0863e7b4"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: orange;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA Adjudication Recommendation (HCO Huddle) Comments</a></th>
                                                <th scope="col" role="columnheader" data-field="Q7" aria-haspopup="true" rowspan="1"
                                                    data-title="DHA HSD Evaluation" data-index="50"
                                                    id="436e18ad-093d-4cb2-8892-a49cf1fff9dd"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: dodgerblue;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA HSD Evaluation</a></th>
                                                <th scope="col" role="columnheader" data-field="Q7_Comments" aria-haspopup="true"
                                                    rowspan="1" data-title="DHA HSD Evaluation Comments" data-index="51"
                                                    id="9cbae104-c3a9-45d1-8def-de8c268c69de"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: dodgerblue;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA HSD Evaluation Comments</a></th>
                                                <th scope="col" role="columnheader" data-field="Q8" aria-haspopup="true" rowspan="1"
                                                    data-title="QPP Planning Evaluation" data-index="52"
                                                    id="32e31b44-e8e1-4a0e-8b66-f63fd7f17099"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: darkred;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">QPP Planning Evaluation</a></th>
                                                <th scope="col" role="columnheader" data-field="Q8_Comments" aria-haspopup="true"
                                                    rowspan="1" data-title="QPP Planning Comments" data-index="53"
                                                    id="26801ebb-b699-4f03-af65-10f000f2a135"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: darkred;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">QPP Planning Comments</a></th>
                                                <th scope="col" role="columnheader" data-field="Q1_Updated_DTTM"
                                                    aria-haspopup="true" rowspan="1" data-title="Q1 Updated DTTM" data-index="54"
                                                    id="6b857350-cbb9-49f0-ba4a-b351e46b8870" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q1 Updated DTTM</a></th>
                                                <th scope="col" role="columnheader" data-field="Q2_Updated_DTTM"
                                                    aria-haspopup="true" rowspan="1" data-title="Q2 Updated DTTM" data-index="55"
                                                    id="928b1150-22df-43ff-9413-8319f8c425dc" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q2 Updated DTTM</a></th>
                                                <th scope="col" role="columnheader" data-field="Q3_Updated_DTTM"
                                                    aria-haspopup="true" rowspan="1" data-title="Q3 Updated DTTM" data-index="56"
                                                    id="5ecd489b-cbdb-4ed4-b80b-de089b98ad0a" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q3 Updated DTTM</a></th>
                                                <th scope="col" role="columnheader" data-field="Q4_Updated_DTTM"
                                                    aria-haspopup="true" rowspan="1" data-title="Q4 Updated DTTM" data-index="57"
                                                    id="d22b78f9-f09b-468e-9c6b-3a64a31e0884" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q4 Updated DTTM</a></th>
                                                <th scope="col" role="columnheader" data-field="Q5_Updated_DTTM"
                                                    aria-haspopup="true" rowspan="1" data-title="Q5 Updated DTTM" data-index="58"
                                                    id="380d62e8-06fb-4901-9a7d-ad66ce1d41b0" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q5 Updated DTTM</a></th>
                                                <th scope="col" role="columnheader" data-field="Q6_Updated_DTTM"
                                                    aria-haspopup="true" rowspan="1" data-title="Q6 Updated DTTM" data-index="59"
                                                    id="c237b15b-0576-4683-98ac-201222baf65a" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q6 Updated DTTM</a></th>
                                                <th scope="col" role="columnheader" data-field="Q7_Updated_DTTM"
                                                    aria-haspopup="true" rowspan="1" data-title="Q7 Updated DTTM" data-index="60"
                                                    id="84f09df2-0ac1-4d25-9a35-215eaf2a9015" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q7 Updated DTTM</a></th>
                                                <th scope="col" role="columnheader" data-field="Q8_Updated_DTTM"
                                                    aria-haspopup="true" rowspan="1" data-title="Q8 Updated DTTM" data-index="61"
                                                    id="1e8f9ed2-d356-4321-b568-8ed3d320767f" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q8 Updated DTTM</a></th>
                                                <th scope="col" role="columnheader" data-field="Q1_Updated_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Q1 Updated UserId" data-index="62"
                                                    id="5611a263-73f0-437b-9c13-0215d70e55f3" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q1 Updated UserId</a></th>
                                                <th scope="col" role="columnheader" data-field="Q2_Updated_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Q2 Updated UserId" data-index="63"
                                                    id="3875f4bc-3139-4772-bd5e-60c43f02e220" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q2 Updated UserId</a></th>
                                                <th scope="col" role="columnheader" data-field="Q3_Updated_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Q3 Updated UserId" data-index="64"
                                                    id="c31dc3f1-2204-4b48-becb-6104bfe9a396" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q3 Updated UserId</a></th>
                                                <th scope="col" role="columnheader" data-field="Q4_Updated_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Q4 Updated UserId" data-index="65"
                                                    id="be5bcc40-cd89-492a-8a36-b872978efa25" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q4 Updated UserId</a></th>
                                                <th scope="col" role="columnheader" data-field="Q5_Updated_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Q5 Updated UserId" data-index="66"
                                                    id="46b4722f-fc0e-481a-a41a-a050e1bdd420" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q5 Updated UserId</a></th>
                                                <th scope="col" role="columnheader" data-field="Q6_Updated_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Q6 Updated UserId" data-index="67"
                                                    id="d757a1bd-06af-4dd8-b488-4b763d615681" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q6 Updated UserId</a></th>
                                                <th scope="col" role="columnheader" data-field="Q7_Updated_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Q7 Updated UserId" data-index="68"
                                                    id="ac9672fb-6774-49de-9dce-36b6b9f8c2cb" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q7 Updated UserId</a></th>
                                                <th scope="col" role="columnheader" data-field="Q8_Updated_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Q8 Updated UserId" data-index="69"
                                                    id="ac1cc97d-9124-4dee-ac28-c2f8e330d49c" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q8 Updated UserId</a></th>
                                                <th scope="col" role="columnheader" data-field="CreatedBy_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Created By User" data-index="70"
                                                    id="902711e7-3f44-4e03-b3e1-a9678d51dcb4" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Created By User</a></th>
                                                <th scope="col" role="columnheader" data-field="Created_DTTM" aria-haspopup="true"
                                                    rowspan="1" data-title="Time Created" data-index="71"
                                                    id="932286c4-92d3-463f-9b0b-a56a1483fede" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Time Created</a></th>
                                                <th scope="col" role="columnheader" data-field="UpdatedBy_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Last Updated By" data-index="72"
                                                    id="746df246-c436-4a6e-8a0d-c60306e0272f" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Last Updated By</a></th>
                                                <th scope="col" role="columnheader" data-field="Updated_DTTM" aria-haspopup="true"
                                                    rowspan="1" data-title="Last Updated" data-index="73"
                                                    id="dd5457d0-3ff1-4be4-adbd-ea7630086fa2" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Last Updated</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div class="k-resize-handle" style="top: 0px; left: 597px; height: 169px; width: 9px;">
                                        <div class="k-resize-handle-inner"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="k-grid-content k-auto-scrollable">
                                <table role="grid" tabindex="0" aria-activedescendant="enrollmentTrackerGrid_active_cell">
                                    <colgroup>
                                        <col style="width:100px">
                                        <col style="width:150px">
                                        <col style="width:200px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:200px">
                                        <col style="width:150px">
                                        <col style="width:200px">
                                        <col style="width:250px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:300px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:300px">
                                        <col style="width:300px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:250px">
                                        <col style="width:250px">
                                    </colgroup>
                                    <tbody role="rowgroup">
                                        <tr data-uid="268afe38-c91a-49da-a7eb-cce593d5ca53" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="8a9507be-9537-4ab4-b4c8-b902cca4af3c" role="gridcell">679</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e5f08ed4-cff0-4ff2-acd6-b61dd2eb622c" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="df0691fa-42dc-4f2f-9556-77e272be38b6" role="gridcell">FLORIDA
                                                PANHANDLE</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f36dfd42-6423-4b49-96d9-6851f4819246" role="gridcell">AF-C-325th
                                                MEDGRP-TYNDALL</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bf18a341-135e-4d74-b12d-6387265facb9" role="gridcell">AF-C-325th
                                                MEDGRP-TYNDALL</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="486edd90-7411-4a82-937b-a0a5b6250020" role="gridcell">0043</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="1574c0f5-e10f-472f-ac3a-f728d5680b1a" role="gridcell">Male</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="0447b4b0-ab87-472a-ae3e-33c665d36988" role="gridcell">NON-ACTIVE
                                                DUTY</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e4f18dc3-b35a-4b09-9421-06dd12486603" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6c615fee-e44e-476e-819a-b224de3b67de" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e9f71850-f6ee-4521-835d-b33f10bfd9ce" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d9486e6d-c0ab-48c4-934a-29825d921755" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="46a3fa7a-e339-40d0-9ce5-f58156d33f92" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d90f7984-898e-43da-b175-35d3c1676f4a" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="94d414bc-c396-4a0a-8a28-d22148dbd9f5" role="gridcell">4</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e57f06d6-18cd-4a19-a976-ad51c50b6321" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b02ee6ac-5b1f-49ed-9ed1-8b850bd0faab" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="67dd05ac-143a-471f-95c8-64e04b78236c" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c97c9a51-632b-4446-b545-1458ce64f1b4" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a0b70c53-2932-4026-bc8d-f956e2fb01c7" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="19f912e3-f218-4def-bb4f-b794603b641a" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b632722e-dd8a-4b75-a573-6672749c05ff" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="36f1df30-bcef-491b-9a4e-9bdad2309662" role="gridcell">-4</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="922feff5-a974-464d-8301-19a406df3c26" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="92b4c66a-2c0b-4085-b397-ce480ae96fa8" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2810c64f-1e84-40d1-9f1e-3dd1b1a072e7" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="0ef8bc2b-b1c7-4857-b62f-c6cdba62e620" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="b0a20722-3b6d-4594-9f00-e2711508d50c" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="02b23adc-3f98-4fff-a060-d0c63ac6fe62" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="abd3fb7e-ce9b-4f84-886b-f13ea461ece7" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2b0efc60-fd21-40f6-a6b9-7db0ba72460f" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2009128b-5caf-4794-a891-e7c5cb0ba041" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d32565de-af22-4a32-95db-b56c9a511537" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="9178954f-4688-443f-81f8-1fe3c377d1fe" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3bb4361e-e9a1-4712-922f-94c3f5a4bceb" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f0181d24-40ff-41f9-9056-92926f19f1f6" role="gridcell">Decrease
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b92f0e0e-06f7-4d73-8c6c-3bbae8286b86" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6ce9315c-8386-40aa-be6e-657aef503d41" role="gridcell">Mission
                                                Change
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b0292220-9109-4ea6-b62a-0d1402813e38" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="50aa9fbb-2eaf-41f7-908d-fc4dae915758" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="27813300-7a59-4260-87d8-b39af43ee1fb" role="gridcell">2/4/2021
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="5741068f-9e54-4654-98ff-0bb81d8fe758" role="gridcell">9/30/2022
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ac4517e8-2777-4350-a280-73a14a27a2be" role="gridcell">Michelle
                                                Isbester</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="53ff11c4-6926-43ae-8732-d77f1e60dc25" role="gridcell">We do not
                                                have any non-AD enrolled to us as we are a troop only clinic. </td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fe5e78f-614a-4c6b-9ae9-d9d50f9595c6" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="aafb0982-d672-43cf-9909-2a837f46b898" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector support request for this reclama
                                                under network-staffing request field. -Tamara Fatzinger, Market Integration
                                                Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d55a16-b2d4-4825-ac8b-c04dd1f3cf22" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1c59867-7240-4baa-8557-93af85037015" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="1752a539-8ac6-4a01-bb8f-fcf96306c30a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="479e5368-54bf-4c3f-b10b-b05b0863e7b4" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="436e18ad-093d-4cb2-8892-a49cf1fff9dd" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="9cbae104-c3a9-45d1-8def-de8c268c69de" role="gridcell">Concur with
                                                changes to the Enrollment Cohort well within reason based on historical workload.
                                            </td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="32e31b44-e8e1-4a0e-8b66-f63fd7f17099" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="26801ebb-b699-4f03-af65-10f000f2a135" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6b857350-cbb9-49f0-ba4a-b351e46b8870" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="928b1150-22df-43ff-9413-8319f8c425dc" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5ecd489b-cbdb-4ed4-b80b-de089b98ad0a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d22b78f9-f09b-468e-9c6b-3a64a31e0884" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="380d62e8-06fb-4901-9a7d-ad66ce1d41b0" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c237b15b-0576-4683-98ac-201222baf65a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="84f09df2-0ac1-4d25-9a35-215eaf2a9015" role="gridcell">Wed Apr 14
                                                2021 16:29:16 GMT-0500 (Central Daylight Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="1e8f9ed2-d356-4321-b568-8ed3d320767f" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5611a263-73f0-437b-9c13-0215d70e55f3" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="3875f4bc-3139-4772-bd5e-60c43f02e220" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c31dc3f1-2204-4b48-becb-6104bfe9a396" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="be5bcc40-cd89-492a-8a36-b872978efa25" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="46b4722f-fc0e-481a-a41a-a050e1bdd420" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d757a1bd-06af-4dd8-b488-4b763d615681" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac9672fb-6774-49de-9dce-36b6b9f8c2cb" role="gridcell">51</td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac1cc97d-9124-4dee-ac28-c2f8e330d49c" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="902711e7-3f44-4e03-b3e1-a9678d51dcb4" role="gridcell">Michelle
                                                Isbester</td>
                                            <td style="display:none" class=""
                                                aria-describedby="932286c4-92d3-463f-9b0b-a56a1483fede" role="gridcell">Thu Feb 04
                                                2021 18:58:44 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="746df246-c436-4a6e-8a0d-c60306e0272f" role="gridcell">Michelle
                                                Isbester</td>
                                            <td style="display:none" class=""
                                                aria-describedby="dd5457d0-3ff1-4be4-adbd-ea7630086fa2" role="gridcell">Thu Feb 04
                                                2021 18:59:25 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                        <tr class="k-alt" data-uid="54b8e5e8-036b-4798-9c29-10d9f027464c" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="8a9507be-9537-4ab4-b4c8-b902cca4af3c" role="gridcell">680</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e5f08ed4-cff0-4ff2-acd6-b61dd2eb622c" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="df0691fa-42dc-4f2f-9556-77e272be38b6" role="gridcell">HAWAII</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f36dfd42-6423-4b49-96d9-6851f4819246" role="gridcell">AMC
                                                TRIPLER-SHAFTER</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bf18a341-135e-4d74-b12d-6387265facb9" role="gridcell">AMC
                                                TRIPLER-SHAFTER</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="486edd90-7411-4a82-937b-a0a5b6250020" role="gridcell">0052</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="1574c0f5-e10f-472f-ac3a-f728d5680b1a" role="gridcell">Female</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="0447b4b0-ab87-472a-ae3e-33c665d36988" role="gridcell">NON-ACTIVE
                                                DUTY</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e4f18dc3-b35a-4b09-9421-06dd12486603" role="gridcell">1250</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6c615fee-e44e-476e-819a-b224de3b67de" role="gridcell">1719</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e9f71850-f6ee-4521-835d-b33f10bfd9ce" role="gridcell">401</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d9486e6d-c0ab-48c4-934a-29825d921755" role="gridcell">1052</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="46a3fa7a-e339-40d0-9ce5-f58156d33f92" role="gridcell">1645</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d90f7984-898e-43da-b175-35d3c1676f4a" role="gridcell">1410</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="94d414bc-c396-4a0a-8a28-d22148dbd9f5" role="gridcell">2198</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e57f06d6-18cd-4a19-a976-ad51c50b6321" role="gridcell">15</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b02ee6ac-5b1f-49ed-9ed1-8b850bd0faab" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="67dd05ac-143a-471f-95c8-64e04b78236c" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c97c9a51-632b-4446-b545-1458ce64f1b4" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a0b70c53-2932-4026-bc8d-f956e2fb01c7" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="19f912e3-f218-4def-bb4f-b794603b641a" role="gridcell">1239</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b632722e-dd8a-4b75-a573-6672749c05ff" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="36f1df30-bcef-491b-9a4e-9bdad2309662" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="922feff5-a974-464d-8301-19a406df3c26" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="92b4c66a-2c0b-4085-b397-ce480ae96fa8" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2810c64f-1e84-40d1-9f1e-3dd1b1a072e7" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="0ef8bc2b-b1c7-4857-b62f-c6cdba62e620" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="b0a20722-3b6d-4594-9f00-e2711508d50c" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="02b23adc-3f98-4fff-a060-d0c63ac6fe62" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="abd3fb7e-ce9b-4f84-886b-f13ea461ece7" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2b0efc60-fd21-40f6-a6b9-7db0ba72460f" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2009128b-5caf-4794-a891-e7c5cb0ba041" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d32565de-af22-4a32-95db-b56c9a511537" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="9178954f-4688-443f-81f8-1fe3c377d1fe" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3bb4361e-e9a1-4712-922f-94c3f5a4bceb" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f0181d24-40ff-41f9-9056-92926f19f1f6" role="gridcell">Increase
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b92f0e0e-06f7-4d73-8c6c-3bbae8286b86" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6ce9315c-8386-40aa-be6e-657aef503d41" role="gridcell">Other
                                                (specify in comments)
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b0292220-9109-4ea6-b62a-0d1402813e38" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="50aa9fbb-2eaf-41f7-908d-fc4dae915758" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="27813300-7a59-4260-87d8-b39af43ee1fb" role="gridcell">10/1/2021
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="5741068f-9e54-4654-98ff-0bb81d8fe758" role="gridcell">9/30/2022
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ac4517e8-2777-4350-a280-73a14a27a2be" role="gridcell">Amy
                                                Bonilla-Beltran</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="53ff11c4-6926-43ae-8732-d77f1e60dc25" role="gridcell">Enrollment
                                                increase</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fe5e78f-614a-4c6b-9ae9-d9d50f9595c6" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="aafb0982-d672-43cf-9909-2a837f46b898" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector support request for this reclama
                                                under network-staffing request field. -Tamara Fatzinger, Market Integration
                                                Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d55a16-b2d4-4825-ac8b-c04dd1f3cf22" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1c59867-7240-4baa-8557-93af85037015" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="1752a539-8ac6-4a01-bb8f-fcf96306c30a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="479e5368-54bf-4c3f-b10b-b05b0863e7b4" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="436e18ad-093d-4cb2-8892-a49cf1fff9dd" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="9cbae104-c3a9-45d1-8def-de8c268c69de" role="gridcell">Concur with
                                                the requested Increase for Enrollment Cohorts, well within reason based on
                                                historical workload.</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="32e31b44-e8e1-4a0e-8b66-f63fd7f17099" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="26801ebb-b699-4f03-af65-10f000f2a135" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6b857350-cbb9-49f0-ba4a-b351e46b8870" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="928b1150-22df-43ff-9413-8319f8c425dc" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5ecd489b-cbdb-4ed4-b80b-de089b98ad0a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d22b78f9-f09b-468e-9c6b-3a64a31e0884" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="380d62e8-06fb-4901-9a7d-ad66ce1d41b0" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c237b15b-0576-4683-98ac-201222baf65a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="84f09df2-0ac1-4d25-9a35-215eaf2a9015" role="gridcell">Wed Apr 14
                                                2021 16:30:19 GMT-0500 (Central Daylight Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="1e8f9ed2-d356-4321-b568-8ed3d320767f" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5611a263-73f0-437b-9c13-0215d70e55f3" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="3875f4bc-3139-4772-bd5e-60c43f02e220" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c31dc3f1-2204-4b48-becb-6104bfe9a396" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="be5bcc40-cd89-492a-8a36-b872978efa25" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="46b4722f-fc0e-481a-a41a-a050e1bdd420" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d757a1bd-06af-4dd8-b488-4b763d615681" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac9672fb-6774-49de-9dce-36b6b9f8c2cb" role="gridcell">51</td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac1cc97d-9124-4dee-ac28-c2f8e330d49c" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="902711e7-3f44-4e03-b3e1-a9678d51dcb4" role="gridcell">Amy
                                                Bonilla-Beltran</td>
                                            <td style="display:none" class=""
                                                aria-describedby="932286c4-92d3-463f-9b0b-a56a1483fede" role="gridcell">Wed Jan 27
                                                2021 01:07:56 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="746df246-c436-4a6e-8a0d-c60306e0272f" role="gridcell">Amy
                                                Bonilla-Beltran</td>
                                            <td style="display:none" class=""
                                                aria-describedby="dd5457d0-3ff1-4be4-adbd-ea7630086fa2" role="gridcell">Tue Feb 02
                                                2021 18:24:03 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                        <tr data-uid="d9da996e-ab3c-4252-9bab-ab779b13e22e" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="8a9507be-9537-4ab4-b4c8-b902cca4af3c" role="gridcell">681</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e5f08ed4-cff0-4ff2-acd6-b61dd2eb622c" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="df0691fa-42dc-4f2f-9556-77e272be38b6" role="gridcell">HAWAII</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f36dfd42-6423-4b49-96d9-6851f4819246" role="gridcell">AMC
                                                TRIPLER-SHAFTER</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bf18a341-135e-4d74-b12d-6387265facb9" role="gridcell">AMC
                                                TRIPLER-SHAFTER</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="486edd90-7411-4a82-937b-a0a5b6250020" role="gridcell">0052</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="1574c0f5-e10f-472f-ac3a-f728d5680b1a" role="gridcell">Female</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="0447b4b0-ab87-472a-ae3e-33c665d36988" role="gridcell">NON-ACTIVE
                                                DUTY</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e4f18dc3-b35a-4b09-9421-06dd12486603" role="gridcell">1250</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6c615fee-e44e-476e-819a-b224de3b67de" role="gridcell">1719</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e9f71850-f6ee-4521-835d-b33f10bfd9ce" role="gridcell">401</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d9486e6d-c0ab-48c4-934a-29825d921755" role="gridcell">1052</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="46a3fa7a-e339-40d0-9ce5-f58156d33f92" role="gridcell">1645</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d90f7984-898e-43da-b175-35d3c1676f4a" role="gridcell">1410</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="94d414bc-c396-4a0a-8a28-d22148dbd9f5" role="gridcell">2198</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e57f06d6-18cd-4a19-a976-ad51c50b6321" role="gridcell">15</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b02ee6ac-5b1f-49ed-9ed1-8b850bd0faab" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="67dd05ac-143a-471f-95c8-64e04b78236c" role="gridcell">500</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c97c9a51-632b-4446-b545-1458ce64f1b4" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a0b70c53-2932-4026-bc8d-f956e2fb01c7" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="19f912e3-f218-4def-bb4f-b794603b641a" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b632722e-dd8a-4b75-a573-6672749c05ff" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="36f1df30-bcef-491b-9a4e-9bdad2309662" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="922feff5-a974-464d-8301-19a406df3c26" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="92b4c66a-2c0b-4085-b397-ce480ae96fa8" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2810c64f-1e84-40d1-9f1e-3dd1b1a072e7" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="0ef8bc2b-b1c7-4857-b62f-c6cdba62e620" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="b0a20722-3b6d-4594-9f00-e2711508d50c" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="02b23adc-3f98-4fff-a060-d0c63ac6fe62" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="abd3fb7e-ce9b-4f84-886b-f13ea461ece7" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2b0efc60-fd21-40f6-a6b9-7db0ba72460f" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2009128b-5caf-4794-a891-e7c5cb0ba041" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d32565de-af22-4a32-95db-b56c9a511537" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="9178954f-4688-443f-81f8-1fe3c377d1fe" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3bb4361e-e9a1-4712-922f-94c3f5a4bceb" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f0181d24-40ff-41f9-9056-92926f19f1f6" role="gridcell">Increase
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b92f0e0e-06f7-4d73-8c6c-3bbae8286b86" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6ce9315c-8386-40aa-be6e-657aef503d41" role="gridcell">Other
                                                (specify in comments)
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b0292220-9109-4ea6-b62a-0d1402813e38" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="50aa9fbb-2eaf-41f7-908d-fc4dae915758" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="27813300-7a59-4260-87d8-b39af43ee1fb" role="gridcell">10/1/2021
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="5741068f-9e54-4654-98ff-0bb81d8fe758" role="gridcell">9/30/2022
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ac4517e8-2777-4350-a280-73a14a27a2be" role="gridcell">Amy
                                                Bonilla-Beltran</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="53ff11c4-6926-43ae-8732-d77f1e60dc25" role="gridcell">Enrollment
                                                increase</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fe5e78f-614a-4c6b-9ae9-d9d50f9595c6" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="aafb0982-d672-43cf-9909-2a837f46b898" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector support request for this reclama
                                                under network-staffing request field. -Tamara Fatzinger, Market Integration
                                                Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d55a16-b2d4-4825-ac8b-c04dd1f3cf22" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1c59867-7240-4baa-8557-93af85037015" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="1752a539-8ac6-4a01-bb8f-fcf96306c30a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="479e5368-54bf-4c3f-b10b-b05b0863e7b4" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="436e18ad-093d-4cb2-8892-a49cf1fff9dd" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="9cbae104-c3a9-45d1-8def-de8c268c69de" role="gridcell">Concur with
                                                the requested Increase for Enrollment Cohorts, well within reason based on
                                                historical workload.</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="32e31b44-e8e1-4a0e-8b66-f63fd7f17099" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="26801ebb-b699-4f03-af65-10f000f2a135" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6b857350-cbb9-49f0-ba4a-b351e46b8870" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="928b1150-22df-43ff-9413-8319f8c425dc" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5ecd489b-cbdb-4ed4-b80b-de089b98ad0a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d22b78f9-f09b-468e-9c6b-3a64a31e0884" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="380d62e8-06fb-4901-9a7d-ad66ce1d41b0" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c237b15b-0576-4683-98ac-201222baf65a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="84f09df2-0ac1-4d25-9a35-215eaf2a9015" role="gridcell">Wed Apr 14
                                                2021 16:31:22 GMT-0500 (Central Daylight Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="1e8f9ed2-d356-4321-b568-8ed3d320767f" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5611a263-73f0-437b-9c13-0215d70e55f3" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="3875f4bc-3139-4772-bd5e-60c43f02e220" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c31dc3f1-2204-4b48-becb-6104bfe9a396" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="be5bcc40-cd89-492a-8a36-b872978efa25" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="46b4722f-fc0e-481a-a41a-a050e1bdd420" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d757a1bd-06af-4dd8-b488-4b763d615681" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac9672fb-6774-49de-9dce-36b6b9f8c2cb" role="gridcell">51</td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac1cc97d-9124-4dee-ac28-c2f8e330d49c" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="902711e7-3f44-4e03-b3e1-a9678d51dcb4" role="gridcell">Amy
                                                Bonilla-Beltran</td>
                                            <td style="display:none" class=""
                                                aria-describedby="932286c4-92d3-463f-9b0b-a56a1483fede" role="gridcell">Tue Feb 02
                                                2021 18:30:58 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="746df246-c436-4a6e-8a0d-c60306e0272f" role="gridcell">Amy
                                                Bonilla-Beltran</td>
                                            <td style="display:none" class=""
                                                aria-describedby="dd5457d0-3ff1-4be4-adbd-ea7630086fa2" role="gridcell">Tue Feb 02
                                                2021 18:30:58 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                        <tr class="k-alt" data-uid="6067bf53-4a5e-43c9-84e3-7bf1c8f955ae" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="8a9507be-9537-4ab4-b4c8-b902cca4af3c" role="gridcell">682</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e5f08ed4-cff0-4ff2-acd6-b61dd2eb622c" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="df0691fa-42dc-4f2f-9556-77e272be38b6" role="gridcell">HAWAII</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f36dfd42-6423-4b49-96d9-6851f4819246" role="gridcell">AMC
                                                TRIPLER-SHAFTER</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bf18a341-135e-4d74-b12d-6387265facb9" role="gridcell">AMC
                                                TRIPLER-SHAFTER</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="486edd90-7411-4a82-937b-a0a5b6250020" role="gridcell">0052</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="1574c0f5-e10f-472f-ac3a-f728d5680b1a" role="gridcell">Male</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="0447b4b0-ab87-472a-ae3e-33c665d36988" role="gridcell">NON-ACTIVE
                                                DUTY</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e4f18dc3-b35a-4b09-9421-06dd12486603" role="gridcell">1425</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6c615fee-e44e-476e-819a-b224de3b67de" role="gridcell">1774</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e9f71850-f6ee-4521-835d-b33f10bfd9ce" role="gridcell">439</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d9486e6d-c0ab-48c4-934a-29825d921755" role="gridcell">456</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="46a3fa7a-e339-40d0-9ce5-f58156d33f92" role="gridcell">266</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d90f7984-898e-43da-b175-35d3c1676f4a" role="gridcell">374</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="94d414bc-c396-4a0a-8a28-d22148dbd9f5" role="gridcell">2034</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e57f06d6-18cd-4a19-a976-ad51c50b6321" role="gridcell">7</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b02ee6ac-5b1f-49ed-9ed1-8b850bd0faab" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="67dd05ac-143a-471f-95c8-64e04b78236c" role="gridcell">518</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c97c9a51-632b-4446-b545-1458ce64f1b4" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a0b70c53-2932-4026-bc8d-f956e2fb01c7" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="19f912e3-f218-4def-bb4f-b794603b641a" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b632722e-dd8a-4b75-a573-6672749c05ff" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="36f1df30-bcef-491b-9a4e-9bdad2309662" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="922feff5-a974-464d-8301-19a406df3c26" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="92b4c66a-2c0b-4085-b397-ce480ae96fa8" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2810c64f-1e84-40d1-9f1e-3dd1b1a072e7" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="0ef8bc2b-b1c7-4857-b62f-c6cdba62e620" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="b0a20722-3b6d-4594-9f00-e2711508d50c" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="02b23adc-3f98-4fff-a060-d0c63ac6fe62" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="abd3fb7e-ce9b-4f84-886b-f13ea461ece7" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2b0efc60-fd21-40f6-a6b9-7db0ba72460f" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2009128b-5caf-4794-a891-e7c5cb0ba041" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d32565de-af22-4a32-95db-b56c9a511537" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="9178954f-4688-443f-81f8-1fe3c377d1fe" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3bb4361e-e9a1-4712-922f-94c3f5a4bceb" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f0181d24-40ff-41f9-9056-92926f19f1f6" role="gridcell">Increase
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b92f0e0e-06f7-4d73-8c6c-3bbae8286b86" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6ce9315c-8386-40aa-be6e-657aef503d41" role="gridcell">Other
                                                (specify in comments)
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b0292220-9109-4ea6-b62a-0d1402813e38" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="50aa9fbb-2eaf-41f7-908d-fc4dae915758" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="27813300-7a59-4260-87d8-b39af43ee1fb" role="gridcell">10/1/2021
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="5741068f-9e54-4654-98ff-0bb81d8fe758" role="gridcell">9/30/2022
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ac4517e8-2777-4350-a280-73a14a27a2be" role="gridcell">Kaulana
                                                Chang</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="53ff11c4-6926-43ae-8732-d77f1e60dc25" role="gridcell">Enrollment
                                                increase</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fe5e78f-614a-4c6b-9ae9-d9d50f9595c6" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="aafb0982-d672-43cf-9909-2a837f46b898" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector support request for this reclama
                                                under network-staffing request field. -Tamara Fatzinger, Market Integration
                                                Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d55a16-b2d4-4825-ac8b-c04dd1f3cf22" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1c59867-7240-4baa-8557-93af85037015" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="1752a539-8ac6-4a01-bb8f-fcf96306c30a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="479e5368-54bf-4c3f-b10b-b05b0863e7b4" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="436e18ad-093d-4cb2-8892-a49cf1fff9dd" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="9cbae104-c3a9-45d1-8def-de8c268c69de" role="gridcell">Concur with
                                                the requested Increase for Enrollment Cohorts, well within reason based on
                                                historical workload.</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="32e31b44-e8e1-4a0e-8b66-f63fd7f17099" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="26801ebb-b699-4f03-af65-10f000f2a135" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6b857350-cbb9-49f0-ba4a-b351e46b8870" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="928b1150-22df-43ff-9413-8319f8c425dc" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5ecd489b-cbdb-4ed4-b80b-de089b98ad0a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d22b78f9-f09b-468e-9c6b-3a64a31e0884" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="380d62e8-06fb-4901-9a7d-ad66ce1d41b0" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c237b15b-0576-4683-98ac-201222baf65a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="84f09df2-0ac1-4d25-9a35-215eaf2a9015" role="gridcell">Wed Apr 14
                                                2021 16:32:16 GMT-0500 (Central Daylight Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="1e8f9ed2-d356-4321-b568-8ed3d320767f" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5611a263-73f0-437b-9c13-0215d70e55f3" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="3875f4bc-3139-4772-bd5e-60c43f02e220" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c31dc3f1-2204-4b48-becb-6104bfe9a396" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="be5bcc40-cd89-492a-8a36-b872978efa25" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="46b4722f-fc0e-481a-a41a-a050e1bdd420" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d757a1bd-06af-4dd8-b488-4b763d615681" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac9672fb-6774-49de-9dce-36b6b9f8c2cb" role="gridcell">51</td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac1cc97d-9124-4dee-ac28-c2f8e330d49c" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="902711e7-3f44-4e03-b3e1-a9678d51dcb4" role="gridcell">Kaulana
                                                Chang</td>
                                            <td style="display:none" class=""
                                                aria-describedby="932286c4-92d3-463f-9b0b-a56a1483fede" role="gridcell">Tue Feb 02
                                                2021 18:51:52 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="746df246-c436-4a6e-8a0d-c60306e0272f" role="gridcell">Kaulana
                                                Chang</td>
                                            <td style="display:none" class=""
                                                aria-describedby="dd5457d0-3ff1-4be4-adbd-ea7630086fa2" role="gridcell">Tue Feb 02
                                                2021 18:51:52 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                        <tr data-uid="cf516b86-9b94-499a-9078-17fbc2821b38" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="8a9507be-9537-4ab4-b4c8-b902cca4af3c" role="gridcell">683</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e5f08ed4-cff0-4ff2-acd6-b61dd2eb622c" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="df0691fa-42dc-4f2f-9556-77e272be38b6" role="gridcell">HAWAII</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f36dfd42-6423-4b49-96d9-6851f4819246" role="gridcell">AMC
                                                TRIPLER-SHAFTER</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bf18a341-135e-4d74-b12d-6387265facb9" role="gridcell">CBMH WARRIOR
                                                OHANA-SHAFTER</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="486edd90-7411-4a82-937b-a0a5b6250020" role="gridcell">6120</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="1574c0f5-e10f-472f-ac3a-f728d5680b1a" role="gridcell">Male</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="0447b4b0-ab87-472a-ae3e-33c665d36988" role="gridcell">NON-ACTIVE
                                                DUTY</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e4f18dc3-b35a-4b09-9421-06dd12486603" role="gridcell">192</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6c615fee-e44e-476e-819a-b224de3b67de" role="gridcell">476</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e9f71850-f6ee-4521-835d-b33f10bfd9ce" role="gridcell">149</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d9486e6d-c0ab-48c4-934a-29825d921755" role="gridcell">168</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="46a3fa7a-e339-40d0-9ce5-f58156d33f92" role="gridcell">34</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d90f7984-898e-43da-b175-35d3c1676f4a" role="gridcell">81</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="94d414bc-c396-4a0a-8a28-d22148dbd9f5" role="gridcell">633</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e57f06d6-18cd-4a19-a976-ad51c50b6321" role="gridcell">1</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b02ee6ac-5b1f-49ed-9ed1-8b850bd0faab" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="67dd05ac-143a-471f-95c8-64e04b78236c" role="gridcell">330</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c97c9a51-632b-4446-b545-1458ce64f1b4" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a0b70c53-2932-4026-bc8d-f956e2fb01c7" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="19f912e3-f218-4def-bb4f-b794603b641a" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b632722e-dd8a-4b75-a573-6672749c05ff" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="36f1df30-bcef-491b-9a4e-9bdad2309662" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="922feff5-a974-464d-8301-19a406df3c26" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="92b4c66a-2c0b-4085-b397-ce480ae96fa8" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2810c64f-1e84-40d1-9f1e-3dd1b1a072e7" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="0ef8bc2b-b1c7-4857-b62f-c6cdba62e620" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="b0a20722-3b6d-4594-9f00-e2711508d50c" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="02b23adc-3f98-4fff-a060-d0c63ac6fe62" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="abd3fb7e-ce9b-4f84-886b-f13ea461ece7" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2b0efc60-fd21-40f6-a6b9-7db0ba72460f" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2009128b-5caf-4794-a891-e7c5cb0ba041" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d32565de-af22-4a32-95db-b56c9a511537" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="9178954f-4688-443f-81f8-1fe3c377d1fe" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3bb4361e-e9a1-4712-922f-94c3f5a4bceb" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f0181d24-40ff-41f9-9056-92926f19f1f6" role="gridcell">Increase
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b92f0e0e-06f7-4d73-8c6c-3bbae8286b86" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6ce9315c-8386-40aa-be6e-657aef503d41" role="gridcell">Other
                                                (specify in comments)
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b0292220-9109-4ea6-b62a-0d1402813e38" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="50aa9fbb-2eaf-41f7-908d-fc4dae915758" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="27813300-7a59-4260-87d8-b39af43ee1fb" role="gridcell">10/1/2021
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="5741068f-9e54-4654-98ff-0bb81d8fe758" role="gridcell">9/30/2022
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ac4517e8-2777-4350-a280-73a14a27a2be" role="gridcell">Amy
                                                Bonilla-Beltran</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="53ff11c4-6926-43ae-8732-d77f1e60dc25" role="gridcell">Enrollment
                                                increase</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fe5e78f-614a-4c6b-9ae9-d9d50f9595c6" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="aafb0982-d672-43cf-9909-2a837f46b898" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector support request for this reclama
                                                under network-staffing request field. -Tamara Fatzinger, Market Integration
                                                Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d55a16-b2d4-4825-ac8b-c04dd1f3cf22" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1c59867-7240-4baa-8557-93af85037015" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="1752a539-8ac6-4a01-bb8f-fcf96306c30a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="479e5368-54bf-4c3f-b10b-b05b0863e7b4" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="436e18ad-093d-4cb2-8892-a49cf1fff9dd" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="9cbae104-c3a9-45d1-8def-de8c268c69de" role="gridcell">Concur with
                                                the requested Increase for Enrollment Cohorts, well within reason based on
                                                historical workload.</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="32e31b44-e8e1-4a0e-8b66-f63fd7f17099" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="26801ebb-b699-4f03-af65-10f000f2a135" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6b857350-cbb9-49f0-ba4a-b351e46b8870" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="928b1150-22df-43ff-9413-8319f8c425dc" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5ecd489b-cbdb-4ed4-b80b-de089b98ad0a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d22b78f9-f09b-468e-9c6b-3a64a31e0884" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="380d62e8-06fb-4901-9a7d-ad66ce1d41b0" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c237b15b-0576-4683-98ac-201222baf65a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="84f09df2-0ac1-4d25-9a35-215eaf2a9015" role="gridcell">Wed Apr 14
                                                2021 16:32:43 GMT-0500 (Central Daylight Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="1e8f9ed2-d356-4321-b568-8ed3d320767f" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5611a263-73f0-437b-9c13-0215d70e55f3" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="3875f4bc-3139-4772-bd5e-60c43f02e220" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c31dc3f1-2204-4b48-becb-6104bfe9a396" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="be5bcc40-cd89-492a-8a36-b872978efa25" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="46b4722f-fc0e-481a-a41a-a050e1bdd420" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d757a1bd-06af-4dd8-b488-4b763d615681" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac9672fb-6774-49de-9dce-36b6b9f8c2cb" role="gridcell">51</td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac1cc97d-9124-4dee-ac28-c2f8e330d49c" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="902711e7-3f44-4e03-b3e1-a9678d51dcb4" role="gridcell">Amy
                                                Bonilla-Beltran</td>
                                            <td style="display:none" class=""
                                                aria-describedby="932286c4-92d3-463f-9b0b-a56a1483fede" role="gridcell">Wed Jan 27
                                                2021 01:20:20 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="746df246-c436-4a6e-8a0d-c60306e0272f" role="gridcell">Amy
                                                Bonilla-Beltran</td>
                                            <td style="display:none" class=""
                                                aria-describedby="dd5457d0-3ff1-4be4-adbd-ea7630086fa2" role="gridcell">Tue Feb 02
                                                2021 18:24:03 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                        <tr class="k-alt" data-uid="ceb27654-595b-48ed-9c82-7686f03befab" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="8a9507be-9537-4ab4-b4c8-b902cca4af3c" role="gridcell">684</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e5f08ed4-cff0-4ff2-acd6-b61dd2eb622c" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="df0691fa-42dc-4f2f-9556-77e272be38b6" role="gridcell">HAWAII</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f36dfd42-6423-4b49-96d9-6851f4819246" role="gridcell">AMC
                                                TRIPLER-SHAFTER</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bf18a341-135e-4d74-b12d-6387265facb9" role="gridcell">CBMH WARRIOR
                                                OHANA-SHAFTER</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="486edd90-7411-4a82-937b-a0a5b6250020" role="gridcell">6120</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="1574c0f5-e10f-472f-ac3a-f728d5680b1a" role="gridcell">Female</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="0447b4b0-ab87-472a-ae3e-33c665d36988" role="gridcell">NON-ACTIVE
                                                DUTY</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e4f18dc3-b35a-4b09-9421-06dd12486603" role="gridcell">202</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6c615fee-e44e-476e-819a-b224de3b67de" role="gridcell">483</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e9f71850-f6ee-4521-835d-b33f10bfd9ce" role="gridcell">141</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d9486e6d-c0ab-48c4-934a-29825d921755" role="gridcell">208</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="46a3fa7a-e339-40d0-9ce5-f58156d33f92" role="gridcell">330</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d90f7984-898e-43da-b175-35d3c1676f4a" role="gridcell">396</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="94d414bc-c396-4a0a-8a28-d22148dbd9f5" role="gridcell">757</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e57f06d6-18cd-4a19-a976-ad51c50b6321" role="gridcell">1</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b02ee6ac-5b1f-49ed-9ed1-8b850bd0faab" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="67dd05ac-143a-471f-95c8-64e04b78236c" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c97c9a51-632b-4446-b545-1458ce64f1b4" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a0b70c53-2932-4026-bc8d-f956e2fb01c7" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="19f912e3-f218-4def-bb4f-b794603b641a" role="gridcell">329</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b632722e-dd8a-4b75-a573-6672749c05ff" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="36f1df30-bcef-491b-9a4e-9bdad2309662" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="922feff5-a974-464d-8301-19a406df3c26" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="92b4c66a-2c0b-4085-b397-ce480ae96fa8" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2810c64f-1e84-40d1-9f1e-3dd1b1a072e7" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="0ef8bc2b-b1c7-4857-b62f-c6cdba62e620" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="b0a20722-3b6d-4594-9f00-e2711508d50c" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="02b23adc-3f98-4fff-a060-d0c63ac6fe62" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="abd3fb7e-ce9b-4f84-886b-f13ea461ece7" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2b0efc60-fd21-40f6-a6b9-7db0ba72460f" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2009128b-5caf-4794-a891-e7c5cb0ba041" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d32565de-af22-4a32-95db-b56c9a511537" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="9178954f-4688-443f-81f8-1fe3c377d1fe" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3bb4361e-e9a1-4712-922f-94c3f5a4bceb" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f0181d24-40ff-41f9-9056-92926f19f1f6" role="gridcell">Increase
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b92f0e0e-06f7-4d73-8c6c-3bbae8286b86" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6ce9315c-8386-40aa-be6e-657aef503d41" role="gridcell">Other
                                                (specify in comments)
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b0292220-9109-4ea6-b62a-0d1402813e38" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="50aa9fbb-2eaf-41f7-908d-fc4dae915758" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="27813300-7a59-4260-87d8-b39af43ee1fb" role="gridcell">10/1/2021
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="5741068f-9e54-4654-98ff-0bb81d8fe758" role="gridcell">9/30/2022
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ac4517e8-2777-4350-a280-73a14a27a2be" role="gridcell">Amy
                                                Bonilla-Beltran</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="53ff11c4-6926-43ae-8732-d77f1e60dc25" role="gridcell">Increase
                                                enrollment</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fe5e78f-614a-4c6b-9ae9-d9d50f9595c6" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="aafb0982-d672-43cf-9909-2a837f46b898" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector support request for this reclama
                                                under network-staffing request field. -Tamara Fatzinger, Market Integration
                                                Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d55a16-b2d4-4825-ac8b-c04dd1f3cf22" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1c59867-7240-4baa-8557-93af85037015" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="1752a539-8ac6-4a01-bb8f-fcf96306c30a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="479e5368-54bf-4c3f-b10b-b05b0863e7b4" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="436e18ad-093d-4cb2-8892-a49cf1fff9dd" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="9cbae104-c3a9-45d1-8def-de8c268c69de" role="gridcell">Concur with
                                                the requested Increase for Enrollment Cohorts, well within reason based on
                                                historical workload.</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="32e31b44-e8e1-4a0e-8b66-f63fd7f17099" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="26801ebb-b699-4f03-af65-10f000f2a135" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6b857350-cbb9-49f0-ba4a-b351e46b8870" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="928b1150-22df-43ff-9413-8319f8c425dc" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5ecd489b-cbdb-4ed4-b80b-de089b98ad0a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d22b78f9-f09b-468e-9c6b-3a64a31e0884" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="380d62e8-06fb-4901-9a7d-ad66ce1d41b0" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c237b15b-0576-4683-98ac-201222baf65a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="84f09df2-0ac1-4d25-9a35-215eaf2a9015" role="gridcell">Wed Apr 14
                                                2021 16:33:07 GMT-0500 (Central Daylight Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="1e8f9ed2-d356-4321-b568-8ed3d320767f" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5611a263-73f0-437b-9c13-0215d70e55f3" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="3875f4bc-3139-4772-bd5e-60c43f02e220" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c31dc3f1-2204-4b48-becb-6104bfe9a396" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="be5bcc40-cd89-492a-8a36-b872978efa25" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="46b4722f-fc0e-481a-a41a-a050e1bdd420" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d757a1bd-06af-4dd8-b488-4b763d615681" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac9672fb-6774-49de-9dce-36b6b9f8c2cb" role="gridcell">51</td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac1cc97d-9124-4dee-ac28-c2f8e330d49c" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="902711e7-3f44-4e03-b3e1-a9678d51dcb4" role="gridcell">Amy
                                                Bonilla-Beltran</td>
                                            <td style="display:none" class=""
                                                aria-describedby="932286c4-92d3-463f-9b0b-a56a1483fede" role="gridcell">Wed Jan 27
                                                2021 01:16:25 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="746df246-c436-4a6e-8a0d-c60306e0272f" role="gridcell">Amy
                                                Bonilla-Beltran</td>
                                            <td style="display:none" class=""
                                                aria-describedby="dd5457d0-3ff1-4be4-adbd-ea7630086fa2" role="gridcell">Tue Feb 02
                                                2021 18:24:03 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                        <tr data-uid="7672b027-0025-4a23-9031-ed4d95dc4a0b" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="8a9507be-9537-4ab4-b4c8-b902cca4af3c" role="gridcell">685</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e5f08ed4-cff0-4ff2-acd6-b61dd2eb622c" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="df0691fa-42dc-4f2f-9556-77e272be38b6" role="gridcell">INDO-PACIFIC
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f36dfd42-6423-4b49-96d9-6851f4819246" role="gridcell">(0620) NH
                                                GUAM-AGANA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bf18a341-135e-4d74-b12d-6387265facb9" role="gridcell">(0620) NH
                                                GUAM-AGANA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="486edd90-7411-4a82-937b-a0a5b6250020" role="gridcell">0620</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="1574c0f5-e10f-472f-ac3a-f728d5680b1a" role="gridcell">Female</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="0447b4b0-ab87-472a-ae3e-33c665d36988" role="gridcell">ACTIVE DUTY
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e4f18dc3-b35a-4b09-9421-06dd12486603" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6c615fee-e44e-476e-819a-b224de3b67de" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e9f71850-f6ee-4521-835d-b33f10bfd9ce" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d9486e6d-c0ab-48c4-934a-29825d921755" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="46a3fa7a-e339-40d0-9ce5-f58156d33f92" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d90f7984-898e-43da-b175-35d3c1676f4a" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="94d414bc-c396-4a0a-8a28-d22148dbd9f5" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e57f06d6-18cd-4a19-a976-ad51c50b6321" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b02ee6ac-5b1f-49ed-9ed1-8b850bd0faab" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="67dd05ac-143a-471f-95c8-64e04b78236c" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c97c9a51-632b-4446-b545-1458ce64f1b4" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a0b70c53-2932-4026-bc8d-f956e2fb01c7" role="gridcell">69</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="19f912e3-f218-4def-bb4f-b794603b641a" role="gridcell">75</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b632722e-dd8a-4b75-a573-6672749c05ff" role="gridcell">33</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="36f1df30-bcef-491b-9a4e-9bdad2309662" role="gridcell">21</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="922feff5-a974-464d-8301-19a406df3c26" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="92b4c66a-2c0b-4085-b397-ce480ae96fa8" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2810c64f-1e84-40d1-9f1e-3dd1b1a072e7" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="0ef8bc2b-b1c7-4857-b62f-c6cdba62e620" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="b0a20722-3b6d-4594-9f00-e2711508d50c" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="02b23adc-3f98-4fff-a060-d0c63ac6fe62" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="abd3fb7e-ce9b-4f84-886b-f13ea461ece7" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2b0efc60-fd21-40f6-a6b9-7db0ba72460f" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2009128b-5caf-4794-a891-e7c5cb0ba041" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d32565de-af22-4a32-95db-b56c9a511537" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="9178954f-4688-443f-81f8-1fe3c377d1fe" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3bb4361e-e9a1-4712-922f-94c3f5a4bceb" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f0181d24-40ff-41f9-9056-92926f19f1f6" role="gridcell">Increase
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b92f0e0e-06f7-4d73-8c6c-3bbae8286b86" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6ce9315c-8386-40aa-be6e-657aef503d41" role="gridcell">Other
                                                (specify in comments)
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b0292220-9109-4ea6-b62a-0d1402813e38" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="50aa9fbb-2eaf-41f7-908d-fc4dae915758" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="27813300-7a59-4260-87d8-b39af43ee1fb" role="gridcell">9/30/2020
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="5741068f-9e54-4654-98ff-0bb81d8fe758" role="gridcell">9/29/2022
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ac4517e8-2777-4350-a280-73a14a27a2be" role="gridcell">Brando
                                                Sumayao</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="53ff11c4-6926-43ae-8732-d77f1e60dc25" role="gridcell">Additional
                                                approved population growth.</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fe5e78f-614a-4c6b-9ae9-d9d50f9595c6" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="aafb0982-d672-43cf-9909-2a837f46b898" role="gridcell">No Market
                                                Integration Business Operations Specialist (BOS) assigned to OCONUS. If facility
                                                requires MCSC private sector or DHA staffing support, please refer to Statement of
                                                Responsibilities (SOR) or Tricare Area Office (TAO). TGF 19MAR21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d55a16-b2d4-4825-ac8b-c04dd1f3cf22" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1c59867-7240-4baa-8557-93af85037015" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="1752a539-8ac6-4a01-bb8f-fcf96306c30a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="479e5368-54bf-4c3f-b10b-b05b0863e7b4" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="436e18ad-093d-4cb2-8892-a49cf1fff9dd" role="gridcell">No</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="9cbae104-c3a9-45d1-8def-de8c268c69de" role="gridcell">Additional
                                                pop growth due to EXPANDING MISSION BEGIN FY21 however, based on timeline FY21
                                                enroll changes have not yet materialized (Jan enr =6300 v 7282 requested)". Would
                                                approve max 6800, with the 5% variance could get up to 7100, Aguerrero 9April2021
                                            </td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="32e31b44-e8e1-4a0e-8b66-f63fd7f17099" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="26801ebb-b699-4f03-af65-10f000f2a135" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6b857350-cbb9-49f0-ba4a-b351e46b8870" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="928b1150-22df-43ff-9413-8319f8c425dc" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5ecd489b-cbdb-4ed4-b80b-de089b98ad0a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d22b78f9-f09b-468e-9c6b-3a64a31e0884" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="380d62e8-06fb-4901-9a7d-ad66ce1d41b0" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c237b15b-0576-4683-98ac-201222baf65a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="84f09df2-0ac1-4d25-9a35-215eaf2a9015" role="gridcell">Wed Apr 14
                                                2021 16:34:29 GMT-0500 (Central Daylight Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="1e8f9ed2-d356-4321-b568-8ed3d320767f" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5611a263-73f0-437b-9c13-0215d70e55f3" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="3875f4bc-3139-4772-bd5e-60c43f02e220" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c31dc3f1-2204-4b48-becb-6104bfe9a396" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="be5bcc40-cd89-492a-8a36-b872978efa25" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="46b4722f-fc0e-481a-a41a-a050e1bdd420" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d757a1bd-06af-4dd8-b488-4b763d615681" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac9672fb-6774-49de-9dce-36b6b9f8c2cb" role="gridcell">51</td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac1cc97d-9124-4dee-ac28-c2f8e330d49c" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="902711e7-3f44-4e03-b3e1-a9678d51dcb4" role="gridcell">Geojun Wu
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="932286c4-92d3-463f-9b0b-a56a1483fede" role="gridcell">Wed Jan 13
                                                2021 01:56:15 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="746df246-c436-4a6e-8a0d-c60306e0272f" role="gridcell">Brando
                                                Sumayao</td>
                                            <td style="display:none" class=""
                                                aria-describedby="dd5457d0-3ff1-4be4-adbd-ea7630086fa2" role="gridcell">Fri Feb 05
                                                2021 20:48:57 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                        <tr class="k-alt" data-uid="0446e7bd-0124-4d33-97ba-dad6c756926d" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="8a9507be-9537-4ab4-b4c8-b902cca4af3c" role="gridcell">686</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e5f08ed4-cff0-4ff2-acd6-b61dd2eb622c" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="df0691fa-42dc-4f2f-9556-77e272be38b6" role="gridcell">INDO-PACIFIC
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f36dfd42-6423-4b49-96d9-6851f4819246" role="gridcell">(0620) NH
                                                GUAM-AGANA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bf18a341-135e-4d74-b12d-6387265facb9" role="gridcell">(0620) NH
                                                GUAM-AGANA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="486edd90-7411-4a82-937b-a0a5b6250020" role="gridcell">0620</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="1574c0f5-e10f-472f-ac3a-f728d5680b1a" role="gridcell">Female</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="0447b4b0-ab87-472a-ae3e-33c665d36988" role="gridcell">NON-ACTIVE
                                                DUTY</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e4f18dc3-b35a-4b09-9421-06dd12486603" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6c615fee-e44e-476e-819a-b224de3b67de" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e9f71850-f6ee-4521-835d-b33f10bfd9ce" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d9486e6d-c0ab-48c4-934a-29825d921755" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="46a3fa7a-e339-40d0-9ce5-f58156d33f92" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d90f7984-898e-43da-b175-35d3c1676f4a" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="94d414bc-c396-4a0a-8a28-d22148dbd9f5" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e57f06d6-18cd-4a19-a976-ad51c50b6321" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b02ee6ac-5b1f-49ed-9ed1-8b850bd0faab" role="gridcell">4</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="67dd05ac-143a-471f-95c8-64e04b78236c" role="gridcell">4</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c97c9a51-632b-4446-b545-1458ce64f1b4" role="gridcell">4</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a0b70c53-2932-4026-bc8d-f956e2fb01c7" role="gridcell">4</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="19f912e3-f218-4def-bb4f-b794603b641a" role="gridcell">4</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b632722e-dd8a-4b75-a573-6672749c05ff" role="gridcell">4</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="36f1df30-bcef-491b-9a4e-9bdad2309662" role="gridcell">4</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="922feff5-a974-464d-8301-19a406df3c26" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="92b4c66a-2c0b-4085-b397-ce480ae96fa8" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2810c64f-1e84-40d1-9f1e-3dd1b1a072e7" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="0ef8bc2b-b1c7-4857-b62f-c6cdba62e620" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="b0a20722-3b6d-4594-9f00-e2711508d50c" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="02b23adc-3f98-4fff-a060-d0c63ac6fe62" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="abd3fb7e-ce9b-4f84-886b-f13ea461ece7" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2b0efc60-fd21-40f6-a6b9-7db0ba72460f" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2009128b-5caf-4794-a891-e7c5cb0ba041" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d32565de-af22-4a32-95db-b56c9a511537" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="9178954f-4688-443f-81f8-1fe3c377d1fe" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3bb4361e-e9a1-4712-922f-94c3f5a4bceb" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f0181d24-40ff-41f9-9056-92926f19f1f6" role="gridcell">Increase
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b92f0e0e-06f7-4d73-8c6c-3bbae8286b86" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6ce9315c-8386-40aa-be6e-657aef503d41" role="gridcell">Other
                                                (specify in comments)
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b0292220-9109-4ea6-b62a-0d1402813e38" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="50aa9fbb-2eaf-41f7-908d-fc4dae915758" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="27813300-7a59-4260-87d8-b39af43ee1fb" role="gridcell">9/30/2020
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="5741068f-9e54-4654-98ff-0bb81d8fe758" role="gridcell">9/29/2022
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ac4517e8-2777-4350-a280-73a14a27a2be" role="gridcell">Brando
                                                Sumayao</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="53ff11c4-6926-43ae-8732-d77f1e60dc25" role="gridcell">Additional
                                                approved population growth.</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fe5e78f-614a-4c6b-9ae9-d9d50f9595c6" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="aafb0982-d672-43cf-9909-2a837f46b898" role="gridcell">No Market
                                                Integration Business Operations Specialist (BOS) assigned to OCONUS. If facility
                                                requires MCSC private sector or DHA staffing support, please refer to Statement of
                                                Responsibilities (SOR) or Tricare Area Office (TAO). TGF 19MAR21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d55a16-b2d4-4825-ac8b-c04dd1f3cf22" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1c59867-7240-4baa-8557-93af85037015" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="1752a539-8ac6-4a01-bb8f-fcf96306c30a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="479e5368-54bf-4c3f-b10b-b05b0863e7b4" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="436e18ad-093d-4cb2-8892-a49cf1fff9dd" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="9cbae104-c3a9-45d1-8def-de8c268c69de" role="gridcell">Parent DMIS
                                                ID should be 0620. No Workload increase in PCSL? Enrollment has a 54% increase for
                                                Active Duty. Only comment is "Additional approved population growth.". Louis
                                                05APR2021.</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="32e31b44-e8e1-4a0e-8b66-f63fd7f17099" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="26801ebb-b699-4f03-af65-10f000f2a135" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6b857350-cbb9-49f0-ba4a-b351e46b8870" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="928b1150-22df-43ff-9413-8319f8c425dc" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5ecd489b-cbdb-4ed4-b80b-de089b98ad0a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d22b78f9-f09b-468e-9c6b-3a64a31e0884" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="380d62e8-06fb-4901-9a7d-ad66ce1d41b0" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c237b15b-0576-4683-98ac-201222baf65a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="84f09df2-0ac1-4d25-9a35-215eaf2a9015" role="gridcell">Wed Apr 14
                                                2021 16:34:56 GMT-0500 (Central Daylight Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="1e8f9ed2-d356-4321-b568-8ed3d320767f" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5611a263-73f0-437b-9c13-0215d70e55f3" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="3875f4bc-3139-4772-bd5e-60c43f02e220" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c31dc3f1-2204-4b48-becb-6104bfe9a396" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="be5bcc40-cd89-492a-8a36-b872978efa25" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="46b4722f-fc0e-481a-a41a-a050e1bdd420" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d757a1bd-06af-4dd8-b488-4b763d615681" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac9672fb-6774-49de-9dce-36b6b9f8c2cb" role="gridcell">51</td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac1cc97d-9124-4dee-ac28-c2f8e330d49c" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="902711e7-3f44-4e03-b3e1-a9678d51dcb4" role="gridcell">Geojun Wu
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="932286c4-92d3-463f-9b0b-a56a1483fede" role="gridcell">Wed Jan 13
                                                2021 01:56:15 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="746df246-c436-4a6e-8a0d-c60306e0272f" role="gridcell">Brando
                                                Sumayao</td>
                                            <td style="display:none" class=""
                                                aria-describedby="dd5457d0-3ff1-4be4-adbd-ea7630086fa2" role="gridcell">Fri Feb 05
                                                2021 20:48:57 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                        <tr data-uid="b4dbd144-2bdc-49c4-9679-0c1d10f4ab25" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="8a9507be-9537-4ab4-b4c8-b902cca4af3c" role="gridcell">687</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e5f08ed4-cff0-4ff2-acd6-b61dd2eb622c" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="df0691fa-42dc-4f2f-9556-77e272be38b6" role="gridcell">INDO-PACIFIC
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f36dfd42-6423-4b49-96d9-6851f4819246" role="gridcell">(0620) NH
                                                GUAM-AGANA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bf18a341-135e-4d74-b12d-6387265facb9" role="gridcell">(0620) NH
                                                GUAM-AGANA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="486edd90-7411-4a82-937b-a0a5b6250020" role="gridcell">0620</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="1574c0f5-e10f-472f-ac3a-f728d5680b1a" role="gridcell">Male</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="0447b4b0-ab87-472a-ae3e-33c665d36988" role="gridcell">NON-ACTIVE
                                                DUTY</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e4f18dc3-b35a-4b09-9421-06dd12486603" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6c615fee-e44e-476e-819a-b224de3b67de" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e9f71850-f6ee-4521-835d-b33f10bfd9ce" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d9486e6d-c0ab-48c4-934a-29825d921755" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="46a3fa7a-e339-40d0-9ce5-f58156d33f92" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d90f7984-898e-43da-b175-35d3c1676f4a" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="94d414bc-c396-4a0a-8a28-d22148dbd9f5" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e57f06d6-18cd-4a19-a976-ad51c50b6321" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b02ee6ac-5b1f-49ed-9ed1-8b850bd0faab" role="gridcell">4</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="67dd05ac-143a-471f-95c8-64e04b78236c" role="gridcell">4</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c97c9a51-632b-4446-b545-1458ce64f1b4" role="gridcell">4</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a0b70c53-2932-4026-bc8d-f956e2fb01c7" role="gridcell">4</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="19f912e3-f218-4def-bb4f-b794603b641a" role="gridcell">4</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b632722e-dd8a-4b75-a573-6672749c05ff" role="gridcell">4</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="36f1df30-bcef-491b-9a4e-9bdad2309662" role="gridcell">4</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="922feff5-a974-464d-8301-19a406df3c26" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="92b4c66a-2c0b-4085-b397-ce480ae96fa8" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2810c64f-1e84-40d1-9f1e-3dd1b1a072e7" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="0ef8bc2b-b1c7-4857-b62f-c6cdba62e620" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="b0a20722-3b6d-4594-9f00-e2711508d50c" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="02b23adc-3f98-4fff-a060-d0c63ac6fe62" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="abd3fb7e-ce9b-4f84-886b-f13ea461ece7" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2b0efc60-fd21-40f6-a6b9-7db0ba72460f" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2009128b-5caf-4794-a891-e7c5cb0ba041" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d32565de-af22-4a32-95db-b56c9a511537" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="9178954f-4688-443f-81f8-1fe3c377d1fe" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3bb4361e-e9a1-4712-922f-94c3f5a4bceb" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f0181d24-40ff-41f9-9056-92926f19f1f6" role="gridcell">Increase
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b92f0e0e-06f7-4d73-8c6c-3bbae8286b86" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6ce9315c-8386-40aa-be6e-657aef503d41" role="gridcell">Other
                                                (specify in comments)
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b0292220-9109-4ea6-b62a-0d1402813e38" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="50aa9fbb-2eaf-41f7-908d-fc4dae915758" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="27813300-7a59-4260-87d8-b39af43ee1fb" role="gridcell">9/30/2020
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="5741068f-9e54-4654-98ff-0bb81d8fe758" role="gridcell">9/29/2022
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ac4517e8-2777-4350-a280-73a14a27a2be" role="gridcell">Brando
                                                Sumayao</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="53ff11c4-6926-43ae-8732-d77f1e60dc25" role="gridcell">Additional
                                                approved population growth.</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fe5e78f-614a-4c6b-9ae9-d9d50f9595c6" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="aafb0982-d672-43cf-9909-2a837f46b898" role="gridcell">No Market
                                                Integration Business Operations Specialist (BOS) assigned to OCONUS. If facility
                                                requires MCSC private sector or DHA staffing support, please refer to Statement of
                                                Responsibilities (SOR) or Tricare Area Office (TAO). TGF 19MAR21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d55a16-b2d4-4825-ac8b-c04dd1f3cf22" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1c59867-7240-4baa-8557-93af85037015" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="1752a539-8ac6-4a01-bb8f-fcf96306c30a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="479e5368-54bf-4c3f-b10b-b05b0863e7b4" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="436e18ad-093d-4cb2-8892-a49cf1fff9dd" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="9cbae104-c3a9-45d1-8def-de8c268c69de" role="gridcell">Parent DMIS
                                                ID should be 0620. No Workload increase in PCSL? Enrollment has a 54% increase for
                                                Active Duty. Only comment is "Additional approved population growth.". Louis
                                                05APR2021.</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="32e31b44-e8e1-4a0e-8b66-f63fd7f17099" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="26801ebb-b699-4f03-af65-10f000f2a135" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6b857350-cbb9-49f0-ba4a-b351e46b8870" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="928b1150-22df-43ff-9413-8319f8c425dc" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5ecd489b-cbdb-4ed4-b80b-de089b98ad0a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d22b78f9-f09b-468e-9c6b-3a64a31e0884" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="380d62e8-06fb-4901-9a7d-ad66ce1d41b0" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c237b15b-0576-4683-98ac-201222baf65a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="84f09df2-0ac1-4d25-9a35-215eaf2a9015" role="gridcell">Wed Apr 14
                                                2021 16:35:25 GMT-0500 (Central Daylight Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="1e8f9ed2-d356-4321-b568-8ed3d320767f" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5611a263-73f0-437b-9c13-0215d70e55f3" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="3875f4bc-3139-4772-bd5e-60c43f02e220" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c31dc3f1-2204-4b48-becb-6104bfe9a396" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="be5bcc40-cd89-492a-8a36-b872978efa25" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="46b4722f-fc0e-481a-a41a-a050e1bdd420" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d757a1bd-06af-4dd8-b488-4b763d615681" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac9672fb-6774-49de-9dce-36b6b9f8c2cb" role="gridcell">51</td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac1cc97d-9124-4dee-ac28-c2f8e330d49c" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="902711e7-3f44-4e03-b3e1-a9678d51dcb4" role="gridcell">Geojun Wu
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="932286c4-92d3-463f-9b0b-a56a1483fede" role="gridcell">Wed Jan 13
                                                2021 01:56:15 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="746df246-c436-4a6e-8a0d-c60306e0272f" role="gridcell">Brando
                                                Sumayao</td>
                                            <td style="display:none" class=""
                                                aria-describedby="dd5457d0-3ff1-4be4-adbd-ea7630086fa2" role="gridcell">Fri Feb 05
                                                2021 20:48:57 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                        <tr class="k-alt" data-uid="11c443b3-be49-4dbb-b204-29c0ad6c274c" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="8a9507be-9537-4ab4-b4c8-b902cca4af3c" role="gridcell">688</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e5f08ed4-cff0-4ff2-acd6-b61dd2eb622c" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="df0691fa-42dc-4f2f-9556-77e272be38b6" role="gridcell">INDO-PACIFIC
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f36dfd42-6423-4b49-96d9-6851f4819246" role="gridcell">(0638)
                                                AF-H-51st MEDGRP-OSAN</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bf18a341-135e-4d74-b12d-6387265facb9" role="gridcell">(0638) Osan
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="486edd90-7411-4a82-937b-a0a5b6250020" role="gridcell">0638</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="1574c0f5-e10f-472f-ac3a-f728d5680b1a" role="gridcell">Male</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="0447b4b0-ab87-472a-ae3e-33c665d36988" role="gridcell">NON-ACTIVE
                                                DUTY</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e4f18dc3-b35a-4b09-9421-06dd12486603" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6c615fee-e44e-476e-819a-b224de3b67de" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e9f71850-f6ee-4521-835d-b33f10bfd9ce" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d9486e6d-c0ab-48c4-934a-29825d921755" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="46a3fa7a-e339-40d0-9ce5-f58156d33f92" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d90f7984-898e-43da-b175-35d3c1676f4a" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="94d414bc-c396-4a0a-8a28-d22148dbd9f5" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e57f06d6-18cd-4a19-a976-ad51c50b6321" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b02ee6ac-5b1f-49ed-9ed1-8b850bd0faab" role="gridcell">250</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="67dd05ac-143a-471f-95c8-64e04b78236c" role="gridcell">50</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c97c9a51-632b-4446-b545-1458ce64f1b4" role="gridcell">50</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a0b70c53-2932-4026-bc8d-f956e2fb01c7" role="gridcell">50</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="19f912e3-f218-4def-bb4f-b794603b641a" role="gridcell">50</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b632722e-dd8a-4b75-a573-6672749c05ff" role="gridcell">50</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="36f1df30-bcef-491b-9a4e-9bdad2309662" role="gridcell">40</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="922feff5-a974-464d-8301-19a406df3c26" role="gridcell">10</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="92b4c66a-2c0b-4085-b397-ce480ae96fa8" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2810c64f-1e84-40d1-9f1e-3dd1b1a072e7" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="0ef8bc2b-b1c7-4857-b62f-c6cdba62e620" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="b0a20722-3b6d-4594-9f00-e2711508d50c" role="gridcell"></td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="02b23adc-3f98-4fff-a060-d0c63ac6fe62" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="abd3fb7e-ce9b-4f84-886b-f13ea461ece7" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2b0efc60-fd21-40f6-a6b9-7db0ba72460f" role="gridcell">0</td>
                                            <td style="display:none;text-align:center;" class=""
                                                aria-describedby="2009128b-5caf-4794-a891-e7c5cb0ba041" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d32565de-af22-4a32-95db-b56c9a511537" role="gridcell">1.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="9178954f-4688-443f-81f8-1fe3c377d1fe" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3bb4361e-e9a1-4712-922f-94c3f5a4bceb" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f0181d24-40ff-41f9-9056-92926f19f1f6" role="gridcell">Increase
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b92f0e0e-06f7-4d73-8c6c-3bbae8286b86" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6ce9315c-8386-40aa-be6e-657aef503d41" role="gridcell">Other
                                                (specify in comments)
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="b0292220-9109-4ea6-b62a-0d1402813e38" role="gridcell">Staffing
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="50aa9fbb-2eaf-41f7-908d-fc4dae915758" role="gridcell">QPP-29037
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="27813300-7a59-4260-87d8-b39af43ee1fb" role="gridcell">11/30/2021
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="5741068f-9e54-4654-98ff-0bb81d8fe758" role="gridcell">8/31/2022
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ac4517e8-2777-4350-a280-73a14a27a2be" role="gridcell">Theodosia
                                                Montgomery</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="53ff11c4-6926-43ae-8732-d77f1e60dc25" role="gridcell">Osan AB has
                                                been provisioned to receive 140 new Command Sponsored billets which consequenlty
                                                means an increase of dependents to enroll at the Osan hospital. </td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fe5e78f-614a-4c6b-9ae9-d9d50f9595c6" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="aafb0982-d672-43cf-9909-2a837f46b898" role="gridcell">No Market
                                                Integration Business Operations Specialist (BOS) assigned to OCONUS. If facility
                                                requires MCSC private sector or DHA staffing support, please refer to Statement of
                                                Responsibilities (SOR) or Tricare Area Office (TAO). Note this is an increase and
                                                QPP-29037 not listed in summary of initiatives and shows as cancelled in SPIDR. TGF
                                                23MAR21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d55a16-b2d4-4825-ac8b-c04dd1f3cf22" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1c59867-7240-4baa-8557-93af85037015" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="1752a539-8ac6-4a01-bb8f-fcf96306c30a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="479e5368-54bf-4c3f-b10b-b05b0863e7b4" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="436e18ad-093d-4cb2-8892-a49cf1fff9dd" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="9cbae104-c3a9-45d1-8def-de8c268c69de" role="gridcell">7% OVERALL
                                                INC Reclama only made to NON-AD Males and should probably be expanded to females as
                                                well, however the reclama is minimal and has minor financial imact.
                                                AGuerrero05APR2021.</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="32e31b44-e8e1-4a0e-8b66-f63fd7f17099" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="26801ebb-b699-4f03-af65-10f000f2a135" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6b857350-cbb9-49f0-ba4a-b351e46b8870" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="928b1150-22df-43ff-9413-8319f8c425dc" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5ecd489b-cbdb-4ed4-b80b-de089b98ad0a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d22b78f9-f09b-468e-9c6b-3a64a31e0884" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="380d62e8-06fb-4901-9a7d-ad66ce1d41b0" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c237b15b-0576-4683-98ac-201222baf65a" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="84f09df2-0ac1-4d25-9a35-215eaf2a9015" role="gridcell">Wed Apr 14
                                                2021 16:35:50 GMT-0500 (Central Daylight Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="1e8f9ed2-d356-4321-b568-8ed3d320767f" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="5611a263-73f0-437b-9c13-0215d70e55f3" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="3875f4bc-3139-4772-bd5e-60c43f02e220" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="c31dc3f1-2204-4b48-becb-6104bfe9a396" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="be5bcc40-cd89-492a-8a36-b872978efa25" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="46b4722f-fc0e-481a-a41a-a050e1bdd420" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="d757a1bd-06af-4dd8-b488-4b763d615681" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac9672fb-6774-49de-9dce-36b6b9f8c2cb" role="gridcell">51</td>
                                            <td style="display:none" class=""
                                                aria-describedby="ac1cc97d-9124-4dee-ac28-c2f8e330d49c" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="902711e7-3f44-4e03-b3e1-a9678d51dcb4" role="gridcell">Theodosia
                                                Montgomery</td>
                                            <td style="display:none" class=""
                                                aria-describedby="932286c4-92d3-463f-9b0b-a56a1483fede" role="gridcell">Sat Jan 30
                                                2021 10:36:57 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="746df246-c436-4a6e-8a0d-c60306e0272f" role="gridcell">Theodosia
                                                Montgomery</td>
                                            <td style="display:none" class=""
                                                aria-describedby="dd5457d0-3ff1-4be4-adbd-ea7630086fa2" role="gridcell">Sat Jan 30
                                                2021 10:36:57 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="k-pager-wrap k-grid-pager k-widget k-floatwrap" data-role="pager"><a href="#"
                                    aria-label="Go to the first page" title="Go to the first page"
                                    class="k-link k-pager-nav k-pager-first" data-page="1" tabindex="-1"><span
                                        class="k-icon k-i-arrow-end-left"></span></a><a href="#"
                                    aria-label="Go to the previous page" title="Go to the previous page" class="k-link k-pager-nav"
                                    data-page="8" tabindex="-1"><span class="k-icon k-i-arrow-60-left"></span></a>
                                <ul class="k-pager-numbers k-reset">
                                    <li class="k-current-page"><span class="k-link k-pager-nav">9</span></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="1">1</a></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="2">2</a></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="3">3</a></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="4">4</a></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="5">5</a></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="6">6</a></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="7">7</a></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="8">8</a></li>
                                    <li><span class="k-state-selected">9</span></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="10">10</a></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="11" title="More pages">...</a></li>
                                </ul><a href="#" aria-label="Go to the next page" title="Go to the next page"
                                    class="k-link k-pager-nav" data-page="10" tabindex="-1"><span
                                        class="k-icon k-i-arrow-60-right"></span></a><a href="#" aria-label="Go to the last page"
                                    title="Go to the last page" class="k-link k-pager-nav k-pager-last" data-page="27"
                                    tabindex="-1"><span class="k-icon k-i-arrow-end-right"></span></a><span
                                    class="k-pager-sizes k-label"><span title="" class="k-widget k-dropdown k-header"
                                        unselectable="on" role="listbox" aria-haspopup="true" aria-expanded="false" tabindex="0"
                                        aria-owns="" aria-live="polite" aria-disabled="false" aria-busy="false"
                                        aria-activedescendant="4655d206-fdf5-4084-96a6-f8a2a94aca79" style=""><span
                                            unselectable="on" class="k-dropdown-wrap k-state-default"><span unselectable="on"
                                                class="k-input">10</span><span unselectable="on" class="k-select"
                                                aria-label="select"><span
                                                    class="k-icon k-i-arrow-60-down"></span></span></span><select
                                            data-role="dropdownlist" aria-label="10" style="display: none;">
                                            <option value="10" selected="selected">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                            <option value="75">75</option>
                                        </select></span>items per page</span><span class="k-pager-info k-label">81 - 90 of 261
                                    items</span>
                            </div>
                        </div>
                    </div>
                    <div class="k-content" id="tabstrip-2" role="tabpanel" aria-expanded="false" style="opacity: 0; display: none;"
                        aria-hidden="true">
                        <div id="workloadTrackerGrid" data-role="tooltip"
                            class="k-grid k-widget k-display-block k-reorderable k-editable">
                            <div class="k-header k-grid-toolbar"><a role="button" class="k-button k-button-icontext k-grid-excel"
                                    href="#"><span class="k-icon k-i-file-excel"></span>Export to Excel</a></div>
                            <div class="k-grouping-header" data-role="droptarget">Drag a column header and drop it here to group by
                                that column</div>
                            <div class="k-grid-header" style="padding-right: 17px;">
                                <div class="k-grid-header-wrap k-auto-scrollable" data-role="resizable">
                                    <table role="grid" tabindex="-1">
                                        <colgroup>
                                            <col style="width:100px">
                                            <col style="width:150px">
                                            <col style="width:200px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:200px">
                                            <col style="width:150px">
                                            <col style="width:200px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:150px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:150px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:150px">
                                            <col style="width:200px">
                                            <col style="width:150px">
                                            <col style="width:150px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:250px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:300px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:250px">
                                            <col style="width:250px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:400px">
                                            <col style="width:200px">
                                            <col style="width:300px">
                                            <col style="width:300px">
                                            <col style="width:200px">
                                            <col style="width:200px">
                                            <col style="width:250px">
                                            <col style="width:250px">
                                        </colgroup>
                                        <thead role="rowgroup">
                                            <tr role="row">
                                                <th scope="col" role="columnheader" data-field="WorkloadReclamaReviewId"
                                                    aria-haspopup="true" rowspan="1" data-title="Review ID" data-index="0"
                                                    id="ed80397b-7c20-4fe6-b8e4-3f721b2cab9d" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Review ID</a></th>
                                                <th scope="col" role="columnheader" data-field="FY" aria-haspopup="true" rowspan="1"
                                                    data-title="FY" data-index="1" id="a9fdc601-b153-40b8-97bf-e732b5a72896"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">FY</a></th>
                                                <th scope="col" role="columnheader" data-field="MarketName" aria-haspopup="true"
                                                    rowspan="1" data-title="Market Name" data-index="2"
                                                    id="fd3dd949-33b6-4935-a25d-2c864271722c"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Market Name</a></th>
                                                <th scope="col" role="columnheader" data-field="PARENT_DMIS_NAME"
                                                    aria-haspopup="true" rowspan="1" data-title="Parent DMIS Name" data-index="3"
                                                    id="2f38617d-be8d-4327-8276-b573c5a283b2"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Parent DMIS Name</a></th>
                                                <th scope="col" role="columnheader" data-field="DMIS_NAME" aria-haspopup="true"
                                                    rowspan="1" data-title="DMIS Name" data-index="4"
                                                    id="fdd8ac15-54e1-43cd-95de-56bb9176625c"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DMIS Name</a></th>
                                                <th scope="col" role="columnheader" data-field="SL" aria-haspopup="true" rowspan="1"
                                                    data-title="Service Line" data-index="5"
                                                    id="bed105e4-9fe7-493f-b4e5-cf229866730b"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Service Line</a></th>
                                                <th scope="col" role="columnheader" data-field="PROGRAM" aria-haspopup="true"
                                                    rowspan="1" data-title="Program" data-index="6"
                                                    id="97ddf155-a6f4-4e29-86db-9f09bf3b56cd"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Program</a></th>
                                                <th scope="col" role="columnheader" data-field="MEPRS_DESC" aria-haspopup="true"
                                                    rowspan="1" data-title="MEPRS" data-index="7"
                                                    id="617aaead-923f-4d4e-9771-cac3cd8d5985"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">MEPRS</a></th>
                                                <th scope="col" role="columnheader" data-field="APC_Value" aria-haspopup="true"
                                                    rowspan="1" data-title="APC Value" data-index="8"
                                                    id="ea5e7a89-2f69-4391-95a6-7aea2a88cc60"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">APC Value</a></th>
                                                <th scope="col" role="columnheader" data-field="DWV_Value" aria-haspopup="true"
                                                    rowspan="1" data-title="DWV Value" data-index="9"
                                                    id="cf946550-9ade-4bd9-9dae-0b814420d6e4"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DWV Value</a></th>
                                                <th scope="col" role="columnheader" data-field="PE_RVU_Value" aria-haspopup="true"
                                                    rowspan="1" data-title="PE RVU Value" data-index="10"
                                                    id="48d23dce-b496-4848-b2ee-3bc9b123df66"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">PE RVU Value</a></th>
                                                <th scope="col" role="columnheader" data-field="WPRK_RVU" aria-haspopup="true"
                                                    rowspan="1" data-title="WPRK RVU" data-index="11"
                                                    id="7ce13979-423c-47d3-8e4b-efeb81d3204d"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">WPRK RVU</a></th>
                                                <th scope="col" role="columnheader" data-field="RWP_Value" aria-haspopup="true"
                                                    rowspan="1" data-title="RWP Value" data-index="12"
                                                    id="f976abc2-ed6d-4660-bea4-a7e664677b5f"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">RWP Value</a></th>
                                                <th scope="col" role="columnheader" data-field="MHBD_Value" aria-haspopup="true"
                                                    rowspan="1" data-title="MHBD Value" data-index="13"
                                                    id="60bfd866-faac-4a96-80ae-1983e736b575"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">MHBD Value</a></th>
                                                <th scope="col" role="columnheader" data-field="Adjusted_APC_Value"
                                                    aria-haspopup="true" rowspan="1" data-title="Adjusted APC Value" data-index="14"
                                                    id="a43ebe15-d9e9-40db-b88c-e12139a97f71"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Adjusted APC Value</a></th>
                                                <th scope="col" role="columnheader" data-field="Adjusted_DWV_Value"
                                                    aria-haspopup="true" rowspan="1" data-title="Adjusted DWV Value" data-index="15"
                                                    id="58697fda-91a6-4661-993b-ae5f307c1c79"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Adjusted DWV Value</a></th>
                                                <th scope="col" role="columnheader" data-field="Adjusted_PE_RVU_Value"
                                                    aria-haspopup="true" rowspan="1" data-title="Adjusted PE RVU Value"
                                                    data-index="16" id="84051d43-3f64-4d15-835f-66b4d05b6d7d"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Adjusted PE RVU Value</a></th>
                                                <th scope="col" role="columnheader" data-field="Adjusted_WPRK_RVU"
                                                    aria-haspopup="true" rowspan="1" data-title="Adjusted WPRK RVU" data-index="17"
                                                    id="48013460-a77e-4362-99ec-f92525ac68d6"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Adjusted WPRK RVU</a></th>
                                                <th scope="col" role="columnheader" data-field="Adjusted_RWP_Value"
                                                    aria-haspopup="true" rowspan="1" data-title="Adjusted RWP Value" data-index="18"
                                                    id="82b5a400-ab78-41f1-84b2-33598879b4fe"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Adjusted RWP Value</a></th>
                                                <th scope="col" role="columnheader" data-field="Adjusted_MHBD_Value"
                                                    aria-haspopup="true" rowspan="1" data-title="Adjusted MHBD Value"
                                                    data-index="19" id="798f2724-74ca-41cb-96dd-6130eb447903"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Adjusted MHBD Value</a></th>
                                                <th scope="col" role="columnheader" data-field="FTE_MIL" aria-haspopup="true"
                                                    rowspan="1" data-title="FTE MIL" data-index="20"
                                                    id="43e99eb8-b9b8-41c6-8b05-728fb7d345a7"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">FTE MIL</a></th>
                                                <th scope="col" role="columnheader" data-field="FTE_CIV" aria-haspopup="true"
                                                    rowspan="1" data-title="FTE CIV" data-index="21"
                                                    id="cf43ebd0-6a77-41f1-8d3a-8ba872d241ba"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">FTE CIV</a></th>
                                                <th scope="col" role="columnheader" data-field="FTE_CNTR" aria-haspopup="true"
                                                    rowspan="1" data-title="FTE CNTR" data-index="22"
                                                    id="3df7b25c-c3c2-42a1-a18d-0c366e7da368"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">FTE CNTR</a></th>
                                                <th scope="col" role="columnheader" data-field="SKILLTYPE_DESC" aria-haspopup="true"
                                                    rowspan="1" data-title="Skill Type" data-index="23"
                                                    id="a57348ac-ffb9-4354-858f-4a3a81781788"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Skill Type</a></th>
                                                <th scope="col" role="columnheader" data-field="ProviderSpecialtyDesc"
                                                    aria-haspopup="true" rowspan="1" data-title="Provider Specialty" data-index="24"
                                                    id="cdfc563f-4c3b-4564-81c6-1958f5b4d3fa"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Provider Specialty</a></th>
                                                <th scope="col" role="columnheader" data-field="INCREASE_DECREASE"
                                                    aria-haspopup="true" rowspan="1" data-title="Increase/Decrease" data-index="25"
                                                    id="8787b8cc-434a-4953-aa5e-9336f9180b4a"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Increase/Decrease</a></th>
                                                <th scope="col" role="columnheader" data-field="Capability_Capacity"
                                                    aria-haspopup="true" rowspan="1" data-title="Capability/Capacity"
                                                    data-index="26" id="e33ac1ea-adcf-4801-8474-9e6808376003"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Capability/Capacity</a></th>
                                                <th scope="col" role="columnheader" data-field="Adjustment_Reason"
                                                    aria-haspopup="true" rowspan="1" data-title="Adjustment Reason" data-index="27"
                                                    id="c12a1545-4438-4162-96a1-eaebfeb83cd6"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Adjustment Reason</a></th>
                                                <th scope="col" role="columnheader" data-field="NetworkStaffingRequest"
                                                    aria-haspopup="true" rowspan="1" data-title="Network/Staffing Request"
                                                    data-index="28" id="cee426d7-5b06-402a-bc75-c2dcd0886d68"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Network/Staffing Request</a></th>
                                                <th scope="col" role="columnheader" data-field="InitiativeNumber"
                                                    aria-haspopup="true" rowspan="1" data-title="SPIDR ID" data-index="29"
                                                    id="167598df-f0d1-49fa-8415-a4b03b958ab0"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">SPIDR ID</a></th>
                                                <th scope="col" role="columnheader" data-field="Expected_Start_Date"
                                                    aria-haspopup="true" rowspan="1" data-title="Expected Start Date"
                                                    data-index="30" id="28a65422-a6cc-4bbe-ad4a-6dda1957c80b"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Expected Start Date</a></th>
                                                <th scope="col" role="columnheader" data-field="Expected_End_Date"
                                                    aria-haspopup="true" rowspan="1" data-title="Expected End Date" data-index="31"
                                                    id="3d640dc1-752b-4698-9767-d49b4abece67"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Expected End Date</a></th>
                                                <th scope="col" role="columnheader" data-field="Created" aria-haspopup="true"
                                                    rowspan="1" data-title="Created" data-index="32"
                                                    id="6f6d611f-ec4e-4a0c-b24a-44bf50fe1970"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Created</a></th>
                                                <th scope="col" role="columnheader" data-field="Comments" aria-haspopup="true"
                                                    rowspan="1" data-title="Comments" data-index="33"
                                                    id="d360b0be-8e1b-4199-8031-cefd73680373"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: gray;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Comments</a></th>
                                                <th scope="col" role="columnheader" data-field="Q1" aria-haspopup="true" rowspan="1"
                                                    data-title="DHA Market Integration Business Operations Specialist Review"
                                                    data-index="34" id="5fd17685-405f-4ab5-aaa8-6541f2278ca2"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: orange;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA Market Integration Business Operations Specialist
                                                        Review</a></th>
                                                <th scope="col" role="columnheader" data-field="Q1_Comments" aria-haspopup="true"
                                                    rowspan="1"
                                                    data-title="DHA Market Integration Business Operations Specialist Review Comments"
                                                    data-index="35" id="3e8cfdd3-85f3-4549-b022-d67daac2f442"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: orange;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA Market Integration Business Operations Specialist Review
                                                        Comments</a></th>
                                                <th scope="col" role="columnheader" data-field="Q2" aria-haspopup="true" rowspan="1"
                                                    data-title="DHA Market Integration Decision Support Evaluation" data-index="36"
                                                    id="0e029b9d-c5b3-443b-86d8-8cec4eba3c38"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: orange;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA Market Integration Decision Support Evaluation</a></th>
                                                <th scope="col" role="columnheader" data-field="Q2_Comments" aria-haspopup="true"
                                                    rowspan="1"
                                                    data-title="DHA Market Integration Decision Support Evaluation Comments"
                                                    data-index="37" id="6613f6a5-c503-480d-bca5-8ac47ce3d81c"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: orange;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA Market Integration Decision Support Evaluation
                                                        Comments</a></th>
                                                <th scope="col" role="columnheader" data-field="Q3" aria-haspopup="true" rowspan="1"
                                                    data-title="DHA Health Care Optimization" data-index="38"
                                                    id="b1d21149-e408-47da-80eb-acaa4998cfe3"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: orange;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA Health Care Optimization</a></th>
                                                <th scope="col" role="columnheader" data-field="Q3_Comments" aria-haspopup="true"
                                                    rowspan="1" data-title="DHA Health Care Optimization Comments" data-index="39"
                                                    id="e5a799fa-cc22-4f3f-8757-b2895f1d975a"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: orange;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA Health Care Optimization Comments</a></th>
                                                <th scope="col" role="columnheader" data-field="Q4" aria-haspopup="true" rowspan="1"
                                                    data-title="DHA Readiness Evaluation (AD CS)" data-index="40"
                                                    id="7f8f4a1a-6fe7-4e40-a380-e8ec11b7cdeb"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: orange;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA Readiness Evaluation (AD CS)</a></th>
                                                <th scope="col" role="columnheader" data-field="Q5" aria-haspopup="true" rowspan="1"
                                                    data-title="DHA Readiness Evaluation (AD CS)" data-index="41"
                                                    id="894609d2-6848-4c56-b1c7-a3ba9a6ca4e1"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: orange;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA Readiness Evaluation (AD CS)</a></th>
                                                <th scope="col" role="columnheader" data-field="Q9" aria-haspopup="true" rowspan="1"
                                                    data-title="DHA Readiness Evaluation (AD CS)" data-index="42"
                                                    id="f5c88682-3bee-4ade-9746-ed01efabdc5b"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: orange;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA Readiness Evaluation (AD CS)</a></th>
                                                <th scope="col" role="columnheader" data-field="Q4_Comments" aria-haspopup="true"
                                                    rowspan="1" data-title="DHA Readiness Evaluation (AD CS) Comments"
                                                    data-index="43" id="6c8d006d-db76-4169-9979-6edf6955350d"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: orange;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA Readiness Evaluation (AD CS) Comments</a></th>
                                                <th scope="col" role="columnheader" data-field="Q6" aria-haspopup="true" rowspan="1"
                                                    data-title="DHA Adjudication Recommendation (HCO/AD CS Huddle)" data-index="44"
                                                    id="5304b02c-fcda-48f6-875e-583dc806be4a"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: orange;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA Adjudication Recommendation (HCO/AD CS Huddle)</a></th>
                                                <th scope="col" role="columnheader" data-field="Q6_Comments" aria-haspopup="true"
                                                    rowspan="1"
                                                    data-title="DHA Adjudication Recommendation (HCO/AD CS Huddle) Comments"
                                                    data-index="45" id="e87853f9-eb19-458d-bf3d-91cb66500725"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: orange;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA Adjudication Recommendation (HCO/AD CS Huddle)
                                                        Comments</a></th>
                                                <th scope="col" role="columnheader" data-field="Q7" aria-haspopup="true" rowspan="1"
                                                    data-title="DHA HSD Evaluation" data-index="46"
                                                    id="272953dc-6e37-4a20-a0b3-4dca99ad6398"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: dodgerblue;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA HSD Evaluation</a></th>
                                                <th scope="col" role="columnheader" data-field="Q7_Comments" aria-haspopup="true"
                                                    rowspan="1" data-title="DHA HSD Evaluation Comments" data-index="47"
                                                    id="deb23c90-4b3b-41fc-aa29-e294379745bc"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: dodgerblue;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">DHA HSD Evaluation Comments</a></th>
                                                <th scope="col" role="columnheader" data-field="Q8" aria-haspopup="true" rowspan="1"
                                                    data-title="QPP Planning Evaluation" data-index="48"
                                                    id="ab3a1b9c-210c-457f-97cf-8d16896e78cb"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: darkred;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">QPP Planning Evaluation</a></th>
                                                <th scope="col" role="columnheader" data-field="Q8_Comments" aria-haspopup="true"
                                                    rowspan="1" data-title="QPP Planning Comments" data-index="49"
                                                    id="06ee4d80-5898-439c-882f-e2d32b77b184"
                                                    style="white-space: pre-wrap; vertical-align: top; background-color: darkred;"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">QPP Planning Comments</a></th>
                                                <th scope="col" role="columnheader" data-field="Q1_Updated_DTTM"
                                                    aria-haspopup="true" rowspan="1" data-title="Q1 Updated DTTM" data-index="50"
                                                    id="4837bd45-bb4f-4578-b53a-07dcbde2fa3f" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q1 Updated DTTM</a></th>
                                                <th scope="col" role="columnheader" data-field="Q2_Updated_DTTM"
                                                    aria-haspopup="true" rowspan="1" data-title="Q2 Updated DTTM" data-index="51"
                                                    id="4526ce40-a13c-4a5c-8d21-55451aa1e264" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q2 Updated DTTM</a></th>
                                                <th scope="col" role="columnheader" data-field="Q3_Updated_DTTM"
                                                    aria-haspopup="true" rowspan="1" data-title="Q3 Updated DTTM" data-index="52"
                                                    id="d8f1eca3-7476-43c9-9428-569c2c36e815" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q3 Updated DTTM</a></th>
                                                <th scope="col" role="columnheader" data-field="Q4_Updated_DTTM"
                                                    aria-haspopup="true" rowspan="1" data-title="Q4 Updated DTTM" data-index="53"
                                                    id="641f6e1e-13ec-4ff7-924e-b62a61ff21fd" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q4 Updated DTTM</a></th>
                                                <th scope="col" role="columnheader" data-field="Q5_Updated_DTTM"
                                                    aria-haspopup="true" rowspan="1" data-title="Q5 Updated DTTM" data-index="54"
                                                    id="91e9da65-b938-4916-ac71-aad2974b3cfe" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q5 Updated DTTM</a></th>
                                                <th scope="col" role="columnheader" data-field="Q6_Updated_DTTM"
                                                    aria-haspopup="true" rowspan="1" data-title="Q6 Updated DTTM" data-index="55"
                                                    id="6c135dd9-b176-48e2-82d5-0c319209c4d6" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q6 Updated DTTM</a></th>
                                                <th scope="col" role="columnheader" data-field="Q7_Updated_DTTM"
                                                    aria-haspopup="true" rowspan="1" data-title="Q7 Updated DTTM" data-index="56"
                                                    id="e7229504-351c-49f9-bb6a-0588112ce398" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q7 Updated DTTM</a></th>
                                                <th scope="col" role="columnheader" data-field="Q8_Updated_DTTM"
                                                    aria-haspopup="true" rowspan="1" data-title="Q8 Updated DTTM" data-index="57"
                                                    id="2d79a6c7-32e8-4e44-b6e8-f0dc58a608d4" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q8 Updated DTTM</a></th>
                                                <th scope="col" role="columnheader" data-field="Q1_Updated_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Q1 Updated UserId" data-index="58"
                                                    id="ccae6114-b302-4260-9a7c-79a87ddf28d4" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q1 Updated UserId</a></th>
                                                <th scope="col" role="columnheader" data-field="Q2_Updated_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Q2 Updated UserId" data-index="59"
                                                    id="c723525f-7a0a-4524-8c2f-a5957295420d" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q2 Updated UserId</a></th>
                                                <th scope="col" role="columnheader" data-field="Q3_Updated_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Q3 Updated UserId" data-index="60"
                                                    id="8937f2d5-ae64-4eaf-a2af-fd8342e87dab" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q3 Updated UserId</a></th>
                                                <th scope="col" role="columnheader" data-field="Q4_Updated_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Q4 Updated UserId" data-index="61"
                                                    id="685065a6-860a-4362-9964-f9e6ae5d5498" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q4 Updated UserId</a></th>
                                                <th scope="col" role="columnheader" data-field="Q5_Updated_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Q5 Updated UserId" data-index="62"
                                                    id="2e9d39e2-061b-4df4-b020-90a14ef704ff" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q5 Updated UserId</a></th>
                                                <th scope="col" role="columnheader" data-field="Q6_Updated_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Q6 Updated UserId" data-index="63"
                                                    id="56071960-b8ea-43a6-af4f-72711357bd74" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q6 Updated UserId</a></th>
                                                <th scope="col" role="columnheader" data-field="Q7_Updated_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Q7 Updated UserId" data-index="64"
                                                    id="571d3cf6-5b26-4adc-ac38-e0a4de4e5d52" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q7 Updated UserId</a></th>
                                                <th scope="col" role="columnheader" data-field="Q8_Updated_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Q8 Updated UserId" data-index="65"
                                                    id="c8aa73cc-5235-4cbb-ae93-4e2c03ef95e9" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Q8 Updated UserId</a></th>
                                                <th scope="col" role="columnheader" data-field="CreatedBy_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Created By User" data-index="66"
                                                    id="a6a08a63-b00a-4eed-a21d-e6aa5d87307a" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Created By User</a></th>
                                                <th scope="col" role="columnheader" data-field="Created_DTTM" aria-haspopup="true"
                                                    rowspan="1" data-title="Time Created" data-index="67"
                                                    id="7b4e7bef-4b84-424a-a540-c6525bc5f325" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Time Created</a></th>
                                                <th scope="col" role="columnheader" data-field="UpdatedBy_UserId"
                                                    aria-haspopup="true" rowspan="1" data-title="Last Updated By" data-index="68"
                                                    id="fb6605e9-6c75-41a5-bf10-44dbe80403f3" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Last Updated By</a></th>
                                                <th scope="col" role="columnheader" data-field="Updated_DTTM" aria-haspopup="true"
                                                    rowspan="1" data-title="Last Updated" data-index="69"
                                                    id="a93e0f28-cac7-4057-9447-e6fc299a4ce3" style="display:none"
                                                    class="k-header k-with-icon" data-role="columnsorter"><a
                                                        class="k-header-column-menu" href="#" title="Column Settings"
                                                        aria-label="Column Settings" tabindex="-1"><span
                                                            class="k-icon k-i-more-vertical"></span></a><a class="k-link" href="#"
                                                        tabindex="-1">Last Updated</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div class="k-resize-handle" style="top: 0px; left: 247px; height: 169px; width: 9px;">
                                        <div class="k-resize-handle-inner"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="k-grid-content k-auto-scrollable">
                                <table role="grid" tabindex="0">
                                    <colgroup>
                                        <col style="width:100px">
                                        <col style="width:150px">
                                        <col style="width:200px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:200px">
                                        <col style="width:150px">
                                        <col style="width:200px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:150px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:150px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:150px">
                                        <col style="width:200px">
                                        <col style="width:150px">
                                        <col style="width:150px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:250px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:300px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:250px">
                                        <col style="width:250px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:400px">
                                        <col style="width:200px">
                                        <col style="width:300px">
                                        <col style="width:300px">
                                        <col style="width:200px">
                                        <col style="width:200px">
                                        <col style="width:250px">
                                        <col style="width:250px">
                                    </colgroup>
                                    <tbody role="rowgroup">
                                        <tr data-uid="09aaae1d-099d-420c-9817-f0c211460bad" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="ed80397b-7c20-4fe6-b8e4-3f721b2cab9d" role="gridcell">2513</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a9fdc601-b153-40b8-97bf-e732b5a72896" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fd3dd949-33b6-4935-a25d-2c864271722c" role="gridcell">ALASKA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="2f38617d-be8d-4327-8276-b573c5a283b2" role="gridcell">(0005) ACH
                                                BASSETT-WAINWRIGHT</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fdd8ac15-54e1-43cd-95de-56bb9176625c" role="gridcell">(0005) ACH
                                                BASSETT-WAINWRIGHT</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bed105e4-9fe7-493f-b4e5-cf229866730b" role="gridcell">BHSL</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="97ddf155-a6f4-4e29-86db-9f09bf3b56cd" role="gridcell">Embedded BH
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="617aaead-923f-4d4e-9771-cac3cd8d5985" role="gridcell">(BFD4)
                                                EMBEDDED BEHAVIORAL HEALTH</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ea5e7a89-2f69-4391-95a6-7aea2a88cc60" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf946550-9ade-4bd9-9dae-0b814420d6e4" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48d23dce-b496-4848-b2ee-3bc9b123df66" role="gridcell">5296.5505
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="7ce13979-423c-47d3-8e4b-efeb81d3204d" role="gridcell">12576.685
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f976abc2-ed6d-4660-bea4-a7e664677b5f" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="60bfd866-faac-4a96-80ae-1983e736b575" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a43ebe15-d9e9-40db-b88c-e12139a97f71" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="58697fda-91a6-4661-993b-ae5f307c1c79" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="84051d43-3f64-4d15-835f-66b4d05b6d7d" role="gridcell">-5296.55
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48013460-a77e-4362-99ec-f92525ac68d6" role="gridcell">-12576.69
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="82b5a400-ab78-41f1-84b2-33598879b4fe" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="798f2724-74ca-41cb-96dd-6130eb447903" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="43e99eb8-b9b8-41c6-8b05-728fb7d345a7" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf43ebd0-6a77-41f1-8d3a-8ba872d241ba" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3df7b25c-c3c2-42a1-a18d-0c366e7da368" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a57348ac-ffb9-4354-858f-4a3a81781788" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cdfc563f-4c3b-4564-81c6-1958f5b4d3fa" role="gridcell">Not
                                                Applicable</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="8787b8cc-434a-4953-aa5e-9336f9180b4a" role="gridcell">Decrease
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e33ac1ea-adcf-4801-8474-9e6808376003" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c12a1545-4438-4162-96a1-eaebfeb83cd6" role="gridcell">Other
                                                (non-staff related)
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cee426d7-5b06-402a-bc75-c2dcd0886d68" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="167598df-f0d1-49fa-8415-a4b03b958ab0" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="28a65422-a6cc-4bbe-ad4a-6dda1957c80b" role="gridcell">10/1/2021
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3d640dc1-752b-4698-9767-d49b4abece67" role="gridcell">9/30/2022
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6f6d611f-ec4e-4a0c-b24a-44bf50fe1970" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d360b0be-8e1b-4199-8031-cefd73680373" role="gridcell">The MTF
                                                projects no BFD workload under DMIS 0005 in FY22, reducing the BFD4 target from
                                                12,577 wRVUs and 5,297 peRVUs to 0 as well as BFDA from 3 wRVUs and 1 peRVU to 0.
                                            </td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fd17685-405f-4ab5-aaa8-6541f2278ca2" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="3e8cfdd3-85f3-4549-b022-d67daac2f442" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector support request for this reclama
                                                under network-staffing request field. -Tamara Fatzinger, Market Integration
                                                Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="0e029b9d-c5b3-443b-86d8-8cec4eba3c38" role="gridcell">Not
                                                Available</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6613f6a5-c503-480d-bca5-8ac47ce3d81c" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector or civilian staffing support
                                                request for this reclama under network-staffing request field. -Tamara Fatzinger,
                                                Market Integration Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d21149-e408-47da-80eb-acaa4998cfe3" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e5a799fa-cc22-4f3f-8757-b2895f1d975a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="7f8f4a1a-6fe7-4e40-a380-e8ec11b7cdeb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="894609d2-6848-4c56-b1c7-a3ba9a6ca4e1" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="f5c88682-3bee-4ade-9746-ed01efabdc5b" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6c8d006d-db76-4169-9979-6edf6955350d" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5304b02c-fcda-48f6-875e-583dc806be4a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e87853f9-eb19-458d-bf3d-91cb66500725" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="272953dc-6e37-4a20-a0b3-4dca99ad6398" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="deb23c90-4b3b-41fc-aa29-e294379745bc" role="gridcell">Acknowledge
                                                change to BHSL workload in BFD. However, as a Genesis site, resourcing will not be
                                                determined by workload in FY22 -this may change-. Aguerrero 09April2021</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="ab3a1b9c-210c-457f-97cf-8d16896e78cb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="06ee4d80-5898-439c-882f-e2d32b77b184" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="4837bd45-bb4f-4578-b53a-07dcbde2fa3f" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="4526ce40-a13c-4a5c-8d21-55451aa1e264" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="d8f1eca3-7476-43c9-9428-569c2c36e815" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="641f6e1e-13ec-4ff7-924e-b62a61ff21fd" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="91e9da65-b938-4916-ac71-aad2974b3cfe" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6c135dd9-b176-48e2-82d5-0c319209c4d6" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="e7229504-351c-49f9-bb6a-0588112ce398" role="gridcell">4/14/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="2d79a6c7-32e8-4e44-b6e8-f0dc58a608d4" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ccae6114-b302-4260-9a7c-79a87ddf28d4" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c723525f-7a0a-4524-8c2f-a5957295420d" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="8937f2d5-ae64-4eaf-a2af-fd8342e87dab" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="685065a6-860a-4362-9964-f9e6ae5d5498" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="2e9d39e2-061b-4df4-b020-90a14ef704ff" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="56071960-b8ea-43a6-af4f-72711357bd74" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="571d3cf6-5b26-4adc-ac38-e0a4de4e5d52" role="gridcell">37</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c8aa73cc-5235-4cbb-ae93-4e2c03ef95e9" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="a6a08a63-b00a-4eed-a21d-e6aa5d87307a" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="7b4e7bef-4b84-424a-a540-c6525bc5f325" role="gridcell">Wed Jan 20
                                                2021 00:36:41 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="fb6605e9-6c75-41a5-bf10-44dbe80403f3" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="a93e0f28-cac7-4057-9447-e6fc299a4ce3" role="gridcell">Thu Jan 21
                                                2021 00:04:12 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                        <tr class="k-alt" data-uid="7c884da9-33cf-4d06-83e4-1f3eeca6f724" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="ed80397b-7c20-4fe6-b8e4-3f721b2cab9d" role="gridcell">2514</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a9fdc601-b153-40b8-97bf-e732b5a72896" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fd3dd949-33b6-4935-a25d-2c864271722c" role="gridcell">ALASKA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="2f38617d-be8d-4327-8276-b573c5a283b2" role="gridcell">(0005) ACH
                                                BASSETT-WAINWRIGHT</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fdd8ac15-54e1-43cd-95de-56bb9176625c" role="gridcell">(0005) ACH
                                                BASSETT-WAINWRIGHT</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bed105e4-9fe7-493f-b4e5-cf229866730b" role="gridcell">BHSL</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="97ddf155-a6f4-4e29-86db-9f09bf3b56cd" role="gridcell">Multi-D</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="617aaead-923f-4d4e-9771-cac3cd8d5985" role="gridcell">(BFDA) </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ea5e7a89-2f69-4391-95a6-7aea2a88cc60" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf946550-9ade-4bd9-9dae-0b814420d6e4" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48d23dce-b496-4848-b2ee-3bc9b123df66" role="gridcell">1.253</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="7ce13979-423c-47d3-8e4b-efeb81d3204d" role="gridcell">3.0071</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f976abc2-ed6d-4660-bea4-a7e664677b5f" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="60bfd866-faac-4a96-80ae-1983e736b575" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a43ebe15-d9e9-40db-b88c-e12139a97f71" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="58697fda-91a6-4661-993b-ae5f307c1c79" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="84051d43-3f64-4d15-835f-66b4d05b6d7d" role="gridcell">-1.25</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48013460-a77e-4362-99ec-f92525ac68d6" role="gridcell">-3.01</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="82b5a400-ab78-41f1-84b2-33598879b4fe" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="798f2724-74ca-41cb-96dd-6130eb447903" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="43e99eb8-b9b8-41c6-8b05-728fb7d345a7" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf43ebd0-6a77-41f1-8d3a-8ba872d241ba" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3df7b25c-c3c2-42a1-a18d-0c366e7da368" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a57348ac-ffb9-4354-858f-4a3a81781788" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cdfc563f-4c3b-4564-81c6-1958f5b4d3fa" role="gridcell">Not
                                                Applicable</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="8787b8cc-434a-4953-aa5e-9336f9180b4a" role="gridcell">Decrease
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e33ac1ea-adcf-4801-8474-9e6808376003" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c12a1545-4438-4162-96a1-eaebfeb83cd6" role="gridcell">Other
                                                (non-staff related)
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cee426d7-5b06-402a-bc75-c2dcd0886d68" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="167598df-f0d1-49fa-8415-a4b03b958ab0" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="28a65422-a6cc-4bbe-ad4a-6dda1957c80b" role="gridcell">10/1/2021
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3d640dc1-752b-4698-9767-d49b4abece67" role="gridcell">9/30/2022
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6f6d611f-ec4e-4a0c-b24a-44bf50fe1970" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d360b0be-8e1b-4199-8031-cefd73680373" role="gridcell">The MTF
                                                projects no BFD workload under DMIS 0005 in FY22, reducing the BFD4 target from
                                                12,577 wRVUs and 5,297 peRVUs to 0 as well as BFDA from 3 wRVUs and 1 peRVU to 0.
                                            </td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fd17685-405f-4ab5-aaa8-6541f2278ca2" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="3e8cfdd3-85f3-4549-b022-d67daac2f442" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector support request for this reclama
                                                under network-staffing request field. -Tamara Fatzinger, Market Integration
                                                Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="0e029b9d-c5b3-443b-86d8-8cec4eba3c38" role="gridcell">Not
                                                Available</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6613f6a5-c503-480d-bca5-8ac47ce3d81c" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector or civilian staffing support
                                                request for this reclama under network-staffing request field. -Tamara Fatzinger,
                                                Market Integration Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d21149-e408-47da-80eb-acaa4998cfe3" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e5a799fa-cc22-4f3f-8757-b2895f1d975a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="7f8f4a1a-6fe7-4e40-a380-e8ec11b7cdeb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="894609d2-6848-4c56-b1c7-a3ba9a6ca4e1" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="f5c88682-3bee-4ade-9746-ed01efabdc5b" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6c8d006d-db76-4169-9979-6edf6955350d" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5304b02c-fcda-48f6-875e-583dc806be4a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e87853f9-eb19-458d-bf3d-91cb66500725" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="272953dc-6e37-4a20-a0b3-4dca99ad6398" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="deb23c90-4b3b-41fc-aa29-e294379745bc" role="gridcell">Acknowledge
                                                change to BHSL workload in BFD. However, as a Genesis site, resourcing will not be
                                                determined by workload in FY22 this may change. Aguerrero 09April2021</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="ab3a1b9c-210c-457f-97cf-8d16896e78cb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="06ee4d80-5898-439c-882f-e2d32b77b184" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="4837bd45-bb4f-4578-b53a-07dcbde2fa3f" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="4526ce40-a13c-4a5c-8d21-55451aa1e264" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="d8f1eca3-7476-43c9-9428-569c2c36e815" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="641f6e1e-13ec-4ff7-924e-b62a61ff21fd" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="91e9da65-b938-4916-ac71-aad2974b3cfe" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6c135dd9-b176-48e2-82d5-0c319209c4d6" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="e7229504-351c-49f9-bb6a-0588112ce398" role="gridcell">4/14/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="2d79a6c7-32e8-4e44-b6e8-f0dc58a608d4" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ccae6114-b302-4260-9a7c-79a87ddf28d4" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c723525f-7a0a-4524-8c2f-a5957295420d" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="8937f2d5-ae64-4eaf-a2af-fd8342e87dab" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="685065a6-860a-4362-9964-f9e6ae5d5498" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="2e9d39e2-061b-4df4-b020-90a14ef704ff" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="56071960-b8ea-43a6-af4f-72711357bd74" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="571d3cf6-5b26-4adc-ac38-e0a4de4e5d52" role="gridcell">37</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c8aa73cc-5235-4cbb-ae93-4e2c03ef95e9" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="a6a08a63-b00a-4eed-a21d-e6aa5d87307a" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="7b4e7bef-4b84-424a-a540-c6525bc5f325" role="gridcell">Wed Jan 20
                                                2021 00:38:52 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="fb6605e9-6c75-41a5-bf10-44dbe80403f3" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="a93e0f28-cac7-4057-9447-e6fc299a4ce3" role="gridcell">Thu Jan 21
                                                2021 00:04:12 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                        <tr data-uid="629d37d4-e1a1-4d3f-8de0-2fbc4740f6b0" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="ed80397b-7c20-4fe6-b8e4-3f721b2cab9d" role="gridcell">2515</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a9fdc601-b153-40b8-97bf-e732b5a72896" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fd3dd949-33b6-4935-a25d-2c864271722c" role="gridcell">ALASKA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="2f38617d-be8d-4327-8276-b573c5a283b2" role="gridcell">(0005) ACH
                                                BASSETT-WAINWRIGHT</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fdd8ac15-54e1-43cd-95de-56bb9176625c" role="gridcell">(0005) ACH
                                                BASSETT-WAINWRIGHT</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bed105e4-9fe7-493f-b4e5-cf229866730b" role="gridcell">MESL</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="97ddf155-a6f4-4e29-86db-9f09bf3b56cd" role="gridcell">ALL</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="617aaead-923f-4d4e-9771-cac3cd8d5985" role="gridcell">(BAP)
                                                DERMATOLOGY CLINIC</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ea5e7a89-2f69-4391-95a6-7aea2a88cc60" role="gridcell">17.5535</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf946550-9ade-4bd9-9dae-0b814420d6e4" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48d23dce-b496-4848-b2ee-3bc9b123df66" role="gridcell">3529.4086
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="7ce13979-423c-47d3-8e4b-efeb81d3204d" role="gridcell">2134.6496
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f976abc2-ed6d-4660-bea4-a7e664677b5f" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="60bfd866-faac-4a96-80ae-1983e736b575" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a43ebe15-d9e9-40db-b88c-e12139a97f71" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="58697fda-91a6-4661-993b-ae5f307c1c79" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="84051d43-3f64-4d15-835f-66b4d05b6d7d" role="gridcell">2203</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48013460-a77e-4362-99ec-f92525ac68d6" role="gridcell">1252</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="82b5a400-ab78-41f1-84b2-33598879b4fe" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="798f2724-74ca-41cb-96dd-6130eb447903" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="43e99eb8-b9b8-41c6-8b05-728fb7d345a7" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf43ebd0-6a77-41f1-8d3a-8ba872d241ba" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3df7b25c-c3c2-42a1-a18d-0c366e7da368" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a57348ac-ffb9-4354-858f-4a3a81781788" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cdfc563f-4c3b-4564-81c6-1958f5b4d3fa" role="gridcell">
                                                Physician/Dermatology/Dermatopathology</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="8787b8cc-434a-4953-aa5e-9336f9180b4a" role="gridcell">Increase
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e33ac1ea-adcf-4801-8474-9e6808376003" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c12a1545-4438-4162-96a1-eaebfeb83cd6" role="gridcell">Other
                                                (specify in comments)
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cee426d7-5b06-402a-bc75-c2dcd0886d68" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="167598df-f0d1-49fa-8415-a4b03b958ab0" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="28a65422-a6cc-4bbe-ad4a-6dda1957c80b" role="gridcell">10/1/2019
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3d640dc1-752b-4698-9767-d49b4abece67" role="gridcell">9/30/2020
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6f6d611f-ec4e-4a0c-b24a-44bf50fe1970" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d360b0be-8e1b-4199-8031-cefd73680373" role="gridcell">Updated
                                                estimate based on provider productivity and demand. Used FY20 production data and
                                                substituted APR and MAY numbers with the average of the other 10 months due to the
                                                provider only conducting virtual appointments during those months. </td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fd17685-405f-4ab5-aaa8-6541f2278ca2" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="3e8cfdd3-85f3-4549-b022-d67daac2f442" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector support request for this reclama
                                                under network-staffing request field. -Tamara Fatzinger, Market Integration
                                                Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="0e029b9d-c5b3-443b-86d8-8cec4eba3c38" role="gridcell">Not
                                                Available</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6613f6a5-c503-480d-bca5-8ac47ce3d81c" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector or civilian staffing support
                                                request for this reclama under network-staffing request field. -Tamara Fatzinger,
                                                Market Integration Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d21149-e408-47da-80eb-acaa4998cfe3" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e5a799fa-cc22-4f3f-8757-b2895f1d975a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="7f8f4a1a-6fe7-4e40-a380-e8ec11b7cdeb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="894609d2-6848-4c56-b1c7-a3ba9a6ca4e1" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="f5c88682-3bee-4ade-9746-ed01efabdc5b" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6c8d006d-db76-4169-9979-6edf6955350d" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5304b02c-fcda-48f6-875e-583dc806be4a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e87853f9-eb19-458d-bf3d-91cb66500725" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="272953dc-6e37-4a20-a0b3-4dca99ad6398" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="deb23c90-4b3b-41fc-aa29-e294379745bc" role="gridcell">Acknowledge
                                                request for increased MESL workload in BAP DERM. However, as a Genesis site,
                                                resourcing will not be determined by workload in FY22 - this may change-. Aguerrero
                                                09April2021</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="ab3a1b9c-210c-457f-97cf-8d16896e78cb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="06ee4d80-5898-439c-882f-e2d32b77b184" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="4837bd45-bb4f-4578-b53a-07dcbde2fa3f" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="4526ce40-a13c-4a5c-8d21-55451aa1e264" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="d8f1eca3-7476-43c9-9428-569c2c36e815" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="641f6e1e-13ec-4ff7-924e-b62a61ff21fd" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="91e9da65-b938-4916-ac71-aad2974b3cfe" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6c135dd9-b176-48e2-82d5-0c319209c4d6" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="e7229504-351c-49f9-bb6a-0588112ce398" role="gridcell">4/14/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="2d79a6c7-32e8-4e44-b6e8-f0dc58a608d4" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ccae6114-b302-4260-9a7c-79a87ddf28d4" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c723525f-7a0a-4524-8c2f-a5957295420d" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="8937f2d5-ae64-4eaf-a2af-fd8342e87dab" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="685065a6-860a-4362-9964-f9e6ae5d5498" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="2e9d39e2-061b-4df4-b020-90a14ef704ff" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="56071960-b8ea-43a6-af4f-72711357bd74" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="571d3cf6-5b26-4adc-ac38-e0a4de4e5d52" role="gridcell">37</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c8aa73cc-5235-4cbb-ae93-4e2c03ef95e9" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="a6a08a63-b00a-4eed-a21d-e6aa5d87307a" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="7b4e7bef-4b84-424a-a540-c6525bc5f325" role="gridcell">Fri Dec 18
                                                2020 21:33:24 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="fb6605e9-6c75-41a5-bf10-44dbe80403f3" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="a93e0f28-cac7-4057-9447-e6fc299a4ce3" role="gridcell">Thu Jan 21
                                                2021 00:04:12 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                        <tr class="k-alt" data-uid="e4c01c3c-bf01-465a-b9da-d7fa3464fa08" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="ed80397b-7c20-4fe6-b8e4-3f721b2cab9d" role="gridcell">2516</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a9fdc601-b153-40b8-97bf-e732b5a72896" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fd3dd949-33b6-4935-a25d-2c864271722c" role="gridcell">ALASKA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="2f38617d-be8d-4327-8276-b573c5a283b2" role="gridcell">(0005) ACH
                                                BASSETT-WAINWRIGHT</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fdd8ac15-54e1-43cd-95de-56bb9176625c" role="gridcell">(0005) ACH
                                                BASSETT-WAINWRIGHT</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bed105e4-9fe7-493f-b4e5-cf229866730b" role="gridcell">MESL</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="97ddf155-a6f4-4e29-86db-9f09bf3b56cd" role="gridcell">ALL</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="617aaead-923f-4d4e-9771-cac3cd8d5985" role="gridcell">(BHC)
                                                OPTOMETRY CLINIC</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ea5e7a89-2f69-4391-95a6-7aea2a88cc60" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf946550-9ade-4bd9-9dae-0b814420d6e4" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48d23dce-b496-4848-b2ee-3bc9b123df66" role="gridcell">12081.8236
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="7ce13979-423c-47d3-8e4b-efeb81d3204d" role="gridcell">9286.4426
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f976abc2-ed6d-4660-bea4-a7e664677b5f" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="60bfd866-faac-4a96-80ae-1983e736b575" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a43ebe15-d9e9-40db-b88c-e12139a97f71" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="58697fda-91a6-4661-993b-ae5f307c1c79" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="84051d43-3f64-4d15-835f-66b4d05b6d7d" role="gridcell">3181</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48013460-a77e-4362-99ec-f92525ac68d6" role="gridcell">2342</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="82b5a400-ab78-41f1-84b2-33598879b4fe" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="798f2724-74ca-41cb-96dd-6130eb447903" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="43e99eb8-b9b8-41c6-8b05-728fb7d345a7" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf43ebd0-6a77-41f1-8d3a-8ba872d241ba" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3df7b25c-c3c2-42a1-a18d-0c366e7da368" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a57348ac-ffb9-4354-858f-4a3a81781788" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cdfc563f-4c3b-4564-81c6-1958f5b4d3fa" role="gridcell">Optometrist
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="8787b8cc-434a-4953-aa5e-9336f9180b4a" role="gridcell">Increase
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e33ac1ea-adcf-4801-8474-9e6808376003" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c12a1545-4438-4162-96a1-eaebfeb83cd6" role="gridcell">Other
                                                (specify in comments)
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cee426d7-5b06-402a-bc75-c2dcd0886d68" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="167598df-f0d1-49fa-8415-a4b03b958ab0" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="28a65422-a6cc-4bbe-ad4a-6dda1957c80b" role="gridcell">10/1/2017
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3d640dc1-752b-4698-9767-d49b4abece67" role="gridcell">9/1/2018
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6f6d611f-ec4e-4a0c-b24a-44bf50fe1970" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d360b0be-8e1b-4199-8031-cefd73680373" role="gridcell">Uses
                                                calendar year 2018 data for estimation due to various influences on capacity and
                                                demand since then that will not exist in FY22. Lead provider was on maternity leave
                                                NOV18-FEB19. Largest unit on FWA deployed in spring of CY19. COVID limited FY20.
                                            </td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fd17685-405f-4ab5-aaa8-6541f2278ca2" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="3e8cfdd3-85f3-4549-b022-d67daac2f442" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector support request for this reclama
                                                under network-staffing request field. -Tamara Fatzinger, Market Integration
                                                Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="0e029b9d-c5b3-443b-86d8-8cec4eba3c38" role="gridcell">Not
                                                Available</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6613f6a5-c503-480d-bca5-8ac47ce3d81c" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector or civilian staffing support
                                                request for this reclama under network-staffing request field. -Tamara Fatzinger,
                                                Market Integration Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d21149-e408-47da-80eb-acaa4998cfe3" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e5a799fa-cc22-4f3f-8757-b2895f1d975a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="7f8f4a1a-6fe7-4e40-a380-e8ec11b7cdeb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="894609d2-6848-4c56-b1c7-a3ba9a6ca4e1" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="f5c88682-3bee-4ade-9746-ed01efabdc5b" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6c8d006d-db76-4169-9979-6edf6955350d" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5304b02c-fcda-48f6-875e-583dc806be4a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e87853f9-eb19-458d-bf3d-91cb66500725" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="272953dc-6e37-4a20-a0b3-4dca99ad6398" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="deb23c90-4b3b-41fc-aa29-e294379745bc" role="gridcell">Acknowledge
                                                request for increased MESL workload in BHC OPTOM. However, as a Genesis site,
                                                resourcing will not be determined by workload in FY22 -this may change-. Aguerrero
                                                09April2021</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="ab3a1b9c-210c-457f-97cf-8d16896e78cb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="06ee4d80-5898-439c-882f-e2d32b77b184" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="4837bd45-bb4f-4578-b53a-07dcbde2fa3f" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="4526ce40-a13c-4a5c-8d21-55451aa1e264" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="d8f1eca3-7476-43c9-9428-569c2c36e815" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="641f6e1e-13ec-4ff7-924e-b62a61ff21fd" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="91e9da65-b938-4916-ac71-aad2974b3cfe" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6c135dd9-b176-48e2-82d5-0c319209c4d6" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="e7229504-351c-49f9-bb6a-0588112ce398" role="gridcell">4/14/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="2d79a6c7-32e8-4e44-b6e8-f0dc58a608d4" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ccae6114-b302-4260-9a7c-79a87ddf28d4" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c723525f-7a0a-4524-8c2f-a5957295420d" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="8937f2d5-ae64-4eaf-a2af-fd8342e87dab" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="685065a6-860a-4362-9964-f9e6ae5d5498" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="2e9d39e2-061b-4df4-b020-90a14ef704ff" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="56071960-b8ea-43a6-af4f-72711357bd74" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="571d3cf6-5b26-4adc-ac38-e0a4de4e5d52" role="gridcell">37</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c8aa73cc-5235-4cbb-ae93-4e2c03ef95e9" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="a6a08a63-b00a-4eed-a21d-e6aa5d87307a" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="7b4e7bef-4b84-424a-a540-c6525bc5f325" role="gridcell">Fri Dec 18
                                                2020 22:27:27 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="fb6605e9-6c75-41a5-bf10-44dbe80403f3" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="a93e0f28-cac7-4057-9447-e6fc299a4ce3" role="gridcell">Thu Jan 21
                                                2021 00:04:12 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                        <tr data-uid="a383e869-1636-4337-ab1e-e9d5883fb467" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="ed80397b-7c20-4fe6-b8e4-3f721b2cab9d" role="gridcell">2517</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a9fdc601-b153-40b8-97bf-e732b5a72896" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fd3dd949-33b6-4935-a25d-2c864271722c" role="gridcell">ALASKA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="2f38617d-be8d-4327-8276-b573c5a283b2" role="gridcell">(0005) ACH
                                                BASSETT-WAINWRIGHT</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fdd8ac15-54e1-43cd-95de-56bb9176625c" role="gridcell">(0005) ACH
                                                BASSETT-WAINWRIGHT</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bed105e4-9fe7-493f-b4e5-cf229866730b" role="gridcell">PCSL</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="97ddf155-a6f4-4e29-86db-9f09bf3b56cd" role="gridcell">ER Emergent
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="617aaead-923f-4d4e-9771-cac3cd8d5985" role="gridcell">(BIAA)
                                                EMERGENCY ROOM FWA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ea5e7a89-2f69-4391-95a6-7aea2a88cc60" role="gridcell">24258.9682
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf946550-9ade-4bd9-9dae-0b814420d6e4" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48d23dce-b496-4848-b2ee-3bc9b123df66" role="gridcell">5763.1</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="7ce13979-423c-47d3-8e4b-efeb81d3204d" role="gridcell">11474.685
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f976abc2-ed6d-4660-bea4-a7e664677b5f" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="60bfd866-faac-4a96-80ae-1983e736b575" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a43ebe15-d9e9-40db-b88c-e12139a97f71" role="gridcell">5223</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="58697fda-91a6-4661-993b-ae5f307c1c79" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="84051d43-3f64-4d15-835f-66b4d05b6d7d" role="gridcell">458</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48013460-a77e-4362-99ec-f92525ac68d6" role="gridcell">3262</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="82b5a400-ab78-41f1-84b2-33598879b4fe" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="798f2724-74ca-41cb-96dd-6130eb447903" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="43e99eb8-b9b8-41c6-8b05-728fb7d345a7" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf43ebd0-6a77-41f1-8d3a-8ba872d241ba" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3df7b25c-c3c2-42a1-a18d-0c366e7da368" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a57348ac-ffb9-4354-858f-4a3a81781788" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cdfc563f-4c3b-4564-81c6-1958f5b4d3fa" role="gridcell">Not
                                                Applicable</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="8787b8cc-434a-4953-aa5e-9336f9180b4a" role="gridcell">Increase
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e33ac1ea-adcf-4801-8474-9e6808376003" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c12a1545-4438-4162-96a1-eaebfeb83cd6" role="gridcell">Increased
                                                Enrollment
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cee426d7-5b06-402a-bc75-c2dcd0886d68" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="167598df-f0d1-49fa-8415-a4b03b958ab0" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="28a65422-a6cc-4bbe-ad4a-6dda1957c80b" role="gridcell">10/1/2021
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3d640dc1-752b-4698-9767-d49b4abece67" role="gridcell">9/30/2022
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6f6d611f-ec4e-4a0c-b24a-44bf50fe1970" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d360b0be-8e1b-4199-8031-cefd73680373" role="gridcell">The
                                                MEDDAC-AK forecasting methodology used FY18 data, correcting for the deployment
                                                demand and projected enrollment increases.</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fd17685-405f-4ab5-aaa8-6541f2278ca2" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="3e8cfdd3-85f3-4549-b022-d67daac2f442" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector support request for this reclama
                                                under network-staffing request field. -Tamara Fatzinger, Market Integration
                                                Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="0e029b9d-c5b3-443b-86d8-8cec4eba3c38" role="gridcell">Not
                                                Available</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6613f6a5-c503-480d-bca5-8ac47ce3d81c" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector or civilian staffing support
                                                request for this reclama under network-staffing request field. -Tamara Fatzinger,
                                                Market Integration Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d21149-e408-47da-80eb-acaa4998cfe3" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e5a799fa-cc22-4f3f-8757-b2895f1d975a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="7f8f4a1a-6fe7-4e40-a380-e8ec11b7cdeb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="894609d2-6848-4c56-b1c7-a3ba9a6ca4e1" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="f5c88682-3bee-4ade-9746-ed01efabdc5b" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6c8d006d-db76-4169-9979-6edf6955350d" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5304b02c-fcda-48f6-875e-583dc806be4a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e87853f9-eb19-458d-bf3d-91cb66500725" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="272953dc-6e37-4a20-a0b3-4dca99ad6398" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="deb23c90-4b3b-41fc-aa29-e294379745bc" role="gridcell">Acknowledge
                                                request for increased PCSL workload. However, as a Genesis site, resourcing will not
                                                be determined by workload in FY22 -this may change-. Aguerrero 09April2021.</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="ab3a1b9c-210c-457f-97cf-8d16896e78cb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="06ee4d80-5898-439c-882f-e2d32b77b184" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="4837bd45-bb4f-4578-b53a-07dcbde2fa3f" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="4526ce40-a13c-4a5c-8d21-55451aa1e264" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="d8f1eca3-7476-43c9-9428-569c2c36e815" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="641f6e1e-13ec-4ff7-924e-b62a61ff21fd" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="91e9da65-b938-4916-ac71-aad2974b3cfe" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6c135dd9-b176-48e2-82d5-0c319209c4d6" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="e7229504-351c-49f9-bb6a-0588112ce398" role="gridcell">4/14/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="2d79a6c7-32e8-4e44-b6e8-f0dc58a608d4" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ccae6114-b302-4260-9a7c-79a87ddf28d4" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c723525f-7a0a-4524-8c2f-a5957295420d" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="8937f2d5-ae64-4eaf-a2af-fd8342e87dab" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="685065a6-860a-4362-9964-f9e6ae5d5498" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="2e9d39e2-061b-4df4-b020-90a14ef704ff" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="56071960-b8ea-43a6-af4f-72711357bd74" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="571d3cf6-5b26-4adc-ac38-e0a4de4e5d52" role="gridcell">37</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c8aa73cc-5235-4cbb-ae93-4e2c03ef95e9" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="a6a08a63-b00a-4eed-a21d-e6aa5d87307a" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="7b4e7bef-4b84-424a-a540-c6525bc5f325" role="gridcell">Thu Jan 21
                                                2021 00:03:18 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="fb6605e9-6c75-41a5-bf10-44dbe80403f3" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="a93e0f28-cac7-4057-9447-e6fc299a4ce3" role="gridcell">Thu Jan 21
                                                2021 00:04:12 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                        <tr class="k-alt" data-uid="97d73fbf-d928-4360-ac5e-4f3fd6226351" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="ed80397b-7c20-4fe6-b8e4-3f721b2cab9d" role="gridcell">2518</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a9fdc601-b153-40b8-97bf-e732b5a72896" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fd3dd949-33b6-4935-a25d-2c864271722c" role="gridcell">ALASKA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="2f38617d-be8d-4327-8276-b573c5a283b2" role="gridcell">(0005) ACH
                                                BASSETT-WAINWRIGHT</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fdd8ac15-54e1-43cd-95de-56bb9176625c" role="gridcell">(0005) ACH
                                                BASSETT-WAINWRIGHT</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bed105e4-9fe7-493f-b4e5-cf229866730b" role="gridcell">WHSL</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="97ddf155-a6f4-4e29-86db-9f09bf3b56cd" role="gridcell">ALL</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="617aaead-923f-4d4e-9771-cac3cd8d5985" role="gridcell">(BCB)
                                                OBSTETRICS AND GYNECOLOGY CLINIC</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ea5e7a89-2f69-4391-95a6-7aea2a88cc60" role="gridcell">6593.3243
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf946550-9ade-4bd9-9dae-0b814420d6e4" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48d23dce-b496-4848-b2ee-3bc9b123df66" role="gridcell">12993.957
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="7ce13979-423c-47d3-8e4b-efeb81d3204d" role="gridcell">11847.522
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f976abc2-ed6d-4660-bea4-a7e664677b5f" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="60bfd866-faac-4a96-80ae-1983e736b575" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a43ebe15-d9e9-40db-b88c-e12139a97f71" role="gridcell">1115</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="58697fda-91a6-4661-993b-ae5f307c1c79" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="84051d43-3f64-4d15-835f-66b4d05b6d7d" role="gridcell">3095</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48013460-a77e-4362-99ec-f92525ac68d6" role="gridcell">285</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="82b5a400-ab78-41f1-84b2-33598879b4fe" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="798f2724-74ca-41cb-96dd-6130eb447903" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="43e99eb8-b9b8-41c6-8b05-728fb7d345a7" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf43ebd0-6a77-41f1-8d3a-8ba872d241ba" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3df7b25c-c3c2-42a1-a18d-0c366e7da368" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a57348ac-ffb9-4354-858f-4a3a81781788" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cdfc563f-4c3b-4564-81c6-1958f5b4d3fa" role="gridcell">Ob/Gyn</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="8787b8cc-434a-4953-aa5e-9336f9180b4a" role="gridcell">Increase
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e33ac1ea-adcf-4801-8474-9e6808376003" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c12a1545-4438-4162-96a1-eaebfeb83cd6" role="gridcell">Other
                                                (specify in comments)
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cee426d7-5b06-402a-bc75-c2dcd0886d68" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="167598df-f0d1-49fa-8415-a4b03b958ab0" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="28a65422-a6cc-4bbe-ad4a-6dda1957c80b" role="gridcell">10/11/2021
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3d640dc1-752b-4698-9767-d49b4abece67" role="gridcell">9/30/2022
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6f6d611f-ec4e-4a0c-b24a-44bf50fe1970" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d360b0be-8e1b-4199-8031-cefd73680373" role="gridcell">MEDDAC-AK
                                                forecasting methodology used a PI project study done in FY20, using FY19 data, where
                                                the organization calculated a 27% increase in WHSL demand. The percentage accounted
                                                for deployment demand decreases as well as projected demand increases.</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fd17685-405f-4ab5-aaa8-6541f2278ca2" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="3e8cfdd3-85f3-4549-b022-d67daac2f442" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector support request for this reclama
                                                under network-staffing request field. -Tamara Fatzinger, Market Integration
                                                Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="0e029b9d-c5b3-443b-86d8-8cec4eba3c38" role="gridcell">Not
                                                Available</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6613f6a5-c503-480d-bca5-8ac47ce3d81c" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector or civilian staffing support
                                                request for this reclama under network-staffing request field. -Tamara Fatzinger,
                                                Market Integration Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d21149-e408-47da-80eb-acaa4998cfe3" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e5a799fa-cc22-4f3f-8757-b2895f1d975a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="7f8f4a1a-6fe7-4e40-a380-e8ec11b7cdeb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="894609d2-6848-4c56-b1c7-a3ba9a6ca4e1" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="f5c88682-3bee-4ade-9746-ed01efabdc5b" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6c8d006d-db76-4169-9979-6edf6955350d" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5304b02c-fcda-48f6-875e-583dc806be4a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e87853f9-eb19-458d-bf3d-91cb66500725" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="272953dc-6e37-4a20-a0b3-4dca99ad6398" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="deb23c90-4b3b-41fc-aa29-e294379745bc" role="gridcell">Acknowledge
                                                request for increased WHSL workload. However, as a Genesis site, resourcing will not
                                                be determined by workload in FY22. -this may change- Aguerrero 09April2021</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="ab3a1b9c-210c-457f-97cf-8d16896e78cb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="06ee4d80-5898-439c-882f-e2d32b77b184" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="4837bd45-bb4f-4578-b53a-07dcbde2fa3f" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="4526ce40-a13c-4a5c-8d21-55451aa1e264" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="d8f1eca3-7476-43c9-9428-569c2c36e815" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="641f6e1e-13ec-4ff7-924e-b62a61ff21fd" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="91e9da65-b938-4916-ac71-aad2974b3cfe" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6c135dd9-b176-48e2-82d5-0c319209c4d6" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="e7229504-351c-49f9-bb6a-0588112ce398" role="gridcell">4/14/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="2d79a6c7-32e8-4e44-b6e8-f0dc58a608d4" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ccae6114-b302-4260-9a7c-79a87ddf28d4" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c723525f-7a0a-4524-8c2f-a5957295420d" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="8937f2d5-ae64-4eaf-a2af-fd8342e87dab" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="685065a6-860a-4362-9964-f9e6ae5d5498" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="2e9d39e2-061b-4df4-b020-90a14ef704ff" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="56071960-b8ea-43a6-af4f-72711357bd74" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="571d3cf6-5b26-4adc-ac38-e0a4de4e5d52" role="gridcell">37</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c8aa73cc-5235-4cbb-ae93-4e2c03ef95e9" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="a6a08a63-b00a-4eed-a21d-e6aa5d87307a" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="7b4e7bef-4b84-424a-a540-c6525bc5f325" role="gridcell">Wed Jan 13
                                                2021 23:21:10 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="fb6605e9-6c75-41a5-bf10-44dbe80403f3" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="a93e0f28-cac7-4057-9447-e6fc299a4ce3" role="gridcell">Thu Jan 21
                                                2021 00:04:12 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                        <tr data-uid="c590ff21-1c87-427a-8933-a18539717874" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="ed80397b-7c20-4fe6-b8e4-3f721b2cab9d" role="gridcell">2519</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a9fdc601-b153-40b8-97bf-e732b5a72896" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fd3dd949-33b6-4935-a25d-2c864271722c" role="gridcell">ALASKA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="2f38617d-be8d-4327-8276-b573c5a283b2" role="gridcell">(0005) ACH
                                                BASSETT-WAINWRIGHT</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fdd8ac15-54e1-43cd-95de-56bb9176625c" role="gridcell">(0204) THC
                                                RICHARDSON</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bed105e4-9fe7-493f-b4e5-cf229866730b" role="gridcell">BHSL</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="97ddf155-a6f4-4e29-86db-9f09bf3b56cd" role="gridcell">Embedded BH
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="617aaead-923f-4d4e-9771-cac3cd8d5985" role="gridcell">(BFD4)
                                                EMBEDDED BEHAVIORAL HEALTH JBER</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ea5e7a89-2f69-4391-95a6-7aea2a88cc60" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf946550-9ade-4bd9-9dae-0b814420d6e4" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48d23dce-b496-4848-b2ee-3bc9b123df66" role="gridcell">7582.0445
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="7ce13979-423c-47d3-8e4b-efeb81d3204d" role="gridcell">16164.8202
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f976abc2-ed6d-4660-bea4-a7e664677b5f" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="60bfd866-faac-4a96-80ae-1983e736b575" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a43ebe15-d9e9-40db-b88c-e12139a97f71" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="58697fda-91a6-4661-993b-ae5f307c1c79" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="84051d43-3f64-4d15-835f-66b4d05b6d7d" role="gridcell">-7582.04
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48013460-a77e-4362-99ec-f92525ac68d6" role="gridcell">-16164.82
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="82b5a400-ab78-41f1-84b2-33598879b4fe" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="798f2724-74ca-41cb-96dd-6130eb447903" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="43e99eb8-b9b8-41c6-8b05-728fb7d345a7" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf43ebd0-6a77-41f1-8d3a-8ba872d241ba" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3df7b25c-c3c2-42a1-a18d-0c366e7da368" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a57348ac-ffb9-4354-858f-4a3a81781788" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cdfc563f-4c3b-4564-81c6-1958f5b4d3fa" role="gridcell">Not
                                                Applicable</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="8787b8cc-434a-4953-aa5e-9336f9180b4a" role="gridcell">Decrease
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e33ac1ea-adcf-4801-8474-9e6808376003" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c12a1545-4438-4162-96a1-eaebfeb83cd6" role="gridcell">Other
                                                (non-staff related)
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cee426d7-5b06-402a-bc75-c2dcd0886d68" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="167598df-f0d1-49fa-8415-a4b03b958ab0" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="28a65422-a6cc-4bbe-ad4a-6dda1957c80b" role="gridcell">10/1/2021
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3d640dc1-752b-4698-9767-d49b4abece67" role="gridcell">9/30/2022
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6f6d611f-ec4e-4a0c-b24a-44bf50fe1970" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d360b0be-8e1b-4199-8031-cefd73680373" role="gridcell">The MTF
                                                projects no BFD4/BFD2/BFDD workload under DMIS 0204, reducing the BFD4 target from
                                                16,165 wRVUs and 7,582 peRVUs to 0. Workload will be moved to BFDA</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fd17685-405f-4ab5-aaa8-6541f2278ca2" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="3e8cfdd3-85f3-4549-b022-d67daac2f442" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector support request for this reclama
                                                under network-staffing request field. -Tamara Fatzinger, Market Integration
                                                Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="0e029b9d-c5b3-443b-86d8-8cec4eba3c38" role="gridcell">Not
                                                Available</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6613f6a5-c503-480d-bca5-8ac47ce3d81c" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector or civilian staffing support
                                                request for this reclama under network-staffing request field. -Tamara Fatzinger,
                                                Market Integration Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d21149-e408-47da-80eb-acaa4998cfe3" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e5a799fa-cc22-4f3f-8757-b2895f1d975a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="7f8f4a1a-6fe7-4e40-a380-e8ec11b7cdeb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="894609d2-6848-4c56-b1c7-a3ba9a6ca4e1" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="f5c88682-3bee-4ade-9746-ed01efabdc5b" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6c8d006d-db76-4169-9979-6edf6955350d" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5304b02c-fcda-48f6-875e-583dc806be4a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e87853f9-eb19-458d-bf3d-91cb66500725" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="272953dc-6e37-4a20-a0b3-4dca99ad6398" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="deb23c90-4b3b-41fc-aa29-e294379745bc" role="gridcell">Acknowledge
                                                shift of BHSL workload. However, as a Genesis site, resourcing will not be
                                                determined by workload in FY22. -this may change-Aguerrero 09April2021</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="ab3a1b9c-210c-457f-97cf-8d16896e78cb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="06ee4d80-5898-439c-882f-e2d32b77b184" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="4837bd45-bb4f-4578-b53a-07dcbde2fa3f" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="4526ce40-a13c-4a5c-8d21-55451aa1e264" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="d8f1eca3-7476-43c9-9428-569c2c36e815" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="641f6e1e-13ec-4ff7-924e-b62a61ff21fd" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="91e9da65-b938-4916-ac71-aad2974b3cfe" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6c135dd9-b176-48e2-82d5-0c319209c4d6" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="e7229504-351c-49f9-bb6a-0588112ce398" role="gridcell">4/14/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="2d79a6c7-32e8-4e44-b6e8-f0dc58a608d4" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ccae6114-b302-4260-9a7c-79a87ddf28d4" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c723525f-7a0a-4524-8c2f-a5957295420d" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="8937f2d5-ae64-4eaf-a2af-fd8342e87dab" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="685065a6-860a-4362-9964-f9e6ae5d5498" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="2e9d39e2-061b-4df4-b020-90a14ef704ff" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="56071960-b8ea-43a6-af4f-72711357bd74" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="571d3cf6-5b26-4adc-ac38-e0a4de4e5d52" role="gridcell">37</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c8aa73cc-5235-4cbb-ae93-4e2c03ef95e9" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="a6a08a63-b00a-4eed-a21d-e6aa5d87307a" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="7b4e7bef-4b84-424a-a540-c6525bc5f325" role="gridcell">Wed Jan 20
                                                2021 00:42:24 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="fb6605e9-6c75-41a5-bf10-44dbe80403f3" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="a93e0f28-cac7-4057-9447-e6fc299a4ce3" role="gridcell">Thu Jan 21
                                                2021 00:04:12 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                        <tr class="k-alt" data-uid="19fc2080-4eba-48d1-b2a9-f6758b0b37a1" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="ed80397b-7c20-4fe6-b8e4-3f721b2cab9d" role="gridcell">2520</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a9fdc601-b153-40b8-97bf-e732b5a72896" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fd3dd949-33b6-4935-a25d-2c864271722c" role="gridcell">ALASKA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="2f38617d-be8d-4327-8276-b573c5a283b2" role="gridcell">(0005) ACH
                                                BASSETT-WAINWRIGHT</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fdd8ac15-54e1-43cd-95de-56bb9176625c" role="gridcell">(0204) THC
                                                RICHARDSON</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bed105e4-9fe7-493f-b4e5-cf229866730b" role="gridcell">BHSL</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="97ddf155-a6f4-4e29-86db-9f09bf3b56cd" role="gridcell">Multi-D</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="617aaead-923f-4d4e-9771-cac3cd8d5985" role="gridcell">(BFD2) </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ea5e7a89-2f69-4391-95a6-7aea2a88cc60" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf946550-9ade-4bd9-9dae-0b814420d6e4" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48d23dce-b496-4848-b2ee-3bc9b123df66" role="gridcell">72.3616</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="7ce13979-423c-47d3-8e4b-efeb81d3204d" role="gridcell">262.3722
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f976abc2-ed6d-4660-bea4-a7e664677b5f" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="60bfd866-faac-4a96-80ae-1983e736b575" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a43ebe15-d9e9-40db-b88c-e12139a97f71" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="58697fda-91a6-4661-993b-ae5f307c1c79" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="84051d43-3f64-4d15-835f-66b4d05b6d7d" role="gridcell">-72.36</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48013460-a77e-4362-99ec-f92525ac68d6" role="gridcell">-262.37</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="82b5a400-ab78-41f1-84b2-33598879b4fe" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="798f2724-74ca-41cb-96dd-6130eb447903" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="43e99eb8-b9b8-41c6-8b05-728fb7d345a7" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf43ebd0-6a77-41f1-8d3a-8ba872d241ba" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3df7b25c-c3c2-42a1-a18d-0c366e7da368" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a57348ac-ffb9-4354-858f-4a3a81781788" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cdfc563f-4c3b-4564-81c6-1958f5b4d3fa" role="gridcell">Not
                                                Applicable</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="8787b8cc-434a-4953-aa5e-9336f9180b4a" role="gridcell">Decrease
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e33ac1ea-adcf-4801-8474-9e6808376003" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c12a1545-4438-4162-96a1-eaebfeb83cd6" role="gridcell">Other
                                                (non-staff related)
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cee426d7-5b06-402a-bc75-c2dcd0886d68" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="167598df-f0d1-49fa-8415-a4b03b958ab0" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="28a65422-a6cc-4bbe-ad4a-6dda1957c80b" role="gridcell">10/1/2021
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3d640dc1-752b-4698-9767-d49b4abece67" role="gridcell">9/30/2022
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6f6d611f-ec4e-4a0c-b24a-44bf50fe1970" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d360b0be-8e1b-4199-8031-cefd73680373" role="gridcell">The MTF
                                                projects no BFD4/BFD2/BFDD workload under DMIS 0204, workload is moved under BFDA
                                            </td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fd17685-405f-4ab5-aaa8-6541f2278ca2" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="3e8cfdd3-85f3-4549-b022-d67daac2f442" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector support request for this reclama
                                                under network-staffing request field. -Tamara Fatzinger, Market Integration
                                                Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="0e029b9d-c5b3-443b-86d8-8cec4eba3c38" role="gridcell">Not
                                                Available</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6613f6a5-c503-480d-bca5-8ac47ce3d81c" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector or civilian staffing support
                                                request for this reclama under network-staffing request field. -Tamara Fatzinger,
                                                Market Integration Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d21149-e408-47da-80eb-acaa4998cfe3" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e5a799fa-cc22-4f3f-8757-b2895f1d975a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="7f8f4a1a-6fe7-4e40-a380-e8ec11b7cdeb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="894609d2-6848-4c56-b1c7-a3ba9a6ca4e1" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="f5c88682-3bee-4ade-9746-ed01efabdc5b" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6c8d006d-db76-4169-9979-6edf6955350d" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5304b02c-fcda-48f6-875e-583dc806be4a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e87853f9-eb19-458d-bf3d-91cb66500725" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="272953dc-6e37-4a20-a0b3-4dca99ad6398" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="deb23c90-4b3b-41fc-aa29-e294379745bc" role="gridcell">Acknowledge
                                                shift of BHSL workload. However, as a Genesis site, resourcing will not be
                                                determined by workload in FY22. -this may change-Aguerrero 09April2021</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="ab3a1b9c-210c-457f-97cf-8d16896e78cb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="06ee4d80-5898-439c-882f-e2d32b77b184" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="4837bd45-bb4f-4578-b53a-07dcbde2fa3f" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="4526ce40-a13c-4a5c-8d21-55451aa1e264" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="d8f1eca3-7476-43c9-9428-569c2c36e815" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="641f6e1e-13ec-4ff7-924e-b62a61ff21fd" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="91e9da65-b938-4916-ac71-aad2974b3cfe" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6c135dd9-b176-48e2-82d5-0c319209c4d6" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="e7229504-351c-49f9-bb6a-0588112ce398" role="gridcell">4/14/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="2d79a6c7-32e8-4e44-b6e8-f0dc58a608d4" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ccae6114-b302-4260-9a7c-79a87ddf28d4" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c723525f-7a0a-4524-8c2f-a5957295420d" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="8937f2d5-ae64-4eaf-a2af-fd8342e87dab" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="685065a6-860a-4362-9964-f9e6ae5d5498" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="2e9d39e2-061b-4df4-b020-90a14ef704ff" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="56071960-b8ea-43a6-af4f-72711357bd74" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="571d3cf6-5b26-4adc-ac38-e0a4de4e5d52" role="gridcell">37</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c8aa73cc-5235-4cbb-ae93-4e2c03ef95e9" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="a6a08a63-b00a-4eed-a21d-e6aa5d87307a" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="7b4e7bef-4b84-424a-a540-c6525bc5f325" role="gridcell">Wed Jan 20
                                                2021 00:45:44 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="fb6605e9-6c75-41a5-bf10-44dbe80403f3" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="a93e0f28-cac7-4057-9447-e6fc299a4ce3" role="gridcell">Thu Jan 21
                                                2021 00:04:12 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                        <tr data-uid="40e92ef6-3a2c-4e8d-8ab6-187bbb81291d" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="ed80397b-7c20-4fe6-b8e4-3f721b2cab9d" role="gridcell">2521</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a9fdc601-b153-40b8-97bf-e732b5a72896" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fd3dd949-33b6-4935-a25d-2c864271722c" role="gridcell">ALASKA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="2f38617d-be8d-4327-8276-b573c5a283b2" role="gridcell">(0005) ACH
                                                BASSETT-WAINWRIGHT</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fdd8ac15-54e1-43cd-95de-56bb9176625c" role="gridcell">(0204) THC
                                                RICHARDSON</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bed105e4-9fe7-493f-b4e5-cf229866730b" role="gridcell">BHSL</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="97ddf155-a6f4-4e29-86db-9f09bf3b56cd" role="gridcell">Multi-D</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="617aaead-923f-4d4e-9771-cac3cd8d5985" role="gridcell">(BFDD)
                                                BEHAVIORAL HEALTH MULTI-D JBER</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ea5e7a89-2f69-4391-95a6-7aea2a88cc60" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf946550-9ade-4bd9-9dae-0b814420d6e4" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48d23dce-b496-4848-b2ee-3bc9b123df66" role="gridcell">1195.9662
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="7ce13979-423c-47d3-8e4b-efeb81d3204d" role="gridcell">2813.6123
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f976abc2-ed6d-4660-bea4-a7e664677b5f" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="60bfd866-faac-4a96-80ae-1983e736b575" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a43ebe15-d9e9-40db-b88c-e12139a97f71" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="58697fda-91a6-4661-993b-ae5f307c1c79" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="84051d43-3f64-4d15-835f-66b4d05b6d7d" role="gridcell">-1195.97
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48013460-a77e-4362-99ec-f92525ac68d6" role="gridcell">-2813.61
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="82b5a400-ab78-41f1-84b2-33598879b4fe" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="798f2724-74ca-41cb-96dd-6130eb447903" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="43e99eb8-b9b8-41c6-8b05-728fb7d345a7" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf43ebd0-6a77-41f1-8d3a-8ba872d241ba" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3df7b25c-c3c2-42a1-a18d-0c366e7da368" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a57348ac-ffb9-4354-858f-4a3a81781788" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cdfc563f-4c3b-4564-81c6-1958f5b4d3fa" role="gridcell">Not
                                                Applicable</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="8787b8cc-434a-4953-aa5e-9336f9180b4a" role="gridcell">Decrease
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e33ac1ea-adcf-4801-8474-9e6808376003" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c12a1545-4438-4162-96a1-eaebfeb83cd6" role="gridcell">Other
                                                (non-staff related)
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cee426d7-5b06-402a-bc75-c2dcd0886d68" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="167598df-f0d1-49fa-8415-a4b03b958ab0" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="28a65422-a6cc-4bbe-ad4a-6dda1957c80b" role="gridcell">10/1/2021
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3d640dc1-752b-4698-9767-d49b4abece67" role="gridcell">9/30/2022
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6f6d611f-ec4e-4a0c-b24a-44bf50fe1970" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d360b0be-8e1b-4199-8031-cefd73680373" role="gridcell">The MTF
                                                projects no BFD4/BFD2/BFDD workload under DMIS 0204, workload is moved under BFDA
                                            </td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fd17685-405f-4ab5-aaa8-6541f2278ca2" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="3e8cfdd3-85f3-4549-b022-d67daac2f442" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector support request for this reclama
                                                under network-staffing request field. -Tamara Fatzinger, Market Integration
                                                Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="0e029b9d-c5b3-443b-86d8-8cec4eba3c38" role="gridcell">Not
                                                Available</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6613f6a5-c503-480d-bca5-8ac47ce3d81c" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector or civilian staffing support
                                                request for this reclama under network-staffing request field. -Tamara Fatzinger,
                                                Market Integration Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d21149-e408-47da-80eb-acaa4998cfe3" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e5a799fa-cc22-4f3f-8757-b2895f1d975a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="7f8f4a1a-6fe7-4e40-a380-e8ec11b7cdeb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="894609d2-6848-4c56-b1c7-a3ba9a6ca4e1" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="f5c88682-3bee-4ade-9746-ed01efabdc5b" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6c8d006d-db76-4169-9979-6edf6955350d" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5304b02c-fcda-48f6-875e-583dc806be4a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e87853f9-eb19-458d-bf3d-91cb66500725" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="272953dc-6e37-4a20-a0b3-4dca99ad6398" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="deb23c90-4b3b-41fc-aa29-e294379745bc" role="gridcell">Acknowledge
                                                shift of BHSL workload. However, as a Genesis site, resourcing will not be
                                                determined by workload in FY22. -THIS MAY CHANGE - Aguerrero 09April2021</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="ab3a1b9c-210c-457f-97cf-8d16896e78cb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="06ee4d80-5898-439c-882f-e2d32b77b184" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="4837bd45-bb4f-4578-b53a-07dcbde2fa3f" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="4526ce40-a13c-4a5c-8d21-55451aa1e264" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="d8f1eca3-7476-43c9-9428-569c2c36e815" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="641f6e1e-13ec-4ff7-924e-b62a61ff21fd" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="91e9da65-b938-4916-ac71-aad2974b3cfe" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6c135dd9-b176-48e2-82d5-0c319209c4d6" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="e7229504-351c-49f9-bb6a-0588112ce398" role="gridcell">4/14/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="2d79a6c7-32e8-4e44-b6e8-f0dc58a608d4" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ccae6114-b302-4260-9a7c-79a87ddf28d4" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c723525f-7a0a-4524-8c2f-a5957295420d" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="8937f2d5-ae64-4eaf-a2af-fd8342e87dab" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="685065a6-860a-4362-9964-f9e6ae5d5498" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="2e9d39e2-061b-4df4-b020-90a14ef704ff" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="56071960-b8ea-43a6-af4f-72711357bd74" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="571d3cf6-5b26-4adc-ac38-e0a4de4e5d52" role="gridcell">37</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c8aa73cc-5235-4cbb-ae93-4e2c03ef95e9" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="a6a08a63-b00a-4eed-a21d-e6aa5d87307a" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="7b4e7bef-4b84-424a-a540-c6525bc5f325" role="gridcell">Wed Jan 20
                                                2021 00:47:49 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="fb6605e9-6c75-41a5-bf10-44dbe80403f3" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="a93e0f28-cac7-4057-9447-e6fc299a4ce3" role="gridcell">Thu Jan 21
                                                2021 00:04:12 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                        <tr class="k-alt" data-uid="56792156-f61a-42e4-a70e-1becaa12590c" role="row">
                                            <td style="display:none" class=""
                                                aria-describedby="ed80397b-7c20-4fe6-b8e4-3f721b2cab9d" role="gridcell">2522</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a9fdc601-b153-40b8-97bf-e732b5a72896" role="gridcell">2022</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fd3dd949-33b6-4935-a25d-2c864271722c" role="gridcell">ALASKA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="2f38617d-be8d-4327-8276-b573c5a283b2" role="gridcell">(0005) ACH
                                                BASSETT-WAINWRIGHT</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="fdd8ac15-54e1-43cd-95de-56bb9176625c" role="gridcell">(0204) THC
                                                RICHARDSON</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="bed105e4-9fe7-493f-b4e5-cf229866730b" role="gridcell">BHSL</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="97ddf155-a6f4-4e29-86db-9f09bf3b56cd" role="gridcell">Multi-D</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="617aaead-923f-4d4e-9771-cac3cd8d5985" role="gridcell">(BFDA)
                                                BEHAVIORAL HEALTH MULTI-D JBER</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="ea5e7a89-2f69-4391-95a6-7aea2a88cc60" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf946550-9ade-4bd9-9dae-0b814420d6e4" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48d23dce-b496-4848-b2ee-3bc9b123df66" role="gridcell">691.5399
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="7ce13979-423c-47d3-8e4b-efeb81d3204d" role="gridcell">1698.939
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="f976abc2-ed6d-4660-bea4-a7e664677b5f" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="60bfd866-faac-4a96-80ae-1983e736b575" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a43ebe15-d9e9-40db-b88c-e12139a97f71" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="58697fda-91a6-4661-993b-ae5f307c1c79" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="84051d43-3f64-4d15-835f-66b4d05b6d7d" role="gridcell">8831</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="48013460-a77e-4362-99ec-f92525ac68d6" role="gridcell">19733</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="82b5a400-ab78-41f1-84b2-33598879b4fe" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="798f2724-74ca-41cb-96dd-6130eb447903" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="43e99eb8-b9b8-41c6-8b05-728fb7d345a7" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cf43ebd0-6a77-41f1-8d3a-8ba872d241ba" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3df7b25c-c3c2-42a1-a18d-0c366e7da368" role="gridcell">0.00</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="a57348ac-ffb9-4354-858f-4a3a81781788" role="gridcell"></td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cdfc563f-4c3b-4564-81c6-1958f5b4d3fa" role="gridcell">Not
                                                Applicable</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="8787b8cc-434a-4953-aa5e-9336f9180b4a" role="gridcell">Increase
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="e33ac1ea-adcf-4801-8474-9e6808376003" role="gridcell">Capacity
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="c12a1545-4438-4162-96a1-eaebfeb83cd6" role="gridcell">Other
                                                (specify in comments)
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="cee426d7-5b06-402a-bc75-c2dcd0886d68" role="gridcell">NA</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="167598df-f0d1-49fa-8415-a4b03b958ab0" role="gridcell">0</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="28a65422-a6cc-4bbe-ad4a-6dda1957c80b" role="gridcell">10/1/2021
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="3d640dc1-752b-4698-9767-d49b4abece67" role="gridcell">9/30/2022
                                            </td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="6f6d611f-ec4e-4a0c-b24a-44bf50fe1970" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="text-align:center;" class=""
                                                aria-describedby="d360b0be-8e1b-4199-8031-cefd73680373" role="gridcell">The MTF
                                                projects all FY22 BFD4/BFD2/BFDD workload under DMIS 0204 to occur in BFDA. This
                                                methodology uses FY18 BFD consolidated workload performance due to previous staffing
                                                levels</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5fd17685-405f-4ab5-aaa8-6541f2278ca2" role="gridcell">N/A</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="3e8cfdd3-85f3-4549-b022-d67daac2f442" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector support request for this reclama
                                                under network-staffing request field. -Tamara Fatzinger, Market Integration
                                                Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="0e029b9d-c5b3-443b-86d8-8cec4eba3c38" role="gridcell">Not
                                                Available</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6613f6a5-c503-480d-bca5-8ac47ce3d81c" role="gridcell">No Market
                                                Integration feedback as there was no Private Sector or civilian staffing support
                                                request for this reclama under network-staffing request field. -Tamara Fatzinger,
                                                Market Integration Division, QPP Execution Branch. 19 MAR 21</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="b1d21149-e408-47da-80eb-acaa4998cfe3" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e5a799fa-cc22-4f3f-8757-b2895f1d975a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="7f8f4a1a-6fe7-4e40-a380-e8ec11b7cdeb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="894609d2-6848-4c56-b1c7-a3ba9a6ca4e1" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="f5c88682-3bee-4ade-9746-ed01efabdc5b" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="6c8d006d-db76-4169-9979-6edf6955350d" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="5304b02c-fcda-48f6-875e-583dc806be4a" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="e87853f9-eb19-458d-bf3d-91cb66500725" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="272953dc-6e37-4a20-a0b3-4dca99ad6398" role="gridcell">Yes</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="deb23c90-4b3b-41fc-aa29-e294379745bc" role="gridcell">Acknowledge
                                                shift of BHSL workload. However, as a Genesis site, resourcing will not be
                                                determined by workload in FY22. -THIS MAY CHANGE - Aguerrero 09April2021</td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="ab3a1b9c-210c-457f-97cf-8d16896e78cb" role="gridcell"></td>
                                            <td style="text-align: center;" class=""
                                                aria-describedby="06ee4d80-5898-439c-882f-e2d32b77b184" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="4837bd45-bb4f-4578-b53a-07dcbde2fa3f" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="4526ce40-a13c-4a5c-8d21-55451aa1e264" role="gridcell">3/19/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="d8f1eca3-7476-43c9-9428-569c2c36e815" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="641f6e1e-13ec-4ff7-924e-b62a61ff21fd" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="91e9da65-b938-4916-ac71-aad2974b3cfe" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="6c135dd9-b176-48e2-82d5-0c319209c4d6" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="e7229504-351c-49f9-bb6a-0588112ce398" role="gridcell">4/14/2021
                                            </td>
                                            <td style="display:none" class=""
                                                aria-describedby="2d79a6c7-32e8-4e44-b6e8-f0dc58a608d4" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="ccae6114-b302-4260-9a7c-79a87ddf28d4" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c723525f-7a0a-4524-8c2f-a5957295420d" role="gridcell">45</td>
                                            <td style="display:none" class=""
                                                aria-describedby="8937f2d5-ae64-4eaf-a2af-fd8342e87dab" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="685065a6-860a-4362-9964-f9e6ae5d5498" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="2e9d39e2-061b-4df4-b020-90a14ef704ff" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="56071960-b8ea-43a6-af4f-72711357bd74" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="571d3cf6-5b26-4adc-ac38-e0a4de4e5d52" role="gridcell">37</td>
                                            <td style="display:none" class=""
                                                aria-describedby="c8aa73cc-5235-4cbb-ae93-4e2c03ef95e9" role="gridcell"></td>
                                            <td style="display:none" class=""
                                                aria-describedby="a6a08a63-b00a-4eed-a21d-e6aa5d87307a" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="7b4e7bef-4b84-424a-a540-c6525bc5f325" role="gridcell">Wed Jan 20
                                                2021 00:50:57 GMT-0600 (Central Standard Time)</td>
                                            <td style="display:none" class=""
                                                aria-describedby="fb6605e9-6c75-41a5-bf10-44dbe80403f3" role="gridcell">Taylor
                                                Whitten</td>
                                            <td style="display:none" class=""
                                                aria-describedby="a93e0f28-cac7-4057-9447-e6fc299a4ce3" role="gridcell">Thu Jan 21
                                                2021 00:04:12 GMT-0600 (Central Standard Time)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="k-pager-wrap k-grid-pager k-widget k-floatwrap" data-role="pager"><a href="#"
                                    aria-label="Go to the first page" title="Go to the first page"
                                    class="k-link k-pager-nav k-pager-first k-state-disabled" data-page="1" tabindex="-1"><span
                                        class="k-icon k-i-arrow-end-left"></span></a><a href="#"
                                    aria-label="Go to the previous page" title="Go to the previous page"
                                    class="k-link k-pager-nav k-state-disabled" data-page="1" tabindex="-1"><span
                                        class="k-icon k-i-arrow-60-left"></span></a>
                                <ul class="k-pager-numbers k-reset">
                                    <li class="k-current-page"><span class="k-link k-pager-nav">1</span></li>
                                    <li><span class="k-state-selected">1</span></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="2">2</a></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="3">3</a></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="4">4</a></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="5">5</a></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="6">6</a></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="7">7</a></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="8">8</a></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="9">9</a></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="10">10</a></li>
                                    <li><a tabindex="-1" href="#" class="k-link" data-page="11" title="More pages">...</a></li>
                                </ul><a href="#" aria-label="Go to the next page" title="Go to the next page"
                                    class="k-link k-pager-nav" data-page="2" tabindex="-1"><span
                                        class="k-icon k-i-arrow-60-right"></span></a><a href="#" aria-label="Go to the last page"
                                    title="Go to the last page" class="k-link k-pager-nav k-pager-last" data-page="64"
                                    tabindex="-1"><span class="k-icon k-i-arrow-end-right"></span></a><span
                                    class="k-pager-sizes k-label"><span title="" class="k-widget k-dropdown k-header"
                                        unselectable="on" role="listbox" aria-haspopup="true" aria-expanded="false" tabindex="0"
                                        aria-owns="" aria-live="polite" aria-disabled="false" aria-busy="false"
                                        aria-activedescendant="9b869d51-ea65-4824-8475-c9373a1cae71" style=""><span
                                            unselectable="on" class="k-dropdown-wrap k-state-default"><span unselectable="on"
                                                class="k-input">10</span><span unselectable="on" class="k-select"
                                                aria-label="select"><span
                                                    class="k-icon k-i-arrow-60-down"></span></span></span><select
                                            data-role="dropdownlist" aria-label="10" style="display: none;">
                                            <option value="10" selected="selected">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                            <option value="75">75</option>
                                        </select></span>items per page</span><span class="k-pager-info k-label">1 - 10 of 635
                                    items</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        `,
        style: /*css*/ `
            #main-container {
                width: 83%;
            }
            
            .bg-dark, .afms-nav {
                background-color: #2D3D50 !important;
            }
            
            div.qpp-logo {
                position: relative;
                background: url('/sites/qpp/siteassets/qpp/images/qpp-cp-tile.png') bottom;
                width: 115px;
                height: 114px;
                margin:auto;
            /** background-color: #b7bfc9; **/
                background-repeat: no-repeat;
                width: 100%;
                height: 120px;
                background-position-y: center;
                background-size: 120px;        
            }
    
            .left-nav, .left-nav .sticky-top {
                padding: 0 !important;
            }
                    
            #DeltaPlaceHolderMain, .left-nav {
                    min-height:calc(100vh - 236px) !important;
            }
                    
            .left-nav .nav-link {
                color: white !important;
            }
            .left-nav .nav-link:hover {
                color: #4c607a !important;
            }
            .left-nav  .nav > ul > li > a {
                font-size: 20px;
            }
            
            .left-nav  .nav > ul ul {
                padding-left: 12px !important;
            }
            
            .left-nav  .nav > ul ul ul {
                font-size: 12px !important;
            }
            
            .left-nav a {
                white-space: nowrap;
            }
            
            
            .left-nav a[fid] {
                font-size: 12px !important;
            }
            
            .expand-collpase {
                color: white;
                cursor: pointer;
            }
            
            .expands > a {
                padding-left: 0;
            }
            
                    .afms-nav {
                width: 100%;
                height: 50px;
                line-height: 50px;
                margin: 0;
                padding: 0;
                background: #4c607a;	
            }
            .afms-nav li {
                display: inline-block;
                margin: 0;
                padding: 0;
            }
            .afms-nav li a, .afms-nav li a:visited {
                display: inline-block;
                font-family: "Segoe UI", Segoe, Verdana, sans-serif;
                font-size: 14px;
                font-weight: 600;
                color: #fff;
                height: 50px;
                padding-right: 10px;
                margin-right: -4px;
                cursor: pointer;
            }
            .afms-nav li a:hover, .afms-nav li.active > a {
                color: #f0e8a8 !important;
                text-decoration: none;
            }
            .afms-nav .afms-logo a {
                padding: 0 20px 0 50px;
                font-weight: bold;
                background: url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 10px 0;
            }
            .afms-logo a:hover, .afms-logo.active a {
                background: #344254 url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 10px -50px;
            }
            .afms-dash > a {
                padding-left: 40px;
                background: url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -900px;
            }
            .afms-dash > a:hover, .afms-dash.active > a {
                background: #344254 url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -950px;
                color: #14405e !important;
            }
            .afms-reports > a {
                padding-left: 34px;
                background: url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -100px;
            }
            .afms-reports > a:hover, .afms-reports.active > a, .afms-archive > a:hover, .afms-archive.active > a {
                background: #344254 url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -150px;
                color: #14405e !important;
            }
            .afms-reports-menu, .afms-forums-menu, .afms-training-menu, .afms-faq-menu, .afms-knowledge-menu {
                display: none;
                position: absolute; 
                z-index: 9999; 
                background-color: #344254;
                margin-top: -1px;
                font-weight: 600;
                line-height: 30px;
                min-width: 200px;
                padding-left: 5px;
            }
            .afms-nav .afms-submenu a {
                background: none;
                padding: 0;
                height: auto;
                font-size: 14px;
            }
            .afms-nav .afms-submenu {
                margin-left: 10px;
            }
            .afms-nav .afms-submenu a:hover {
                color: #000;
                text-decoration: underline;
            }
            .afms-nav .afms-submenu dl {
                margin: 2px 0;
            }
            .afms-submenu dl p {
                margin: 0;
                padding: 2px 0 7px 5px;
                width: 350px;
            }
            .afms-context {
                font-weight: 600;
            }
            .afms-announcements > a {
                padding-left: 39px;
                background: url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -200px;
            }
            .afms-announcements > a:hover, .afms-announcements.active > a {
                background: #344254 url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -250px;
                color: #14405e !important;
            }
            .afms-forums > a {
                padding-left: 44px;
                background: url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -300px;	
            }
            .afms-forums > a:hover, .afms-forums.active > a {
                background: #344254 url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -350px;
                color: #14405e !important;
            }
            .afms-blogs > a {
                padding-left: 44px;
                background: url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -600px;
            }
            .afms-blogs > a:hover, .afms-blogs.active > a {
                background: #344254 url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -650px;
                color: #14405e !important;
            }
            .afms-training > a {
                padding-left: 51px;
                background: url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -400px;
            }
            .afms-training > a:hover, .afms-training.active > a {
                background: #344254 url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -450px;
                color: #14405e !important;
            }
            .afms-analytics > a {
                padding-left: 54px;
                background: url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -500px;
            }
            .afms-analytics > a:hover, .afms-analytics.active > a {
                background: #344254 url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -549px;
                color: #14405e !important;
            }
            .afms-special > a {
                padding-left: 38px;
                background: url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -700px;
            }
            .afms-special > a:hover, .afms-special.active > a {
                background: #344254 url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -750px;
                color: #14405e !important;
            }
            .afms-admin > a {
                padding-left: 36px;
                background: url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -800px;
            }
            .afms-admin > a:hover, .afms-admin.active > a {
                background: #344254 url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -850px;
                color: #14405e !important;
            }
            .afms-dev > a {
                padding-left: 38px;
                background: url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -900px;
            }
            .afms-dev > a:hover, .afms-dev.active > a {
                background: #344254 url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -950px;
                color: #14405e !important;
            }
            .afms-faq > a {
                padding-left: 38px;
                background: url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -1050px;
            }
            .afms-faq > a:hover, .afms-faq.active > a {
                background: #344254 url(/sites/mhsp4i/SiteAssets/images/afms-menu-sprite.png) no-repeat 0 -1100px;
                color: #14405e !important;
            }
            #DeltaPageStatusBar {
                width: 80% !important;
                right: 20px;
                z-index: 9999;
            }
        `,
        parent,
        position,
        events: [
            
        ]
    });

    return component;
}