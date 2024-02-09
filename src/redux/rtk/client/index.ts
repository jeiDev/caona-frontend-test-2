import config from '@config'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import paramsSerializerUtils from '@utils/paramsSerializer.utils'
import {
	IClient,
	ICreateClientRequest,
	ICreateClientResponse,
	IGetOneClientResponse,
	IUpdateClientRequest,
	IUpdateClientResponse
} from './client.interfaces'

export const clientRTKProvider = createApi({
	reducerPath: 'client',
	baseQuery: fetchBaseQuery({
		baseUrl: config.apiServer,
		paramsSerializer(params) {
			return paramsSerializerUtils(params)
		}
	}),
	endpoints: (builder) => ({
		createClient: builder.mutation<ICreateClientResponse, ICreateClientRequest>({
			query: (data) => ({
				url: '/client',
				method: 'POST',
				body: data
			}),
			transformResponse: (res: ICreateClientResponse) => {
				return res
			},
		}),
		updateClient: builder.mutation<IUpdateClientResponse, IUpdateClientRequest>({
			query: (data) => ({
				url: `/client/${data.id}`,
				method: 'PUT',
				body: data
			}),
			transformResponse: (res: IUpdateClientResponse) => {
				return res
			}
		}),
		deleteClient: builder.mutation<{ deleted: boolean }, number>({
			query: (id) => ({
				url: `/client/${id}`,
				method: 'DELETE',
			}),
			transformResponse: (res: { deleted: boolean }) => {
				return res
			}
		}),
		getManyClient: builder.query<IClient[], { page: number, sort: string, expand: string }>({
			query: (data) => ({
				url: '/client',
				method: 'GET',
				params: data
			})
		}),
		getOne: builder.query<IGetOneClientResponse, { id: number }>({
			query: (data) => ({
				url: `/client/${data.id}`,
				method: 'GET'
			})
		})
	})
})

export const {
	useCreateClientMutation,
	useDeleteClientMutation,
	useGetManyClientQuery,
	useLazyGetManyClientQuery,
	useUpdateClientMutation,
	useGetOneQuery,
	useLazyGetOneQuery
} = clientRTKProvider
