import { defineStore } from 'pinia'
import axios from 'axios';

export const usePolicyStore = defineStore('main', {
    state: () => ({
        dcb: '',
        contents: [],
        total: '',
        pageSize: 10,
        currentPage: 1,
    }),

    actions: {       
        async getContents() {
            const API_URL = "http://localhost:8080/system/policy";
            try {
                const response = await axios.get(API_URL);
                
                this.contents = response.data.responsePage.content;
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },
    }
})
