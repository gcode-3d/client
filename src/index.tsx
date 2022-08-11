import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import { store } from "./redux/store";
import LoginPage from "./pages/login";
import "./icons";
import { fetchUserData } from "./api/auth";
import { actions } from "./redux/slices/user";
import App from "./App";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
);

if (localStorage.getItem("token")) {
	store.dispatch(actions.loginPending());
	fetchUserData(localStorage.getItem("token")!)
		.then((data) => {
			store.dispatch(
				actions.loginSuccess({
					info: data,
					token: localStorage.getItem("token"),
				})
			);
		})
		.catch((e) => {
			console.error(e);
			store.dispatch(actions.logoutSuccess());
		});
}
