// Controls the Splash Screen when the website is entered
<script>
export default {
  name: 'splash-screen',
  data: function () {
    return {
      loadingTitle: 'Direction Finding Using OpenStreetMap'
    };
  },
  props: {
    active: Boolean
  }
};
</script>

<template>
  <div id="splash-screen" v-bind:class="{ 'is-active': active }" class="pageloader is-left-to-right">
    <span class="title has-text-weight-semibold">{{ loadingTitle }}</span>
  </div>
</template>


<style lang="scss">
@import "~bulma/bulma";
@import "~bulma-pageloader/dist/css/bulma-pageloader";
</style>