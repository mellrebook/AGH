//////////////////////////////////////////////////////////////////////ROBIENIE KATALOGOW I LISTOWANIE PLIKOW NOTATEK
//DEVICE READY na start
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    getFileSystem();
}
//System plikow do listowania!
function getFileSystem() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT,
        0,
        fileSystemSuccess,
        function (e) { alert(e); });
}
//Jesli ok
function fileSystemSuccess(fileSystem) {
    currentDir = fileSystem.root;
    recordPath = currentDir;
    currentDir.getDirectory("phonegap_notes", { create: true }, function (dir) {
        currentDir = dir;
        listFiles(currentDir);
    }, function (e) { alert(e); });
}
////
function listFiles(entry) {
    if (!entry.isDirectory) {
        alert("nie moge listować ");
    } else {        
        var reader = entry.createReader();
        reader.readEntries(readSuccess, function (e) { alert(e); });
    }
}
//jak sie udalo
function readSuccess(entries) {
    var listView = '';
    for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isDirectory)                
            listView += '<li><a href="#page2" onclick="playNote( ' + "'" + entries[i].name +"'"  +' )">' + entries[i].name + '</a></li>';
    }
    $("#list").html(listView).listview('refresh');
}
//////////////////////////////////////////////////////////////////////ROBIENIE KATALOGOW I LISTOWANIE PLIKOW NOTATEK (koniec)


//////////////////////////////////////////////////////////////////FUNKCJA ZWRACA NAM NAZWE PLIKU WYBRANEJ NOTATKI do zmiennej
function playNote(_noteName){
    noteName = _noteName;
    alert(noteName);
}

//////////////////////////////////////////////////////////////////Start Recording Notes? Tak to sie pisze?
function startRecording(){
    newNoteName = $("#file_name").val();
    newNoteName += ".wav";
    if(!recording){
        console.log("kliknalem nagrywanie");
        if(newNoteName != "" && newNoteName != " "){
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, recordSound, errorSound);
        }
        recording = true;
    }else{
        console.log("kliknalem stop");
        stopRecord();
    }
}
function errorSound(e){
    alert(e);
}


function recordSound(){
    console.log("zaczynam nagryac.");
    currentDir.getFile(newNoteName, {create: true}, function() {
        console.log('created wav file:' + recordPath);
        console.log("Initializing audio..." + recordPath + "tu jest rekordpath");
        navigator.audio = new Media(currentDir + "/" + newNoteName, recording_success, recording_failure);
        console.log("Initializing audio...OK");
        console.log("Starting recording...");
        navigator.audio.startRecord();
        console.log("Starting recording...OK");
    }, logError);
}
//nagralo sie
function recording_success() {
    console.log("Recording success callback");
}
//blad??
function recording_failure(error) {
    alert("Recording failed: " + error);
    console.log("Recording failed: " + error);
}

//stop nagrywania
function stopRecord() {
    navigator.audio.stopRecord();
    recording = false;
}

//error
function logError(error) {
   console.log('something failed: ' + JSON.stringify(error));
}

jQuery(document).ready(function($) {
    noteName = '';
    newNoteName = '';
    recording = false;
    recordPath = "";
    currentDir = "";
});