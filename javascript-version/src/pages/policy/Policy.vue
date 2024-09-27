<template>
    <div class="content-wrapper">
        <br>
        <br>

        <div class="table-container">
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>정책</th>
                            <th v-for="dcb in dcbs">{{ dcb }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="contents.length === 0">
                            <td :colspan="dcbs.length + 1" style="text-align: center;">데이터가 없습니다.</td>
                        </tr>
                        <tr v-else v-for="(content, index) in contents" :key="content.ctn">
                            <td v-for="dcb in dcbs" :key="dcb">{{ content[dcb]}}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="pagination">
                    <br><br>
                    <v-row align="center" justify="end">
                        <v-col cols="auto">
                            <v-btn variant="elevated" @click="openCreateDialog">
                                정책 등록 요청
                            </v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn variant="elevated" @click="openModifyDialog">
                                정책 수정 요청
                            </v-btn>
                        </v-col>
                    </v-row>
                </div>
                
                <v-dialog v-model="isCreateDialogVisible" max-width="600px">
                    <v-card>
                        <v-card-title class="text-h5">결제 등록 요청</v-card-title> <br>
                        <v-card-text>
                            <v-text-field label="정책명" v-model="form.create.policyName" /> <br>
                            <v-subheader>적용 대상</v-subheader>
                            <v-row>
                                <v-col v-for="(dcb, index) in dcbs" :key="index" md="3">
                                    <v-checkbox :label="dcb" v-model="form.create.services" :value="dcb" multiple/>
                                </v-col>
                            </v-row> <br>
                            <v-text-field label="제안자"
                                v-model="form.create.requester" /> <br>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" variant="outlined" text @click="closeDialog">취소</v-btn>
                            <v-btn color="blue darken-1" variant="outlined" text @click="create">요청</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-dialog v-model="isModifyDialogVisible" max-width="600px">
                    <v-card>
                        <v-card-title class="text-h5">결제 수정 요청</v-card-title> <br>
                        <v-card-text>
                            <v-text-field label="deviceId" v-model="form.modify.deviceId" /> <br>
                            <v-text-field label="prchsId" v-model="form.modify.prchsId" /> <br>
                            <v-text-field label="prchsDt" v-model="form.modify.prchsDt" /> <br>
                            <v-text-field label="cancelDt" v-model="form.modify.cancelDt" /> <br>
                            <v-text-field label="requestId" v-model="form.modify.requestId" /> <br>
                            <v-text-field label="purchaseOperatorTransactionId"
                                v-model="form.modify.purchaseOperatorTransactionId" /> <br>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" variant="outlined" text @click="closeDialog">취소</v-btn>
                            <v-btn color="blue darken-1" variant="outlined" text @click="modify">요청</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
        </div>
    </div>
</template>

<script setup lang='js'>
import { ref, onMounted } from 'vue';
import { usePolicyStore } from '@/plugins/stores/policy/policy'
import { storeToRefs } from 'pinia'
import { dcbs } from '@/plugins/stores/common/dcb'


const store = usePolicyStore();
const { contents } = storeToRefs(store);


// 템플릿에서 모델로 사용하는 변수
const isCreateDialogVisible = ref(false);
const isModifyDialogVisible = ref(false);
const form = ref({
    selectedDcb: ref(''),
    create: {
        policyName: '',
        services: [],
        requester: ''
    },
    modify: {
        deviceId: '',
        prchsId: '',
        prchsDt: '',
        cancelDt: '',
        requestId: '',
        purchaseOperatorTransactionId: ''
    }
});


const getContents = () => {
    store.getContents();
}


const openCreateDialog = () => {
    resetForm();
    isCreateDialogVisible.value = true;
};


const openModifyDialog = () => {
    resetForm();
    isModifyDialogVisible.value = true;
};


const closeDialog = () => {
    isCreateDialogVisible.value = false;
    isModifyDialogVisible.value = false;
};


const resetForm = () => {
    form.value.create.policyName = '';
    form.value.create.requester = '';
    form.value.create.services = [];
};


onMounted(() => {
    getContents();
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
