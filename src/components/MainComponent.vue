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
      ],
      ContextMenuActions: Object.freeze(
        {
          FROM: 1,
          TO: 2,
          VIA: 3
        }),
      searchResult: ""
    };
  },
  methods: {
    contextMenuAction(action) {
      this.$refs.menu.close();
      console.log(action);
      console.log(getMapLatLng());

        let data = {
          lat: getMapLatLng().lat,
          lon: getMapLatLng().lng
        };

        switch (action) {
          case this.ContextMenuActions.FROM:
            console.log("from");
            this.$socket.client.emit('reverse_geoname_search', data);
            console.log(this.searchResult);
            // this.$store.commit('SET_START_NODE', result);
            // TODO: geoname reverse lookup, add ot the start point, override if already exists
            break;
          case this.ContextMenuActions.TO:
            this.$socket.client.emit('reverse_geoname_search', data);
            // TODO: geoname reverse lookup, add ot the end point, override if already exists
            console.log("to");
            // this.$store.commit('SET_END_NODE', result);
            break;
          case this.ContextMenuActions.VIA:
            this.$socket.client.emit('reverse_geoname_search', data);
            // TODO: geoname reverse lookup, add as additional point, add onto additional nodes
            console.log("via");
            break;
          default:
            console.log(action);
        }
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
      reverse_geoname_search(data) {
        this.searchResult = data.geonames;
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