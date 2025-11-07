import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authService } from '../services/authService'
import { LoginDto, RegisterDto, User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  permissions: string[]
  roles: string[]
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  permissions: localStorage.getItem('permissions') ? JSON.parse(localStorage.getItem('permissions')!) : [],
  roles: localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles')!) : [],
  loading: false,
  error: null,
}

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async () => {
  const response = await authService.getCurrentUser()
  return response.data
})

export const login = createAsyncThunk('auth/login', async (credentials: LoginDto) => {
  const response = await authService.login(credentials)
  return response.data
})

export const register = createAsyncThunk('auth/register', async (data: RegisterDto) => {
  const response = await authService.register(data)
  return response.data
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.permissions = []
      state.roles = []
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('permissions')
      localStorage.removeItem('roles')
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('refreshToken', action.payload.refreshToken)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('refreshToken', action.payload.refreshToken)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('refreshToken', action.payload.refreshToken)
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Registration failed'
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.permissions = action.payload.permissions
        state.roles = action.payload.roles
        localStorage.setItem('permissions', JSON.stringify(action.payload.permissions))
        localStorage.setItem('roles', JSON.stringify(action.payload.roles))
      })
  },
})

export const { logout, setCredentials } = authSlice.actions
export default authSlice.reducer
