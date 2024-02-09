import { useCreateAddressMutation, useUpdateAddressMutation } from "@redux/rtk/address"
import { IAddress } from "@redux/rtk/address/address.interfaces"
import { useCallback, useEffect, useState } from "react"
import Swal from 'sweetalert2'
import ModalForm from "../ModalForm"
import { ModeType } from "../ModalForm/ModalForm.interface"
import { ICreateAddressProsp } from "./CreateAddress.interface"
import { ObjectKeyDynamicI } from "@interfaces/common/common.interface"

const CreateAddress = ({ client, onClose, show }: ICreateAddressProsp) => {
    const [mode, setMode] = useState<ModeType>("create")

    const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation()
    const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation()


    const handleUpdate = useCallback((data: IAddress, clear: () => void) => {
        updateAddress(data).unwrap().then((result) => {
            Swal.fire({
                title: "Updated Address",
                text:  "Address updated successfully",
                icon: "success"
            });

            clear()
        }).catch((e) => {
            const data = e.data as ObjectKeyDynamicI[];
            Swal.fire({
                title: "Error Address",
                text: Array.from(data || [])[0]?.message || "Could not update address",
                icon: "error"
            });
        })
    }, [client])

    const handleCreate = useCallback((data: IAddress, clear: () => void) => {
        createAddress(data).unwrap().then((result) => {
            const isError = !Array.isArray(result.errors) && result.errors ? true : false

            Swal.fire({
                title: `${isError ? "Error" : "Created"} Address`,
                text: isError ? `${Array.from(result.errors?.message || [])[0]}` || "Could not create address" : "Address created successfully",
                icon: isError ? "error" : "success"
            });

            clear()
        }).catch((e) => {
            const data = e.data as ObjectKeyDynamicI[];
            Swal.fire({
                title: "Error Address",
                text: Array.from(data || [])[0]?.message || "Could not update address",
                icon: "error"
            });
        })
    }, [])



    useEffect(() => {
        setMode(client?.address ? "update" : "create")
    }, [client])

    return (
        <ModalForm<IAddress>
            show={show}
            mode={mode}
            subTitle="address"
            reference={`address-${client?.id}`}
            onlyShowLabelUpdate
            loading={isCreating || isUpdating}
            entity={client?.address ? {
                ...client.address,
                client_id: client.id
            } : { client_id: client?.id } as IAddress}
            handleSave={(data, clear) => handleCreate(data, clear)}
            handleUpdate={(data, clear) => handleUpdate(data, clear)}
            handleClose={onClose}
            fields={[
                {
                    label: "Address",
                    name: "address",
                    type: "text"
                },
                {
                    label: "City",
                    name: "city",
                    type: "text"
                },
                {
                    label: "State",
                    name: "state",
                    type: "text"
                },
                {
                    label: "Postal Code",
                    name: "postal_code",
                    type: "text"
                },{
                    label: "Country",
                    name: "country",
                    type: "text"
                },
                {
                    label: "",
                    name: "client_id",
                    type: "hidden"
                },
                {
                    label: "",
                    name: "id",
                    type: "hidden"
                },
            ]}
        />
    )
}

export default CreateAddress