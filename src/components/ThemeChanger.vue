<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-btn large icon dark v-on="on">
        <v-icon size="30" color="primary">mdi-palette</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-list-item>
        <v-list-item-content
          ><v-list-item-title class="font-weight-bold">
            Dark Mode</v-list-item-title
          >
        </v-list-item-content>
        <v-list-item-action
          ><v-switch v-model="$vuetify.theme.dark"  />
        </v-list-item-action>
      </v-list-item>
        

      
      <v-divider />
      <v-card-text v-if="!colorBlind">
        <v-card  class="my-2"
          :enabled="$vuetify.theme.themes.name === theme.name"
          @click="setTheme(theme)"
          hover
          outlined
          v-for="(theme, index) in themes"
          :key="index"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                {{ theme.name }}</v-list-item-title
              >
            </v-list-item-content>

          </v-list-item>
        </v-card>
      </v-card-text>

      <v-card-text v-if="colorBlind">
        <v-card  class="my-2"
          :enabled="$vuetify.theme.themes.name === theme.name"
          @click="setTheme(theme)"
          hover
          outlined
          v-for="(theme, index) in theme"
          :key="index"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                {{ theme.name }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>

        </v-card>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn text @click="menu = false" color="grey">Close</v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card> </v-menu
>
</template>


<script>

export default {
  name: "ThemeChanger",
  data: () => ({
    menu: false,
    colorBlind: false,
    theme: [
            {
        name: "Default",
        dark: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
        },
        light: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
        }
      },
    ],
    themes: [
      {
        name: "Colorblind Mode",
        dark: {
          primary: "#2D3142",
          accent: "#E1DAAE",
          secondary: "#CC2D35",
          success: "#058ED9",
          info: "#848FA2",
          warning: "#FF934F",
          error: "#CC2D35"
        },
        light: {
          primary: "#2D3142",
          accent: "#E1DAAE",
          secondary: "#CC2D35",
          success: "#058ED9",
          info: "#848FA2",
          warning: "#FF934F",
          error: "#CC2D35"
        }
      },

      
    ]

  }),

  
  methods: {
    setTheme(theme) {
      // close menu
      this.menu = false;

      const name = theme.name;
      const dark = theme.dark;
      const light = theme.light;

      //toggles between two themes (colorBlind and Default)
      if (this.colorBlind === true){
        this.colorBlind = false;
      }
      else{
        this.colorBlind = true;
      }
      // set themes
      Object.keys(dark).forEach(i => {
        this.$vuetify.theme.themes.dark[i] = dark[i];
      });
      Object.keys(light).forEach(i => {
        this.$vuetify.theme.themes.light[i] = light[i];
      });
      // also save theme name to disable selection
      this.$vuetify.theme.themes.name = name;
    }
  }
};
</script>
<style scoped></style>