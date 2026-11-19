# Set up ROOF sign-ups

People who join on the site are saved in a Google Sheet. This is free. You do it once.

## 1. Open the Google Sheet

Make a new Google Sheet, or open the one you want to use. The first tab is where new rows will land. Leave the first row empty. The script adds the column names itself.

## 2. Open Apps Script

In the sheet, click **Extensions**, then **Apps Script**.

A new tab opens with a code editor.

## 3. Paste the code

Select everything already in the editor and delete it.

Open `docs/signup-apps-script.gs` in this project, copy all of it, and paste it into the editor.

Click the save icon.

## 4. Deploy it as a web app

Click **Deploy**, then **New deployment**.

Click the gear next to "Select type" and choose **Web app**.

Set:

- **Execute as:** Me
- **Who has access:** Anyone

Click **Deploy**.

## 5. Authorise it

Google will ask you to allow the script to edit the sheet. Click through and allow it. This is your own script, writing to your own sheet.

## 6. Copy the Web app URL

After it deploys, copy the **Web app URL**. It looks like a long `https://script.google.com/...` address.

Keep this private. Anyone with the URL can add a row to the sheet.

## 7. Add it in Vercel

Open the ROOF project in Vercel.

Go to **Project**, then **Settings**, then **Environment Variables**.

Add one variable:

- **Name:** `SIGNUP_WEBHOOK_URL`
- **Value:** the Web app URL you copied
- Tick **Production** and **Preview**

Save.

## 8. Redeploy

Vercel only picks up a new variable on the next deploy. Redeploy the site (Deployments, then the latest deployment, then Redeploy).

After that, the Join form on the site writes a row to the sheet.

If the variable is missing, the form says sign-up is not set up yet, and the site still builds and loads.
