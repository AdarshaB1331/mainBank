import { createSlice } from "@reduxjs/toolkit";

const initialState: boolean = false;

const modeSlice = createSlice({
  name: "mode",
  initialState,
  reducers: {
    toggleMode: (state) => !state,
    resetMode: () => false, // Resets mode to light mode (false)
  },
});

export const modeActions = modeSlice.actions;
export default modeSlice;
