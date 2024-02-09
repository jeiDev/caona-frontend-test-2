import { useCreateClientMutation, useUpdateClientMutation } from "@redux/rtk/client"
import { IClient } from "@redux/rtk/client/client.interfaces"
import { useCallback } from "react"
import Swal from "sweetalert2"
import ModalForm from "../ModalForm"
import { ICreateClientProsp } from "./CreateClient.interface"
import { ObjectKeyDynamicI } from "@interfaces/common/common.interface"

const CreateClient = ({ client, mode, show, onClose, onRefresh }: ICreateClientProsp) => {
    const [createClient, { isLoading: isCreating }] = useCreateClientMutation()
    const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation()

    const handleUpdate = useCallback((data: IClient, clear: () => void) => {
        updateClient(data).unwrap().then(() => {
            Swal.fire({
                title: "Updated Client",
                text: "Client updated successfully",
                icon:  "success"
            });

            clear()
            onRefresh()
        }).catch((e) => {
            const data = e.data as ObjectKeyDynamicI[];
            Swal.fire({
                title: "Error Client",
                text: Array.from(data || [])[0]?.message || "Could not update client",
                icon: "error"
            });
        })
    }, [client])

    const handleCreate = useCallback((data: IClient, clear: () => void) => {
        createClient(data).unwrap().then(() => {

            Swal.fire({
                title: "Created Client",
                text: "Client created successfully",
                icon: "success"
            });

            clear()
            onRefresh()
        }).catch((e) => {
            const data = e.data as ObjectKeyDynamicI[];
            Swal.fire({
                title: "Error Client",
                text: Array.from(data || [])[0]?.message || "Could not create client",
                icon: "error"
            });
        })
    }, [])

    return (
        <ModalForm<IClient>
            show={show}
            mode={mode}
            subTitle="client"
            loading={isCreating || isUpdating}
            entity={client || {} as IClient}
            reference={`client-${client?.id}`}
            handleSave={handleCreate}
            handleUpdate={(data, clear) => handleUpdate(data, clear) }
            handleClose={onClose}
            fields={[
                {
                    label: "Email",
                    name: "email",
                    type: "email"
                },
                {
                    label: "",
                    name: "id",
                    type: "hidden"
                }
            ]}
        />
    )
}

export default CreateClient