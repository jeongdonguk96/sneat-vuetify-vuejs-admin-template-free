<script setup>
import misc404 from '@images/pages/404.png'
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader
      status-code="404"
      title="Page Not Found ⚠️"
      description="요청하신 페이지를 찾을 수 없습니다."
    />

    <VBtn
      to="/dashboard"
      class="mb-6"
    >
      Back to Home
    </VBtn>

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg
        :src="misc404"
        alt="Page Not Found"
        :max-width="500"
        class="mx-auto"
      />
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";
</style>
