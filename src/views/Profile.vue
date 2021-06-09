<template>
  <v-main>
    <div class="d-flex flex-column justify-space-between align-center mx-auto">
      <v-avatar size = "120"><v-img :src="$auth.user.picture"></v-img></v-avatar>
      <h2>Sorry, there is no recent data in this region. Please try somewhere else...</h2>
    </div>
  </v-main>
</template>

<script>
export default {
    title: "Profile"
}
</script>

<style scoped>
.profile {
  margin: 100;
}
</style>