import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type TTableCell = {
  id: number
  title: string
  body: string
}

const initialState: TTableCell[] = []

export const fetchInitialData = createAsyncThunk('table/fetchTable', () => {
  return fetch('https://jsonplaceholder.typicode.com/posts').then((data) => {
    return data.json()
  })
})

export const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {},
  extraReducers: {
    [String(fetchInitialData.fulfilled)]: (state, action: PayloadAction<TTableCell[]>) => {
      return action.payload
    },
  },
})

export const tableSliceReducer = tableSlice.reducer
