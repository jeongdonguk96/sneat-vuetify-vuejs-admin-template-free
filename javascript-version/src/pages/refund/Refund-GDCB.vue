<template>
    <div class="content-wrapper">
        <br>
        <v-row align="center" justify="end">
            <v-col cols="auto">
                <v-text-field class="min-width-select" label="DCB" v-model="selectedDcb" variant="outlined" readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row align="center" justify="end">
            <v-col cols="auto">
                <span>CorrelationID :</span>
            </v-col>
            <v-col cols="auto">
                <v-text-field class="min-width-input" v-model="inputtedKeyword" label="CorrelationID"
                    variant="outlined"></v-text-field>
            </v-col>
            <v-col cols="auto">
                <v-btn variant="elevated" @click="getContents">
                    조회
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
                            <th>CorrelationID</th>
                            <th>CTN</th>
                            <th>상품명</th>
                            <th>가격</th>
                            <th>구매일자</th>
                            <th>구매상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="contents.length === 0">
                            <td colspan="7" style="text-align: center;">데이터가 없습니다.</td>
                        </tr>
                        <tr v-else v-for="(content, index) in contents" :key="content.correlationId">
                            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                            <td>{{ content.correlationId }}</td>
                            <td>{{ content.ctn }}</td>
                            <td>{{ content.name }}</td>
                            <td>{{ content.price }}</td>
                            <td>{{ content.regDate }}</td>
                            <td>{{ content.status }}</td>
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
import { ref, computed } from 'vue';
import { useRefundStore } from '@/plugins/stores/refund/refund-gdcb'
import { storeToRefs } from 'pinia'


const store = useRefundStore();
const { keyword, contents, total, pageSize, currentPage } = storeToRefs(store);


// 템플릿에서 모델로 사용하는 변수
let selectedDcb = ref('GDCB');
let inputtedKeyword = keyword;


const totalPages = computed(() => {
    return total.value ? Math.ceil(total.value / pageSize.value) : 0;
});


const goToPage = (pageNumber) => {
    if (selectedDcb.value === '' || selectedDcb.value === null) {
        alert('DCB를 선택해주세요.');
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


const getContents = () => {
    if (selectedDcb.value === '' || selectedDcb.value === null) {
        alert('DCB를 선택해주세요.');
        return false;
    }

    if (inputtedKeyword.value.trim().length === 0) {
        inputtedKeyword.value = '';
    }
    
    store.getContents(selectedDcb.value, inputtedKeyword.value, currentPage.value);
}
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
