// full list https://cloud.google.com/translate/docs/languages?hl=en
//  not complete  https://developers.google.com/admin-sdk/directory/v1/languages



// How to create this list: 
// go to https://cloud.google.com/translate/docs/languages?hl=en and copy the table
// replace with regex  ^ by: 

// ',
//         direction: 'ltr',
//     },


//     {
//         id: 

// then replace  \t  by:
// ,
//         text: '

// then fix the space before id 
// change the direction to rtl for arabic, Hebrew, Persian, Urdu, Yiddish
//  search   id: '\w{2}    and split/put in comment anything else than 2 letters code
// remove space in language name and shorten them when too long : text: '\w+    : Chinese(Simpl.)   Chinese(Trad.)... but keep scot gaelic.... 

// verify if all the languages from the previous list are included in the new one: 

// langsOLD.forEach((itemO, indexO) => {
//     var nofound = true;
//     langs.forEach((item, index) => {
//         if (langsOLD[indexO].id == langs[index].id) {

//             nofound = false;
//         }
//     });
//     if (nofound == true) {
//         console.log(langsOLD[indexO].id)
//     }

// });


// var allidsOLD = langsOLD.map(d => d.id);
// console.log(allidsOLD);

// var allids = langs.map(d => d.id);
// console.log(allids);




var langs = [{
        id: 'auto',
        text: 'Auto',
        direction: 'ltr',
    },


    {
        text: 'Afrikaans',
        id: 'af',
        direction: 'ltr',
    },

    {
        text: 'Albanian',
        id: 'sq',
        direction: 'ltr',
    },

    {
        text: 'Amharic',
        id: 'am',
        direction: 'ltr',
    },

    {
        text: 'Arabic',
        id: 'ar',
        direction: 'rtl',
    },

    {
        text: 'Armenian',
        id: 'hy',
        direction: 'ltr',
    },

    {
        text: 'Azerbaijani',
        id: 'az',
        direction: 'ltr',
    },

    {
        text: 'Basque',
        id: 'eu',
        direction: 'ltr',
    },

    {
        text: 'Belarusian',
        id: 'be',
        direction: 'ltr',
    },

    {
        text: 'Bengali',
        id: 'bn',
        direction: 'ltr',
    },

    {
        text: 'Bosnian',
        id: 'bs',
        direction: 'ltr',
    },

    {
        text: 'Bulgarian',
        id: 'bg',
        direction: 'ltr',
    },

    {
        text: 'Catalan',
        id: 'ca',
        direction: 'ltr',
    },

    {
        text: 'Cebuano',
        id: 'ceb)', // (ISO-639-2
        direction: 'ltr',
    },

    {
        text: 'Chinese(Simpl.)',
        id: 'zh-CN',
        direction: 'ltr',
    },
    {
        text: 'Chinese(Simpl.)',
        id: 'zh', // (BCP-47)
        direction: 'ltr',
    },

    {
        text: 'Chinese(Trad.)',
        id: 'zh-TW (BCP-47)',
        direction: 'ltr',
    },

    {
        text: 'Corsican',
        id: 'co',
        direction: 'ltr',
    },

    {
        text: 'Croatian',
        id: 'hr',
        direction: 'ltr',
    },

    {
        text: 'Czech',
        id: 'cs',
        direction: 'ltr',
    },

    {
        text: 'Danish',
        id: 'da',
        direction: 'ltr',
    },

    {
        text: 'Dutch',
        id: 'nl',
        direction: 'ltr',
    },

    {
        text: 'English',
        id: 'en',
        direction: 'ltr',
    },

    {
        text: 'Esperanto',
        id: 'eo',
        direction: 'ltr',
    },

    {
        text: 'Estonian',
        id: 'et',
        direction: 'ltr',
    },

    {
        text: 'Finnish',
        id: 'fi',
        direction: 'ltr',
    },

    {
        text: 'French',
        id: 'fr',
        direction: 'ltr',
    },

    {
        text: 'Frisian',
        id: 'fy',
        direction: 'ltr',
    },

    {
        text: 'Galician',
        id: 'gl',
        direction: 'ltr',
    },

    {
        text: 'Georgian',
        id: 'ka',
        direction: 'ltr',
    },

    {
        text: 'German',
        id: 'de',
        direction: 'ltr',
    },

    {
        text: 'Greek',
        id: 'el',
        direction: 'ltr',
    },

    {
        text: 'Gujarati',
        id: 'gu',
        direction: 'ltr',
    },

    {
        text: 'Haitian Creole',
        id: 'ht',
        direction: 'ltr',
    },

    {
        text: 'Hausa',
        id: 'ha',
        direction: 'ltr',
    },

    {
        text: 'Hawaiian',
        id: 'haw', // (ISO-639-2)
        direction: 'ltr',
    },

    {
        text: 'Hebrew',
        id: 'he',
        direction: 'rtl',
    },
    {
        text: 'Hebrew',
        id: 'iw',
        direction: 'rtl',
    },

    {
        text: 'Hindi',
        id: 'hi',
        direction: 'ltr',
    },

    {
        text: 'Hmong',
        id: 'hmn (ISO-639-2)',
        direction: 'ltr',
    },

    {
        text: 'Hungarian',
        id: 'hu',
        direction: 'ltr',
    },

    {
        text: 'Icelandic',
        id: 'is',
        direction: 'ltr',
    },

    {
        text: 'Igbo',
        id: 'ig',
        direction: 'ltr',
    },

    {
        text: 'Indonesian',
        id: 'id',
        direction: 'ltr',
    },

    {
        text: 'Irish',
        id: 'ga',
        direction: 'ltr',
    },

    {
        text: 'Italian',
        id: 'it',
        direction: 'ltr',
    },

    {
        text: 'Japanese',
        id: 'ja',
        direction: 'ltr',
    },

    {
        text: 'Javanese',
        id: 'jv',
        direction: 'ltr',
    },

    {
        text: 'Kannada',
        id: 'kn',
        direction: 'ltr',
    },

    {
        text: 'Kazakh',
        id: 'kk',
        direction: 'ltr',
    },

    {
        text: 'Khmer',
        id: 'km',
        direction: 'ltr',
    },

    {
        text: 'Kinyarwanda',
        id: 'rw',
        direction: 'ltr',
    },

    {
        text: 'Korean',
        id: 'ko',
        direction: 'ltr',
    },

    {
        text: 'Kurdish',
        id: 'ku',
        direction: 'ltr',
    },

    {
        text: 'Kyrgyz',
        id: 'ky',
        direction: 'ltr',
    },

    {
        text: 'Lao',
        id: 'lo',
        direction: 'ltr',
    },

    {
        text: 'Latin',
        id: 'la',
        direction: 'ltr',
    },

    {
        text: 'Latvian',
        id: 'lv',
        direction: 'ltr',
    },

    {
        text: 'Lithuanian',
        id: 'lt',
        direction: 'ltr',
    },

    {
        text: 'Luxembourgish',
        id: 'lb',
        direction: 'ltr',
    },

    {
        text: 'Macedonian',
        id: 'mk',
        direction: 'ltr',
    },

    {
        text: 'Malagasy',
        id: 'mg',
        direction: 'ltr',
    },

    {
        text: 'Malay',
        id: 'ms',
        direction: 'ltr',
    },

    {
        text: 'Malayalam',
        id: 'ml',
        direction: 'ltr',
    },

    {
        text: 'Maltese',
        id: 'mt',
        direction: 'ltr',
    },

    {
        text: 'Maori',
        id: 'mi',
        direction: 'ltr',
    },

    {
        text: 'Marathi',
        id: 'mr',
        direction: 'ltr',
    },

    {
        text: 'Mongolian',
        id: 'mn',
        direction: 'ltr',
    },

    {
        text: 'Myanmar(Burm.)',
        id: 'my',
        direction: 'ltr',
    },

    {
        text: 'Nepali',
        id: 'ne',
        direction: 'ltr',
    },

    {
        text: 'Norwegian',
        id: 'no',
        direction: 'ltr',
    },

    {
        text: 'Nyanja(Chich.)',
        id: 'ny',
        direction: 'ltr',
    },

    {
        text: 'Odia(Oriya)',
        id: 'or',
        direction: 'ltr',
    },

    {
        text: 'Pashto',
        id: 'ps',
        direction: 'ltr',
    },

    {
        text: 'Persian',
        id: 'fa',
        direction: 'rtl',
    },

    {
        text: 'Polish',
        id: 'pl',
        direction: 'ltr',
    },

    {
        text: 'Portuguese',
        id: 'pt',
        direction: 'ltr',
    },

    {
        text: 'Punjabi',
        id: 'pa',
        direction: 'ltr',
    },

    {
        text: 'Romanian',
        id: 'ro',
        direction: 'ltr',
    },

    {
        text: 'Russian',
        id: 'ru',
        direction: 'ltr',
    },

    {
        text: 'Samoan',
        id: 'sm',
        direction: 'ltr',
    },

    {
        text: 'Scots Gaelic',
        id: 'gd',
        direction: 'ltr',
    },

    {
        text: 'Serbian',
        id: 'sr',
        direction: 'ltr',
    },

    {
        text: 'Sesotho',
        id: 'st',
        direction: 'ltr',
    },

    {
        text: 'Shona',
        id: 'sn',
        direction: 'ltr',
    },

    {
        text: 'Sindhi',
        id: 'sd',
        direction: 'ltr',
    },

    {
        text: 'Sinhala',
        id: 'si',
        direction: 'ltr',
    },

    {
        text: 'Slovak',
        id: 'sk',
        direction: 'ltr',
    },

    {
        text: 'Slovenian',
        id: 'sl',
        direction: 'ltr',
    },

    {
        text: 'Somali',
        id: 'so',
        direction: 'ltr',
    },

    {
        text: 'Spanish',
        id: 'es',
        direction: 'ltr',
    },

    {
        text: 'Sundanese',
        id: 'su',
        direction: 'ltr',
    },

    {
        text: 'Swahili',
        id: 'sw',
        direction: 'ltr',
    },

    {
        text: 'Swedish',
        id: 'sv',
        direction: 'ltr',
    },

    {
        text: 'Tagalog(Filip.)',
        id: 'tl',
        direction: 'ltr',
    },

    {
        text: 'Tajik',
        id: 'tg',
        direction: 'ltr',
    },

    {
        text: 'Tamil',
        id: 'ta',
        direction: 'ltr',
    },

    {
        text: 'Tatar',
        id: 'tt',
        direction: 'ltr',
    },

    {
        text: 'Telugu',
        id: 'te',
        direction: 'ltr',
    },

    {
        text: 'Thai',
        id: 'th',
        direction: 'ltr',
    },

    {
        text: 'Turkish',
        id: 'tr',
        direction: 'ltr',
    },

    {
        text: 'Turkmen',
        id: 'tk',
        direction: 'ltr',
    },

    {
        text: 'Ukrainian',
        id: 'uk',
        direction: 'ltr',
    },

    {
        text: 'Urdu',
        id: 'ur',
        direction: 'rtl',
    },

    {
        text: 'Uyghur',
        id: 'ug',
        direction: 'ltr',
    },

    {
        text: 'Uzbek',
        id: 'uz',
        direction: 'ltr',
    },

    {
        text: 'Vietnamese',
        id: 'vi',
        direction: 'ltr',
    },

    {
        text: 'Welsh',
        id: 'cy',
        direction: 'ltr',
    },

    {
        text: 'Xhosa',
        id: 'xh',
        direction: 'ltr',
    },

    {
        text: 'Yiddish',
        id: 'yi',
        direction: 'rtl',
    },

    {
        text: 'Yoruba',
        id: 'yo',
        direction: 'ltr',
    },

    {
        text: 'Zulu',
        id: 'zu',
        direction: 'ltr'
    }
];