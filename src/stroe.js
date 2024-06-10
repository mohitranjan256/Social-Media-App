import { createSlice, configureStore } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isadmin: false },
  reducers: {
    login(state) {
      state.isadmin = true;
    },
    logout(state) {
      state.isadmin = false;
    },
  },
});

export const authActions = authSlice.actions;

export const store = configureStore({ reducer: authSlice.reducer });