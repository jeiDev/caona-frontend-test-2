import config from '@config'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import paramsSerializerUtils from '@utils/paramsSerializer.utils'
import {
	IAddress,
	ICreateAddressRequest,
	ICreateAddressResponse,
	IGetOneAddressResponse,
	IUpdateAddressRequest,
	IUpdateAddressResponse
} from './address.interfaces'

export const addressRTKProvider = createApi({
	reducerPath: 'address',
	baseQuery: fetchBaseQuery({
		baseUrl: config.apiServer,
		paramsSerializer(params) {
			return paramsSerializerUtils(params)
		}
	}), 
	endpoints: (builder) => ({
		createAddress: builder.mutation<ICreateAddressResponse, ICreateAddressRequest>({
			query: (data) => ({
				url: '/address',
				method: 'POST',
				body: data
			}),
			transformResponse: (res: ICreateAddressResponse) => {
				return res
			}
		}),
		updateAddress: builder.mutation<IUpdateAddressResponse, IUpdateAddressRequest>({
			query: (data) => ({
				url: `/address/${data.id}`,
				method: 'PUT',
				body: data
			}),
			transformResponse: (res: IUpdateAddressResponse) => {
				return res
			}
		}),
		deleteAddress: builder.mutation<{ deleted: boolean }, number>({
			query: (id) => ({
				url: `/address/${id}`,
				method: 'DELETE'
			}),
			transformResponse: (res: { deleted: boolean }) => {
				return res
			}
		}),
		getManyAddress: builder.query<IAddress[], { page: number, sort: string, expand: string }>({
			query: (data) => ({
				url: '/address',
				method: 'GET',
				params: data
			})
		}),
		getOneAddress: builder.query<IGetOneAddressResponse, { id: number }>({
			query: (data) => ({
				url: `/address/${data.id}`,
				method: 'GET'
			})
		})
	})
})

export const {
	useCreateAddressMutation,
	useDeleteAddressMutation,
	useGetManyAddressQuery,
	useGetOneAddressQuery,
	useLazyGetManyAddressQuery,
	useLazyGetOneAddressQuery,
	useUpdateAddressMutation
} = addressRTKProvider
