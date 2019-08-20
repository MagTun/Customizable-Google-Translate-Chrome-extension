// // # ============================================================== ¤ when DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {

    // add function to button reset options
    var buttonresetoptions = document.getElementById('resetoptions');
    buttonresetoptions.addEventListener('click', function () {
        resetoptions();
    }, false);

    // add the function script "popup.js" and call the function " setoptions()"
    var script = document.createElement('script');
    script.onload = function () {
        setoptions()
    };
    script.src = "popup.js";
    document.head.appendChild(script);

}, false);