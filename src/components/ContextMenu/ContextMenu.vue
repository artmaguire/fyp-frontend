<template>
  <div
    v-show="isVisible"
    ref="popper"
    v-click-outside="close"
    class="context-menu"
    tabindex="-1">
    <ul>
      <slot :contextData="contextData"/>
    </ul>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';
import { createPopper } from '@popperjs/core';

export default {
  props: {
    boundariesElement: {
      type: String,
      default: 'body',
    },
  },
  data() {
    return {
      opened: false,
      contextData: {},
    };
  },
  directives: {
    ClickOutside,
  },
  computed: {
    isVisible() {
      return this.opened;
    },
  },
  methods: {
    open(evt, contextData) {
      this.opened = true;
      this.contextData = contextData;

      if (this.popper) {
        this.popper.destroy();
      }

      this.popper = createPopper(this.referenceObject(evt), this.$refs.popper, {
        placement: 'right-start'
      });
    },
    close() {
      this.opened = false;
      this.contextData = null;
    },
    referenceObject(evt) {
      const left = evt.clientX;
      const top = evt.clientY;
      const right = left + 1;
      const bottom = top + 1;
      const clientWidth = 1;
      const clientHeight = 1;

      function getBoundingClientRect() {
        return () => ({
          left: left,
          top: top,
          right: right,
          bottom: bottom,
          width: clientWidth,
          height: clientHeight
        });
      }

      return { getBoundingClientRect: getBoundingClientRect() };
    },
  },
  beforeDestroy() {
    if (this.popper !== undefined) {
      this.popper.destroy();
    }
  },
};

</script>

<style lang="scss">

.context-menu {
  position: fixed;
  z-index: 999;
  overflow: hidden;
  background: #FFF;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 #EEE;

  &:focus {
    outline: none;
  }

  ul {
    padding: 0;
    margin: 0;
  }
}

</style>
