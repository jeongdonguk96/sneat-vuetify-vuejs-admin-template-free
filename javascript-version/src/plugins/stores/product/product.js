import { defineStore } from 'pinia'
import axios from 'axios';

export const useProductStore = defineStore('main', {
    state: () => ({
        dcb: '',
        keyword: '',
        contents: [],
        total: '',
        pageSize: 10,
        currentPage: 1,
    }),

    actions: {
        // async getContents(dcb, startDate, endDate, inputtedKeyword, page = 1) {
        //     const API_URL = "http://192.168.10.134:8080/product";
        //     try {
        //         const response = await axios.get(API_URL, {
        //             params: { dcb, startDate, endDate, productName: inputtedKeyword, page, pageSize: this.pageSize }
        //         });
                
        //         this.contents = response.data.responsePage.content;
        //         this.total = response.data.responsePage.totalElements;
        //         this.currentPage = response.data.responsePage.number + 1;
        //         this.dcb = dcb;
        //         this.keyword = inputtedKeyword;
        //     } catch (error) {
        //         alert('작업 중 에러가 발생했습니다.')
        //     }
        // },
        
        // async exportData(dcb, startDate, endDate, inputtedKeyword) {
        //     const API_URL = "http://192.168.10.134:8080/product/excel";
        //     try {
        //         const response = await axios.get(API_URL, {
        //             params: { dcb, startDate, endDate, productName: inputtedKeyword },
        //             responseType: 'blob',
        //             headers: {
        //                 'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        //             }
        //         });
                
        //         const today = new Date();
        //         const year = today.getFullYear();
        //         const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        //         const day = String(today.getDate()).padStart(2, '0');
        //         const hours = String(today.getHours()).padStart(2, '0');
        //         const minutes = String(today.getMinutes()).padStart(2, '0');
        //         const seconds = String(today.getSeconds()).padStart(2, '0');
        //         const formattedTime = `${year}${month}${day}${hours}${minutes}${seconds}`;

        //         const contentDisposition = response.headers['content-disposition'];
        //         const fileName = contentDisposition ? contentDisposition.split('filename=')[1] : `${dcb} ${startDate}~${endDate} 상품 목록_${formattedTime}.xlsx`;

        //         const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        //         const url = window.URL.createObjectURL(blob);
        //         const link = document.createElement('a');
        //         link.href = url;
        //         link.setAttribute('download', fileName);
        //         document.body.appendChild(link);
        //         link.click();
        //         document.body.removeChild(link);
        //         window.URL.revokeObjectURL(url);
        //     } catch (error) {
        //         console.error(error)
        //         alert('작업 중 에러가 발생했습니다.')
        //     }
        // }
        
        async getContents(dcb, startDate, endDate, inputtedKeyword, page = 1) {
            const API_URL = "http://localhost:8080/products";
            try {
                const response = await axios.get(API_URL, {
                    params: { dcb, startDate, endDate, productName: inputtedKeyword, page, pageSize: this.pageSize }
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
        
        async exportData(dcb, startDate, endDate, inputtedKeyword) {
            const API_URL = "http://localhost:8080/products/excel";
            try {
                const response = await axios.get(API_URL, {
                    params: { dcb, startDate, endDate, productName: inputtedKeyword },
                    responseType: 'blob',
                    headers: {
                        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    }
                });
                
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
                const day = String(today.getDate()).padStart(2, '0');
                const hours = String(today.getHours()).padStart(2, '0');
                const minutes = String(today.getMinutes()).padStart(2, '0');
                const seconds = String(today.getSeconds()).padStart(2, '0');
                const formattedTime = `${year}${month}${day}${hours}${minutes}${seconds}`;

                const contentDisposition = response.headers['content-disposition'];
                const fileName = contentDisposition ? contentDisposition.split('filename=')[1] : `${dcb} ${startDate}~${endDate} 상품 목록_${formattedTime}.xlsx`;

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
                console.error(error)
                alert('작업 중 에러가 발생했습니다.')
            }
        }
    }
})
