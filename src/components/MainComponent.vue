<script>
import SplashScreen from "./SplashScreen";
import LoadingScreen from "./LoadingScreen";
import Search from "./Search";
import ContextMenu from "./ContextMenu/ContextMenu";
import ContextMenuItem from "./ContextMenu/ContextMenuItem";

import { createMap, getMapLatLng } from '../js/map';
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
        { title: "Directions From Here", value: 1 },
        { title: "Directions To Here", value: 2 },
        { title: "Directions Via Here", value: 3 },
      ]
    }
  },
  methods: {
    contextMenuAction(action) {
      this.$refs.menu.close();
      console.log(action);
      console.log(getMapLatLng());

      switch (action) {
          //TODO: Context menu options
      }
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

      <LoadingScreen v-if="routeType" v-bind:type="routeType"></LoadingScreen>

      <div id="mapid" @contextmenu.prevent="$refs.menu.open($event, 'Payload')">
        <ContextMenu ref="menu">
          <template slot-scope="{ contextData }">
            <ContextMenuItem v-for="cmi in contextMenuItems" :key="'CMI' + cmi.value" @click.native="contextMenuAction(cmi.value)">
              {{ cmi.title }}
            </ContextMenuItem>
          </template>
        </ContextMenu>
      </div>
      <Search></Search>
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
</style>