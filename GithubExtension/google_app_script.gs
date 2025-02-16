function doPost(e) {
    try {
        Logger.log("Received request: " + JSON.stringify(e));
        console.log("SOME LOGS, to test!")
        if (!e || !e.postData || !e.postData.contents) {
            return sendCORSResponse("Error: No postData received");
        }

        let data = JSON.parse(e.postData.contents);
        let recipient = data.recipient;
        let commitCount = data.commitCount;
        let timeFrame = data.timeFrame;

        if (!recipient || commitCount === undefined) {
            return sendCORSResponse("Error: Missing parameters");
        }

    let subject = `🔥 GitHub Commit Report (${timeFrame}) 🔥`;

    let body = "";

    function getRandomMessage(messages) {
        return messages[Math.floor(Math.random() * messages.length)];
    }

    if (commitCount === 0) {
        let zeroCommitMessages = [
            `Bruh... *ZERO* commits?! What are you even doing? Watching YouTube tutorials and calling it "research"? 💀 Get your act together and start pushing some code!`,
            `No commits? Seriously? Even a rubber duck could commit "fix bug". 🦆 Start coding before I report you for impersonating a developer.`,
            `You wrote **0 commits**. That's literally the easiest number to beat. Just press some keys, damn it! 🤦‍♂️`,
            `A whole ${timeFrame === "daily" ? "day" : "week"} and nothing? Not even a "WIP" commit? At this point, I'm questioning your entire existence. 🤨`
        ];
        body = getRandomMessage(zeroCommitMessages);
    } else if (commitCount > 0 && commitCount <= 5) {
        let lowCommitMessages = [
            `Alright, you made **${commitCount} commits**. Not bad, but let’s be real—you can do better. 🚶‍♂️ Less scrolling, more coding!`,
            `**${commitCount} commits**? Respectable, but you're still coding at grandma speed. Pick it up! 🚴`,
            `You've committed **${commitCount}** times. I’d be proud if you weren’t spending half the time refactoring variable names. 😂`,
            `Solid **${commitCount}** commits, but are you even pushing real code or just fixing typos? Be honest. 😏`
        ];
        body = getRandomMessage(lowCommitMessages);
    } else if (commitCount > 5 && commitCount <= 15) {
        let midCommitMessages = [
            `Nice! **${commitCount} commits**—you're finally treating this repo with some respect. Keep going! 🚀`,
            `**${commitCount} commits**? Someone's in the zone! Don’t burn out before the next sprint. 🔥`,
            `Now we're talking! **${commitCount} commits**—I can actually tell you're a developer now. 🤖`,
            `Your **${commitCount} commits** are keeping this repo alive. Just don’t forget to eat and sleep. 😅`
        ];
        body = getRandomMessage(midCommitMessages);
    } else {
        let highCommitMessages = [
            `Whoa, **${commitCount} commits**?! What are you trying to prove? That you're ChatGPT in disguise? 🤖`,
            `**${commitCount} commits**—either you love coding or you're running out of hobbies. Either way, I'm impressed. 😆`,
            `At **${commitCount} commits**, you might not even need me anymore. Just go ahead and automate yourself. 🏆`,
            `Damn, **${commitCount} commits**? Do you even have a social life? Or are you just in an endless loop of git add, commit, push? 😂`
        ];
        body = getRandomMessage(highCommitMessages);
    }

        MailApp.sendEmail(recipient, subject, body);
        Logger.log("Email sent successfully to: " + recipient);

        return sendCORSResponse("Email sent successfully", 200);
    } catch (error) {
        Logger.log("Error: " + error.message);
        return sendCORSResponse(`Error: ${error.message}`);
    }
}

// ✅ Handle CORS response correctly
function sendCORSResponse(message, status_code=400) {
    let output = ContentService.createTextOutput(JSON.stringify({ message }))
        .setMimeType(ContentService.MimeType.JSON);

    // Set CORS headers via HTTPResponse
    let response = HtmlService.createHtmlOutput();
    response.append(JSON.stringify({ message }));
    response.setTitle("CORS Fix");

    response.getHeaders = function () {
        return {
          "statusCode": status_code,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-Extension-ID"
        };
    };

    return output;
}