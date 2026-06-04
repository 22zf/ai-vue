<template>
  <div class="page-head">
    <h1 class="title">{{ title }}</h1>
    <div class="action-btn">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '默认标题'
  }
})
</script>

<style scoped>
.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 20px;
  font-weight: 500;
  color: #303133;
  margin: 0;
}

.action-btn {
  display: flex;
  gap: 10px;
}
</style>
