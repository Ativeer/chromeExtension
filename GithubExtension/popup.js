document.getElementById("saveBtn").addEventListener("click", function() {
    const username = document.getElementById("githubUsername").value;
    const email = document.getElementById("email").value;
    const frequency = document.getElementById("frequency").value; // Daily or Weekly

    if (!username || !email) {
        alert("Please enter both GitHub username and email.");
        return;
    }

    // Check if the username and email already exist in storage
    chrome.storage.sync.get(["githubUsername", "email"], (data) => {
        if (data.githubUsername === username && data.email === email) {
            alert("This username and email are already saved.");
            return; // Don't proceed with saving if it's the same
        }

        // Save settings to chrome storage
        chrome.storage.sync.set({ githubUsername: username, email: email, frequency: frequency }, () => {
            alert(`Settings saved! You'll receive ${frequency} email notifications.`);

            // Clear previous alarms
            chrome.alarms.clearAll(() => {
                let periodInMinutes = frequency === "daily" ? 1440 : 10080; // 1 day or 7 days
                chrome.alarms.create("fetchCommits", { periodInMinutes });

                // Trigger Immediately After Saving
                chrome.runtime.sendMessage({ action: "fetchCommits" });
            });
        });
    });
});