// # ============================================================== ¤ when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {


    // # ------------------------------------------------------ ¤¤ retrieve options from chrome.storage (or if there are no option set sourcedefault,targetdefault, sourceLang, targetLang)
    chrome.storage.sync.get({
        sourcedefault: "auto",
        targetdefault: "fr",
        sourceLang: ['fr', 'en', 'auto', 'es'],
        targetLang: ['fr', 'en', 'auto', 'es']
    }, function (data) {
        // # ------------------------------------------------------ ¤¤ when the options are retrieve
        var Option_MainSourceLanguages = data.sourceLang;
        var Option_MainTargetLanguages = data.targetLang;
        var current_source = data.sourcedefault;
        var current_target = data.targetdefault;

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
            if (selection != "") {
                document.getElementById("textareaSource").value = selection[0];
                translate();

            }
        });

        // # ------------------------------------------------------ ¤¤ when text is writen in textareaSource: trigger the translate on enter
        // source https://stackoverflow.com/questions/6524288/jquery-event-for-user-pressing-enter-in-a-textbox  : enter
        // source http://jsfiddle.net/arunpjohny/SZ9TG/1/  : via addEventListener
        var inputText = document.getElementById('textareaSource');
        inputText.addEventListener('keypress', function (e) {
            if (e.keyCode == 13) {
                // 13 = enter
                // alert("You pressed enter!");
                translate();
            }
        });


        // # ------------------------------------------------------ ¤¤ when state of radio button are changed, trigger translate
        // # ...................................... ¤¤¤ source
        var radiosource = document.getElementsByName("source");
        for (var i = 0; i < radiosource.length; i++) {
            radiosource[i].addEventListener('change', function () {
                // if (!(document.getElementById("textareaSource").value = "")) {
                translate();
                // }
            });
        }
        // # ...................................... ¤¤¤ target
        var radiotarget = document.getElementsByName("target");
        for (var i = 0; i < radiotarget.length; i++) {
            radiotarget[i].addEventListener('change', function () {
                // if (!(document.getElementById('textareaSource').value = "")) {
                translate();
                // }
            });
        }

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
        var menuTopNavSource = document.getElementById('topNavSource');
        menuTopNavSource.addEventListener('click', function (e) {
            var listothersLanguageSource = document.getElementById("listothersLanguageSource")
            if (listothersLanguageSource.style.display == "block") {
                listothersLanguageSource.style.display = "none";

            } else {
                listothersLanguageSource.style.top = menuTopNavSource.style.top
                listothersLanguageSource.style.display = "block";
            }
        }, false);

        // # ...................................... ¤¤¤ target
        var menuTopNavTarget = document.getElementById('topNavTarget');
        menuTopNavTarget.addEventListener('click', function (e) {
            var listothersLanguageTarget = document.getElementById("listothersLanguageTarget")
            if (listothersLanguageTarget.style.display == "block") {
                listothersLanguageTarget.style.display = "none";

            } else {
                listothersLanguageTarget.style.top = menuTopNavTarget.style.top
                listothersLanguageTarget.style.display = "block";
            }
        }, false);


        // # ------------------------------------------------------ ¤¤end "chrome.storage.sync"
    });



    // # ============================================================== ¤ end DOM loaded (document.addEventListener('DOMContentLoaded') )
}, false);

// # ============================================================== ¤ functions for popup

// # ------------------------------------------------------ ¤¤ create the <radio> for language choice
function languageRender(Option_MainSourceLanguages, Option_MainTargetLanguages, current_source, current_target) {

    // # ...................................... ¤¤¤ remove the * of "other languages"
    // when a language is added with the "other languages" button, a  * is added nxt to its ID so we know it doesn't come from "options" and should be replace the next time a language is added with the "other languages" button. 

    //copy the list so that when we modify the _temp, we don't modify the original
    Option_MainSourceLanguages_temp = Option_MainSourceLanguages.slice();
    Option_MainTargetLanguages_temp = Option_MainTargetLanguages.slice();

    // if the last item as a star, remove the star
    if (Option_MainSourceLanguages_temp[Option_MainSourceLanguages_temp.length - 1].includes(" *")) {
        Option_MainSourceLanguages_temp[Option_MainSourceLanguages_temp.length - 1] = Option_MainSourceLanguages_temp[Option_MainSourceLanguages_temp.length - 1].replace(" *", '')
    }

    if (Option_MainTargetLanguages_temp[Option_MainTargetLanguages_temp.length - 1].includes(" *")) {
        Option_MainTargetLanguages_temp[Option_MainTargetLanguages_temp.length - 1] = Option_MainTargetLanguages_temp[Option_MainTargetLanguages_temp.length - 1].replace(" *", '')
    }


    //  some needed var 
    let temp_mainLanguageSource = [];
    let othersLanguageSource = '';
    let temp_mainLanguageTarget = [];
    let othersLanguageTarget = '';
    // alert(langs);


    // # ...................................... ¤¤¤ Create chain of <radio> from languages.js : 
    // the order of the language is determined by the order in languages.json (currently = alphabetical). this order is okay for the othersLanguageSource but not for the Option_MainSourceLanguages. So we save them (step 1) in a temp list and then we will create the list of li for them in the correct order
    langs.forEach((item, index) => { // "langs" is a general var from the languages.js
        // # ...................................... ¤¤¤¤ source 
        if (Option_MainSourceLanguages_temp.includes(langs[index].id)) {
            //step 1
            temp_mainLanguageSource.push(langs[index])

        } else {
            // create list of <radio> for each language except the one in Main 
            othersLanguageSource += '<li>' +
                '<input type="radio" id="' + langs[index].id + '_source" name="source" value="' + langs[index].id + '_source" ' + (langs[index].id === current_source ? 'checked' : '') + '>' +
                '<label for="' + langs[index].id + '_source">' + langs[index].text + '</label>' +
                '</li>';
        }
        // # ............................   ¤¤¤¤ target
        if (Option_MainTargetLanguages_temp.includes(langs[index].id)) {
            temp_mainLanguageTarget.push(langs[index])

        } else {
            othersLanguageTarget += '<li>' +
                '<input type="radio" id="' + langs[index].id + '_target" name="target" value="' + langs[index].id + '_target" ' + (langs[index].id === current_target ? 'checked' : '') + '>' +
                '<label for="' + langs[index].id + '_target">' + langs[index].text + '</label>' +
                '</li>';
        }

    });

    // # ...................................... ¤¤¤¤ create list of <radio> for main 
    // # .................. ¤¤¤¤¤ source
    let mainLanguageSource = '';
    Option_MainSourceLanguages_temp.forEach((language_item, index_Option) => {
        temp_mainLanguageSource.forEach((temp_item, index) => {
            // alert(temp_item.id)
            if (temp_item.id == language_item) {
                // alert("matches")
                mainLanguageSource += '<li id =" ' + temp_mainLanguageSource[index].id + '_source">' +
                    '<input type="radio" id="' + temp_mainLanguageSource[index].id + '_source" name="source" value="' + temp_mainLanguageSource[index].id + '_source" ' + (temp_mainLanguageSource[index].id == current_source ? 'checked' : '') + '>' +
                    '<label for="' + temp_mainLanguageSource[index].id + '_source">' + temp_mainLanguageSource[index].text + '</label>' +
                    '</li>';
            }
        });
    });

    // # .................. ¤¤¤¤¤ target
    let mainLanguageTarget = '';
    Option_MainTargetLanguages_temp.forEach((language_item_target, index_Option) => {
        temp_mainLanguageTarget.forEach((temp_item_target, index) => {
            // alert(temp_item.id)
            if (temp_item_target.id == language_item_target) {
                // alert("matches")
                mainLanguageTarget += '<li id =" ' + temp_item_target.id + '_target">' +
                    '<input type="radio" id="' + temp_item_target.id + '_target" name="target" value="' + temp_item_target.id + '_target" ' + (temp_item_target.id == current_target ? 'checked' : '') + '>' +
                    '<label for="' + temp_item_target.id + '_target">' + temp_item_target.text + '</label>' +
                    '</li>';
            }
        });
    });

    // # ...................................... ¤¤¤ add list of <radio> to DOM 
    document.getElementById('listothersLanguageSource').innerHTML = othersLanguageSource;
    document.getElementById('mainLanguageSource').innerHTML = mainLanguageSource;
    document.getElementById('listothersLanguageTarget').innerHTML = othersLanguageTarget;
    document.getElementById('mainLanguageTarget').innerHTML = mainLanguageTarget;






    // # ...................................... ¤¤¤ add event listeners on <radio> 
    // when the radio are change: 
    //  - if the clicked item isn't in the top, and another language * was already added to the top : replace it; otherwise append it
    // - set the chosen language as "current"
    // - hide display of others languages

    // # ............................   ¤¤¤¤ source
    document.querySelectorAll('[name="source"]').forEach(function (input) {
        input.addEventListener('change', function (event) {
            // alert("source  change")
            // let position;

            langs.forEach((item, index) => {
                if (item.id + "_source" === event.target.id) {
                    // if the clicked item isn't in the top = in "Option_MainSourceLanguages"
                    if (!(Option_MainSourceLanguages.includes(langs[index].id))) {
                        if (Option_MainSourceLanguages[Option_MainSourceLanguages.length - 1].includes(" *")) {
                            //if another language was already added to the top : replace it; otherwise append it
                            Option_MainSourceLanguages[Option_MainSourceLanguages.length - 1] = item.id + " *";
                        } else {
                            Option_MainSourceLanguages.push(item.id + " *");
                        }
                    }
                    // set the chosen language as "current"
                    current_source = item.id;
                }
            });

            // hide display of others languages
            listothersLanguageSource.style.display = "none";
            languageRender(Option_MainSourceLanguages, Option_MainTargetLanguages, current_source, current_target);
            translate();
        });
    });



    // # ............................   ¤¤¤¤ target
    document.querySelectorAll('[name="target"]').forEach(function (input) {
        input.addEventListener('change', function (event) {
            // alert("source  change")

            langs.forEach((item, index) => {
                if (item.id + "_target" === event.target.id) {
                    if (Option_MainTargetLanguages[Option_MainTargetLanguages.length - 1].includes(" *")) {
                        Option_MainTargetLanguages[Option_MainTargetLanguages.length - 1] = item.id + " *";
                    } else {

                        Option_MainTargetLanguages.push(item.id + " *");
                    }
                    current_target = item.id;
                }
            });

            listothersLanguageTarget.style.display = "none";
            languageRender(Option_MainSourceLanguages, Option_MainTargetLanguages, current_source, current_target);
            translate();
        });
    });
}



// # ------------------------------------------------------ ¤¤  translate (called by button)
function translate() {
    var sourceTextoriginal = document.getElementById('textareaSource').value;


    // if source text isn't empty
    if (!(sourceTextoriginal == "")) {

        //format source text because google translate stop at "."  and line break %0A so we need to replace them
        sourceText = sourceTextoriginal.replace(/(\r\n|\n|\r|\\n)/gm, '~'); // replace line break 
        sourceText = sourceText.replace(/\./g, "¤"); // replace "."
        // alert(sourceText)
        // retrieve language source/target
        var sourceLang = document.querySelector('input[name="source"]:checked').value.replace('_source', '');
        var targetLang = document.querySelector('input[name="target"]:checked').value.replace('_target', '');

        // #......................................¤¤¤ ★ google API
        var url = "https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=" +
            sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText) + "&ie=UTF-8&oe=UTF-8";
        var http = new XMLHttpRequest();


        // when readyState change this function is called 
        // readyState = 0 = UNSENT  / 1	OPENED	/ 2	HEADERS_RECEIVED / 3	LOADING	/ 4	DONE
        http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
                // retrieve translation 
                // alert(JSON.parse(http.responseText)[0][0][0]); //●
                var translated = JSON.parse(http.responseText)["sentences"][0]["trans"]; // for clients5.google.com and translate.google.com
                // var translated = JSON.parse(http.responseText)[0][0][0]; // for translate.googleapis.com

                translated = translated.replace(/~/g, "\n");
                translated = translated.replace(/¤/g, ".");

                // add translated to input 
                var textareaTarget = document.getElementById('textareaTarget');
                textareaTarget.value = translated

            } else if (http.readyState == 4 & (http.status == 429 || http.status == 0)) {
                // when request is blocked, status remain 0 but in dev console it's 429
                var statusblocked = document.getElementById('statusblocked');
                statusblocked.textContent = 'Google translate blocked the request because it detected too many request. Please try your request again later. In the mean time you can use this Google translate:';
                setTimeout(function () {
                    statusblocked.textContent = '';
                }, 10000);
            }
            if (sourceText.length > 240) {
                var statustoolong = document.getElementById('statustoolong');
                statustoolong.textContent = 'Source text is too long, you can get the full translation here:';
                setTimeout(function () {
                    statustoolong.textContent = '';
                }, 10000);
            }


        }

        http.open("GET", url);
        http.send(null); // null = no parameters



        var gototranslate = document.getElementById("gototranslate")
        gototranslate.innerHTML = '<a href="https://translate.google.com/#' + sourceLang + '/' + targetLang + '/' + sourceTextoriginal + '" target="_blank">Google Translate</a> (direct link in case the source input is too long or the request is blocked or...).'
    }
};


// # ------------------------------------------------------ ¤¤ copy clipboard 

// add copy to clipboard
// https://github.com/artemave/translate_onhover/blob/a0f365539268f0750df81466f4508ba911e579e6/contentscript.js
function copyToClipboard() {
    var translated = document.getElementById("textareaTarget");
    translated.select()
    document.execCommand('copy')
    document.body.removeChild(input)
}


// # ------------------------------------------------------ ¤¤ resetoptions
function resetoptions() {

    chrome.storage.sync.set({
        sourcedefault: "auto",
        targetdefault: "fr",
        sourceLang: ['fr', 'en', 'auto'],
        targetLang: ['fr', 'en']
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
        targetdefault: "fr",
        sourceLang: ['fr', 'en', 'auto'],
        targetLang: ['fr', 'en']
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
        sourceLang.push("none") // this add another "empty" select to add another language
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
        targetLang.push("none")
        targetLang.forEach((lang, index) => {
            let values = generateListOptionLanguageforSelect(lang, data.targetdefault, false)

            // step  1)
            let list_languages_as_options = values[0]
            html_for_mainLanguagesTarget += '<tr><td><select class="mainLanguagesTarget_select" id = "mainLanguagesTarget_' + index + '">' + list_languages_as_options + '</select> </td></tr>'

            // step  2)
            html_for_defaultLanguageTarget += values[1]

        });


        // # ...................................... ¤¤¤ add the main language tables to DOM 
        //  create the tables for choosing the main source/target languages from the succession of row/select created above and add the tables to the DOM 

        document.getElementById('mainLanguagesSource').innerHTML = '<table id="table_mainLanguagesSource"><tr><th width="70%" style="text-align:left;">Set Top Source Languages:</th></tr>' + html_for_mainLanguagesSource + '</table>';
        document.getElementById('mainLanguagesTarget').innerHTML = '<table id="table_mainLanguagesTarget"><tr><th width="70%" style="text-align:left;">Set Top Target Languages:</th></tr>' + html_for_mainLanguagesTarget + '</table>';

        // # ...................................... ¤¤¤ add the default language select to DOM
        // create the selects for choosing the default source/target language from the options created above and add the tables to the DOM 
        document.getElementById('defaultLanguageSource').innerHTML = 'Select default source language: <select id = "defaultLanguageSource_select">' + html_for_defaultLanguageSource + '</select>'
        document.getElementById('defaultLanguageTarget').innerHTML = 'Select default target language: <select id = "defaultLanguageTarget_select">' + html_for_defaultLanguageTarget + '</select>'



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




// # ============================================================== ¤ end "setoptions"

// # ============================================================== ¤ functions for "setoptions"

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

// # ------------------------------------------------------ ¤¤ retrieve the chosen language in all the <select> main language
// # ...................................... ¤¤¤ source
function getSelectionMainSourceLang() {
    let sourceLang = []
    let number_mainLanguagesSource = document.getElementById("table_mainLanguagesSource").getElementsByTagName("tr").length;
    for (i = 0; i < number_mainLanguagesSource - 1; i++) {
        var id = 'mainLanguagesSource_' + i;
        var langChoise = document.getElementById(id).value;
        if (langChoise != "none") {
            // if value = none = ignore 
            sourceLang.push(document.getElementById(id).value);
        }
        // set background to white (when save + duplicates, the duplicated language becomes red - when, the select are change, the red will be removed )
        document.getElementById(id).style.background = "";
    }
    return sourceLang
}

// # ...................................... ¤¤¤ target   
function getSelectionMainTargetLang() {
    let targetLang = []
    let number_mainLanguagesTarget = document.getElementById("table_mainLanguagesTarget").getElementsByTagName("tr").length;
    for (j = 0; j < number_mainLanguagesTarget - 1; j++) {
        var id = 'mainLanguagesTarget_' + j;
        var langChoise = document.getElementById(id).value;
        if (langChoise != "none") {
            targetLang.push(document.getElementById(id).value);
        }
        document.getElementById(id).style.background = "";

    }
    return targetLang
}
// # ------------------------------------------------------ ¤¤ generate <option> from languages.js for the <select>
//  - this function return a list: 
// [0] = chain of options, on for each languages in languages.js 
// [1] a single option for the the select of default language
// arguments: add_auto = true or false : should the langauge "auto" be added in the chain of option (source language = true ; target language = false)
function generateListOptionLanguageforSelect(lang, default_lang, add_auto) {

    let list_languages_as_options = '<option value="none">None</option>';
    let default_input = ""
    langs.forEach((item, index) => { // langs is a general var from the languages.js

        if (item.id != "auto" || (item.id == "auto" & add_auto == true)) {
            // create the options to add new top language
            list_languages_as_options += '<option value="' + item.id + '"' + (item.id === lang ? ' selected' : '') + '>' + item.text + '</option>'
        }
        // create the option for the default language
        if (item.id == lang & lang != "none") {
            default_input = '<option value="' + item.id + '"' + (item.id === default_lang ? ' selected' : '') + '>' + item.text + '</option>'
        }
    });
    return [list_languages_as_options, default_input]
}



// # ============================================================== ¤  source




// # ------------------------------------------------------ ¤¤  ressource for js



// how to make XMLHttpRequest with argument  https://stackoverflow.com/a/12676773/3154274

//how to get selected text:
// https://github.com/savdb/Get-selected-text/blob/master/content_script.js


// how to make a chrome  extension: https://www.sitepoint.com/create-chrome-extension-10-minutes-flat/



// # ------------------------------------------------------ ¤¤ ressource for translate api

// test in a table beause 18 ≠ cases

// address used in github project (cf below)
//  https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=father&ie=UTF-8&oe=UTF-8  - alternative Google Translate API that is free and is internally used by the Google Translate service in Chromium
// https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=en&tl=fr&dt=t&q=father
// https://translate.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=fr&dt=t&q=father
// https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=fr&dt=t&q=father


// there are 3 base url:
// https: //translate.googleapis.com/translate_a/   return a simple json retrieved by JSON.parse(http.responseText)[0][0][0]
//     https: //translate.google.com/translate_a/   full  json 
//     https: //clients5.google.com/translate_a/  full  json 


// then 2 first world after /
// single? 
// t?

// gtx  : gtx = blocked by IP  when using with clients5/t or translate.google.com/t  or translate.googleapis.com/t  but work with  translate.googleapis.com/single
// t  : google returns a non-standard JSON array  - doesn't work with clients5
// dict-chrome-ex


// to handle accent, should add &ie=UTF-8&oe=UTF-8





//  https://ctrlq.org/code/19909-google-translate-api
// "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" 
//             + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);
// blocked after a couple of try (maybe 100) - reset public IP (go to 192.168.1.1 > assitance> restart livebox - worked)






// https://github.com/matheuss/google-translate-api/blob/777d7db94f82ec402e7758af1549818c07d55747/index.js
// var url = 'https://translate.google.com/translate_a/single';
// var data = {
//     client: 't',
//     sl: opts.from,
//     tl: opts.to,
//     hl: opts.to,
//     dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
//     ie: 'UTF-8',
//     oe: 'UTF-8',
//     otf: 1,
//     ssel: 0,
//     tsel: 0,
//     kc: 7,
//     q: text
// };
// data[token.name] = token.value;



// https://gist.github.com/steelywing/9343245
//     method: "GET",
//     // url: "https://clients5.google.com/translate_a/t?" +
//     url: "https://translate.google.com/translate_a/t?" +
//         $.param({
//             // if using { client: 't' }, google will return a non-standard JSON array
//             client: 'dict-chrome-ex',
//             sl: GM_getValue('sl') || 'auto',
//             tl: GM_getValue('tl') || 'auto',
//             q: text
//         }),
//         json = JSON.parse(response.responseText);


// http://jsfiddle.net/maxim75/H3Wkr/ 
// <div class="translate">Тестирование</p>
// <div class="translate_control" lang="en"></div>

// <script>
// function googleSectionalElementInit() {
//   new google.translate.SectionalElement({
//     sectionalNodeClassName: 'translate',
//     controlNodeClassName: 'translate_control',
//     background: '#f4fa58'
//   }, 'google_sectional_element');
// }
// </script>
// <script src="//translate.google.com/translate_a/element.js?cb=googleSectionalElementInit&ug=section&hl=en"></script>


// // https://github.com/artemave/translate_onhover/blob/4b8b25a0d6b64b9094fbff5a043547c76bd29037/background.js
// extension working on chrome store  : use background.js
// function translate(word, sl, tl, last_translation, onresponse, sendResponse, ga_event_name) {
//     const options = {
//         url: 'https://clients5.google.com/translate_a/t?client=dict-chrome-ex',
//         data: {
//             q: word,
//             sl: sl,
//             tl: tl,
//         },
//         dataType: 'json',
//         success: function on_success(data) {
//             onresponse(data, word, tl, last_translation, sendResponse, ga_event_name)
//         },
//         error: function (xhr, status, e) {
//             console.log({
//                 e: e,
//                 xhr: xhr
//             })
//         }
//     }

//     $.ajax(options)
// }
// ...
// ...
// function on_translation_response(data, word, tl, last_translation, sendResponse, ga_event_name) {
//     let output
//     const translation = {tl: tl}

//     console.log('raw_translation: ', data)

//     if ((!data.dict && !data.sentences) || (!data.dict && translationIsTheSameAsInput(data.sentences, word))) {
//       translation.succeeded = false

//       if (Options.do_not_show_oops()) {
//         output = ''
//       } else {
//         output = 'Oops.. No translation found.'
//       }
//     } else {
//       translation.succeeded = true
//       translation.word = word

//       output = []
//       if (data.dict) { // full translation
//         data.dict.forEach(function(t) {
//           output.push({pos: t.pos, meanings: t.terms})
//         })
//       } else { // single word or sentence(s)
//         data.sentences.forEach(function(s) {
//           output.push(s.trans)
//         })
//         output = output.join(' ')
//       }

//       translation.sl = data.src
//     }

//     if (!( output instanceof String)) {
//       output = JSON.stringify(output)
//     }

//     translation.translation = output

//     $.extend(last_translation, translation)

//     _gaq.push(['_trackEvent', ga_event_name, translation.sl, translation.tl])

//     console.log('response: ', translation)
//     sendResponse(translation)
//   }