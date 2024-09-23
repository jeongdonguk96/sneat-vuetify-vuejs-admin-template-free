import { defineStore } from 'pinia'
import axios from 'axios';

export const useRefundStore = defineStore('main', {
    state: () => ({
        keyword: '',
        contents: [],
        total: '',
        pageSize: 10,
        currentPage: 1,
    }),

    actions: {
        async getContents(dcb, inputtedKeyword, page = 1) {
            const API_URL = "http://192.168.10.134:8080/refund/purchase-history";
            try {
                const response = await axios.get(API_URL, {
                    params: { dcb, inputtedKeyword, page, pageSize: this.pageSize }
                });
                
                this.contents = response.data.responsePage.content;
                this.total = response.data.responsePage.totalElements;
                this.currentPage = response.data.responsePage.number + 1;
                this.keyword = inputtedKeyword;
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        }
    }
})
