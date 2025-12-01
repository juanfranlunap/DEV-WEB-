import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const checkSession = createAsyncThunk(
    'auth/checkSession',
    async () => {
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        return session;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        status: 'loading',
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.status = action.payload ? 'authenticated' : 'unauthenticated';
        },
        clearUser: (state) => {
            state.user = null;
            state.status = 'unauthenticated';
        },
        setStatus: (state, action) => {
            state.status = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkSession.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(checkSession.fulfilled, (state, action) => {
                if (action.payload?.user) {
                    state.user = action.payload.user;
                    state.status = 'authenticated';
                } else {
                    state.user = null;
                    state.status = 'unauthenticated';
                }
            })
            .addCase(checkSession.rejected, (state) => {
                state.user = null;
                state.status = 'unauthenticated';
            });
    },
});

export const { setUser, clearUser, setStatus } = authSlice.actions;
export default authSlice.reducer;
