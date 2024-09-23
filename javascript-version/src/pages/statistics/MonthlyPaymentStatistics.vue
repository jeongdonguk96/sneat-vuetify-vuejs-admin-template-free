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
                <v-btn variant="elevated" @click="validateAndFetchData">
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

        <VTable v-if="contents.length === 0" class="table-container">
            데이터가 없습니다.
        </VTable>

        <VTable v-else class="table-container">
            <thead>
                <tr>
                    <th>구분</th>
                    <th v-for="monthlyPayment in contents.statMonth">
                        {{ monthlyPayment }}
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr class="section-1">
                    <td>결제 금액 합</td>
                    <td v-for="monthlyPayment in contents.totalAmount">
                        {{ monthlyPayment }}
                    </td>
                </tr>
                <tr class="section-1">
                    <td>구매 금액</td>
                    <td v-for="monthlyPayment in contents.buyAmount">
                        {{ monthlyPayment }}
                    </td>
                </tr>
                <tr class="section-1">
                    <td>구매 비율</td>
                    <td v-for="monthlyPayment in contents.buyAmountPercent">
                        {{ monthlyPayment }}
                    </td>
                </tr>
                <tr class="section-1">
                    <td>취소 금액</td>
                    <td v-for="monthlyPayment in contents.cancelAmount">
                        {{ monthlyPayment }}
                    </td>
                </tr>
                <tr class="section-1">
                    <td>취소 비율</td>
                    <td v-for="monthlyPayment in contents.cancelAmountPercent">
                        {{ monthlyPayment }}
                    </td>
                </tr>
                <tr class="section-1">
                    <td>환불 금액</td>
                    <td v-for="monthlyPayment in contents.refundAmount">
                        {{ monthlyPayment }}
                    </td>
                </tr>
                <tr class="section-1">
                    <td>환불 비율</td>
                    <td v-for="monthlyPayment in contents.refundAmountPercent">
                        {{ monthlyPayment }}
                    </td>
                </tr>

                <tr class="section-2">
                    <td>결제 건수 합</td>
                    <td v-for="monthlyPayment in contents.paymentCount">
                        {{ monthlyPayment }}
                    </td>
                </tr>
                <tr class="section-2">
                    <td>구매 건수</td>
                    <td v-for="monthlyPayment in contents.buyCount">
                        {{ monthlyPayment }}
                    </td>
                </tr>
                <tr class="section-2">
                    <td>구매 건수 비율</td>
                    <td v-for="monthlyPayment in contents.buyCountPercent">
                        {{ monthlyPayment }}
                    </td>
                </tr>
                <tr class="section-2">
                    <td>취소 건수</td>
                    <td v-for="monthlyPayment in contents.cancelCount">
                        {{ monthlyPayment }}
                    </td>
                </tr>
                <tr class="section-2">
                    <td>취소 건수 비율</td>
                    <td v-for="monthlyPayment in contents.cancelCountPercent">
                        {{ monthlyPayment }}
                    </td>
                </tr>
                <tr class="section-2">
                    <td>환불 건수</td>
                    <td v-for="monthlyPayment in contents.refundCount">
                        {{ monthlyPayment }}
                    </td>
                </tr>
                <tr class="section-2">
                    <td>환불 건수 비율</td>
                    <td v-for="monthlyPayment in contents.refundCountPercent">
                        {{ monthlyPayment }}
                    </td>
                </tr>

                <tr class="section-3">
                    <td>건당 평균 구매 금액</td>
                    <td v-for="monthlyPayment in contents.buyAmountAverage">
                        {{ monthlyPayment }}
                    </td>
                </tr>
                <tr class="section-3">
                    <td>건당 평균 취소 금액</td>
                    <td v-for="monthlyPayment in contents.cancelAmountAverage">
                        {{ monthlyPayment }}
                    </td>
                </tr>
                <tr class="section-3">
                    <td>건당 평균 환불 금액</td>
                    <td v-for="monthlyPayment in contents.refundAmountAverage">
                        {{ monthlyPayment }}
                    </td>
                </tr>
            </tbody>
        </VTable>
    </div>
</template>

<script setup lang='js'>
import { dcbs } from '@/plugins/stores/common/dcb';
import { useMonthlyPaymentStatisticsStore } from '@/plugins/stores/statistics/monthly-payment-statistics';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';


// pinia store 부분
const store = useMonthlyPaymentStatisticsStore();
const { dcb, contents } = storeToRefs(store);


// 올해를 구한다.
const getThisYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    return year;
};


// 템플릿에서 모델로 사용하는 변수
const maxDate = ref(getThisYear());
let year = ref(getThisYear());
let selectedDcb = dcb;


// 데이터 유효성 검사한 뒤 조회한다.
const validateAndFetchData = () => {
    if (selectedDcb.value === '' || selectedDcb.value == null) {
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

    getStatistics();
};


// 데이터를 조회한다.
const getStatistics = async () => {
    await store.getStatistics(selectedDcb.value, year.value);
};


// 데이터 유효성 검사한 뒤 데이터를 엑셀로 내보낸다.
const validateAndExportData = () => {
    if (selectedDcb.value === '' || selectedDcb.value == null) {
        alert("조회할 DCB를 선택해주세요.");
        return;
    }

    if (year.value === '') {
        alert("조회할 달을 선택해주세요.");
        return;
    }

    const thisYear = getThisYear();
    if (year.value > thisYear) {
        alert("선택한 연도의 데이터가 아직 생성되지 않았습니다.");
        return;
    }

    exportData();
};


// 데이터를 엑셀로 내보낸다.
const exportData = async () => {
    await store.exportData(selectedDcb.value, year.value);
};
</script>

<style scoped>
.content-wrapper {
    background-color: #f8f8f8;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
    white-space: nowrap;
}

.min-width-select {
    min-width: 120px;
}
</style>
