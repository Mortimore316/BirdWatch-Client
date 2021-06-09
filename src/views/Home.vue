<template>
  <div class="home">
    <div class = "mx-auto"><HelloWorld /></div>
    <div class="base">
      <h1 class="text-center"> <u>Welcome to BirdWatch!</u> </h1>
    <p class="base ma-2 text-center">This application is designed to help you with your BirdWatching! </p>
    </div>
    <div class="d-flex flex-column justify-space-between align-center">
      <v-btn x-large dark @click="$router.push('SubmitBirdQuery')" color="primary">
        Get Started!</v-btn>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld'

export default {
  title: 'Welcome',
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>


