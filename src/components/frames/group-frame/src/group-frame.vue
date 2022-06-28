<template>
  <div class="group-frame-container w-100 h-100 d-flex">
    <div class="group-nav-container h-100 d-flex flex-column flex-grow-0 flex-shrink-0 overflow-y-auto">
      <div class="nav-top-container pa-5">
        <v-btn
          class="w-100 bg-grey-lighten-2 text-grey-darken-1"
          height="36"
          :flat="true">
          <i class="fas fa-plus mr-1"/>
          <span>创建群聊</span>
          <create-group-popup/>
        </v-btn>
        <v-divider class="mt-4" color="#e5e5ea"/>
      </div>
      <div class="nav-list-container mt-3 pt-3">
        <div class="ml-5 mt-2 mb-2 text-body-2 text-grey-darken-4">
          我的群聊
        </div>
        <div class="chat-list-container">
          <v-hover
            v-slot="{ isHovering, props }"
            v-for="(group, index) in getMyGroupList"
            :key="group.id">
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
                color="grey-lighten-2"
                size="default">
                <v-img
                  :src="group.groupInfo[0].img"
                  :alt="group.groupInfo[0].title"/>
              </v-avatar>
              <div class="ml-2 mr-4 w-100 d-flex flex-column overflow-hidden text-no-wrap">
                <div class="d-flex overflow-hidden">
                  <span class="w-100 mr-2 flex-grow-1 text-subtitle-2 text-grey-darken-3 font-weight-bold">
                    {{ group.groupInfo[0].title }}
                  </span>
                  <span class="ml-auto flex-shrink-0 text-caption text-grey-lighten-1">
                    {{ group.time }}
                  </span>
                </div>
                <span class="text-sm-body-2 text-grey-darken-2">{{ group.groupInfo[0].desc }}</span>
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
                {{ group.groupInfo[0].title }}
              </v-tooltip>
            </div>
          </v-hover>
        </div>
      </div>
      <div class="bottom-mask"></div>
    </div>
    <div class="home-main-container h-100 flex-grow-1">
      <chat-frame
        :chat-info="getChatList[currentNavItemIndex]"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
    import {ref, onMounted} from 'vue'
    import {useStore} from '@/store'
    import {storeToRefs} from 'pinia'
    import {useRouter} from 'vue-router'
    import CreateGroupPopup from '@/components/popup-dialogs/create-group-popup'
    import ChatFrame from '@/components/frames/chat-frame'
    import {getGroupListByUserNameApi} from '@/service/api/groups'

    const store = useStore()
    const {backgroundColor, primaryColor, getUserInfo, getChatList, getMyGroupList} = storeToRefs(store)
    const router = useRouter()
    const currentNavItemIndex = ref(0) //当前左侧列表导航栏聚焦项的序号

    // 获取我的群聊列表
    const getGroupListByUserName = async () => {
        await getGroupListByUserNameApi({
            username: getUserInfo.value.username
        }).then(res => {
            if (res.data.myGroupList) {
                store.setMyGroupList(res.data.myGroupList)
            }
        }).catch(err => {
            console.error(err)
        })
    }

    onMounted(() => {
        getGroupListByUserName()
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

  .group-frame-container {
    .group-nav-container {
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

    .chat-frame-wrapper {

    }
  }
</style>