<script setup>
import { ref } from 'vue';
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const isOpen = ref(false);

function toggleMenu() {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <li
    class="nav-group"
    :class="{ open: isOpen }"
  >
    <div
      class="nav-group-label"
      @click="toggleMenu"
    >
      <VIcon
        :icon="item.icon || 'bxs-circle'"
        class="nav-item-icon"
      />
      <span class="nav-item-title">{{ item.title }}</span>
      <span
        class="nav-item-badge"
        :class="item.badgeClass"
      >
        {{ item.badgeContent }}
      </span>
      <VIcon
        icon="bx-chevron-right"
        class="nav-group-arrow"
      />
    </div>

    <!-- Render children if open -->
    <div v-if="isOpen" class="nav-group-children-wrapper">
      <ul class="nav-group-children">
        <template v-for="(child, index) in item.children" :key="index">
          <VerticalNavGroup v-if="child.children" :item="child" />
          <VerticalNavLink v-else :item="child" />
        </template>
      </ul>
    </div>
  </li>
</template>

<style lang="scss">
.layout-vertical-nav {
  .nav-group {
    &-label {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .nav-group-children-wrapper {
      overflow: hidden;
    }

    &.open {
      .nav-group-children-wrapper {
        /* Adjust this depending on the animation you want */
      }
    }
  }
}
</style>
