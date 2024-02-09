import { IClient } from "@redux/rtk/client/client.interfaces"

export interface ICreateProfileProsp{
    client: IClient | null
    show: boolean
    onClose: () => void
}