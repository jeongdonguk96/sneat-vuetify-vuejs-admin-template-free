<template>
    <div class="content-wrapper">
        <br>
        <v-row align="center" justify="end">
            <v-col cols="auto">
                <v-select class="min-width-select" clearable label="DCB" placeholder="DCB" :items="dcbs"
                    v-model="selectedDcb" variant="outlined"></v-select>
            </v-col>
            <v-col cols="auto">
                <input type="year" v-model="year" :max="maxDate" />
            </v-col>
            <v-col cols="auto">
                <v-text-field class="min-width-input" v-model="inputtedKeyword" label="판매자명"
                    variant="outlined"></v-text-field>
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

        <VTable class="table-container">
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>판매자명</th>
                            <th>Total</th>
                            <th>비율</th>
                            <th v-for="month in monthsInYear" :key="month">{{ month }}월</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="contents.length === 0">
                            <td colspan="16" style="text-align: center;">데이터가 없습니다.</td>
                        </tr>
                        <tr v-else v-for="(content, index) in contents" :key="content.merchantNm">
                            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                            <td>{{ content.merchantName }}</td>
                            <td>{{ content.total }}</td>
                            <td>{{ content.percent }}</td>
                            <td v-for="month in monthsInYear" :key="month">{{ content.monthlySales[month - 1] || 0 }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="pagination">
                    <br> <br>
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
        </VTable >
    </div>
</template>

<script setup lang='js'>
import { ref, computed } from 'vue';
import { useSellerByMonthStore } from '@/plugins/stores/seller/seller-by-month'
import { storeToRefs } from 'pinia'
import { dcbs } from '@/plugins/stores/common/dcb'


const store = useSellerByMonthStore();
const { dcb, keyword, contents, total, pageSize, currentPage } = storeToRefs(store);


const totalPages = computed(() => {
    return total.value ? Math.ceil(total.value / pageSize.value) : 0;
});


const goToPage = (pageNumber) => {
    if (selectedDcb.value === '' || selectedDcb.value === null) {
        alert('DCB를 선택해주세요.');
        return false;
    }

    if (pageNumber >= 1 && pageNumber <= totalPages.value) {
        store.getContents(selectedDcb.value, year.value, inputtedKeyword.value, pageNumber);
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


// 올해 연도를 구한다.
const getThisYear = () => {
    const today = new Date();
    return today.getFullYear();
};


// 데이터의 유효성을 검사한 뒤 데이터를 요청한다.
const validateAndGetContents = () => {
    if (selectedDcb.value === '' || selectedDcb.value === null) {
        alert('DCB를 선택해주세요.');
        return false;
    }

    if (year.value === '') {
        alert("조회할 연도를 선택해주세요.");
        return;
    }

    const thisYear = getThisYear();
    if (year.value > thisYear) {
        alert("선택한 연도의 데이터가 아직 생성되지 않았습니다.");
        return;
    }

    if (inputtedKeyword.value.trim().length === 0) {
        inputtedKeyword.value = '';
    }

    getContents();
}


// 데이터를 요청한다.
const getContents = () => {
    store.getContents(selectedDcb.value, year.value, inputtedKeyword.value, currentPage.value);
}


// 데이터의 유효성을 검사한 뒤 데이터를 엑셀로 내보낸다.
const validateAndExportData = () => {
    if (dcb.value === '' || dcb.value == null) {
        alert("조회할 DCB를 선택해주세요.");
        return;
    }

    if (year.value === '') {
        alert("조회할 연도를 선택해주세요.");
        return;
    }

    const thisYear = getThisYear();
    if (year.value > thisYear) {
        alert("선택한 연도의 데이터가 아직 생성되지 않았습니다.");
        return;
    }

    if (inputtedKeyword.value.trim().length === 0) {
        inputtedKeyword.value = '';
    }

    exportData();
};


// 데이터를 엑셀로 내보낸다.
const exportData = () => {
    store.exportData(selectedDcb.value, year.value, inputtedKeyword.value);
};


// 템플릿에서 모델로 사용하는 변수
let inputtedKeyword = keyword;
let selectedDcb = dcb;
let year = ref(getThisYear());
let maxDate = ref(getThisYear());

const monthsInYear = computed(() => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
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
    white-space: nowrap;
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
