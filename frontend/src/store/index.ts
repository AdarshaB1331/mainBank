import { configureStore } from "@reduxjs/toolkit";
import storeUserSlice from "./userSlice.js";
import modeSlice from "./dark_light_mode.js";

const userStore = configureStore({
  reducer: {
    user: storeUserSlice.reducer,
    mode: modeSlice.reducer,
  },
});
export type RootState = ReturnType<typeof userStore.getState>;
export type AppDispatch = typeof userStore.dispatch;
export default userStore;
