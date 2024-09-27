import { defineStore } from 'pinia'
import axios from 'axios';

export const useRefundStore = defineStore('main', {
    state: () => ({
        contents: [],
    }),

    actions: {
        async refund(dcb, purchaseRequestId, purchaseOperatorTransactionId) {
            const API_URL = "http://192.168.10.134:8080/refund/sdcb";
            try {
                const response = await axios.post(API_URL, {
                    dcb, purchaseRequestId, purchaseOperatorTransactionId
                });

                this.contents = response.data.content;
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },

        async notiRefund(dcb, deviceId, prchsId, prchsDt, cancelDt, requestId, purchaseOperatorTransactionId) {
            const API_URL = "http://192.168.10.134:8080/refund/notiRefund/sdcb";
            try {
                const response = await axios.post(API_URL, {
                    dcb, deviceId, prchsId, prchsDt, cancelDt, requestId, purchaseOperatorTransactionId
                });

                this.contents = response.data.content;
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },

    }
})
