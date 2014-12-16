
function formatSeconds(seconds) {
  var date = new Date(1970,0,1);
  date.setSeconds(seconds);
  return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}

function formatSrtTime(seconds) {
  var msecs = (seconds % 1).toFixed(3).toString().split('.')[1] || 0;
  var formatedTime = formatSeconds(seconds);
  var srtTime = formatedTime + "," + msecs;
  return srtTime;
}

function buildSubtitle(id, startTime, endTime, text){
  var subtitle = new Object();
  subtitle.id = id;
  subtitle.startTime = startTime;
  subtitle.endTime = endTime;
  subtitle.text = text;
  return subtitle;
}

function getNextId(subtitlesArray){
  if(subtitlesArray.length > 0){
    var lastId = subtitlesArray[subtitlesArray.length - 1]["id"];
    return lastId + 1;
  }
  else{
    return 1;
  }
}

function formatSrtSubtitleString(subtitle){
  // numéro du sous-titre
  // Temps de départ --> temps de fin
  // Texte du sous-titre (peut être sur plusieurs lignes)
  // [Ligne vide]

  var subtitleString = "";
  subtitleString += subtitle.id.toString();
  subtitleString += "\n";
  subtitleString += formatSrtTime(subtitle.startTime);
  subtitleString += " --> ";
  subtitleString += formatSrtTime(subtitle.endTime);
  subtitleString += "\n";
  subtitleString += subtitle.text;
  subtitleString += "\n";
  subtitleString += "\n";

  return subtitleString;
}

function formatSubtitleDOM(subtitle) {
  var newSub = $("#sub-base").clone().removeClass("hidden").addClass("sub-item").removeAttr("id");
  newSub.find(".sub-start input").val(formatSrtTime(subtitle.startTime));
  newSub.find(".sub-end  input").val(formatSrtTime(subtitle.endTime));
  newSub.find(".sub-duration input").val(formatSrtTime(subtitle.endTime - subtitle.startTime));
  newSub.find(".sub-text input").val(subtitle.text);

  return newSub;

}

function updateResultFromSubtitleList() {
  $( "#sub-result textarea" ).val("");
  var id = 0;
  $(".sub-item").each(function(){
    var subtitleString = "";
    subtitleString += ++id;
    subtitleString += "\n";
    subtitleString += $(this).find(".sub-start input").val();
    subtitleString += " --> ";
    subtitleString += $(this).find(".sub-end input").val();
    subtitleString += "\n";
    subtitleString += $(this).find(".sub-text input").val();
    subtitleString += "\n";
    subtitleString += "\n";

    $( "#sub-result textarea" ).val($( "#sub-result textarea" ).val() + subtitleString);
  });
}

var subtitles = []
var currentSubStartTime = "";
var currentSubEndTime = "";
var currentSubText = "";

$( "#start-button" ).click(function() {
  // set start subtime
  currentSubStartTime = player.getCurrentTime();

  // set color button sucess
  $( "#start-button" ).addClass("button-sucess");

  // alert( "Handler for start-button .click() called." );
});

$( "#end-button" ).click(function() {
  // set end subs time
  currentSubEndTime = player.getCurrentTime();

  // pause video
  player.pauseVideo();

  // show sub-entry-form
  $( "#save-button" ).show();

  // alert( "Handler for end-button .click() called." );
});

$( "#sub-text" ).keyup(function() {
  currentSubText = $("#sub-text").val();
  // alert( "Handler for .keyup() called." );
});

$( "#save-button" ).click(function() {
  // append subtitle object to subtitles array
  sub = buildSubtitle(
    getNextId(subtitles),
    currentSubStartTime,
    currentSubEndTime,
    currentSubText
  );
  subtitles.push(sub);

  // append subtitle to subs-result
  subtitleString = formatSrtSubtitleString(sub);
  $( "#sub-result textarea" ).val($( "#sub-result textarea" ).val() + subtitleString);

  // append subtitle to subs-list
  subtitleDOM = formatSubtitleDOM(sub);
  console.log(subtitleDOM);
  $( "#sub-list" ).append(subtitleDOM);

  console.log(subtitleString);

  // clear sub-text
  $( "#sub-text" ).val("");

  // hide sub-entry-form
  $( "#save-button" ).hide();

  // alert( "Handler for save-button .click() called." );
});

$(".tabpanel .nav-tabs li a").each(function(){
  if(!$(this).parent().hasClass("pure-menu-selected")) {
    $($(this).attr("href")).hide();
  }

});

$(".tabpanel .nav-tabs li a").click(function(e) {
  e.preventDefault();
  $(".tabpanel .nav-pane").hide();
  $($(this).attr("href")).show();
  $(".tabpanel .nav-tabs li").removeClass("pure-menu-selected");
  $(this).parent().addClass("pure-menu-selected")
});

$("#sub-download").click(function(){
  var fileLink = window.document.createElement('a');
  var content = $( "#sub-result textarea" ).val();
  fileLink.href = window.URL.createObjectURL(new Blob([content], {type: 'text/plain'}));
  fileLink.download = 'subtitle.srt';

  // Append anchor to body.
  document.body.appendChild(fileLink)
  fileLink.click();

  // Remove anchor from body
  document.body.removeChild(fileLink)
});

$("#sub-list").delegate("input","change", function(){
  updateResultFromSubtitleList();
});

function stringToTime(stringTime) {
  h = stringTime.split(":")[0];
  min = stringTime.split(":")[1];
  s = stringTime.split(":")[2].split(",")[0];
  ms = stringTime.split(":")[2].split(",")[1];
  return new Date(0,0,0,h,min,s,ms);
}

function secondsToTime(seconds) {
  return new Date(0,0,0,0,0,0,seconds * 1000);
}

function addToSubtitlesContainer(text) {
  var element = $("<div><span class='player-sub'>"+ text +"</span></div>");
  $("#player-sub-container").append(element);
}

function clearSubtitlesContainer() {
  $("#player-sub-container").html("");
}


function updateSubtitlesContainer() {
  var playerCurrentTime = secondsToTime(player.getCurrentTime());
  clearSubtitlesContainer();
  $("#sub-list").find(".sub-item").each(function(){
    var subStartTime = stringToTime($(this).find(".sub-start input").val());
    var subEndTime = stringToTime($(this).find(".sub-end input").val());
    if(subStartTime <= playerCurrentTime && subEndTime >= playerCurrentTime) {
      var subText = $(this).find(".sub-text input").val();
      addToSubtitlesContainer(subText);
    }
  });
}
