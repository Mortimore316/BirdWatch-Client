<template>
    <v-dialog v-model="connectionError" width="500" class="justify-center">
        <v-card class="text-center">
        <v-card-title class="justify-center error lighten-2">
            <v-icon left>mdi-alert</v-icon> Connection Error! <v-icon right>mdi-alert</v-icon>
        </v-card-title>
            Cannot connect to backend! Maybe something is going on...
            <br>
            <em>{{errorStr}}</em>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="connectionError = false"> Okay</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    name: 'ConnectionError',
    props: {
        errorStr: String,
        connectionError: Boolean
    }
}
</script>