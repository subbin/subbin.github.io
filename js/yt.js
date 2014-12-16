// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    width: '100%',
    videoId: 'M7lc1UVf-VE',
    events: {
      'onReady': onPlayerReady
      // 'onStateChange': onPlayerStateChange
    }
  });
}

function setSrtDuration() {
  var dur = formatSrtTime(player.getCurrentTime());
  //console.log("setSrtDuration: " + dur);
  $('#time').html(dur);
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  // stuff to do when player is ready
  var time = setInterval(updateSubtitlesContainer, 100);
}
