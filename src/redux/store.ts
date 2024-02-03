import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import middlewares from './middlewares'

// RTK
import { clientRTKProvider } from './rtk/client'


export const store = configureStore({
	reducer: {
		// RTK
		[clientRTKProvider.reducerPath]: clientRTKProvider.reducer
	},
	middleware: (gDM) => {
		return gDM({ serializableCheck: false }).concat(middlewares)
	}
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

const useAppDispatch = () => useDispatch<AppDispatch>()
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export { useAppDispatch, useAppSelector }
