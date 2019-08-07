document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('inputSource').focus()
    // get selected text: 
    // https://stackoverflow.com/questions/19164474/chrome-extension-get-selected-text
    // https://stackoverflow.com/questions/4996194/chrome-tabs-executescript-not-working?answertab=active#tab-top
    chrome.tabs.executeScript({
        code: "window.getSelection().toString();"
    }, function (selection) {
        //if there is a selected text, start the translate, otherwise wait for text in input
        if (selection != "") {
            document.getElementById("inputSource").value = selection[0];
            translate();

        }
    });

    // when text is writen in inputSource: trigger the translate on enter
    // source https://stackoverflow.com/questions/6524288/jquery-event-for-user-pressing-enter-in-a-textbox  : enter
    // source http://jsfiddle.net/arunpjohny/SZ9TG/1/  : via addEventListener
    var inputText = document.getElementById('inputSource');
    inputText.addEventListener('keypress', function (e) {
        if (e.keyCode == 13) {
            // 13 = enter
            // alert("You pressed enter!");
            translate();
        }
    });


   // when state of radio button are changed, trigger translate
    var radiosource = document.getElementsByName("source");
    for (var i = 0; i < radiosource.length; i++) {
        radiosource[i].addEventListener('change', function () {
            translate();
        });
    }
    var radiotarget = document.getElementsByName("target");
    for (var i = 0; i < radiotarget.length; i++) {
        radiotarget[i].addEventListener('change', function () {
            translate();
        });
    }

    // add function to button translate
    var buttontranslate = document.getElementById('translate');
    buttontranslate.addEventListener('click', function () {
        translate();
    }, false);


    // add function to button copyToClipboard
    var buttonCopytoclipboard = document.getElementById('copytoclipboard');
    buttonCopytoclipboard.addEventListener('click', function () {
        copyToClipboard();
    }, false);


    // add display list language
    // source  http://jsfiddle.net/JppP5/25/
    var menuTopNav = document.getElementById('topNav');
    menuTopNav.addEventListener('mouseover', function () {
        var listothersLanguageSource = document.getElementById("listothersLanguageSource")
        listothersLanguageSource.style.display = "block";
        listothersLanguageSource.style.display = "block";
    }, false);
    menuTopNav.addEventListener('mouseout', function () {
        var listothersLanguageSource = document.getElementById("listothersLanguageSource")
        listothersLanguageSource.style.display = "none";
        listothersLanguageSource.style.display = "none";
    }, false);

}, false);


// # ============================================================== ¤ function 


function translate() {
    // alert(document.getElementById("inputSource").value) //●
    var sourceText = document.getElementById('inputSource').value;
    var sourceLang = document.querySelector('input[name="source"]:checked').value;
    var targetLang = document.querySelector('input[name="target"]:checked').value;
    // alert(sourceLang) // ●
    // alert(targetLang) // ●

    // var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
    //     sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText) + "&ie=UTF-8&oe=UTF-8";   // block after 100 resquests
    var url = "https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=" +
        sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText) + "&ie=UTF-8&oe=UTF-8";


    var http = new XMLHttpRequest();

    // add to the request what to do when get response 
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            // alert(JSON.parse(http.responseText)[0][0][0]); //●
            var inputTarget = document.getElementById('inputTarget');
            inputTarget.value = JSON.parse(http.responseText)["sentences"][0]["trans"]; // for clients5.google.com and translate.google.com
            // inputTarget.value = JSON.parse(http.responseText)[0][0][0];   // for translate.googleapis.com
        }
    }

    http.open("GET", url);
    http.send(null); // null = no parameters
};


// add copy to clipboard
// https://github.com/artemave/translate_onhover/blob/a0f365539268f0750df81466f4508ba911e579e6/contentscript.js
function copyToClipboard() {
    var translated = document.getElementById("inputTarget");
    translated.select()
    document.execCommand('copy')
    document.body.removeChild(input)
}

