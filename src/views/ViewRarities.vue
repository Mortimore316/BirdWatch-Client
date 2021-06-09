
<template>

  <v-container fluid style="height: 100vh;">
  <v-col>
  <div class="d-flex flex-column justify-space-between align-center">
    <h2>Notable species report for {{today}}:</h2>
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
         <button><v-img @click="TextToSpeech(Bird.Description)" :title="Bird.Name" :src="Bird.Image" alt=""> </v-img></button> 
          <br>
          
         <div class="description">
           <h3> Sightings Information </h3>
           <p> A <b> {{Bird.Name}} </b> was last reported to have been observed at <b> {{Bird.Date}} </b> by {{Bird.Birder}}. The location of the sighting was <b> {{Bird.Location}} </b> in <b>{{Bird.County}} </b>. {{Bird.Birder.split(" ")[0]}} reported to have seen <b>{{Bird.NumBird}}</b>. In the past 20 days, there have been <b>{{Bird.NumReports-1}}</b> other reports of {{Bird.Name}} within 20 miles</p> 
           <br>
           
           <h3 v-if="(Bird.Description.length > 40)">Description</h3>
         {{Bird.Description.split('|')[0].split('Description:')[1]}}
         <br>
         <br>
            <h3 v-if="(Bird.Description.length > 40)">Where to Look</h3>
         {{Bird.Description.split('|')[1].split('Where to Look:')[0]}}
         </div>

         
        <transition name="fade" mode="out-in"><v-btn v-if="$auth.isAuthenticated" v-bind:key="Bird.watching" @click="newButton(Bird)" v-bind:color="Bird.watching ? 'accent' : 'gray'">
          <span>{{Bird.watching ? 'Watching' : 'Add to WatchList' }}</span>

          <v-icon>mdi-binoculars</v-icon>
        </v-btn></transition>
          
          <br>
         </div>
       </li>
     </ul>
     <v-btn v-if="HasMoreResults" @click="ShowMore" x-large color="primary" dark class="ma-2">
        <v-icon left>mdi-bird</v-icon>
            View More Results</v-btn>

  <!--
  <h2>{{birds[0]['birdname']}}</h2>
  <v-img :title="birds[0]['birdname']" :src="birdImages[0]" alt=""> </v-img>
  <h2>{{birds[1]['birdname']}}</h2>
  <v-img :title="birds[1]['birdname']" :src="birdImages[1]" alt=""></v-img>
  <h2>{{birds[2]['birdname']}}</h2>
  <v-img :title="birds[1]['birdname']" :src="birdImages[2]" alt=""></v-img>
  <h2>{{birds[3]['birdname']}}</h2>
  <v-img :title="birds[1]['birdname']" :src="birdImages[3]" alt=""></v-img>
  <h2>{{birds[4]['birdname']}}</h2>
  <v-img :title="birds[1]['birdname']" :src="birdImages[4]" alt=""></v-img>
  -->
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
  console.log(sessionStorage.BirdImages)
  console.log(sessionStorage.BirdDescriptions)

  



  var names = (sessionStorage.BirdNames).split(',')
  var images = (sessionStorage.BirdImages).split(',')
  var dates = (sessionStorage.BirdDates).split(',')
  var locations = (sessionStorage.BirdLocations).split(',')
  var birders = (sessionStorage.Birders).split(',')
  var countys = (sessionStorage.County).split(',')
  var confirmed = (sessionStorage.Confirmed).split(',')
  var numreprots = (sessionStorage.NumReports).split(',')
  var numbirds = (sessionStorage.NumBird).split(',')
  var descriptions = (sessionStorage.BirdDescriptions).split('||||,')
  console.log("Descriptions: ")
  console.log(names[6])
  console.log(descriptions)

  var WatchList = sessionStorage.WatchListBirds

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
        Date : dates[i],
        Location : locations[i],
        Description : descriptions[i],
        Birder : birders[i],
        County : countys[i],
        Confirmed : confirmed[i],
        NumReports : numreprots[i],
        NumBird : numbirds[i],
        watching:IsWatching

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
    name: 'Rarities',
    title: 'Rarity Report',
    created() {
       setTimeout(() => this.show(), 700);
    },
    destroyed() {
      location.reload();
    },
    data () {
      return {

        today: today,
        shown: false,
        drawer: false,
        birdImages:images,
        BirdDescriptions: descriptions,
        displayObjects: DisplayObjects,
        CurrentShown: NumShown,
        HasMoreResults: true
     
    }
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
      if(AllObjects.length == NumShown){
        this.HasMoreResults = false
      }
      }



    },

    async newButton(Bird){
        this.$set(Bird, 'watching', !Bird.watching);
        console.log(Bird.Name + " watching state set to " + Bird.watching )

        const resp = await Database.DataBaseCall({
            UserID: sessionStorage.UserEmail,
            QueryType: "AddBird",
            BirdCommonName : Bird.Name
      })

     
      /*
        this.DisplayObjects
        */
    }
   
  }
}


sessionStorage.BirdNames = []
//sessionStorage.BirdImages = ["https://media.tenor.com/images/67d17766117cca8152040f688609472b/tenor.gif","https://media.tenor.com/images/67d17766117cca8152040f688609472b/tenor.gif","https://media.tenor.com/images/67d17766117cca8152040f688609472b/tenor.gif","https://media.tenor.com/images/67d17766117cca8152040f688609472b/tenor.gif","https://media.tenor.com/images/67d17766117cca8152040f688609472b/tenor.gif"]
sessionStorage.BirdImages = []
sessionStorage.BirdDescriptions = []
</script>

<style scoped>
.description{
  margin-left: 32% ;
  margin-right: 32%;
}
</style>
