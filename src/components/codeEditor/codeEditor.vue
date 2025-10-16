<template>
  <div ref="editorContainer" class="editor-container"></div>
</template>

<script setup>
import * as monaco from 'monaco-editor'
import { ref, onMounted, toRaw, useTemplateRef, onUnmounted, watch, nextTick } from 'vue'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
// 确保在组件初始化时正确设置 MonacoEnvironment
window.MonacoEnvironment ??= {
  getWorker(_, label) {
    switch (label) {
      case 'json':
        return new JsonWorker()
      case 'css':
      case 'scss':
      case 'less':
        return new CssWorker()
      case 'html':
        return new HtmlWorker()
      case 'typescript':
      case 'javascript':
        return new TsWorker()
      default:
        return new EditorWorker()
    }
  },
}
const { language, readOnly } = defineProps({
  language: { type: String, default: 'javascript' },
  readOnly: { type: Boolean, default: false },
})
const modelValue = defineModel()
const editor = ref(null)
const editorContainer = useTemplateRef('editorContainer')
// 添加格式化方法
const formatCode = async () => {
  if (!editor.value) return
  // 获取当前编辑器实例
  const editorInstance = toRaw(editor.value)
  // 触发格式化
  if (readOnly) {
    editorInstance.updateOptions({ readOnly: false })
    await editorInstance.getAction('editor.action.formatDocument').run()
    editorInstance.updateOptions({ readOnly: true })
  } else {
    await editorInstance.getAction('editor.action.formatDocument').run()
  }
}
onMounted(async () => {
  editor.value = monaco.editor.create(editorContainer.value, {
    value: modelValue.value || '',
    language: language,
    minimap: {
      enabled: true,
    },
    automaticLayout: true, // 添加自动布局
    scrollBeyondLastLine: false,
    colorDecorators: true, //颜色装饰器
    readOnly: readOnly, //是否开启已读功能
    theme: 'vs-dark', //主题
    formatOnPaste: true, // 粘贴时自动格式化
    formatOnType: true, // 输入时自动格式化
    domReadOnly: true, // Makes the editor appear more clearly read-only
    readOnlyMessage: {
      value: 'This content is read-only', // Custom message
      isTrusted: true, // Allows HTML content if needed
    },
    // Ensure tooltips stay within viewport
    fixedOverflowWidgets: true,
  })
  // 监听编辑器内容变化
  editor.value.onDidChangeModelContent(() => {
    const value = toRaw(editor.value).getValue()
    if (value !== modelValue.value) {
      modelValue.value = value
    }
  })
  await nextTick()
  await formatCode()
})
watch(
  () => modelValue.value,
  (newValue) => {
    if (editor.value && newValue !== toRaw(editor.value).getValue()) {
      toRaw(editor.value).setValue(newValue || '')
      formatCode()
    }
  },
  {
    immediate: true,
  }
)
onUnmounted(() => {
  if (editor.value) {
    toRaw(editor.value).dispose()
  }
})
// 暴露格式化方法供外部调用
defineExpose({
  formatCode,
})
</script>

<style lang="scss" scoped>
.editor-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: visible; /* Ensure tooltips aren't clipped */
}
:deep(.monaco-editor) {
  width: 100% !important;
  height: 100% !important;
  .overflow-guard {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
