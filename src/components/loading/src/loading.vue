<template>
  <transition name="fade">
    <div
      class="loading-wrapper w-100 h-100 d-flex flex-column justify-center align-center bg-white"
      :style="{zIndex: props.zIndex}"
      v-if="props.modelValue">
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
  </transition>
</template>

<script lang="ts" setup>
    import {defineProps, withDefaults, ref} from 'vue'

    type Position = 'relative' | 'absolute' | 'fixed'

    interface Props {
        modelValue: boolean, //控制加载动画显示状态
        loadingText?: string, //加载时显示的文字
        color?: string, //加载动画的颜色，默认为#66c
        position?: Position, //position的取值，默认为fixed
        enterDuration?: string, //进入动画的持续时间
        leaveDuration?: string //离开动画的持续时间
        zIndex ?: number //z-index的值
    }

    const props = withDefaults(defineProps<Props>(), {
        loadingText: '正在加载数据，请稍后',
        color: '#66c',
        position: 'fixed',
        enterDuration: '0.5s',
        leaveDuration: '0.5s',
        zIndex: 9999
    })

    const position = ref(props.position) //position的取值
    const enterDuration = ref(props.enterDuration) //position的取值
    const leaveDuration = ref(props.leaveDuration) //position的取值
</script>

<style lang="scss" scoped>
  $position: v-bind(position);
  $enterDuration: v-bind(enterDuration);
  $leaveDuration: v-bind(leaveDuration);

  .loading-wrapper {
    position: $position;
  }

  .loading-wrapper__disabled {
    pointer-events: none;
  }

  .fade-enter-active {
    transition: opacity $enterDuration;
  }

  .fade-leave-active {
    transition: opacity $leaveDuration;
  }

  .fade-enter, .fade-leave-to  {
    opacity: 0;
  }
</style>