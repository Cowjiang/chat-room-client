export interface LoginParams {
    username: string | number
    password: string | number
    cvCode: string
}

export interface RegisterParams {
    mobile: number
    password: string | number
    code: string
}

export interface GetUserProfileParams {
    uid: string
}

export interface SearchUserParams {
    type: string
    searchContent: string
    pageIndex: number
    pageSize: number
}