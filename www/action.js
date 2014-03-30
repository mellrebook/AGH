$(document).ready(function () {


    $("#add-stop").click(function () {
        $('#route-list li:last').before('<li><p><input type="text"/></p></li>');
        $("input:last").focus();
        $("li input").change(function () {
            $(this).parent().html('<p>' + $(this).val() + '</p>');
        });


    });
    $("#tick").click(function () {
        var whence = $("#whence").val();
        var where = $("#where").val();
        var lineNumber = $("#line-number").val();
        var busStop = [];
        var stops = "";
        $("li").each(function () {
            busStop.push($(this).text());
        });
        stops = JSON.stringify(busStop);
        //console.log(stops, whence, where, lineNumber);
        $.ajax({
            type: "POST",
            url: "http://www.aikido-kaak.pl/pudel/php.php",
            data: { name: "John", location: "Boston" }
        }).done(function (msg) {
            $(".content").append(msg);
            //alert("Data Saved: " + msg);
        });
    });
});