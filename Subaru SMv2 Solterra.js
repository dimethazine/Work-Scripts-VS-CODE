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
let selectedMake = $(
  "#ctl00_ctl00_Main_Main_ddlExistingMakes option:selected"
).val();
let selectedMakeText = $(
  "#ctl00_ctl00_Main_Main_ddlExistingMakes option:selected"
).text();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Start of Script
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function startFunction() {
  let isConfigured = await checkMakeConfig();
  console.log(isConfigured);
  if (isConfigured === true) {
    console.log("isConfigured === true - go to next dealership");
  } else if (isConfigured === false) {
    console.log("needs to be configured");
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
      if (optionText.includes("Subaru - Enabled (4)")) {
        resolve(true);
        return false; // Exit the loop early if a match is found
      }
    });
    resolve(false); // Resolve as false if no match is found
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Start the configuration process - Select and Configure
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function configureSettings() {
  if (selectedMake !== "Subaru") {
    console.log("select make");
    selectMake();
  } else if (selectedMakeText.indexOf("Subaru") > 0) {
    if ($("#ctl00_ctl00_Main_Main_cbEnabled").prop("checked") == false) {
      enableMakeSetting();
      console.log("test");
    } else if (
      $("#ctl00_ctl00_Main_Main_cbEnabled").prop("checked") == true &&
      $("#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay").val()
        .length > 0 &&
      segmentationSASorNonSAS != defaultSegmentation
    ) {
      segmentationBatchTypeSelector();
    } else if (
      $("#ctl00_ctl00_Main_Main_cbEnabled").prop("checked") == true &&
      $("#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay").val()
        .length == 0
    ) {
      if (version.sessionStorage.toLowerCase() == "aggressive") {
        configureEVAggressive(segmentationSASorNonSAS); // Runs every single time until it's fully configured (Subaru - Enabled (4))
      } else if (version.sessionStorage.toLowerCase() == "light") {
        configureEVLight(segmentationSASorNonSAS);
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
  } else if (segmentationSASorNonSAS === SAS) {
    $("#ctl00_ctl00_Main_Main_cbEnabled").click();
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Segmentation and Batch Type Selector
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function segmentationBatchTypeSelector() {
  if (segmentationSASorNonSAS === SAS && batchS2SorRR === S2S) {
    $("#ctl00_ctl00_Main_Main_rptGroup_ctl01_ddlGroupItemSelection")
      .val("fa52d866-4b5a-4374-b671-57f813d7b85a")
      .trigger("change");
  } else if (segmentationSASorNonSAS === nonSAS && batchS2SorRR === S2S) {
    $("#ctl00_ctl00_Main_Main_rptGroup_ctl00_ddlGroupItemSelection")
      .val(2)
      .trigger("change");
  } else if (segmentationSASorNonSAS === nonSAS && batchS2SorRR === RR) {
    $("#ctl00_ctl00_Main_Main_rptGroup_ctl01_ddlGroupItemSelection")
      .val("6454728c-ed6b-4532-98fa-327232d32e81")
      .trigger("change");
  } else if (segmentationSASorNonSAS === SAS && batchS2SorRR === RR) {
    console.log("next dealership");
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
// EV Settings Aggressive
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function configureEVAggressive() {
  switch (segmentationSASorNonSAS) {
    case SAS:
      if (batchS2SorRR === S2S) {
        // Sales to Service SAS #ffffff - Sales to Service/First Reminder -  SAS Aggressive Cadence - FALLBACK/VEHICLE MAKE

        // MySubaru/Telematics
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool"
        )
          .prop("checked", true)
          .trigger("change");

        // Print Mail
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("ac1bba8c-f02b-4b0b-9529-82733e688e51")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("5f552fb6-87a5-4ba3-ad59-4ac614c53867")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("1d13596d-1737-484a-aab4-4ba7ffc862b0")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("a5013e11-4c5a-494c-b46a-1184adaef1a9")
          .trigger("change");

        // Coupon

        // Email Subject Lines
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSubject_textBox"
        ).val("It's almost time for your first Subaru EV service");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSubject_textBox"
        ).val(
          "Book your upcoming covered EV service with the Subaru EV experts"
        );
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSubject_textBox"
        ).val(
          "Keep adventures going strong—schedule your covered overdue service"
        );
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_emailSubject_textBox"
        ).val("Ready to get your covered EV maintenance off to a great start?");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_emailSubject_textBox"
        ).val(
          "Did you know missing your EV's first covered service could affect its performance?"
        );
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_emailSubject_textBox"
        ).val("Did you know your EV is missing an important first?");

        // Delays
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay")
          .val(-45)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_ddlDelay")
          .val(-23)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_ddlDelay")
          .val(5)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_ddlDelay")
          .val(35)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_ddlDelay")
          .val(65)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_ddlDelay")
          .val(90)
          .trigger("change");

        // Email Templates
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSelector_ddlTemplate"
        )
          .val("4c530610-83dd-4edd-97c6-fa782b21aa80")
          .trigger("chosen:updated"); // -45 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSelector_ddlTemplate"
        )
          .val("8e25e24c-9e74-4663-872b-a80ba3fcd58a")
          .trigger("chosen:updated"); // -23 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSelector_ddlTemplate"
        )
          .val("042f90ec-ce6a-46ab-84a5-bcf3c5172c52")
          .trigger("chosen:updated"); // 5 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_emailSelector_ddlTemplate"
        )
          .val("baf48dc4-c038-42d0-97ae-bf0e3b972b5e")
          .trigger("chosen:updated"); // 35 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_emailSelector_ddlTemplate"
        )
          .val("11cb1c79-3447-4d9a-8fd0-d126f8fc167a")
          .trigger("chosen:updated"); // 65 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_emailSelector_ddlTemplate"
        )
          .val("edd6e1c2-894d-4ee1-93e9-ef63e02cb7a0")
          .trigger("chosen:updated"); // 90 day

        //////////////////////////////////////////////////////////////////
        // Return Reminder SAS #ffffff Return Reminder -  SAS Aggressive Cadence  FALLBACK/VEHICLE MAKE
      } else if (batchS2SorRR === RR) {
        // 4

        // MySubaru/Telematics
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool"
        )
          .prop("checked", true)
          .trigger("change");

        // Print Mail
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("b1c94b29-f910-493e-8230-19c5e6303bcb")
          .trigger("change");
        // Coupon

        // Email Subject Lines
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSubject_textBox"
        ).val(
          "$customerName.FirstName, we'll help you stay current on your covered EV care"
        );
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSubject_textBox"
        ).val(
          "$customerName.FirstName, your next recommended EV service is approaching soon"
        );
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSubject_textBox"
        ).val(
          "Book your past-due service to keep covered EV care right on track"
        );

        // Delays
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay")
          .val(-45)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_ddlDelay")
          .val(-23)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_ddlDelay")
          .val(5)
          .trigger("change");

        // Email Templates
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSelector_ddlTemplate"
        )
          .val("ce87c090-ebbc-4464-8552-668105dbe603")
          .trigger("chosen:updated");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSelector_ddlTemplate"
        )
          .val("ff021fc6-f897-494d-a04c-316b93d81423")
          .trigger("chosen:updated");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSelector_ddlTemplate"
        )
          .val("7a2350d1-8d18-41ac-93d2-19e7cb586dcc")
          .trigger("chosen:updated");
      }
      break;

    // Sales to Service non-SAS #ffffff - Sales to Service/First Reminder - Non SAS Aggressive Cadence - FALLBACK/VEHICLE MAKE
    case nonSAS:
      if (batchS2SorRR === S2S) {
        // 2

        // Sales to Service non-SAS #ffffff - Sales to Service/First Reminder - Non SAS Aggressive Cadence - FALLBACK/VEHICLE MAKE

        // MySubaru/Telematics
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool"
        )
          .prop("checked", true)
          .trigger("change");

        // Print Mail
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("6dd3c916-3f5b-4f47-bfbd-3aa710817c67")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("f3b909fd-1c03-4a6c-9daf-68d81a2783a4")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("cc6bf69d-d850-4579-b792-117274c6b9d5")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("8503d48d-1908-4e2f-a84d-19d4d90903bc")
          .trigger("change");

        // Coupon

        // Email Subject Lines
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSubject_textBox"
        ).val("It's almost time for your first Subaru EV service");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSubject_textBox"
        ).val("Help keep new adventures on the right track with expert care");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSubject_textBox"
        ).val("Routine vehicle maintenance is vital ");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_emailSubject_textBox"
        ).val("Ready to get your EV maintenance off to a great start?");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_emailSubject_textBox"
        ).val(
          "Did you know missing your EV's first service could affect its performance?"
        );
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_emailSubject_textBox"
        ).val("Did you know your EV is missing an important first?");

        // Delays
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay")
          .val(-45)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_ddlDelay")
          .val(-23)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_ddlDelay")
          .val(5)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_ddlDelay")
          .val(35)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_ddlDelay")
          .val(65)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_ddlDelay")
          .val(90)
          .trigger("change");

        // Email Templates
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSelector_ddlTemplate"
        )
          .val("cd82946e-7dd9-4c06-a3ad-49ac262af74a")
          .trigger("chosen:updated"); // -45 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSelector_ddlTemplate"
        )
          .val("db9c0aa5-c641-4a8a-af49-1cf7b38999b2")
          .trigger("chosen:updated"); // -23 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSelector_ddlTemplate"
        )
          .val("e50c8da3-21b1-4f60-b75d-de7f9f13ad2d")
          .trigger("chosen:updated"); // 5 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_emailSelector_ddlTemplate"
        )
          .val("0f14d5ae-5e4e-421d-9c89-33d5d732a7f7")
          .trigger("chosen:updated"); // 35 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_emailSelector_ddlTemplate"
        )
          .val("28fdc42c-6c26-4e1b-b848-85a4f1d5273c")
          .trigger("chosen:updated"); // 65 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_emailSelector_ddlTemplate"
        )
          .val("10a16a39-5809-4578-ba4c-2380ef074003")
          .trigger("chosen:updated"); // 90 day

        // Return Reminder non-SAS #ffffff Return Reminder - Non SAS Aggressive Cadence  FALLBACK/VEHICLE MAKE
      } else if (batchS2SorRR === RR) {
        // 3
        // Return Reminder non-SAS #ffffff Return Reminder - Non SAS Aggressive Cadence  FALLBACK/VEHICLE MAKE

        // MySubaru/Telematics
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool"
        )
          .prop("checked", true)
          .trigger("change");

        // Print Mail
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("f8a366e0-9b60-4cf4-9027-1bc2d8af2de0")
          .trigger("change");

        // Coupon

        // Email Subject Lines
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSubject_textBox"
        ).val(
          "$customerName.FirstName, we'll help you stay current on your EV care"
        );
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSubject_textBox"
        ).val(
          "$customerName.FirstName, your next recommended EV service is approaching soon"
        );
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSubject_textBox"
        ).val("Book your past-due service to keep your EV care right on track");

        // Delays

        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay")
          .val(-45)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_ddlDelay")
          .val(-23)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_ddlDelay")
          .val(5)
          .trigger("change");

        // Email Templates
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSelector_ddlTemplate"
        )
          .val("cb648d7c-1a90-4070-a0dd-5e72a559d290")
          .trigger("chosen:updated");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSelector_ddlTemplate"
        )
          .val("51f574d0-5af1-4493-a1c5-b19eddc153e6")
          .trigger("chosen:updated");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSelector_ddlTemplate"
        )
          .val("40c52569-abc1-4f08-ad9f-bf5eeea1371b")
          .trigger("chosen:updated");
      }
      break;
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EV Settings Light
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function configureEVLight() {
  switch (segmentationSASorNonSAS) {
    case SAS:
      if (batchS2SorRR === S2S) {
        // Sales to Service SAS #ffffff Sales to Service/First Reminder -  SAS Light Cadence - FALLBACK/VEHICLE MAKE

        // MySubaru/Telematics - Good
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool"
        )
          .prop("checked", true)
          .trigger("change");

        // Print Mail - Good
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("ac1bba8c-f02b-4b0b-9529-82733e688e51")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("5f552fb6-87a5-4ba3-ad59-4ac614c53867")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("a5013e11-4c5a-494c-b46a-1184adaef1a9")
          .trigger("change");

        // Coupon

        // Email Subject Lines - Good
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSubject_textBox"
        ).val(
          "Book your upcoming covered EV service with the Subaru EV experts"
        );
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSubject_textBox"
        ).val(
          "$customerName.FirstName, ready to get your covered EV maintenance off to a great start?"
        );
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSubject_textBox"
        ).val(
          "$customerName.FirstName, did you know your EV is missing an important first?"
        );

        // Delays
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay")
          .val(-23)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_ddlDelay")
          .val(35)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_ddlDelay")
          .val(90)
          .trigger("change");

        // Email Templates
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSelector_ddlTemplate"
        )
          .val("8e25e24c-9e74-4663-872b-a80ba3fcd58a")
          .trigger("chosen:updated"); // -45 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSelector_ddlTemplate"
        )
          .val("baf48dc4-c038-42d0-97ae-bf0e3b972b5e")
          .trigger("chosen:updated"); // -23 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSelector_ddlTemplate"
        )
          .val("edd6e1c2-894d-4ee1-93e9-ef63e02cb7a0")
          .trigger("chosen:updated"); // 5 day

        //////////////////////////////////////////////////////////////////
        // Return Reminder SAS #ffffff Return Reminder -  SAS Light Cadence  FALLBACK/VEHICLE MAKE
      } else if (batchS2SorRR === RR) {
        // Return Reminder SAS #ffffff Return Reminder -  SAS Light Cadence  FALLBACK/VEHICLE MAKE
        // MySubaru/Telematics
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool"
        )
          .prop("checked", true)
          .trigger("change");

        // Print Mail
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("b1c94b29-f910-493e-8230-19c5e6303bcb")
          .trigger("change");
        // Coupon

        // Email Subject Lines
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSubject_textBox"
        ).val(
          "$customerName.FirstName, your next recommended EV service is approaching soon"
        );

        // Delays
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay")
          .val(-23)
          .trigger("change");

        // Email Templates
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSelector_ddlTemplate"
        )
          .val("ff021fc6-f897-494d-a04c-316b93d81423")
          .trigger("chosen:updated");
      }
      break;

    // Sales to Service non-SAS #ffffff Sales to Service/First Reminder - Non SAS Light Cadence FALLBACK/VEHICLE MAKE
    case nonSAS:
      if (batchS2SorRR === S2S) {
        // Sales to Service non-SAS #ffffff Sales to Service/First Reminder - Non SAS Light Cadence FALLBACK/VEHICLE MAKE

        // MySubaru/Telematics
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool"
        )
          .prop("checked", true)
          .trigger("change");

        // Print Mail
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("6dd3c916-3f5b-4f47-bfbd-3aa710817c67")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("f3b909fd-1c03-4a6c-9daf-68d81a2783a4")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("8503d48d-1908-4e2f-a84d-19d4d90903bc")
          .trigger("change");

        // Coupon

        // Email Subject Lines
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSubject_textBox"
        ).val("Help keep new adventures on the right track with expert care");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSubject_textBox"
        ).val(
          "$customerName.FirstName, ready to get your EV maintenance off to a great start?"
        );
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSubject_textBox"
        ).val(
          "$customerName.FirstName, did you know your EV is missing an important first?"
        );

        // Delays
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay")
          .val(-23)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_ddlDelay")
          .val(35)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_ddlDelay")
          .val(90)
          .trigger("change");

        // Email Templates
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSelector_ddlTemplate"
        )
          .val("db9c0aa5-c641-4a8a-af49-1cf7b38999b2")
          .trigger("chosen:updated"); // -45 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSelector_ddlTemplate"
        )
          .val("0f14d5ae-5e4e-421d-9c89-33d5d732a7f7")
          .trigger("chosen:updated"); // -23 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSelector_ddlTemplate"
        )
          .val("10a16a39-5809-4578-ba4c-2380ef074003")
          .trigger("chosen:updated"); // 5 day

        // Return Reminder non-SAS #ffffff Return Reminder - Non SAS Light Cadence  FALLBACK/VEHICLE MAKE
      } else if (batchS2SorRR === RR) {
        // 3
        // Return Reminder non-SAS #ffffff Return Reminder - Non SAS Light Cadence  FALLBACK/VEHICLE MAKE

        // MySubaru/Telematics
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool"
        )
          .prop("checked", true)
          .trigger("change");

        // Print Mail
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("f8a366e0-9b60-4cf4-9027-1bc2d8af2de0")
          .trigger("change");

        // Coupon

        // Email Subject Lines
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSubject_textBox"
        ).val(
          "$$customerName.FirstName, your next recommended EV service is approaching soon"
        );

        // Delays

        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay")
          .val(-23)
          .trigger("change");

        // Email Templates
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSelector_ddlTemplate"
        )
          .val("51f574d0-5af1-4493-a1c5-b19eddc153e6")
          .trigger("chosen:updated");
      }
      break;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VMG Settings
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VMG Aggressive Settings
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function configVMGAggressive() {
  switch (segmentationSASorNonSAS) {
    case SAS:
      if (batchS2SorRR === S2S) {
        // Sales to Service SAS #ffffff Sales to Service/First Reminder -  SAS Aggressive Cadence - Minor (5K)

        // MySubaru/Telematics - Good
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool"
        )
          .prop("checked", true)
          .trigger("change");

        // Print Mail - Good
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("ac1bba8c-f02b-4b0b-9529-82733e688e51")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("5f552fb6-87a5-4ba3-ad59-4ac614c53867")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("1d13596d-1737-484a-aab4-4ba7ffc862b0")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("a5013e11-4c5a-494c-b46a-1184adaef1a9")
          .trigger("change");

        // Coupon

        // Email Subject Lines - Good
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSubject_textBox"
        ).val("It's almost time for your first Subaru EV service");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSubject_textBox"
        ).val(
          "Book your upcoming covered EV service with the Subaru EV experts"
        );
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSubject_textBox"
        ).val(
          "Keep adventures going strong—schedule your covered overdue service"
        );
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_emailSubject_textBox"
        ).val("Ready to get your covered EV maintenance off to a great start?");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_emailSubject_textBox"
        ).val(
          "Did you know missing your EV's first covered service could affect its performance?"
        );
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_emailSubject_textBox"
        ).val("Did you know your EV is missing an important first?");

        // Delays
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay")
          .val(-45)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_ddlDelay")
          .val(-23)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_ddlDelay")
          .val(5)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_ddlDelay")
          .val(35)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_ddlDelay")
          .val(65)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_ddlDelay")
          .val(90)
          .trigger("change");

        // Email Templates
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSelector_ddlTemplate"
        )
          .val("4c530610-83dd-4edd-97c6-fa782b21aa80")
          .trigger("chosen:updated"); // -45 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSelector_ddlTemplate"
        )
          .val("4c198400-6ddf-4918-8370-3549d965da3b")
          .trigger("chosen:updated"); // -23 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSelector_ddlTemplate"
        )
          .val("042f90ec-ce6a-46ab-84a5-bcf3c5172c52")
          .trigger("chosen:updated"); // 5 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSelector_ddlTemplate"
        )
          .val("baf48dc4-c038-42d0-97ae-bf0e3b972b5e")
          .trigger("chosen:updated"); // 35 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSelector_ddlTemplate"
        )
          .val("11cb1c79-3447-4d9a-8fd0-d126f8fc167a")
          .trigger("chosen:updated"); // 65 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSelector_ddlTemplate"
        )
          .val("edd6e1c2-894d-4ee1-93e9-ef63e02cb7a0")
          .trigger("chosen:updated"); // 90 day

        //////////////////////////////////////////////////////////////////
        // Return Reminder SAS #ffffff Return Reminder -  SAS Aggressive Cadence - Minor (5K)
      } else if (batchS2SorRR === RR) {
        // MySubaru/Telematics
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool"
        )
          .prop("checked", true)
          .trigger("change");

        // Print Mail
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("b1c94b29-f910-493e-8230-19c5e6303bcb")
          .trigger("change");
        // Coupon

        // Email Subject Lines
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSubject_textBox"
        ).val(
          "$customerName.FirstName, your next recommended EV service is approaching soon"
        );

        // Delays
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay")
          .val(-23)
          .trigger("change");

        // Email Templates
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSelector_ddlTemplate"
        )
          .val("ff021fc6-f897-494d-a04c-316b93d81423")
          .trigger("chosen:updated");
      }
      break;

    // Sales to Service non-SAS #ffffff Sales to Service/First Reminder - Non SAS Aggressive Cadence - Minor (5K)
    case nonSAS:
      if (batchS2SorRR === S2S) {
        // Sales to Service non-SAS #ffffff Sales to Service/First Reminder - Non SAS Aggressive Cadence - Minor (5K)

        // MySubaru/Telematics
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool"
        )
          .prop("checked", true)
          .trigger("change");

        // Print Mail
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("6dd3c916-3f5b-4f47-bfbd-3aa710817c67")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("f3b909fd-1c03-4a6c-9daf-68d81a2783a4")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("cc6bf69d-d850-4579-b792-117274c6b9d5")
          .trigger("change");

        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("8503d48d-1908-4e2f-a84d-19d4d90903bc")
          .trigger("change");

        // Coupon

        // Email Subject Lines
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSubject_textBox"
        ).val("It's almost time for your first Subaru EV service");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSubject_textBox"
        ).val("Help keep new adventures on the right track with expert care");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSubject_textBox"
        ).val("Routine vehicle maintenance is vital");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_emailSubject_textBox"
        ).val("Ready to get your EV maintenance off to a great start?");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_emailSubject_textBox"
        ).val(
          "Did you know missing your EV's first service could affect its performance?"
        );
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_emailSubject_textBox"
        ).val("Did you know your EV is missing an important first?");

        // Delays
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay")
          .val(-45)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_ddlDelay")
          .val(-23)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_ddlDelay")
          .val(5)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_ddlDelay")
          .val(35)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_ddlDelay")
          .val(65)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_ddlDelay")
          .val(90)
          .trigger("change");

        // Email Templates
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSelector_ddlTemplate"
        )
          .val("cd82946e-7dd9-4c06-a3ad-49ac262af74a")
          .trigger("chosen:updated"); // -45 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSelector_ddlTemplate"
        )
          .val("5ba14ac1-bb74-412f-a1c7-1fb4301f33ef")
          .trigger("chosen:updated"); // -23 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSelector_ddlTemplate"
        )
          .val("e50c8da3-21b1-4f60-b75d-de7f9f13ad2d")
          .trigger("chosen:updated"); // 5 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl03_schedule_emailSelector_ddlTemplate"
        )
          .val("0f14d5ae-5e4e-421d-9c89-33d5d732a7f7")
          .trigger("chosen:updated"); // 35 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl04_schedule_emailSelector_ddlTemplate"
        )
          .val("28fdc42c-6c26-4e1b-b848-85a4f1d5273c")
          .trigger("chosen:updated"); // 65 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl05_schedule_emailSelector_ddlTemplate"
        )
          .val("10a16a39-5809-4578-ba4c-2380ef074003")
          .trigger("chosen:updated"); // 90 day
      } else if (batchS2SorRR === RR) {
        // 3
        // Return Reminder non-SAS #ffffff Return Reminder - Non SAS Aggressive Cadence - Minor (5K)

        // MySubaru/Telematics
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool"
        )
          .prop("checked", true)
          .trigger("change");

        // Print Mail
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("f8a366e0-9b60-4cf4-9027-1bc2d8af2de0")
          .trigger("change");

        // Coupon

        // Email Subject Lines
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSubject_textBox"
        ).val(
          "$$customerName.FirstName, your next recommended EV service is approaching soon"
        );

        // Delays

        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay")
          .val(-23)
          .trigger("change");

        // Email Templates
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSelector_ddlTemplate"
        )
          .val("51f574d0-5af1-4493-a1c5-b19eddc153e6")
          .trigger("chosen:updated");
      }
      break;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VMG Light Settings
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function configVMGLight() {
  switch (segmentationSASorNonSAS) {
    case SAS:
      if (batchS2SorRR === S2S) {
        // Sales to Service SAS #ffffff Sales to Service/First Reminder -  SAS Light Cadence - Minor (5K)

        // MySubaru/Telematics - Good
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool"
        )
          .prop("checked", true)
          .trigger("change");

        // Print Mail - Good
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("ac1bba8c-f02b-4b0b-9529-82733e688e51")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("5f552fb6-87a5-4ba3-ad59-4ac614c53867")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("a5013e11-4c5a-494c-b46a-1184adaef1a9")
          .trigger("change");

        // Coupon

        // Email Subject Lines - Good
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSubject_textBox"
        ).val(
          "Book your upcoming covered EV service with the Subaru EV experts"
        );
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSubject_textBox"
        ).val(
          "$customerName.FirstName, ready to get your covered EV maintenance off to a great start?"
        );
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSubject_textBox"
        ).val(
          "$customerName.FirstName, did you know your EV is missing an important first?"
        );

        // Delays
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay")
          .val(-23)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_ddlDelay")
          .val(35)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_ddlDelay")
          .val(90)
          .trigger("change");

        // Email Templates
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSelector_ddlTemplate"
        )
          .val("8e25e24c-9e74-4663-872b-a80ba3fcd58a")
          .trigger("chosen:updated"); // -45 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSelector_ddlTemplate"
        )
          .val("baf48dc4-c038-42d0-97ae-bf0e3b972b5e")
          .trigger("chosen:updated"); // -23 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSelector_ddlTemplate"
        )
          .val("edd6e1c2-894d-4ee1-93e9-ef63e02cb7a0")
          .trigger("chosen:updated"); // 5 day

        //////////////////////////////////////////////////////////////////
        // Return Reminder SAS #ffffff Return Reminder -  SAS Light Cadence - Minor (5K)
      } else if (batchS2SorRR === RR) {
        // MySubaru/Telematics
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool"
        )
          .prop("checked", true)
          .trigger("change");

        // Print Mail
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("b1c94b29-f910-493e-8230-19c5e6303bcb")
          .trigger("change");
        // Coupon

        // Email Subject Lines
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSubject_textBox"
        ).val(
          "$customerName.FirstName, your next recommended EV service is approaching soon"
        );

        // Delays
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay")
          .val(-23)
          .trigger("change");

        // Email Templates
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSelector_ddlTemplate"
        )
          .val("ff021fc6-f897-494d-a04c-316b93d81423")
          .trigger("chosen:updated");
      }
      break;

    // Sales to Service non-SAS #ffffff Sales to Service/First Reminder - Non SAS Light Cadence - Minor
    case nonSAS:
      if (batchS2SorRR === S2S) {
        // Sales to Service non-SAS #ffffff Sales to Service/First Reminder - Non SAS Light Cadence - Minor

        // MySubaru/Telematics
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool"
        )
          .prop("checked", true)
          .trigger("change");

        // Print Mail
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("6dd3c916-3f5b-4f47-bfbd-3aa710817c67")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("f3b909fd-1c03-4a6c-9daf-68d81a2783a4")
          .trigger("change");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("8503d48d-1908-4e2f-a84d-19d4d90903bc")
          .trigger("change");

        // Coupon

        // Email Subject Lines
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSubject_textBox"
        ).val("Help keep new adventures on the right track with expert care");
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSubject_textBox"
        ).val(
          "$customerName.FirstName, ready to get your EV maintenance off to a great start?"
        );
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSubject_textBox"
        ).val(
          "$customerName.FirstName, did you know your EV is missing an important first?"
        );

        // Delays
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay")
          .val(-23)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_ddlDelay")
          .val(35)
          .trigger("change");
        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_ddlDelay")
          .val(90)
          .trigger("change");

        // Email Templates
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSelector_ddlTemplate"
        )
          .val("db9c0aa5-c641-4a8a-af49-1cf7b38999b2")
          .trigger("chosen:updated"); // -45 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl01_schedule_emailSelector_ddlTemplate"
        )
          .val("0f14d5ae-5e4e-421d-9c89-33d5d732a7f7")
          .trigger("chosen:updated"); // -23 day
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl02_schedule_emailSelector_ddlTemplate"
        )
          .val("10a16a39-5809-4578-ba4c-2380ef074003")
          .trigger("chosen:updated"); // 5 day

        // Return Reminder non-SAS #ffffff Return Reminder - Non SAS Light Cadence - Minor (5K)
      } else if (batchS2SorRR === RR) {
        // 3
        // Return Reminder non-SAS #ffffff Return Reminder - Non SAS Light Cadence - Minor (5K)

        // MySubaru/Telematics
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_rptUiGroups_ctl00_rptCustomBatchSettings_ctl01_cbBatchSettingBool"
        )
          .prop("checked", true)
          .trigger("change");

        // Print Mail
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_printDocumentSelector_ddlPrintDocuments"
        )
          .val("f8a366e0-9b60-4cf4-9027-1bc2d8af2de0")
          .trigger("change");

        // Coupon

        // Email Subject Lines
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSubject_textBox"
        ).val(
          "$$customerName.FirstName, your next recommended EV service is approaching soon"
        );

        // Delays

        $("#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_ddlDelay")
          .val(-23)
          .trigger("change");

        // Email Templates
        $(
          "#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSelector_ddlTemplate"
        )
          .val("51f574d0-5af1-4493-a1c5-b19eddc153e6")
          .trigger("chosen:updated");
      }
      break;
  }
}
