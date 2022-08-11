import React from "react";
import TopBar from "./components/topbar/topbar";
import LoginPage from "./pages/login";
import { useAppSelector } from "./redux/hooks";

export default function App() {
	const user = useAppSelector((state) => state.user);

	if (user.authState !== "AUTHENTICATED") {
		return <LoginPage />;
	}

	return (
		<>
			<TopBar />
			<p>logged in {user.info?.name}</p>
		</>
	);
}
