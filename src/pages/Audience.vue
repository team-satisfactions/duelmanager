<template>
  <div>
    <div class="warpper">
      <div class="player-video" id="player1-video-container">
        <video
                id="player1-video"
                autoplay
                muted
                playsinline
        ></video>
      </div>

      <div class="player-video" id="player2-video-container">
        <video
                id="player2-video"
                autoplay
                muted
                playsinline
        ></video>
      </div>
    </div>
  </div>
</template>

<script>
  import skywayManagerRoom from "@/mixins/skywayManagerRoom";

  export default {
    name: "Audience",
    mixins: [skywayManagerRoom],
    methods: {
      onGetUserMediaStream(stream) {
        const videoElm = document.getElementById("player1-video");
        videoElm.srcObject = stream;
        videoElm.play();
        const videoElm1 = document.getElementById("player2-video");
        videoElm1.srcObject = stream;
        videoElm1.play();
      },
    }
  }
</script>

<style scoped>
  .player-video {
    float: left;
  }
  #player1-video-container {
    transform: rotate(-90deg);
  }
  #player2-video-container {
    transform: rotate(90deg);
  }
  #player1-video {
  }
  #player2-video {
  }
</style>