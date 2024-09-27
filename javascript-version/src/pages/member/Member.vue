<template>
    <div class="content-wrapper">
        <div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>선택</th>
                            <th>소속</th>
                            <th>권한</th>
                            <th>서비스</th>
                            <th>아이디</th>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>잠금 여부</th>
                            <th>최종 로그인</th>
                            <th>수정</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="content.length === 0">
                            <td colspan="12" style="text-align: center;">데이터가 없습니다.</td>
                        </tr>
                        <tr v-else v-for="(content, index) in content" :key="content.memberId">
                            <td>{{ index + 1 }}</td>
                            <td><input type="checkbox" v-model="selectedMember" :value="content.memberId" /></td>
                            <td>{{ content.team }}</td>
                            <td>{{ content.role }}</td>
                            <td>{{ content.services.join(', ') }}</td>
                            <td>{{ maskingId(content.username) }}</td>
                            <td>{{ maskingName(content.name) }}</td>
                            <td>{{ maskingEmail(content.email) }}</td>
                            <td>{{ content.locked }}</td>
                            <td>{{ content.lastLoginDt }}</td>
                            <td><button class="edit-btn" @click="openAuthenticationDialog(content)">수정</button></td>
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
                            <v-btn variant="elevated" @click="openCreateDialog">
                                등록
                            </v-btn>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </div>
    </div>

    <v-dialog v-model="isCreateDialogVisible" max-width="600px">
        <v-card>
            <v-card-title class="text-h5">사용자 등록</v-card-title> <br>
            <v-card-subtitle class="description-text">
                <b>
                    ※ 관리자 : 팀 별로 하나의 관리자 권한 계정만 사용하시는 것을 권장합니다. <br>
                    ※ 사용자 : 팀 별로 생성한 하나의 관리자 계정 외에는 모두 사용자 권한 계정으로 사용하시는 것을 권장합니다.
                </b>
            </v-card-subtitle> <br>
            <v-card-text>
                <v-text-field label="소속" v-model="form.team" :error-messages="teamError"
                    @blur="teamError = validateTeam(form.team)" /> <br>
                <v-select label="권한" v-model="form.role" :items="roles" item-value="value" item-title="text"
                    :error-messages="roleError" @blur="roleError = validateRole(form.role)" /> <br>
                <v-subheader>서비스</v-subheader>
                <v-row>
                    <v-col v-for="(dcb, index) in dcbs" :key="index" md="3">
                        <v-checkbox :label="dcb" v-model="form.services" :value="dcb" />
                    </v-col>
                </v-row>
                <br> <br>
                <v-text-field label="아이디" v-model="form.username" :error-messages="usernameError"
                    @blur="usernameError = validateUsername(form.username)" /> <br>
                <v-text-field label="패스워드" v-model="form.password" :error-messages="passwordError"
                    @blur="passwordError = validatePassword(form.password)" /> <br>
                <v-text-field label="패스워드 확인" v-model="form.passwordConfirm" :error-messages="passwordConfirmError"
                    @blur="passwordConfirmError = validatePasswordConfirm(form.password, form.passwordConfirm)" />
                <br>
                <v-text-field label="이름" v-model="form.name" :error-messages="nameError"
                    @blur="nameError = validateName(form.name)" /> <br>
                <v-text-field label="이메일" v-model="form.email" :error-messages="emailError"
                    @blur="emailError = validateEmail(form.email)" /> <br>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" variant="outlined" text @click="closeDialog">취소</v-btn>
                <v-btn color="blue darken-1" variant="outlined" text @click="save">저장</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="isAuthenticationDialogVisible" max-width="600px">
        <v-card>
            <v-card-title class="text-h5">패스워드 인증</v-card-title> <br>
            <v-card-text>
                <v-text-field label="패스워드" v-model="form.password" :error-messages="passwordError"
                    @blur="passwordError = validatePassword(form.password)" /> <br>
                <v-text-field label="패스워드 확인" v-model="form.passwordConfirm" :error-messages="passwordConfirmError"
                    @blur="passwordConfirmError = validatePasswordConfirm(form.password, form.passwordConfirm)" />
                <br>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" variant="outlined" text @click="closeDialog">취소</v-btn>
                <v-btn color="blue darken-1" variant="outlined" text @click="authenticate">인증</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="isModifyDialogVisible" max-width="600px">
        <v-card>
            <v-card-title class="text-h5">사용자 수정</v-card-title> <br>
            <v-card-text>
                <v-text-field label="소속" v-model="form.team" :error-messages="teamError"
                    @blur="teamError = validateTeam(form.team)" /> <br>
                <v-subheader>서비스</v-subheader>
                <v-row>
                    <v-col v-for="(dcb, index) in dcbs" :key="index" md="3">
                        <v-checkbox :label="dcb" v-model="form.services" :value="dcb" />
                    </v-col>
                </v-row>
                <br> <br>
                <v-text-field label="아이디" v-model="form.username" :error-messages="usernameError"
                    @blur="usernameError = validateUsername(form.username)" /> <br>
                <v-text-field label="패스워드" v-model="form.password" :error-messages="passwordError"
                    @blur="passwordError = validatePassword(form.password)" /> <br>
                <v-text-field label="패스워드 확인" v-model="form.passwordConfirm" :error-messages="passwordConfirmError"
                    @blur="passwordConfirmError = validatePasswordConfirm(form.password, form.passwordConfirm)" />
                <br>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" variant="outlined" text @click="closeDialog">취소</v-btn>
                <v-btn color="blue darken-1" variant="outlined" text @click="modify">수정</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang='js'>
import { dcbs } from '@/plugins/stores/common/dcb';
import { roles } from '@/plugins/stores/common/role';
import { validateEmail, validateName, validatePassword, validatePasswordConfirm, validateRole, validateTeam, validateUsername } from '@/plugins/stores/common/validation';
import { maskingId, maskingEmail, maskingName } from '@/plugins/stores/common/masking';
import { useMemberStore } from '@/plugins/stores/member/member';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';


const store = useMemberStore();
const { content, total, pageSize, currentPage } = storeToRefs(store);


// 템플릿에서 모델로 사용하는 변수
const selectedMember = ref([]);
const isCreateDialogVisible = ref(false);
const isModifyDialogVisible = ref(false);
const isAuthenticationDialogVisible = ref(false);
const currentContent = ref(null);
const form = ref({
    team: '',
    role: '',
    services: [],
    username: '',
    password: '',
    passwordConfirm: '',
    name: '',
    email: '',
});
const teamError = ref('');
const roleError = ref('');
const serviceError = ref('');
const usernameError = ref('');
const passwordError = ref('');
const passwordConfirmError = ref('');
const nameError = ref('');
const emailError = ref('');


const totalPages = computed(() => {
    return total.value ? Math.ceil(total.value / pageSize.value) : 0;
});


const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages.value) {
        store.getContents(pageNumber);
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
    store.getContents(currentPage.value);
    selectedMember.value = [];
};


const deleteContents = () => {
    if (selectedMember.value.length === 0) {
        alert('삭제할 사용자를 선택해주세요.')
        return;
    }

    const isConfirmed = confirm('정말 삭제하시겠습니까?');

    if (isConfirmed) {
        store.deleteContents(selectedMember.value);
        selectedMember.value = [];
    }
};


const openCreateDialog = () => {
    resetForm();
    isCreateDialogVisible.value = true;
};


const openAuthenticationDialog = (content) => {
    currentContent.value = content;
    isAuthenticationDialogVisible.value = true;
};


const openModifyDialog = (content) => {
    resetForm();
    form.value = {
        team: content.team,
        services: content.services,
        username: content.username,
        password: '',
        passwordConfirm: '',
    };
    isModifyDialogVisible.value = true;
}


const closeDialog = () => {
    isCreateDialogVisible.value = false;
    isModifyDialogVisible.value = false;
    isAuthenticationDialogVisible.value = false;
};


const resetForm = () => {
    form.value.team = '';
    form.value.role = '';
    form.value.services = [];
    form.value.username = '';
    form.value.password = '';
    form.value.passwordConfirm = '';
    form.value.name = '';
    form.value.email = '';

    teamError.value = '';
    roleError.value = '';
    serviceError.value = '';
    usernameError.value = '';
    passwordError.value = '';
    passwordConfirmError.value = '';
    nameError.value = '';
    emailError.value = '';
};


const validateCreateForm = () => {
    if (!form.value.team) {
        teamError.value = '소속을 입력하세요';
    }

    if (!form.value.role) {
        roleError.value = '권한을 선택하세요';
    }

    if (!form.value.username) {
        usernameError.value = '아이디는 4~16자의 영문 또는 숫자로 구성되어야 합니다.';
    }

    if (!form.value.password) {
        passwordError.value = '비밀번호는 6~20자로 영문, 숫자, 특수문자 중 두 종류를 포함해야 합니다.';
    }

    if (!form.value.passwordConfirm) {
        passwordConfirmError.value = '비밀번호 확인이 일치하지 않습니다.';
    }

    if (!form.value.name) {
        nameError.value = '이름은 2~16자의 영문 또는 한글만 입력 가능합니다.';
    }

    if (!form.value.email) {
        emailError.value = '유효한 이메일 주소를 입력하세요.';
    }

    return !teamError.value && !roleError.value && !usernameError.value && !passwordError.value
        && !passwordConfirmError.value && !nameError.value && !emailError.value;
};


const validateAuthenticateForm = () => {
    if (!form.value.password) {
        passwordError.value = '비밀번호는 6~20자로 영문, 숫자, 특수문자 중 두 종류를 포함해야 합니다.';
    }

    if (!form.value.passwordConfirm) {
        passwordConfirmError.value = '비밀번호 확인이 일치하지 않습니다.';
    }

    return !passwordError.value && !passwordConfirmError.value;
};


const validateModifyForm = () => {
    if (!form.value.team) {
        teamError.value = '소속을 입력하세요';
    }

    if (!form.value.username) {
        usernameError.value = '아이디는 4~16자의 영문 또는 숫자로 구성되어야 합니다.';
    }

    if (!form.value.password) {
        passwordError.value = '비밀번호는 6~20자로 영문, 숫자, 특수문자 중 두 종류를 포함해야 합니다.';
    }

    if (!form.value.passwordConfirm) {
        passwordConfirmError.value = '비밀번호 확인이 일치하지 않습니다.';
    }

    return !roleError.value && !usernameError.value && !passwordError.value && !passwordConfirmError.value;
};


const validateSelectbox = () => {
    if (form.value.services.length === 0) {
        alert('서비스를 선택하세요.');
        return false
    }

    return true;
}


const save = () => {
    if (validateCreateForm() && validateSelectbox()) {
        store.createContent(
            form.value.team,
            form.value.role,
            form.value.services,
            form.value.username,
            form.value.password,
            form.value.name,
            form.value.email,
        );
        closeDialog();
    }
};


const authenticate = async () => {
    if (validateAuthenticateForm()) {
        const result = await store.authenticate(form.value.password);
        if (result.success) {
            closeDialog();
            openModifyDialog(currentContent.value);
        } else {
            alert('인증에 실패했습니다.');
        }
    }
};


const modify = () => {
    if (validateModifyForm() && validateSelectbox()) {
        store.modifyContent(
            form.value.team,
            form.value.services,
            form.value.username,
            form.value.password,
        );
        closeDialog();
    }
};


onMounted(() => {
    getContents(currentPage.value);
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
    white-space: nowrap;
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

.description-text {
    font-size: 0.75em !important;
    color: #000000;
}

.edit-btn {
    background-color: #4CAF50;
    /* Green */
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
    transition: background-color 0.3s ease;
}

.edit-btn:hover {
    background-color: #45a049;
}
</style>
