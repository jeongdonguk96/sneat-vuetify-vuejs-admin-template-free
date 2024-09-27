import axios from 'axios';

export const logPageAccess = async (route) => {
    const API_URL = "http://localhost:8080/access/page";
    
    try {
        await axios.post(API_URL, {
            page: route.path
        });
    } catch (error) {
        alert('작업 중 에러가 발생했습니다.')
        console.error('Failed to log page access:', error);
    }
};
