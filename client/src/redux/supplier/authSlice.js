import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  loading: true,
  token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
  email: localStorage.getItem("email") ? localStorage.getItem("email") : null,
  user: null,
  error: null,
  showProfileDropdown: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, value) {
      state.user = value.payload;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout: (state) => {
      state.user = null;
      state.showProfileDropdown = false;
    },
    toggleProfileDropdown: (state) => {
      state.showProfileDropdown = !state.showProfileDropdown;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
    setEmail(state, value) {
      state.email = value.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setToken, setEmail, setUser, setError, updateUser, logout, toggleProfileDropdown } = authSlice.actions;

export default authSlice.reducer;