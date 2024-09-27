import { defineStore } from 'pinia'
import axios from 'axios';

export const useMemberStore = defineStore('main', {
    state: () => ({
        content: [],
        total: '',
        pageSize: 10,
        currentPage: 1,
    }),

    actions: {
        async getContents(page = 1) {
            const API_URL = "http://192.168.10.134:8080/members";
            try {
                const response = await axios.get(API_URL, {
                    params: { page, pageSize: this.pageSize }
                });
                this.contents = response.data.responsePage.content;
                this.total = response.data.responsePage.totalElements;
                this.currentPage = response.data.responsePage.number + 1;
                
                console.dir(this.contents)
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },
        
        async deleteContents(ids) {
            const API_URL = "http://192.168.10.134:8080/members";
            try {
                await axios.delete(API_URL, {
                    ids
                });
                
                const remainingItems = this.total - ids.length;
                const totalPages = Math.ceil(remainingItems / this.pageSize);
        
                // 현재 페이지가 전체 페이지 수보다 크다면 이전 페이지로 이동
                // 그렇지 않으면 현재 페이지에 머무름
                const currentPage = this.currentPage > totalPages ? totalPages : this.currentPage;
                
                // 페이지를 다시 불러오기
                this.getContents(currentPage);
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },
        
        async createContent(team, role, services, username, password, name, email) {
            const API_URL = "http://192.168.10.134:8080/members";
            try {
                await axios.post(API_URL, {
                    team, role, services, username, password, name, email,
                });
                
                const totalItems = this.total + 1;
                const totalPages = Math.ceil(totalItems / this.pageSize);
                
                this.getContents(totalPages);
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },
        
        async modifyContent(team, role, services, username, password) {
            const API_URL = "http://192.168.10.134:8080/members";
            try {
                await axios.put(API_URL, {
                    team, role, services, username, password,
                });
                
                const totalItems = this.total + 1;
                const totalPages = Math.ceil(totalItems / this.pageSize);
                
                this.getContents(totalPages);
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },
        
        async authenticate(password) {
            const API_URL = "http://192.168.10.134:8080/members/authentication";
            try {
                const response = await axios.get(API_URL, {
                    password
                });
                
                return response.data;
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },

    }
})
