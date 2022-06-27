<template>
  <div class="setting-frame-container w-100 h-100 d-flex">
    <div class="setting-nav-container h-100 d-flex flex-column flex-grow-0 flex-shrink-0 overflow-y-auto">
      <div class="nav-top-container pa-5">
        <div class="d-flex align-center">
          <v-avatar
            class="flex-shrink-0 mr-3"
            color="grey-lighten-3"
            size="48">
            <v-img
              :src="getUserInfo.photo"
              :alt="getUserInfo.nickname"/>
          </v-avatar>
          <span class="username text-subtitle-1 text-grey-darken-3 font-weight-bold">
            {{ getUserInfo.nickname }}
          </span>
        </div>
        <v-divider class="mt-4" color="#e5e5ea"/>
      </div>
      <div
        class="pl-2 py-3"
        v-for="group in settingList"
        :key="group.id">
        <div class="ml-6 mb-1 text-caption text-grey-darken-2">
          {{ group.groupName }}
        </div>
        <v-hover
          v-slot="{ isHovering, props }"
          v-for="item in group.groupItems"
          :key="item.id">
          <div
            class="nav-setting-item d-flex align-center position-relative ml-2 pl-4 py-4 text-subtitle-1 text-grey-darken-3 font-weight-bold"
            :class="[
              currentNavItemIndex[0] === group.id && currentNavItemIndex[1] === item.id ? 'nav-item__focus' : '',
              isHovering && (currentNavItemIndex[0] !== group.id || currentNavItemIndex[1] !== item.id) ? 'nav-item__hover' : ''
            ]"
            v-bind="props"
            @click="handleNavItemClick([group.id, item.id])">
            <i
              class="fa-solid mr-3 text-grey-lighten-1"
              :class="item.icon"/>
            <span>{{ item.name }}</span>
            <svg
              v-show="currentNavItemIndex[0] === group.id && currentNavItemIndex[1] === item.id"
              width="16px"
              class="top-svg position-absolute"
              height="16px">
              <path d="M0 16 Q 16,16 16 0 L 16,16 Z"></path>
            </svg>
            <svg
              v-show="currentNavItemIndex[0] === group.id && currentNavItemIndex[1] === item.id"
              width="16px"
              class="bottom-svg position-absolute"
              height="16px">
              <path d="M0 0 Q 16,0 16 16 L 16,0 Z"></path>
            </svg>
          </div>
        </v-hover>
      </div>
      <v-divider class="my-4 mx-5" color="#e5e5ea"/>
      <v-hover
        v-slot="{ isHovering, props }">
        <div
          class="nav-setting-item d-flex align-center position-relative ml-4 pl-4 py-4 text-subtitle-1 text-red-lighten-1 font-weight-bold"
          :class="isHovering ? 'nav-item__hover' : ''"
          v-bind="props"
          @click="logout">
          <i class="fa-solid fa-arrow-right-from-bracket mr-3"/>
          <span>退出登录</span>
        </div>
      </v-hover>
      <div class="bottom-mask"></div>
    </div>
    <div class="setting-wrapper pa-10 mt-10 d-flex justify-center flex-grow-1">
      <div class="setting-container h-100 d-flex flex-column flex-shrink-0">
        <div class="setting-header mb-6 d-flex flex-column">
          <span class="text-h5 text-grey-darken-3 font-weight-bold">
            {{ currentSettingInfo.name }}
          </span>
          <span class="mt-4 text-subtitle-2 text-grey-darken-2">
            {{ currentSettingInfo.dsc }}
          </span>
          <v-divider class="mt-6" color="#e5e5ea"/>
        </div>
        <account-setting v-show="currentNavItemIndex[0] === 0 && currentNavItemIndex[1] === 0"/>
        <private-setting v-show="currentNavItemIndex[0] === 0 && currentNavItemIndex[1] === 1"/>
        <chat-setting v-show="currentNavItemIndex[0] === 0 && currentNavItemIndex[1] === 2"/>
        <appearance-setting v-show="currentNavItemIndex[0] === 1 && currentNavItemIndex[1] === 0"/>
        <notify-setting v-show="currentNavItemIndex[0] === 1 && currentNavItemIndex[1] === 1"/>
        <keymap-setting v-show="currentNavItemIndex[0] === 1 && currentNavItemIndex[1] === 2"/>
        <developer-setting v-show="currentNavItemIndex[0] === 2 && currentNavItemIndex[1] === 0"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
    import {computed, ref} from 'vue'
    import {useStore} from '@/store'
    import {storeToRefs} from 'pinia'
    import {useRouter} from 'vue-router'
    import {settingList} from '@/components/frames/setting-frame'
    import {clearUserInfo} from '@/common/utils'
    import AccountSetting from '@/components/frames/setting-frame/src/src/account-setting.vue'
    import PrivateSetting from '@/components/frames/setting-frame/src/src/private-setting.vue'
    import ChatSetting from '@/components/frames/setting-frame/src/src/chat-setting.vue'
    import AppearanceSetting from '@/components/frames/setting-frame/src/src/appearance-setting.vue'
    import NotifySetting from '@/components/frames/setting-frame/src/src/notify-setting.vue'
    import KeymapSetting from '@/components/frames/setting-frame/src/src/keymap-setting.vue'
    import DeveloperSetting from '@/components/frames/setting-frame/src/src/developer-setting.vue'

    const store = useStore()
    const {primaryColor, getUserInfo} = storeToRefs(store)
    const router = useRouter()
    const currentNavItemIndex = ref([0, 0]) //当前左侧列表导航栏聚焦项的id数组（[groupId, groupItemId]）

    /**
     * 左侧设置菜单点击事件
     * @param index 点击的设置项数组，[groupId, groupItemId]
     */
    const handleNavItemClick = (index: Array<number>): void => {
        currentNavItemIndex.value = index
    }

    //当前的设置项
    const currentSettingInfo = computed((): any => {
        let settingItem: any
        settingList.find(group => {
            if (group.id === currentNavItemIndex.value[0]) {
                settingItem = group.groupItems.find(item => item.id === currentNavItemIndex.value[1])
            }
        })
        return settingItem
    })

    // 退出登录
    const logout = (): void => {
        clearUserInfo()
        router.replace({name: 'login'})
    }
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

  .setting-frame-container {
    user-select: none;

    ::v-deep(.v-divider) {
      border-color: #e5e5ea;
    }

    .setting-nav-container {
      width: $content-nav-width;
      background: $content-nav-bg-color;

      .nav-top-container {
        min-height: 100px;

        .username {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }

      .nav-setting-item {
        height: 42px;
        box-sizing: border-box;
        border-radius: 24px 0 0 24px;

        .fa-solid {
          width: 18px;
          text-align: center;
        }

        span {
          overflow: hidden;
          text-overflow: ellipsis;
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

      .nav-item__focus {
        background-color: #ffffff;

        .fa-solid {
          color: $primary-color;
        }
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

  .setting-wrapper {
    @include scrollbar-default();
    overflow-y: scroll;

    .setting-container {
      @include scrollbar-default();
      width: 50vw;
      min-width: 500px;
      max-width: 700px;
    }
  }
</style>