import searchPopup from './src/search-popup.vue'

export default searchPopup

type SearchType = 0 | 1 | 2 //搜索类型序号，0:用户，1:群聊，2:私信

export interface SearchPopupProps {
    value: boolean //控制弹窗显示隐藏
    type: SearchType //当前搜索的类型
}