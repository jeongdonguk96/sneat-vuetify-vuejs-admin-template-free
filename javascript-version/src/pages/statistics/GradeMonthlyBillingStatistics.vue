<template>
    <div class="content-wrapper">
        <br>
        <v-row align="center" justify="end">
            <v-col cols="auto">
                <v-select class="min-width-select" clearable label="DCB" placeholder="DCB" :items="dcbs" v-model="selectedDcb"
                    variant="outlined"></v-select>
            </v-col>
            <v-col cols="auto">
                <input type="month" v-model="month" :max="maxDate" />
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

        <VTable class="table-container centered-table">
            <thead>
                <tr>
                    <th rowspan="2">구분</th>
                    <th colspan="3">전체</th>
                    <th colspan="3">정상</th>
                    <th colspan="3">연체</th>
                </tr>
                <tr>
                    <th>청구대상(명)</th>
                    <th>청구건수(건)</th>
                    <th>청구액(원)</th>
                    <th>청구대상(명)</th>
                    <th>청구건수(건)</th>
                    <th>청구액(원)</th>
                    <th>청구대상(명)</th>
                    <th>청구건수(건)</th>
                    <th>청구액(원)</th>
                </tr>
            </thead>

            <tbody>
                <tr v-if="contents.length === 0">
                    <td colspan="10" style="text-align: center;">데이터가 없습니다.</td>
                </tr>
                <tr v-else v-for="(content, index) in contents" :key="index" :class="'section-' + ((index % 3) + 1)">
                    <td>{{ content.custGrdCd }}</td>
                    <td>{{ content.allAceCnt }}</td>
                    <td>{{ content.allCnt }}</td>
                    <td>{{ content.allAmount }}</td>
                    <td>{{ content.paidAceCnt }}</td>
                    <td>{{ content.paidCnt }}</td>
                    <td>{{ content.paidAmount }}</td>
                    <td>{{ content.unpaidAceCnt }}</td>
                    <td>{{ content.unpaidCnt }}</td>
                    <td>{{ content.unpaidAmount }}</td>
                </tr>
            </tbody>
        </VTable>
    </div>
</template>

<script setup lang='js'>
import { ref } from 'vue';
import { useGradeMonthlyBillingStatisticsStore } from '@/plugins/stores/statistics/grade-monthly-billing-statistics'
import { dcbs } from '@/plugins/stores/common/dcb'
import { storeToRefs } from 'pinia'


// pinia store 부분
const store = useGradeMonthlyBillingStatisticsStore();
const { dcb, contents } = storeToRefs(store);


// 지난 달을 구한다.
const getLastMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth()).padStart(2, '0');
    return `${year}-${month}`;
};

// 템플릿에서 모델로 사용하는 변수
const maxDate = ref(getLastMonth());
let month = ref(getLastMonth());
let selectedDcb = dcb;


// 데이터 유효성 검사한 뒤 통계 데이터를 조회한다.
const validateAndGetStatistics = () => {
    if (selectedDcb.value === '' || selectedDcb.value == null) {
        alert("조회할 DCB를 선택해주세요.");
        return;
    }

    if (month.value === '') {
        alert("조회할 달을 선택해주세요.");
        return;
    }

    const lastMonth = getLastMonth();
    if (month.value > lastMonth) {
        alert("선택한 달의 데이터가 아직 생성되지 않았습니다.");
        return;
    }

    getStatistics();
};


// 데이터를 조회한다.
const getStatistics = () => {
    store.getStatistics(selectedDcb.value, month.value);
};


// 데이터의 유효성을 검사한 뒤 데이터를 엑셀로 내보낸다.
const validateAndExportData = () => {
    if (selectedDcb.value === '' || selectedDcb.value == null) {
        alert("조회할 DCB를 선택해주세요.");
        return;
    }

    if (month.value === '') {
        alert("조회할 달을 선택해주세요.");
        return;
    }

    const lastMonth = getLastMonth();
    if (month.value > lastMonth) {
        alert("선택한 달의 데이터가 아직 생성되지 않았습니다.");
        return;
    }

    exportData();
};


// 데이터를 엑셀로 내보낸다.
const exportData = async () => {
    await store.exportData(selectedDcb.value, month.value);
};
</script>

<style scoped>
.content-wrapper {
    background-color: #f8f8f8;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.centered-table {
    margin: 0 auto;
    /* 테이블을 화면 중앙에 위치시키기 위해 */
    text-align: center;
    /* 텍스트 중앙 정렬 */
}

.table-container {
    border-radius: 0px;
}

.section-1 {
    background-color: #fdfdfd;
}

.section-2 {
    background-color: #f0f0f0;
}

.section-3 {
    background-color: #d0d0d0;
}

table {
    width: auto;
    /* 테이블 크기를 내용에 맞추기 위해 */
    border-collapse: collapse;
    margin: 0 auto;
    /* 테이블을 화면 중앙에 위치시키기 위해 */
}

th,
td {
    border: 1px solid black;
    padding: 8px;
    text-align: center !important;
    /* 모든 텍스트 중앙 정렬 */
    white-space: nowrap;
}

.min-width-select {
    min-width: 120px;
}</style>
