<script>
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { addGeoJSON } from "../js/map";
import { library } from "@fortawesome/fontawesome-svg-core";
import VueSlider from 'vue-slider-component';

library.add(faPause, faPlay);

export default {
  name: "RouteHistory",
  components: {
    VueSlider
  },
  data: function () {
    return {
      historyLength: 0,
      historyIndex: 0,
      historySpeed: 100,
      historyPlaying: true,
      historyInterval: null
    };
  },
  props: { routeHistory: Array, finalRoutes: Array },
  methods: {
    setHistoryInterval() {
      if (this.historyIndex < this.historyLength)
        this.historyInterval = setInterval(this.nextHistory, 10000 / this.historySpeed);
    },
    stopHistoryInterval() {
      if (this.historyInterval)
        clearInterval(this.historyInterval);
    },
    nextHistory() {
      for (let history of this.routeHistory) {
        if (this.historyIndex >= history.length)
          continue;

        let nodes = history[this.historyIndex];

        for (let node of nodes)
          addGeoJSON(node.geojson, node.cost, node.total_cost, node.distance,
            node.distance_minutes, null, 2);
      }

      this.historyIndex++;
      if (this.historyIndex >= this.historyLength) {
        for (let route of this.finalRoutes)
          addGeoJSON(route.route, 0, 0, 0, 0, "crimson", 4);
        this.stopHistoryInterval();
      }
    },
    btnClick() {
      this.historyPlaying ? this.stopHistoryInterval(): this.setHistoryInterval();
      this.historyPlaying = !this.historyPlaying;
    }
  },
  mounted() {
    this.historyLength = 0;
    for (let history of this.routeHistory)
      if (history.length > this.historyLength)
        this.historyLength = history.length;

    this.historySpeed = this.historyLength / 5;
    if (this.historySpeed > 100)
      this.historySpeed = 100;
    this.setHistoryInterval();
  },
  beforeDestroy() {
    this.stopHistoryInterval();
  },
  watch: {
    historySpeed() {
      this.stopHistoryInterval();
      this.setHistoryInterval();
    }
  }
};
</script>

<template>
  <div v-if="routeHistory.length">
    <hr/>
    <strong class="has-text-weight-bold">History Controls</strong>
    <vue-slider v-model="historyIndex" :max="historyLength" :disabled="true" :duration="0.1" height="10px"/>
    <div class="is-flex">
      <button class="button is-rounded" @click="btnClick">
        <font-awesome-icon v-if="historyPlaying" icon="pause"/>
        <font-awesome-icon v-else icon="play"/>
      </button>
      <h5 class="is-align-self-center is-size-6 mx-2">Speed: </h5>
      <span class="is-align-self-center is-flex-grow-1 mt-1">
        <vue-slider v-model="historySpeed" :max="1000"/>
      </span>
    </div>
  </div>
</template>

<style lang="scss">
@import '~vue-slider-component/theme/antd.css';
</style>