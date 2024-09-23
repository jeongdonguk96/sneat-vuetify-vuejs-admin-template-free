<template>
    <div class="content-wrapper">
        <br>
        <v-row align="center" justify="end">
            <v-col cols="auto">
                <v-select class="min-width-select" clearable label="DCB" placeholder="DCB" :items="dcbs"
                    v-model="selectedDcb" variant="outlined"></v-select>
            </v-col>
            <v-col cols="auto">
                <input type="date" v-model="startDate" :max="maxDate" />
                <input type="date" v-model="endDate" :min="startDate" :max="maxDate" />
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

        <VTable v-if="contents.length === 0" class="table-container">
            데이터가 없습니다.
        </VTable>

        <VTable v-else class="table-container">
            <thead>
                <tr>
                    <th>구분</th>
                    <th v-for="dailyPayment in contents.statDay">
                        {{ dailyPayment }}
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr class="section-1">
                    <td>결제 시도 수</td>
                    <td v-for="dailyPayment in contents.totalAmount">
                        {{ dailyPayment }}
                    </td>
                </tr>
                <tr class="section-1">
                    <td>성공 수</td>
                    <td v-for="dailyPayment in contents.buyAmount">
                        {{ dailyPayment }}
                    </td>
                </tr>
                <tr class="section-1">
                    <td>실패 수</td>
                    <td v-for="dailyPayment in contents.buyAmountPercent">
                        {{ dailyPayment }}
                    </td>
                </tr>
                <tr class="section-1">
                    <td>> 잔여 한도 부족</td>
                    <td v-for="dailyPayment in contents.cancelAmount">
                        {{ dailyPayment }}
                    </td>
                </tr>
                <tr class="section-1">
                    <td>> 청소년 요금제 잔여 한도 부족</td>
                    <td v-for="dailyPayment in contents.cancelAmountPercent">
                        {{ dailyPayment }}
                    </td>
                </tr>
                <tr class="section-1">
                    <td>> 7등급 차단</td>
                    <td v-for="dailyPayment in contents.refundAmount">
                        {{ dailyPayment }}
                    </td>
                </tr>
                <tr class="section-1">
                    <td>> 차단 요금제</td>
                    <td v-for="dailyPayment in contents.refundAmountPercent">
                        {{ dailyPayment }}
                    </td>
                </tr>
                <tr class="section-2">
                    <td>> MVNO 차단</td>
                    <td v-for="dailyPayment in contents.paymentCount">
                        {{ dailyPayment }}
                    </td>
                </tr>
                <tr class="section-2">
                    <td>> 고객 정보 없음</td>
                    <td v-for="dailyPayment in contents.refundCount">
                        {{ dailyPayment }}
                    </td>
                </tr>
                <tr class="section-2">
                    <td>> 듀얼 넘버 차단</td>
                    <td v-for="dailyPayment in contents.refundCountPercent">
                        {{ dailyPayment }}
                    </td>
                </tr>
                <tr class="section-3">
                    <td>> 만 14세 미만 차단</td>
                    <td v-for="dailyPayment in contents.buyAmountAverage">
                        {{ dailyPayment }}
                    </td>
                </tr>
                <tr class="section-3">
                    <td>> 법인폰 차단</td>
                    <td v-for="dailyPayment in contents.cancelAmountAverage">
                        {{ dailyPayment }}
                    </td>
                </tr>
                <tr class="section-3">
                    <td>> 분실폰 차단</td>
                    <td v-for="dailyPayment in contents.refundAmountAverage">
                        {{ dailyPayment }}
                    </td>
                </tr>
                <tr class="section-2">
                    <td>> NCAS TIMEOUT</td>
                    <td v-for="dailyPayment in contents.buyCount">
                        {{ dailyPayment }}
                    </td>
                </tr>
                <tr class="section-2">
                    <td>> NCAS ERROR</td>
                    <td v-for="dailyPayment in contents.buyCountPercent">
                        {{ dailyPayment }}
                    </td>
                </tr>
                <tr class="section-2">
                    <td>> RBP ERROR</td>
                    <td v-for="dailyPayment in contents.cancelCount">
                        {{ dailyPayment }}
                    </td>
                </tr>
                <tr class="section-2">
                    <td>> RCSG ERROR</td>
                    <td v-for="dailyPayment in contents.cancelCountPercent">
                        {{ dailyPayment }}
                    </td>
                </tr>
            </tbody>
        </VTable>
    </div>
</template>

<script setup lang='js'>
import { usePurchaseAnalyzeStore } from '@/plugins/stores/analyze/purchase-analyze';
import { dcbs } from '@/plugins/stores/common/dcb';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';


const store = usePurchaseAnalyzeStore();
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


// 데이터의 유효성을 검사한 뒤 데이터를 요청한다.
const validateAndGetContents = () => {
    if (selectedDcb.value === '' || selectedDcb.value === null) {
        alert('DCB를 선택해주세요.');
        return false;
    }

    if (startDate.value === '' || endDate.value === '') {
        alert("조회할 날짜를 모두 선택해주세요.");
        return;
    }

    const yesterday = new Date(getYesterday());

    if (new Date(startDate.value) > yesterday || new Date(endDate.value) > yesterday) {
        alert("선택한 날의 데이터가 아직 생성되지 않았습니다.");
        return;
    }

    getContents();
}


// 데이터를 요청한다.
const getContents = () => {
    store.getContents(selectedDcb.value, startDate.value, endDate.value);
}


// 데이터의 유효성을 검사한 뒤 데이터를 엑셀로 내보낸다.
const validateAndExportData = () => {
    if (dcb.value === '' || dcb.value == null) {
        alert("조회할 DCB를 선택해주세요.");
        return;
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

    exportData();
};


// 데이터를 엑셀로 내보낸다.
const exportData = () => {
    store.exportData(selectedDcb.value, startDate.value, endDate.value);
};


// 템플릿에서 모델로 사용하는 변수
let selectedDcb = dcb;
let startDate = ref(getDateBefore31Days(getYesterday()));
let endDate = ref(getYesterday());
let maxDate = ref(getYesterday());
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

.min-width-select {
    min-width: 120px;
}

.min-width-input {
    min-width: 160px;
}
</style>
