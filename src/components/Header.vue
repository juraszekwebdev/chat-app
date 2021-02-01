<template>
  <header class="bg-info py-3 text-white">
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col-6 col-lg-4">
          <RouterLink class="text-white text-decoration-none" to="/">Chat App</RouterLink>
        </div>
        <div class="col-6 col-lg-8">
          <div class="text-right">
            <span class="text-white-50">{{user.nickname}}</span>
            |
            <span style="cursor: pointer" @click="logout">Logout</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import {mapState, mapActions} from "vuex";
export default {
  name: "Header",
  computed: mapState([
    'user',
  ]),
  methods: {
    ...mapActions([
      'logoutUser',
    ]),
    logout() {
      const answer = window.confirm('Do you really want to leave?')
      console.log(answer);
      if(answer) {
        this.logoutUser();
        this.$router.push('/sign-in');
      }
    }
  }
}
</script>

<style scoped>

</style>
