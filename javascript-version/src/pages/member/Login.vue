<template>
    <div class="auth-wrapper d-flex align-center justify-center pa-4">
        <div class="position-relative my-sm-16">


            <!-- 👉 Auth Card -->
            <VCard class="auth-card" width="460" :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'">
                <VCardItem class="justify-center">
                    <h1 class="app-logo-title">
                        DCB Admin
                    </h1>
                </VCardItem>

                <VCardText>
                    <h4 class="text-h4 mb-1">
                        <!-- Welcome to DCB Admin! 👋🏻 -->
                    </h4>
                </VCardText>

                <VCardText>
                    <VForm @submit.prevent="$router.push('/')">
                        <VRow>
                            <!-- email -->
                            <VCol cols="12">
                                <VTextField v-model="form.username" autofocus label="ID" type="text" placeholder="admin" />
                            </VCol>

                            <!-- password -->
                            <VCol cols="12">
                                <VTextField v-model="form.password" label="Password" placeholder="············"
                                    :type="isPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                                    @click:append-inner="isPasswordVisible = !isPasswordVisible" />

                                <!-- remember me checkbox -->
                                <div class="d-flex align-center justify-space-between flex-wrap my-6">
                                    <!-- <VCheckbox v-model="form.remember" label="Remember me" />

                                    <a class="text-primary" href="javascript:void(0)">
                                        Forgot Password?
                                    </a> -->
                                </div>
                                <div class="d-flex align-center justify-space-between flex-wrap my-6">
                                </div>

                                <!-- login button -->
                                <VBtn block @click="login">
                                    로그인
                                </VBtn>
                            </VCol>

                            <!-- create account -->
                            <!-- <VCol cols="12" class="text-body-1 text-center">
                                <span class="d-inline-block">
                                    아직 계정이 없으신가요?
                                </span> <br>
                                <RouterLink class="text-primary ms-1 d-inline-block text-body-1" to="/register">
                                    Create an account
                                </RouterLink>
                            </VCol> -->

                            <VCol cols="12" class="d-flex align-center">
                                <VDivider />
                                <span class="mx-4 text-high-emphasis">
                                    <!-- or -->
                                </span>
                                <VDivider />
                            </VCol>

                            <!-- auth providers -->
                            <VCol cols="12" class="text-center">
                                <!-- <AuthProvider /> -->
                            </VCol>
                        </VRow>
                    </VForm>
                </VCardText>
            </VCard>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLoginStore } from '@/plugins/stores/member/login'
import { storeToRefs } from 'pinia'

const store = useLoginStore();
const { } = storeToRefs(store);


const form = ref({
    username: '',
    password: '',
})


const isPasswordVisible = ref(false)


const validateForm = () => {
    if (form.value.username.trim() === '' || form.value.username === null) {
        alert('아이디를 입력해주세요.');
        return false;
    }

    if (form.value.password.trim() === '' || form.value.password === null) {
        alert('비밀번호를 입력해주세요.');
        return false;
    }

    return true;
};


const login = () => {
    if (validateForm()) {
        store.login(form.value.username, form.value.password);
    }
};
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
