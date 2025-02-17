// Also listen for manual fetch requests (from popup)
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "fetchCommits") {
        triggerCommitFetch();
    }
});

// Function to fetch commits and send email
function triggerCommitFetch() {
    chrome.storage.sync.get(["githubUsername", "email", "frequency"], async (data) => {
        if (!data.githubUsername || !data.email) return;

        let timeFrame = data.frequency || "daily"; // Default to daily
        let commits = await getCommitCount(data.githubUsername, timeFrame);

        if (commits === null) {
            console.log(`No commits found for ${data.githubUsername}. Skipping email.`);
            return;
        }

        // Send email request
        fetch("<YOUR_GOOGLE_APP_SCRIPT_URL>", 
        {
            method: "POST",
            headers: { "Content-Type": "application/json",
                "X-Extension-ID": chrome.runtime.id
             },
            body: JSON.stringify({
                recipient: data.email,
                commitCount: commits,
                timeFrame: timeFrame
            })
        })
        .then(response => response.text()) 
        .then(data => console.log("Email Sent:", data))
        .catch(error => console.error("Error:", error));;
    });
}

// Function to check if a GitHub user exists
async function doesUserExist(username) {
    const response = await fetch(`https://api.github.com/users/${username}`);
    return response.ok;
}

// Function to fetch commit count
async function getCommitCount(username, timeFrame) {
    if (!(await doesUserExist(username))) {
        console.error("GitHub user does not exist:", username);
        return null;
    }

    const response = await fetch(`https://api.github.com/users/${username}/events`);

    if (!response.ok) {
        console.error("Failed to fetch events for user:", username);
        return null;
    }

    const events = await response.json();

    let today = new Date();
    let todayStr = today.toISOString().split("T")[0];

    let weekStart = new Date();
    weekStart.setDate(today.getDate() - 6); // Last 7 days

    let commitCount = events
        .filter(event => event.type === "PushEvent")
        .filter(event => {
            let eventDate = new Date(event.created_at); // Convert to Date object
            return timeFrame === "weekly"
                ? eventDate >= weekStart  // Compare as Date objects
                : eventDate.toISOString().split("T")[0] === todayStr; // Compare YYYY-MM-DD
        })
        .reduce((count, event) => count + event.payload.commits.length, 0);

    return commitCount;
}