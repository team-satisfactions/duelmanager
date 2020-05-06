<template>
  <div class="voice-box">
    <div class="voice-header">
      <button v-if="isRecognition" @click="voiceRecognitionOff">音声認識 停止</button>
      <button v-else               @click="voiceRecognitionOn">音声認識 開始</button>
      <div>Voice: {{nowText}}</div>
    </div>
    <p class="voice-text">
      <span v-for="(text,i) in logTexts" :key="i">
        &nbsp;
        <a :href="'https://www.google.co.jp/search?sitesearch=yugioh-wiki.net&domains=yugioh-wiki.net&q=' + text">{{text}}</a>
        &nbsp;
      </span>
    </p>
  </div>
</template>
<script>
export default {
  data(){
    return {
      recognition : null,
      isRecognition: false,
      nowText : '',
      logTexts : []
    }
  },
  methods: {
    voiceRecognitionOn(){
      this.isRecognition = true
      this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
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
          this.logTexts = [...this.logTexts,this.nowText]
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
      this.recognition.stop();
    }
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
  justify-content: end;
  max-width: 40vw;
  width: 100%;
}
.voice-text {
  max-width: 40vw;
}
</style>
