export const routes = [
    { path: '/', redirect: '/login' },
    {
        path: '/',
        component: () => import('@/layouts/default.vue'),
        children: [
            {
                path: 'dashboard',
                component: () => import('@/pages/etc/dashboard.vue'),
            },


            {
                path: 'statistics/days',
                component: () => import('@/pages/statistics/DailyPaymentStatistics.vue'),
                meta: { title: '결제 통계 - 일별 결제 현황' },

            },
            {
                path: 'statistics/months',
                component: () => import('@/pages/statistics/MonthlyPaymentStatistics.vue'),
                meta: { title: '결제 통계 - 월별 결제 현황' },
            },
            {
                path: 'statistics/ranges',
                component: () => import('@/pages/statistics/RangePaymentStatistics.vue'),
                meta: { title: '결제 통계 - 기간별 결제 현황' },
            },
            {
                path: 'statistics/grades',
                component: () => import('@/pages/statistics/GradeMonthlyBillingStatistics.vue'),
                meta: { title: '결제 통계 - 등급별 청구 현황' },
            },
            {
                path: 'payment/payment-histories/sdcb',
                component: () => import('@/pages/payment/PaymentHistory-SDCB.vue'),
                meta: { title: '결제 상세 - 결제 이력 (SDCB)' },
            },
            {
                path: 'sellers',
                component: () => import('@/pages/seller/Seller.vue'),
                meta: { title: '판매자 현황 - 판매자 목록' },
            },
            {
                path: 'sellers/day',
                component: () => import('@/pages/seller/SellerByDay.vue'),
                meta: { title: '판매자 현황 - 판매자 일별 내역' },
            },
            {
                path: 'sellers/month',
                component: () => import('@/pages/seller/SellerByMonth.vue'),
                meta: { title: '판매자 현황 - 판매자 월별 내역' },
            },
            {
                path: 'products',
                component: () => import('@/pages/product/Product.vue'),
                meta: { title: '상품 현황 - 상품 목록' },
            },
            {
                path: 'products/day',
                component: () => import('@/pages/product/ProductByDay.vue'),
                meta: { title: '상품 현황 - 상품 일별 내역' },
            },
            {
                path: 'products/month',
                component: () => import('@/pages/product/ProductByMonth.vue'),
                meta: { title: '상품 현황 - 상품 월별 내역' },
            },
            {
                path: 'analyze/purchase',
                component: () => import('@/pages/analyze/PurcahseAnalyze.vue'),
                meta: { title: '통계 분석 - 결제 분석' },
            },
            {
                path: 'system/testphones',
                component: () => import('@/pages/testphone/Testphone.vue'),
                meta: { title: '테스트폰 관리' },
            },
            {
                path: 'system/block/ctns',
                component: () => import('@/pages/block/BlockCtn.vue'),
                meta: { title: '차단 관리 - CTN' },
            },
            {
                path: 'system/block/feetypes',
                component: () => import('@/pages/block/BlockFeetype.vue'),
                meta: { title: '차단 관리 - 요금제' },
            },
            {
                path: 'system/block/items',
                component: () => import('@/pages/block/BlockItem.vue'),
                meta: { title: '차단 관리 - 상품' },
            },
            {
                path: 'system/members',
                component: () => import('@/pages/member/Member.vue'),
                meta: { title: '사용자 관리' },
            },
            {
                path: 'system/limit/gdcb',
                component: () => import('@/pages/limit/Limit-GDCB.vue'),
                meta: { title: '한도 설정' },
            },
            {
                path: 'reconciliation/adcb',
                component: () => import('@/pages/reconciliation/Reconciliation-ADCB.vue'),
                meta: { title: '대사 관리 - 대사 파일 (ADCB)' },
            },
            {
                path: 'reconciliation/gdcb',
                component: () => import('@/pages/reconciliation/Reconciliation-GDCB.vue'),
                meta: { title: '대사 관리 - 대사 파일 (GDCB)' },
            },
            {
                path: 'reconciliation/sdcb',
                component: () => import('@/pages/reconciliation/Reconciliation-SDCB.vue'),
                meta: { title: '대사 관리 - 대사 파일 (SDCB)' },
            },
            {
                path: 'reconciliation/adjustment/gdcb',
                component: () => import('@/pages/reconciliation/Adjustment-GDCB.vue'),
                meta: { title: '대사 관리 - 정산 내역 (GDCB)' },
            },
            {
                path: 'reconciliation/errors/sdcb',
                component: () => import('@/pages/reconciliation/Reconciliation-Error-SDCB.vue'),
                meta: { title: '대사 관리 - 대사 오류 (SDCB)' },
            },
            {
                path: 'crypto',
                component: () => import('@/pages/crypto/Crypto.vue'),
                meta: { title: '암호화' },
            },
            {
                path: 'refund/gdcb',
                component: () => import('@/pages/refund/Refund-GDCB.vue'),
                meta: { title: '환불 관리 - 환불 신청 (GDCB)' },
            },
            {
                path: 'refund/sdcb',
                component: () => import('@/pages/refund/Refund-SDCB.vue'),
                meta: { title: '환불 관리 - 환불 신청 (SDCB)' },
            },
            {
                path: 'voc/histories/conversion',
                component: () => import('@/pages/history/ConversionHistory-GDCB.vue'),
                meta: { title: 'VOC - 전환 이력' },
            },
            {
                path: 'voc/histories/mms',
                component: () => import('@/pages/history/MmsHistory.vue'),
                meta: { title: 'VOC - 문자 발송 이력' },
            },
            {
                path: 'voc/histories/purchase',
                component: () => import('@/pages/history/PurchaseHistory.vue'),
                meta: { title: 'VOC - 결제 시도 이력' },
            },
            {
                path: 'events/gdcb',
                component: () => import('@/pages/event/Event-GDCB.vue'),
                meta: { title: '이벤트 관리 - 이벤트 (GDCB)' },
            },
        ],
    },
    {
        path: '/',
        component: () => import('@/layouts/blank.vue'),
        children: [
            {
                path: 'login',
                component: () => import('@/pages/member/Login.vue'),
            },
            {
                path: '/:pathMatch(.*)*',
                component: () => import('@/pages/etc/[...error].vue'),
            },
        ],
    },
]
