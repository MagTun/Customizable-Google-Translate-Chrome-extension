// // # === === === === === === === === === === === === === === === === === === === === == ¤chinsese test
// // https://github.com/EdgeTranslate/EdgeTranslate/blob/eb9d6590b6927bd1a603127072198cf3eaebec70/src/background/library/translators/google.js

// console.log("cn ")




// /* eslint-disable */
// /**
//  * Generate TK.
//  *
//  * @param {String} a parameter
//  * @param {String} b parameter
//  * @param {String} c parameter
//  *
//  * @returns {String} request TK
//  */



function generateTK(a) {
    var TKK = [434217, 1534559001];
    b = TKK[1]
    var b = Number(TKK[0]) || 0;
    var c = TKK[1]
    let e = [];
    let f = 0;
    let g = 0;
    for (; g < a.length; g++) {
        let l = a.charCodeAt(g);
        128 > l ?
            (e[f++] = l) :
            (2048 > l ?
                (e[f++] = (l >> 6) | 192) :
                (55296 == (l & 64512) &&
                    g + 1 < a.length &&
                    56320 == (a.charCodeAt(g + 1) & 64512) ?
                    ((l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023)),
                        (e[f++] = (l >> 18) | 240),
                        (e[f++] = ((l >> 12) & 63) | 128)) :
                    (e[f++] = (l >> 12) | 224),
                    (e[f++] = ((l >> 6) & 63) | 128)),
                (e[f++] = (l & 63) | 128));
    }
    a = b;
    for (f = 0; f < e.length; f++) {
        (a += e[f]), (a = magic(a, "+-a^+6"));
    }
    a = magic(a, "+-3^+b+-f");
    a ^= Number(c) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1e6;
    return a.toString() + "." + (a ^ b);
}

// /**
//  * Generate magic number.
//  *
//  * @param {String} a parameter
//  * @param {String} b parameter
//  *
//  * @returns {String} magic number
//  */
function magic(a, b) {
    for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2),
            d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d),
            d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
        a = "+" == b.charAt(c) ? (a + d) & 4294967295 : a ^ d;
    }
    return a;
}

function renewtoken() {
    var http1 = new XMLHttpRequest();
    http1.onload = function (e) {
        // console.log("onload xml")
        // const response = await axios.get(this.HOST);
        // let body = response.data;


        let body = http1.responseText;
        // console.log(body)
        let tkkresult = (body.match(/TKK=(.*?)\(\)\)'\);/i) || [""])[0]
            .replace(/\\x([0-9A-Fa-f]{2})/g, "") // remove hex chars
            .match(/[+-]?\d+/g);
        // console.log(tkkresult)
        if (tkkresult) {
            TKK[0] = Number(tkkresult[2]);
            TKK[1] = Number(tkkresult[0]) + Number(tkkresult[1]);
        } else {
            tkkresult = body.match(/TKK[=:]['"](\d+?)\.(\d+?)['"]/i);
            if (tkkresult) {
                TKK[0] = Number(tkkresult[1]);
                TKK[1] = Number(tkkresult[2]);
            }
        }
        // console.log("TKK onload")
        // console.log(TKK)
    }
    var url1 = "https://translate.google.cn/";
    http1.open("GET", url1, true);
    http1.onerror = function (e) {
        // console.log(http1.statusText);
    };
    http1.send(null); // null = no parameters
    // console.log("TKK 2")
    // console.log(TKK)
}