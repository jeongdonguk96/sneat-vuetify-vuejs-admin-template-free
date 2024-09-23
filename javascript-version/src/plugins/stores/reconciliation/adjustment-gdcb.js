import { defineStore } from 'pinia'
import axios from 'axios';

export const useAdjustmentStore = defineStore('main', {
    state: () => ({
        invoiceDetailsFileContents: [],
        summaryFileContents: [],
    }),

    actions: {
        async getContents(dcb, month) {
            const API_URL = "http://192.168.10.134:8080/reconciliation/adjustment/gdcb";
            try {
                const response = await axios.get(API_URL, {
                    params: { dcb, month }
                });
                this.invoiceDetailsFileContents = response.invoiceDetailsFileContents;
                this.summaryFileContents = response.summaryFileContents;
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },
    }
})
