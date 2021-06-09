<template>
  <v-app>
    <v-app-bar app
      color="info"
      dense
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title class= "myFont" >{{appTitle}} <v-icon right class="ma-2">{{'mdi-binoculars'}}</v-icon> </v-toolbar-title>

      <v-btn class="mx-1" v-for="item in menuItems"
      :key="item.title"
      :to="item.path"
      color="primary" dark>
        <v-icon left>{{ item.icon}}</v-icon>
        {{item.title}}
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn v-if="!$auth.isAuthenticated" @click="login" class="mx-1" color="success" dark>
        <v-icon left>mdi-account</v-icon>
        Login
      </v-btn>
      <v-btn v-if="$auth.isAuthenticated" @click="logout" class="mx-1" color="error" dark>
        <v-icon left>mdi-account-arrow-right</v-icon>
        Logout
      </v-btn>

      <v-toolbar-items>
        <ThemeChanger />
      </v-toolbar-items>


      <v-menu
        left
        bottom
      >
      </v-menu>

      
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      bottom
      temporary
    >
      <v-list>
          <v-list-item link v-if="!$auth.isAuthenticated">
            <v-btn v-if="!$auth.isAuthenticated" @click="login" class="mx-1" color="accent">
              <v-icon left>mdi-account</v-icon>
              Login
            </v-btn>
          </v-list-item>

          <v-list-item v-if="$auth.isAuthenticated" class="px-2">
            <v-list-item-avatar size ="80">
              <v-img :src="$auth.user.picture"></v-img>
            </v-list-item-avatar>
          </v-list-item>
          <v-list-item link v-if="$auth.isAuthenticated" @click="$router.push('/Profile')">
            <v-list-item-content>
              <v-list-item-title class="title">
                {{$auth.user.name}}
              </v-list-item-title>
              <v-list-item-subtitle>{{$auth.user.email}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>

          <v-list
              nav
              dense
              link v-if="$auth.isAuthenticated"
          >
            <v-list-item v-for="(item, index) in hamburgerItems" v-bind:key="index" @click="menuActionClick(item.action)">
              <v-list-item-icon>
                <v-icon>{{item.icon}}</v-icon>
              </v-list-item-icon>
            <v-list-item-title>{{item.title}}</v-list-item-title>
            </v-list-item>
          </v-list>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-slide-x-transition mode="out-in">
      <router-view />
      </v-slide-x-transition>
    </v-main>
  </v-app>
</template>

<script>

import ThemeChanger from "./components/ThemeChanger";
export default {
  name: 'App',
  components: {
    ThemeChanger
  },

  methods: {
     login() {
      this.$auth.loginWithRedirect();
    },
    logout() {
    this.$auth.logout({
      returnTo: window.location.origin
    });
    },
    menuActionClick(action) {
      if (action == "myFiles")
      {
        this.$router.push('MyFiles'); //these pages don't exist yet
      }
      else if (action == "sharedWithMe")
      {
        this.$router.push('SharedWithMe'); //
      }
      else if (action == "watching")
      {
        this.$router.push('/watchlist'); //
      }
      else if (action == "networking")
      {
        this.$router.push('Networking'); //
      }
    }
  },

  data: () => ({
      appTitle: 'B I R D  W A T C H ',
      sidebar: false,
      menuItems: [
        { title: 'Home', path: '/SubmitBirdQuery', icon: 'mdi-home'},
        { title: 'About', path: '/about', icon: 'mdi-information'}
      ],
      hamburgerItems: [
        /*{
          title: "My Files",
          icon: "mdi-folder",
          action: "myFiles"
        },
        {
          title: "Shared with me",
          icon: "mdi-account-multiple",
          action: "sharedWithMe"
        },*/
        {
          title: "WatchList",
          icon: "mdi-bookmark",
          action: "watching",
          path: "/watchlist"
        }/*,
        {
          title: "Networking",
          icon: "mdi-earth",
          action: "networking"
        }
        */
      ],
      drawer: false,
      group: null,

      watch: {
      group () {
        this.drawer = false
      },
    },
  }),
};
</script>
