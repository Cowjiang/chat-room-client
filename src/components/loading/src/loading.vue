<template>
  <div
    class="loading-wrapper position-fixed w-100 h-100 d-flex flex-column justify-center align-center bg-white"
    :class="props.modelValue ? '' : 'animated animate__fadeOut loading-wrapper__disabled'">
    <div class="loading-text text-h6 mb-4 text-grey-darken-1">
      {{ props.loadingText }}
    </div>
    <div class="w-25">
      <v-progress-linear
        :color="props.color"
        :stream="true"
        :indeterminate="props.modelValue"
        rounded
        height="10"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
    import {defineProps, withDefaults} from 'vue'

    interface Props {
        modelValue: boolean, //控制加载动画显示状态
        loadingText?: string, //加载时显示的文字
        color?: string //加载动画的颜色，默认为#66c
    }

    const props = withDefaults(defineProps<Props>(), {
        loadingText: '正在加载数据，请稍后',
        color: '#66c'
    })
</script>

<style lang="scss" scoped>
  .loading-wrapper {
    z-index: 9999;
  }

  .loading-wrapper__disabled {
    pointer-events: none;
  }
</style>