<template>
  <div class="home-frame-container w-100 h-100 d-flex">
    <div class="home-nav-container h-100 d-flex flex-column flex-grow-0 flex-shrink-0 overflow-y-auto">
      <div class="nav-top-container pa-5">
        <v-btn
          class="w-100 text-grey-darken-1"
          color="#e5e5ea"
          height="32"
          :flat="true">
          <i class="fas fa-search mr-1"/>
          <span>搜索</span>
        </v-btn>
        <v-divider class="mt-4" color="#e5e5ea"/>
      </div>
      <div class="nav-list-container mt-6">
        <v-hover v-slot="{ isHovering, props }">
          <div
            class="my-friends-btn d-flex align-center position-relative ml-2 pl-4 py-6 text-subtitle-1 text-grey-darken-3 font-weight-bold"
            :class="[
              currentNavItemIndex === -1 ? 'nav-item__focus' : '',
              isHovering && currentNavItemIndex !== -1 ? 'nav-item__hover' : ''
            ]"
            v-bind="props"
            @click="handleNavItemClick(-1)">
            <i class="fa-solid fa-users mr-3"></i>
            <span>我的好友</span>
            <svg
              v-show="currentNavItemIndex === -1"
              width="16px"
              class="top-svg position-absolute"
              height="16px">
              <path d="M0 16 Q 16,16 16 0 L 16,16 Z"></path>
            </svg>
            <svg
              v-show="currentNavItemIndex === -1"
              width="16px"
              class="bottom-svg position-absolute"
              height="16px">
              <path d="M0 0 Q 16,0 16 16 L 16,0 Z"></path>
            </svg>
          </div>
        </v-hover>
        <div class="ml-4 mt-7 mb-2 text-body-2 text-grey-darken-4">
          私信
        </div>
        <div class="chat-list-container">
          <v-hover
            v-slot="{ isHovering, props }"
            v-for="(chat, index) in getChatList"
            :key="chat.id">
            <div
              class="nav-chat-item d-flex align-center position-relative ml-2 pl-2 py-6"
              :class="[
                currentNavItemIndex === index ? 'nav-item__focus' : '',
                isHovering && currentNavItemIndex !== index ? 'nav-item__hover' : ''
              ]"
              v-bind="props"
              @click="handleNavItemClick(index)">
              <v-avatar
                class="flex-shrink-0"
                :color="primaryColor"
                size="default">
                <v-img
                  :src="chat.avatarUrl"
                  :alt="chat.nickname"/>
              </v-avatar>
              <div class="mx-2 w-100 d-flex flex-column overflow-hidden text-no-wrap">
                <div class="d-flex overflow-hidden">
                  <span class="w-100 flex-grow-1 text-subtitle-2 text-grey-darken-3 font-weight-bold">{{
                      chat.nickname
                    }}</span>
                  <span class="ml-auto flex-shrink-0 text-caption text-grey-lighten-1">{{ chat.time }}</span>
                </div>
                <span class="text-sm-body-2 text-grey-darken-2">{{ chat.lastMessage }}</span>
              </div>
              <svg
                v-show="currentNavItemIndex === index"
                width="16px"
                class="top-svg position-absolute"
                height="16px">
                <path d="M0 16 Q 16,16 16 0 L 16,16 Z"></path>
              </svg>
              <svg
                v-show="currentNavItemIndex === index"
                width="16px"
                class="bottom-svg position-absolute"
                height="16px">
                <path d="M0 0 Q 16,0 16 16 L 16,0 Z"></path>
              </svg>
              <v-tooltip
                activator="parent"
                location="end">
                {{ chat.nickname }}{{ chat.remarkName ? `（${chat.remarkName}）` : '' }}
              </v-tooltip>
            </div>
          </v-hover>
        </div>
      </div>
      <div class="bottom-mask"></div>
    </div>
    <div class="home-main-container h-100 flex-grow-1">

    </div>
  </div>
</template>

<script lang="ts" setup>
    import {onMounted, ref} from 'vue'
    import {useStore} from "@/store"
    import {storeToRefs} from "pinia"

    const store = useStore()
    const {primaryColor, getChatList} = storeToRefs(store)

    const currentNavItemIndex = ref(0)

    /**
     * 左侧菜单点击事件
     * @param index 菜单项序号
     */
    const handleNavItemClick = (index: number): void => {
        currentNavItemIndex.value = index
        console.log(1)
    }

    onMounted(() => {

    })
</script>

<style lang="scss" scoped>
  $primary-color: v-bind(primaryColor); //个性化主题颜色
  $current-nav-item-index: v-bind(currentNavItemIndex);

  @mixin svg-style {
    right: 0;
    z-index: 1;
    path {
      fill: #ffffff;
    }
  }

  @mixin nav-item-hover {
    background-color: initial;
    background-image: linear-gradient(90deg, rgba(102, 104, 107, 0.08), #edeef0);
    cursor: pointer;
  }

  .home-frame-container {
    user-select: none;

    .home-nav-container {
      width: $content-nav-width;
      background: $content-nav-bg-color;

      .nav-top-container {
        height: 64px;

        ::v-deep(.v-divider) {
          border-color: #e5e5ea;
        }
      }

      .nav-list-container {
        overflow-y: scroll;

        .my-friends-btn {
          height: 48px;
          box-sizing: border-box;
          border-radius: 24px 0 0 24px;

          .fa-solid {
            color: $primary-color;
          }

          .top-svg {
            bottom: 100%;
            @include svg-style();
          }

          .bottom-svg {
            top: 100%;
            @include svg-style();
          }
        }

        .nav-chat-item {
          @extend .my-friends-btn;
          height: 64px;
          border-radius: 12px 0 0 12px;

          span {
            overflow: hidden;
            text-overflow: ellipsis;
          }

          &:last-child {
            margin-bottom: 100px;
          }
        }

        .nav-item__focus {
          background-color: #ffffff;
        }

        .nav-item__hover {
          @include nav-item-hover();
        }
      }

      .bottom-mask {
        @include gradient-mask(150px, #edeef0);
        width: $content-nav-width;
        z-index: 2;
        position: fixed;
        bottom: 8px;
        border-radius: 0 0 8px 8px;
      }
    }

    .home-main-container {

    }
  }
</style>