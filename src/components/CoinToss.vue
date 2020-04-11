<template>
  <div class="overlay" @click.prevent="close" v-if="true">
    <div class="table">
      <div style="display:flex">
        <div class="coin-wrap">
          <div class="coin" ref="coin">
            <div class="front">表</div>
            <div class="back">裏</div>
          </div>
        </div>
      </div>
      <div>
        <button @click.stop="toss">toss</button>
      </div>
    </div>
  </div>
</template>
<script>
  let dt = 20;
  export default {
    methods : {
      toss(){
        let roleN = Math.random() > 0.5 ? 4 : 5
        console.log({roleN})
        this.role(roleN)
      },
      role(roleN=3){
        let time = 700
        let st = Date.now()
        let rad = 180 / (time / roleN)

        let interval = ()=>{
          let t = (Date.now() - st)
          if(t >= time) {
            this.coinStyle({
              transform : `rotateX(${(roleN*180)%360}deg)`,
              bottom : '0px'
            })
            return
          }
          this.coinStyle({
            transform : `rotateX(${(t*rad)%360}deg)`,
            bottom : Math.max(Math.sin((t / time) * Math.PI) * 200,0) + 'px'
          })
          setTimeout(interval,dt)
        }
        interval()
      },
      coinStyle(newStyle = {}){
        console.log(this.$refs['coin'])
        Object.entries(newStyle)
        .forEach(([key,value])=>{
          this.$refs['coin'].style[key] = value
        })
      }
    }
  }















</script>
<style scoped>
.overlay {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index:9999;
  background-color : rgba(0,0,0,0.4);
}
.table {
  display:flex;
  flex-direction:column;
  background-color: rgba(255,255,255,0.8);
}
.coin-wrap {
  height:300px;
  width: 200px;
  position:relative;
}
.coin {
  font-size:50px;
  width: 100px;
  height: 100px;
  perspective: 550px;
  transform-style: preserve-3d;
  position: absolute;
  bottom:0;
}
.coin > * {
  width:inherit;
  height:inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
}
.front {
  position: absolute;
  background: rgba(255,0,0,0.8);
}
.back {
  position: absolute;
  background: rgba(0,0,255,0.8);
  transform: rotateX(180deg) translateZ(2px);;
}
</style>
