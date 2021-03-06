function tooltip(el, message) {
    var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var x = parseInt(el.getBoundingClientRect().left) + scrollLeft + 10;
    var y = parseInt(el.getBoundingClientRect().top) + scrollTop + 10;
    if (!document.getElementById("copy_tooltip")) {
        var tooltip = document.createElement('div');
        tooltip.id = "copy_tooltip";
        tooltip.style.position = "absolute";
        tooltip.style.border = "1px solid black";
        tooltip.style.background = "#dbdb00";
        tooltip.style.opacity = 1;
        tooltip.style.transition = "opacity 0.3s";
        tooltip.style.zIndex = "1999999999"; // Version 1.2b
        document.body.appendChild(tooltip);
    } else {
        var tooltip = document.getElementById("copy_tooltip")
    }
    tooltip.style.opacity = 1;
    tooltip.style.display = "block"; // Version 1.2b
    tooltip.style.left = x + "px";
    tooltip.style.top = y + "px";
    tooltip.innerHTML = message;
    clearTimeout(window['tooltip_timer']); // Version 1.2c - Added global tooltip_timer variable
    window['tooltip_timer'] = setTimeout(function () {
        tooltip.style.display = "none";
        tooltip.style.opacity = 0;
    }, 2000);
}



function select_all_and_copy(el, button) {
    // Copy textarea, pre, div, etc.
    if (document.body.createTextRange) {
        // IE 
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.select();
        textRange.execCommand("Copy");
        tooltip(el, "Copied!");
    } else if (window.getSelection && document.createRange) {
        // non-IE
        try {
            var editable = el.contentEditable; // Record contentEditable status of element
        } catch (e) {
            tooltip(button, 'Clique encore une fois pour copier. Click again to copy. ');
        }
        var readOnly = el.readOnly; // Record readOnly status of element
        el.contentEditable = true; // iOS will only select text on non-form elements if contentEditable = true;
        el.readOnly = true; // iOS will not select in a read only form element // Version 1.2c - Changed from false to true; Prevents keyboard from appearing when copying from textarea
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range); // Does not work for Firefox if a textarea or input
        if (el.nodeName == "TEXTAREA" || el.nodeName == "INPUT")
            el.select(); // Firefox will only select a form element with select()
        //if (el.setSelectionRange && navigator.userAgent.match(/ipad|ipod|iphone/i)) // Version 1.2c - iOS 12 might be defaulting to desktop mode so removed
        if (el.setSelectionRange) // Version 1.2c - iOS 12 might be defaulting to desktop mode and no longer has iphone in user agent
            el.setSelectionRange(0, 999999); // iOS only selects "form" elements with SelectionRange
        el.contentEditable = editable; // Restore previous contentEditable status
        el.readOnly = readOnly; // Restore previous readOnly status 
        if (document.queryCommandSupported("copy")) {
            var successful = document.execCommand('copy');
            if (successful) tooltip(button, "Copied to clipboard.");
            else tooltip(button, "??chec de la copie.");
        } else {
            if (!navigator.userAgent.match(/ipad|ipod|iphone|android|silk/i))
                tooltip(button, "Press CTRL+C to copy");
        }
    }
}


function ClipBoard(objButton) {
    // check if the clipboard api is supported
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        console.log("pressed")
        var text = objButton.value;
        var fetch = new XMLHttpRequest();
        fetch.open('GET', text);
        fetch.onload = function () {
            var content = fetch.responseText;
            var sampleTextarea = document.createElement('textarea');
            sampleTextarea.value = content; //save main text in it
            document.body.appendChild(sampleTextarea);
        }
        fetch.send();
        var textarea = document.querySelector("textarea")
        select_all_and_copy(textarea, objButton);
    } else {
        console.log("pressed")
        var text = objButton.value;
        var fetch = new XMLHttpRequest();
        fetch.open('GET', text);
        fetch.onload = function () {
            var content = fetch.responseText;
            //async clipboard
            navigator.clipboard.writeText(content).then(function () {
                console.log('Async: Copying to clipboard was successful!');
                tooltip(objButton, "Copied to clipboard.");
            }, function (err) {
                
            });
        }
        fetch.send();
    }

}

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/Bilnaa/katsu/main/katsu_modules.json');
xhr.onload = function () {
    var content = xhr.responseText;
    var parsedJson = JSON.parse(content);
    for (module of parsedJson.modules) {
        let name = module.name;
        let info = module.info;
        let image = module.image;
        let link = module.link;
        if (name.includes('FR')) {
            var moduleEle = `<div class="col"> <div class="card mb-3 mt-5" style="max-width: 540px;"> <div class="row g-0"> <div class="col-md-4 text-center"> <img src="${image}" class="rounded img-fluid mx-auto d-block" alt="${name}" style="padding-top: auto;"> </div> <div class="col-md-8"> <div class="card-body"> <h5 class="card-title">${name}</h5> <p class="card-text">${info}</p> <button value="${link}" onclick="javascript:ClipBoard(this);" class="btn btn-dark">Copier dans le presse-papier</button> <a class="btn btn-dark" href="${link}" target = "blank" >Afficher le code</a></div> </div> </div> </div></div> `;
        } else if (name.includes('ENG')) {
            var moduleEle = `<div class="col"> <div class="card mb-3 mt-5" style="max-width: 540px;"> <div class="row g-0"> <div class="col-md-4 text-center"> <img src="${image}" class="rounded img-fluid mx-auto d-block" alt="${name}" style="padding-top: auto;"> </div> <div class="col-md-8"> <div class="card-body"> <h5 class="card-title">${name}</h5> <p class="card-text">${info}</p> <button value="${link}" onclick="javascript:ClipBoard(this);" class="btn btn-dark">Copy to the clipboard</button>  <a class = "btn btn-dark" href="${link}" target = "blank" >Get Code</a> </div> </div> </div> </div></div>`;
        }
        document.getElementById("moduleskatsu").innerHTML += moduleEle;
    }
    for (module of parsedJson.resolvers) {
        let name = module.name;
        let info = module.info;
        let image = module.image;
        let link = module.link;
        if (name.includes('Katsu')) {
            var resolverEle = `<div class="col"> <div class="card mb-3 mt-5" style="max-width: 540px;"> <div class="row g-0"> <div class="col-md-4 text-center"> <img src="${image}" class="rounded img-fluid mx-auto d-block" alt="${name}" style="padding-top: auto;"> </div> <div class="col-md-8"> <div class="card-body"> <h5 class="card-title">${name}</h5> <p class="card-text">${info}</p> <button value="${link}" onclick="javascript:ClipBoard(this);" class="btn btn-dark">Copy to the clipboard</button> <a class="btn btn-dark" href="${link}" target = "blank" >Get Code</a> </div> </div> </div> </div></div>`;
        } else if (name.includes('Ketsu')) {
            var resolverEle = `<div class="col"> <div class="card mb-3 mt-5" style="max-width: 540px;"> <div class="row g-0"> <div class="col-md-4 text-center"> <img src="${image}" class="rounded img-fluid mx-auto d-block" alt="${name}" style="padding-top: auto;"> </div> <div class="col-md-8"> <div class="card-body"> <h5 class="card-title">${name}</h5> <p class="card-text">${info}</p> <a href="${link}" class="btn btn-dark">Add</a> </div> </div> </div> </div></div>`;
        }
        document.getElementById("resolvers").innerHTML += resolverEle;
    }
}
xhr.send();

if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
    // runs the function every 5 seconds
    setInterval(function () {
        var textarea = document.querySelectorAll('textarea');
        for (var i = 0; i < textarea.length; i++) {
            textarea[i].remove();
        }
    }, 5000);
}

if (document.querySelectorAll('.resolvers .col') == undefined){
    // delete the resolvers div 
    document.getElementById("resolvers").remove();
}

if (document.querySelectorAll('.modules .col') == undefined){
    // delete the resolvers div 
    document.getElementById("modules").remove();
}
