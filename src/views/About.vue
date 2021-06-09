<template>
  <div class="watching d-flex flex-column justify-space-between align-center">
    <h1>All About BirdWatch</h1>

    <v-container>
      <v-row>
        <v-col
          :cols="6"
          class="mx-auto"
        >
          <v-card
            class="pa-2 overflow-y-auto" height="520px"
          >
            <v-carousel
              cycle
              show-arrows-on-hover
              hide-delimiter-background
            >
              <v-carousel-item
                v-for="(item,i) in displayObjects"
                :key="i"
                :src="item.src"
                reverse-transition="fade-transition"
                transition="fade-transition"
                height: 100vh
              >
              </v-carousel-item>
            </v-carousel>
          </v-card>
        </v-col>
        <v-col
          :cols="6"
        >
          <v-card height="100%" class="pa-2">
          <h2 class="text-center">About</h2>
            <v-divider></v-divider>
              <div>
                <u><h2></h2></u>
                <div class="description">
                  <br>
                  <p>
                    When it comes to identifying anything in the natural world, it can be difficult for people 
                    to get over that initial learning curve where it feels like there are just too many 
                    possibilities to confidently narrow down. This issue is even more prevalent when it comes
                    to birding than many other subjects. Due to this steep learning 
                    curve, many people who may be interested in birding are held back by being unable to 
                    identify what birds they see. This is the problem that BirdWatch fixes. We help people 
                    get a foothold in birdwatching and quickly learn about the species in their area.
                    BirdWatch leverages the ebird.org database to provide highly accurate infomration based 
                    on over 800,000,000 real world sightings.  
                    This allows for tailored recommendations that take into 
                    account the density of a given species in a given area in a given time frame, which is 
                    something that regular field guides simply can’t provide. 
                    Moreover, BirdWatch also changes dynamically over time as species, ranges, and populations ebb and flow.
                  </p>
                  <br>
                  <p>
                    In order to use BirdWatch, simply input your latitude and longitude (or use one of our handy location features),
                    select filters for the specific types of birds you want to see (or leave the filters off to see every single type),
                    and hit Submit Query. BirdWatch will then search through it's entire database to find what birds best fit what you
                    want. If you find any species that you like, simply hit the 'Watch' button below it and it will be added to your
                    'Watching List,' where you can view it's information and recent sightings at any time!
                  </p>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
export default {
  title: 'About',

  data: () => ({
    displayObjects: [
      {src:"https://cdn.download.ams.birds.cornell.edu/api/v1/asset/212212961/"}, //Crested Quail Dove
      {src:"https://cdn.download.ams.birds.cornell.edu/api/v1/asset/141600981/"}, //Madagascar Serpent Eagle
      {src:"https://cdn.download.ams.birds.cornell.edu/api/v1/asset/47327061/"},  //Red-breasted Pygmy-Parrot
      {src:"https://cdn.download.ams.birds.cornell.edu/api/v1/asset/92006261/"},  //Northern Emerald-Toucanet
      {src:"https://cdn.download.ams.birds.cornell.edu/api/v1/asset/206009741/"}, //Cardinal Myzomela (Cardinal)
      {src:"https://cdn.download.ams.birds.cornell.edu/api/v1/asset/229543691/"}, //American White Pelican
    ],
  }),

  methods: {

  },
}
</script>
