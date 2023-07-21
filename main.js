
let itaWordList = []; 



let output = document.getElementById('output');
let inputTextArea = document.getElementById('input-text');
let findBtn = document.getElementById('find');

import("./words.it.js").then(({words}) => {
  itaWordList = words()
  output.innerHTML = '';
});

// UTILS

function escapeStringRegexp(string) {
  return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join('.')
  );
}

function formatFileName(title) {
  return formatDate(new Date()) + ' ' + title.substring(0, 50).replace(/\W+/g, ' ') + '.txt'
}

// DOWNLOAD TEXT
function downloadText(filename, text) {
  if (isWindows()) {
    text = text.replace(/\r?\n/g, "\r\n");
  }
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

//OS
function isWindows() {
  if (window && window.navigator && window.navigator.userAgent) {
    return window.navigator.userAgent.toLowerCase().indexOf("windows") != -1;
  }
  return false;
}

// EVENTS
function addOnClick(id, fn) {
  let el = document.getElementById(id);
  el.onclick = fn;
}

function find() {
  window.scrollTo(0,0)
  output.innerHTML = 'Cerco...';
  setTimeout(function(){
    let v = escapeStringRegexp(inputTextArea.value)
    v = v.replaceAll('\\*','.*').replaceAll('\\?','.'); // wildcard
    console.log(v);
    let r = new RegExp('^' + v+ '$', 'i')
    let words = itaWordList.filter(a=> r.test(a))
    output.innerHTML = '';
    words.forEach(w=> addOutputLine(w));
  }, 100)
}

inputTextArea.onkeyup = function(e) {
  e.key === "Enter" && find();
};
let zoomValue = 1;

function addOutputLine(text, invert) {
  if(!text || !text.trim()){
    return;
  }
  let o = document.createElement("li");
  o.classList.add("out-line");
  o.innerText = text;

  let bd = document.createElement("button");
  bd.innerText = "Rimuovi";
  bd.classList.add("out-btn");
  bd.onclick = function () {
    o.remove();
  };
  o.appendChild(bd);

  let bc = document.createElement("button");
  bc.innerText = "Copia";
  bc.classList.add("out-btn");
  bc.onclick = function () {
    navigator.clipboard.writeText(text)
  };
  o.appendChild(bc);
  output.appendChild(o);
}

addOnClick('zoom-in', function () {
  zoomValue *= 1.1
  inputTextArea.style.setProperty('zoom', zoomValue);
  findBtn.style.setProperty('zoom', zoomValue);
  output.style.setProperty('zoom', zoomValue);
});

addOnClick('zoom-out', function () {
  zoomValue *= 0.9
  inputTextArea.style.setProperty('zoom', zoomValue);
  findBtn.style.setProperty('zoom', zoomValue);
  output.style.setProperty('zoom', zoomValue);
});

addOnClick('copy', function (e) {
  navigator.clipboard.writeText(output.innerText)
});

addOnClick('find', find);

addOnClick('clean', function (e) {
  output.innerHTML = '';
});

addOnClick('download', function () {
  downloadText(formatFileName(inputTextArea.value.trim()), output.innerText);
});

function onHeaderResize() {
  body.style.setProperty('margin-top', (header.offsetHeight) + 'px');
}
onHeaderResize()
 
 new ResizeObserver(onHeaderResize).observe(header)