<template>
  <div>
    <button @click="voiceRecognition">音声認識</button>
    <p>Voice: {{nowText}}</p>
    <p v-for="(text,i) in logTexts" :key="i">{{text}}</p>
  </div>
</template>
<script>

export default {
  data(){
    return {
      recognition : null,
      nowText : '',
      logTexts : []
    }
  },
  methods: {
    voiceRecognition(){
      //var grammar = '#JSGF V1.0 JIS;language ja; grammar monstars; public <monstars> = "手札から" | "六花精スノードロップ" | "六花のヒトヒラ";'
      let recognition = new (window.SpeechRecognition() || new window.webkitSpeechRecognition)();
      //var speechRecognitionList = new (window.SpeechGrammarList() || new window.webkitSpeechGrammarList)();
      //speechRecognitionList.addFromString(grammar, 10);
      //recognition.grammars = speechRecognitionList;
      recognition.lang = 'ja-JP';
      recognition.interimResults = true;
      recognition.maxAlternatives = 2;

      console.log(recognition)
      recognition.onerror = () => {
        console.log('Speech recognition error detected: ' + event.error);
      };
      recognition.onstart = () => {
        console.log('start')
      };
      recognition.onend = () => {
        console.log('end')
        if (this.nowText != ''){
          this.logTexts = [this.nowText,...this.logTexts]
        }
        //recognition.start();
      }
      recognition.onresult = (event) => {
        console.log(event)
        this.nowText = event.results[0][0].transcript;
      }
      recognition.start();
    }
  }
}
</script>
