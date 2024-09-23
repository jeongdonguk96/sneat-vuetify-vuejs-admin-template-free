<template>
    <div class="content-wrapper">
        <br>
        <v-row align="center" justify="end">
            <v-col cols="auto">
                <v-text-field class="min-width-select" label="DCB" v-model="selectedDcb" variant="outlined"
                    readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row align="center" justify="end">
            <v-col cols="auto">
                <strong>결제 수단 :</strong>
            </v-col>
            <v-col cols="auto" v-for="(type, index) in paymentTypes" :key="index">
                <v-checkbox :label="type" :value="type" v-model="selectedPaymentTypes" />
            </v-col>
        </v-row>
        <v-row align="center" justify="end">
            <v-col cols="auto">
                <strong>검색 기간 :</strong>
            </v-col>
            <v-col cols="auto">
                <input type="month" v-model="startDate" :max="maxDate" />
                <input type="month" v-model="endDate" :min="startDate" :max="maxDate" />
            </v-col>
            <v-col cols="auto">
                <strong>기준 :</strong>
            </v-col>
            <v-col cols="auto">
                <v-select class="min-width-select" clearable :items="searchTypes" v-model="inputtedSearchType"
                    variant="outlined"></v-select>
            </v-col>
            <v-col cols="auto">
                <v-text-field class="min-width-input" v-model="inputtedKeyword" variant="outlined"></v-text-field>
            </v-col>
            <v-col cols="auto">
                <v-btn variant="elevated" @click="validateAndGetContents">
                    조회
                </v-btn>
            </v-col>
            <v-col cols="auto">
                <v-btn variant="elevated" @click="validateAndExportData">
                    엑셀
                </v-btn>
            </v-col>
        </v-row>
        <br>

        <div class="table-container">
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>CTN</th>
                            <th>결제일</th>
                            <th>취소일</th>
                            <th>결제 금액</th>
                            <th>결제 수단</th>
                            <th>상품명</th>
                            <th>판매자명</th>
                            <th>판매 회사명</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="contents.length === 0">
                            <td colspan="9" style="text-align: center;">데이터가 없습니다.</td>
                        </tr>
                        <tr v-else v-for="(content, index) in contents">
                            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                            <td>{{ content.ctn }}</td>
                            <td>{{ content.stdDt }}</td>
                            <td>{{ content.merchantContact }}</td>
                            <td>{{ content.price }}</td>
                            <td>{{ content.blockDt }}</td>
                            <td>{{ content.productId }}</td>
                            <td>{{ content.sellerId }}</td>
                            <td>{{ content.sellerCompany }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="pagination">
                    <br><br>
                    <v-row align="center" justify="center">
                        <v-col cols="auto">
                            <button @click="prevPage" :disabled="currentPage === 1"><b>이전</b></button> &nbsp;
                            <button v-for="pageNumber in totalPages" :key="pageNumber" @click="goToPage(pageNumber)"
                                :class="{ active: pageNumber === currentPage }">
                                {{ pageNumber }}
                            </button> &nbsp;
                            <button @click="nextPage" :disabled="currentPage === totalPages || totalPages < 1">
                                <b>다음</b>
                            </button>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='js'>
import { ref, computed, onMounted } from 'vue';
import { usePaymentHistoryStore } from '@/plugins/stores/payment/payment-history-sdcb'
import { storeToRefs } from 'pinia'


const store = usePaymentHistoryStore();
const { searchType, keyword, contents, total, pageSize, currentPage } = storeToRefs(store);


const totalPages = computed(() => {
    return total.value ? Math.ceil(total.value / pageSize.value) : 0;
});


const goToPage = (pageNumber) => {
    if (selectedDcb.value === '' || selectedDcb.value === null) {
        alert('DCB를 선택해주세요.');
        return false;
    }

    if (pageNumber >= 1 && pageNumber <= totalPages.value) {
        store.getContents(selectedDcb.value, selectedPaymentTypes.value, startDate.value, endDate.value, inputtedSearchType.value, inputtedKeyword.value, pageNumber);
    }
};


const prevPage = () => {
    if (currentPage.value > 1) {
        goToPage(currentPage.value - 1);
    }
};


const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        goToPage(currentPage.value + 1);
    }
};


// 지난 달을 구한다.
const getLastMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth()).padStart(2, '0');
    return `${year}-${month}`;
};


// 3달 전 달을 구한다.
const getThreeMonthsAgo = (baseDate) => {
    const date = new Date(baseDate);
    const month = date.getMonth();
    date.setMonth(month - 3);

    const adjustedYear = date.getFullYear();
    const adjustedMonth = String(date.getMonth() + 1).padStart(2, '0');

    return `${adjustedYear}-${adjustedMonth}`;
};

const validateAndGetContents = () => {
    if (selectedDcb.value === '' || selectedDcb.value === null) {
        alert('DCB를 선택해주세요.');
        return false;
    }

    if (startDate.value === '' || endDate.value === '') {
        alert("조회할 날짜를 모두 선택해주세요.");
        return;
    }

    const today = new Date(getToday());

    if (new Date(startDate.value) > today || new Date(endDate.value) > today) {
        alert("선택한 날의 데이터가 아직 생성되지 않았습니다.");
        return;
    }

    if (selectedPaymentTypes.value.length === 0) {
        alert("조회할 결제 수단을 선택해주세요.");
        return;
    }

    if (inputtedSearchType.value.trim().length === 0) {
        alert("조회할 기준을 선택해주세요.");
        return;
    }

    if (inputtedKeyword.value.trim().length === 0) {
        inputtedKeyword.value = '';
    }

    getContents();
}


const getContents = () => {
    store.getContents(selectedDcb.value, selectedPaymentTypes.value, startDate.value, endDate.value, inputtedSearchType.value, inputtedKeyword.value, pageNumber);
}


const validateAndExportData = () => {
    if (selectedDcb.value === '' || selectedDcb.value === null) {
        alert('DCB를 선택해주세요.');
        return false;
    }

    if (selectedPaymentTypes.value.length === 0) {
        alert("조회할 결제 수단을 선택해주세요.");
        return;
    }
    
    if (startDate.value === '' || endDate.value === '') {
        alert("조회할 날짜를 모두 선택해주세요.");
        return;
    }

    const lastMonth = getLastMonth();
    if (startDate.value > lastMonth || endDate.value > lastMonth) {
        alert("선택한 달의 데이터가 아직 생성되지 않았습니다.");
        return;
    }

    if (inputtedSearchType.value.trim().length === 0) {
        alert("조회할 기준을 선택해주세요.");
        return;
    }

    if (inputtedKeyword.value.trim().length === 0) {
        inputtedKeyword.value = '';
    }

    exportData();
};


const exportData = () => {
    store.exportData(selectedDcb.value, selectedPaymentTypes.value, startDate.value, endDate.value, inputtedSearchType.value, inputtedKeyword.value);
};


let inputtedSearchType = searchType;
let inputtedKeyword = keyword;
let selectedDcb = ref('SDCB');
let selectedPaymentTypes = ref([]);
let maxDate = ref(getLastMonth());
let startDate = ref(getThreeMonthsAgo(new Date()));
let endDate = ref(getLastMonth());
const paymentTypes = ['휴대폰 결제', '신용카드', 'U+스토어 캐시', '문화상품권(컬처캐시)', '쿠폰 결제', '기타'];
const searchTypes = ['CTN', '상품명'];


// 페이지 로드시 모든 결제 수단을 기본으로 선택
onMounted(() => {
    selectedPaymentTypes.value = [...paymentTypes];
});
</script>

<style>
.content-wrapper {
    background-color: #f8f8f8;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.table-container {
    margin-bottom: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead th,
tbody td {
    border: 1px solid #ddd;
    padding: 8px;
}

thead th {
    background-color: #f2f2f2;
    text-align: left;
}

.pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.pagination button {
    margin: 0 2px;
}

.pagination button.active {
    font-weight: bold;
}

.min-width-select {
    min-width: 120px;
}

.min-width-input {
    min-width: 160px;
}
</style>
