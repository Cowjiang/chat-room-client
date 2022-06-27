export interface SearchGroupParams {
    type: string
    searchContent: string
    pageIndex: number
    pageSize: number
}

export interface CreateGroupParams {
    title: string
    desc: string
    holderName: string
    holderUserId: string
    img: string
}