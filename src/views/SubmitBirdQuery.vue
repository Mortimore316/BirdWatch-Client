<template>
  <v-main>
    <HelloWorld />
    <v-container>
      <v-row>
      <v-col cols="4" class ="mx-auto">
        <v-text-field outlined placeholder="30.267" v-model="latitude" label = "Enter latitude"></v-text-field>
      </v-col>
      <v-col cols="4" class= "mx-auto">
        <v-text-field outlined placeholder="-90.3199" v-model="longitude" label="Enter longitude"></v-text-field>
      </v-col></v-row>
        <v-container fluid class=" d-flex flex-column justify-space-between mx-auto ">   
            <v-row>
                <v-col cols="12" sm = "12" class="text-center">
                <v-expand-x-transition mode="expand2"><v-col class="d-flex justify-center align-center">
                    <v-btn @click="comboFunction();" x-large color="pink" dark
                    :loading="loading"
                    class="ma-2">
                      <v-icon left>mdi-magnify</v-icon>
                        Submit Query</v-btn>
                        <v-dialog class="text-center"
                        v-model="loading"
                        persistent
                        width="300">
                      <v-card class = "text-center"
                        color="grey"
                        dark>
                      <v-card-text v-if="!useRarity" class="justify-center mx-auto">
                        Getting Birds...
                        <v-progress-linear
                          indeterminate
                          color="white"
                          class="mb-0"
                        ></v-progress-linear>
                      </v-card-text>
                      <v-card-text v-if="useRarity" class="justify-center mx-auto">
                        Generating Rarity Report...
                        <v-progress-linear
                          indeterminate
                          color="white"
                          class="mb-0"
                        ></v-progress-linear>
                      </v-card-text>
                    </v-card>
                  </v-dialog>


                <v-dialog v-model="noCoords" width="500" class="justify-center">
                  <v-card class="text-center">
                    <v-card-title class="justify-center error lighten-2">
                      <v-icon left>mdi-alert</v-icon> No Coordinates Given! <v-icon right>mdi-alert</v-icon>
                    </v-card-title>
                      Make sure to enter coordinates!
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="noCoords = false"> Okay</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

                    <v-expand-x-transition><v-btn v-if="!mapstate" @click="mapstate = true, Typestate = false;"  x-large color="primary" dark
                    class="ma-2">
                      <v-icon left>mdi-google-maps</v-icon>
                        Use the Map!</v-btn></v-expand-x-transition>
                    <v-btn @click="locateMe" x-large color="primary" dark :loading="gettingLocation" class="ma-2">
                      <v-icon left>mdi-location-enter</v-icon>Use my location!</v-btn>
                    <v-switch v-model="useRarity" class = "ma-2" label="Generate Rarity Report">G</v-switch>
                </v-col></v-expand-x-transition>
                <v-row justify="center"><v-alert transition="scale-transition" dismissible v-model="alert" dense class="ma-3" type="success">Location used successfully
                  </v-alert></v-row>
                <v-row justify="center"><v-alert transition="scale-transition" dismissible v-model="error" dense class="ma-3" type="error">
                  Error: {{errorStr}} </v-alert></v-row>
                <v-row justify="center"> <v-expand-x-transition mode="expand2">
                  
                  <v-btn medium v-if="!Typestate" @click="Typestate = true, mapstate = false;" color="grey" dark class="ma-2">
                      <v-icon left>mdi-bird</v-icon>
                        Refine your search</v-btn>
                </v-expand-x-transition> </v-row>

                <v-row justify="center">
                    <v-slide-y-transition mode="out-in"><div v-if="HasSelectedFilters" class ="d-flex flex-column justify-space-between mx-auto ">
                        <v-col class = "mx-auto">
                          <h3 class = "mx-auto">Selected Filters</h3>
                        </v-col>
                        <v-col>
                          <v-row>
                            <v-img @click="addFilter('Passerine')" :src=SelectedFilterImages[0] contain width = 88 height = 120 alt=""> </v-img>
                            <v-img @click="addFilter('Passerine')" :src=SelectedFilterImages[1] contain width = 88 height = 120 alt=""> </v-img>
                            <v-img @click="addFilter('Passerine')" :src=SelectedFilterImages[2] contain width = 88 height = 120 alt=""> </v-img>
                            <v-img @click="addFilter('Passerine')" :src=SelectedFilterImages[3] contain width = 88 height = 120 alt=""> </v-img>
                            <v-img @click="addFilter('Passerine')" :src=SelectedFilterImages[4] contain width = 88 height = 120 alt=""> </v-img>
                            <v-img @click="addFilter('Passerine')" :src=SelectedFilterImages[5] contain width = 88 height = 120 alt=""> </v-img>
                            <v-img @click="addFilter('Passerine')" :src=SelectedFilterImages[6] contain width = 88 height = 120 alt=""> </v-img>
                            <v-img @click="addFilter('Passerine')" :src=SelectedFilterImages[7] contain width = 88 height = 120 alt=""> </v-img>

                          

                          </v-row>
                        <v-divider class="ma-3"></v-divider>
                        </v-col>
                    </div>
                    </v-slide-y-transition>
                </v-row>

            </v-col>

            

            <v-slide-y-transition mode="out-in"><div v-if="mapstate" class ="d-flex flex-column justify-space-between mx-auto ">
              <v-row class="ma-3"><v-btn @click="mapstate = !mapstate" dark small color="error"><v-icon left>mdi-close</v-icon>Close map</v-btn></v-row>
              <GmapMap
                :center="{lat:centerLatitude, lng:centerLongitude}"
                :zoom="7"
                map-type-id="terrain"
                style="width: 1200px; height: 700px"
              >
              <GmapMarker
                :key="index"
                v-for="(m, index) in markers"
                :position="m.position"
                :clickable="true"
                :draggable="true"
                @drag="updateCoordinates" 
                @click="center=m.position"
                
              />
              </GmapMap>
            
            </div>
            </v-slide-y-transition>



            <v-slide-y-transition mode="out-in"><div v-if="Typestate" class ="d-flex flex-column justify-space-between mx-auto ">
              <v-col class="mx-auto">
                <v-row class="mx-auto" align-content="justify-center">  
                <v-col><v-btn small @click="Typestate=!Typestate" color="error" dark class="ma-2">
                  <v-icon left>mdi-close</v-icon>
                  Close this list</v-btn></v-col>
                <v-expand-x-transition mode="expand2"><v-btn v-if="HasSelectedFilters" @click="clearFilters" small color="grey" darkclass="ma-2" dark>
                  <v-icon left>mdi-progress-close</v-icon>
                  Clear Filters</v-btn></v-expand-x-transition></v-row>        
              <v-row>
                  
                  <v-col>
                      <div>
                        <div>Perching Birds</div>
                        <button><v-img @click="addFilter('Passerine')" :src="require($vuetify.theme.dark? '@/assets/dark/b.png' :'@/assets/light/b.png')" contain width = 220 height = 300 alt=""> </v-img></button>
                      </div>
                      <div>
                        <div>Shorebirds</div>
                        <button><v-img @click="addFilter('Shorebirds')" :src="require($vuetify.theme.dark? '@/assets/dark/shorebird.png' :'@/assets/light/shorebird.png')" width = 220 height = 300 alt=""> </v-img></button>
                      </div>
                      <div>
                        <div>Ground Birds</div>
                        <button><v-img @click="addFilter('GroundBirds')" :src="require($vuetify.theme.dark? '@/assets/dark/ground.png' :'@/assets/light/ground.png')" width = 220 height = 300 alt=""> </v-img></button>
                      </div>

                  </v-col>
                  <v-col>
                      <div>
                        <div>Wading Birds</div>
                        <button><v-img @click="addFilter('Waders')" :src="require($vuetify.theme.dark? '@/assets/dark/waders.png' :'@/assets/light/waders.png')" width = 220 height = 300 alt=""> </v-img></button>
                      </div>
                      <div>
                        <div>Sea Birds</div>
                        <button><v-img @click="addFilter('Seabirds')" :src="require($vuetify.theme.dark? '@/assets/dark/Gull.png' :'@/assets/light/Gull.png')" width = 220 height = 300 alt=""> </v-img></button>
                      </div>
                      <div>
                        <div>Other</div>
                        <button> <v-img @click="addFilter('Other')" :src="require($vuetify.theme.dark? '@/assets/dark/Other.png' :'@/assets/light/Other.png')" contain width = 220 height = 300 alt=""> </v-img></button>
                      </div>


                  </v-col>
                  <v-col>
                      <div>
                        <div>Waterfowl</div>
                        <button> <v-img @click="addFilter('Waterfowl')" :src="require($vuetify.theme.dark? '@/assets/dark/duck.png' :'@/assets/light/duck.png')" width = 220 height = 300 alt=""> </v-img></button>
                      </div>
                      <div>
                        <div>Raptors</div>
                        <button> <v-img @click="addFilter('Raptors')" :src="require($vuetify.theme.dark? '@/assets/dark/hawk.png' :'@/assets/light/hawk.png')" width = 220 height = 300 alt=""> </v-img></button>
                      </div>
                      <div>
                        <div>All</div>
                        <button> <v-img @click="addFilter('All')" :src="require($vuetify.theme.dark? '@/assets/dark/all.png' :'@/assets/light/all.png')" width = 220 height = 300 alt=""> </v-img></button>
                      </div>

                  </v-col>
              </v-row>
              </v-col>
            
            </div>
            </v-slide-y-transition>



                
                
            </v-row>
        </v-container>
        
    </v-container>
  <ConnectionError v-bind:errorStr="errorStr" v-bind:connectionError="connectionError" />
  </v-main>
</template>
<script>
/* eslint-disable */ 
//Here we can call our API in the services->API.js which lets us call
//our SubmitBirdQuery function that will send our user input to the backend in Json format! :))
import AuthenticationService from '@/services/AuthenticationService'
import Database from '@/services/Database'
import AddUser from '@/services/AddUser'
import HelloWorld from '@/components/HelloWorld'
import ConnectionError from '@/components/ConnectionError'

const FilterToImageMap = {
    'Passerine' : require('@/assets/light/b.png'),
    'Raptors' : require('@/assets/light/hawk.png'),
    'Waterfowl' : require('@/assets/light/duck.png'),
    'Seabirds' : require('@/assets/light/Gull.png'),
    'Waders' : require('@/assets/light/waders.png'),
    'GroundBirds' : require('@/assets/light/ground.png'),
    'Shorebirds' : require('@/assets/light/shorebird.png'),
    'Other' : require('@/assets/light/Other.png')

}





export default {
     components:{
     HelloWorld, ConnectionError
   },
  name: 'SubmitBirdQuery',
  title: 'Submit a Query',
  data () {
    return { 
      useRarity: false,
      latitude: '',
      centerLatitude: 30.62,
      centerLongitude: -96.33,
      longitude: '',
      date: '',
      SelectedFilters: [],
      SelectedFilterImages: [],
      markers: [
        {
          position: {
            lat:30.62,
            lng:-96.33
          }
        }
      ],
      //implement this for drop-down calendar later 
    //   fromDateMenu: false,
    //   fromDateVal: null,
    //   minDate: "2020-01-05",
    //   maxDate: "2019-08-30"

    //This array is populated with the birds when submitbirdquery button is hit
    birdNames:[],
    birdImages:[],
    loading: false,
    connectionError: false,
    noCoords: false,
    mapstate: false,
    Typestate: false,
    location:null,
    gettingLocation: false,
    errorStr:null,
    error: false,
    dialog: false,
    alert: false,
    HasSelectedFilters: false,
    queryType: "standard",
    }
  },
  methods: {
    changeQueryType(){
      if(this.useRarity){
        this.queryType = "rarity"
        console.log("Query Type set to rarity")
      }
      else if (!this.useRarity){
        this.queryType = "standard"
        console.log("Query Type set to standard")
      }

    },
    comboFunction() {
      if(this.longitude=='' || this.latitude ==''){
        this.noCoords=true;
      }
      else{
      this.changeQueryType();
      this.SubmitBirdQuery();
      this.loading = true;
      this.dialog = true;
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
      try {
        this.location = await this.getLocation();
        this.gettingLocation = false;
        this.setCoordinates();
        this.alertHandle();
        
      } catch(e) {
        this.gettingLocation = false;
        this.errorStr = e.message;
        this.error = true;
        console.log(e)

      }
    },
    alertHandle() {
      this.alert=true;
      setTimeout(() => this.alert=false, 2500);
    },
    setCoordinates() {
      this.latitude = this.location.coords.latitude
      this.longitude = this.location.coords.longitude
      this.centerLatitude = this.location.coords.latitude
      this.centerLongitude = this.location.coords.longitude
      this.markers[0].position.lat = this.location.coords.latitude
      this.markers[0].position.lng = this.location.coords.longitude
    },
    findLocation() {
    },
    updateCoordinates(location) {
            //console.log(`location.latLng.lat() = ${location.latLng.lat()}`)
            this.latitude = location.latLng.lat()
            this.longitude = location.latLng.lng()
            
    },
    addFilter(birdType){
      this.HasSelectedFilters = true
      if(birdType == "All"){
        for(var bird in FilterToImageMap){
          if(!this.SelectedFilters.includes(bird)){
            this.SelectedFilters.push(bird)
            this.SelectedFilterImages.push(FilterToImageMap[bird])
          }
        }
      }
      if(!this.SelectedFilters.includes(birdType)){
        this.SelectedFilterImages.push(FilterToImageMap[birdType])
        this.SelectedFilters.push(birdType)
      }
      else{
        const index = this.SelectedFilterImages.indexOf(FilterToImageMap[birdType]);
        if (index > -1) {
          this.SelectedFilterImages.splice(index, 1);
        }
        const i = this.SelectedFilters.indexOf(birdType);
        if (i > -1) {
          this.SelectedFilters.splice(i, 1);
        }
      }
    },
    clearFilters(){
      this.HasSelectedFilters = false
      this.SelectedFilterImages = []
      this.SelectedFilters = []
    },
    async SubmitBirdQuery (){


    
      /////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////
      //////////SAMPLE API CALLS TO DATABASE///////////////////////////
      /*
      const resp = await AddUser.AddUserCall({
          UserID: "testuser0@gmail.com",
      })


      const resp = await Database.DataBaseCall({
          UserID: "testuser0@gmail.com",
          QueryType: "AddBird",
          BirdCommonName : "Northern Cardinal"
      })
      

      const resp = await Database.DataBaseCall({
          UserID: "testuser0@gmail.com",
          QueryType: "GetBirds",
      })
      */
      ////////////////////////////////////////////////////////////////////////////
      //////////SAMPLE API CALL TO GET ALL SIGHTINGS OF GIVEN SPECIES, TO/////////
      /////////BE USED ON THE VIEW BOOKMARK PAGE//////////////////////////////////
      /*
      const response = await AuthenticationService.SubmitBirdQuery({
          latitude: 30.5,
          longitude: -90.32,
          queryType: 'singlespecies',
          commonName: 'Northern Cardinal'
      })    
      */
      ///////////////////////////////////////////////////////////////////////////





      //Reset the shared session storage variables to null. These variables can be accessed by any of the other vue pages
      sessionStorage.BirdNames = []
      sessionStorage.BirdImages = []
      sessionStorage.BirdDescriptions = []
      var ob = {
          latitude: this.latitude,
          longitude: this.longitude,
          date: this.date,
          typeTags: this.SelectedFilters
      }
    

      try {
      const response = await AuthenticationService.SubmitBirdQuery({
          latitude: this.latitude,
          longitude: this.longitude,
          date: this.date,
          typeTags: this.SelectedFilters,
          queryType: this.queryType
      })
      console.log("//////////////////////////////////////////////////////")
      
      if(response.data["worked"] == "false"){
                console.log("//////////////////////////////////////////////////////")

          this.$router.push('/nodata');
       }
       else{


      this.clearFilters()
      //Parsing through json response
      var BirdsAry = []
      var BirdDescriptions = []
      var Locations = []
      var Dates = []
      var NumBirds = []
      var Birders = []
      var Countys = []
      var Confirmed = []
      var NumReports = []
      var BirdNames = []
      var BirdImages = []
      BirdsAry = response.data["Birds"]

    

      for (var i = 0; i<BirdsAry.length;i++){

        
        //Extract name
        this.birdNames[i] = BirdsAry[i].BirdName
        BirdNames.push(BirdsAry[i].BirdName)
        //Extract Image Url
        this.birdImages[i] = BirdsAry[i].Image
        BirdImages.push(BirdsAry[i].Image)
        //Extract Descriptions
        if(BirdsAry[i].Description != "No Data"){
            BirdDescriptions.push(BirdsAry[i].Description+"||||")
        }
        else{
            BirdDescriptions.push(" Description: | Where to Look: " + "||||")
        }
        //Extract Location
        Locations.push(BirdsAry[i].Location)
        Dates.push(BirdsAry[i].Date)
        NumBirds.push(BirdsAry[i].NumBirds)
        Birders.push(BirdsAry[i].Birder)
        Countys.push(BirdsAry[i].County)
        Confirmed.push(BirdsAry[i].Confirmed)
        NumReports.push(BirdsAry[i].NumReports)

      }
      
     

     if(sessionStorage.UserEmail != null){
       console.log("User is logged in")

      const resp = await Database.DataBaseCall({
          UserID: sessionStorage.UserEmail,
          QueryType: "GetBirds",
      })
      sessionStorage.WatchListBirds = resp.data["Birds"]
     }

     else{
       console.log("User is not logged in")
       sessionStorage.WatchListBirds = []
     }
      

    
      
      /*for (var i in BirdsAry){
        console.log(BirdsAry[i])
      }*/
     console.log(`There were ${BirdDescriptions.length} des birds returned`)
     console.log(`There were ${this.birdNames.length} images birds returned`)
     console.log(`There were ${this.birdImages.length} names returned`)
      this.birds = response.data["Birds"]
      sessionStorage.BirdNames = BirdNames
      sessionStorage.BirdImages = BirdImages
      sessionStorage.BirdDescriptions = BirdDescriptions
      sessionStorage.BirdDates = Dates
      sessionStorage.BirdLocations = Locations
      sessionStorage.Birders = Birders
      sessionStorage.County = Countys
      sessionStorage.Confirmed = Confirmed
      sessionStorage.NumReports = NumReports
      sessionStorage.NumBird = NumBirds
      
    /*if(this.queryType == "standard"){
      this.$router.push('/BirdRecommendations');
    }
    else if(this.queryType == "rarity"){
      this.$router.push('./ViewRarities')
    }*/

    if(this.useRarity == false){
      this.$router.push('/BirdRecommendations');
    }
    else if(this.useRarity){
      this.$router.push('./ViewRarities');
    }

     
    }
      }catch(e){
        console.log(e);
        this.loading=false;
        this.errorStr = e;
        this.connectionError = true;

      }
  },

  //passes in data from this page to stated component (aka other .vue page) - don't use this, this broke the code :/
}
}
</script>

<style scoped>
</style>