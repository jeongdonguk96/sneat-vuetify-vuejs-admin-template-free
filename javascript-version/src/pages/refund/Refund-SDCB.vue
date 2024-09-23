<template>
    <div class="content-wrapper">
        <br>
        <v-card class="p-4 mb-4" outlined>
            <v-card-title class="text-h6">
                <b>※ 취소 전 주의사항</b>
            </v-card-title>
            <v-card-text>
                <p>
                    <b><u>
                            <font color="red">1. 청소년 요금제 구매 건은 한도 복원 불가하다. (한도 측에 요청해야 한다.)</font>
                        </u></b><br>
                    <font color="blue">2. DB 확인 : SDCB DB에서 해당 REQUEST_ID를 조회하여 구매 상태인지 여부와 어느 단계에서 취소 요청이 누락되었는지 확인한다.<br>
                        &nbsp;&nbsp;→ TB_PURCHASE_INFO 와 TB_NOTI_PURCHASE 의 상태가 모두 “구매” 상태이면, “취소 요청”과 “취소 Noti 요청”을 모두
                        실행해야 한다.<br>
                        &nbsp;&nbsp;→ TB_NOTI_PURCHASE 의 상태만 “구매” 상태라면, “취소 Noti 요청”만 하면 된다.<br>
                        3. LOG 확인 : SDCB LOG에서 해당 REQUEST_ID를 조회하여 어느 단계에서 취소 요청이 누락되었는지 확인한다.<br>
                        &nbsp;&nbsp;→CancelNotification API 로그와 SendPurchaseNoti API 로그가 있는지 확인한다.</font><br>
                    <font color="red"><b><u>4. 취소 전 사업 팀과 개발 PM에 정말 취소하는 것인지 확인한다. <br>
                                5. “취소 Noti 요청”의 경우 실제 Noti API와는 달리 MMS는 전송되지 않는다 .<br>
                                6. 테스트 폰의 경우 SDCB 취소 상태만 업데이트된다. (한도 및 유큐브 연동 제외)</u></b></font>
                </p>
            </v-card-text>
        </v-card>
        <br> <br>

        <v-row align="center" justify="end">
            <v-col cols="auto">
                <v-text-field class="min-width-select" label="DCB" v-model="selectedDcb" variant="outlined" readonly></v-text-field>
            </v-col>
            <v-col cols="auto">
                <v-btn variant="elevated" @click="openRefundDialog">
                    취소 요청
                </v-btn>
            </v-col>
            <v-col cols="auto">
                <v-btn variant="elevated" @click="openRefundNotiDialog">
                    취소 Noti 요청
                </v-btn>
            </v-col>
        </v-row>
        <br>

        <div class="table-container">
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>request_id</th>
                            <th>partition_id</th>
                            <th>status</th>
                            <th>ctn</th>
                            <th>purchase_dt</th>
                            <th>total_price</th>
                            <th>cancel_dt</th>
                            <th>cancel_code</th>
                            <th>cancel_msg</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="contents.length === 0">
                            <td colspan="9" style="text-align: center;">데이터가 없습니다.</td>
                        </tr>
                        <tr v-else v-for="content in contents" :key="content.requestId">
                            <td>{{ content.requestId }}</td>
                            <td>{{ content.partitionId }}</td>
                            <td>{{ content.status }}</td>
                            <td>{{ content.ctn }}</td>
                            <td>{{ content.purchaseDt }}</td>
                            <td>{{ content.totalPrice }}</td>
                            <td>{{ content.cancelDt }}</td>
                            <td>{{ content.cancelCode }}</td>
                            <td>{{ content.cancelMsg }}</td>
                        </tr>
                    </tbody>
                </table>

                <v-dialog v-model="isRefundDialogVisible" max-width="600px">
                    <v-card>
                        <v-card-title class="text-h5">취소 요청</v-card-title> <br>
                        <v-card-text>
                            <v-text-field label="purchaseRequestId" v-model="form.refund.purchaseRequestId" /> <br>
                            <v-text-field label="purchaseOperatorTransactionId"
                                v-model="form.refund.purchaseOperatorTransactionId" /> <br>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" variant="outlined" text @click="closeDialog">취소</v-btn>
                            <v-btn color="blue darken-1" variant="outlined" text @click="refund">요청</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-dialog v-model="isRefundNotiDialogVisible" max-width="600px">
                    <v-card>
                        <v-card-title class="text-h5">취소 Noti 요청</v-card-title> <br>
                        <v-card-text>
                            <v-text-field label="deviceId" v-model="form.refundNoti.deviceId" /> <br>
                            <v-text-field label="prchsId" v-model="form.refundNoti.prchsId" /> <br>
                            <v-text-field label="prchsDt" v-model="form.refundNoti.prchsDt" /> <br>
                            <v-text-field label="cancelDt" v-model="form.refundNoti.cancelDt" /> <br>
                            <v-text-field label="requestId" v-model="form.refundNoti.requestId" /> <br>
                            <v-text-field label="purchaseOperatorTransactionId"
                                v-model="form.refundNoti.purchaseOperatorTransactionId" /> <br>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" variant="outlined" text @click="closeDialog">취소</v-btn>
                            <v-btn color="blue darken-1" variant="outlined" text @click="notiRefund">요청</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
        </div>
    </div>
</template>

<script setup lang='js'>
import { ref } from 'vue';
import { useRefundStore } from '@/plugins/stores/refund/refund-sdcb'
import { storeToRefs } from 'pinia'


const store = useRefundStore();
const { contents } = storeToRefs(store);


// 템플릿에서 모델로 사용하는 변수
const isRefundDialogVisible = ref(false);
const isRefundNotiDialogVisible = ref(false);
const form = ref({
    selectedDcb: ref(''),
    refund: {
        purchaseRequestId: '',
        purchaseOperatorTransactionId: ''
    },
    refundNoti: {
        deviceId: '',
        prchsId: '',
        prchsDt: '',
        cancelDt: '',
        requestId: '',
        purchaseOperatorTransactionId: ''
    }
});
let selectedDcb = ref('SDCB');


const openRefundDialog = () => {
    resetForm();
    isRefundDialogVisible.value = true;
};


const openRefundNotiDialog = () => {
    resetForm();
    isRefundNotiDialogVisible.value = true;
};


const closeDialog = () => {
    isRefundDialogVisible.value = false;
    isRefundNotiDialogVisible.value = false;
};


const resetForm = () => {
    form.value.refund.purchaseRequestId = '';
    form.value.refund.purchaseOperatorTransactionId = '';
    form.value.refundNoti.deviceId = '';
    form.value.refundNoti.prchsId = '';
    form.value.refundNoti.prchsDt = '';
    form.value.refundNoti.cancelDt = '';
    form.value.refundNoti.requestId = '';
    form.value.refundNoti.purchaseOperatorTransactionId = '';
};


const refund = () => {
    if (validateRefundForm()) {
        store.refund(
            selectedDcb.value,
            form.value.refund.purchaseRequestId,
            form.value.refund.purchaseOperatorTransactionId
        );
        closeDialog();
    }
};


const notiRefund = () => {
    if (validateNotiRefundForm()) {
        store.notiRefund(
            selectedDcb.value,
            form.value.refundNoti.deviceId,
            form.value.refundNoti.prchsId,
            form.value.refundNoti.prchsDt,
            form.value.refundNoti.cancelDt,
            form.value.refundNoti.requestId,
            form.value.refundNoti.purchaseOperatorTransactionId
        );
        closeDialog();
    }
};


const validateRefundForm = () => {
    if (selectedDcb.value === '' || selectedDcb.value === null) {
        alert('DCB를 선택해주세요.');
        return false;
    }

    if (form.value.refund.purchaseRequestId.trim().length === 0) {
        alert("purchaseRequestId 값을 입력해주세요.");
        return false;
    }
    
    if (form.value.refund.purchaseOperatorTransactionId.trim().length === 0) {
        alert("purchaseOperatorTransactionId 값을 입력해주세요.");
        return false;
    }
    
    return true;
}


const validateNotiRefundForm = () => {
    if (selectedDcb.value === '' || selectedDcb.value === null) {
        alert('DCB를 선택해주세요.');
        return false;
    }

    if (form.value.refundNoti.deviceId.trim().length === 0) {
        alert("deviceId 값을 입력해주세요.");
        return false;
    }
    
    if (form.value.refundNoti.prchsId.trim().length === 0) {
        alert("prchsId 값을 입력해주세요.");
        return false;
    }
        
    if (form.value.refundNoti.prchsDt.trim().length === 0) {
        alert("prchsDt 값을 입력해주세요.");
        return false;
    }
        
    if (form.value.refundNoti.cancelDt.trim().length === 0) {
        alert("cancelDt 값을 입력해주세요.");
        return false;
    }
        
    if (form.value.refundNoti.requestId.trim().length === 0) {
        alert("requestId 값을 입력해주세요.");
        return false;
    }
        
    if (form.value.refundNoti.purchaseOperatorTransactionId.trim().length === 0) {
        alert("purchaseOperatorTransactionId 값을 입력해주세요.");
        return false;
    }
    
    return true;
}
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
</style>
