'use client';
import CreateAddress from "@components/app/CreateAddress";
import CreateClient from "@components/app/CreateClient";
import CreateProfile from "@components/app/CreateProfile";
import { ModeType } from "@components/app/ModalForm/ModalForm.interface";
import PaginationComponent from "@components/app/Pagination";
import { useDeleteClientMutation, useLazyGetManyClientQuery } from "@redux/rtk/client";
import { IClient } from "@redux/rtk/client/client.interfaces";
import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button } from 'react-bootstrap';

export default function Client() {
  const [deleteClient] = useDeleteClientMutation()
  const [getAllClients, { currentData: clients }] = useLazyGetManyClientQuery()
  const [client, setClient] = useState<IClient | null>(null)
  const [mode, setMode] = useState<ModeType>("create")

  const [showModalClient, setShowModalClient] = useState<boolean>(false)
  const [showModalProfile, setShowModalProfile] = useState<boolean>(false)
  const [showModalAddress, setShowModalAddress] = useState<boolean>(false)

  const [filters, setFilters] = useState({ limit: 20, sort: '-created_at', page: 1, expand: 'profile,address' })

  const handleSelect = useCallback((i: number) => {
    setClient(Array.from(clients || [])[i] || null)
    setMode("update")
  }, [clients])

  const handleRefresh = useCallback(() => {
    setClient(null)
    handleUpdateTable()
  }, [filters])

  const handleDelete = useCallback((id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {

        deleteClient(id).unwrap().then(() => {
          return Swal.fire({
            title: "Deleted!",
            text: "Your client has been deleted.",
            icon: "success",
            willClose: () => {
              handleRefresh()
            }
          });
        }).catch(() => {
          Swal.fire({
            title: "Error delete client",
            text: "Could not delete client",
            icon: "error"
          });
        })

      }
    });
  }, [filters])

  const handleNewClient = useCallback(() => {
    setMode("create")
    setClient(null)
    setShowModalClient(true)
  }, [])

  const handleUpdateClient = useCallback((i: number) => {
    handleSelect(i)
    setShowModalClient(true)
  }, [clients])

  const handleCloseNewClient = useCallback(() => {
    setShowModalClient(false)
  }, [])

  const handleUpdateProfile = useCallback((i: number) => {
    handleSelect(i)
    setShowModalProfile(true)
  }, [clients])

  const handleCloseProfile = useCallback(() => {
    setShowModalProfile(false)
    handleRefresh()
  }, [])

  const handleUpdateAddress = useCallback((i: number) => {
    handleSelect(i)
    setShowModalAddress(true)
  }, [clients])

  const handleCloseAddress = useCallback(() => {
    setShowModalAddress(false)
    handleRefresh()
  }, [])

  const handleUpdateTable = useCallback(() => {
    getAllClients({
      sort: filters.sort,
      page: filters.page,
      expand: filters.expand
    })
  }, [filters])

  useEffect(() => {
    handleRefresh()
  }, [filters])

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12">
          <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: 10 }}>
            <Button variant="success" onClick={handleNewClient}>
              Create
            </Button>
          </div>
        </div>
        <div className="col-12">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Email</th>
                <th scope="col">Created</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(clients || []).map((item, i) => (
                <tr key={i}>
                  <th scope="row">{item.id}</th>
                  <td>{item.email}</td>
                  <td>{item.created_at}</td>
                  <td>
                    <Button variant="success" onClick={() => handleUpdateClient(i)} >
                      <i className="fas fa-edit" />
                    </Button>
                    <Button variant="info" onClick={() => handleUpdateProfile(i)} style={{ marginLeft: 10 }}>
                      <i className="fa fa-user" />
                    </Button>
                    <Button variant="warning" onClick={() => handleUpdateAddress(i)} style={{ marginLeft: 10 }}>
                      <i className="fa fa-location-arrow" />
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(item.id)} style={{ marginLeft: 10 }}>
                      <i className="far fa-trash-alt" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="pagination justify-content-end">
            <PaginationComponent
              itemsPage={filters.limit}
              totalItems={0}
              onPageChange={(page) => {
                setFilters((prev) => ({
                  ...prev,
                  page
                }))
              }}
            />
          </ul>
        </div>
      </div>

      <CreateClient
        show={showModalClient}
        mode={mode}
        client={client}
        onRefresh={handleRefresh}
        onClose={handleCloseNewClient}
      />

      <CreateProfile
        show={showModalProfile}
        client={client}
        onClose={handleCloseProfile}
      />

      <CreateAddress
        show={showModalAddress}
        client={client}
        onClose={handleCloseAddress}
      />
    </React.Fragment>
  )
}
