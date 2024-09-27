<template>
    <div class="content-wrapper">
        <br>
        <v-row align="center" justify="end">
            <v-col cols="auto">
                <v-select class="min-width-select" clearable label="DCB" placeholder="DCB" :items="dcbs"
                    v-model="selectedDcb" variant="outlined"></v-select>
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

        <div class="table-wrapper">
            <VTable v-if="contents.length === 0" class="table-container">
                데이터가 없습니다.
            </VTable>

            <VTable v-else class="table-container">
                <thead>
                    <tr>
                        <th class="sticky-col">구분</th>
                        <th v-for="dailyPayment in contents.statDay">
                            {{ dailyPayment }}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr class="section-1">
                        <td class="sticky-col">결제 금액 합</td>
                        <td v-for="dailyPayment in contents.totalAmount">
                            {{ dailyPayment }}
                        </td>
                    </tr>
                    <tr class="section-1">
                        <td class="sticky-col">구매 금액</td>
                        <td v-for="dailyPayment in contents.buyAmount">
                            {{ dailyPayment }}
                        </td>
                    </tr>
                    <tr class="section-1">
                        <td class="sticky-col">구매 비율</td>
                        <td v-for="dailyPayment in contents.buyAmountPercent">
                            {{ dailyPayment }}
                        </td>
                    </tr>
                    <tr class="section-1">
                        <td class="sticky-col">취소 금액</td>
                        <td v-for="dailyPayment in contents.cancelAmount">
                            {{ dailyPayment }}
                        </td>
                    </tr>
                    <tr class="section-1">
                        <td class="sticky-col">취소 비율</td>
                        <td v-for="dailyPayment in contents.cancelAmountPercent">
                            {{ dailyPayment }}
                        </td>
                    </tr>
                    <tr class="section-1">
                        <td class="sticky-col">환불 금액</td>
                        <td v-for="dailyPayment in contents.refundAmount">
                            {{ dailyPayment }}
                        </td>
                    </tr>
                    <tr class="section-1">
                        <td class="sticky-col">환불 비율</td>
                        <td v-for="dailyPayment in contents.refundAmountPercent">
                            {{ dailyPayment }}
                        </td>
                    </tr>

                    <tr class="section-2">
                        <td class="sticky-col">결제 건수 합</td>
                        <td v-for="dailyPayment in contents.paymentCount">
                            {{ dailyPayment }}
                        </td>
                    </tr>
                    <tr class="section-2">
                        <td class="sticky-col">구매 건수</td>
                        <td v-for="dailyPayment in contents.buyCount">
                            {{ dailyPayment }}
                        </td>
                    </tr>
                    <tr class="section-2">
                        <td class="sticky-col">구매 건수 비율</td>
                        <td v-for="dailyPayment in contents.buyCountPercent">
                            {{ dailyPayment }}
                        </td>
                    </tr>
                    <tr class="section-2">
                        <td class="sticky-col">취소 건수</td>
                        <td v-for="dailyPayment in contents.cancelCount">
                            {{ dailyPayment }}
                        </td>
                    </tr>
                    <tr class="section-2">
                        <td class="sticky-col">취소 건수 비율</td>
                        <td v-for="dailyPayment in contents.cancelCountPercent">
                            {{ dailyPayment }}
                        </td>
                    </tr>
                    <tr class="section-2">
                        <td class="sticky-col">환불 건수</td>
                        <td v-for="dailyPayment in contents.refundCount">
                            {{ dailyPayment }}
                        </td>
                    </tr>
                    <tr class="section-2">
                        <td class="sticky-col">환불 건수 비율</td>
                        <td v-for="dailyPayment in contents.refundCountPercent">
                            {{ dailyPayment }}
                        </td>
                    </tr>

                    <tr class="section-3">
                        <td class="sticky-col">건당 평균 구매 금액</td>
                        <td v-for="dailyPayment in contents.buyAmountAverage">
                            {{ dailyPayment }}
                        </td>
                    </tr>
                    <tr class="section-3">
                        <td class="sticky-col">건당 평균 취소 금액</td>
                        <td v-for="dailyPayment in contents.cancelAmountAverage">
                            {{ dailyPayment }}
                        </td>
                    </tr>
                    <tr class="section-3">
                        <td class="sticky-col">건당 평균 환불 금액</td>
                        <td v-for="dailyPayment in contents.refundAmountAverage">
                            {{ dailyPayment }}
                        </td>
                    </tr>
                </tbody>
            </VTable>
        </div>
    </div>
</template>

<script setup lang='js'>
import { dcbs } from '@/plugins/stores/common/dcb';
import { useDailyPaymentStatisticsStore } from '@/plugins/stores/statistics/daily-payment-statistics';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';


// pinia store 부분
const store = useDailyPaymentStatisticsStore();
const { dcb, contents } = storeToRefs(store);


// 이번 달을 구한다.
const getThisMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};


// 템플릿에서 모델로 사용하는 변수
const maxDate = ref(getThisMonth());
let month = ref(getThisMonth());
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

    const thisMonth = getThisMonth();
    if (month.value > thisMonth) {
        alert("선택한 달의 데이터가 아직 생성되지 않았습니다.");
        return;
    }

    getStatistics();
};


// 데이터를 조회한다.
const getStatistics = async () => {
    await store.getStatistics(selectedDcb.value, month.value);
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

    const lastMonth = getThisMonth();
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

.table-container {
    border-radius: 0px;
    border-collapse: collapse;
    width: 100%;
}

.table-wrapper {
  overflow-x: auto; /* 가로 스크롤 활성화 */
  width: 100%;
}

.sticky-col {
  position: sticky;
  left: 0;
  background-color: white; /* 스크롤할 때 고정된 열이 가려지지 않도록 배경색 지정 */
  z-index: 1; /* 테이블 데이터보다 위에 나타나도록 설정 */
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
