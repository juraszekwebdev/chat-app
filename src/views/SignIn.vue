<template>
  <div class="sign-in">
    <div class="container-fluid">
      <div class="row vh-100">
        <div class="col-md-5 bg-dark">
          <div class="d-flex flex-column align-items-center justify-content-center text-white h-100">
            <div class="">
              <h2 class="font-weight-bold">
                Chat Application<br/>
                Login Page
              </h2>
              <p>
                Please,
                <RouterLink to="/sign-in">Sign In</RouterLink>
                or
                <RouterLink to="/sign-up">Create an account</RouterLink>
                to access a <strong>chat</strong>.
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-7 bg-light">
          <div class="d-flex flex-column align-items-center justify-content-center h-100">
            <SignInForm/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SignInForm from '@/components/SignInForm.vue'

export default {
  name: 'SignIn',
  components: {
    SignInForm
  }
}
</script>
