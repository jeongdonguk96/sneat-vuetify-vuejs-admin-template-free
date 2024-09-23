<template>
    <div class="content-wrapper">
        <v-row>
            <v-col cols="auto">
                <div class="label-text">
                    ※ 일별 최대 조회 기간 : <b>31일</b> <br>
                    ※ 월별 최대 조회 기간 : <b>3달</b>
                </div>
            </v-col>
        </v-row>
        <v-row align="center" justify="end">
            <v-col cols="auto">
                <v-select class="min-width-select" clearable label="DCB" placeholder="DCB" :items="dcbs"
                    v-model="selectedDcb" variant="outlined"></v-select>
            </v-col>
            <v-col cols="auto">
                <select v-model="dateUnit" @change="onDateUnitChange">
                    <option value="day">일별</option>
                    <option value="month">월별</option>
                </select>
            </v-col>
            <v-col cols="auto">
                <input v-if="dateUnit === 'day'" type="date" v-model="startDate" :max="maxDate" />
                <input v-if="dateUnit === 'day'" type="date" v-model="endDate" :min="startDate" :max="maxDate" />
                <input v-if="dateUnit === 'month'" type="month" v-model="startDate" :max="maxDate" />
                <input v-if="dateUnit === 'month'" type="month" v-model="endDate" :min="startDate" :max="maxDate" />
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
        <v-table class="table-container">
            <thead>
                <tr>
                    <th>기간</th>
                    <th>결제 구간</th>
                    <th>결제자 수</th>
                    <th>전체 결제 건수</th>
                    <th>결제 금액</th>
                    <th>환불/취소 금액</th>
                    <th>실결제 금액</th>
                    <th>인당 결제 금액</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="contents.length === 0">
                    <td colspan="8" style="text-align: center;">데이터가 없습니다.</td>
                </tr>
                <template v-else>
                    <tr v-for="(data, index) in contents" :key="index">
                        <td v-if="data.statMonth && index === 0" :rowspan="contents.length">{{ data.statMonth }}</td>
                        <td v-if="data.statDay && index === 0" :rowspan="contents.length">{{ data.statDay }}</td>
                        <td>{{ data.a_stat }}</td>
                        <td>{{ data.b_stat }}</td>
                        <td>{{ data.c_stat }}</td>
                        <td>{{ data.d_stat }}</td>
                        <td>{{ data.e_stat }}</td>
                        <td>{{ data.f_stat }}</td>
                        <td>{{ data.g_stat }}</td>
                    </tr>
                </template>
            </tbody>
        </v-table>
    </div>
</template>

<script setup lang='js'>
import { ref } from 'vue';
import { useRangePaymentStatisticsStore } from '@/plugins/stores/statistics/range-payment-statistics';
import { storeToRefs } from 'pinia';
import { dcbs } from '@/plugins/stores/common/dcb'


// pinia store 부분
const store = useRangePaymentStatisticsStore();
const { dcb, contents } = storeToRefs(store);


// 어제 날짜를 구한다.
const getYesterday = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식
};


// 31일 전 날짜를 구한다.
const getDateBefore31Days = (baseDate, days = 31) => {
    const pastDate = new Date(baseDate);
    pastDate.setDate(pastDate.getDate() - days);
    return pastDate.toISOString().split('T')[0];
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


// 조회하는 타입을 구분한다.
const onDateUnitChange = () => {
    startDate.value = '';
    endDate.value = '';
    contents.value = [];

    if (dateUnit.value === 'day') {
        maxDate.value = getYesterday();
        startDate.value = getDateBefore31Days(new Date());
        endDate.value = getYesterday();
    } else {
        maxDate.value = getLastMonth();
        startDate.value = getThreeMonthsAgo(new Date());
        endDate.value = getLastMonth();
    }
};


// 템플릿에서 모델로 사용하는 변수
let selectedDcb = dcb;
let dateUnit = ref('month');
let maxDate = ref(getLastMonth());
let startDate = ref(getThreeMonthsAgo(new Date()));
let endDate = ref(getLastMonth());


// 데이터의 유효성을 검사한 뒤 통계 데이터를 조회한다.
const validateAndGetStatistics = () => {
    if (selectedDcb.value === '' || selectedDcb.value == null) {
        alert("조회할 DCB를 선택해주세요.");
        return;
    }

    if (startDate.value === '' || endDate.value === '') {
        alert("조회할 날짜를 모두 선택해주세요.");
        return;
    }

    if (dateUnit.value === 'day') {
        const yesterday = new Date(getYesterday());
        const start = new Date(startDate.value);
        const end = new Date(endDate.value);

        const differenceInTime = end.getTime() - start.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);

        if (differenceInDays > 30) {
            alert("일별 조회는 최대 31일까지만 가능합니다.");
            return;
        }

        if (start > yesterday || end > yesterday) {
            alert("선택한 날의 데이터가 아직 생성되지 않았습니다.");
            return;
        }

    } else {
        const lastMonth = getLastMonth();
        const start = new Date(startDate.value);
        const end = new Date(endDate.value);

        const startMonth = start.getMonth() + 1 + start.getFullYear() * 12;
        const endMonth = end.getMonth() + 1 + end.getFullYear() * 12;
        const differenceInMonths = endMonth - startMonth;

        if (differenceInMonths > 2) {
            alert("월별 조회는 최대 3개월까지만 가능합니다.");
            return;
        }

        if (startDate.value > lastMonth || endDate.value > lastMonth) {
            alert("선택한 달의 데이터가 아직 생성되지 않았습니다.");
            return;
        }
    }

    getStatistics();
};


// 데이터를 조회한다.
const getStatistics = async () => {
    if (dateUnit.value === 'day') {
        await store.getDailyStatistics(selectedDcb.value, startDate.value, endDate.value);
    } else {
        await store.getMonthlyStatistics(selectedDcb.value, startDate.value, endDate.value);
    }
};


// 데이터의 유효성을 검사한 뒤 데이터를 엑셀로 내보낸다.
const validateAndExportData = () => {
    if (selectedDcb.value === '' || selectedDcb.value == null) {
        alert("조회할 DCB를 선택해주세요.");
        return;
    }

    if (startDate.value === '' || endDate.value === '') {
        alert("조회할 날짜를 모두 선택해주세요.");
        return;
    }

    if (dateUnit.value === 'day') {
        const yesterday = new Date(getYesterday());

        if (new Date(startDate.value) > yesterday || new Date(endDate.value) > yesterday) {
            alert("선택한 날의 데이터가 아직 생성되지 않았습니다.");
            return;
        }

    } else {
        const lastMonth = getLastMonth();

        if (startDate.value > lastMonth || endDate.value > lastMonth) {
            alert("선택한 달의 데이터가 아직 생성되지 않았습니다.");
            return;
        }
    }

    exportData();
};


// 데이터를 엑셀로 내보낸다.
const exportData = async () => {
    if (dateUnit.value === 'day') {
        await store.exportDailyData(selectedDcb.value, startDate.value, endDate.value);
    } else {
        await store.exportMonthlyData(selectedDcb.value, startDate.value, endDate.value);
    }
};
</script>

<style>
.content-wrapper {
    background-color: #f8f8f8;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.table-container {
    border-radius: 0px;
}

.min-width-select {
    min-width: 120px;
}

.label-text {
    font-size: 0.90em !important;
    color: #000000;
}
</style>
