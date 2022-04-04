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

async function clipboard(objButton) {
    // fetch async to objButton.value
    var text = await fetch(objButton.value).then(response => response.text());
    // copy to clipboard
    copyToClipboard(text, objButton);
}

// clipboard API function
function copyToClipboard(text,el) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    // delete textArea
    if (msg == 'unsuccessful') {
        tooltip(el, 'Oops, unable to copy' + err);
        document.body.removeChild(textArea);
    } else if(msg == 'successful') {
        tooltip(el, 'Copied to clipboard');
        document.body.removeChild(textArea);
    } else{
        tooltip(el, 'Je comprends rien' + err);
        document.body.removeChild(textArea);
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
            var moduleEle = `<div class="col"> <div class="card mb-3 mt-5" style="max-width: 540px;"> <div class="row g-0"> <div class="col-md-4 text-center"> <img src="${image}" class="rounded img-fluid mx-auto d-block" alt="${name}" style="padding-top: auto;"> </div> <div class="col-md-8"> <div class="card-body"> <h5 class="card-title">${name}</h5> <p class="card-text">${info}</p> <button value="${link}" class="btn btn-dark">Copier dans le presse-papier</button> </div> </div> </div> </div></div>`;
        } else if (name.includes('ENG')) {
            var moduleEle = `<div class="col"> <div class="card mb-3 mt-5" style="max-width: 540px;"> <div class="row g-0"> <div class="col-md-4 text-center"> <img src="${image}" class="rounded img-fluid mx-auto d-block" alt="${name}" style="padding-top: auto;"> </div> <div class="col-md-8"> <div class="card-body"> <h5 class="card-title">${name}</h5> <p class="card-text">${info}</p> <button value="${link}" class="btn btn-dark">Copy to the clipboard</button> </div> </div> </div> </div></div>`;
        }
        document.getElementById("moduleskatsu").innerHTML += moduleEle;
    }
}
xhr.send();

// get all the buttons and assign an event listener to each one onclick
var buttons = document.querySelectorAll('button');
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
        clipboard(this);
    });
}