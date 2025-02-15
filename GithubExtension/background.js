chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "fetchCommits") {
        triggerCommitFetch();
    }
});

function triggerCommitFetch() {
    chrome.storage.local.get(["githubUsername", "email", "frequency"], async (data) => {
        if (!data.githubUsername || !data.email) return;

        let timeFrame = data.frequency || "daily"; // Default to daily
        let commits = await getCommitCount(data.githubUsername, timeFrame);

        // Send email request with timeframe info
        fetch("https://script.google.com/macros/s/AKfycbzCHA4ctiqAvvBJPE2yYHXGraprz0PySRhD77iod12279heByH4wX2AQR8rEsvvvF7a6w/exec", 
            {
            redirect: "follow",
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            mode:'no-cors',
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


// Function to fetch commit count
async function getCommitCount(username, timeFrame) {
    const response = await fetch(`https://api.github.com/users/${username}/events`);
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