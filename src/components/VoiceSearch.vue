<template>
  <div class="voice-box">
    <div class="voice-header">
      <button v-if="isRecognition" @click="voiceRecognitionOff">音声認識 停止</button>
      <button v-else               @click="voiceRecognitionOn">音声認識 開始</button>
      <div v-if="notSupport">音声の受信のみ(サポートされていないブラウザです)</div>
      <div v-else>Voice: {{nowText}}</div>
    </div>
    <div class="voice-text" v-for="(log,i) in voiceLogsGetter()" :key="i">
      <a
       target="_blank"
       :href="'https://www.google.co.jp/search?sitesearch=yugioh-wiki.net&domains=yugioh-wiki.net&q=' + log.text"
      >
      {{log.text}}
      </a>
      <br/>
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapState } = createNamespacedHelpers("voicelog");

export default {
  data(){
    return {
      recognition : null,
      isRecognition: false,
      notSupport: false,
      nowText : '',
      logTexts : []
    }
  },
  computed: {
    ...mapState([
      "voicelogs"
    ]),
  },
  methods: {
    ...mapActions([
      "initializeVoiceLog",
      "updateVoiceLogs"
    ]),
    voiceLogsGetter(){
      return Array.isArray(this.voicelogs) ? this.voicelogs : []
    },
    async voiceRecognitionOn(){
      await this.initializeVoiceLog()
      this.isRecognition = true
      const speechRecognition = window.SpeechRecognition||window.webkitSpeechRecognition

      if(speechRecognition == null){
        this.notSupport = true
        return
      }

      this.recognition = new speechRecognition();
      let recognition = this.recognition
      //var grammar = '#JSGF V1.0 JIS;language ja; grammar monstars; public <monstars> = "手札から" | "六花精スノードロップ" | "六花のヒトヒラ";'
      //var speechRecognitionList = new (window.SpeechGrammarList || window.webkitSpeechGrammarList)();
      //speechRecognitionList.addFromString(grammar, 10);
      //recognition.grammars = speechRecognitionList;
      recognition.lang = 'ja-JP';
      recognition.interimResults = true;
      recognition.maxAlternatives = 2;
      recognition.onerror = () => {
        console.log('Speech recognition error detected: ' + event.error);
      };
      recognition.onstart = () => {
        console.log('start')
      };
      recognition.onend = () => {
        console.log('end')
        if (this.nowText != ''){
          this.updateVoiceLogs(this.nowText)
          this.nowText = ''
        }

        if(this.isRecognition == true) {
          recognition.start();
        }
      }
      recognition.onresult = (event) => {
        console.log(event)
        this.nowText = event.results[0][0].transcript;
      }
      recognition.start();
    },
    voiceRecognitionOff(){
      this.isRecognition = false
      if(this.notSupport){ return }
      this.recognition.stop();
    },
  }
}
</script>
<style>
.voice-box {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.voice-header {
  display: flex;
  align-items: baseline;
  justify-content: start;
  max-width: 40vw;
  width: 100%;
  border: 1px grey solid;
}
.voice-text {
  max-width: 40vw;
  width: 100%;
  border: 1px rgba(255, 0, 0, 0.4) solid;
}
</style>
