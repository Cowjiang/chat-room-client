<template>
  <v-overlay
    :value="showDialog"
    :style="{backdropFilter: `${showDialog ? 'blur(50px)' : 'unset'}`}">
    <v-dialog
      v-model="showDialog"
      persistent
      width="75vw"
      max-width="900"
      hide-overlay
      @click:outside="handleDialogClose">
      <v-snackbar
        v-model="alertInfo.show"
        :color="alertInfo.color"
        rounded="lg"
        location="top"
        app
        position="absolute"
        max-width="unset"
        min-height="unset"
        :timeout="2000">
        {{ alertInfo.text }}
      </v-snackbar>
      <div class="login-popup-container rounded-xl overflow-hidden">
        <div class="left-content">
        </div>
        <div class="right-content">
          <v-window
            v-model="currentForm">
            <v-window-item :value="0">
              <div class="login-form">
                <div class="change-form font-weight-medium">
                  <span>没有账号？</span>
                  <span
                    class="change-btn text-primary"
                    data-current="login"
                    @click="handleChangeForm">
                    立即注册
                  </span>
                </div>
                <div class="form-title font-weight-bold">
                  账户登录
                </div>
                <div class="form">
                  <v-form ref="loginForm">
                    <v-container>
                      <v-row>
                        <v-text-field
                          label="账号"
                          v-model="loginFormValue.account"
                          :rules="[rules.required, rules.account]"
                          :error="accountOrPasswordError"
                          hint="电子邮箱或手机号"
                          variant="underlined"
                          color="primary"/>
                      </v-row>
                      <v-row>
                        <v-text-field
                          label="密码"
                          v-model="loginFormValue.password"
                          type="password"
                          :rules="[rules.required, rules.pwdRequired]"
                          :error="accountOrPasswordError"
                          variant="underlined"
                          color="primary"/>
                      </v-row>
                      <v-row
                        class="captcha-row__default"
                        :class="showLoginCaptchaRow ? 'captcha-row__show' : 'captcha-row__hide'">
                        <v-text-field
                          label="验证码"
                          v-model="loginFormValue.captcha"
                          maxlength="4"
                          :rules="[rules.loginCaptcha]"
                          :hint="loginCaptchaHint"
                          :persistent-hint="loginCaptchaError || !loginCaptchaLoaded"
                          :disabled="loginCaptchaError || !loginCaptchaLoaded"
                          variant="underlined"
                          color="primary"/>
                        <v-img
                          class="flex-grow-0"
                          width="140px"
                          :src="loginCaptchaUrl"
                          @loadstart="handleLoginCaptchaLoadStart"
                          @load="handleLoginCaptchaLoad"
                          @error="handleLoginCaptchaError"
                          @click="refreshLoginCaptcha">
                          <template v-slot:placeholder>
                            <v-row
                              class="fill-height ma-0 grey lighten-4 rounded-lg"
                              v-show="!loginCaptchaLoaded"
                              align="center"
                              justify="center"
                              @click="false">
                              <v-progress-circular
                                v-show="!loginCaptchaLoaded && !loginCaptchaError"
                                :indeterminate="!loginCaptchaLoaded && !loginCaptchaError"
                                width="2"
                                size="20"
                                color="primary"/>
                              <v-hover
                                v-slot="{ hover }"
                                v-show="loginCaptchaError">
                                <v-icon
                                  :class="{ 'on-hover': hover }"
                                  @click.stop="refreshLoginCaptcha(true)">
                                  fas fa-repeat
                                </v-icon>
                              </v-hover>
                            </v-row>
                          </template>
                        </v-img>
                      </v-row>
                      <v-row
                        class="auto-and-forget mb-6 button-transfer__default"
                        :class="showLoginCaptchaRow ? '' : 'button-transfer__unmoved'">
                        <v-checkbox
                          label="下次自动登录"
                          color="primary"
                        ></v-checkbox>
                        <v-btn
                          class="forgot-pwd"
                          flat
                          size="small">
                          忘记密码
                        </v-btn>
                      </v-row>
                      <v-row
                        class="button-transfer__default"
                        :class="showLoginCaptchaRow ? '' : 'button-transfer__unmoved'">
                        <v-btn
                          block
                          flat
                          color="primary"
                          :loading="loginBtnLoading"
                          @click="handleLoginBtnClick">
                          登录
                        </v-btn>
                      </v-row>
                    </v-container>
                  </v-form>
                </div>
              </div>
            </v-window-item>
            <v-window-item :value="1">
              <div class="register-form">
                <div class="change-form font-weight-medium">
                  <span>已有账号？</span>
                  <span
                    class="change-btn text-primary"
                    data-current="register"
                    @click="handleChangeForm">立即登录</span>
                </div>
                <div class="form-title font-weight-bold">
                  新用户注册
                </div>
                <div class="form">
                  <v-form ref="registerForm">
                    <v-container>
                      <v-row>
                        <v-text-field
                          label="手机号"
                          v-model="registerFormValue.phone"
                          :rules="[rules.required, rules.phone]"
                          variant="underlined"
                          color="primary"/>
                      </v-row>
                      <v-row class="captcha-row">
                        <v-text-field
                          label="验证码"
                          v-model="registerFormValue.captcha"
                          :rules="[rules.required, rules.registerCaptcha]"
                          validate-on-blur
                          hint="短信验证码"
                          variant="underlined"
                          color="primary"/>
                        <v-btn
                          :loading="registerCaptchaSending || !allowSendRegisterCaptcha"
                          depressed
                          :disabled="typeof rules.phone(registerFormValue.phone) !== 'boolean' || !allowSendRegisterCaptcha"
                          color="primary"
                          @click="sendRegisterCaptcha">
                          发送验证码
                          <template v-slot:loader>
                            <v-progress-circular
                              v-show="registerCaptchaSending"
                              :indeterminate="registerCaptchaSending"
                              width="2"
                              size="20"
                              color="primary"/>
                            <span v-show="!registerCaptchaSending">
                          {{ registerCaptchaResendTimeLeft }}s后重新发送
                        </span>
                          </template>
                        </v-btn>
                      </v-row>
                      <v-row
                        class="password-row__default"
                        :class="showRegisterPwdRow ? 'password-row__show' : 'password-row__hide'">
                        <v-text-field
                          label="密码"
                          v-model="registerFormValue.password"
                          :rules="[rules.registerPwd]"
                          variant="underlined"
                          color="primary"/>
                      </v-row>
                      <v-row
                        class="user-agreement mb-6 button-transfer__default"
                        :class="showRegisterPwdRow ? '' : 'button-transfer__unmoved'">
                        <v-checkbox
                          label="我已阅读并同意用户协议"
                          :rules="[v => !v]"
                          color="primary"/>
                      </v-row>
                      <v-row
                        class="button-transfer__default"
                        :class="showRegisterPwdRow ? '' : 'button-transfer__unmoved'">
                        <v-btn
                          block
                          flat
                          color="primary"
                          @click="handleRegisterBtnClick">
                          注册
                        </v-btn>
                      </v-row>
                    </v-container>
                  </v-form>
                </div>
              </div>
            </v-window-item>
          </v-window>
        </div>
      </div>
    </v-dialog>
  </v-overlay>
</template>

<script lang="ts" setup>
    import {computed, defineProps, defineEmits, onMounted, reactive, ref} from "vue"
    import {useRouter} from 'vue-router'
    import {loginApi, registerApi} from "@/service/api/user"
    import axios from "axios"

    interface VForm {
        reset: Function,
        validate: Function,
        resetValidate: Function
    }

    defineProps({
        value: {
            type: Boolean,
            default: true
        },
        defaultForm: {
            type: Number,
            default: 0
        }
    })

    // const emit = defineEmits(['close']) //关闭登陆窗体事件

    const router = useRouter()
    const loginForm = ref({})
    const registerForm = ref({})
    const showDialog = ref(true) //同步props中的value属性，用于控制窗体关闭开启
    const currentForm = ref(0) //当前显示的表单，0:登录，1:注册
    const loginFormValue = reactive({
        account: '',
        password: '',
        captcha: ''
    }) //登陆表单中用户输入的数据
    const registerFormValue = reactive({
        phone: '',
        password: '',
        captcha: ''
    }) //注册表单中用户输入的数据
    const showLoginCaptchaRow = ref(false) //是否显示登陆表单中的验证码输入行
    const showRegisterPwdRow = ref(false) //是否显示注册表单中的密码输入行
    const loginCaptchaUrl = ref('') //登陆表单验证码图片url
    const loginCaptchaLoaded = ref(false) //登陆表单验证码是否已经加载完成
    const loginCaptchaError = ref(false) //登陆表单验证码是否加载失败
    const loginBtnLoading = ref(false) //登陆按钮是否处于加载状态
    const registerBtnLoading = ref(false) //注册按钮是否处于加载状态
    const allowSendRegisterCaptcha = ref(true) //是否允许发送注册表单手机验证码
    const registerCaptchaSending = ref(false) //注册表单手机验证码发送中
    const registerCaptchaResendTimer = ref<number | undefined>(undefined) //注册表单手机验证码发送计时器
    const registerCaptchaResendTimeLeft = ref(0) //注册表单手机验证码重发倒计时（秒）
    const accountOrPasswordError = ref(false) //登陆时回报账号或密码错误状态
    let alertInfo = reactive({
        show: false,
        text: '',
        color: ''
    }) //消息提示框的信息
    const rules = {
        required: (value: any) => !!value || '不能为空',
        pwdRequired: (value: any) => !!value || '请填写密码',
        account: (value: string) => {
            const email = /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            const phone = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
            return email.test(value) || phone.test(value) || '请填写正确的电子邮箱或手机号'
        },
        loginCaptcha: (value: string) => /^[a-zA-Z0-9]{4}$/.test(value) || !showLoginCaptchaRow.value || '请正确填写验证码',
        phone: (value: string) => /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value) || '请填写正确的手机号',
        registerCaptcha: (value: string) => /^[0-9]{6}$/.test(value) || '请正确填写验证码',
        registerPwd: (value: string) => /^[a-zA-Z0-9]{6,18}$/.test(value) || !showRegisterPwdRow.value || '请输入6-18位英文/数字',
    } //表单验证规则

    onMounted(() => {
        init()
    })

    // 初始化/还原表单
    const init = () => {
        if (currentForm.value === 0) {
            (loginForm.value as VForm).reset()
        } else {
            (registerForm.value as VForm).reset()
        }
        showLoginCaptchaRow.value = false
        loginCaptchaUrl.value = ''
    }

    // 切换登录/注册表单
    const handleChangeForm = (e: Event | null) => {
        init()
        currentForm.value = e ? ((e.currentTarget as HTMLElement).dataset.current === 'login' ? 1 : 0) : 0
    }

    // 登录按钮点击事件
    const handleLoginBtnClick = () => {
        accountOrPasswordError.value = false
        if (!showLoginCaptchaRow.value) {
            (loginForm.value as VForm).validate().then((res: any) => {
                if (res.valid) {
                    loginBtnLoading.value = true
                    refreshLoginCaptcha()
                    setTimeout(() => {
                        showLoginCaptchaRow.value = true
                        loginBtnLoading.value = false
                    }, 1000)
                }
            })
        } else {
            (loginForm.value as VForm).validate().then(async (res: any) => {
                if (res.valid) {
                    loginBtnLoading.value = true
                    const res = await loginApi({
                        username: loginFormValue.account,
                        password: loginFormValue.password,
                        cvCode: loginFormValue.captcha
                    })
                    loginBtnLoading.value = false
                    if (res.success) {
                        await router.replace({path: '/'})
                    } else {
                        if (res.code === 1007) {
                            loginFormValue.captcha = ''
                            refreshLoginCaptcha()
                            alert('验证码输入错误', 'warning')
                        } else if (res.code === 1008) {
                            accountOrPasswordError.value = true
                            loginFormValue.captcha = ''
                            refreshLoginCaptcha()
                            alert('账号或密码错误', 'warning')
                        } else {
                            alert('网络异常', 'error')
                        }
                    }
                }
            })
        }
    }

    // 注册按钮点击事件
    const handleRegisterBtnClick = () => {
        if (!showRegisterPwdRow.value) {
            (registerForm.value as VForm).validate().then((res: any) => {
                if (res.valid) {
                    registerBtnLoading.value = true
                    setTimeout(() => {
                        showRegisterPwdRow.value = true
                        registerBtnLoading.value = false
                    }, 500)
                }
            })
        } else {
            (registerForm.value as VForm).validate().then((res: any) => {
                if (res.valid) {
                    const res = registerApi({
                        mobile: registerFormValue.phone,
                        password: registerFormValue.password,
                        code: registerFormValue.captcha
                    })
                    console.log(res)
                    if (res.success) {
                        handleChangeForm(null)
                    } else {
                        if (res.code === 1017) {
                            registerFormValue.captcha = ''
                        }
                    }
                }
            })
        }
    }

    // 登陆表单验证码开始加载监听事件
    const handleLoginCaptchaLoadStart = () => {
        loginCaptchaError.value = false
        loginCaptchaLoaded.value = false
    }

    // 登陆表单验证码加载完毕监听事件
    const handleLoginCaptchaLoad = () => {
        loginCaptchaLoaded.value = true
    }

    // 登陆表单验证码加载失败监听事件
    const handleLoginCaptchaError = () => {
        loginCaptchaError.value = true
    }

    // 刷新登陆表单验证码
    const refreshLoginCaptcha = (isError: boolean = false) => {
        if (!isError) {
            loginCaptchaUrl.value = `/api/user/getCode?${Math.random()}`
        } else {
            loginCaptchaLoaded.value = false
            loginCaptchaError.value = false
            loginCaptchaUrl.value = `/api/user/getCode?${Math.random()}`
        }
    }

    // 发送注册表单手机验证码
    const sendRegisterCaptcha = () => {
        allowSendRegisterCaptcha.value = false
        registerCaptchaSending.value = true
        setTimeout(async () => {
            const res = await axios.get(`/api/sms/send/${registerFormValue.phone}`)
            if (res.data.success) {
                registerCaptchaSending.value = false
                registerCaptchaResendTimer.value = setInterval(() => {
                    if (registerCaptchaResendTimeLeft.value > 0) {
                        registerCaptchaResendTimeLeft.value -= 1
                    } else {
                        clearInterval(registerCaptchaResendTimer.value)
                        registerCaptchaResendTimer.value = undefined
                        allowSendRegisterCaptcha.value = true
                        registerCaptchaResendTimeLeft.value = 60
                    }
                }, 1000)
            } else {
                console.error(res.data)
            }
        }, 1000)
    }

    /**
     * 显示消息弹出窗
     * @param text 消息内容
     * @param type 消息类型，success/warning/error
     */
    const alert = (text: string, type: string) => {
        alertInfo.show = true
        alertInfo.text = text
        alertInfo.color = type === 'success' ? 'success' : type === 'warning' ? 'warning' : type === 'error' ? 'error' : ''
    }

    // 登录弹出窗关闭事件
    const handleDialogClose = () => {
        // init()
        // showDialog.value = false
        // emit('close')
    }

    // 登录验证码提示语
    const loginCaptchaHint = computed(() => !loginCaptchaLoaded.value ? loginCaptchaError.value ? '验证码加载失败，请重试' : '正在加载验证码，请稍后' : '请输入图形验证码')
</script>

<style lang="scss" scoped>
  @import "login-popup";
</style>