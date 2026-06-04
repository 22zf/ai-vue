<template>
  <div class="rich-text-editor">
    <Toolbar
      class="editor-toolbar"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      mode="default"
    />
    <Editor
      class="editor-content"
      v-model="htmlContent"
      :defaultConfig="editorConfig"
      mode="default"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script setup>
import { ref, shallowRef, watch, onBeforeUnmount } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入内容...'
  }
})

const emit = defineEmits(['update:modelValue'])

const editorRef = shallowRef(null)
const htmlContent = ref(props.modelValue)

const toolbarConfig = {
  excludeKeys: ['fullScreen', 'group-video']
}

const editorConfig = {
  placeholder: props.placeholder,
  height: 350
}

function handleCreated(editor) {
  editorRef.value = editor
}

watch(htmlContent, (val) => {
  emit('update:modelValue', val)
})

watch(() => props.modelValue, (val) => {
  if (val !== htmlContent.value) {
    htmlContent.value = val
  }
})

onBeforeUnmount(() => {
  if (editorRef.value) {
    editorRef.value.destroy()
  }
})
</script>

<style scoped>
.rich-text-editor {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  border-bottom: 1px solid #dcdfe6;
}

.editor-content {
  height: 350px;
}

:deep(.w-e-text-container) {
  height: 350px !important;
}

:deep(.w-e-toolbar) {
  flex-wrap: wrap;
}
</style>
