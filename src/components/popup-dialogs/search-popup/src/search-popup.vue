<template>
  <v-dialog
    v-model="showDialog"
    activator="parent"
    @click:outside="handleCloseDialog">
    <div class="search-container d-flex flex-column rounded-lg bg-white">
      <v-text-field
        class="ma-6 mb-4 bg-grey-lighten-3 rounded-lg"
        v-model="searchValue"
        placeholder="搜索用户/群聊/私信"
        variant="solo"
        :flat="true"
        single-line
        density="comfortable"
        prepend-inner-icon="mdi-magnify"
        hide-details
        @keydown.enter="searchResult(1)"/>
      <v-tabs
        class="mx-6"
        v-model="searchTypeIndex"
        background-color="transparent"
        :color="primaryColor"
        density="compact">
        <v-tab :value="0">用户</v-tab>
        <v-tab :value="1">群聊</v-tab>
        <v-tab :value="2">私信</v-tab>
      </v-tabs>
      <v-divider
        color="grey-lighten-3"/>
      <div class="search-result-container px-4 d-flex flex-column">
        <v-window v-model="searchTypeIndex">
          <v-window-item :value="0">
            <v-list>
              <v-list-item
                v-for="user in searchUserResult.result.get(searchUserResult.currentPageNumber)"
                :key="user.id"
                :value="user"
                height="64"
                rounded
                @click="handleUserClick(user)">
                <v-list-item-avatar
                  color="grey-lighten-3"
                  start>
                  <v-img
                    :src="user.photo"
                    :alt="user.nickname"/>
                </v-list-item-avatar>
                <v-list-item-title>
                  <span>{{ user.nickname }}</span>
                </v-list-item-title>
                <v-list-item-avatar class="ml-auto">
                  <v-btn
                    class="text-white"
                    :color="primaryColor"
                    size="x-small"
                    :flat="true"
                    :icon="true"
                    @click.stop="handleAddFriend(user)">
                    <i class="fa-solid fa-plus"></i>
                  </v-btn>
                </v-list-item-avatar>
              </v-list-item>
            </v-list>
            <empty-result
              v-if="searchUserResult.total === 0"
              class="flex-grow-1"/>
            <v-pagination
              v-else
              class="mt-auto mb-6 flex-shrink-0"
              v-model="searchUserResult.currentPageNumber"
              :length="Math.ceil(searchUserResult.total / pageSize)"
              density="comfortable"
              @update:modelValue="searchResult(searchUserResult.currentPageNumber)"/>
          </v-window-item>
          <v-window-item :value="1">
            <empty-result
              v-if="searchGroupResult.total === 0"
              class="flex-grow-1"/>
            <v-pagination
              v-else
              class="mt-auto mb-6 flex-shrink-0"
              v-model="searchGroupResult.currentPageNumber"
              :length="Math.ceil(searchGroupResult.total / pageSize)"
              density="comfortable"
              @update:modelValue="searchResult(searchGroupResult.currentPageNumber)"/>
          </v-window-item>
          <v-window-item :value="2">
            <empty-result class="flex-grow-1"/>
          </v-window-item>
        </v-window>
      </div>
    </div>
    <user-profile-popup
      v-model="userProfilePopupProps.value"
      :uid="userProfilePopupProps.uid"/>
    <validate-message-popup
      v-model="validateMessagePopupProps.value"
      :type="validateMessagePopupProps.type"
      :receiverId="validateMessagePopupProps.receiverId"
      :groupId="validateMessagePopupProps.groupId"/>
  </v-dialog>
</template>

<script lang="ts" setup>
    import {defineProps, withDefaults, defineEmits, ref, watch} from 'vue'
    import {useStore} from '@/store'
    import {storeToRefs} from 'pinia'
    import {Utils} from '@/common/utils'
    import UserProfilePopup from '@/components/popup-dialogs/user-profile-popup'
    import EmptyResult from '@/components/popup-dialogs/search-popup/src/empty-result.vue'
    import ValidateMessagePopup from '@/components/popup-dialogs/validate-message-popup'
    import {UserProfilePopupProps} from '@/components/popup-dialogs/user-profile-popup/src/user-profile-popup.vue'
    import {
        ValidateMessagePopupProps
    } from '@/components/popup-dialogs/validate-message-popup/src/validate-message-popup.vue'
    import {searchUserApi} from '@/service/api/user'
    import {searchGroupApi} from '@/service/api/groups'

    type SearchType = 0 | 1 | 2 //搜索类型序号，0:用户，1:群聊，2:私信

    interface Props {
        value: boolean //控制弹窗显示隐藏
        type: SearchType //当前搜索的类型
    }

    const props = withDefaults(defineProps<Props>(), {
        value: false,
        type: 0
    })

    const emit = defineEmits<{
        // eslint-disable-next-line no-unused-vars
        (e: 'update:modelValue', show: boolean): void
    }>()
    const utils = new Utils()
    const showDialog = ref(props.value) //是否显示弹窗
    const searchTypeIndex = ref(props.type) //当前搜索的类型
    const store = useStore()
    const {primaryColor} = storeToRefs(store)
    const searchValue = ref('') //搜索内容
    const searchUserResult = ref({
        currentPageNumber: 0,
        total: 0,
        result: new Map()
    }) //搜索用户结果
    const searchGroupResult = ref({
        currentPageNumber: 0,
        total: 0,
        result: new Map()
    }) //搜索群组结果列表
    const pageSize = 6 //分页大小
    const userProfilePopupProps = ref<UserProfilePopupProps>({
        value: false,
        uid: ''
    }) //用户个人资料弹窗组件的属性
    const validateMessagePopupProps = ref<ValidateMessagePopupProps>({
        value: false,
        type: 0,
        receiverId: '',
        groupId: ''
    }) //验证消息弹窗组件的属性

    /**
     * 获取搜索结果
     * @param pageNumber 查询的分页页码
     */
    const searchResult = async (pageNumber: number) => {
        if (searchTypeIndex.value === 0) {
            //搜索用户
            if (!searchUserResult.value.result.get(pageNumber)) {
                const searchRes = await searchUserApi({
                    type: 'nickname',
                    searchContent: searchValue.value,
                    pageIndex: pageNumber,
                    pageSize: pageSize
                })
                if (searchRes.data) {
                    searchUserResult.value.result.set(pageNumber, searchRes.data.list)
                    searchUserResult.value.currentPageNumber = pageNumber
                    searchUserResult.value.total = searchRes.data.total ?? 0
                }
            }
        } else if (searchTypeIndex.value === 1) {
            if (!searchGroupResult.value.result.get(pageNumber)) {
                //搜索群聊
                const searchRes = await searchGroupApi({
                    type: 'title',
                    searchContent: searchValue.value,
                    pageIndex: pageNumber,
                    pageSize: pageSize
                })
                if (searchRes.data) {
                    searchGroupResult.value.result.set(pageNumber, searchRes.data.groupList)
                    searchGroupResult.value.currentPageNumber = pageNumber
                    searchGroupResult.value.total = searchRes.data.total ?? 0
                }
            }
        }
    }

    /**
     * 用户点击事件
     * @param userInfo 用户信息
     */
    const handleUserClick = (userInfo: any) => {
        userProfilePopupProps.value.uid = userInfo.uid
        userProfilePopupProps.value.value = true
    }

    /**
     * 添加好友事件
     * @param userInfo 用户信息
     */
    const handleAddFriend = (userInfo: any) => {
        validateMessagePopupProps.value.type = 0
        validateMessagePopupProps.value.receiverId = userInfo.uid
        validateMessagePopupProps.value.groupId = null
        validateMessagePopupProps.value.value = true
    }

    // 关闭弹窗事件
    const handleCloseDialog = () => {
        showDialog.value = false
        reset(true)
        emit('update:modelValue', false)
    }

    // 重置数据
    const reset = (resetAll?: boolean) => {
        if (resetAll) {
            searchValue.value = ''
        }
        searchUserResult.value = {
            currentPageNumber: 0,
            total: 0,
            result: new Map()
        }
        searchGroupResult.value = {
            currentPageNumber: 0,
            total: 0,
            result: new Map()
        }
    }

    // 搜索类型变化
    watch(
        () => searchTypeIndex.value,
        () => {
            if (searchValue.value !== '') {
                utils.debounce(() => {
                    searchResult(1)
                }, 300)
            }
        }
    )

    // 搜索关键词变化
    watch(
        () => searchValue.value,
        () => {
            reset()
            searchResult(1)
        }
    )
</script>

<style lang="scss" scoped>
  .search-container {
    min-width: 800px;

    ::v-deep(.v-field__input) {
      transform: translateY(-2px);
    }

    .search-result-container {
      min-height: 480px;

      ::v-deep(.v-window-item) {
        height: 480px;
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>