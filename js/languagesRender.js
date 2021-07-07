// # ------------------------------------------------------ ¤¤ LanguageRender: create the <radio> for language choice  
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

            // below works only if you use only 2 language otherwise 
            // var input_changed_id = event.target.id
            // if (input_changed_id == "en_source") {
            //     document.getElementById("nl_target").checked = true;
            //     current_target = "nl";
            // }
            // if (input_changed_id == "fr_source") {
            //     document.getElementById("nl_target").checked = true;
            //     current_target = "nl";
            // }
            // if (input_changed_id == "nl_source") {
            //     document.getElementById("en_target").checked = true;
            //     current_target = "en";
            // }


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
            var input_changed_id = event.target.id
            // if (input_changed_id == "en_target") {
            //     document.getElementById("fr_source").checked = true;
            //     current_source = "fr"
            // }
            // if (input_changed_id == "fr_target") {
            //     document.getElementById("en_source").checked = true;
            //     current_source = "en"
            // }

            langs.forEach((item, index) => {
                if (item.id + "_target" === event.target.id) {
                    if (!(Option_MainTargetLanguages.includes(langs[index].id))) {
                        if (Option_MainTargetLanguages[Option_MainTargetLanguages.length - 1].includes(" *")) {
                            Option_MainTargetLanguages[Option_MainTargetLanguages.length - 1] = item.id + " *";
                        } else {
                            Option_MainTargetLanguages.push(item.id + " *");
                        }
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