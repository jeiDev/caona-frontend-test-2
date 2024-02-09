import { IClient } from "@redux/rtk/client/client.interfaces"

export interface ICreateAddressProsp{
    client: IClient | null
    show: boolean
    onClose: () => void
}