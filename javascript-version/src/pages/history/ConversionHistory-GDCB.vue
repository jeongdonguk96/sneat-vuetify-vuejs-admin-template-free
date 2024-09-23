<template>
    <div class="content-wrapper">
        <br>
        <v-row align="center" justify="end">
            <v-col cols="auto">
                <v-text-field class="min-width-select" label="DCB" v-model="selectedDcb" variant="outlined"
                    readonly></v-text-field>
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
        </v-row>
        <br>

        <v-row align="center">
            <v-col>
                <v-card-title class="table-title"><strong>smsmo 이력</strong></v-card-title>
                <v-divider></v-divider>
            </v-col>
        </v-row>
        <div class="table-container">
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>GUT</th>
                            <th>OUT</th>
                            <th>만료일</th>
                            <th>생성일</th>
                            <th>수정일</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="smsmoContents.length === 0">
                            <td colspan="5" style="text-align: center;">데이터가 없습니다.</td>
                        </tr>
                        <tr v-else v-for="content in smsmoContents" :key="content.id">
                            <td>{{ content.gut }}</td>
                            <td>{{ content.out }}</td>
                            <td>{{ content.expirationDate }}</td>
                            <td>{{ content.creadtedDate }}</td>
                            <td>{{ content.modifiedDate }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <br> <br> <br>

        <v-row align="center">
            <v-col>
                <v-card-title class="table-title"><strong>provisioning 이력</strong></v-card-title>
                <v-divider></v-divider>
            </v-col>
        </v-row>
        <div class="table-container">
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>SUBNO</th>
                            <th>OUT</th>
                            <th>isProvisioned</th>
                            <th>생성일</th>
                            <th>수정일</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="provisioningContents.length === 0">
                            <td colspan="5" style="text-align: center;">데이터가 없습니다.</td>
                        </tr>
                        <tr v-else v-for="content in provisioningContents" :key="content.id">
                            <td>{{ content.subNo }}</td>
                            <td>{{ content.out }}</td>
                            <td>{{ content.isProvisioned }}</td>
                            <td>{{ content.creadtedDate }}</td>
                            <td>{{ content.modifiedDate }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang='js'>
import { ref } from 'vue';
import { useConversionHistoryStore } from '@/plugins/stores/history/conversion-history-gdcb'
import { storeToRefs } from 'pinia'


const store = useConversionHistoryStore();
const { keyword, smsmoContents, provisioningContents } = storeToRefs(store);


// 데이터의 유효성을 검사한 뒤 데이터를 요청한다.
const validateAndGetContents = () => {
    if (selectedDcb.value === '' || selectedDcb.value === null) {
        alert('DCB를 선택해주세요.');
        return false;
    }

    if (inputtedKeyword.value.trim().length === 0) {
        alert('CTN을 입력해주세요.');
        return false;
    }

    getContents();
}


// 데이터를 요청한다.
const getContents = () => {
    store.getContents(selectedDcb.value, inputtedKeyword.value);
}


// 템플릿에서 모델로 사용하는 변수
let inputtedKeyword = keyword;
let selectedDcb = ref('GDCB');
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

.table-title {
    margin-top: 16px;
    margin-bottom: 8px;
    color: #333;
    /* Choose a color that fits your theme */
}

.v-divider {
    margin: 0 auto;
    width: 80%;
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
