<template>
  <div class="col-lg-8 col-xl-6">
    <form @submit="onSubmit" class="card p-3">
      <Alert />
      <div class="card-body">
        <div class="text-center">
          <h3 class="mt-0 mb-4">Sign up</h3>
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
          <label for="nickname">Nickname</label>
          <input
            type="text"
            name="nickname"
            class="form-control"
            id="nickname"
            placeholder="Nickname"
            @input="onChange"
            :value="nickname"
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
        <div class="form-group">
          <label for="repeatPassword">Repeat password</label>
          <input
            type="password"
            name="repeatPassword"
            class="form-control"
            id="repeatPassword"
            placeholder="********"
            @input="onChange"
            :value="repeatPassword"
            required
          />
        </div>
        <div class="text-center">
          <button
            type="submit"
            class="btn btn-success px-5"
          >
            Sign up
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import {auth, db} from "@/api/firebase"
import {mapActions} from "vuex"
import Alert from "@/components/Alert"

export default {
  name: "SignUpForm",
  components: {Alert},
  data () {
    return {
      email: "",
      password: "",
      repeatPassword: "",
      nickname: ""
    }
  },
  methods: {
    ...mapActions([
      "alertError",
      "alertSuccess"
    ]),
    onChange (e) {
      const { name, value } = e.target
      this[name] = value
    },
    onSubmit (e) {
      e.preventDefault()
      auth.createUserWithEmailAndPassword(this.email, this.password).then(response => {
        console.debug(response)
        auth.currentUser.updateProfile({
          displayName: this.nickname
        })
        db.collection("users").doc(auth.currentUser.uid).set({
          email: this.email,
          nickname: this.nickname
        }).then(response => {
          console.debug(response)
          this.alertSuccess("Account has been created successfully.")
          this.$router.push("/sign-in");
        }).catch(error => {
          console.error(error.message)
          this.alertError(error.message)
        })
      }).catch(error => {
        console.error(error.message)
        this.alertError(error.message)
      })
    }
  }
}
</script>
