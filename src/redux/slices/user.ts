import { createSlice } from "@reduxjs/toolkit";

const initialState: {
	authState: "AUTHENTICATED" | "NONE" | "AUTHENTICATING" | "AUTH_FAILURE";
	error?: string | undefined;
	token?: string;
	info: any | undefined;
} = {
	authState: "NONE",
	info: undefined,
	error: undefined,
};

const slice = createSlice({
	name: "user",
	initialState,
	reducers: {
		loginSuccess(state, action) {
			state.authState = "AUTHENTICATED";
			state.info = action.payload.info;
			state.token = action.payload.token;
			localStorage.setItem("token", action.payload.token);
		},
		loginPending(state) {
			state.authState = "AUTHENTICATING";
		},
		loginFailure(state, action) {
			state.authState = "AUTH_FAILURE";
			if (action.payload !== undefined) {
				state.error = action.payload;
			}
		},
		logoutSuccess: () => {
			localStorage.removeItem("token");
			return initialState;
		},
	},
});

export default slice.reducer;
export const actions = slice.actions;
