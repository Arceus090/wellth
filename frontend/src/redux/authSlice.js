// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    loginTime: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            localStorage.clear();
            state.user = action.payload.others;
            state.token = action.payload.token;
            state.loginTime = Date.now();
        },
        register(state, action) {
            localStorage.clear();
            state.user = action.payload.others;
            state.token = action.payload.token;
            state.loginTime = Date.now();
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.loginTime = null;
            localStorage.clear();
        },
        handleFollow(state, action) {
            if (state.user.followings.includes(action.payload)) {
                state.user.followings = state.user.followings.filter((id) => id !== action.payload);
            } else {
                console.log(action.payload);
                state.user.followings.push(action.payload);
            }
        },
        bookmarkPost(state, action) {
            if (state.user.bookmarkedPosts.some(post => post._id === action.payload._id)) {
                state.user.bookmarkedPosts = state.user.bookmarkedPosts.filter((post) => post._id !== action.payload._id);
            } else {
                state.user.bookmarkedPosts.push(action.payload);
            }
        },
        updateUser(state, action) {
            state.user = action.payload;
        },
    },
});

export const { login, register, logout, handleFollow, bookmarkPost, updateUser } = authSlice.actions;

export default authSlice.reducer;
