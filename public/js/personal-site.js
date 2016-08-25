// $('document').ready(function() {
// 'use strict';

var pixelWidth = screen.width;
var pixelHeight = screen.height;


$('.parallax').scroll(function(){
    $(".coverDiv").css("opacity", 1 - $('.parallax').scrollTop() / 200);
});

$('.parallax').scroll(function(){
    $(".content1").css("opacity", 0 + $('.parallax').scrollTop() / 400);
});

// CUSTOM FONT ANIMTAION from https://css-tricks.com/myth-busting-css-animations-vs-javascript/

var $text = $("#text"),
    $pause = $("#pause"),
    $reverse = $("#reverse"),
    $restart = $("#restart"),
    $speed = $("input[name='speed']"),
    $slider = $("#slider"),
    //"tl" is the timeline we'll add our tweens to. Then we can easily control the whole sequence as one object. 
    tl = new TimelineLite({onUpdate:updateSlider, onComplete:onComplete, onReverseComplete:onComplete, paused:true});

function updateSlider() {
  $slider.slider("value", tl.progress() * 100);
}
function onComplete() {
  tl.pause();
  $pause.html("play");
}

//do a simple split of the text so we can animate each character (doesn't require the advanced features of SplitText, so we just use split() and join())
$text.html("<span>" + $text.html().split("").join("</span><span>").split("<span> </span>").join("<span>&nbsp;</span>") + "</span>");

//set a perspective on the container
TweenLite.set($text, {perspective:500});

//all of the animation is created in this one line:
tl.staggerTo($("#text span"), 4, {transformOrigin:"50% 50% -30px", rotationY:-360, rotationX:360, rotation:360, ease:Elastic.easeInOut}, 0.02);

//slider and button controls from here on...
$slider.slider({
          range: false,
          min: 0,
          max: 100,
          step:.1,
        slide: function (event, ui) {
                tl.progress( ui.value / 100 ).pause();
    $pause.html("play");
        }
});
        
$pause.click(function() {
  if (tl.paused()) {
        if (tl.progress() === 1 || (tl.progress() === 0 && tl.reversed())) {
            tl.restart();
        } else {
              tl.resume();
        }
    $pause.html("pause");
  } else {
    tl.pause();
    $pause.html("resume");

  }
});

$restart.click(function(){
      tl.restart();
  $pause.html("pause");
});

$('#text').hover(function(){
    tl.restart();
});


// });
