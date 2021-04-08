<script>
import SplashScreen from "./SplashScreen";
import LoadingScreen from "./LoadingScreen";
import Search from "./Search";
import ContextMenu from "./ContextMenu/ContextMenu";
import ContextMenuItem from "./ContextMenu/ContextMenuItem";

import { allRoads, createMap, getMapLatLng } from '../js/map';
import { mapState } from "vuex";

export default {
  name: 'MainComponent',
  components: {
    LoadingScreen,
    SplashScreen,
    Search,
    ContextMenu,
    ContextMenuItem
  },
  data: function () {
    return {
      isSplashLoading: true,
      contextMenuItems: [
        {title: "Directions From Here", value: 1},
        {title: "Directions To Here", value: 2},
        {title: "Directions Via Here", value: 3},
      ]
    }
  },
  methods: {
    contextMenuAction(action) {
      this.$refs.menu.close();
      console.log(action);
      console.log(getMapLatLng());

      switch (action) {

      }
    },

    allRoadLeadToLimerick() {
      // Change map to light map
      this.$store.commit('SET_ROUTE_LOADING', 'all_roads')
      setTimeout(() => {
        this.$store.commit('SET_ROUTE_LOADING', null);
      }, 3000);

      allRoads();
      console.log('paddy');
    }
  },
  computed: mapState(['routeType']),
  mounted() {
    setTimeout(() => {
      this.isSplashLoading = false;
    }, 1000);
    createMap();
  }
}
</script>

<template>
  <div>
    <SplashScreen :active="isSplashLoading"></SplashScreen>
    <div v-bind:class="{ 'is-invisible': isSplashLoading }">

      <LoadingScreen v-bind:type="routeType" v-if="routeType"></LoadingScreen>

      <div id="mapid" @contextmenu.prevent="$refs.menu.open($event, 'Payload')">
        <ContextMenu ref="menu">
          <template slot-scope="{ contextData }">
            <ContextMenuItem v-for="cmi in contextMenuItems" @click.native="contextMenuAction(cmi.value)" :key="'CMI' + cmi.value">
              {{ cmi.title }}
            </ContextMenuItem>
          </template>
        </ContextMenu>
      </div>
      <Search></Search>

      <div class="box all-roads-limerick-button" @click="allRoadLeadToLimerick">
        <i class="all-roads-limerick-icon fas fa-road"></i>
      </div>
    </div>
  </div>
</template>

<style>
* {
  font-family: 'Lato', sans-serif;
}

#mapid {
  height: 100vh;
}

/*Removes the scroll bar*/
html, body {
  overflow: hidden;
}

.all-roads-limerick-button {
  visibility: hidden;
}

.all-roads-limerick-button {
  transition: opacity 2.5s;
  opacity: 0.5;
  bottom: 20px;
  left: 20px;
  padding: 16px;
  background: white;
  position: absolute;
  cursor: pointer;
  z-index: 500;
}

.all-roads-limerick-button:hover {
  opacity: 1;
  transition: opacity 0.3s;
}

.all-roads-limerick-icon {
  color: #2d456b;
  font-size: 3rem;
}
</style>