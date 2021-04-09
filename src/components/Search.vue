<script>
import axios from "axios";
import Swal from "sweetalert2";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBicycle,
  faCar,
  faChevronDown,
  faChevronLeft,
  faChevronUp,
  faClock,
  faDirections,
  faFileExport,
  faPlus,
  faRetweet,
  faRoute,
  faSearch,
  faTimes,
  faTruck,
  faWalking
} from "@fortawesome/free-solid-svg-icons";

import NodeSearch from "./NodeSearch";

import { Algorithms, Flags } from "../js/constants";
import { addDottedLine, addGeoJSON, removeAllMarkers, removeGeoJSON, removeRoute, reverseMarkers } from "../js/map";
import { mapState } from "vuex";

library.add(faCar, faBicycle, faWalking, faTruck, faPlus, faRetweet, faTimes, faSearch, faRoute, faClock, faFileExport, faDirections,
  faChevronUp, faChevronDown, faChevronLeft);

export default {
  name: 'search',
  components: {
    NodeSearch
  },
  data: function () {
    return {
      searchTypes: [
        { type: 'driving', icon: 'car', flag: Flags.CAR },
        { type: 'cycling', icon: 'bicycle', flag: Flags.BIKE },
        { type: 'walking', icon: 'walking', flag: Flags.FOOT },
        { type: 'courier', icon: 'truck', flag: Flags.CAR }],
      activeType: {},
      Algorithms: Algorithms,
      algorithmType: Algorithms.BI_ASTAR,
      visualisation: false,
      routeDetailsDownload: {},
      expandRouteDetails: false,
      distance: '',
      time: '',
      routeDetails: false,
      expand: false,
      hideSearchView: false
    };
  },
  methods: {
    setActiveType(type) {
      this.activeType = type;
    },
    addNode() {
      this.$store.commit('PUSH_NODE', { id: Math.random(), data: {} });
    },
    goButtonClick: function () {
      if (!this.startNode?.lat || !this.endNode?.lat) {
        Swal.fire({
          title: 'Missing Locations',
          text: 'You haven\'t selected enough locations!',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        return;
      }

      removeGeoJSON();

      this.$store.commit('SET_ROUTE_LOADING', this.activeType.type);

      let params = {
        source: this.startNode.lat + ',' + this.startNode.lon,
        target: this.endNode.lat + ',' + this.endNode.lon,
        algorithmType: this.algorithmType,
        visualisation: this.visualisation ? 1 : 0,
        flag: this.activeType.flag
      };

      let nodes = this.additionalNodes.map(({ data: { lat, lon } }) => {
        return { lat: lat, lon: lon };
      });
      if (nodes.length)
        params.additionalNodes = nodes;

      axios.get('/route', {
        params: params
      }).then(response => {
        let err = response?.data?.error?.code;
        if (err && err < 0) {
          Swal.fire({
            title: 'Calculation Timeout',
            text: 'Could not find your route.',
            icon: 'error',
            confirmButtonText: 'Ok'
          }).then(() => console.log('Not enough nodes'));
          return;
        }

        let time = 0, distance = 0;
        let downloadRoute = [];

        for (let route of response.data) {
          let startLatLng = [[route.source_point.lat, route.source_point.lng], [route.start_point.lat, route.start_point.lng]];
          let targetLatLng = [[route.target_point.lat, route.target_point.lng], [route.end_point.lat, route.end_point.lng]];
          addDottedLine(startLatLng);
          addDottedLine(targetLatLng);

          if (route.branch)
            for (let branch of route.branch)
              addGeoJSON(branch.route, branch.cost, branch.distance);

          time += route.time;
          distance += route.distance;
          downloadRoute.push(route.route);

          if (route.history)
            console.log(route.history);
          // setRouteHistory(route.history);
          else
            addGeoJSON(route.route, 0, 0, 0, 0, "crimson", 3);
        }

        this.setRouteDetails(distance, this.formatTime(time));
        this.routeDetailsDownload = JSON.stringify(downloadRoute);

      }).finally(() => {
        this.$store.commit('SET_ROUTE_LOADING', null);
      });
    },
    deleteNode(id) {
      this.additionalNodes = this.additionalNodes.filter(node => node.id !== id);
    },
    expandSearchView() {
      this.expand = !this.expand;
    },
    collapseSearchView() {
      this.hideSearchView = !this.hideSearchView;
    },
    reverseWayPoints() {
      this.$store.dispatch('swapNodes');
      reverseMarkers();
    },
    clearRoute() {
      this.$store.dispatch('clearNodes');

      removeAllMarkers();
      removeRoute();
      removeGeoJSON();

      this.routeDetails = false;
    },
    setRouteDetails(distance, time) {
      this.routeDetails = true;
      this.distance = Math.round(distance * 100) / 100;
      this.time = time;
    },
    downloadRoute() {
      const blob = new Blob([this.routeDetailsDownload], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'route.json';
      link.click();
      URL.revokeObjectURL(link.href);
    },
    formatTime(time) {
      let routeTime = parseFloat(time);
      if (routeTime < 60) {
        let minutes = Math.ceil(routeTime);
        minutes = (minutes < 2) ? minutes += 'min' : minutes += ' mins';
        return minutes;
      } else {
        let hours = Math.floor(routeTime / 60);
        let minutes = Math.ceil((routeTime % 60));
        minutes = (minutes < 2) ? minutes += 'min' : minutes += ' mins';
        hours = (hours < 2) ? hours += ' hr' : hours += ' hrs';
        return hours + ' ' + minutes;
      }
    }
  },
  created: function () {
    this.activeType = this.searchTypes[0];
  },
  computed: mapState(['startNode', 'endNode', 'additionalNodes'])
};
</script>

<template>
  <div class="search-view" v-bind:class="{ 'show-search-view': hideSearchView }">
    <div class="box search-view-content">
      <div class="search-view-header">
        <p>Direction Finding Using OSM</p>
      </div>
      <div class="search-view-section">
        <div class="card">
          <div id="transport-icons">
            <ul>
              <li v-for="searchType in searchTypes" class="sv-icon" v-bind:class="{ 'sv-icon-active': activeType.type === searchType.type }"
                  v-bind:title="searchType.type" @click="setActiveType(searchType)" :key="searchType.type">
                <font-awesome-icon :icon="searchType.icon" />
              </li>
              <!-- TODO: Add more gifs for bus and truck? -->
            </ul>
          </div>
        </div>
        <div class="sv-inputs">
          <!-- Templating for search nodes, done by Vue Component -->
          <NodeSearch :id="0" :index="0" :node-data="startNode"></NodeSearch>
          <NodeSearch v-for="(child, index) in additionalNodes" :id="child.id" :key="child.id" :index="index+1"
                      :node-data="child.data">
            <hr class="search-inputs-hr">
          </NodeSearch>
          <hr class="search-inputs-hr">

          <NodeSearch :id="-1" :index="-1" :node-data="endNode"></NodeSearch>
        </div>
        <div class="sv-item">
          <button :disabled="additionalNodes.length >= 5" class="button add-node" title="Add location"
                  @click="addNode">
            <font-awesome-icon icon="plus"/>
          </button>
          <button class="button reverse-waypoints" title="Reverse waypoints" @click="reverseWayPoints">
            <font-awesome-icon icon="retweet"/>
          </button>
          <button class="button reverse-waypoints" title="Clear route" @click="clearRoute">
            <font-awesome-icon icon="times"/>
          </button>
          <div id="search-btn">
            <button id="go-button" class="button is-rounded" title="Find route" @click="goButtonClick">
              <div class="icon is-small">
                <font-awesome-icon icon="search"/>
              </div>
            </button>
          </div>
        </div>

        <div v-if="routeDetails" class="route-details">
          <font-awesome-icon icon="route"/>
          <strong class="route-stats">{{ distance }} km</strong>
          <strong class="route-stats">&lt;-&gt;</strong> <!-- <-> -->
          <strong class="route-stats">{{ time }}</strong>
          <font-awesome-icon icon="clock"/>
          <a class="route-details-download route-download-icon" title="Export Route" @click="downloadRoute">
            <font-awesome-icon icon="file-export"/>
          </a>
        </div>

        <div class="addition-settings" v-bind:class="{ expand: expand }">
          <hr style="margin: 1px">
          <div class="algorithm-radio-buttons">
            <strong class="start-end-strong">Select an algorithm</strong>
            <div class="control" style="padding-left: 24px;">
              <label class="radio">
                <input v-model="algorithmType" :value="Algorithms.DIJKSTRA" type="radio">
                Dijkstra
              </label>
              <br>
              <label class="radio">
                <input v-model="algorithmType" :value="Algorithms.BI_DIJKSTRA" type="radio">
                Bi-directional Dijkstra
              </label>
              <br>
              <label class="radio">
                <input v-model="algorithmType" :value="Algorithms.ASTAR" type="radio">
                A*
              </label>
              <br>
              <label class="radio">
                <input v-model="algorithmType" :value="Algorithms.BI_ASTAR" checked type="radio">
                Bi-directional A*
              </label>
            </div>
          </div>
          <div id="visualisation-checkbox" class="algorithm-radio-buttons">
            <label class="checkbox">
              <input v-model="visualisation" type="checkbox">
              <strong class="start-end-strong">Visualisation</strong>
            </label>
          </div>
        </div>
        <div class="algorithm-radio-dropdown">
          <button class="button is-rounded is-small expand-search-view-button phone-expand" title="Additional Settings"
            @click="expandSearchView">
              <span v-show="expand" style="color:crimson">
                  <font-awesome-icon icon="chevron-up" size="lg"/>
              </span>
            <span v-show="!expand" style="color:crimson">
              <font-awesome-icon icon="chevron-down" size="lg"/>
            </span>
          </button>
        </div>
      </div>
    </div>
    <div v-show="hideSearchView" class="search-view-collapse-button" @click="collapseSearchView">
      <font-awesome-icon icon="chevron-left"/>
    </div>
    <div v-show="!hideSearchView" class="box minimised-search-view minimised-search-view-icon" @click="collapseSearchView">
      <font-awesome-icon icon="directions"/>
    </div>
  </div>
</template>

<style>
.show-search-view {
  visibility: visible !important;
}

.search-view {
  transition: opacity 2.5s;
  width: 375px;
  opacity: 0.5;
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 5000;
}

.search-view-collapse-button {
  color: crimson;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  float: right;
  width: 40px;
  height: 90px;
  margin-right: -40px;
  margin-top: -60%;
  background-color: white;
  box-shadow: 0 0 5px 0 rgb(233, 233, 233);
  visibility: hidden;
}

.search-view-expand-button {
  top: 10px;
  left: 10px;
  box-shadow: 0 0 5px 5px rgb(233, 233, 233);
  visibility: hidden;
  padding: 26px;
  background: white;
  position: absolute;
}

.collapse {
  color: crimson;
  font-size: 2rem;
  margin-left: 18%;
  margin-top: 77%;
}

.search-view-content {
  background: white;
  overflow: hidden;
}

.search-view:hover {
  opacity: 1;
  transition: opacity 0.3s;
}

.search-view-header {
  margin: -20px -20px 0 -20px;
  background: crimson;
  color: white;
  font-weight: bold;
  font-size: large;
  letter-spacing: 0.04em;
  padding: 4px 8px;
  text-align: center;
}

#transport-icons {
  margin: 8px;
  display: flex;
  justify-content: center;
  letter-spacing: 24px;
}

.sv-icon {
  padding: 0 16px;
  display: inline;
  font-size: 1.4rem;
}

.sv-icon-active {
  color: crimson;
}

.search-view-section {
  padding: 8px 8px 0 8px;
  flex-wrap: wrap;
}

.sv-inputs {
  margin-top: 8px;
  margin-bottom: 8px;
}

.search-inputs-hr {
  margin: 2px;
}

.sv-item {
  margin: 4px;
}

.button {
  border: none !important;
  background: none;
}

.add-node {
  padding: 4px;
  font-size: 1.4rem;
  height: 100%;
  display: inline;
  margin: -1px;
}

#search-btn {
  float: right;
}

.start-end-strong {
  padding-left: 12px;
  margin: 4px;
}

.button:hover {
  color: crimson;
}

#go-button {
  background-color: crimson;
  color: white;
}

.reverse-waypoints {
  padding: 4px;
  font-size: 1.4rem;
  height: 100%;
  display: inline;
}

.cancel-route {
  font-size: 1.4rem;
  height: 100%;
  float: right;
  padding: 0;
}

.sv-icon:hover {
  color: crimson;
  cursor: pointer;
}

.pageloader {
  background: crimson !important;
}

.pageloader .title {
  letter-spacing: 1px !important;
  font-size: 22px !important;
}

#loading-background {
  background-color: rgba(255, 255, 255, 0.4);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 5001;
  backdrop-filter: blur(2px);
}

.finding-route-card {
  width: 350px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 1);
  position: absolute;
  z-index: 5005;
  border-radius: 6px;
  top: 50%;
  left: 50%;
  margin: -67px 0 0 -172px; /* apply negative top and left margins to truly center the element */
}

.finding-route-text {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.gifs {
  display: block;
  margin-top: 25px;
  margin-left: auto;
  margin-right: auto;
  width: 300px;
}

.walking-gif {
  margin-top: 25px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 150px;
  height: 250px;
}

.location-button {
  padding: 100px;
  position: absolute;
  right: 0;
  bottom: 0;
}

.search-menu-item {
  cursor: pointer;
  padding: 8px;
  width: 100%;
}

.search-menu-item:hover {
  background-color: #ececec;
}

.search-menu-item-addr {
  color: #666666;
  font-size: small;
}

.addition-settings {
  display: none;
  padding-top: 12px;
  font-size: 18px;
}

.algorithm-radio-dropdown {
  text-align: center;
}

.algorithm-radio-buttons {
  padding-top: 4px;
  margin-bottom: -6px;
}

.expand-search-view-button {
  background-color: transparent;
  text-align: center;
  padding-top: 8px;
}

.expand {
  display: block;
  overflow: hidden;
  padding-bottom: 8px;
}

.route-details {
  /*display: none;*/
  text-align: center;
  padding: inherit;
}

.route-stats {
  padding-right: 4px;
}

.route-stats-icon {
  font-size: 1.4rem;
  margin-bottom: -2px;
}

.route-download-icon {
  margin-left: 12px;
  font-size: 1.3rem;
  margin-bottom: -2px;
  color: crimson;
  cursor: pointer;
}

#visualisation-checkbox {
  padding: 8px 0 0 8px;
}

.minimised-search-view-icon {
  color: crimson;
  font-size: 5rem;
}

.minimised-search-view {
  top: 0;
  left: 0;
  visibility: hidden;
  padding: 26px;
  background: white;
  position: absolute;
  z-index: 5001;
}

/* MEDIA QUERIES FOR MOBILE USE */
@media (max-width: 768px) {
  .search-view {
    width: calc(100% - 175px);
    top: 10px;
    left: 10px;
    zoom: 1.2;
    visibility: hidden;
  }

  .search-view-section {
    padding: 4px 4px 0 4px;
  }

  #transport-icons {
    margin: 2px;
  }

  .sv-icon {
    padding: 0 28px;
    font-size: 2.6rem;
  }

  .sv-inputs {
    margin-top: 12px;
    zoom: 1.8;
  }

  .search-view-header {
    padding: 0;
    font-size: 32px;
  }

  .add-node {
    font-size: 2.4rem;
  }

  .reverse-waypoints {
    font-size: 2.4rem;
  }

  #go-button {
    font-size: 1.8rem;
  }

  .addition-settings {
    font-size: 2rem;
  }

  .control {
    font-size: 1.6rem;
  }

  .search-inputs-hr {
    visibility: hidden;
  }

  .phone-expand {
    font-size: 1.4rem !important;
  }

  .route-details {
    font-size: 2rem;
  }

  .route-stats-icon {
    font-size: 2.2rem;
  }

  .route-details-download {
    font-size: 2rem;
  }

  #splash-screen * {
    zoom: 1.8;
  }

  .minimised-search-view {
    visibility: visible;
  }

  .search-view-collapse-button {
    visibility: visible;
  }

  .search-view-expand-button {
    visibility: visible;
  }
}
</style>