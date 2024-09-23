<template>
    <div class="content-wrapper">
        <br>
        <v-row align="center" justify="end">
            <v-col cols="auto">
                <v-text-field class="min-width-select" label="DCB" v-model="selectedDcb" variant="outlined"
                    readonly></v-text-field>
            </v-col>
            <v-col cols="auto">
                <input type="date" v-model="startDate" :max="maxDate" />
                <input type="date" v-model="endDate" :min="startDate" :max="maxDate" />
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
                            <th>등록일자</th>
                            <th>이벤트일자</th>
                            <th>파일 구분</th>
                            <th>처리 서버</th>
                            <th>파일명</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="contents.length === 0">
                            <td colspan="6" style="text-align: center;">데이터가 없습니다.</td>
                        </tr>
                        <tr v-else v-for="(content, index) in contents" :key="content.id">
                            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                            <td>{{ content.ctn }}</td>
                            <td>{{ content.email }}</td>
                            <td>{{ content.name }}</td>
                            <td>{{ content.registrar }}</td>
                            <td>{{ content.registrationDate }}</td>
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
import { useReconciliationStore } from '@/plugins/stores/reconciliation/reconciliation-adcb'
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
        store.getContents(selectedDcb.value, startDate.value, endDate.value, selectedFileType.value, pageNumber);
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


// 데이터 유효성 검사한 뒤 통계 데이터를 조회한다.
const validateAndGetStatistics = () => {
    if (selectedDcb.value === '' || selectedDcb.value == null) {
        alert("조회할 DCB를 선택해주세요.");
        return;
    }

    if (startDate.value === '' || endDate.value === '') {
        alert("조회할 날짜를 모두 선택해주세요.");
        return;
    }

    const yesterday = new Date(getYesterday());
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays > 30) {
        alert("일별 조회는 최대 31일까지만 가능합니다.");
        return;
    }

    if (new Date(startDate.value) > yesterday || new Date(endDate.value) > yesterday) {
        alert("선택한 날의 데이터가 아직 생성되지 않았습니다.");
        return;
    }

    getStatistics();
};


// 데이터를 조회한다.
const getStatistics = () => {
    store.getContents(selectedDcb.value, startDate.value, endDate.value, selectedFileType.value, currentPage.value);
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

    const yesterday = new Date(getYesterday());
    if (new Date(startDate.value) > yesterday || new Date(endDate.value) > yesterday) {
        alert("선택한 날의 데이터가 아직 생성되지 않았습니다.");
        return;
    }

    exportData();
};


// 데이터를 엑셀로 내보낸다.
const exportData = async () => {
    await store.exportData(selectedDcb.value, startDate.value, endDate.value, selectedFileType.value);
};


// 템플릿에서 모델로 사용하는 변수
const fileTypeOptions = computed(() => {
    return ['전체', 'transaction', 'settlement', 'exception'];
});

let selectedDcb = ref('ADCB');
let selectedFileType = fileType;
let maxDate = ref(getYesterday());
let startDate = ref(getDateBefore31Days(new Date()));
let endDate = ref(getYesterday());
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
