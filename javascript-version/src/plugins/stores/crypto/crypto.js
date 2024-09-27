import { defineStore } from 'pinia'
import axios from 'axios';

export const useCryptoStore = defineStore('main', {
    state: () => ({
        outputText: '',
    }),

    actions: {
        // async encrypt(text) {
        //     const API_URL = "http://192.168.10.134:8080/crypto/encrypt";
        //     try {
        //         const response = await axios.get(API_URL, {
        //             params: { text }
        //         });
        //         this.outputText = response.data;
        //     } catch (error) {
        //         alert('작업 중 에러가 발생했습니다.')
        //     }
        // },

        // async decrypt(text) {
        //     const API_URL = "http://192.168.10.134:8080/crypto/decrypt";
        //     try {
        //         const response = await axios.get(API_URL, {
        //             params: { text }
        //         });
        //         this.outputText = response.data;
        //     } catch (error) {
        //         alert('작업 중 에러가 발생했습니다.')
        //     }
        // },
        
        async encrypt(text) {
            const API_URL = "http://localhost:8080/crypto/encrypt";
            try {
                const response = await axios.get(API_URL, {
                    params: { text }
                });
                console.dir(response)
                this.outputText = response.data.data;
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },

        async decrypt(text) {
            const API_URL = "http://localhost:8080/crypto/decrypt";
            try {
                const response = await axios.get(API_URL, {
                    params: { text }
                });
                this.outputText = response.data.data;
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },
    }
})
