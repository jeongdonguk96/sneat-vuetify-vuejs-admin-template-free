import { defineStore } from 'pinia'
import axios from 'axios';

export const useLoginStore = defineStore('main', {
    state: () => ({
    }),

    actions: {
        async login(username, password) {
            const API_URL = "http://192.168.10.134:8080/login";
            try {
                const response = await axios.post(API_URL, { username, password });
                console.dir(response);

                if (response.status === 200) {
                    window.location.href = '/dashboard';
                } else {
                    alert('인증에 실패했습니다.');
                }
            } catch (error) {
                console.error(error)
                alert('작업 중 에러가 발생했습니다.');
            }
        },
    }
});
