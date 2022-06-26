import settingFrame from './src/setting-frame.vue'

export default settingFrame

//设置列表
export const settingList = [
    {
        id: 0,
        groupName: '用户设置',
        groupItems: [
            {
                id: 0,
                icon: '',
                name: '账号设置'
            },
            {
                id: 1,
                icon: '',
                name: '隐私设置'
            },
            {
                id: 2,
                icon: '',
                name: '私信设置'
            }
        ]
    },
    {
        id: 1,
        groupName: '个性化设置',
        groupItems: [
            {
                id: 0,
                icon: '',
                name: '外观设置'
            },
            {
                id: 1,
                icon: '',
                name: '通知设置'
            },
            {
                id: 2,
                icon: '',
                name: '按键设置'
            }
        ]
    },
    {
        id: 2,
        groupName: '高级设置',
        groupItems: [
            {
                id: 0,
                icon: '',
                name: '开发者设置'
            },
            {
                id: 1,
                icon: '',
                name: '关于应用'
            }
        ]
    },
]