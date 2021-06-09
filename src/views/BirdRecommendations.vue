

<template>

  <v-container fluid style="height: 100vh;">
  <v-col>
  <div class="d-flex flex-column justify-space-between align-center">
    <h1>Birds in the area on {{today}}:</h1>
    <br>
    <!--<h1>Tip: Click on the images to hear a description</h1>-->
    <v-alert transition="scale-transition" v-show="shown"
      border="top"
      color="info lighten-2"
      dark
      dismissible
    >
      <u>Tip:</u> Click on the images to hear a description.
    </v-alert>
    
    <h2></h2>
     <ul>
       <li style="list-style-type:none;" v-bind:key=idx v-for="(Bird, idx) in displayObjects">
         <div class="d-flex flex-column justify-space-between align-center">
         <u><h2>{{Bird.Name}}</h2></u>
         <v-img contain @click="TextToSpeech(Bird.Description)" :title="Bird.Name" :src="Bird.Image" alt=""></v-img>
          <br>
          
         <div class="description">
           <h3 v-if="(Bird.Description.length > 40)">Description</h3>
         {{Bird.Description.split('|')[0].split('Description:')[1]}}
         <br>
         <br>
            <h3 v-if="(Bird.Description.length > 40)">Where to Look</h3>
         {{Bird.Description.split('|')[1].split('Where to Look:')[0]}}
         </div>

        <transition name="fade" mode="out-in"><v-btn class="ma-2" v-if="$auth.isAuthenticated" v-bind:key="Bird.watching"  @click="newButton(Bird)" v-bind:color="Bird.watching ? 'accent' : 'gray'">
          <span>{{Bird.watching ? 'Watching' : 'Add to WatchList' }}</span>

          <v-icon>mdi-binoculars</v-icon>
        </v-btn></transition>

        <!-----<v-expand-x-transition><v-btn v-show="$auth.isAuthenticated && Bird.watching" @click="newButton(Bird)">
          <span>Watching</span>

          <v-icon>mdi-binoculars</v-icon>
        </v-btn></v-expand-x-transition>--->
          
          <br>
         </div>
       </li>
     </ul>
     <v-btn v-if="HasMoreResults" @click="ShowMore" x-large color="primary" dark class="ma-2">
        <v-icon left>mdi-bird</v-icon>
            View More Results</v-btn>

    </div>
  
  </v-col>
  </v-container>
</template>
<script>
import Database from '@/services/Database'

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();



today = mm + '/' + dd + '/' + yyyy;
  // eslint-disable 
  //Here we can call our API in the services->API.js which lets us call
  //our SubmitBirdQuery function that will send our user input to the backend in Json format! :))
 

  console.log(sessionStorage.BirdNames)
  
  var WatchList = sessionStorage.WatchListBirds

  var names = (sessionStorage.BirdNames).split(',')
  var images = (sessionStorage.BirdImages).split(',')
  var descriptions = (sessionStorage.BirdDescriptions).split('||||,')


  var AllObjects = []
  var DisplayObjects = []
  var NumShown = 0

  for(var i = 0; i<names.length; i++){

      var IsWatching = false
      if(WatchList.includes(names[i])){
        IsWatching = true
      }

      AllObjects.push({
        Name : names[i],
        Image : images[i],
        Description : descriptions[i],
        watching: IsWatching,
      })
  }

  if(AllObjects.length >= 5){
      for(var i=0; i<5; i++){
          DisplayObjects.push(AllObjects[i])
          NumShown += 1;
      }
  }
  else{
    for(var i=0; i<AllObjects.length; i++){
        DisplayObjects.push(AllObjects[i])
        NumShown += 1;
    }

  }

  export default {
    name: 'BirdRecommendations',
    title: 'Recommendations',
    created() {
       setTimeout(() => this.show(), 700);
    },
    destroyed() {
      location.reload();
    },
    data () {

      return {

        windowSize: {
        x: 0,
        y: 0,
        },

        today: today,
        shown: false,
        drawer: false,
        birdImages:images,
        BirdDescriptions: descriptions,
        displayObjects: DisplayObjects,
        CurrentShown: NumShown,
        HasMoreResults: true,
        watch: false
     
    }
  },
  mounted() {
    this.onResize();
  },
  methods: {
    show() {
      this.shown=true;
      setTimeout(() => this.shown=false, 6000);
    },
    TextToSpeech(StringInput){
        responsiveVoice.speak(StringInput, "US English Male")
        
    },
    ShowMore(){
      if(AllObjects.length == 0){
        this.HasMoreResults = false
      }
      else{
      var i =0;
      while(((AllObjects.length-NumShown-i)>0)&&(i!==5)){
        DisplayObjects.push(AllObjects[i+NumShown])
        i+=1
      }
      NumShown += i
      if(AllObjects.length === NumShown){
        this.HasMoreResults = false
      }
      }
      },

      buttonState(){
        if (this.watch === true){
          this.watch = false;
        }
        else{
          this.watch = true;
        }
     
     
    },

    onResize(){
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },

    async newButton(Bird){
      this.$set(Bird, 'watching', !Bird.watching);
      console.log(Bird.Name + " watching state set to " + Bird.watching )

      const resp = await Database.DataBaseCall({
          UserID: sessionStorage.UserEmail,
          QueryType: "AddBird",
          BirdCommonName : Bird.Name
      })

    },
  
    

  }
}


sessionStorage.BirdNames = ["","","","",""]
sessionStorage.BirdDescriptions = []
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

</style>
