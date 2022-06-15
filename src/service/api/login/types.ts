export interface LoginParams {
    username: string | number,
    password: string | number,
    cvCode: string
}

export interface RegisterParams {
    mobile: number,
    password: string | number,
    code: string
}