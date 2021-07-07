// # ============================================================== ¤ functions for popup
// https://github.com/EdgeTranslate/EdgeTranslate   (display.js + background.js)
// C:\Program Portable\Browser local extension\EdgeTranslate_v2.1.  3_chrome\content\display\display.js
// C:\Program Portable\Browser local extension\EdgeTranslate_v2.1.3_chrome\background\background.js
// https://github.com/EdgeTranslate/EdgeTranslate/blob/7845d56bfb7b5278f675e34c1641c8616fd30b2e/src/background/library/translators/google.js
// # ------------------------------------------------------ ¤¤ parse result

function parseResult(e) {
    // console.log("parse")
    // console.log(e)
    let t = new Object;
    for (let r = 0; r < e.length; r++)
        if (e[r]) {
            let a = e[r];
            switch (r) {
                case 0: {
                    let e = [],
                        r = [],
                        n = a.length - 1;
                    for (let t = 0; t <= n; t++) e.push(a[t][0]), r.push(a[t][1]);
                    t.mainMeaning = e.join(""), t.originalText = r.join("");
                    try {
                        n > 0 && (a[n][2] && a[n][2].length > 0 && (t.tPronunciation = a[n][2]), a[n][3] && a[n][3].length > 0 && (t.sPronunciation = a[n][3]))
                    } catch (e) {
                        Object(h.c)(e)
                    }
                    break
                }
                case 1:
                    t.AlternativeTranslations = new Array, a.forEach(e =>
                        t.AlternativeTranslations.push({
                            pos: e[0],
                            meaning: e[1].join(", ")
                        }));
                    t.reverseTranslation = new Array, a.forEach(e => {
                        e[2].forEach(r => {
                            // console.log(r[0])
                            t.reverseTranslation.push({
                                translation: r[0],
                                reverseTranslationmeaning: r[1].join(", ")
                            })
                        })
                    });
                    break;
                case 2:
                    t.from = a;
                    break;
                case 11:
                    // console.log("11", a)
                    t.AlternativeOriginal = new Array, a.forEach(e => {
                        e[1].forEach(r => {
                            // console.log(r[0])
                            t.AlternativeOriginal.push({
                                pos: e[0],
                                meaning: r[0].join(", ")
                            })
                        })
                    });

                    break;
                case 12:
                    t.definitions = new Array, a.forEach(e => {
                        e[1].forEach(r => {
                            t.definitions.push({
                                pos: e[0],
                                meaning: r[0],
                                example: r[2]
                            })
                        })
                    });
                    break;
                case 13:
                    t.examples = new Array, a.forEach(e => e.forEach(e => t.examples.push({
                        source: null,
                        target: e[0]
                    })))
            }
        } return t
}

// should be improve with this new function (⚠ this one it the original one, should be update with the adittional case and parseing done above )
// function parseResult(response) {
//     let result = new Object();
//     for (let i = 0; i < response.length; i++) {
//         if (response[i]) {
//             let items = response[i];
//             switch (i) {
//                 case 0: {
//                     let mainMeanings = [];
//                     let originalTexts = [];
//                     let lastIndex = items.length - 1;

//                     for (let j = 0; j <= lastIndex; j++) {
//                         mainMeanings.push(items[j][0]);
//                         originalTexts.push(items[j][1]);
//                     }

//                     result.mainMeaning = mainMeanings.join("");
//                     result.originalText = originalTexts.join("");
//                     try {
//                         if (lastIndex > 0) {
//                             if (items[lastIndex][2] && items[lastIndex][2].length > 0) {
//                                 result.tPronunciation = items[lastIndex][2];
//                             }

//                             if (items[lastIndex][3] && items[lastIndex][3].length > 0) {
//                                 result.sPronunciation = items[lastIndex][3];
//                             }
//                         }
//                     } catch (error) {
//                         log(error);
//                     }
//                     // log("text: " + result.originalText + "\nmeaning: " + result.mainMeaning);
//                     break;
//                 }
//                 // 单词的所有词性及对应的意思
//                 case 1:
//                     result.detailedMeanings = new Array();
//                     items.forEach((item) =>
//                         result.detailedMeanings.push({
//                             pos: item[0],
//                             meaning: item[1].join(", "),
//                         })
//                     );
//                     // log("detailedMeanings: " + JSON.stringify(result.detailedMeanings));
//                     break;
//                 case 2:
//                     result.from = items;
//                     // log(result.from);
//                     break;
//                 // 单词的定义及对应例子
//                 case 12:
//                     result.definitions = new Array();
//                     items.forEach((item) => {
//                         item[1].forEach((element) => {
//                             result.definitions.push({
//                                 pos: item[0],
//                                 meaning: element[0],
//                                 example: element[2],
//                             });
//                         });
//                     });
//                     // log("definitions: " + JSON.stringify(result.definitions));
//                     break;
//                 case 13:
//                     result.examples = new Array();
//                     items.forEach((item) =>
//                         item.forEach((element) =>
//                             result.examples.push({ source: null, target: element[0] })
//                         )
//                     );
//                     // log("examples: " + JSON.stringify(result.examples));
//                     break;
//                 default:
//                     break;
//             }
//         }
//     }
//     return result;
// }



// should be improve from https://github.com/EdgeTranslate/EdgeTranslate/blob/7845d56bfb7b5278f675e34c1641c8616fd30b2e/src/content/display/templates/result.xhtml
function displayResult(data_var) {
    // console.log("data var", data_var)
    // console.log(this)
    let t = new Array;
    if (t.push('<div id="edge-translate-result"><div class="target-phonetic-symbol">  '), data_var.tPronunciation && data_var.tPronunciation.length > 0 && (data_var.tPronunciation.length <= 10 ? (t.push('  <div class="may-need-rtl target-phonetic-symbol-large">'), t.push(data_var.tPronunciation), t.push("</div>  ")) : data_var.tPronunciation.length > 10 && data_var.tPronunciation.length <= 16 ? (t.push(' <div class="may-need-rtl target-phonetic-symbol-medium">'), t.push(data_var.tPronunciation), t.push("</div>  ")) : (t.push(' <div class="may-need-rtl target-phonetic-symbol-small">'), t.push(data_var.tPronunciation), t.push("</div>  "))), t.push(' \t</div> \t<div class="pronounce">  '), data_var.originalText.length <= 200 && (t.push('  <div class="content-title pronounce-item">  <i id="source-pronounce-loading" class="edge-translate-icon icon-pronounce-loading" style="display: none;">  <?xml version="1.0" encoding="utf-8"?>  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: rgb(255, 255, 255); display: block; shape-rendering: auto;" width="32px" height="32px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">  <circle cx="50" cy="50" stroke-width="10" r="32" stroke-dasharray="113.09733552923255 39.69911184307752">  <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>  </circle>  </svg>  </i>  <i id="source-pronounce" class="edge-translate-icon icon-pronounce"><?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1551769149180" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4976" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32"><defs><style type="text/css"></style></defs><path d="M227.556 312.889v-28.445h-85.334c-47.457 0-85.333 38.326-85.333 85.603v283.906c0 47.583 38.205 85.603 85.333 85.603h85.334V312.889z m56.888 415.289L512 910.222V113.778L284.444 295.822v432.356z m-56.888-45.511v56.889l254.317 211.93c47.86 39.885 87.016 21.699 87.016-40.984V113.498c0-62.718-38.958-81.033-87.016-40.985L227.556 284.444v56.89h-56.89c-31.637 0-56.888 25.234-56.888 56.364v228.604c0 30.71 25.47 56.365 56.889 56.365h56.889z m455.113-384.419l241.359-241.36 40.226 40.227-241.359 241.36-40.226-40.227z m0 424.645l241.359 241.36 40.226-40.227-241.359-241.36-40.226 40.227z m-0.002-267.782H967.11V512H682.667v-56.889z" p-id="4977"></path></svg></i>&nbsp;  <span>'), t.push(chrome.i18n.getMessage("PronounceOriginal")), t.push('</span>  </div>  <div class="content-title pronounce-item">  <i id="target-pronounce-loading" class="edge-translate-icon icon-pronounce-loading" style="display: none;">  <?xml version="1.0" encoding="utf-8"?>  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: rgb(255, 255, 255); display: block; shape-rendering: auto;" width="32px" height="32px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">  <circle cx="50" cy="50" stroke-width="10" r="32" stroke-dasharray="113.09733552923255 39.69911184307752">  <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>  </circle>  </svg>  </i>  <i id="target-pronounce" class="edge-translate-icon icon-pronounce"><?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1551769149180" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4976" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32"><defs><style type="text/css"></style></defs><path d="M227.556 312.889v-28.445h-85.334c-47.457 0-85.333 38.326-85.333 85.603v283.906c0 47.583 38.205 85.603 85.333 85.603h85.334V312.889z m56.888 415.289L512 910.222V113.778L284.444 295.822v432.356z m-56.888-45.511v56.889l254.317 211.93c47.86 39.885 87.016 21.699 87.016-40.984V113.498c0-62.718-38.958-81.033-87.016-40.985L227.556 284.444v56.89h-56.89c-31.637 0-56.888 25.234-56.888 56.364v228.604c0 30.71 25.47 56.365 56.889 56.365h56.889z m455.113-384.419l241.359-241.36 40.226 40.227-241.359 241.36-40.226-40.227z m0 424.645l241.359 241.36 40.226-40.227-241.359-241.36-40.226 40.227z m-0.002-267.782H967.11V512H682.667v-56.889z" p-id="4977"></path></svg></i>&nbsp;  <span>'), t.push(chrome.i18n.getMessage("PronounceTranslated")), t.push("</span> </div>  ")), t.push(' \t</div> \t<div class="phonetic-symbol">  '), data_var.sPronunciation && data_var.sPronunciation.length > 0 && (t.push('  <div class="content-title">'), t.push(chrome.i18n.getMessage("PhoneticSymbol")), t.push(': </div>  <div class="phonetic-symbol-content">['), t.push(data_var.sPronunciation), t.push("]</div>  ")), t.push(' \t</div> <div class="detailed-meanings">  '), data_var.AlternativeTranslations && data_var.AlternativeTranslations.length > 0) {
        t.push('  <hr/>  <div class="content-title">'), t.push(chrome.i18n.getMessage("AlternativeTranslations")), t.push(": </div>  ");
        for (let e in data_var.AlternativeTranslations) t.push('  <div class="detailed-meanings-content"> <div class="word-type">'), t.push(data_var.AlternativeTranslations[e].pos + ": "), t.push('</div> <div class="may-need-rtl content">'), t.push(data_var.AlternativeTranslations[e].meaning), t.push("</div>  "), data_var.AlternativeTranslations[e].synonyms && (t.push('  <div class="may-need-rtl content">'), t.push(data_var.AlternativeTranslations[e].synonyms.join(", ")), t.push("</div>  ")), t.push("  </div>  ")
    }

    if (t.push(' </div> <div class="definitions"> '), data_var.definitions && data_var.definitions.length > 0) {
        t.push('  <hr/>  <div class="content-title">'), t.push(chrome.i18n.getMessage("Definitions")), t.push(": </div> ");
        for (let e in data_var.definitions) t.push(' <div class="definitions-content"> <div class="word-type">'), t.push(data_var.definitions[e].pos + ": "), t.push('</div>  <span class="content">  <span>'), t.push(chrome.i18n.getMessage("DefinitionsMeaning")), t.push(': </span>  <div class="definitions-content">'), t.push(data_var.definitions[e].meaning), t.push("</div>  "), data_var.definitions[e].example && data_var.definitions[e].example.length > 0 && (t.push("  <span>"), t.push(chrome.i18n.getMessage("DefinitionsExample")), t.push(': </span>  <div class="definitions-content">'), t.push(data_var.definitions[e].example), t.push("</div>  ")), data_var.definitions[e].synonyms && (t.push("  <span>"), t.push(chrome.i18n.getMessage("Synonyms")), t.push(': </span>  <div class="definitions-content">'), t.push(data_var.definitions[e].synonyms.join(", ")), t.push("</div>  ")), t.push("  </span>  </div> ")
    }
    if (t.push(' </div> <div class="examples"> '), data_var.examples && data_var.examples.length > 0) {
        t.push('  <hr/>  <div class="content-title">'), t.push(chrome.i18n.getMessage("Examples")), t.push(": </div>  <ol>  ");
        for (let e in data_var.examples) t.push('  <li class="sentences">  <div>'), t.push(data_var.examples[e].target), t.push("</div>  <div>"), t.push(data_var.examples[e].source), t.push("</div>  </li> ");
        t.push(" </ol> ")
    }
    if (t.push(' </div> <div class="definitions"> '), data_var.AlternativeOriginal && data_var.AlternativeOriginal.length > 0) {
        t.push('  <hr/>  <div class="content-title">'), t.push(chrome.i18n.getMessage("AlternativeOriginal")), t.push(": </div>  ");
        for (let e in data_var.AlternativeOriginal) t.push('  <div class="detailed-meanings-content"> <div class="word-type">'), t.push(data_var.AlternativeOriginal[e].pos + ": "), t.push('</div> <div class="may-need-rtl content">'), t.push(data_var.AlternativeOriginal[e].meaning), t.push("</div>  "), data_var.AlternativeOriginal[e].type && (t.push('  <div class="may-need-rtl content">'), t.push(data_var.AlternativeOriginal[e].type), t.push("</div>  ")), t.push("  </div>  ")
    }
    if (t.push(' </div> <div class="definitions"> '), data_var.reverseTranslation && data_var.reverseTranslation.length > 0) {
        t.push('  <hr/>  <div class="content-title">'), t.push(chrome.i18n.getMessage("reverseTranslation")), t.push(": </div>  ");
        for (let e in data_var.reverseTranslation) t.push('  <div class="detailed-meanings-content"> <div class="word-type">'), t.push(data_var.reverseTranslation[e].translation + ": "), t.push('</div>'), t.push('  <div class="may-need-rtl content">'), t.push(data_var.reverseTranslation[e].reverseTranslationmeaning), t.push("</div>  "), t.push("  </div>  ")

    }
    // console.log("t")
    // console.log(t)
    return t.push(" </div> </div> "), t.join("")
}


// # ------------------------------------------------------ ¤¤ dispaly full result
function displaymyfullresult() {
    var myfullresultpreview = document.getElementById("myfullresultpreview");
    var buttonseemyfullresulta = document.getElementById('seemyfullresult');

    if (myfullresultpreview.style.display == "block") {
        myfullresultpreview.style.display = "none";
        buttonseemyfullresulta.innerText = "See full formatted text";
        // datapreview.innerHTML = '';
    } else {
        myfullresultpreview.style.display = "block";
        buttonseemyfullresulta.innerText = "Close full formatted text";
    }
}
// en = 11
// dut = 11 
//fr 16

var voices_index_per_languages = {
    fr: 16,
    nl: 21,
    en: 11,

}




function speakOrigine() {
    var speakorigine = document.getElementById('textareaSource').value;
    var languagueInput = document.querySelector('input[name="source"]:checked').value.replace('_source', '');
    if (languagueInput === "auto") {
        languagueInput = document.getElementById('auto_mode').title;
    }
    // var nameVoice = voices_index_per_languages[languagueInput]
    // if (!(typeof nameVoice === 'undefined' || nameVoice === null)) {
    // speak(speakorigine, nameVoice)
    // }
    speak(speakorigine, languagueInput)

}

function speakTranslate() {
    var speaktranslate = document.getElementById('textareaTarget').value;
    var languagueTarget = document.querySelector('input[name="target"]:checked').value.replace('_target', '');
    // var nameVoice = voices_index_per_languages[languagueTarget]
    // if (!(typeof nameVoice === 'undefined' || nameVoice === null)) {
    // speak(speaktranslate, nameVoice)
    // }
    speak(speaktranslate, languagueTarget)
}
// speak("house", "Microsoft Aria Online (Natural) - English (United States)")

function speak(inputTxt, language) {
    // function speak(inputTxt, nameVoice) {


    // Get the audio element
    const audioEl = document.getElementById('tts-audio');
    const url =
        'https://translate.google.com/translate_tts?ie=UTF-8&tl=' + language + '&client=tw-ob&q=' + inputTxt;
    // add the sound to the audio element
    audioEl.src = url;
    //For auto playing the sound
    audioEl.play();




    // too slow
    //     console.log("speak TTS :", inputTxt, nameVoice)
    //     var synth = window.speechSynthesis
    //     // takes too long to populatte the so the name are used instead of the index in getVoices()
    //     // var voices = window.speechSynthesis.getVoices()
    //     // console.log("voices")
    //     // console.log(voices)
    //     console.log(window.allVoices)
    //     if (synth.speaking) {
    //         console.error('speechSynthesis.speaking')
    //         return
    //     }
    //     if (inputTxt !== '') {
    //         var utterThis = new SpeechSynthesisUtterance(inputTxt)
    //         utterThis.onend = function (event) {
    //             console.log('SpeechSynthesisUtterance.onend')
    //         }
    //         utterThis.onerror = function (event) {
    //             console.error('SpeechSynthesisUtterance.onerror')
    //         }
    //         // utterThis.voice = nameVoice;
    //         utterThis.voice = window.allVoices[nameVoice]
    //         // utterThis.pitch = pitch.value
    //         // utterThis.rate = rate.value
    //         synth.speak(utterThis)
    //     }



}

// utterance.voice = voices[3];
// utterance.lang = voices[3].lang;