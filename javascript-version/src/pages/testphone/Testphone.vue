<template>
    <div class="content-wrapper">
        <br>
        <v-row align="center" justify="end">
            <v-col cols="auto">
                <v-select class="min-width-select" clearable label="DCB" placeholder="DCB" :items="dcbs"
                    v-model="selectedDcb" variant="outlined"></v-select>
            </v-col>
            <v-col cols="auto">
                <v-text-field class="min-width-input" v-model="inputtedKeyword" label="CTN"
                    variant="outlined"></v-text-field>
            </v-col>
            <v-col cols="auto">
                <v-btn variant="elevated" @click="getContents">
                    조회
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
                            <th>선택</th>
                            <th>CTN</th>
                            <th>Email</th>
                            <th>이름</th>
                            <th>등록자</th>
                            <th>등록일자</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="contents.length === 0">
                            <td colspan="7" style="text-align: center;">데이터가 없습니다.</td>
                        </tr>
                        <tr v-else v-for="(content, index) in contents" :key="content.ctn">
                            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                            <td><input type="checkbox" v-model="selectedCtn" :value="content.ctn" /></td>
                            <td>
                                <span class="masked">{{ maskingCtn(content.ctn) }}</span>
                                <span class="original">{{ formatCtn(content.ctn) }}</span>
                            </td>
                            <td>
                                <span class="masked">{{ maskingEmail(content.email) }}</span>
                                <span class="original">{{ content.email }}</span>
                            </td>
                            <td>
                                <span class="masked">{{ maskingName(content.name) }}</span>
                                <span class="original">{{ content.name }}</span>
                            </td>
                            <td>
                                <span class="masked">{{ maskingId(content.registrar) }}</span>
                                <span class="original">{{ content.registrar }}</span>
                            </td>
                            <td>{{ content.registrationDate }}</td>
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

                <v-dialog v-model="isDialogVisible" max-width="600px">
                    <v-card>
                        <v-card-title class="text-h5">테스트폰 등록</v-card-title> <br>
                        <v-card-text>
                            <v-text-field label="CTN" v-model="form.ctn" :error-messages="ctnError"
                                @blur="ctnError = validateCtn(form.ctn)" /> <br>
                            <v-text-field label="Email" v-model="form.email" :error-messages="emailError"
                                @blur="emailError = validateEmail(form.email)" />
                            <br>
                            <v-text-field label="이름" v-model="form.name" :error-messages="nameError"
                                @blur="nameError = validateName(form.name)" /> <br>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" variant="outlined" text @click="closeDialog">취소</v-btn>
                            <v-btn color="blue darken-1" variant="outlined" text @click="save">저장</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
        </div>
    </div>
</template>

<script setup lang='js'>
import { ref, computed } from 'vue';
import { useTestphoneStore } from '@/plugins/stores/testphone/testphone'
import { validateCtn, validateEmail, validateName, validateInputtedCtn } from '@/plugins/stores/common/validation';
import { formatCtn, maskingCtn, maskingId, maskingEmail, maskingName } from '@/plugins/stores/common/masking';
import { storeToRefs } from 'pinia'
import { dcbs } from '@/plugins/stores/common/dcb'


const store = useTestphoneStore();
const { dcb, contents, total, pageSize, currentPage } = storeToRefs(store);


// 템플릿에서 모델로 사용하는 변수
const isDialogVisible = ref(false);
const form = ref({
    ctn: '',
    email: '',
    name: ''
});
const nameError = ref('');
const ctnError = ref('');
const emailError = ref('');
const selectedCtn = ref([]);
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
        selectedCtn.value = [];
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
    
    if (validateInputtedCtn(inputtedKeyword.value)) {
        alert(validateInputtedCtn(inputtedKeyword.value))
        return false;
    }

    store.getContents(selectedDcb.value, inputtedKeyword.value, currentPage.value);
    selectedCtn.value = [];
}


const deleteContents = () => {
    if (selectedDcb.value === '' || selectedDcb.value === null) {
        alert('DCB를 선택해주세요.');
        return false;
    }

    if (selectedCtn.value.length === 0) {
        alert('삭제할 테스트폰을 선택해주세요.')
        return;
    }

    const isConfirmed = confirm('정말 삭제하시겠습니까?');

    if (isConfirmed) {
        store.deleteContents(selectedDcb.value, inputtedKeyword.value, selectedCtn.value).then(() => {
            selectedCtn.value = [];
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
    form.value.ctn = '';
    form.value.email = '';
    form.value.name = '';
    ctnError.value = '';
    emailError.value = '';
    nameError.value = '';
};


const validateForm = () => {
    if (selectedDcb.value === '' || selectedDcb.value === null) {
        alert('DCB를 선택해주세요.');
        return false;
    }

    if (!form.value.ctn) {
        ctnError.value = 'CTN은 12자리 이하의 숫자여야 합니다.';
    }

    if (!form.value.email) {
        emailError.value = '유효한 이메일 주소를 입력하세요.';
    }

    if (!form.value.name) {
        nameError.value = '이름은 2~16자의 영문 또는 한글만 입력 가능합니다.';
    }

    return !nameError.value && !ctnError.value && !emailError.value;
};


const save = () => {
    if (validateForm()) {
        store.createContent(selectedDcb.value, inputtedKeyword.value, form.value.ctn, form.value.email, form.value.name);
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

.masked {
    display: inline; /* 항상 마스킹된 콘텐츠 표시 */
}

.original {
    display: none; /* 기본적으로 원본 콘텐츠 숨김 */
}

td:hover .masked {
    display: none; /* 마우스 오버 시 마스킹된 콘텐츠 숨김 */
}

td:hover .original {
    display: inline; /* 마우스 오버 시 원본 콘텐츠 표시 */
}
</style>
