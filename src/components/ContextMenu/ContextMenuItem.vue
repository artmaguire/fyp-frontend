<template>
  <li class="context-menu-item">
    <slot/>
  </li>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.context-menu-item {
  display: block;
  position: relative;
  background: #000;
  border-radius: 0;
  color: #FFF;
  text-decoration: none;
  font-size: 13px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  padding: 8px;


  &:hover,
  &:focus {
    background: #fff;
    color: #000;
    outline: none;
  }
}
</style>

