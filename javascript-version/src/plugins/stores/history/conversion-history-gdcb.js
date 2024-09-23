import { defineStore } from 'pinia'
import axios from 'axios';

export const useConversionHistoryStore = defineStore('main', {
    state: () => ({
        dcb: '',
        keyword: '',
        smsmoContents: [],
        provisioningContents: [],
    }),

    actions: {
        async getContents(dcb, inputtedKeyword) {
            const API_URL = "http://192.168.10.134:8080/voc/history/conversion";
            try {
                const response = await axios.get(API_URL, {
                    params: { dcb, ctn: inputtedKeyword }
                });
                
                this.smsmoContents = response.smsmoContents;
                this.provisioningContents = response.provisioningContents;
                this.dcb = dcb;
                this.keyword = inputtedKeyword;
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },
    }
})
