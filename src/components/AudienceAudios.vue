<template>
  <div>
    <audio v-for="(audienceStream, i) in audienceStreams" :key="i" :src="audienceStream" id=""></audio>
  </div>
</template>

<script>
  export default {
    name: "AudienceAudios",
    props: {
      audienceStreams: {
        type: Object,
      },
    },
    data() {
      return {
      };
    },
    mounted() {
    }
  }
</script>

<style scoped>

</style>