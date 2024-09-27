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
                <v-btn variant="elevated" @click="validateAndGetContents">
                    조회
                </v-btn>
            </v-col>
        </v-row>
        <br>

        <v-row align="center">
            <v-col>
                <v-card-title class="table-title"><strong>Google Invoice Details File 통계</strong></v-card-title>
                <v-divider></v-divider>
            </v-col>
        </v-row>
        <div class="table-container">
            <div>
                <table>
                    <thead>
                        <tr>
                            <th rowspan="2">거래유형</th>
                            <th v-if="invoiceDetailsFileContents.length === 0" colspan="4">&nbsp;</th>
                            <th v-else colspan="4">{{ month }}</th>
                        </tr>
                        <tr>
                            <th>결제 수</th>
                            <th>거래 금액</th>
                            <th>U+ 매출</th>
                            <th>수수료</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="invoiceDetailsFileContents.length === 0">
                            <td colspan="5" style="text-align: center;">데이터가 없습니다.</td>
                        </tr>
                        <tr v-else v-for="content in invoiceDetailsFileContents" :key="content.filename">
                            <td>{{ content.month }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <br> <br> <br>

        <v-row align="center">
            <v-col>
                <v-card-title class="table-title"><strong>Google Summary File 통계</strong></v-card-title>
                <v-divider></v-divider>
            </v-col>
        </v-row>
        <div class="table-container">
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>아이템 구분</th>
                            <th>ItemPriceSum</th>
                            <th>TaxSum</th>
                            <th>TotalAmountSum</th>
                            <th>RevShareSum</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="summaryFileContents.length === 0">
                            <td colspan="5" style="text-align: center;">데이터가 없습니다.</td>
                        </tr>
                        <tr v-else v-for="content in summaryFileContents" :key="content.filename">
                            <td>계</td>
                            <td>{{ content.itemPriceSum }}</td>
                            <td>{{ content.taxSum }}</td>
                            <td>{{ content.totalAmountSum }}</td>
                            <td>{{ content.revShareSum }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang='js'>
import { ref, onMounted } from 'vue';
import { useAdjustmentStore } from '@/plugins/stores/reconciliation/adjustment-gdcb'
import { storeToRefs } from 'pinia'


const store = useAdjustmentStore();
const { invoiceDetailsFileContents, summaryFileContents } = storeToRefs(store);


// 지난 달을 구한다.
const getLastMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth()).padStart(2, '0');
    return `${year}-${month}`;
};


// 데이터 유효성 검사한 뒤 통계 데이터를 조회한다.
const validateAndGetContents = () => {
    if (selectedDcb.value === '' || selectedDcb.value == null) {
        alert("조회할 DCB를 선택해주세요.");
        return;
    }

    getContents();
};


// 데이터를 조회한다.
const getContents = () => {
    store.getContents(selectedDcb.value, month.value);
};


let selectedDcb = ref('GDCB');
let month = ref(getLastMonth());
const maxDate = ref(getLastMonth());


onMounted(() => {
    getContents(selectedDcb.value, month.value);
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

.min-width-select2 {
    min-width: 140px;
}
</style>
