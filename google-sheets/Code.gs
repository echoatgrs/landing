/**
 * Waitlist -> Google Sheet receiver.
 * Setup steps are in README.md ("Google Sheets").
 *
 * Script properties:
 *   SECRET  a random string; the webhook URL must end with ?key=<SECRET>
 */
const SHEET_NAME = 'Waitlist'
const COLUMNS = ['createdAt', 'email', 'site', 'industry', 'role', 'lang', 'source']

function doPost(e) {
  const secret = PropertiesService.getScriptProperties().getProperty('SECRET')
  if (!secret || !e.parameter || e.parameter.key !== secret) {
    return json({ ok: false, error: 'unauthorized' })
  }

  let data
  try {
    data = JSON.parse(e.postData.contents)
  } catch (err) {
    return json({ ok: false, error: 'bad json' })
  }
  const email = String(data.email || '').trim().toLowerCase()
  if (!email || email.indexOf('@') < 1) return json({ ok: false, error: 'bad email' })

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const sheet = getSheet()
    // Skip duplicates: the email column is B.
    const last = sheet.getLastRow()
    if (last > 1) {
      const emails = sheet.getRange(2, 2, last - 1, 1).getValues()
      if (emails.some((r) => String(r[0]).toLowerCase() === email)) return json({ ok: true, duplicate: true })
    }
    // Prefix with ' so values starting with = + - @ are stored as text, not formulas.
    const row = COLUMNS.map((c) => {
      const v = c === 'email' ? email : String(data[c] || '').slice(0, 300)
      return /^[=+\-@]/.test(v) ? "'" + v : v
    })
    sheet.appendRow(row)
  } finally {
    lock.releaseLock()
  }
  return json({ ok: true })
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS)
    sheet.setFrozenRows(1)
  }
  return sheet
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
