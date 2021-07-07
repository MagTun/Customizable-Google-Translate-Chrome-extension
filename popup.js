// to do
// add support for play audio : https://stackoverflow.com/questions/35002003/how-to-use-google-translate-tts-with-the-new-v2-api
// https://stackoverflow.com/questions/51904999/how-to-get-an-authentication-token-for-google-cloud-translation-api-within-brows/59889047#59889047


// pass by Gcloud translta = better tranalate : https://cloud.google.com/translate/docs/advanced/quickstart
// # ============================================================== ¤ when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {

    //global var avaible averywhere because it takes time to load the voices
    window.allVoices = window.speechSynthesis.getVoices()
    console.log(allVoices)
    // # ------------------------------------------------------ ¤¤ retrieve options from chrome.storage (or if there are no option set sourcedefault,targetdefault, sourceLang, targetLang)
    chrome.storage.sync.get({
        sourcedefault: "auto",
        targetdefault: "nl",
        sourceLang: ['en', 'nl', 'fr', 'auto'],
        targetLang: ['en', 'nl', 'fr'],
        copyBothchecked: false
    }, function (data) {
        // # ------------------------------------------------------ ¤¤ when the options are retrieve
        var Option_MainSourceLanguages = data.sourceLang;
        var Option_MainTargetLanguages = data.targetLang;
        var current_source = data.sourcedefault;
        var current_target = data.targetdefault;
        var copyBothchecked_storage = data.copyBothchecked



        // # ------------------------------------------------------ ¤¤ copyBoth to clipboard :
        // # ...................................... ¤¤¤ check the box if the settings is set
        var copyBoth_checkbox = document.getElementById("copyBoth");
        var copyBothlabel = document.getElementById("copyBothlabel");

        if (copyBothchecked_storage == true) {
            copyBoth_checkbox.checked = true
            copyBothlabel.style.color = "red";
        } else {
            copyBoth_checkbox.checked = false
            copyBothlabel.style.color = "black";
        }

        //# ...................................... ¤¤¤ if the state of checkbox change save it to storage
        copyBoth_checkbox.addEventListener('change', function () {
            if (this.checked) {
                chrome.storage.sync.set({
                    copyBothchecked: true
                });
                copyBothlabel.style.color = "red";
                // alert("cjed")
            } else {
                chrome.storage.sync.set({
                    copyBothchecked: false
                });
                copyBothlabel.style.color = "black";
            }
        });
        copyBothlabel.addEventListener('click', function () {
            if (copyBoth_checkbox.checked) {
                chrome.storage.sync.set({
                    copyBothchecked: false
                });
                copyBoth_checkbox.checked = false;
                copyBothlabel.style.color = "black";
                // alert("cjed")
            } else {
                chrome.storage.sync.set({
                    copyBothchecked: true
                });
                copyBoth_checkbox.checked = true;
                copyBothlabel.style.color = "red";
                translate();

            }
        });


        // # ------------------------------------------------------ ¤¤  create the <radio> for language choice (cf function languageRender)
        languageRender(Option_MainSourceLanguages, Option_MainTargetLanguages, current_source, current_target);

        // set focus to source textarea
        document.getElementById('textareaSource').focus()


        // # ------------------------------------------------------ ¤¤ get selected text on page
        // https://stackoverflow.com/questions/19164474/chrome-extension-get-selected-text
        // https://stackoverflow.com/questions/4996194/chrome-tabs-executescript-not-working?answertab=active#tab-top
        chrome.tabs.executeScript({
            code: "window.getSelection().toString();"
        }, function (selection) {

            //if there is a selected text, start the translate, otherwise wait for text in input
            if (!(typeof selection === 'undefined' || selection === null)) {
                document.getElementById("textareaSource").value = selection[0];
                translate();
            }
        });




        // # ------------------------------------------------------ ¤¤ when state of radio button are changed:
        // 1) trigger translate  
        // 2) modify target/source according to choice  (if src=FR, then tgt=EN... )
        // this addeventlistener only works the first time because when the language are changed we reload the dom - so to modify target/source for the following time, we need to add it also in languageRender cf 
        // document.querySelectorAll('[name="source"]').forEach(function (input) {
        // # ...................................... ¤¤¤ source
        var radiosource = document.getElementsByName("source");
        for (var i = 0; i < radiosource.length; i++) {
            radiosource[i].addEventListener('change', function (e) {
                var input_changed_id = e.target.id;

                // below works only if you use only 2 language otherwise 
                // if (input_changed_id.includes("en")) {
                //     document.getElementById("nl_target").checked = true;
                //     current_target = "nl";
                // }
                // if (input_changed_id.includes("fr")) {
                //     document.getElementById("en_target").checked = true;
                //     current_target = "en";
                // }
                // if (input_changed_id.includes("nl")) {
                //     document.getElementById("en_target").checked = true;
                //     current_target = "en";
                // }
                translate();
            });
        }
        // # ...................................... ¤¤¤ target
        var radiotarget = document.getElementsByName("target");
        for (var i = 0; i < radiotarget.length; i++) {
            radiotarget[i].addEventListener('change', function (e) {

                // var input_changed_id = e.target.id;
                // if (input_changed_id.includes("en")) {
                //     document.getElementById("fr_source").checked = true;
                //     current_source = "fr"
                // }
                // if (input_changed_id.includes("fr")) {
                //     document.getElementById("en_source").checked = true;
                //     current_source = "en"
                // }

                // if (!(document.getElementById('textareaSource').value = "")) {
                translate();
                // }
            });


        }

        // # ------------------------------------------------------ ¤¤ shortcut when text is writen in textareaSource: trigger the translate on enter
        // source https://stackoverflow.com/questions/6524288/jquery-event-for-user-pressing-enter-in-a-textbox  : enter
        // source http://jsfiddle.net/arunpjohny/SZ9TG/1/  : via addEventListener
        var textareaSource = document.getElementById('textareaSource');
        textareaSource.addEventListener('keydown', function (e) {
            if (e.key == 'Enter') {
                // if (e.key == 'Enter' && e.ctrlKey) {
                translate();
            }

        });
        var textareaTarget = document.getElementById('textareaTarget');
        textareaTarget.addEventListener('keydown', function (e) {
            if (e.key == 'Enter') {
                // if (e.key == 'Enter' && e.ctrlKey) {
                translate();
            }

        });


        document.body.addEventListener('keydown', function (e) {
            // if (e.altKey || e.ctrlKey || e.shiftKey) {
            //     alert("you pressed one of the 'Alt', 'Ctrl', or 'Shift' keys")
            // }
            //  alt+t, alt+c ,  alt+1, alt+2 : they don't work so I added shorcut here with ctrl and then use AHK to bind the shortcut together
            //https://keycode.info/ 
            if (e.key == "o" && e.altKey) {
                document.getElementById('textareaSource').focus()
            } else if (e.key == "p" && e.altKey) {
                document.getElementById('textareaTarget').focus()
            } else if (e.key == "k" && e.altKey) {
                document.getElementsByName("source")[0].click();
            } else if (e.key == "l" && e.altKey) {
                document.getElementsByName("source")[1].click();
            } else if (e.altKey && e.key == "c") {
                copyToClipboard();
            } else if (e.altKey && e.key == "r") {
                reverseTranslation();
            } else if (e.altKey && e.key == "+") {
                expandTextArea();
            } else if (e.altKey && e.key == "=") {
                expandTextArea();
            } else if (e.key == "ArrowUp") {
                scrollUp();
            } else if (e.key == "ArrowDown") {
                scrollDown();
            } else if (e.altKey && e.key == "n") {
                var copyBoth_checkbox = document.getElementById("copyBoth");
                var copyBothlabel = document.getElementById("copyBothlabel");
                if (copyBoth_checkbox.checked == true) {
                    copyBoth_checkbox.checked = false;
                    copyBothlabel.style.color = "black";
                    chrome.storage.sync.set({
                        copyBothchecked: false
                    });

                } else {
                    copyBoth_checkbox.checked = true;
                    copyBothlabel.style.color = "red";
                    chrome.storage.sync.set({
                        copyBothchecked: true
                    });
                }
                if (copyBoth_checkbox.checked && document.getElementById('textareaTarget').value != "" && document.getElementById('textareaTarget').value != "") {
                    copyBothToClipboard()
                }
            }
        });

        // # ------------------------------------------------------ ¤¤ add function to button translate
        var buttontranslate = document.getElementById('translate');
        buttontranslate.addEventListener('click', function () {
            translate();
        }, false);


        // # ------------------------------------------------------ ¤¤ add function to button copyToClipboard
        var buttonCopytoclipboard = document.getElementById('copytoclipboard');
        buttonCopytoclipboard.addEventListener('click', function () {
            copyToClipboard();
        }, false);


        // # ------------------------------------------------------ ¤¤ add function to button set options (open the option toggle)
        var buttonsetoptions = document.getElementById('setoptions');
        buttonsetoptions.addEventListener('click', function () {
            var optionsdisplay = document.getElementById("options").style.display
            if (optionsdisplay == "block") {
                options.style.display = "none";
                buttonsetoptions.innerText = "Set Options";
            } else {
                options.style.display = "block";
                buttonsetoptions.innerText = "Close Options";
                setoptions();
            }
        }, false);





        // # ------------------------------------------------------ ¤¤ add function to button reset options  (copied in options.js)
        var buttonresetoptions = document.getElementById('resetoptions');
        buttonresetoptions.addEventListener('click', function () {
            resetoptions();
        }, false);

        // # ------------------------------------------------------ ¤¤ display  list language when click on Others
        // source  http://jsfiddle.net/JppP5/25/
        // # ...................................... ¤¤¤ source
        var menuothersLanguageSource = document.getElementById('othersLanguageSource');
        // var menuTopNavSource = document.getElementById('topNavSource');
        menuothersLanguageSource.addEventListener('click', function (e) {
            var listothersLanguageSource = document.getElementById("listothersLanguageSource")
            if (listothersLanguageSource.style.display == "block") {
                listothersLanguageSource.style.display = "none";
            } else {
                //display list of menu right at te correct level (sometimes menuTopNavSource is 1 line sometimes 2 lines) 
                listothersLanguageSource.style.top = menuothersLanguageSource.style.top
                // display the list of other languages
                listothersLanguageSource.style.display = "block";
            }
        }, false);

        // # ...................................... ¤¤¤ target
        var menuothersLanguageTarget = document.getElementById('othersLanguageTarget');
        // var menuTopNavTarget = document.getElementById('topNavTarget');
        menuothersLanguageTarget.addEventListener('click', function (e) {
            var listothersLanguageTarget = document.getElementById("listothersLanguageTarget")
            if (listothersLanguageTarget.style.display == "block") {
                listothersLanguageTarget.style.display = "none";

            } else {
                listothersLanguageTarget.style.top = menuothersLanguageTarget.style.top
                listothersLanguageTarget.style.display = "block";
            }
        }, false);




        // # ------------------------------------------------------ ¤¤end "chrome.storage.sync"
    });



    // # ============================================================== ¤ end DOM loaded (document.addEventListener('DOMContentLoaded') )
}, false);




// # ------------------------------------------------------ ¤¤  translate (called by button)
function translate() {
    console.log("translate function")

    // remove the text of  the div that indicate which language it is and the "see data" button
    document.getElementById('lang_detected_when_src_is_auto').innerHTML = "";
    var datapreview = document.getElementById("datapreview")
    datapreview.style.display = "none";
    datapreview.innerHTML = '';
    var buttonseedata = document.getElementById('seedata');
    buttonseedata.innerText = "empty";
    buttonseedata.style.display = "none";

    var myfullresultpreview = document.getElementById("myfullresultpreview")
    myfullresultpreview.style.display = "none";
    myfullresultpreview.innerHTML = '';
    var buttonseemyfullresult = document.getElementById('seemyfullresult');
    buttonseemyfullresult.innerText = "empty";
    buttonseemyfullresult.style.display = "none";


    var speaktranslate = document.getElementById('speaktranslate');
    speaktranslate.style.display = "none";
    var speakorigine = document.getElementById('speakorigine');
    speakorigine.style.display = "none";

    var sourceText = document.getElementById('textareaSource').value;





    // if source text isn't empty
    if (!(sourceText == "")) {


        // warning no longer need because to google token
        if (sourceText.length > 4999) {
            var statustoolong = document.getElementById('statustoolong');
            statustoolong.textContent = '5000 characters limit exceeded, use the link to go to gTranslate:';
            setTimeout(function () {
                statustoolong.textContent = '';
            }, 10000);
        } else {


            //format source text because google translate stop at "."  and line break %0A so we need to replace them
            // sourceText = sourceText.replace(/(\r\n|\n|\r|\\n)/gm, '~'); // replace line break 
            // sourceText = sourceText.replace(".", "¤").replace("!", "¤¤").replace("?", "¤¤¤").replace(";", "¤¤¤¤"); // replace "."   
            // alert(sourceText)
            // retrieve language source/target
            var sourceLang = document.querySelector('input[name="source"]:checked').value.replace('_source', '');
            var targetLang = document.querySelector('input[name="target"]:checked').value.replace('_target', '');

            // + ++ + ++ + ++ + ++ + ++ + ++ + split text if it  is too long
            // var tests = ["this is good", "this is great", "this is awesome"]
            // var test_translations = []
            // tests.forEach((test, index) => {
            //     var url = "https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=" +
            //         sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(test) + "&ie=UTF-8&oe=UTF-8";
            //     var http = new XMLHttpRequest();

            //     http.onreadystatechange = function () {
            //         if (http.readyState == 4 && http.status == 200) {


            //             // # ............................   ¤¤¤¤ retrieve main translation 
            //             // for clients5.google.com and translate.google.com = JSON.parse(http.responseText)["sentences"][0]["trans"]
            //             // for translate.googleapis.com =  JSON.parse(http.responseText)[0][0][0]
            //             var translated = JSON.parse(http.responseText)["sentences"][0]["trans"];
            //             test_translations.push(translated);
            //             alert("a " + test_translations)
            //             var textareaTarget = document.getElementById('textareaTarget');
            //             textareaTarget.value = test_translations.join("\n")
            //         }
            //     }
            //     http.open("GET", url);
            //     http.send(null); // null = no parameters

            // });


            var tkkgenerated = generateTK(sourceText)
            // var url = "https://translate.google.cn/translate_a/single?ie=UTF-8&client=webapp&otf=1&ssel=0&tsel=0&kc=5&dt=t&dt=at&dt=bd&dt=ex&dt=md&dt=rw&dt=ss&dt=rm&sl=" + sourceLang + "&tl=" + targetLang + "&tk=" + tkkgenerated + "&q=" + encodeURIComponent(sourceText);



            // this.TRANSLATE_URL = `https://translate.google.cn/translate_a/single?ie=UTF-8&client=webapp&otf=1&ssel=0&tsel=0&kc=5&dt=t&dt=at&dt=bd&dt=ex&dt=md&dt=rw&dt=ss&dt=rm`;
            // this.TTS_URL = `https://translate.google.cn/translate_tts?ie=UTF-8&client=webapp`;
            // let query = "&sl=auto&tl=zh-cn";
            // query += `&tk=${this.generateTK(text, this.TKK[0], this.TKK[1])}&q=${encodeURIComponent(
            //     text
            // )}`;

            var url = "https://translate.google.com/translate_a/single?client=webapp&otf=1&ssel=0&tsel=0&kc=5&dt=t&dt=at&dt=bd&dt=ex&dt=md&dt=rw&dt=ss&dt=rm&sl=" + sourceLang + "&tl=" + targetLang + "&q=" + encodeURIComponent(sourceText) + "&ie=UTF-8&oe=UTF-8" + "&tk=" + tkkgenerated;
            // console.log(tkkgenerated)
            // var url = "https://clients5.google.com/translate_a/t?client=dict-chrome-ex&otf=1&ssel=0&tsel=0&kc=5&dt=t&dt=at&dt=bd&dt=ex&dt=md&dt=rw&dt=ss&dt=rm&sl=" + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText) + "&ie=UTF-8&oe=UTF-8";
            // https: //clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=fr&dt=t&q=father
            // var url = "https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=" +
            //     sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText) + "&ie=UTF-8&oe=UTF-8";
            var http = new XMLHttpRequest();


            // when readyState change this function is called 
            // readyState = 0 = UNSENT  / 1	OPENED	/ 2	HEADERS_RECEIVED / 3	LOADING	/ 4	DONE
            http.onreadystatechange = function () {
                // # ...................................... ¤¤¤ if request worked 
                if (http.readyState == 4 && http.status == 200) {


                    // # ............................   ¤¤¤¤ retrieve main translation 
                    // for clients5.google.com and translate.google.com = JSON.parse(http.responseText)["sentences"][0]["trans"]
                    // for translate.googleapis.com =  JSON.parse(http.responseText)[0][0][0]
                    // console.log(http.responseText)
                    var json_data = JSON.parse(http.responseText);
                    // console.log(json_data)
                    // console.log(typeof json_data);




                    // # ............................   ¤¤¤¤  add see data button to preview the json
                    var buttonseedata = document.getElementById('seedata');
                    buttonseedata.style.display = "block";
                    buttonseedata.innerText = "See json";
                    // need to remove the event listener before adding a new one
                    buttonseedata.removeEventListener('click', displayjson, false); // features.sj
                    buttonseedata.addEventListener('click', displayjson, false);

                    // pretty json : https://stackoverflow.com/a/7220510
                    var datapreview = document.getElementById("datapreview");
                    var stringified = JSON.stringify(json_data, undefined, 4);
                    var json_data_syntax = syntaxHighlight(stringified);
                    var preElement = document.createElement('pre')
                    datapreview.appendChild(preElement).innerHTML = json_data_syntax;
                    preElement.style.display = "inline-block";
                    preElement.style.whiteSpace = "pre-wrap";




                    // # ............................   ¤¤¤¤ see full result formated from https://github.com/EdgeTranslate/EdgeTranslate
                    var buttonseemyfullresult = document.getElementById('seemyfullresult');
                    buttonseemyfullresult.style.display = "block";
                    buttonseemyfullresult.innerText = "See formatted result";
                    var myfullresultpreview = document.getElementById("myfullresultpreview");

                    var parseData_var = parseResult(json_data)
                    var displayResult_var = displayResult(parseData_var)
                    myfullresultpreview.innerHTML = displayResult_var;

                    // need to remove the event listener before adding a new one
                    buttonseemyfullresult.removeEventListener('click', displaymyfullresult, false);
                    buttonseemyfullresult.addEventListener('click', displaymyfullresult, false);


                    // # ...................................... ¤¤¤  add translation to input 
                    var main_translation = parseData_var.mainMeaning; //¤  translate
                    // var main_translation = json_data[0][0][0][0][0]; //¤ clients5.google.com
                    // var main_translation = json_data[0][0][0]; //¤  translate
                    // var main_translation = json_data["sentences"][0]["trans"];
                    // main_translation = main_translation.replace("~", "\n");
                    // main_translation = main_translation.replace("¤¤¤¤", ";").replace("¤¤¤", "?").replace("¤¤", "!").replace("¤", ".");
                    var textareaTarget = document.getElementById('textareaTarget');
                    textareaTarget.value = main_translation




                    // # ............................   ¤¤¤¤ retrieve alternative translations  and append it to translate 
                    // phrase don't have alternative translations: 
                    var alternative_translations = json_data["dict"];
                    if (!(typeof alternative_translations === 'undefined' || alternative_translations === null)) {
                        var alternative_translations_retrieved = []
                        alternative_translations.forEach((terms, index) => {
                            terms["terms"].forEach((term, index2) => {
                                alternative_translations_retrieved.push(term);
                            });
                        });

                        // # .... *  not needed anymore : remove duplicate of main translation
                        // var textareaTarget = document.getElementById('textareaTarget');

                        // alternative_translations_retrieved_without_dupli = alternative_translations_retrieved.filter(function (e) {
                        //     return e !== textareaTarget.value
                        // })
                        // // add translation to input if it not empty
                        // if (alternative_translations_retrieved_without_dupli.length != 0) {
                        //     textareaTarget.value = textareaTarget.value + "\n\n\nAlternative translations: \n● " + alternative_translations_retrieved_without_dupli.join("\n● ")
                        // }

                    }

                    // expand textarea
                    var expandbutton = document.getElementById('expandtextarea');
                    expandbutton.style.display = "block";
                    expandbutton.innerText = "Expand input boxes";
                    // need to remove the event listener before adding a new one
                    expandbutton.removeEventListener('click', expandTextArea, false);
                    expandbutton.addEventListener('click', expandTextArea, false);



                    // when the selected language is not the one google translate detected, switch to auto 
                    if (json_data[8][0] != sourceLang && sourceLang != "auto") { //¤
                        // if (json_data[2] != sourceLang && sourceLang != "auto") { //¤
                        // if (json_data.ld_result.srclangs[0] != sourceLang && sourceLang != "auto") {

                        console.log("not source languge detected")

                        // document.getElementById("auto_source").checked = true;
                        // current_source = "auto";
                        var src_lang = json_data[8][0] //¤
                        console.log(src_lang)
                        // var src_lang = json_data[2]; //¤
                        // var src_lang = json_data.ld_result.srclangs[0]; //¤
                        // alert(src_lang)
                        langs.forEach((item, index) => { // langs is a general var from the languages.js
                            if (item.id == src_lang) {
                                document.getElementById('lang_detected_when_src_is_auto').innerHTML = "<span id='auto_mode' title='" + src_lang + "'>Source language detected (" + item.text + ") is not same as the one selected </span>";
                            }
                        });
                    }

                    // when auto is selected tell the user which source language was detected
                    var src_lang = json_data[2];
                    // var src_lang = json_data["src"];  //¤
                    if (sourceLang == "auto") {
                        // document.getElementById("nl_source").checked = true;
                        // current_source = "nl";
                        // alert(src_lang)
                        langs.forEach((item, index) => { // langs is a general var from the languages.js
                            if (item.id == src_lang) {
                                document.getElementById('lang_detected_when_src_is_auto').innerHTML = "<span id='auto_mode' title='" + src_lang + "'>Source language detected = " + item.text + "</span>";
                            }
                        });


                        // below works only if you use only 2 language otherwise 
                        // if (src_lang == "en") {
                        //     document.getElementById("en_source").checked = true;
                        //     current_source = "en";
                        //     document.getElementById("nl_target").checked = true;
                        //     current_target = "nl";
                        // }
                        // if (src_lang == "fr") {
                        //     document.getElementById("fr_source").checked = true;
                        //     current_source = "fr";
                        //     document.getElementById("nl_target").checked = true;
                        //     current_target = "nl";
                        // }

                    }

                    if (src_lang == "nl" && targetLang == "nl") {
                        // document.getElementById("nl_source").checked = true;
                        // current_source = "nl";
                        document.getElementById("en_target").checked = true;
                        //current_target = "en";  // ●
                        translate(); // because the default is NL, if src_lang is NL, then there is not translation done, so we need to triggered it once more
                    }
                    if (src_lang == "en" && targetLang == "en") {
                        // document.getElementById("nl_source").checked = true;
                        // current_source = "nl";
                        document.getElementById("nl_target").checked = true;
                        // current_target = "nl";  // ●
                        translate(); // because the default is NL, if src_lang is NL, then there is not translation done, so we need to triggered it once more
                    }




                    // # ...................................... ¤¤¤  add button TTS   (should be after sourceLang == "auto")  / do no use anymore the speechsynthesis because too slow but google.translate/tts
                    // var indexVoice = voices_index_per_languages[src_lang]
                    // if (!(typeof indexVoice === 'undefined' || indexVoice === null)) {
                    var speakorigine = document.getElementById('speakorigine');
                    speakorigine.style.display = "block";
                    speakorigine.removeEventListener('click', speakOrigine, false);
                    speakorigine.addEventListener('click', speakOrigine, false);
                    // }

                    // var indexVoice = voices_index_per_languages[targetLang]
                    // if (!(typeof indexVoice === 'undefined' || indexVoice === null)) {
                    var speaktranslate = document.getElementById('speaktranslate');
                    speaktranslate.style.display = "block";
                    speaktranslate.removeEventListener('click', speakTranslate, false);
                    speaktranslate.addEventListener('click', speakTranslate, false);
                    // } 


                    //# ...................................... ¤¤¤ if request didn't worked 
                }
                // else {
                //     console.log(http.readyState);
                //     console.log(http.status);
                //     console.log(http.responseText);
                // }
                else if (http.readyState == 4 & (http.status == 429 || http.status == 0)) {
                    // when request is blocked, status remain 0 but in dev console it's 429
                    var statusblocked = document.getElementById('statusblocked');
                    statusblocked.textContent = 'Google translate blocked the request because it detected too many request. Please try your request again later*. In the mean time you can use the Google translate link. (* waiting 4min is enough)';
                    setTimeout(function () {
                        statusblocked.textContent = '';
                    }, 10000);
                }


                var copyBothChecked = document.getElementById("copyBoth")
                if (copyBothChecked.checked == true) {
                    if (document.getElementById('textareaTarget').value != "" && document.getElementById('textareaTarget').value != "") {
                        copyBothToClipboard()
                    }
                }

            } // end of endreadystate

            http.open("GET", url);
            http.send(null); // null = no parameters

        } // end of  if else (source text too long)
        // direct link to googletranslate (needed for long text or error)
        var gototranslate = document.getElementById("gototranslate")
        gototranslate.innerHTML = '<a href="https://translate.google.com/#' + sourceLang + '/' + targetLang + '/' + sourceText + '" target="_blank">Google Translate</a> (direct link in case the source input is too long or the request is blocked or...).'
    } // end of  if source text isn't empty
}; // end of  translate() 