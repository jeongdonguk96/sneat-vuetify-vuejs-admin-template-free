import axios from 'axios';
import { defineStore } from 'pinia';

export const useLimitStore = defineStore('main', {
    state: () => ({
        dcb: '',
        contents: [],
    }),

    actions: {
        async getContents(dcb) {
            const API_URL = "http://192.168.10.134:8080/limit/gdcb";
            try {
                const response = await axios.get(API_URL, {
                    params: { dcb }
                });

                this.contents = response.data.responsePage.content;
                this.dcb = dcb;
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },
    }
})
