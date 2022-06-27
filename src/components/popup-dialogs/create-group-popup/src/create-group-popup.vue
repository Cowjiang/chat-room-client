<template>
  <v-dialog
    v-model="showDialog"
    activator="parent"
    @click:outside="handleCloseDialog">
    <v-card width="500" rounded="lg">
      <v-card-header>
        <v-card-header-text>
          <v-card-title
            class="text-subtitle-1 font-weight-bold text-grey-darken-3">
            创建群聊
          </v-card-title>
          <v-card-subtitle>
            请填写群聊的基本信息
          </v-card-subtitle>
        </v-card-header-text>
      </v-card-header>
      <v-card-text>
        <v-form v-model="groupInfo.valid">
          <v-text-field
            class="rounded-lg"
            v-model="groupInfo.name"
            placeholder="请输入群聊名称"
            label="群聊名称"
            variant="underlined"
            :flat="true"
            density="comfortable"
            :color="primaryColor"
            :rules="[groupInfo.nameRule]"/>
          <v-text-field
            class="rounded-lg"
            v-model="groupInfo.description"
            placeholder="请输入群聊简介"
            label="群聊简介"
            variant="underlined"
            :flat="true"
            density="comfortable"
            :color="primaryColor"
            :rules="[groupInfo.descriptionRule]"/>
        </v-form>
      </v-card-text>
      <div class="d-flex px-6 pb-6">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-lighten-1"
          variant="text"
          @click="handleCloseDialog">
          <span v-if="createStatus === 1 || createStatus === 2">关闭</span>
          <span v-else>取消</span>
        </v-btn>
        <v-btn
          class="ml-4 text-white"
          :color="createStatus === 1 ? 'success' : createStatus === 2 ? 'error' : primaryColor"
          :flat="true"
          :disabled="!groupInfo.valid || createStatus === 0 || createStatus === 2"
          :loading="createStatus === 0"
          @click="handleCreateGroup">
          <span v-if="createStatus === 1">创建成功</span>
          <span v-else-if="createStatus === 2">创建失败</span>
          <span v-else>创建群聊</span>
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
    import {defineProps, withDefaults, defineEmits, ref} from 'vue'
    import {useStore} from '@/store'
    import {storeToRefs} from 'pinia'
    import {createGroupApi} from '@/service/api/groups'

    interface Props {
        value: boolean //控制弹窗显示隐藏
    }

    type createStatusType = -1 | 0 | 1 | 2 //创建群聊的状态，-1:初始状态，0:加载中，1:创建成功，2:创建失败

    const props = withDefaults(defineProps<Props>(), {
        value: false
    })

    const emit = defineEmits<{
        // eslint-disable-next-line no-unused-vars
        (e: 'update:modelValue', show: boolean): void
    }>()
    const showDialog = ref(props.value) //是否显示弹窗
    const store = useStore()
    const {primaryColor, getUserInfo} = storeToRefs(store)
    const groupInfo = ref({
        name: '', //群聊名称
        description: '', //群聊描述
        valid: false, //是否已经经过验证
        nameRule: (value: string) => !!value || '请输入组名', //群聊名称验证规则
        descriptionRule: (value: string) => !!value || '请输入群聊简介' //群聊描述验证规则
    })
    const createStatus = ref<createStatusType>(-1) //加载状态

    // 创建群聊
    const handleCreateGroup = async (): Promise<void> => {
        createStatus.value = 0
        await createGroupApi({
            title: groupInfo.value.name,
            desc: groupInfo.value.description,
            holderName: getUserInfo.value.username,
            holderUserId: getUserInfo.value.uid,
            img: getUserInfo.value.photo
        }).then(() => {
            createStatus.value = 1
        }).catch(error => {
            console.error(error)
            createStatus.value = 2
        })
    }

    // 重置数据
    const reset = (): void => {
        groupInfo.value.name = ''
        groupInfo.value.description = ''
        createStatus.value = -1
    }

    // 关闭弹窗事件
    const handleCloseDialog = (): void => {
        showDialog.value = false
        emit('update:modelValue', false)
        reset()
    }
</script>

<style lang="scss" scoped>

</style>