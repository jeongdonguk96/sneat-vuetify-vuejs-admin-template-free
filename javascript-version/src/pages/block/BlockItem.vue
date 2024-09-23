<template>
    <div class="content-wrapper">
        <br>
        <v-row align="center" justify="end">
            <v-col cols="auto">
                <v-select class="min-width-select" clearable label="DCB" placeholder="DCB" :items="dcbs" v-model="dcb"
                    variant="outlined"></v-select>
            </v-col>
            <v-col cols="auto">
                <v-text-field class="min-width-input" v-model="inputtedKeyword" label="상품명"
                    variant="outlined"></v-text-field>
            </v-col>
            <v-col cols="auto">
                <v-btn variant="elevated" @click="getContents">
                    조회
                </v-btn>
            </v-col>
        </v-row>

        <div class="table-container">
            <br>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>선택</th>
                            <th>상품명</th>
                            <th>등록자</th>
                            <th>등록일자</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="contents.length === 0">
                            <td colspan="5" style="text-align: center;">데이터가 없습니다.</td>
                        </tr>
                        <tr v-else v-for="(content, index) in contents" :key="content.itemNo">
                            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                            <td><input type="checkbox" v-model="selectedItem" :value="content.itemNo" /></td>
                            <td>{{ content.itemNm }}</td>
                            <td>{{ content.regId }}</td>
                            <td>{{ content.regDt }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="pagination">
                    <br><br>
                    <v-row align="center" justify="end">
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
                    <v-row align="center" justify="end">
                        <v-col cols="auto">
                            <v-btn @click="deleteContents">
                                삭제
                            </v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn variant="elevated" @click="openDialog">
                                등록
                            </v-btn>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </div>

        <v-dialog v-model="isDialogVisible" max-width="600px">
            <v-card>
                <v-card-title class="text-h5">차단 상품 등록</v-card-title> <br>
                <v-card-text>
                    <v-text-field label="상품명" v-model="form.item" /> <br>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" variant="outlined" text @click="closeDialog">취소</v-btn>
                    <v-btn color="blue darken-1" variant="outlined" text @click="save">저장</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang='js'>
import { ref, computed } from 'vue';
import { useBlockItemStore } from '@/plugins/stores/block/block-item'
import { storeToRefs } from 'pinia'
import { dcbs } from '@/plugins/stores/common/dcb'


const store = useBlockItemStore();
const { dcb, contents, total, pageSize, currentPage } = storeToRefs(store);


// 템플릿에서 모델로 사용하는 변수
const isDialogVisible = ref(false);
const form = ref({
    item: '',
});
let selectedItem = ref([]);
let selectedDcb = dcb;
let inputtedKeyword = ref('');


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
        selectedItem.value = [];
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
    selectedItem.value = [];
}


const deleteContents = () => {
    if (selectedDcb.value === '' || selectedDcb.value === null) {
        alert('DCB를 선택해주세요.');
        return false;
    }

    if (selectedItem.value.length === 0) {
        alert('삭제할 차단 상품을 선택해주세요.')
        return;
    }

    const isConfirmed = confirm('정말 삭제하시겠습니까?');

    if (isConfirmed) {
        store.deleteContents(selectedDcb.value, inputtedKeyword.value, selectedItem.value).then(() => {
            selectedItem.value = [];
        });
    }
};


const openDialog = () => {
    resetForm();
    isDialogVisible.value = true;
};


const closeDialog = () => {
    isDialogVisible.value = false;
};


const resetForm = () => {
    form.value.item = '';
};


const validateForm = () => {
    if (!form.value.item) {
        alert('차단할 상품을 선택해주세요.');
        return false;
    }

    return true;
};


const save = () => {
    if (validateForm()) {
        store.createContent(selectedDcb.value, inputtedKeyword.value, form.value.item);
        selectedItem.value = [];
        closeDialog();
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
