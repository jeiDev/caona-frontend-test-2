import config from '@config'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import paramsSerializerUtils from '@utils/paramsSerializer.utils'
import {
	ICreateProfileRequest,
	ICreateProfileResponse,
	IGetOneProfileResponse,
	IProfile,
	IUpdateProfileRequest,
	IUpdateProfileResponse
} from './profile.interfaces'

export const profileRTKProvider = createApi({ 
	reducerPath: 'profile',
	baseQuery: fetchBaseQuery({
		baseUrl: config.apiServer,
		paramsSerializer(params) {
			return paramsSerializerUtils(params)
		}
	}),
	endpoints: (builder) => ({
		createProfile: builder.mutation<ICreateProfileResponse, ICreateProfileRequest>({
			query: (data) => ({
				url: '/profile',
				method: 'POST',
				body: data
			}),
			transformResponse: (res: ICreateProfileResponse) => {
				return res
			}
		}),
		updateProfile: builder.mutation<IUpdateProfileResponse, IUpdateProfileRequest>({
			query: (data) => ({
				url: `/profile/${data.id}`,
				method: 'PUT',
				body: data
			}),
			transformResponse: (res: IUpdateProfileResponse) => {
				return res
			}
		}),
		deleteProfile: builder.mutation<{ deleted: boolean }, number>({
			query: (id) => ({
				url: `/profile/${id}`,
				method: 'DELETE'
			}),
			transformResponse: (res: { deleted: boolean }) => {
				return res
			}
		}),
		getManyProfile: builder.query<IProfile[], { page: number, sort: string }>({
			query: (data) => ({
				url: '/profile',
				method: 'GET',
				params: data
			})
		}),
		getOneProfile: builder.query<IGetOneProfileResponse, { id: number }>({
			query: (data) => ({
				url: `/profile/${data.id}`,
				method: 'GET'
			})
		})
	})
})

export const {
	useCreateProfileMutation, 
	useDeleteProfileMutation,
	useGetManyProfileQuery,
	useGetOneProfileQuery,
	useLazyGetManyProfileQuery,
	useLazyGetOneProfileQuery,
	useUpdateProfileMutation
} = profileRTKProvider
