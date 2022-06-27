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
                icon: 'fa-user',
                name: '账号设置',
                dsc: '这里可以更改你的个人资料信息'
            },
            {
                id: 1,
                icon: 'fa-lock',
                name: '隐私设置',
                dsc: '这里可以更改你对个人隐私的设置'
            },
            {
                id: 2,
                icon: 'fa-message',
                name: '私信设置',
                dsc: '这里可以更改你对私信的设置'
            }
        ]
    },
    {
        id: 1,
        groupName: '个性化设置',
        groupItems: [
            {
                id: 0,
                icon: 'fa-palette',
                name: '外观设置',
                dsc: '这里可以更改你对应用外观的设置'
            },
            {
                id: 1,
                icon: 'fa-bell',
                name: '通知设置',
                dsc: '这里可以更改你对应用通知的设置'
            },
            {
                id: 2,
                icon: 'fa-keyboard',
                name: '按键设置',
                dsc: '这里可以更改你对应用按键的设置'
            }
        ]
    },
    {
        id: 2,
        groupName: '高级设置',
        groupItems: [
            {
                id: 0,
                icon: 'fa-code',
                name: '开发者设置',
                dsc: '这里可以更改你对开发者功能的设置'
            },
            {
                id: 1,
                icon: 'fa-address-card',
                name: '关于应用',
                dsc: '这里是关于该应用的信息'
            }
        ]
    },
]