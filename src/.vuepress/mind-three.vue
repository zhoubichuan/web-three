<template>
  <div class="three"></div>
</template>

<script>
export default {
  props: {
    fn: {
      type: Function,
      default: () => {},
    },
  },
  mounted() {
    fn()
  },
};
</script>