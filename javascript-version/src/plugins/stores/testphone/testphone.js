import { defineStore } from 'pinia'
import axios from 'axios';

export const useTestphoneStore = defineStore('main', {
    state: () => ({
        dcb: '',
        contents: [],
        total: '',
        pageSize: 10,
        currentPage: 1,
    }),

    actions: {
        async getContents(dcb, page = 1) {
            const API_URL = "http://192.168.10.134:8080/testphone";
            try {
                const response = await axios.get(API_URL, {
                    params: { dcb, page, pageSize: this.pageSize }
                });
                
                this.contents = response.data.responsePage.content;
                this.total = response.data.responsePage.totalElements;
                this.currentPage = response.data.responsePage.number + 1;
                this.dcb = dcb;
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },
        
        async deleteContents(dcb, ctns) {
            const API_URL = "http://192.168.10.134:8080/testphone";
            try {
                await axios.delete(API_URL, {
                    data: { dcb, ctns },
                });
                
                const remainingItems = this.total - ctns.length;
                const totalPages = Math.ceil(remainingItems / this.pageSize);
        
                // 현재 페이지가 전체 페이지 수보다 크다면 이전 페이지로 이동
                // 그렇지 않으면 현재 페이지에 머무름
                const currentPage = this.currentPage > totalPages ? totalPages : this.currentPage;
                
                // 페이지를 다시 불러오기
                this.getContents(dcb, currentPage);
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },
        
        async createContent(dcb, ctn, email, name) {
            const API_URL = "http://192.168.10.134:8080/testphone";
            try {
                await axios.post(API_URL, {
                    dcb, ctn, email, name
                });
                
                const totalItems = this.total + 1;
                const totalPages = Math.ceil(totalItems / this.pageSize);
                
                this.getContents(dcb, totalPages);
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },

    }
})
