import { defineStore } from 'pinia'
import axios from 'axios';

export const useSellerByDayStore = defineStore('main', {
    state: () => ({
        dcb: '',
        keyword: '',
        contents: [],
        total: '',
        pageSize: 10,
        currentPage: 1,
    }),

    actions: {
        async getContents(dcb, month, inputtedKeyword, page = 1) {
            const API_URL = "http://192.168.10.134:8080/seller/day";
            try {
                const response = await axios.get(API_URL, {
                    params: { dcb, month, merchantName: inputtedKeyword, page, pageSize: this.pageSize }
                });
                
                this.contents = response.data.responsePage.content;
                this.total = response.data.responsePage.totalElements;
                this.currentPage = response.data.responsePage.number + 1;
                this.dcb = dcb;
                this.keyword = inputtedKeyword;
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },
        
        async exportData(dcb, month, inputtedKeyword) {
            const API_URL = "http://192.168.10.134:8080/seller/day/excel";
            try {
                const response = await axios.get(API_URL, {
                    params: { dcb, month, merchantName: inputtedKeyword },
                    responseType: 'blob',
                    headers: {
                        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    }
                });
                
                const today = new Date();
                const year = today.getFullYear();
                const thisMonth = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
                const day = String(today.getDate()).padStart(2, '0');
                const hours = String(today.getHours()).padStart(2, '0');
                const minutes = String(today.getMinutes()).padStart(2, '0');
                const seconds = String(today.getSeconds()).padStart(2, '0');
                const formattedTime = `${year}${thisMonth}${day}${hours}${minutes}${seconds}`;

                const contentDisposition = response.headers['content-disposition'];
                const fileName = contentDisposition ? contentDisposition.split('filename=')[1] : `${dcb} ${thisMonth} 판매자 일별 목록_${formattedTime}.xlsx`;

                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },
    }
})
