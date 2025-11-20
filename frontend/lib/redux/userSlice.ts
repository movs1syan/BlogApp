import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { data: null, loading: true },
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    logoutUser: (state) => {
      state.data = null;
      state.loading = false;
    }
  }
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;