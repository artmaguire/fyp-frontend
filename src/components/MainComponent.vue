<script>
import { createMap, getMapLatLng } from '../js/map';

import ContextMenu from "./ContextMenu/ContextMenu";
import ContextMenuItem from "./ContextMenu/ContextMenuItem";
import LoadingScreen from "./LoadingScreen";
import { mapState } from "vuex";
import Search from "./Search";
import SplashScreen from "./SplashScreen";


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
        { title: "Directions Via Here", value: 3 },
        { title: "Directions To Here", value: 2 },
      ],
      ContextMenuActions: Object.freeze(
        {
          FROM: 1,
          TO: 2,
          VIA: 3
        })
    };
  },
  methods: {
    contextMenuAction(action) {
      if (action === this.ContextMenuActions.VIA && this.additionalNodes.length >= 5)
        return;

      this.$refs.menu.close();

      let data = {
        action: action,
        lat: getMapLatLng().lat,
        lon: getMapLatLng().lng
      };

      this.$socket.client.emit('reverse_geoname_search', data);
    }
  },
  computed: mapState(['routeType', 'additionalNodes']),
  mounted() {
    setTimeout(() => {
      this.isSplashLoading = false;
    }, 1000);
    createMap();
  },
  sockets: {
    reverse_geoname_result(data) {
      this.$store.commit('SET_ROUTE_HISTORY', []);
      switch (data.action) {
        case this.ContextMenuActions.FROM:
          this.$store.commit('SET_START_NODE', data.geoname);
          break;
        case this.ContextMenuActions.TO:
          this.$store.commit('SET_END_NODE', data.geoname);
          break;
        case this.ContextMenuActions.VIA:
          this.$store.commit('PUSH_NODE', { id: Math.random(), data: data.geoname });
          break;
      }
    }
  },
};
</script>

<template>
  <div>
    <SplashScreen :active="isSplashLoading"></SplashScreen>
    <div v-bind:class="{ 'is-invisible': isSplashLoading }">

      <LoadingScreen v-if="routeType" v-bind:type="routeType"></LoadingScreen>

      <div id="mapid" @contextmenu.prevent="$refs.menu.open($event, 'Payload')">
        <ContextMenu ref="menu">
          <template>
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
  font-weight: 400;
}

button:focus {
  box-shadow: none !important;
}

button:hover {
  box-shadow: 1px 2px 3px #bababa !important;
  transition: box-shadow 0.3s ease-in-out;
}

button:active {
  box-shadow: 1px 1px 0 #bababa !important;
  transition: box-shadow 0.1s ease-in-out;
}

#mapid {
  height: 100vh;
}

/* Removes the scroll bar */
html,
body {
  overflow: hidden;
}
</style>