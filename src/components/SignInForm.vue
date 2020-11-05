<template>
  <div class="col-lg-8 col-xl-6">
    <form @submit="onSubmit" class="card p-3">
      <Alert />
      <div class="card-body">
        <div class="text-center">
          <h3 class="mt-0 mb-4">Sign in</h3>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="text"
            name="email"
            class="form-control"
            id="email"
            placeholder="Email address"
            @input="onChange"
            :value="email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            name="password"
            class="form-control"
            id="password"
            placeholder="********"
            @input="onChange"
            :value="password"
            required
          />
        </div>
        <div class="text-center">
          <button
            type="submit"
            class="btn btn-success px-5"
          >
            Sign in
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import {auth} from '@/api/firebase';
import {mapActions} from 'vuex';
import Alert from "@/components/Alert";

export default {
  name: 'SignInForm',
  components: {Alert},
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    ...mapActions([
      'alertError',
      'alertSuccess',
      'setUser'
    ]),
    onChange (e) {
      const { name, value } = e.target
      this[name] = value
    },
    onSubmit (e) {
      e.preventDefault()
      auth.signInWithEmailAndPassword(this.email, this.password).then((response) => {
        console.log(response)
        this.alertSuccess("Logged in successfully")
        const user = {
          uid: response.user.uid,
          email: response.user.email,
          nickName: response.user.displayName
        }
        localStorage.setItem('user', JSON.stringify(user))
        this.setUser(user);
        this.$router.push("/")

      }).catch(error => {
        console.error(error.message)
        this.alertError(error.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
