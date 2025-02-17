# chromeExtension
Sample Chrome Extensions

# 🚀 Chrome Extension with Google Apps Script Integration  

This Chrome extension tracks GitHub commits and sends automated emails using **Google Apps Script (GAS)**. It consists of a **popup UI**, a **background script**, and a **Google Apps Script** for backend processing.  

---

## 📌 Features  
- ✅ Tracks GitHub commits daily/weekly  
- ✅ Sends automated emails via Google Apps Script  
- ✅ Uses background scripts for scheduled checks  
- ✅ Popup UI for manual tracking  

---

## 📂 Project Structure  
- **sbackground.js** – Background scripts  
- **popup.js, popup.html, stlyes.css/** – Popup UI files  
- **manifest.json** – Chrome extension configuration  
- **google_app_script.gs** – Google Apps Script backend  

---

## 🚀 Getting Started  

### 1️⃣ Deploying Google Apps Script  

1. Open **Google Apps Script** and create a new project.  
2. Copy the script from `google_app_script.gs` and paste it into the project.  
3. Deploy the script as a **Web App** and set permissions to `Anyone`.  
4. Copy the generated Web App URL and update the background.js script accordingly.  


### 2️⃣ Setting Up the Chrome Extension  

1. Clone the repository and navigate to the project directory.  
2. Open `chrome://extensions/` in Chrome.  
3. Enable **Developer Mode**.  
4. Click **"Load unpacked"** and select the project folder.  
5. The extension icon should appear in the toolbar.  

---

### 3️⃣ How It Works  

- **Background Script:** Runs automatically and checks commit activity.  
- **Popup UI:** Allows manual tracking via a button.  
- **Google Apps Script:** Sends automated emails with commit details.  

---


---

## 🎯 Conclusion  

This Chrome extension automates GitHub commit tracking and notifications using Google Apps Script. 🚀  

---

### 💡 Need Help?  

Check out:  
- [Google Apps Script Docs](https://developers.google.com/apps-script/)  
- [Chrome Extensions Docs](https://developer.chrome.com/docs/extensions/)  