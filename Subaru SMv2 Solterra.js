// ==UserScript==
// @name         Subaru SMv2 Solterra EV Tab (Maybe VMG Tab) - MAIN
// @version      3.0
// @author       Roy
// @match        https://autoloop.us/DMS/App/Notifications/ScheduledMaintenanceV2/EvMakeSettings.aspx*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require https://raw.githubusercontent.com/lodash/lodash/4.17.4/dist/lodash.js
// ==/UserScript==
"use strict";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Variables && Constants
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var segmentationSASorNonSAS = $(
  "#ctl00_ctl00_Main_Main_rptGroup_ctl01_ddlGroupItemSelection"
).val();
var batchS2SorRR = $(
  "#ctl00_ctl00_Main_Main_rptGroup_ctl00_ddlGroupItemSelection"
).val();
var SAS = "6454728c-ed6b-4532-98fa-327232d32e81";
var nonSAS = "fa52d866-4b5a-4374-b671-57f813d7b85a";
var defaultSegmentation = "b834fc14-4c47-4740-b2b2-9c682227dcdf";
var VOGSelector = $("#ctl00_ctl00_Main_Main_ddlExistingVMGs").val();
var vogs = [];
var S2S = "1";
var RR = "2";
let c = $("#ctl00_ctl00_Main_Main_ddlExistingMakes");
("#ctl00_ctl00_Main_Main_ddlExistingMakes option:selected");
let selectedMake = $().val();
let selectedMakeText = $(
  "#ctl00_ctl00_Main_Main_ddlExistingMakes option:selected"
).text();
let opacity = $("#ctl00_ctl00_Main_Main_divNotificationNavigation").css(
  "opacity"
);
var currentValue = $("#ctl00_ctl00_Main_Main_ddlExistingVMGs").val();

// Email template constants:
// Sales to service/first reminder - non SAS - fallback
const FO2010101 = "cd82946e-7dd9-4c06-a3ad-49ac262af74a";
const FO2010201fallback = "db9c0aa5-c641-4a8a-af49-1cf7b38999b2";
const FO2010301 = "e50c8da3-21b1-4f60-b75d-de7f9f13ad2d";
const FO2010701 = "0f14d5ae-5e4e-421d-9c89-33d5d732a7f7";
const FO2010801 = "28fdc42c-6c26-4e1b-b848-85a4f1d5273c";
const FO2010901 = "10a16a39-5809-4578-ba4c-2380ef074003";
// Sales to Service/First Reminder -  SAS - fallback
const FO2010401 = "4c530610-83dd-4edd-97c6-fa782b21aa80";
const FO2010501fallback = "8e25e24c-9e74-4663-872b-a80ba3fcd58a";
const FO2010601 = "042f90ec-ce6a-46ab-84a5-bcf3c5172c52";
const FO2011001 = "baf48dc4-c038-42d0-97ae-bf0e3b972b5e";
const FO2011101 = "11cb1c79-3447-4d9a-8fd0-d126f8fc167a";
const FO2011201 = "edd6e1c2-894d-4ee1-93e9-ef63e02cb7a0";
// Return Reminder - non SAS - fallback
const FO2011901 = "cb648d7c-1a90-4070-a0dd-5e72a559d290";
const FO2012001fallback = "51f574d0-5af1-4493-a1c5-b19eddc153e6";
const FO2012101 = "40c52569-abc1-4f08-ad9f-bf5eeea1371b";
// Return Reminder - SAS - fallback
const FO2012201 = "ce87c090-ebbc-4464-8552-668105dbe603";
const FO2012301fallback = "ff021fc6-f897-494d-a04c-316b93d81423";
const FO2012401 = "7a2350d1-8d18-41ac-93d2-19e7cb586dcc";

// Print mail documents:
const rrBefore23nonSASEV = "f8a366e0-9b60-4cf4-9027-1bc2d8af2de0";
const rrBefore23SASEV = "b1c94b29-f910-493e-8230-19c5e6303bcb";
const fmcComplete2EV = "cc6bf69d-d850-4579-b792-117274c6b9d5";

const s2sBefore23SASEV = "ac1bba8c-f02b-4b0b-9529-82733e688e51";
const s2sBefore23EV = "6dd3c916-3f5b-4f47-bfbd-3aa710817c67";

const fmcComplete1EV = "f3b909fd-1c03-4a6c-9daf-68d81a2783a4";
const fmcComplete3EV = "8503d48d-1908-4e2f-a84d-19d4d90903bc";

const fmcSASComplete1 = "5f552fb6-87a5-4ba3-ad59-4ac614c53867";
const fmcSASComplete2 = "1d13596d-1737-484a-aab4-4ba7ffc862b0";
const fmcSASComplete3 = "a5013e11-4c5a-494c-b46a-1184adaef1a9";

// Email selector constants
const email1 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSelector_ddlTemplate";
const email2 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSelector_ddlTemplate";
const email3 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSelector_ddlTemplate";
const email4 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_emailSelector_ddlTemplate";
const email5 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_emailSelector_ddlTemplate";
const email6 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_emailSelector_ddlTemplate";

// UNUSED
// const email7 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl06_schedule_emailSelector_ddlTemplate";
// const email8 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl07_schedule_emailSelector_ddlTemplate";
// const email9 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl08_schedule_emailSelector_ddlTemplate";
// const email10 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl09_schedule_emailSelector_ddlTemplate";

// Email subject line selector constants
const emailSubj1 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSubject_textBox";
const emailSubj2 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSubject_textBox";
const emailSubj3 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSubject_textBox";
const emailSubj4 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_emailSubject_textBox";
const emailSubj5 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_emailSubject_textBox";
const emailSubj6 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_emailSubject_textBox";

// UNUSED
// const emailSubj7 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl06_schedule_emailSubject_textBox";
// const emailSubj8 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl07_schedule_emailSubject_textBox";
// const emailSubj9 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl08_schedule_emailSubject_textBox";
// const emailSubj10 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl09_schedule_emailSubject_textBox";

// Print mail selector constants
const print1 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_printDocumentSelector_ddlPrintDocuments";
const print2 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_printDocumentSelector_ddlPrintDocuments";
const print3 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_printDocumentSelector_ddlPrintDocuments";
const print4 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_printDocumentSelector_ddlPrintDocuments";
const print5 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_printDocumentSelector_ddlPrintDocuments";
const print6 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_printDocumentSelector_ddlPrintDocuments";

// UNUSED
// const print7 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl06_schedule_printDocumentSelector_ddlPrintDocuments";
// const print8 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl07_schedule_printDocumentSelector_ddlPrintDocuments";
// const print9 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl08_schedule_printDocumentSelector_ddlPrintDocuments";
// const print10 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl09_schedule_printDocumentSelector_ddlPrintDocuments";

// Delay selector constants
const delay1 = "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay";
const delay2 = "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_ddlDelay";
const delay3 = "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_ddlDelay";
const delay4 = "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_ddlDelay";
const delay5 = "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_ddlDelay";
const delay6 = "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_ddlDelay";

// UNUSED
// const delay7 = "#ctl00_ctl00_Main_Main_rptSchedule_ctl06_schedule_ddlDelay";
// const delay8 = "#ctl00_ctl00_Main_Main_rptSchedule_ctl07_schedule_ddlDelay";
// const delay9 = "#ctl00_ctl00_Main_Main_rptSchedule_ctl08_schedule_ddlDelay";
// const delay10 = "#ctl00_ctl00_Main_Main_rptSchedule_ctl09_schedule_ddlDelay";

// Telemetrics checkbox constants
const telematics1 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool";
const telematics2 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool";

// UNUSED
// const telemetrics3 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool";
// const telemetrics4 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool";
// const telemetrics5 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool";
// const telemetrics6 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool";
// const telemetrics7 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl06_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool";
// const telemetrics8 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl07_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool";
// const telemetrics9 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl08_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool";
// const telematics10 =
//   "#ctl00_ctl00_Main_Main_rptSchedule_ctl09_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool";

// Coupon selector constants

const couponSelectorInterval0coupon1 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_coupon1";
const couponSelectorInterval0coupon2 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_coupon2";
const couponSelectorInterval0coupon3 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_coupon3";
const couponSelectorInterval1coupon1 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_coupon1";
const couponSelectorInterval1coupon2 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_coupon2";
const couponSelectorInterval1coupon3 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_coupon3";
const couponSelectorInterval2coupon1 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_coupon1";
const couponSelectorInterval2coupon2 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_coupon2";
const couponSelectorInterval2coupon3 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_coupon3";
const couponSelectorInterval3coupon1 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_coupon1";
const couponSelectorInterval3coupon2 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_coupon2";
const couponSelectorInterval3coupon3 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_coupon3";
const couponSelectorInterval4coupon1 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_coupon1";
const couponSelectorInterval4coupon2 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_coupon2";
const couponSelectorInterval4coupon3 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_coupon3";
const couponSelectorInterval5coupon1 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_coupon1";
const couponSelectorInterval5coupon2 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_coupon2";
const couponSelectorInterval5coupon3 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_coupon3";
const couponSelectorInterval6coupon1 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl06_schedule_coupon1";
const couponSelectorInterval6coupon2 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl06_schedule_coupon2";
const couponSelectorInterval6coupon3 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl06_schedule_coupon3";
const couponSelectorInterval7coupon1 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl07_schedule_coupon1";
const couponSelectorInterval7coupon2 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl07_schedule_coupon2";
const couponSelectorInterval7coupon3 =
  "#ctl00_ctl00_Main_Main_rptSchedule_ctl07_schedule_coupon3";

// Basic checks:
let vmgOrEv = "";
// Check
if (
  $("#ctl00_ctl00_Main_TopNav_TabbedNavigation_liVmgSettings").hasClass(
    "selected"
  )
) {
  vmgOrEv = "vmg";
} else if (
  $("#ctl00_ctl00_Main_TopNav_TabbedNavigation_liEvSettings").hasClass(
    "selected"
  )
) {
  vmgOrEv = "ev";
}

// Email Template VMG Selector Function
function processMatch(match, dropdownElementId, currentVmg) {
  let formattedMatch = match[1].replace(" then every ", "-");
  console.log(formattedMatch);
  $(dropdownElementId)
    .find("option")
    .each(function () {
      if (this.text.includes(`${currentVmg}${formattedMatch}`)) {
        let c = $(this).val();
        $(dropdownElementId).val(c).trigger("chosen:updated");
        return false;
      }
    });
}
// Email Template VMG Selector Function Start and Check
function emailTemplateVmgSelectorStart(emailTemplateInterval, currentVmg) {
  if (vmgOrEv == "vmg") {
    var selectedOptionText = $(
      "#ctl00_ctl00_Main_Main_ddlExistingVMGs option:selected"
    )
      .text()
      .trim(); // Replace with your actual option id

    // Try to match the "120K then every 50K" case
    var match = selectedOptionText.match(
      /(\d+K then every \d+K)(?:\s+-\s+Enabled\s+\(\d+\))?/
    );

    if (match) {
      processMatch(match, emailTemplateInterval);
    } else {
      // Try to match the "normal" case
      match = selectedOptionText.match(
        /\((\d+K(?:-\d+K)?)\)(?:\s+-\s+Enabled\s+\(\d+\))?/i
      );
      if (match) {
        processMatch(match, emailTemplateInterval);
      } else {
        console.log("No match found");
      }
    }
  } else {
    console.log("Element is not selected");
  }
}

// Coupon Selector Function
function selectOptionByText(dropdownSelector, couponText) {
  let couponSelector = $(dropdownSelector);
  let dropdownOptions = couponSelector.find("option");

  dropdownOptions.each(function () {
    let couponOptionText = $(this).text();
    if (couponOptionText.includes(couponText)) {
      $(this).prop("selected", true);
    }

    console.log(couponSelector.val());
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Start of Script
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function startFunction() {
  if (vmgOrEv == "ev") {
    let isConfigured = await checkMakeConfig();
    console.log(isConfigured);
    if (isConfigured === true) {
      console.log("isConfigured === true - go to VMG's");
      window.location =
        "https://autoloop.us/DMS/App/Notifications/ScheduledMaintenanceV2/VmgSettings.aspx?ServiceId=54";
    } else if (isConfigured === false) {
      console.log("needs to be configured");
      configureSettings();
    }
  } else if (vmgOrEv == "vmg") {
    configureSettings();
  }
}

startFunction();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Check to see if it's already configured
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function checkMakeConfig() {
  return new Promise((resolve, reject) => {
    $("#ctl00_ctl00_Main_Main_ddlExistingMakes option").each(function () {
      let optionText = $(this).text();
      if (sessionStorage.getItem("version") == "aggressive") {
        if (optionText.includes("Subaru - Enabled (32)")) {
          resolve(true);
          return false; // Exit the loop early if a match is found
        }
      } else if (sessionStorage.getItem("version") == "light") {
        if (optionText.includes("Subaru - Enabled (28)")) {
          resolve(true);
          return false; // Exit the loop early if a match is found
        }
      }
    });
    resolve(false); // Resolve as false if no match is found
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Start the configuration process - Select and Configure
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var version = sessionStorage.getItem("version");
function configureSettings() {
  if (vmgOrEv == "ev") {
    // if (selectedMake !== "Subaru") {
    if (selectedMake.indexOf("Subaru") < 0) {
      console.log("select make");
      selectMake();
    } else if (selectedMakeText.indexOf("Subaru") > 0) {
      if ($("#ctl00_ctl00_Main_Main_cbEnabled").prop("checked") == false) {
        enableMakeSetting();
        console.log("test");
      } else if (
        $("#ctl00_ctl00_Main_Main_cbEnabled").prop("checked") == true &&
        $(delay1).val().length > 0 &&
        segmentationSASorNonSAS != defaultSegmentation
      ) {
        segmentationBatchTypeSelector();
      } else if (
        $("#ctl00_ctl00_Main_Main_cbEnabled").prop("checked") == true &&
        $(delay1).val().length == 0
      ) {
        if (version == "aggressive") {
          configureEVAggressive(segmentationSASorNonSAS); // Runs every single time until it's fully configured (Subaru - Enabled (4))
        } else if (version == "light") {
          configureEVLight(segmentationSASorNonSAS);
        }
      }
    }
    ///////////////////////////////////////////////////////////////////
    // VMG Configuration
  } else if (vmgOrEv == "vmg") {
    var array = JSON.parse(sessionStorage.getItem("array")) || [];
    //////////////////////////////
    // Get the array of VMG's
    if (array.length === 0) {
      $("#ctl00_ctl00_Main_Main_ddlExistingVMGs option").each(function () {
        var optionText = $(this).text();
        if (
          optionText.includes("Subaru 5K - EV's") &&
          !optionText.includes("(32)")
        ) {
          array.push($(this).val());
        }
      });

      // store the array in sessionStorage
      sessionStorage.setItem("array", JSON.stringify(array));
    }
    //////////////////////////////

    //////////////////////////////
    // Select the correct VMG
    if (array[0] !== currentValue) {
      $("#ctl00_ctl00_Main_Main_ddlExistingVMGs").val(array[0]);
      $("#ctl00_ctl00_Main_Main_btnEditExisting").click();
    } else if (
      (batchS2SorRR == 1 &&
        segmentationSASorNonSAS == defaultSegmentation &&
        saved.length == 0 &&
        opacity == 0.3) ||
      (batchS2SorRR == 2 &&
        segmentationSASorNonSAS == SAS &&
        saved.length == 0 &&
        opacity == 1) ||
      (batchS2SorRR == 1 &&
        segmentationSASorNonSAS == SAS &&
        saved.length == 0 &&
        $("#ctl00_ctl00_Main_Main_cbEnabled").prop("checked") == false)
    ) {
      console.log("switch to SAS");
      vmgSettingsStart(array);
    } else if (
      $(delay1).val().length == 0 &&
      segmentationSASorNonSAS != defaultSegmentation &&
      saved.length == 0 &&
      opacity == 1
    ) {
      console.log("configure");
      if (version == "aggressive") {
        //configureEVAggressive(segmentationSASorNonSAS); // Runs every single time until it's fully configured (Subaru - Enabled (4))
      } else if (version == "light") {
        //configureEVLight(segmentationSASorNonSAS);
      }
    }
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Enable make after selecting
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function enableMakeSetting() {
  if (segmentationSASorNonSAS === defaultSegmentation) {
    $("#ctl00_ctl00_Main_Main_rptGroup_ctl01_ddlGroupItemSelection")
      .val("6454728c-ed6b-4532-98fa-327232d32e81")
      .trigger("change");
    console.log("test enableMakeSetting() segmentation switch");
  } else if (segmentationSASorNonSAS === SAS && opacity == 0.3) {
    $("#ctl00_ctl00_Main_Main_cbEnabled").click();
  }
}

function vmgSettingsStart(array) {
  if (segmentationSASorNonSAS === defaultSegmentation) {
    $("#ctl00_ctl00_Main_Main_rptGroup_ctl01_ddlGroupItemSelection")
      .val("6454728c-ed6b-4532-98fa-327232d32e81")
      .trigger("change");
  } else if (segmentationSASorNonSAS === SAS && opacity == 0.3) {
    $("#ctl00_ctl00_Main_Main_cbEnabled").click();
  } else if (
    segmentationSASorNonSAS == SAS &&
    batchS2SorRR == RR &&
    opacity == 1
  ) {
    $("#ctl00_ctl00_Main_Main_rptGroup_ctl00_ddlGroupItemSelection")
      .val(1)
      .trigger("change");
    array.shift();
    sessionStorage.setItem("array", JSON.stringify(array));
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Segmentation and Batch Type Selector
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function segmentationBatchTypeSelector() {
  if (
    segmentationSASorNonSAS === SAS &&
    batchS2SorRR === S2S &&
    saved.length > 0
  ) {
    $("#ctl00_ctl00_Main_Main_rptGroup_ctl01_ddlGroupItemSelection")
      .val("fa52d866-4b5a-4374-b671-57f813d7b85a")
      .trigger("change");
  } else if (
    segmentationSASorNonSAS === nonSAS &&
    batchS2SorRR === S2S &&
    saved.length > 0
  ) {
    $("#ctl00_ctl00_Main_Main_rptGroup_ctl00_ddlGroupItemSelection")
      .val(2)
      .trigger("change");
  } else if (
    segmentationSASorNonSAS === nonSAS &&
    batchS2SorRR === RR &&
    saved.length > 0
  ) {
    $("#ctl00_ctl00_Main_Main_rptGroup_ctl01_ddlGroupItemSelection")
      .val("6454728c-ed6b-4532-98fa-327232d32e81")
      .trigger("change");
  } else if (
    segmentationSASorNonSAS === SAS &&
    batchS2SorRR === RR &&
    saved.length > 0
  ) {
    if (vmgOrEv == "ev") {
      window.location =
        "https://autoloop.us/DMS/App/Notifications/ScheduledMaintenanceV2/VmgSettings.aspx?ServiceId=54";
      console.log("go to vmg settings");
    } else if (vmgOrEv == "vmg") {
      console.log("next dealership");
    }
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Switch to correct make
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function selectMake() {
  $("#ctl00_ctl00_Main_Main_ddlExistingMakes").val("Subaru").trigger("change");
  $(document).ajaxStop(function () {
    $("#ctl00_ctl00_Main_Main_btnEditExisting").click();
    $(document).off("ajaxStop"); // Remove the event handler to prevent it from running for other AJAX calls
  });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EV Settings Aggressive
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function configureEVAggressive() {
  switch (segmentationSASorNonSAS) {
    case SAS:
      if (batchS2SorRR === S2S) {
        // Sales to Service SAS #ffffff - Sales to Service/First Reminder - SAS Aggressive Cadence - FALLBACK/VEHICLE MAKE

        // MySubaru/Telematics
        $(telematics2).prop("checked", true).trigger("change");

        // Print Mail
        $(print2).val(s2sBefore23SASEV).trigger("change");
        $(print4).val(fmcSASComplete1).trigger("change");
        $(print5).val("1d13596d-1737-484a-aab4-4ba7ffc862b0").trigger("change");
        $(print6).val(fmcSASComplete3).trigger("change");

        // Coupon
        selectOptionByText(couponSelectorInterval1coupon1, "Subaru SAS - S2S");
        selectOptionByText(couponSelectorInterval2coupon1, "Subaru SAS - S2S");
        selectOptionByText(couponSelectorInterval3coupon1, "EV0012");
        selectOptionByText(couponSelectorInterval3coupon2, "EV0389");
        selectOptionByText(couponSelectorInterval4coupon1, "EV0012");
        selectOptionByText(couponSelectorInterval4coupon2, "EV0389");
        selectOptionByText(couponSelectorInterval5coupon1, "EV0012");
        selectOptionByText(couponSelectorInterval5coupon2, "EV0389");

        // Email Subject Lines
        $(emailSubj1).val("It's almost time for your first Subaru EV service");
        $(emailSubj2).val(
          "Book your upcoming covered EV service with the Subaru EV experts"
        );
        $(emailSubj3).val(
          "Keep adventures going strong—schedule your covered overdue service"
        );
        $(emailSubj4).val(
          "Ready to get your covered EV maintenance off to a great start?"
        );
        $(emailSubj5).val(
          "Did you know missing your EV's first covered service could affect its performance?"
        );
        $(emailSubj6).val(
          "Did you know your EV is missing an important first?"
        );

        // Delays
        $(delay1).val(-45).trigger("change");
        $(delay2).val(-23).trigger("change");
        $(delay3).val(5).trigger("change");
        $(delay4).val(35).trigger("change");
        $(delay5).val(65).trigger("change");
        $(delay6).val(90).trigger("change");

        // Email Templates
        $(email1).val(FO2010401).trigger("chosen:updated"); // -45 day
        $(email2).val(FO2010501fallback).trigger("chosen:updated"); // -23 day
        $(email3).val(FO2010601).trigger("chosen:updated"); // 5 day
        $(email4).val(FO2011001).trigger("chosen:updated"); // 35 day
        $(email5).val(FO2011101).trigger("chosen:updated"); // 65 day
        $(email6).val(FO2011201).trigger("chosen:updated"); // 90 day

        //////////////////////////////////////////////////////////////////
        // Return Reminder SAS #ffffff Return Reminder - SAS Aggressive Cadence - FALLBACK/VEHICLE MAKE
      } else if (batchS2SorRR === RR) {
        // MySubaru/Telematics
        $(telematics2).prop("checked", true).trigger("change");

        // Print Mail
        $(print2).val(rrBefore23SASEV).trigger("change");
        // Coupon

        // Email Subject Lines
        $(emailSubj1).val(
          "We'll help you stay current on your covered EV care"
        );
        $(emailSubj2).val(
          "Your next recommended EV service is approaching soon"
        );
        $(emailSubj3).val(
          "Book your past-due service to keep covered EV care right on track"
        );

        // Delays
        $(delay1).val(-45).trigger("change");
        $(delay2).val(-23).trigger("change");
        $(delay3).val(5).trigger("change");

        // Email Templates
        $(email1).val(FO2012201).trigger("chosen:updated");
        $(email2).val(FO2012301fallback).trigger("chosen:updated");
        $(email3).val(FO2012401).trigger("chosen:updated");
      }
      break;

    // Sales to Service non-SAS #ffffff - Sales to Service/First Reminder - Non SAS Aggressive Cadence - FALLBACK/VEHICLE MAKE
    case nonSAS:
      if (batchS2SorRR === S2S) {
        // MySubaru/Telematics
        $(telematics2).prop("checked", true).trigger("change");

        // Print Mail
        $(print2).val(s2sBefore23EV).trigger("change");
        $(print4).val(fmcComplete1EV).trigger("change");
        $(print5).val(fmcComplete2EV).trigger("change");
        $(print6).val(fmcComplete3EV).trigger("change");

        // Coupon
        selectOptionByText(couponSelectorInterval1coupon1, "EV0012");
        selectOptionByText(couponSelectorInterval1coupon2, "EV0389");
        selectOptionByText(couponSelectorInterval3coupon1, "EV0012");
        selectOptionByText(couponSelectorInterval3coupon2, "EV0389");
        selectOptionByText(couponSelectorInterval4coupon1, "EV0012");
        selectOptionByText(couponSelectorInterval4coupon2, "EV0389");
        selectOptionByText(couponSelectorInterval5coupon1, "EV0012");
        selectOptionByText(couponSelectorInterval5coupon2, "EV0389");

        // Email Subject Lines
        $(emailSubj1).val("It's almost time for your first Subaru EV service");
        $(emailSubj2).val(
          "Help keep new adventures on the right track with expert care"
        );
        $(emailSubj3).val("Routine vehicle maintenance is vital ");
        $(emailSubj4).val(
          "Ready to get your EV maintenance off to a great start?"
        );
        $(emailSubj5).val(
          "Did you know missing your EV's first service could affect its performance?"
        );
        $(emailSubj6).val(
          "Did you know your EV is missing an important first?"
        );

        // Delays
        $(delay1).val(-45).trigger("change");
        $(delay2).val(-23).trigger("change");
        $(delay3).val(5).trigger("change");
        $(delay4).val(35).trigger("change");
        $(delay5).val(65).trigger("change");
        $(delay6).val(90).trigger("change");

        // Email Templates
        $(email1).val(FO2010101).trigger("chosen:updated"); // -45 day

        // Email Template Interval 2 Selector
        if (vmgOrEv == "vmg") {
          emailTemplateVmgSelectorStart(email2, "FO20102-01-");
        } else if (vmgOrEv == "ev") {
          $(email2).val(FO2010201fallback).trigger("chosen:updated"); // -23 day
        }

        $(email3).val(FO2010301).trigger("chosen:updated"); // 5 day
        $(email4).val(FO2010701).trigger("chosen:updated"); // 35 day
        $(email5).val(FO2010801).trigger("chosen:updated"); // 65 day
        $(email6).val(FO2010901).trigger("chosen:updated"); // 90 day

        // Return Reminder non-SAS #ffffff Return Reminder - Non SAS Aggressive Cadence FALLBACK/VEHICLE MAKE - DONE
      } else if (batchS2SorRR === RR) {
        // MySubaru/Telematics
        $(telematics2).prop("checked", true).trigger("change");

        // Print Mail
        $(print2).val(rrBefore23nonSASEV).trigger("change");

        // Coupon

        // Email Subject Lines
        $(emailSubj1).val("We'll help you stay current on your EV care");
        $(emailSubj2).val(
          "Your next recommended EV service is approaching soon"
        );
        $(emailSubj3).val(
          "Book your past-due service to keep your EV care right on track"
        );

        // Delays

        $(delay1).val(-45).trigger("change");
        $(delay2).val(-23).trigger("change");
        $(delay3).val(5).trigger("change");

        // Email Templates
        $(email1).val(FO2011901).trigger("chosen:updated");
        $(email2).val(FO2012001fallback).trigger("chosen:updated");
        $(email3).val(FO2012101).trigger("chosen:updated");
      }
      break;
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EV Settings Light
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function configureEVLight() {
  switch (segmentationSASorNonSAS) {
    case SAS:
      if (batchS2SorRR === S2S) {
        // Sales to Service SAS #ffffff Sales to Service/First Reminder - SAS Light Cadence - FALLBACK/VEHICLE MAKE - Done

        // MySubaru/Telematics - Good
        $(telematics1).prop("checked", true).trigger("change");

        // Print Mail - Good
        $(print1).val(s2sBefore23SASEV).trigger("change");
        $(print2).val(fmcSASComplete1).trigger("change");
        $(print3).val(fmcSASComplete3).trigger("change");

        // Coupon

        // Email Subject Lines - Good
        $(emailSubj1).val(
          "Book your upcoming covered EV service with the Subaru EV experts"
        );
        $(emailSubj2).val(
          "Ready to get your covered EV maintenance off to a great start?"
        );
        $(emailSubj3).val(
          "Did you know your EV is missing an important first?"
        );

        // Delays
        $(delay1).val(-23).trigger("change");
        $(delay2).val(35).trigger("change");
        $(delay3).val(90).trigger("change");

        // Email Templates
        $(email1).val(FO2010501fallback).trigger("chosen:updated"); // -45 day
        $(email2).val(FO2011001).trigger("chosen:updated"); // -23 day
        $(email3).val(FO2011201).trigger("chosen:updated"); // 5 day

        //////////////////////////////////////////////////////////////////
        // Return Reminder SAS #ffffff Return Reminder - SAS Light Cadence FALLBACK/VEHICLE MAKE
      } else if (batchS2SorRR === RR) {
        // MySubaru/Telematics
        $(telematics1).prop("checked", true).trigger("change");

        // Print Mail
        $(print1).val(rrBefore23SASEV).trigger("change");
        // Coupon

        // Email Subject Lines
        $(emailSubj1).val(
          "Your next recommended EV service is approaching soon"
        );

        // Delays
        $(delay1).val(-23).trigger("change");

        // Email Templates
        $(email1).val(FO2012301fallback).trigger("chosen:updated");
      }
      break;

    // Sales to Service non-SAS #ffffff Sales to Service/First Reminder - Non SAS Light Cadence - FALLBACK/VEHICLE MAKE
    case nonSAS:
      if (batchS2SorRR === S2S) {
        // MySubaru/Telematics
        $(telematics1).prop("checked", true).trigger("change");

        // Print Mail
        $(print1).val(s2sBefore23EV).trigger("change");
        $(print2).val(fmcComplete1EV).trigger("change");
        $(print3).val(fmcComplete3EV).trigger("change");

        // Coupon

        // Email Subject Lines
        $(emailSubj1).val(
          "Help keep new adventures on the right track with expert care"
        );
        $(emailSubj2).val(
          "Ready to get your EV maintenance off to a great start?"
        );
        $(emailSubj3).val(
          "Did you know your EV is missing an important first?"
        );

        // Delays
        $(delay1).val(-23).trigger("change");
        $(delay2).val(35).trigger("change");
        $(delay3).val(90).trigger("change");

        // Email Templates
        $(email1).val(FO2010201fallback).trigger("chosen:updated"); // -45 day
        $(email2).val(FO2010701).trigger("chosen:updated"); // -23 day
        $(email3).val(FO2010901).trigger("chosen:updated"); // 5 day

        // Return Reminder non-SAS #ffffff Return Reminder - Non SAS Light Cadence - FALLBACK/VEHICLE MAKE
      } else if (batchS2SorRR === RR) {
        // MySubaru/Telematics
        $(telematics1).prop("checked", true).trigger("change");

        // Print Mail
        $(print1).val(rrBefore23nonSASEV).trigger("change");

        // Coupon

        // Email Subject Lines
        $(emailSubj1).val(
          "Your next recommended EV service is approaching soon"
        );

        // Delays

        $(delay1).val(-23).trigger("change");

        // Email Templates
        $(email1).val(FO2012001fallback).trigger("chosen:updated");
      }
      break;
  }
}
