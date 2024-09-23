<template>
    <div class="content-wrapper">
        <br>
        <v-card class="p-4 mb-4" outlined>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>SKP(A)</th>
                            <th>LGU+(B)</th>
                            <th>구분</th>
                            <th>비고</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>O</td>
                            <td>X</td>
                            <td>Case1</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>X</td>
                            <td>O</td>
                            <td>Case2</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>O</td>
                            <td>O</td>
                            <td>Case3</td>
                            <td>동일 RequestId에 대해 Column 정보 불일치한 경우</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </v-card>
        <br> <br> <br> <br>

        <v-row align="center" justify="end">
            <v-col cols="auto">
                <v-text-field class="min-width-select" label="DCB" v-model="selectedDcb" variant="outlined"
                    readonly></v-text-field>
            </v-col>
            <v-col cols="auto">
                <input type="month" v-model="month" :max="maxDate" />
            </v-col>
            <v-col cols="auto">
                <v-select class="min-width-select" clearable :items="searchTypes" v-model="inputtedSearchType" label="CASE"
                    variant="outlined"></v-select>
            </v-col>
            <v-col cols="auto">
                <v-text-field class="min-width-input" v-model="inputtedKeyword" label="CTN"
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
                            <th>CASE</th>
                            <th>Request Id</th>
                            <th>Transaction Id</th>
                            <th>결제 유형</th>
                            <th>결제 금액</th>
                            <th>처리 시간</th>
                            <th>사유</th>
                            <th>처리 방법</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="contents.length === 0">
                            <td colspan="9" style="text-align: center;">데이터가 없습니다.</td>
                        </tr>
                        <tr v-else v-for="(content, index) in contents">
                            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                            <td>{{ content.case }}</td>
                            <td>{{ content.requestId }}</td>
                            <td>{{ content.transactionId }}</td>
                            <td>{{ content.type }}</td>
                            <td>{{ content.price }}</td>
                            <td>{{ content.time }}</td>
                            <td>{{ content.reason }}</td>
                            <td>
                                <v-select :items="selectOptions" label="선택하세요" v-model="selectedOption"
                                    outlined></v-select>
                            </td>
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
        </VTable>
    </div>
</template>

<script setup lang='js'>
import { ref } from 'vue';
import { useReconciliationErrorStore } from '@/plugins/stores/reconciliation/reconciliation-error-sdcb'
import { storeToRefs } from 'pinia'


const store = useReconciliationErrorStore();
const { keyword, contents, total, pageSize, currentPage } = storeToRefs(store);


// 이번 달을 구한다.
const getThisMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};


const totalPages = computed(() => {
    return total.value ? Math.ceil(total.value / pageSize.value) : 0;
});


const goToPage = (pageNumber) => {
    if (selectedDcb.value === '' || selectedDcb.value === null) {
        alert('DCB를 선택해주세요.');
        return false;
    }

    if (inputtedKeyword.value.trim().length === 0) {
        alert('CTN을 입력해주세요.');
        return false;
    }

    if (pageNumber >= 1 && pageNumber <= totalPages.value) {
        store.getContents(selectedDcb.value, inputtedKeyword.value, pageNumber);
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


const validateAndGetContents = () => {
    if (selectedDcb.value === '' || selectedDcb.value === null) {
        alert('DCB를 선택해주세요.');
        return false;
    }

    if (month.value === '') {
        alert("조회할 달을 선택해주세요.");
        return;
    }

    const thisMonth = getThisMonth();
    if (month.value > thisMonth) {
        alert("선택한 달의 데이터가 아직 생성되지 않았습니다.");
        return;
    }

    if (inputtedSearchType.value.length === 0) {
        alert("조회할 CASE를 선택해주세요.");
        return;
    }

    if (inputtedKeyword.value.trim().length === 0) {
        inputtedKeyword.value = '';
    }

    getContents();
}


const getContents = () => {
    store.getContents(selectedDcb.value, month.value, inputtedSearchType.value, inputtedKeyword.value, pageNumber);
}


// 템플릿에서 모델로 사용하는 변수
let inputtedKeyword = keyword;
let selectedDcb = ref('SDCB');
let selectedOption = ref('선택하세요');
let inputtedSearchType = ref('');
const searchTypes = ['CASE1', 'CASE2', 'CASE3'];
const selectOptions = ['선택하세요', '청구 내역 생성(자동)', '청구 내역 취소(자동)', '청구 취소(자동) 후 SKP에 재전송 요청', 'SKP에 구매 이력 생성 요청', 'SKP에 구매 취소 요청'];
const maxDate = ref(getThisMonth());
let month = ref(getThisMonth());
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
