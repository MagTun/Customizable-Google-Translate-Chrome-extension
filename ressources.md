
# manifest.json
## permission needed
● "activeTab",  : 
needed for getting the selection on current tab (it likes the tab permission but just on active tab)

called by  
chrome.tabs.executeScript({
            code: "window.getSelection().toString();"
● "http://*/*", "https://*/*",
needed to have external links (to google translate api)

●  "storage"
needed to save the options

## permission not usefull
"*://translate.google.com/*" → we use "http://*/*", "https://*/*",
"tabs" → we use activeTab
"tts" → textToSpeech : not needed


## content_security_policy
we don't need any of this
"content_security_policy": "script-src 'self' 'unsafe-eval' https://ssl.google-analytics.com https://translate.google.com; object-src 'self'",



# source: https://ctrlq.org/code/19909-google-translate-api

 when too many request: we are blocked for all google service : google search, gmail, translate... 
"Our systems have detected unusual traffic from your computer network. Please try your request again later."
"The block will expire shortly after those requests stop."
url should be like (cf below):

https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=father&ie=UTF-8&oe=UTF-8  

https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=en&tl=fr&dt=t&q=father  = blocked 
https://translate.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=fr&dt=t&q=father
https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=fr&dt=t&q=father

var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
    sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText) + "&ie=UTF-8&oe=UTF-8";   // block after 100 resquests

var url = "translate.googleapis.com/translate_a/t?client=zdrt&sl=" + //this link always return too many request





# usefull ressources
<a href="https://github.com/cjvnjde/google-translate-api-browser">cjvnjde/google-translate-api-browser: A free and unlimited API for Google Translate</a><br/>
<a href="https://github.com/matheuss/google-translate-api">matheuss/google-translate-api: A free and unlimited API for Google Translate</a><br/>
<a href="https://github.com/matheuss/google-translate-token">matheuss/google-translate-token: A package that generates the necessary token to use the Google Translate API for free</a><br/>
<a href="https://github.com/artemave/translate_onhover">artemave/translate_onhover: Google Chrome translation extension</a><br/>
<a href="https://github.com/artemave/translate_onhover/blob/master/lib/languages.js">translate_onhover/languages.js at master &middot; artemave/translate_onhover</a><br/>
<a href="https://github.com/bravelocation/BingTranslateChromeExtension">bravelocation/BingTranslateChromeExtension: Chrome Extension to allow call to Bing Translate for highlighted text</a><br/>
<a href="https://stackoverflow.com/questions/57397073/difference-between-the-google-translate-api">Difference between the google translate API - Stack Overflow</a><br/>

