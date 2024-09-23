<template>
    <div class="content-wrapper">
        <br>
        <v-row align="center" justify="end">
            <v-col cols="auto">
                <v-text-field class="min-width-select" label="DCB" v-model="selectedDcb" variant="outlined"
                    readonly></v-text-field>
            </v-col>
            <v-col cols="auto">
                <input type="month" v-model="month" :max="maxDate" />
            </v-col>
            <v-col cols="auto">
                <v-select class="min-width-select2" clearable label="파일 구분" placeholder="파일 구분" :items="fileTypeOptions"
                    v-model="selectedFileType" variant="outlined"></v-select>
            </v-col>
            <v-col cols="auto">
                <v-btn variant="elevated" @click="validateAndGetStatistics">
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
                            <th>구매년월</th>
                            <th>파일 구분</th>
                            <th>ID</th>
                            <th>파일명</th>
                            <th>작업 결과</th>
                            <th>일자</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="contents.length === 0">
                            <td colspan="7" style="text-align: center;">데이터가 없습니다.</td>
                        </tr>
                        <tr v-else v-for="(content, index) in contents" :key="content.filename">
                            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                            <td>{{ content.month }}</td>
                            <td>{{ content.type }}</td>
                            <td>{{ content.id }}</td>
                            <td>{{ content.filename }}</td>
                            <td>{{ content.result }}</td>
                            <td>{{ content.date }}</td>
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
import { useReconciliationStore } from '@/plugins/stores/reconciliation/reconciliation-gdcb'
import { storeToRefs } from 'pinia'


const store = useReconciliationStore();
const { fileType, contents, total, pageSize, currentPage } = storeToRefs(store);


const totalPages = computed(() => {
    return total.value ? Math.ceil(total.value / pageSize.value) : 0;
});


const goToPage = (pageNumber) => {
    if (selectedDcb.value === '' || selectedDcb.value === null) {
        alert('DCB를 선택해주세요.');
        return false;
    }

    if (pageNumber >= 1 && pageNumber <= totalPages.value) {
        store.getContents(selectedDcb.value, month.value, selectedFileType.value, pageNumber);
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


// 데이터 유효성 검사한 뒤 통계 데이터를 조회한다.
const validateAndGetStatistics = () => {
    if (selectedDcb.value === '' || selectedDcb.value == null) {
        alert("조회할 DCB를 선택해주세요.");
        return;
    }

    getStatistics();
};


// 데이터를 조회한다.
const getStatistics = () => {
    store.getContents(selectedDcb.value, month.value, selectedFileType.value, currentPage.value);
};


// 데이터의 유효성을 검사한 뒤 데이터를 엑셀로 내보낸다.
const validateAndExportData = () => {
    if (selectedDcb.value === '' || selectedDcb.value == null) {
        alert("조회할 DCB를 선택해주세요.");
        return;
    }

    exportData();
};


// 데이터를 엑셀로 내보낸다.
const exportData = async () => {
    await store.exportData(selectedDcb.value, month.value, selectedFileType.value);
};


const fileTypeOptions = computed(() => {
    return ['전체', 'Outstanding', 'invoice Details', 'invoice Summary', 'Invoice Details_기존 결제', 'Invoice Details_소액 결제', '구글 기준 월 대사 (전체)', '구글 기준 월 대사 (불일치)'];
});


let selectedDcb = ref('GDCB');
let selectedFileType = fileType;
let month = ref(getLastMonth());
const maxDate = ref(getLastMonth());
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

.min-width-select2 {
    min-width: 140px;
}
</style>
