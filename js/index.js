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


//=====================odtwarzanie audio=======================

//////////////////////////////////////////////////////////////////FUNKCJA ZWRACA NAM NAZWE PLIKU WYBRANEJ NOTATKI do zmiennej
function playNote(_noteName){
    noteName = _noteName;
    setAudio(noteName);
}
//======================funkcja aktualizuje dane o notatce na stronie z odtwarzaniem
function setAudio(src){
    //sprawdzamy czy jest już jakiś plik załadowany do zmiennej
    if(currentMedia == null){
        //jeśli nie to tworzymy nowy
        currentMedia = new Media(currentDir.fullPath + "/" + src, onSucces, onError);
        //currentMedia = new Media("http://kosmiczny-kaloryfer.com/people/mellrebook/Fire.wav", onSucces, onError);
    }else{
        //jeśli tak to czyścimy zmienną i tworzymy świeżą
        currentMedia.release();
        currentMedia = null;
        currentMedia = new Media(currentDir.fullPath + "/" + src, onSucces, onError);
        //currentMedia = new Media("http://kosmiczny-kaloryfer.com/people/mellrebook/Fire.wav", onSucces, onError);
    }
    //wycinamy nazwę pliku bez rozszerzenia i podstawiamy na odpowiednie miejsce
    $('#current-name').html(src.substring(0,src.lastIndexOf('.')));

    //dodajemy informacje o długości, sprawdzając czy plik jest dłuższy niż 0s
    if(duration!=-1){
        //jeśli plik nie jest pusty używamy naszej funkcji i akutalizujemy informację
        setCurrentTime(0, duration);
    }else{
        //jeśli plik jest pusty podstawiamy na sztywno informację o długości 0s (jest to operacja bardziej estetyczna, w końcu lepiej wygląda 00 / 00 s. niż 00 / -1 s.)
        setCurrentTime(0, 0);
    }
}




//funkcja, która akutalizuje czas w timerze, przyjmuje aktualną pozycję odtwarzania w sekundach


//nasza funkcyjka aktualizująca czas oddtwarzania, przyjmuje aktualny czas odtwarzania i długość odtwarzanego pliku
function setCurrentTime(_curr, _dur){
    //zmiany kosmetycznie 
    if(_curr==-1){_curr = 0;}
    if(_dur==-1){_dur = 0;}
    //podstawiamy do odpowiedniego miejsca informację
    $('#current-time').html(Math.floor(_curr) +" / "+ Math.floor(_dur) +" s.");
}


//funkcja pauzująca odtwarzanie
function pauseAudio(){
    //sprawdzamy czy mamy plik załadowany do zmiennej
    if(currentMedia!=null){
        //jeśli tak to możemy go zapauzować
        currentMedia.pause();
    }
}

//funkcja zatrzymująca odtwarzanie
function stopAudio(){
    //sprawdzamy czy mamy co zatrzymać
    if(currentMedia){
        //jeśli tak to zatrzymujemy
        currentMedia.stop();
    }

    //sprawdzamy czy mamy timer
    if(mediaTimer){
        //jeśli tak to czyścimy timer
        clearInterval(mediaTimer);
        mediaTimer = null;
    }
}

//funkcja wypisująca szczegóły udanych operacji
function onSucces(e){
    console.log(e);
}

//funkcja wypisująca błędy
function onError(e){
    console.log(e);
}

//=====================funkcja oddtwarzająca aktualny plik
function playAudio(){
    //sprawdzamy czy mamy załadowany plik do zmiennej
    if(currentMedia!=null){
        //jeśli tak to oddtwarzamy go
        currentMedia.play();
        //sprawdzamy czy mamy ustawiony timer do aktualizacji czasu
        if(mediaTimer==null){
            //jeśli nie to tworzymy nowy z czasem odstępu 1000ms
            mediaTimer = setInterval(
                function(){
                    //zczytujemy długość pliku w sekundach, musimy to robić w intervalu aby plik się zbuforował
                    duration = currentMedia.getDuration();
                    // funkcja .getCurrentPosition przyjmuje funkcje, dlatego tworzymy nową w środku struktury
                    currentMedia.getCurrentPosition(
                        function(position){
                            if(position>-1){
                                //jeśli nie to aktualizujemy
                                setCurrentTime(position, duration);
                            }
                        },
                        //funkcja zwracająca błędy 
                        function(e) {
                            console.log(e);
                        }
                        );
                },1000);
        }
    }
    
}

//=====================/odtwarzanie audio=======================

//////////////////////////////////////////////////////////////////Start Recording Notes? Tak to sie pisze?
function startRecording(){
    newNoteName = $("#file_name").val();

    if(newNoteName != ""){
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
    }else{
        alert("Podaj najpierw nazwe notatki;");
        $("#file_name").focus();
    }


}
function errorSound(e){
    alert(e);
}


function recordSound(){
    mSekInt = setInterval(function() {
        mSek++;
        if(mSek >= 100)
            mSek = 0;
        console.log(mSek);
        $("#rec-time").text("Time: "+min+":"+sek+":"+mSek);
    }, 10);
    //
    sekInt = setInterval(function() {
        sek++;
        if(sek >= 60)
            sek = 0;
        console.log(sek);
    }, 1000);
    //
    minInt = setInterval(function() {
        min++;
        console.log(min);
    }, 1000*60);


    currentDir.getFile(newNoteName, {create: true}, function() {
        navigator.audio = new Media(currentDir.fullPath + "/" + newNoteName, recording_success, recording_failure);
        navigator.audio.startRecord();
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
    window.clearInterval(sekInt);
    window.clearInterval(minInt);
    window.clearInterval(mSekInt);

    navigator.audio.stopRecord();
    listFiles(currentDir);
    recording = false;
    min = 0;
    sek = 0;
    mSek = 0;
    $("#rec-time").text("Time: "+min+":"+sek+":"+mSek);
    
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
    mSek = 0;
    sek = 0;
    min = 0;
    //player
    currentMedia = null;
    mediaTimer = null;
    duration = 0;
});