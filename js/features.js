// # ============================================================== ¤ functions for "setoptions"



function scrollUp() {
    console.log("scrollup")
    window.scrollTo(
        document.getElementById("textareaSource").scrollTop -= 50,
        document.getElementById("textareaTarget").scrollTop -= 50
    );
}

function scrollDown() {
    console.log("scrolldown")
    window.scrollTo(
        document.getElementById("textareaSource").scrollTop += 50,
        document.getElementById("textareaTarget").scrollTop += 50
    );
}



function expandTextArea() {
    var textareaSource = document.getElementById('textareaSource');
    textareaSource.style.height = textareaSource.scrollHeight + 'px';
    // textareaSource.style.height = "320px";
    var textareaTarget = document.getElementById('textareaTarget');
    textareaTarget.style.height = textareaTarget.scrollHeight + 'px';
    // textareaTarget.style.height = "320px";

}


// # ------------------------------------------------------ ¤¤ display json
function displayjson() {
    var datapreview = document.getElementById("datapreview");
    var buttonseedata = document.getElementById('seedata');

    if (datapreview.style.display == "block") {
        datapreview.style.display = "none";
        buttonseedata.innerText = "See json";
        // datapreview.innerHTML = '';
    } else {
        datapreview.style.display = "block";
        buttonseedata.innerText = "Close json";
    }
}


function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // console.log("json")
    // console.log(json)
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}


function reverseTranslation() {

    var translated = document.getElementById("textareaTarget").value;
    var orig = document.getElementById("textareaSource").value;

    document.getElementById("textareaTarget").value = orig;
    document.getElementById("textareaSource").value = translated;

    console.log('here')
    if (document.querySelector('input[name="source"]:checked').value != "auto_source") {
        console.log("not auto")
        var sourceLang_as_target = document.querySelector('input[name="source"]:checked').value.replace('_source', '') + '_target';
        var targetLang_as_source = document.querySelector('input[name="target"]:checked').value.replace('_target', '') + '_source';
        document.getElementById(sourceLang_as_target).checked = true;
        document.getElementById(targetLang_as_source).checked = true;
    }
    // else {

    //     var auto_lang_as_target = document.getElementById("auto_mode").title + '_target'
    //     var targetLang_as_source = document.querySelector('input[name="target"]:checked').value.replace('_target', '') + '_source';
    //     document.getElementById(auto_lang).checked = true;
    //     document.getElementById(targetLang_as_source).checked = true;
    //     translate();
    //     // current_target = "en";

    // }
}


// # ------------------------------------------------------ ¤¤ copy clipboard 

// add copy to clipboard
// https://github.com/artemave/translate_onhover/blob/a0f365539268f0750df81466f4508ba911e579e6/contentscript.js
function copyToClipboard() {
    var translated = document.getElementById("textareaTarget");
    // alert(translated.value)
    if (translated.value != "") {
        translated.select()
        document.execCommand('copy')

        // add a message 
        var copiedtoclipboard = document.getElementById("copiedtoclipboard")

        copiedtoclipboard.textContent = "Target translation copied to clipboard";
        setTimeout(function () {
            copiedtoclipboard.textContent = '';
        }, 3000);
    }

}



// add copy BOTH to clipboard
// https://github.com/artemave/translate_onhover/blob/a0f365539268f0750df81466f4508ba911e579e6/contentscript.js
function copyBothToClipboard() {

    // console.log("copyBothToClipboard")
    //get text
    var translate_textarea = document.getElementById("textareaTarget");
    var orig_textarea = document.getElementById("textareaSource");
    var translate_textarea_focus = translate_textarea.matches(":focus");
    var orig_textarea_focus = orig_textarea.matches(":focus");

    var translated = translate_textarea.value;
    var orig = orig_textarea.value;


    //modif to improve memrise  auto-accept answer : convert first letter to lowercase, remove leading/trailing white space, remove last punctuation
    var orig_trimed = orig.trim()
    var translated_trimed = translated.trim()

    var orig_trimed_Lowercase = orig_trimed.charAt(0).toLowerCase() + orig_trimed.slice(1);
    var translated_trimed_Lowercase = translated_trimed.charAt(0).toLowerCase() + translated_trimed.slice(1);


    var orig_lastchar = orig_trimed_Lowercase.slice(orig_trimed_Lowercase.length - 1)
    if ([".", ","].includes(orig_lastchar)) {
        var orig_final = orig_trimed_Lowercase.slice(0, -1)
    } else {
        var orig_final = orig_trimed_Lowercase
    }

    var translated_lastchar = translated_trimed_Lowercase.slice(translated_trimed_Lowercase.length - 1)
    if ([".", ","].includes(translated_lastchar)) {
        var trans_final = translated_trimed_Lowercase.slice(0, -1)
    } else {
        var trans_final = translated_trimed_Lowercase
    }


    // set text to an textarea to be able to copy it 
    var hiddencopy = document.getElementById("hiddencopy")
    hiddencopy.value = orig_final + "\t" + trans_final
    console.log(hiddencopy.value)
    hiddencopy.select()
    document.execCommand('copy')

    // add a message 
    var copiedtoclipboard = document.getElementById("copiedtoclipboard")
    copiedtoclipboard.textContent = "Target translation copied to clipboard";
    setTimeout(function () {
        copiedtoclipboard.textContent = '';
    }, 3000);

    // add the focus on the textarea thta add it before
    if (translate_textarea_focus) {
        translate_textarea.focus();
    } else if (orig_textarea_focus) {
        orig_textarea.focus();
        // textareaSource_div.setSelectionRange(element.value.length, element.value.length);
    }

}

// # ------------------------------------------------------ ¤¤ resetoptions
function resetoptions() {

    chrome.storage.sync.get({
        sourcedefault: "auto",
        targetdefault: "nl",
        sourceLang: ['en', 'nl', 'fr', 'auto'],
        targetLang: ['en', 'nl', 'fr'],
        copyBothchecked: false
    }, function (data) {
        location.reload();
    });

}




// # ============================================================== ¤ Options : setoptions
function setoptions() {


    //  for debug : check langs and reset options
    // alert("langs: " + langs);  // is the langs var from languages.js loaded?

    // variables needed 
    let html_for_mainLanguagesSource = "";
    let html_for_mainLanguagesTarget = "";
    let html_for_defaultLanguageSource = "";
    let html_for_defaultLanguageTarget = "";




    // # ------------------------------------------------------ ¤¤ retrieve options from chrome.storage or set them is there aren't any default
    chrome.storage.sync.get({
        sourcedefault: "auto",
        targetdefault: "nl",
        sourceLang: ['en', 'nl', 'fr', 'auto'],
        targetLang: ['en', 'nl', 'fr'],
        copyBothchecked: false
    }, function (data) {

        // # ------------------------------------------------------ ¤¤ when the options are retrieve/set. 
        // # ...................................... ¤¤¤ create <select> for main languages and <option> for default  language
        // A)create a succession of rows for the table for choising  the main  source language  : 
        // - each row is a drop down created with a <select> tag and each option is a language from the languages.js
        // - for each language from option  (data.sourceLang) we create a select. We add a "none"  select to easily add other language
        // - the table will be created below

        // B) create <option> for the select for choosing the default source language  : the select will be created below

        // # ............................   ¤¤¤¤ source
        var sourceLang = data.sourceLang;
        sourceLang.forEach((lang, index) => {
            let values = generateListOptionLanguageforSelect(lang, data.sourcedefault, true)
            // generateListOptionLanguageforSelect return :
            // step 1) a string of <option> one for each language in languages.js to create a select for choosing the main language - the option selected is the language from sourceLang
            // step 2) a <option> with the sourceLand to create the select for choosing default language
            // -  option True means that we keep the "Auto" language (needed for source but not target)

            // step  1)
            let list_languages_as_options = values[0]
            html_for_mainLanguagesSource += '<tr><td><select class="mainLanguagesSource_select" id = "mainLanguagesSource_' + index + '" >' + list_languages_as_options + '</select></td></tr>'

            // step 2)
            html_for_defaultLanguageSource += values[1]
        });


        // # ............................   ¤¤¤¤ target   
        var targetLang = data.targetLang;
        targetLang.forEach((lang, index) => {
            let values = generateListOptionLanguageforSelect(lang, data.targetdefault, false)

            // step  1)
            let list_languages_as_options = values[0]
            html_for_mainLanguagesTarget += '<tr><td><select class="mainLanguagesTarget_select" id = "mainLanguagesTarget_' + index + '">' + list_languages_as_options + '</select> </td></tr>'

            // step  2)
            html_for_defaultLanguageTarget += values[1]

        });


        // # ...................................... ¤¤¤ add the table for setting the options: 
        // # ............................   ¤¤¤¤ for top language optiotn
        //  create the tables for choosing the main source/target languages from the succession of row/select created above and add the tables to the DOM 

        document.getElementById('options_mainLanguagesSource').innerHTML = '<table id="table_mainLanguagesSource"><tr><th width="70%" style="text-align:left;">Set Top Source Languages:</th></tr>' + html_for_mainLanguagesSource + '</table>';
        document.getElementById('options_mainLanguagesTarget').innerHTML = '<table id="table_mainLanguagesTarget"><tr><th width="70%" style="text-align:left;">Set Top Target Languages:</th></tr>' + html_for_mainLanguagesTarget + '</table>';

        // # ............................   ¤¤¤¤ for  default language
        // create the selects for choosing the default source/target language from the options created above and add the tables to the DOM 
        document.getElementById('options_defaultLanguageSource').innerHTML = 'Select default source language: <select id = "defaultLanguageSource_select">' + html_for_defaultLanguageSource + '</select>'
        document.getElementById('options_defaultLanguageTarget').innerHTML = 'Select default target language: <select id = "defaultLanguageTarget_select">' + html_for_defaultLanguageTarget + '</select>'



        // # ...................................... ¤¤¤ when main language select are changed, update default select
        // addEventListener so when the select for choosing main language are change the  list of default is updated

        // # ............................   ¤¤¤¤ source
        document.querySelectorAll('.mainLanguagesSource_select').forEach(function (select) {
            select.addEventListener("change", function () {

                // retrieve the language choosen in the select for main source language
                var currentSelectionSource = getSelectionMainSourceLang();
                var html_for_defaultLanguageSource = "";

                // create <option> for each retrieved language 
                currentSelectionSource.forEach((lang, index) => {
                    let values = generateListOptionLanguageforSelect(lang, data.sourcedefault, true)
                    html_for_defaultLanguageSource += values[1]
                });
                // create the selects for choosing the default source/target language from the options created above and add the tables to the DOM 
                document.getElementById('defaultLanguageSource').innerHTML = 'Select default source language: <select id = "defaultLanguageSource_select">' + html_for_defaultLanguageSource + '</select>'


            });
        });

        //   # ............................   ¤¤¤¤ target
        document.querySelectorAll('.mainLanguagesTarget_select').forEach(function (select) {
            select.addEventListener("change", function () {
                var currentSelectionTarget = getSelectionMainTargetLang();
                var html_for_defaultLanguageTarget = "";

                currentSelectionTarget.forEach((lang, index) => {
                    let values = generateListOptionLanguageforSelect(lang, data.targetdefault, false)
                    html_for_defaultLanguageTarget += values[1]
                });

                document.getElementById('defaultLanguageTarget').innerHTML = 'Select default target language: <select id = "defaultLanguageTarget_select">' + html_for_defaultLanguageTarget + '</select>'
            });

        });


        //# ...................................... ¤¤¤ when save button clicked, run save_options
        document.getElementById('save').addEventListener('click',
            save_options);


        // # ...................................... ¤¤¤ when addnew_language button is clicked, add append a  select in main language table
        // ddEventListener when the button addnew_language is click, add a new row in the table for chooisng the main language 
        // step 1) get the actual number of row in the table,  add a new row, add a new select in this row 
        // step 2) add an addEventListener to update the list default when change and the select is changed


        // # ............................   ¤¤¤¤ source 
        document.getElementById('addnewsourcelanguage').addEventListener('click',
            function () {

                // step 1)
                let index = document.getElementById("table_mainLanguagesSource").getElementsByTagName("tr").length - 1;
                var table = document.getElementById("table_mainLanguagesSource").getElementsByTagName('tbody')[0];
                var row = table.insertRow(-1);
                var cell1 = row.insertCell(0);
                let values = generateListOptionLanguageforSelect("none", data.sourcedefault, true);
                cell1.innerHTML = '<select class="mainLanguagesSource_select" id = "mainLanguagesSource_' + index + '" >' + values[0] + '</select>';


                // step 2)
                document.querySelectorAll('.mainLanguagesSource_select').forEach(function (select) {
                    select.addEventListener("change", function () {
                        var currentSelectionSource = getSelectionMainSourceLang();
                        var html_for_defaultLanguageSource = "";

                        currentSelectionSource.forEach((lang, index) => {
                            let values = generateListOptionLanguageforSelect(lang, data.sourcedefault, true)
                            html_for_defaultLanguageSource += values[1]
                        });

                        document.getElementById('defaultLanguageSource').innerHTML = 'Select default source language: <select id = "defaultLanguageSource_select">' + html_for_defaultLanguageSource + '</select>'
                    });
                });


            });

        // # ............................   ¤¤¤¤ target 
        document.getElementById('addnewtargetlanguage').addEventListener('click',
            function () {

                //step 1)
                let index = document.getElementById("table_mainLanguagesTarget").getElementsByTagName("tr").length - 1;
                var table = document.getElementById("table_mainLanguagesTarget").getElementsByTagName('tbody')[0];
                var row = table.insertRow(-1);
                var cell1 = row.insertCell(0);
                let values = generateListOptionLanguageforSelect("none", data.targetdefault, false);
                cell1.innerHTML = '<select class="mainLanguagesTarget_select" id = "mainLanguagesTarget_' + index + '" >' + values[0] + '</select>';


                //step 2)
                document.querySelectorAll('.mainLanguagesTarget_select').forEach(function (select) {
                    select.addEventListener("change", function () {
                        var currentSelectionTarget = getSelectionMainTargetLang();
                        var html_for_defaultLanguageTarget = "";


                        currentSelectionTarget.forEach((lang, index) => {
                            let values = generateListOptionLanguageforSelect(lang, data.targetdefault, false)
                            html_for_defaultLanguageTarget += values[1]
                        });

                        document.getElementById('defaultLanguageTarget').innerHTML = 'Select default target language: <select id = "defaultLanguageTarget_select">' + html_for_defaultLanguageTarget + '</select>'
                    });
                });


            });


    });
    // # ------------------------------------------------------ ¤¤ end "when options are retrieve/set (chrome.storage.sync.get)"



}


// # ------------------------------------------------------ ¤¤ save option (called by button )
function save_options() {

    // # ...................................... ¤¤¤ retrieve choice of users and format then (remove language "none")

    var sourcedefault = document.getElementById("defaultLanguageSource_select").value;
    var targetdefault = document.getElementById("defaultLanguageTarget_select").value;
    var sourceLang = getSelectionMainSourceLang();
    var targetLang = getSelectionMainTargetLang();


    var duplicatesSource = sourceLang.reduce(function (acc, el, i, arr) {
        if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el);
        return acc;
    }, []);

    var duplicatesTarget = targetLang.reduce(function (acc, el, i, arr) {
        if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el);
        return acc;
    }, []);

    // # ...................................... ¤¤¤ check condition for saving options 
    // - the default language can't be none
    // - there should be at least 1 source/target language
    // - if there is duplicate languages : add a red background
    //
    var statussave = document.getElementById('statussave');
    statussave.textContent = "clicked"
    // if one of the default is None
    if (sourcedefault == "none" || targetdefault == "none") {
        statussave.textContent = "Default language can't be none";
    } else if (sourceLang.length == 0) {
        statussave.textContent = "You need to select least one source language";
    } else if (targetLang.length == 0) {
        statussave.textContent = "You need to select least one target language";
    } else if (duplicatesSource.length !== 0 || duplicatesTarget.length !== 0) {

        // if there are duplicates: run through each of the row in table and set the duplicated language background to red
        // source
        let number_mainLanguagesSource = document.getElementById("table_mainLanguagesSource").getElementsByTagName("tr").length;
        for (i = 0; i < number_mainLanguagesSource - 1; i++) {
            var id = 'mainLanguagesSource_' + i;
            var langChoise = document.getElementById(id).value;
            if (duplicatesSource.includes(langChoise)) {
                document.getElementById(id).style.background = "red"
            }
        }

        // target
        let number_mainLanguagesTarget = document.getElementById("table_mainLanguagesTarget").getElementsByTagName("tr").length;
        for (i = 0; i < number_mainLanguagesTarget - 1; i++) {
            var id = 'mainLanguagesTarget_' + i;
            var langChoise = document.getElementById(id).value;
            if (duplicatesTarget.includes(langChoise)) {
                document.getElementById(id).style.background = "red"
            }
        }

        // add a message 
        statussave.textContent = "You can't have the same language multiple times";
        setTimeout(function () {
            statussave.textContent = '';
        }, 3000);


    } else {
        // save the chosen options
        chrome.storage.sync.set({
            sourcedefault: sourcedefault,
            targetdefault: targetdefault,
            sourceLang: sourceLang,
            targetLang: targetLang
        }, function () {

            // Update status to let user know options were saved. Message will disapear after 700ms. Then relaod page to update the options
            statussave.textContent = 'Options saved.';
            setTimeout(function () {
                statussave.textContent = '';
                location.reload();
            }, 700);
        });

    }


}