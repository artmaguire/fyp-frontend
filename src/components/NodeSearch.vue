// Create a Vue Component for the node searching and dropdown list of search results
// This can be reused for all node searches
// Templating for searching
<script>

import { addMarker, getBoundsLngLat, removeGeoJSON, removeMarker } from "../js/map";

export default {
  name: 'node-search',
  data: function () {
    return {
      searchQuery: '',
      isSearching: false,
      searchTimeout: {},
      searchResults: []
    };
  },
  props: { id: Number, index: Number, nodeData: Object },
  methods: {
    searchChange: function () {
      if (this.searchTimeout)
        clearTimeout(this.searchTimeout);

      let data = {
        node: this.id,
        query: this.searchQuery,
        bounds: getBoundsLngLat()
      };

      this.searchTimeout = setTimeout(() => {
        this.$socket.client.emit('geoname_search', data);
      }, 250, data);
    },
    searchSelected: function (result) {
      removeGeoJSON();
      addMarker(result.display_place, result.lat, result.lon, this.id, this.index);

      switch (this.index) {
        case 0:
          return this.$store.commit('SET_START_NODE', result);
        case -1:
          return this.$store.commit('SET_END_NODE', result);
        default:
          return this.$store.commit('UPDATE_NODE', { index: this.index - 1, data: result });
      }
    },
    closeSearchList: function () {
      setTimeout(() => {
        this.isSearching = false;
      }, 120);
    },
    deleteSearch: function () {
      if (this.id > 0)
        this.$store.commit('REMOVE_NODE', this.index - 1);
      else
        this.searchQuery = '';

      removeMarker(this.id);
    },
    searchChangeEnter: function () {
      if (this.searchQuery === '' || !this.searchResults.length)
        return;

      this.searchSelected(this.searchResults[0]);
      this.closeSearchList();
    }
  },
  sockets: {
    geoname_result(data) {
      if (data.node !== this.id)
        return;

      this.searchResults = data.geonames;
    }
  },
  computed: {
    label() {
      switch (this.index) {
        case 0:
          return 'S';
        case -1:
          return 'E';
        default:
          return this.index;
      }
    },
    placeholder() {
      switch (this.index) {
        case 0:
          return 'Start';
        case -1:
          return 'End';
        default:
          return 'Via';
      }
    }
  },
  watch: {
    nodeData(newValue) {
      this.searchQuery = newValue.display_place || '';
    }
  }
};
</script>

<template>
  <div class="sv-container">
    <div class="sv-label sv-item">
      <strong class="start-end-strong">{{ label }}</strong>
    </div>
    <div class="sv-input sv-item control has-icons-right">
      <input v-model.trim="searchQuery" :placeholder="placeholder" autocomplete="off"
             class="input is-rounded"
             type="text" @blur="closeSearchList" @focus="isSearching = true"
             @keyup="searchChange" v-on:keyup.enter="searchChangeEnter">
      <span class="icon is-small is-right">
                          <a class="delete is-small" @click="deleteSearch"></a>
                        </span>
    </div>
    <div class="sv-suggestions-box-wrapper">
      <div v-if="isSearching" class="card sv-suggestions-box">
        <ul class="menu-list">
          <li v-for="result in searchResults" class="search-menu-item" @click="searchSelected(result)" :key="result.osm_id">
            <span class="">{{ result.display_place }}</span>
            <br>
            <span class="search-menu-item-addr">{{ result.display_address }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
.sv-container {
  display: flex;
}

.sv-label {
  margin-top: 7px !important;
  font-size: 1.05rem;
  font-weight: bold;
}

.sv-item {
  margin: 4px;
}

.sv-input {
  align-self: end;
  width: 90%;
}

.sv-input > * {
  font-size: 0.83rem;
}

.sv-input > span {
  visibility: hidden;
}

.sv-input:hover > span {
  visibility: visible;
  cursor: pointer;
}

.sv-suggestions-box-wrapper {
  position: absolute;
  margin-left: 40px;
  margin-top: 36px;
}

.sv-suggestions-box {
  position: fixed;
  width: 250px;
  z-index: 19;
  margin-top: 4px;
}

/* MEDIA QUERIES FOR MOBILE USE */
@media (max-width: 768px) {
  .sv-container {
    margin: -8px;
  }
}
</style>