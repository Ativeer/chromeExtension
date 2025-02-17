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
              `Bruh... <b>ZERO</b> commits?! What are you even doing? Watching YouTube tutorials and calling it "research"? 💀 Get your act together and start pushing some code!`,
              `No commits? Seriously? Even a rubber duck could commit "fix bug". 🦆 Start coding before I report you for impersonating a developer.`,
              `You wrote <b>0 commits</b>. That's literally the easiest number to beat. Just press some keys, damn it! 🤦‍♂️`,
              `A whole <b>${timeFrame === "daily" ? "day" : "week"}</b> and nothing? Not even a "WIP" commit? At this point, I'm questioning your entire existence. 🤨`
          ];
          body = getRandomMessage(zeroCommitMessages);
      } else if (commitCount > 0 && commitCount <= 5) {
          let lowCommitMessages = [
              `Alright, you made <b>${commitCount} commits</b>. Not bad, but let’s be real—you can do better. 🚶‍♂️ Less scrolling, more coding!`,
              `<b>${commitCount} commits</b>? Respectable, but you're still coding at grandma speed. Pick it up! 🚴`,
              `You've committed <b>${commitCount}</b> times. I’d be proud if you weren’t spending half the time refactoring variable names. 😂`,
              `Solid <b>${commitCount}</b> commits, but are you even pushing real code or just fixing typos? Be honest. 😏`
          ];
          body = getRandomMessage(lowCommitMessages);
      } else if (commitCount > 5 && commitCount <= 15) {
          let midCommitMessages = [
              `Nice! <b>${commitCount} commits</b>—you're finally treating this repo with some respect. Keep going! 🚀`,
              `<b>${commitCount} commits</b>? Someone's in the zone! Don't burn out before the next sprint. 🔥`,
              `Now we're talking! <b>${commitCount} commits</b>—I can actually tell you're a developer now. 🤖`,
              `Your <b>${commitCount} commits</b> are keeping this repo alive. Just don't forget to eat and sleep. 😅`
          ];
          body = getRandomMessage(midCommitMessages);
      } else {
          let highCommitMessages = [
              `Whoa, <b>${commitCount} commits</b>?! What are you trying to prove? That you're ChatGPT in disguise? 🤖`,
              `<b>${commitCount} commits</b>—either you love coding or you're running out of hobbies. Either way, I'm impressed. 😆`,
              `At <b>${commitCount} commits</b>, you might not even need me anymore. Just go ahead and automate yourself. 🏆`,
              `Damn, <b>${commitCount} commits</b>? Do you even have a social life? Or are you just in an endless loop of git add, commit, push? 😂`
          ];
          body = getRandomMessage(highCommitMessages);
      }

      // Adding an Image (Use different images based on commit count)
      let imageUrl = "";
      if (commitCount === 0) {
          imageUrl = "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWY4bHQxeDVvanRxZnV2MzZmMXU0YXF0OWhnYmx1dzg3OGRiaXdwcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l46CyJmS9KUbokzsI/giphy.gif";
      } else if (commitCount <= 5) {
          imageUrl = "https://media.giphy.com/media/xT0xezQGU5xCDJuCPe/giphy.gif";
      } else if (commitCount <= 15) {
          imageUrl = "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif";
      } else {
          imageUrl = "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTdpdDB2YXh4eDdkamQ0b2FsaTA1azE3eWxsN2szazBhaGxwY2h2byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13HgwGsXF0aiGY/giphy.gif";
      }

      let imageTag = `<br><br><img src="${imageUrl}" width="300"><br>`;

      // Salutation
      let salutation = `<br><br>Keep pushing code! 💻🚀<br><b>- Your GitHub Tracker</b>`;

      body = imageTag + body + salutation;

      MailApp.sendEmail({
      to: recipient,  // Change this to the recipient's email
      subject: subject,
      htmlBody: body
  });
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