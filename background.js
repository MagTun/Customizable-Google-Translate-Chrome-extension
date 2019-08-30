// https://stackoverflow.com/questions/37993631/trigger-shortcut-in-a-chrome-extension
// https://stackoverflow.com/a/44514135/3154274

chrome.commands.onCommand.addListener(function (command) {
    if (command === "copytoclipboard") {
        chrome.runtime.sendMessage({
            property: "copytoclipboard"
        }); // we can't call a function from popup.js from background so we need to pass a message
    }
});