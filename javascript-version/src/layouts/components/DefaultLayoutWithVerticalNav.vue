<template>
    <VerticalNavLayout>
        <!-- 👉 navbar -->
        <template #navbar="{ toggleVerticalOverlayNavActive }">
            <div class="d-flex h-100 align-center">
                <!-- 👉 Vertical nav toggle in overlay mode -->
                <IconBtn class="ms-n3 d-lg-none" @click="toggleVerticalOverlayNavActive(true)">
                    <VIcon icon="bx-menu" />
                </IconBtn>

                <!-- 현재 라우트의 이름을 좌측에 표시 -->
                <h2 class="current-route-name">{{ route.meta.title }}</h2>

                <VSpacer />

                <UserProfile />
            </div>
        </template>

        <template #vertical-nav-header="{ toggleIsOverlayNavActive }">
            <RouterLink to="/dashboard" class="app-logo app-title-wrapper">
                <!-- eslint-enable -->

                <h1 class="app-logo-title">
                    DCB ADMIN
                </h1>
            </RouterLink>

            <IconBtn class="d-block d-lg-none" @click="toggleIsOverlayNavActive(false)">
                <VIcon icon="bx-x" />
            </IconBtn>
        </template>

        <template #vertical-nav-content>
            <NavItems />
        </template>

        <!-- 👉 Pages -->
        <slot />

        <!-- 👉 Footer -->
        <template #footer>
            <Footer />
        </template>
    </VerticalNavLayout>
</template>

<script setup>
import Footer from '@/layouts/components/Footer.vue';
import NavItems from '@/layouts/components/NavItems.vue';
import UserProfile from '@/layouts/components/UserProfile.vue';
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue';

const route = useRoute()
</script>

<style lang="scss" scoped>
.meta-key {
    border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
    border-radius: 6px;
    block-size: 1.5625rem;
    line-height: 1.3125rem;
    padding-block: 0.125rem;
    padding-inline: 0.25rem;
}

.app-logo-title {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.75rem;
    text-transform: uppercase;
}

/* 현재 라우트 이름 스타일링 */
.current-route-name {
    margin-left: 16px;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--v-text-color);
}
</style>
