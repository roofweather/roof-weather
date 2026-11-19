function doPost(e) {
  var body = {};
  try {
    body = JSON.parse((e.postData && e.postData.contents) || "{}");
  } catch (err) {
    body = {};
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var headers = [
    "Timestamp",
    "Email",
    "First name",
    "City",
    "Country",
    "Source",
    "UTM source",
    "UTM medium",
    "UTM campaign"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  sheet.appendRow([
    body.timestamp || "",
    body.email || "",
    body.firstName || "",
    body.city || "",
    body.country || "",
    body.source || "",
    body.utm_source || "",
    body.utm_medium || "",
    body.utm_campaign || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
