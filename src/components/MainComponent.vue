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
        { title: "Directions To Here", value: 2 },
        { title: "Directions Via Here", value: 3 },
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
      this.$refs.menu.close();

      let data = {
        action: action,
        lat: getMapLatLng().lat,
        lon: getMapLatLng().lng
      };

      this.$socket.client.emit('reverse_geoname_search', data);
    }
  },
  computed: mapState(['routeType']),
  mounted() {
    setTimeout(() => {
      this.isSplashLoading = false;
    }, 1000);
    createMap();
  },
  sockets: {
    reverse_geoname_result(data) {
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
}

#mapid {
  height: 100vh;
}

/*Removes the scroll bar*/
html, body {
  overflow: hidden;
}
</style>