let selectMultifile = document.getElementById("selectMultifile");

var listFile = [];

selectMultifile.addEventListener('change', function (e) {
  const files = e.target.files;
  const path = files[0].path;
  document.getElementById("selectMultifile").innerHTML = path;
  if (isVideo(path)) {
    if (!listFile.includes(path)) {
      var btnConvert = document.getElementById("btnConvert");
      listFile.push(path)
      btnConvert.style.display = "block";
      newElement(path)
    } else {
      alert("File này đã có trong danh sách");
    }
  } else {
    alert("Không phải file MOV");
  }
});

let convertMultifile = document.getElementById("convertMultifile");
convertMultifile.addEventListener('click', function (e) {
  listFile.forEach(function (pathInput, index, array) {
    const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
    const ffmpeg = require('fluent-ffmpeg');
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
    var parts = pathInput.split('.');
    var pathOutput = ""
    let i = 0
    parts.forEach(function (pathInputItem, index, array) {
      if (i == parts.length - 1)
        pathOutput = pathOutput + ".avi"
      else {
        pathOutput = pathOutput + pathInputItem
        i++
      }
    });
    var command = ffmpeg(pathInput).addOption("-c copy").output(pathOutput)
    command.on('progress', function (progress) {
      if (progress.percent != null)
        document.getElementById(pathInput).value = progress.percent;
      else
        document.getElementById(pathInput).value = '100';
    });
    command.on('end', function (stdout, stderr) {
      document.getElementById(pathInput).value = '100';
    });
    command.run()
  });
});

function getExtension(filename) {
  if (filename != null) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }
  return ""
}

function isVideo(filename) {
  var ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'mov':
      return true;
  }
  return false;
}

// Create a new list item when clicking on the "Add" button
function newElement(inputValue) {
  var li = document.createElement("li");
  li.style.display = 'flex'
  li.style.flexDirection = 'column'
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  var progress = document.createElement("progress");
  progress.setAttribute('id', inputValue)
  progress.value = 0
  li.appendChild(progress);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("selectMultifile").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);
  span.addEventListener('click', () => {
    listFile.pop(inputValue)
    if (listFile.length == 0) {
      btnConvert.style.display = "none";
    }
    li.remove();
  });
}