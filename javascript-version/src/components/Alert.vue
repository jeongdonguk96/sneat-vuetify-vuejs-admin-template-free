<template>
    <v-dialog v-model="show" max-width="400px">
        <v-card>
            <v-card-title class="headline">Alert</v-card-title>
            <v-card-text>{{ message }}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="closeAlert">OK</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
  
<script>
    export default {
        data() {
            return {
                show: false,
                message: '',
            };
        },
        methods: {
            openAlert(msg) {
                this.message = msg;
                this.show = true;
            },
            closeAlert() {
                this.show = false;
            }
        }
    };
</script>
  
<style scoped>
</style>
