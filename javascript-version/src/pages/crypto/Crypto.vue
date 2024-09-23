<template>
    <div class="content-wrapper">
        <br>
        <v-card class="p-4 mb-4" outlined>
            <v-card-title class="text-h6">
                <b>암호화는 AES256에 salt를 더한 방식을 사용합니다.</b>
            </v-card-title>
        </v-card>
        <br> <br>
        
        <div class="encryption-page">
            <v-container>
                <v-row align="center" justify="space-around">
                    <!-- Left Text Area -->
                    <v-col cols="4">
                        <v-textarea v-model="inputText" label="입력" rows="10"></v-textarea>
                    </v-col>

                    <!-- Buttons Column -->
                    <v-col cols="2" class="button-column">
                        <v-btn @click="encryptText" class="action-button">암호화</v-btn>
                        <v-btn @click="decryptText" class="action-button">복호화</v-btn>
                    </v-col>

                    <!-- Right Text Area -->
                    <v-col cols="4">
                        <v-textarea v-model="outputText" label="결과" rows="10" readonly></v-textarea>
                    </v-col>
                </v-row>
            </v-container>
        </div>
    </div>
</template>

<script setup lang="js">
import { ref } from 'vue';
import { useCryptoStore } from '@/plugins/stores/crypto/crypto'
import { storeToRefs } from 'pinia'


const store = useCryptoStore();
const { outputText } = storeToRefs(store);


const inputText = ref('');


const encryptText = () => {
    store.encrypt(inputText.value);
};


const decryptText = () => {
    store.decrypt(inputText.value);
};
</script>

<style>
.content-wrapper {
    background-color: #f8f8f8;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.encryption-page {
    padding: 20px;
}

.button-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.action-button {
    margin: 10px 0;
}

textarea {
    resize: none;
}
</style>
