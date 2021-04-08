<script>
export default {
  name: 'loading-screen',
  data: function () {
    return {
      loadingTitle: 'Finding Route...'
    }
  },
  methods: {
    cancelRoute() {
      // Reloads the site
      window.location.reload(true);
    }
  },
  props: {type: String}
}
</script>

<template>
  <div id="loading-background">
    <div class="container-loading">
      <div class="finding-route-card">
        <!-- The loader will be here -->
        <button class="button cancel-route" title="Cancel route" @click="cancelRoute">
          <i class="fa fa-times-circle"></i>
        </button>
        <h2 class="finding-route-text">
          {{ loadingTitle }}
        </h2>

        <div v-bind:class="[ type === 'walking' ? 'walking-gif' : 'gifs' ]" class="">
          <img id="driving-gif"
               v-bind:src="'/images/gifs/' + type + '.gif'">
        </div>
      </div>
    </div>
  </div>
</template>