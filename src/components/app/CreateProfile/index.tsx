import { useLazyGetOneQuery } from "@redux/rtk/client"
import { useCreateProfileMutation, useUpdateProfileMutation } from "@redux/rtk/profile"
import { IProfile } from "@redux/rtk/profile/profile.interfaces"
import { useCallback, useEffect, useState } from "react"
import Swal from 'sweetalert2'
import ModalForm from "../ModalForm"
import { ModeType } from "../ModalForm/ModalForm.interface"
import { ICreateProfileProsp } from "./CreateProfile.interface"
import { ObjectKeyDynamicI } from "@interfaces/common/common.interface"

const CreateProfile = ({ client, onClose, show }: ICreateProfileProsp) => {
    const [mode, setMode] = useState<ModeType>("create")

    const [createProfile, { isLoading: isCreating }] = useCreateProfileMutation()
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

    const handleUpdate = useCallback((data: IProfile, clear: () => void) => {
        updateProfile(data).unwrap().then(() => {
            Swal.fire({
                title: "Updated Profle",
                text: "Profle updated successfully",
                icon: "success"
            });

            clear()
        }).catch((e) => {
            const data = e.data as ObjectKeyDynamicI[];
            Swal.fire({
                title: "Error Profile",
                text: Array.from(data || [])[0]?.message || "Could not update profile",
                icon: "error"
            });
        })
    }, [])

    const handleCreate = useCallback((data: IProfile, clear: () => void) => {
        createProfile(data).unwrap().then(() => {
            Swal.fire({
                title: "Updated Profile",
                text: "Profile update successfully",
                icon: "success"
            });

            clear()
        }).catch((e) => {
            const data = e.data as ObjectKeyDynamicI[];
            Swal.fire({
                title: "Error Profile",
                text: Array.from(data || [])[0]?.message || "Could not update profile",
                icon: "error"
            });
        })
    }, [])

    useEffect(() => {
        setMode(client?.profile ? "update" : "create")
    }, [JSON.stringify(client)])

    return (
        <ModalForm<IProfile>
            show={show}
            mode={mode}
            subTitle="profile"
            reference={`profile-${client?.id}`}
            onlyShowLabelUpdate
            loading={isCreating || isUpdating}
            entity={client?.profile ? {
                ...client.profile,
                client_id: client.id
            } : { client_id: client?.id } as IProfile}
            handleSave={(data, clear) => handleCreate(data, clear)}
            handleUpdate={(data, clear) => handleUpdate(data, clear)}
            handleClose={onClose}
            fields={[
                {
                    label: "First Name",
                    name: "first_name",
                    type: "text"
                },
                {
                    label: "Last Name",
                    name: "last_name",
                    type: "text"
                },
                {
                    label: "Phone",
                    name: "phone",
                    type: "tel"
                },
                {
                    label: "Gender",
                    name: "sexo",
                    type: "select",
                    options: [
                        { value: "", label: "Select gender" },
                        { value: "M", label: "Male" },
                        { value: "F", label: "Female" }
                    ]
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

export default CreateProfile