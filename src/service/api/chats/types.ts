type ChatMessageType = 'all' | 'file'
export interface GetSingleChatHistoryParams {
    roomId: string,
    type?: ChatMessageType,
    query?: string,
    data?: string,
    pageNumber: number,
    pageSize: number
}