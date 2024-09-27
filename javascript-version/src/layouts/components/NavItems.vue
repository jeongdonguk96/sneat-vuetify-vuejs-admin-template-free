<script setup>
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue';
</script>

<template>
    <VerticalNavGroup :item="{
        title: '통계',
        icon: 'bx-bar-chart',
        children: [
            {
                title: '결제 요약',
                icon: 'bx-file',
                children: [
                    { title: '일별 결제 현황', to: '/statistics/days' },
                    { title: '월별 결제 현황', to: '/statistics/months' },
                    { title: '기간별 결제 현황', to: '/statistics/ranges' },
                    { title: '등급별 청구 현황', to: '/statistics/grades' },
                ],
            },
            {
                title: '판매자 현황',
                icon: 'bx-file',
                children: [
                    { title: '판매자 목록', to: '/sellers' },
                    { title: '판매자 일별 내역', to: '/sellers/day' },
                    { title: '판매자 월별 내역', to: '/sellers/month' },
                ],
            },
            {
                title: '상품 현황',
                icon: 'bx-file',
                children: [
                    { title: '상품 목록', to: '/products' },
                    { title: '상품 일별 내역', to: '/products/day' },
                    { title: '상품 월별 내역', to: '/products/month' },
                ],
            },
            {
                title: '통계 분석',
                icon: 'bx-file',
                children: [
                    { title: '결제 분석', to: '/analyze/purchase' },
                ],
            },
        ],
    }" />

    <VerticalNavGroup :item="{
        title: '대사',
        icon: 'bx-git-compare',
        children: [
            {
                title: '대사',
                icon: 'bx-file',
                children: [
                    { title: '대사 파일 (ADCB)', to: '/reconciliation/adcb' },
                    { title: '대사 파일 (GDCB)', to: '/reconciliation/gdcb' },
                    { title: '대사 파일 (SDCB)', to: '/reconciliation/sdcb' },
                ],
            },
            {
                title: '정산',
                icon: 'bx-file',
                children: [
                    { title: '정산 내역 (GDCB)', to: '/reconciliation/adjustment/gdcb' },
                ],
            },
            {
                title: '오류',
                icon: 'bx-file',
                children: [
                    { title: '대사 오류 (SDCB)', to: '/reconciliation/errors/sdcb' },
                ],
            },
        ],
    }" />

    <VerticalNavGroup :item="{
        title: '결제 상세',
        icon: 'bx-notepad',
        children: [
            {
                title: '결제 이력',
                icon: 'bx-file',
                children: [
                    { title: '결제 이력 (SDCB)', to: '/payment/payment-histories/sdcb' },
                ],
            },
        ],
    }" />

    <VerticalNavGroup :item="{
        title: '환불',
        icon: 'bx-credit-card',
        children: [
            {
                title: '환불',
                icon: 'bx-file',
                children: [
                    { title: '환불 신청 (GDCB)', to: '/refund/gdcb' },
                    { title: '환불 신청 (SDCB)', to: '/refund/sdcb' },
                ],
            },
        ],
    }" />

    <VerticalNavGroup :item="{
        title: 'VOC',
        icon: 'bx-support',
        children: [
            {
                title: '이력',
                icon: 'bx-file',
                children: [
                    { title: '전환 이력 (GDCB)', to: '/voc/histories/conversion/gdcb' },
                    { title: '문자 발송 이력', to: '/voc/histories/mms' },
                    { title: '결제 시도 내역', to: '/voc/histories/purchase' },
                    { title: '결제 등급 이력', to: '' },
                    { title: 'VOC 이력', to: '' },
                ],
            },
        ],
    }" />

    <VerticalNavGroup :item="{
        title: '암복호화',
        icon: 'bx-key',
        children: [
            {
                title: '암복호화',
                icon: 'bx-file',
                children: [
                    { title: '암복호화', to: '/crypto' },
                ],
            },
        ],
    }" />

    <VerticalNavGroup :item="{
        title: '이벤트',
        icon: 'bx-alarm',
        children: [
            {
                title: '이벤트',
                icon: 'bx-file',
                children: [
                    { title: '이벤트 (GDCB)', to: '/events/gdcb' },
                ],
            },
        ],
    }" />

    <VerticalNavGroup :item="{
        title: '시스템 설정',
        icon: 'bx-cog',
        children: [
            {
                title: '차단 설정',
                icon: 'bx-file',
                children: [
                    { title: 'CTN', to: '/system/block/ctns' },
                    { title: '요금제', to: '/system/block/feetypes' },
                    { title: '상품', to: '/system/block/items' },
                ],
            },
            {
                title: '테스트폰',
                icon: 'bx-file',
                children: [
                    { title: '테스트폰', to: '/system/testphones' },
                ],
            },
            {
                title: '사용자',
                icon: 'bx-file',
                children: [
                    { title: '사용자', to: '/system/members' },
                ],
            },
            {
                title: '결제 정책',
                icon: 'bx-file',
                children: [
                    { title: '결제 정책', to: '/system/policies' },
                    { title: '한도 등급 설정', to: '' },
                ],
            },
            {
                title: '한도',
                icon: 'bx-file',
                children: [
                    { title: '한도 설정', to: '/system/limit/gdcb' },
                ],
            },
        ],
    }" />
</template>
