import { defineStore } from 'pinia'
import axios from 'axios';

export const useGradeMonthlyBillingStatisticsStore = defineStore('main', {
    state: () => ({
        dcb:  '',
        contents: [],
    }),

    actions: {
        async getStatistics(dcb, year) {
            const API_URL = "http://192.168.10.134:8080/payment/grade";
            try {
                const response = await axios.get(API_URL, {
                    params: { dcb, year }
                });
                this.contents = response.data.dataList;
                this.dcb = dcb;
            } catch (error) {
                alert('작업 중 에러가 발생했습니다.')
            }
        },
        
        async exportData(dcb, year) {
            const API_URL = "http://192.168.10.134:8080/payment/grade/excel";
            try {
                const response = await axios.get(API_URL, {
                    params: { dcb, year },
                    responseType: 'blob',
                    headers: {
                        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    }
                });
                
                const today = new Date();
                const thisYear = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
                const day = String(today.getDate()).padStart(2, '0');
                const hours = String(today.getHours()).padStart(2, '0');
                const minutes = String(today.getMinutes()).padStart(2, '0');
                const seconds = String(today.getSeconds()).padStart(2, '0');
                const formattedTime = `${thisYear}${month}${day}${hours}${minutes}${seconds}`;

                const contentDisposition = response.headers['content-disposition'];
                const fileName = contentDisposition ? contentDisposition.split('filename=')[1] : `${dcb} ${thisYear} 등급별 월 통계_${formattedTime}.xlsx`;

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
        }
    },
    
})
