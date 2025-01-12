// store/cartSlice.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface User {
  createdAt: string;
  email: string;
  isActive: boolean;
  name: string;
  role: string;
  updatedAt: string;
  _id: string;
  profilePic: string;
  password: string;
  __v: number;
}
type UserState = User | null;
const storeUserSlice = createSlice({
  name: "user",
  initialState: null as UserState,
  reducers: {
    setUserArray: (state, action: PayloadAction<User>) => {
      return action.payload;
    },
    onLogOut: () => {
      return null;
    },
  },
});

export const userActions = storeUserSlice.actions;
export default storeUserSlice;
