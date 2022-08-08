import { createSlice } from "@reduxjs/toolkit";
import { fetchUserData } from "../../api/auth";

const slice = createSlice({
	name: "user",
	initialState: {
		authenticated: false,
		info: undefined,
	},
	reducers: {
		loginSuccess(state, action) {
			state.authenticated = true;
			state.info = action.payload.info;
			localStorage.setItem("token", action.payload.token);
		},
		logoutSuccess(state, action) {
			state.authenticated = false;
			state.info = undefined;
			localStorage.removeItem("token");
		},
	},
});
export default slice.reducer;

const { loginSuccess } = slice.actions;

export const validateToken = (token: string) => {
	fetchUserData(token)
		.then((userInfo) => {
			loginSuccess(userInfo);
		})
		.catch((e) => {
			localStorage.removeItem("token");
			console.error(e);
		});
};
