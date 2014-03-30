///////ZMIENNE
noteName = '';

    
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
    currentDir.getDirectory("phonegap_notes", { create: true }, function (dir) {
        currentDir = dir;
        listFiles(currentDir);
    }, function (e) { alert(e); });
    //
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