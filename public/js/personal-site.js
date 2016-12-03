$('document').ready(function() {
    'use strict';

    var pixelWidth = screen.width;
    var pixelHeight = screen.height;


    $('.parallax').scroll(function(){
        $(".coverDiv").css("opacity", 1 - $('.parallax').scrollTop() / 200);
    });

    $('.parallax').scroll(function(){
        $(".content1").css("opacity", 0 + $('.parallax').scrollTop() / 400);
    });


});
