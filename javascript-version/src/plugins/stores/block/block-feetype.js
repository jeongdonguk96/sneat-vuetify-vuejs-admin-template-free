import { defineStore } from 'pinia'
import axios from 'axios';

export const useBlockFeetypeStore = defineStore('main', {
    state: () => ({
        dcb: '',
        contents: [],
        total: '',
        pageSize: 10,
        currentPage: 1,
    }),

    actions: {
        // async getContents(dcb, feeTypeCode, page = 1) {
        //     const API_URL = "http://192.168.10.134:8080/block/fee";
        //     try {
        //         const response = await axios.get(API_URL, {
        //             params: { dcb, feeTypeCode, page, pageSize:this.pageSize }
        //         });
                
        //         this.contents = response.data.responsePage.content;
        //         this.total = response.data.responsePage.totalElements;
        //         this.currentPage = response.data.responsePage.number + 1;
        //         this.dcb = dcb;
        //     } catch (error) {
        //         alert('작업 중 에러가 발생했습니다.')
        //     }
        // },
        
        // async deleteContents(dcb, inputtedKeyword, feeTypeCodes) {
        //     const API_URL = "http://192.168.10.134:8080/block/fee";
        //     try {
        //         await axios.delete(API_URL, {
        //             data: { dcb, feeTypeCodes },
        //         });
                
        //         const remainingItems = this.total - feeTypeCodes.length;
        //         const totalPages = Math.ceil(remainingItems / this.pageSize);
        
        //         // 현재 페이지가 전체 페이지 수보다 크다면 이전 페이지로 이동
        //         // 그렇지 않으면 현재 페이지에 머무름
        //         const currentPage = this.currentPage > totalPages ? totalPages : this.currentPage;
                
        //         // 페이지를 다시 불러오기
        //         this.getContents(dcb, inputtedKeyword, currentPage);
        //     } catch (error) {
        //         alert('작업 중 에러가 발생했습니다.')
        //     }
        // },
        
        // async createContent(dcb, inputtedKeyword, feeTypeCode, feeTypeNm) {
        //     const API_URL = "http://192.168.10.134:8080/block/fee";
        //     try {
        //         await axios.post(API_URL, {
        //             dcb, feeTypeCode, feeTypeNm, mbrId: '동욱스',
        //         });
                
        //         const totalItems = this.total + 1;
        //         const totalPages = Math.ceil(totalItems / this.pageSize);
                
        //         this.getContents(dcb, inputtedKeyword, totalPages);
        //     } catch (error) {
        //         alert('작업 중 에러가 발생했습니다.')
        //     }
        // },
        
        async getContents(dcb, feeTypeCode, page = 1) {
            const API_URL = "http://localhost:8080/block/fee-types";
            try {
                const response = await axios.get(API_URL, {
                    params: { dcb, feeTypeCode, page, pageSize:this.pageSize }
                });
                
                this.contents = response.data.responsePage.content;
                this.total = response.data.responsePage.totalElements;
                this.currentPage = response.data.responsePage.number + 1;
                this.dcb = dcb;
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },
        
        async deleteContents(dcb, inputtedKeyword, feeTypeCodes) {
            const API_URL = "http://localhost:8080/block/fee-types";
            try {
                await axios.delete(API_URL, {
                    data: { dcb, feeTypeCodes },
                });
                
                const remainingItems = this.total - feeTypeCodes.length;
                const totalPages = Math.ceil(remainingItems / this.pageSize);
        
                // 현재 페이지가 전체 페이지 수보다 크다면 이전 페이지로 이동
                // 그렇지 않으면 현재 페이지에 머무름
                const currentPage = this.currentPage > totalPages ? totalPages : this.currentPage;
                
                // 페이지를 다시 불러오기
                this.getContents(dcb, inputtedKeyword, currentPage);
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },
        
        async createContent(dcb, inputtedKeyword, feeTypeCode, feeTypeName) {
            const API_URL = "http://localhost:8080/block/fee-types";
            try {
                await axios.post(API_URL, {
                    dcb, feeTypeCode, feeTypeName, mbrId: '동욱스',
                });
                
                const totalItems = this.total + 1;
                const totalPages = Math.ceil(totalItems / this.pageSize);
                
                this.getContents(dcb, inputtedKeyword, totalPages);
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },

    }
})
