<template>
  <div class="nav-container pt-5 d-flex flex-column align-center">
    <div
      class="btn-container d-flex flex-column justify-center align-center mb-1"
      v-for="(btn, index) in navItemList"
      :key="index">
      <div class="btn-wrapper d-flex justify-center align-center">
        <v-hover v-slot="{ isHovering, props }">
          <div
            class="btn-content d-flex justify-center align-center flex-grow-0 flex-shrink-0"
            :class="[
              index === currentNavItemIndex ? 'btn-content__focus' : '',
              isHovering && index !== currentNavItemIndex ? 'btn-content__hover' : ''
            ]"
            @click="handleNavItemClick(index)"
            v-bind="props"
            v-ripple>
            <div
              class="btn-icon text-white text-h6 d-flex justify-center align-center"
              v-if="btn.icon">
              <i :class="btn.icon"/>
            </div>
            <div
              class="btn-icon text-white text-h6 d-flex justify-center align-center overflow-hidden"
              v-else-if="btn.imgUrl">
              <v-img
                :src="btn.imgUrl"
                width="50"
                :aspect-ratio="1"
                cover>
              </v-img>
            </div>
            <div
              class="btn-icon text-white text-h6 d-flex justify-center align-center overflow-hidden"
              v-else>
              <span>{{ btn.title.charAt(0).toUpperCase() || '' }}</span>
            </div>
            <v-tooltip
              activator="parent"
              location="end">
              {{ btn.title }}
            </v-tooltip>
          </div>
        </v-hover>
        <svg
          :class="index === currentNavItemIndex ? '' : 'text-transparent'"
          width="30px"
          height="60px"
          viewBox="0 0 36 60"
          version="1.1">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g transform="translate(-40.000000, -18.000000)" fill="currentColor">
              <g>
                <g transform="translate(10.000000, 18.000000)">
                  <g transform="translate(0.000000, -0.000000)">
                    <path
                      d="M30,0 C36.0854073,0 41.7476231,1.81189837 46.4765936,4.9256414 C49.2385783,6.65266891 52.5028196,7.65 56,7.65 C59.7003078,7.65 63.1398309,6.53344791 66.0000337,4.61887937 L66.0000337,55.3811206 C63.1398309,53.4665521 59.7003078,52.35 56,52.35 C52.5028196,52.35 49.2385783,53.3473311 46.476181,55.0730885 C41.8763772,58.1033248 36.3930422,59.900371 30.4961049,59.9959809 L30,60 L30,0 Z"></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
      <hr
        class="divider my-2 mx-2"
        v-if="index === 0"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
    import {defineEmits} from 'vue'
    import {useStore} from "@/store"
    import {storeToRefs} from "pinia"

    const store = useStore()
    const {primaryColor, backgroundColor, navItemList, currentNavItemIndex} = storeToRefs(store)
    const emit = defineEmits(['update']) //导航栏点击事件

    /**
     * 导航栏点击事件
     * @param index 点击的按钮序号
     */
    const handleNavItemClick = (index: number) => {
        emit('update', {index: index, detail: navItemList.value[index]})
    }
</script>

<style lang="scss" scoped>
  $primary-color: v-bind(primaryColor); //个性化主题颜色
  $background-color: v-bind(backgroundColor); //个性化背景颜色

  @mixin transition {
    transition: {
      property: background-color;
      duration: 200ms;
    }
  }

  @keyframes btn-animation {
    0% {
      transform: rotate(0);
    }
    33% {
      transform: rotate(13deg);
    }
    66% {
      transform: rotate(-13deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  .nav-container {
    width: $nav-width;
    height: 100%;

    .btn-container {
      width: inherit;

      .btn-wrapper {
        position: relative;
        width: inherit;
        border-radius: 30px;

        .btn-content {
          width: 62px;
          height: 62px;
          z-index: 1;
          border-radius: 50%;
          background-color: transparent;
          cursor: pointer;
          @include transition();

          .btn-icon {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: rgba(187, 190, 196, 0.3);
            @include transition();
          }
        }

        .btn-content__focus {
          background-color: rgba(237, 238, 240, 1);

          .btn-icon {
            background-color: $primary-color;
          }
        }

        .btn-content__hover {
          animation: btn-animation .2s linear;
          background-color: rgba(187, 190, 196, 0.3);

          .btn-icon {
            background-color: $primary-color;
          }
        }

        svg {
          position: absolute;
          top: 0;
          right: 0;
          color: #edeef0;
          @include transition();
        }
      }

      .divider {
        width: 24px;
        height: 2px;
        border: none;
        background-color: rgba(153, 155, 161, 1);
      }
    }
  }
</style>