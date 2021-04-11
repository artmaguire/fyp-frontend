<script>

import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faTimesCircle);

export default {
  name: 'loading-screen',
  data: function () {
    return {
      loadingTitle: 'Finding Route...'
    };
  },
  methods: {
    cancelRoute() {
      // Reloads the site
      window.location.reload(true);
    }
  },
  props: { type: String }
};
</script>

<template>
  <div id="loading-background">
    <div class="container-loading">
      <div class="finding-route-card">
        <!-- The loader will be here -->
        <button class="button cancel-route" title="Cancel route" @click="cancelRoute">
          <font-awesome-icon icon="times-circle"/>
        </button>
        <h2 class="finding-route-text">
          {{ loadingTitle }}
        </h2>

        <div v-bind:class="[ type === 'walking' ? 'walking-gif' : 'gifs' ]">
          <img id="driving-gif"
               v-bind:src="'/images/gifs/' + type + '.gif'">
        </div>
      </div>
    </div>
  </div>
</template>

<style>

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

.cancel-route {
  font-size: 1.4rem;
  height: 100%;
  float: right;
  padding: 0;
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
  display: block;
  width: 150px;
  height: 250px;
  margin: 25px auto -40px;
}

/* MEDIA QUERIES FOR MOBILE USE */
@media (max-width: 1024px) {
  .finding-route-card {
    zoom: 2;
  }
}
</style>