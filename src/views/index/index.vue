<template>
  <div class="main-container w-100 h-screen d-flex flex-row">
    <div class="nav-wrapper h-100 flex-shrink-0 flex-grow-0">
      <navigation-bar @update="handleNavItemClick"/>
    </div>
    <div class="content-wrapper h-100 flex-grow-1 pt-2 pr-2 pb-2">
      <div class="content-container w-100 h-100 rounded-lg bg-white overflow-hidden">
        <search-popup v-model="showSearchPopup"/>
        <home-frame v-if="currentNavItemIndex === 0"/>
        <group-frame v-else-if="currentNavItemIndex === 1"/>
        <setting-frame v-else-if="currentNavItemIndex === navItemList.findIndex(item => item.name === 'setting')"/>
        <top-chat-frame v-else/>
      </div>
    </div>
    <loading v-model="loadingStatus" enterDuration="0s" z-index="2300"/>
    <v-dialog v-model="loadError" persistent>
      <v-card
        width="400"
        rounded="lg">
        <v-card-header>
          <v-card-header-text>
            <v-card-title>数据加载失败，请重新加载</v-card-title>
            <v-card-subtitle>网络异常，请检查你的网络</v-card-subtitle>
          </v-card-header-text>
        </v-card-header>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-btn color="error" :block="true" @click="reloadApp">重新加载</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
    import {onMounted, ref} from 'vue'
    import {useStore} from '@/store'
    import {storeToRefs} from 'pinia'
    import {useRoute, useRouter} from 'vue-router'
    import {AxiosError, AxiosResponse} from 'axios'
    import NavigationBar from '@/components/navigation-bar'
    import HomeFrame from '@/components/frames/home-frame'
    import GroupFrame from '@/components/frames/group-frame'
    import TopChatFrame from '@/components/frames/top-chat-frame'
    import SettingFrame from '@/components/frames/setting-frame'
    import Loading from '@/components/loading'
    import SearchPopup from '@/components/popup-dialogs/search-popup'
    import {connectSocket} from '@/service/socket'
    import {getChatListApi} from '@/service/api/chats'
    import {getUserSettingsApi} from '@/service/api/user'

    interface NavItemClickEvent {
        index: number,
        detail: any
    }

    const store = useStore()
    const {backgroundColor, navItemList, currentNavItemIndex, getChatList} = storeToRefs(store)
    const router = useRouter()
    const route = useRoute()
    const loadingStatus = ref(true) //数据加载状态
    const loadError = ref(false) //数据是否加载失败
    const showSearchPopup = ref(false) //是否显示全局搜索弹窗

    // 导航栏点击事件
    const handleNavItemClick = (e: NavItemClickEvent) => {
        if (currentNavItemIndex.value !== e.index) {
            if (e.detail.name === 'search') {
                showSearchPopup.value = true
            } else {
                store.currentNavItemIndex = e.index
                const navItem = e.detail.name ?? 'home'
                router.replace({name: 'index', params: {navItem}})
            }
        }
    }

    // 获取聊天列表
    const getChatListPromise = () => new Promise((resolve, reject) => {
        getChatListApi().then((res: AxiosResponse) => {
            if (res.data.list) {
                store.setChatList(res.data.list)
            }
            resolve(res)
        }).catch((err: AxiosError) => {
            reject(err)
        })
    })

    // 获取用户设置
    const getUserSettingsPromise = () => new Promise((resolve, reject) => {
        getUserSettingsApi().then((res: AxiosResponse) => {
            if (res.data.setting) {
                store.setUserSettings(res.data.setting)
            }
            resolve(res)
        }).catch((err: AxiosError) => {
            reject(err)
        })
    })

    Promise.all([getChatListPromise(), getUserSettingsPromise()]).then(() => {
        loadingStatus.value = false
    }).catch((err) => {
        console.error(err)
        setTimeout(() => {
            loadError.value = true
        }, 500)
    })

    // 重新加载应用
    const reloadApp = () => router.go(0)

    onMounted(() => {
        connectSocket()
        store.navItemList = [
            {name: 'home', title: '主页', icon: 'fas fa-house'},
            {name: 'group', title: '我的群聊', icon: 'fas fa-user-friends'},
            {
                name: '61be0f1ee7fd6865cbcd74d1',
                chatType: 0,
                title: 'Cowjiang',
                imgUrl: 'https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg'
            },
            {name: '61be0f1ee7fd6865cbcd74d2', chatType: 1, title: 'Cowjiang的群聊'},
            {name: 'search', title: '搜索', icon: 'fas fa-search'},
            {name: 'setting', title: '设置中心', icon: 'fas fa-cog'}
        ]
        if (route.params.navItem) {
            const navItemIndex = navItemList.value.findIndex((navItem: { name: string }) => navItem.name === route.params.navItem)
            if (navItemIndex !== -1) {
                store.currentNavItemIndex = navItemIndex
                router.replace({
                    name: 'index',
                    params: {
                        navItem: route.params.navItem
                    }
                })
            }
        }
    })
</script>

<style lang="scss" scoped>
  $background-color: v-bind(backgroundColor); //个性化背景颜色

  .main-container {
    .nav-wrapper {
      width: $nav-width;
      background-color: $background-color;
    }

    .content-wrapper {
      background-color: $background-color;
    }
  }

  ::v-deep(.v-overlay) {
    z-index: 99999 !important;
  }
</style>