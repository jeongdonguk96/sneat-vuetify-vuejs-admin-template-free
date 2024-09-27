import axios from 'axios';
import { defineStore } from 'pinia';

export const useSellerStore = defineStore('main', {
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
        //     const API_URL = "http://192.168.10.134:8080/seller";
        //     try {
        //         const response = await axios.get(API_URL, {
        //             params: { dcb, startDate, endDate, merchantNm: inputtedKeyword, page, pageSize: this.pageSize }
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
        //     const API_URL = "http://192.168.10.134:8080/seller/excel";
        //     try {
        //         const response = await axios.get(API_URL, {
        //             params: { dcb, startDate, endDate, merchantNm: inputtedKeyword },
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
        //         const fileName = contentDisposition ? contentDisposition.split('filename=')[1] : `${dcb} ${startDate}~${endDate} 판매자 목록_${formattedTime}.xlsx`;

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
        //         alert('작업 중 에러가 발생했습니다.')
        //     }
        // },

        // async blockContents(dcb, startDate, endDate, inputtedKeyword, merchantNms) {
        //     const API_URL = "http://192.168.10.134:8080/seller";
        //     try {
        //         await axios.put(API_URL, {
        //             dcb, merchantNms
        //         });

        //         const remainingItems = this.total - merchantNms.length;
        //         const totalPages = Math.ceil(remainingItems / this.pageSize);

        //         // 현재 페이지가 전체 페이지 수보다 크다면 이전 페이지로 이동
        //         // 그렇지 않으면 현재 페이지에 머무름
        //         const currentPage = this.currentPage > totalPages ? totalPages : this.currentPage;

        //         // 페이지를 다시 불러오기
        //         this.getContents(dcb, startDate, endDate, inputtedKeyword, currentPage);
        //     } catch (error) {
        //         alert('작업 중 에러가 발생했습니다.')
        //     }
        // },

        async getContents(dcb, startDate, endDate, inputtedKeyword, page = 1) {
            const API_URL = "http://localhost:8080/sellers";
            try {
                const response = await axios.get(API_URL, {
                    params: { dcb, startDate, endDate, merchantName: inputtedKeyword, page, pageSize: this.pageSize }
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
        
        async blockContents(dcb, startDate, endDate, inputtedKeyword, merchantNames) {
            const API_URL = "http://localhost:8080/sellers";
            try {
                await axios.put(API_URL, {
                    dcb, merchantNames
                });

                const remainingItems = this.total - merchantNames.length;
                const totalPages = Math.ceil(remainingItems / this.pageSize);

                // 현재 페이지가 전체 페이지 수보다 크다면 이전 페이지로 이동
                // 그렇지 않으면 현재 페이지에 머무름
                const currentPage = this.currentPage > totalPages ? totalPages : this.currentPage;

                // 페이지를 다시 불러오기
                this.getContents(dcb, startDate, endDate, inputtedKeyword, currentPage);
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },
        
        async exportData(dcb, startDate, endDate, inputtedKeyword) {
            const API_URL = "http://localhost:8080/sellers/excel";
            try {
                const response = await axios.get(API_URL, {
                    params: { dcb, startDate, endDate, merchantName: inputtedKeyword },
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
                const fileName = contentDisposition ? contentDisposition.split('filename=')[1] : `${dcb} ${startDate}~${endDate} 판매자 목록_${formattedTime}.xlsx`;

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
