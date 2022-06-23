<template>
  <div class="friend-frame-container w-100 h-100 d-flex flex-column">
    <div class="title-container w-100 px-6 d-flex flex-shrink-0 align-center">
      <div class="title">
        <i class="fa-solid fa-users mr-4"/>
        <span class="font-weight-bold text-grey-darken-3">好友</span>
      </div>
      <div class="divider mx-4">
        <v-divider
          length="20"
          thickness="2"
          :vertical="true"/>
      </div>
      <v-btn-toggle
        v-model="currentFriendType"
        :color="primaryColor"
        group mandatory
        variant="text"
        density="compact">
        <v-btn
          class="text-subtitle-1 mx-1"
          :flat="true"
          height="30"
          rounded="pill">
          全部好友
        </v-btn>
        <v-btn
          class="text-subtitle-1 mx-1"
          :flat="true"
          height="30"
          rounded="pill">
          在线
        </v-btn>
        <v-btn
          class="text-subtitle-1 mx-1"
          :flat="true"
          height="30"
          rounded="pill">
          请求
        </v-btn>
        <v-btn
          class="text-subtitle-1 mx-1"
          :flat="true"
          height="30"
          rounded="pill">
          黑名单
        </v-btn>
      </v-btn-toggle>
    </div>
    <div class="content-container w-100 pa-5 d-flex flex-column flex-grow-1">
      <v-list>
        <v-list-subheader inset>
          全部 {{ currentFriendAmount }}
        </v-list-subheader>
        <v-list-item
          v-for="friend in currentFriendList"
          :key="friend.id"
          :value="friend"
          height="64"
          rounded
          @click="handleFriendClick(friend)">
          <v-list-item-avatar
            :color="primaryColor"
            start>
            <v-img
              :src="friend.photo"
              :alt="friend.nickname"/>
          </v-list-item-avatar>
          <v-list-item-title>
            <span>{{ friend.nickname }}</span>
          </v-list-item-title>
          <v-list-item-avatar class="ml-auto">
            <v-btn
              class="bg-grey-lighten-3 text-grey-darken-2"
              size="x-small"
              variant="tonal"
              :icon="true">
              <i class="fa-solid fa-comment-dots"></i>
            </v-btn>
          </v-list-item-avatar>
          <v-list-item-avatar>
            <v-btn
              class="bg-grey-lighten-3 text-grey-darken-2"
              size="x-small"
              variant="tonal"
              :icon="true"
              @click.stop="">
              <i class="fa-solid fa-ellipsis"></i>
            </v-btn>
          </v-list-item-avatar>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script lang="ts" setup>
    import {ref, watch, onMounted, withDefaults, defineProps} from 'vue'
    import {useStore} from '@/store'
    import {storeToRefs} from 'pinia'
    import {useRouter} from 'vue-router'
    import {AxiosError, AxiosResponse} from 'axios'
    import {getFriendsListApi} from '@/service/api/firends'
    import {FriendInfo} from '@/store/types'

    interface Props {
        friendType: FriendType
    }

    export type FriendType = 0 | 1 | 2 | 3 //好友类型，0:全部，1:在线，2:请求，3:黑名单

    const props = withDefaults(defineProps<Props>(), {
        friendType: 0
    })
    const store = useStore()
    const {primaryColor, getChatList} = storeToRefs(store)
    const router = useRouter()
    const currentFriendType = ref<FriendType>(props.friendType) //当前的好友类型
    const currentFriendList = ref<FriendInfo[]>([]) //当前好友类型下的好友列表
    const currentFriendAmount = ref<number>(0) //当前好友类型下好友数量

    /**
     * 获取好友列表数据
     * @param friendType 要获取的好友列表类型
     */
    const getFriendList = (friendType?: FriendType) => new Promise((resolve, reject) => {
        getFriendsListApi().then((res: AxiosResponse) => {
            if (friendType === 0) {
                res.data.myFriendsList = [
                    {
                        createDate: '2021-12-18T16:41:26.640+00:00',
                        nickname: '阿尔维斯3132',
                        photo: 'face/face5.jpg',
                        signature: '',
                        id: '61be1225764ede0e9b7c9a30',
                        level: 1,
                        roomId: '61be0e6ce7fd6865cbcd74ca-61be1225764ede0e9b7c9a30'
                    },
                    {
                        createDate: '2021-12-18T16:41:26.640+00:00',
                        nickname: '阿尔维斯3133',
                        photo: 'https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg',
                        signature: '',
                        id: '61be1225764ede0e9b7c9a31',
                        level: 1,
                        roomId: '61be0e6ce7fd6865cbcd74ca-61be1225764ede0e9b7c9a32'
                    }
                ]
                store.setFriendList(res.data.myFriendsList ?? [])
            } else if (friendType === 1) {
                res.data.myFriendsList = [
                    {
                        createDate: '2021-12-18T16:41:26.640+00:00',
                        nickname: '保利尼奥保利尼奥保利尼奥3151',
                        photo: 'https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg',
                        signature: '',
                        id: '61be1225764ede0e9b7c9a30',
                        level: 1,
                        roomId: '61be0e6ce7fd6865cbcd74ca-61be0e3ae7fd6865cbcd74c7'
                    }
                ]
            }
            currentFriendList.value = res.data.myFriendsList
            currentFriendAmount.value = res.data.myFriendsList.length
            resolve(res)
        }).catch((err: AxiosError) => {
            reject(err)
        })
    })

    /**
     * 好友点击事件
     * @param friend 好友信息
     */
    const handleFriendClick = (friend: FriendInfo) => {
        router.replace({
            name: 'chat',
            params: {
                chatType: 'private',
                roomId: friend.roomId
            }
        })
        if (getChatList.value.findIndex((chat: { id: string }) => chat.id === friend.roomId) === -1) {
            store.setChatList([{
                id: friend.roomId,
                nickname: friend.nickname,
                avatarUrl: friend.photo,
                time: Date()
            }, ...store.chatList])
        }
    }

    watch(
        () => currentFriendType.value,
        (nVal, oVal) => {
            if (nVal !== oVal) {
                router.replace({
                    name: 'friend',
                    params: {
                        friendType: ['all', 'online', 'request', 'block'][nVal]
                    }
                })
                getFriendList(nVal)
            }
        },
        {
            immediate: true
        }
    )

    onMounted(() => {

    })
</script>

<style lang="scss" scoped>
  $primary-color: v-bind(primaryColor); //个性化主题颜色
  $title-container-height: 60px;

  .friend-frame-container {
    .title-container {
      height: $title-container-height;

      .title {
        color: $primary-color;
        font-size: 18px;
      }

      .divider {
        height: 20px;
      }

      ::v-deep(.v-btn-group) {
        height: 30px;
      }
    }

    .content-container {

    }
  }
</style>