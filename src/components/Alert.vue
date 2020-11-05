<template>
  <div v-show="this.alert.status !== ''">
    <div :class="'alert alert-' + this.alert.status">{{this.alert.message}}</div>
  </div>
</template>

<script>
import {mapState, mapActions} from "vuex";

export default {
  name: "Alert",
  computed: mapState([
    'alert',
  ]),
  methods: {
    ...mapActions([
      'clearAlert'
    ])
  },
  mounted() {
    this.clearAlert();
  },

}
</script>
