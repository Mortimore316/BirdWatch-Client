<template>
  <div class="watching d-flex flex-column justify-space-between align-center">
    <h1>Watching</h1>

    <v-container>
      <v-row>
        <v-col
          :cols="4"
          class="mx-auto"
        >
          <v-card
            class="pa-2 overflow-y-auto" height="800px"
          >
            <u><h2 class="text-center">Birds you're Watching</h2></u>
            <v-divider></v-divider>
            <v-card-text v-if="noBirds" class="my-16 text-center">You aren't watching any birds. <br> <b>Go add some</b> to your WatchList!</v-card-text>
            <v-card-text class="text-center"><v-icon color="grey lighten-2" size="150" v-if="noBirds">mdi-bird</v-icon></v-card-text>
            <v-row 
              class="ma-4"
              v-for="bird in bookmarkedbirdsArray"
              :key="bird">
              <v-col align="start"><v-btn :loading="loadingBird && bird==index" v-if="!noBirds" v-bind:color="(bird == activeBird) ? 'success' : 'info'" @click="updateActiveBird(bird);index=bird">{{bird}}</v-btn></v-col>
              <v-col align="end"><v-chip v-if="!noBirds" color="error lighten-1" class="mx-4" @click="removeFromWatching(bird)">remove</v-chip></v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col
          :cols="4"
        >

         <v-card
            class="pa-2 overflow-auto" height="800px">
            <u><h2 class="text-center">Recent Sightings</h2></u>
            <v-divider></v-divider>

            <v-card-text v-if="!IsBirds" class="my-16 text-center">Click on a bird from your <b>WatchList</b> to view recent sightings.</v-card-text>
            <v-card-text class="text-center"><v-icon color="grey lighten-2" size="150" v-if="!IsBirds">mdi-magnify</v-icon></v-card-text>

            
            <v-list v-show="IsBirds" v-bind:key=idx v-for="(Bird, idx) in displayObjects">
              <h3 class="text-center">{{Bird.Date}}</h3> 
              <div>
                <p class= "pa-1"> A <b>{{Bird.BirdName}}</b> was reported to have been observed at <b>{{Bird.Date}}</b>.
                 The location of the sighting was <b>{{Bird.Location}}</b>.
                  There were reported to have been <b>{{Bird.NumBirds}}</b> seen.</p>
              </div>
            <v-divider inset class="mx-auto"></v-divider>
            </v-list>

          <v-snackbar timeout="3000"
               v-model="snackbar">
               {{ removedBird }} was removed from your WatchList.

              <template v-slot:action="{ attrs }">
                <v-btn
                  color="pink"
                  text
                  v-bind="attrs"
                  @click="snackbar = false"
                >
                  Close
                </v-btn>
              </template>
            </v-snackbar>

          </v-card>
        </v-col>
        <v-col
          :cols="4"
        >
          <v-card height="800" class="pa-2">
            <u><h2 class="text-center">Species Info</h2></u>
                <v-divider></v-divider>
                <v-card-text v-if="!IsBirds" class="my-16 text-center">Click on a bird from your <b>WatchList</b> to view species info.</v-card-text>
                <v-card-text class="text-center"><v-icon color="grey lighten-2" size="150" v-if="!IsBirds">mdi-information-outline</v-icon></v-card-text>
                <div v-if="BirdIsSelected" :key="displayObjects[0].BirdName" class="d-flex flex-column justify-space-between align-center">
                  <h2>{{displayObjects[0].BirdName}}</h2>
                  <v-img contain :title="displayObjects[0].BirdName" :src="displayObjects[0].Image" alt=""> </v-img>
                    
                    
                  <div class="watching-divider">
                    <h3 v-if="(displayObjects[0].Description.length > 40)">Description</h3>
                      {{displayObjects[0].Description.split('|')[0].split('Description:')[1]}}
                      <br>
                      <br>
                          <h3 v-if="(displayObjects[0].Description.length > 40)">Where to Look</h3>
                      {{displayObjects[0].Description.split('|')[1].split('Where to Look:')[0]}}
                </div>

                <div>
                  <v-dialog
                  v-model="dialog"
                  width="1200"
                  v-if="BirdIsSelected"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="red"
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      View Sightings Map
                    </v-btn>
                  </template>
            
                  <v-card>
                    <v-card-title class="headline grey lighten-2">
                      <p> Sightings Map for <b> {{displayObjects[0].BirdName}} </b> </p>
                    </v-card-title>
                      <v-card-actions>
                      <v-btn
                        color="success"
                        text
                        @click="locateMe();UpdateCenter(),updateActiveBird(activeBird)"
                      >
                        Center at my Location
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        text
                        @click="updateActiveBird(activeBird)"
                      >
                        Search This Area
                      </v-btn>
                    </v-card-actions>
            
                    <v-card>
                        <div class = "d-flex flex-column justify-space-between align-center">
                              
                              <GmapMap ref="mapRef"
                                :center="{lat:latitude, lng:longitude}"
                                :zoom="10"
                                @click="UpdateCenter"
                                map-type-id="terrain"
                                style="width: 1000px; height: 600px">
                              
                              <GmapMarker
                                :key="index"
                                v-for="(m, index) in markers"
                                :position="m.position"
                                :clickable="false"
                                :draggable="false"
                                @drag="updateCoordinates" 
                                @click="center=m.position"
                                
                              /> 
                              </GmapMap>
                            </div>
                    </v-card>
            
                    <v-divider></v-divider>
            
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        text
                        @click="dialog = false"
                      >
                        Close
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                </div>
            
              </div>
              
          </v-card>
        </v-col>
      </v-row>
      
      
      <v-divider></v-divider>
      <br>
      <br>
     
      
      
    </v-container>


  <ConnectionError v-bind:errorStr="errorStr" v-bind:connectionError="connectionError" />



  <v-dialog class="text-center"
    v-model="loading"
    persistent
    width="300">
    <v-card class = "text-center"
      color="grey"
      dark>
      <v-card-text class="justify-center mx-auto">
        Connecting to backend...
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>




  </div>
</template>

<script>
import Database from '@/services/Database'
import AuthenticationService from '@/services/AuthenticationService'
import ConnectionError from '@/components/ConnectionError'
export default {
  title: 'Your WatchList',

  components: {
    ConnectionError
  },

  data: () => ({
    bookmarkedbirdsArray: [
    ],
    displayObjects: [],
    activeBird: "",
    location: null,
    index: -1,
    loadingBird: false,
    gettingLocation: false,
    loading: false,
    errorStr:null,
    error: false,
    dialog: false,
    connected: false,
    alert: false,
    snackbar: false,
    noBirds: false,
    BirdIsSelected: false,
    connectionError: false,
    latitude: 30.675503, 
    longitude: -96.233208,
    FirstRender: true,
    IsBirds: false,
    markers: [
      ],
    //SearchMarker: [
    //  {
    //    position: {
    //        lat: 30.23,
    //        lng: -90
    //      }
    //  }
    //],
    removedBird: '',
  }),


  methods: {
    UpdateCenter(){
          this.$refs.mapRef.$mapPromise.then((map) => {
          console.log("The Center Is: ")
          this.latitude = map.getCenter().lat()
          this.longitude = map.getCenter().lng()
          //this.updateActiveBird(this.activeBird)
    })
    },
    updateCoordinates(location) {
            //console.log(`location.latLng.lat() = ${location.latLng.lat()}`)
            this.latitude = location.latLng.lat()
            this.longitude = location.latLng.lng()
            
    },
    async removeFromWatching(bird) {
        const resp = await Database.DataBaseCall({
        UserID: sessionStorage.UserEmail,
        QueryType: "AddBird",
        BirdCommonName : bird
      })

      const index = this.bookmarkedbirdsArray.indexOf(bird);
            if (index > -1) {
              this.bookmarkedbirdsArray.splice(index, 1);
            }
      this.removedBird = bird;
      this.snackbar = true;

      if (this.bookmarkedbirdsArray.length == 0){
        this.noBirds = true;
      }
    },

    async updateActiveBird(bird){

      
      this.BirdIsSelected = true;
      this.loadingBird = true;

      try {
      const response = await AuthenticationService.SubmitBirdQuery({
        /////////////////////////////////////////////////////////////////
        //////////////////////These Coordinates neeed to not be hard coded
        /*              Example bird objects in the DisplayObjects array
        {
          BirdName : "Norther Cardinal", 
          Image : "www.maculauylibrary.org/assets/imageexample/northerncarindal/dfs34223.png",
          Description : "Description: Cardinals are red birds|Where to look: Norther carindals are cool birds",
          Date : "4-18-2018 14:04",
          Location : "Williamson county regional park, 4342 robin drive",
          NumBirds : 4,
          Confirmed : "true"
}
        */
        latitude: this.latitude,
        longitude: this.longitude,
        queryType: 'singlespecies',
        commonName: bird
      })

      if(!(response.data["worked"] == "false")){
      this.IsBirds = true
      this.displayObjects = response.data["Birds"]
      var BIRDS = response.data["Birds"]
      this.markers = []
      for (var i in BIRDS){
        

        this.markers.push(
          {
          position: {
            lat: BIRDS[i].Lat,
            lng: BIRDS[i].Lng
          }
        })
        
      }
    




      this.activeBird = bird;
      this.loadingBird = false;
      console.log("Active Bird is now " + this.activeBird)
      }
      else{
          this.IsBirds = false
      }

      }catch(e){
        console.log(e);
        this.errorStr = e;
      }

    },

    async getLocation() {
      
      return new Promise((resolve, reject) => {

        if(!("geolocation" in navigator)) {
          reject(new Error('Geolocation is not available.'));
        }

        navigator.geolocation.getCurrentPosition(pos => {
          resolve(pos);
        }, err => {
          reject(err);
        });

      });
    },

    async locateMe() {
      this.gettingLocation = true;
      console.log("Getting location...")
      try {
        this.location = await this.getLocation();
        this.gettingLocation = false;
        console.log("Location success!")
        this.setCoordinates();
        this.alertHandle();
      } catch(e) {
        this.gettingLocation = false;
        this.errorStr = e.message;
        this.error = true;
        console.log("ERROR - Could not get location. Reason: " + this.errorStr)
      }
    },
    alertHandle() {
      this.alert=true;
      setTimeout(() => this.alert=false, 2500);
    },
    setCoordinates() {
      this.latitude = this.location.coords.latitude
      this.longitude = this.location.coords.longitude
      console.log("Latitude from getLocation: " + this.latitude)
      console.log("Longitude from getLocation: " + this.longitude)
    },
    updateCoordinates(location) {
      //console.log(`location.latLng.lat() = ${location.latLng.lat()}`)
      this.latitude = location.latLng.lat()
      this.longitude = location.latLng.lng()  
    },
    isConnected() {
      if (this.connected) {
        this.loading = false;
      } else {
      console.log("Trying to connect...")
      this.loading = true;}
    }
  },

  mounted () {
    // At this point, the child GmapMap has been mounted, but
    // its map has not been initialized.
    // Therefore we need to write mapRef.$mapPromise.then(() => ...)
 
      this.$refs.mapRef.$mapPromise.then((map) => {
      console.log("The Center Is: ")
      console.log(map.getCenter())
    })
  },

  async created() {
    console.log("Getting User Information...")
    //setTimeout(() => {  this.isConnected(); }, 1000);
    try {
      const resp = await Database.DataBaseCall({
      UserID: sessionStorage.UserEmail,
      QueryType: "GetBirds",
      });
      if (resp.data["Result"] == "NoBirdsFound") {
        console.log("User has no birds in WatchList")
        this.noBirds = true;
      } else {
      sessionStorage.WatchList = resp.data["Birds"];
      this.bookmarkedbirdsArray = sessionStorage.WatchList.split(',');
      }
      this.connected = true;

    

      console.log("Number of watched birds is " + this.bookmarkedbirdsArray.length)

    }catch(e){
      console.log("ERROR OCCURRED: " + e)
      this.errorStr = e
      this.loading = false;
      this.connectionError = true;
    }
  },
}
</script>


<style scoped>
.description{
  margin-left: 32% ;
  margin-right: 32%;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.watching-divider {
  min-height: 265px;
  max-height: 515px;
  overflow-y: auto;
}

</style>

