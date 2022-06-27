<template>
  <div>
    <div class="setting-group w-100 d-flex flex-column">
      <span class="mb-2 text-subtitle-1 text-grey-darken-3 font-weight-bold">个人资料</span>
      <div class="pt-2 d-flex align-center">
        <span class="flex-grow-1 text-subtitle-2 text-grey-darken-3">我的头像</span>
        <v-avatar
          class="flex-shrink-0"
          color="grey-lighten-3"
          size="60">
          <v-img
            :src="getUserInfo.photo"
            :alt="getUserInfo.nickname"/>
        </v-avatar>
        <v-file-input
          class="ml-4 d-flex justify-center align-center flex-grow-0 bg-deep-purple rounded"
          label="更换头像"
          filled
          hide-details
          prepend-icon="mdi-camera"
          @update:modelValue="handleFileSelected"/>
      </div>
      <div class="pt-2 d-flex align-center">
        <span class="flex-grow-1 text-subtitle-2 text-grey-darken-3">手机号</span>
        <span class="text-subtitle-1 text-grey-lighten-1">{{ getUserInfo.username }}</span>
        <v-btn
          class="ml-4"
          width="64"
          :flat="true"
          color="deep-purple"
          disabled>
          编辑
        </v-btn>
      </div>
      <div class="pt-2 d-flex align-center">
        <span class="flex-grow-1 text-subtitle-2 text-grey-darken-3">用户昵称</span>
        <span class="text-subtitle-1 text-grey-darken-3">{{ getUserInfo.nickname }}</span>
        <v-btn
          class="ml-4"
          width="64"
          :flat="true"
          color="deep-purple">
          编辑
          <v-dialog
            v-model="editNickname.showNicknameEditPopup"
            activator="parent"
            @click:outsid="handleCloseDialog">
            <v-card
              width="500"
              rounded="lg"
              title="修改用户昵称"
              subtitle="编辑新的用户昵称">
              <v-card-text>
                <v-form v-model="editNickname.valid">
                  <v-text-field
                    class="bg-grey-lighten-3 rounded-lg"
                    v-model="editNickname.newNickname"
                    placeholder="请输入新的用户昵称"
                    variant="solo"
                    :flat="true"
                    single-line
                    density="compact"
                    hide-details
                    :rules="[editNickname.rule]"/>
                </v-form>
              </v-card-text>
              <div class="d-flex pa-6">
                <v-spacer></v-spacer>
                <v-btn
                  color="grey-lighten-1"
                  variant="text"
                  @click="handleCloseDialog">
                  取消
                </v-btn>
                <v-btn
                  class="ml-4 text-white"
                  :color="primaryColor"
                  :flat="true"
                  :disabled="!editNickname.valid"
                  @click="updateProfile('nickname', editNickname.newNickname)">
                  确定
                </v-btn>
              </div>
            </v-card>
          </v-dialog>
        </v-btn>
      </div>
      <div class="pt-2 d-flex align-center">
        <span class="flex-grow-1 text-subtitle-2 text-grey-darken-3">性别</span>
        <v-radio-group
          class="flex-grow-0"
          v-model="gender"
          inline
          hide-details
          @change="updateProfile('sex', gender)">
          <v-radio
            label="男"
            color="deep-purple"
            :value="1"/>
          <v-radio
            label="女"
            color="deep-purple"
            :value="2"/>
        </v-radio-group>
      </div>
      <v-divider class="my-6" color="#e5e5ea"/>
    </div>
    <div class="setting-group w-100 d-flex flex-column">
      <span class="mb-2 text-subtitle-1 text-grey-darken-3 font-weight-bold">账号安全</span>
      <div class="pt-2 d-flex align-center">
        <span class="flex-grow-1 text-subtitle-2 text-grey-darken-3">更改密码</span>
        <v-btn
          class="ml-4"
          :flat="true"
          color="error">
          更改密码
          <v-dialog
            v-model="editPassword.showPasswordEditPopup"
            activator="parent"
            @click:outsid="handleCloseDialog">
            <v-card
              width="500"
              rounded="lg"
              title="更改账号密码"
              subtitle="编辑新的用户昵称">
              <v-card-text>
                <v-form v-model="editPassword.valid">
                  <v-text-field
                    class="rounded-lg"
                    v-model="editPassword.oldPassword"
                    type="password"
                    placeholder="请输入旧密码"
                    label="旧密码"
                    variant="underlined"
                    :flat="true"
                    density="compact"
                    color="deep-purple"
                    :rules="[editPassword.passwordRule]"/>
                  <v-text-field
                    class="rounded-lg"
                    v-model="editPassword.newPassword"
                    type="password"
                    placeholder="请输入新密码"
                    label="新密码"
                    variant="underlined"
                    :flat="true"
                    density="compact"
                    color="deep-purple"
                    :rules="[editPassword.passwordRule, editPassword.newPasswordValidateRule]"/>
                </v-form>
              </v-card-text>
              <div class="d-flex pa-6">
                <v-spacer></v-spacer>
                <v-btn
                  color="grey-lighten-1"
                  variant="text"
                  @click="handleCloseDialog">
                  取消
                </v-btn>
                <v-btn
                  class="ml-4 text-white"
                  :color="primaryColor"
                  :flat="true"
                  :disabled="!editPassword.valid"
                  @click="handleChangePassword">
                  确定
                </v-btn>
              </div>
            </v-card>
          </v-dialog>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
    import {ref} from 'vue'
    import {useStore} from '@/store'
    import {storeToRefs} from 'pinia'
    import axios from "axios";
    import {updateUserProfileApi} from "@/service/api/user";

    const store = useStore()
    const {primaryColor, getUserInfo} = storeToRefs(store)
    const gender = ref<number>(getUserInfo.value.sex)
    const editNickname = ref({
        showNicknameEditPopup: false, //是否显示昵称修改弹窗
        newNickname: '', //新昵称
        valid: false, //是否已经经过验证
        rule: (value: string) => !!value || '不能为空'
    })
    const editPassword = ref({
        showPasswordEditPopup: false, //是否显示密码修改弹窗
        oldPassword: '', //旧密码
        newPassword: '', //新密码
        valid: false, //是否已经经过验证
        passwordRule: (value: string) => /^[a-zA-Z0-9]{6,18}$/.test(value) || '请输入6-18位英文/数字', //密码验证规则
        newPasswordValidateRule: (value: string) => value !== editPassword.value.oldPassword || '新密码不能与旧密码相同' //新密码验证规则
    })

    // 文件选择事件
    const handleFileSelected = (files: Array<File>): void => {
        const file = files[0];
        let fileForm = new window.FormData();
        fileForm.append('file', file);
        fileForm.append('model', 'chat');
        uploadFile(fileForm);
    }

    /**
     * 文件上传事件
     * @param file 文件表单
     */
    const uploadFile = (file: FormData): void => {
        const token: string = sessionStorage.getItem("token") ?? ''
        axios.post('/api/system/upload', file, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': token
            }
        }).then(res => {
            const fileUrl = res.data.data.file.filePath
            updateProfile('photo', fileUrl)
        }).catch(error => {
            console.error(error);
        })
    }

    // 更改密码
    const handleChangePassword = () => {
        handleCloseDialog()
    }

    /**
     * 更新用户个人资料
     * @param key 更改的键名
     * @param value 更改后的值
     */
    const updateProfile = (key: string, value: string | number): void => {
        updateUserProfileApi({
            field: key,
            value: value
        }).then(() => {
            const userInfo = getUserInfo.value
            userInfo[key] = value
            store.updateUserInfo(userInfo)
        }).catch(error => {
            console.error(error)
        })
    }

    // 关闭弹窗
    const handleCloseDialog = (): void => {
        editNickname.value.showNicknameEditPopup = false
        editNickname.value.newNickname = ''
        editPassword.value.showPasswordEditPopup = false
        editPassword.value.oldPassword = ''
        editPassword.value.newPassword = ''
    }
</script>

<style lang="scss" scoped>
  $primary-color: v-bind(primaryColor); //个性化主题颜色

  .setting-group {
    & > div {
      min-height: 70px;
    }

    ::v-deep(.v-switch .v-label) {
      display: none;
    }

    ::v-deep(.v-file-input) {
      width: 64px;
      height: 36px;

      .v-input__prepend {
        padding-top: 0;
        margin-inline-end: 0;

        .v-icon {
          opacity: 1;
        }
      }

      .v-input__control {
        display: none;
      }
    }
  }
</style>