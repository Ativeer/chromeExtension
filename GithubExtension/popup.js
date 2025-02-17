document.getElementById("saveBtn").addEventListener("click", function() {
    const username = document.getElementById("githubUsername").value;
    const email = document.getElementById("email").value;
    const frequency = document.getElementById("frequency").value; // Daily or Weekly

    if (!username || !email) {
        alert("Please enter both GitHub username and email.");
        return;
    }

    // Check if the GitHub user exists
    doesUserExist(username).then(userExists => {
        if (!userExists) {
            alert("GitHub user does not exist. Please check the username.");
            return;
        }

        // If the username exists, check for duplicates
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
});

// Function to check if a GitHub user exists
async function doesUserExist(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);

        if (!response.ok) {
            // If the response is not OK, the user does not exist
            return false;
        }

        return true; // User exists
    } catch (error) {
        console.error("Error checking user existence:", error);
        return false; // If there's an error in the fetch call, consider user non-existent
    }
}