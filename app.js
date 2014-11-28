
function formatSeconds(seconds) {
  var date = new Date(1970,0,1);
  date.setSeconds(seconds);
  return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}

function formatSrtTime(seconds) {
  var msecs = (seconds % 1).toString().split('.')[1];
  msecs = msecs.substring(0, 3);
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
