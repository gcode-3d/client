import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { fetchUserData, loginWithUsernamePasswordAPI } from "../../api/auth";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { actions } from "../../redux/slices/user";
import LoginInput, { CheckBox } from "../logininput/logininput";
import styles from "./loginbox.module.css";

export default function LoginBox() {
	const user = useAppSelector((state) => state.user);
	const isLoading = user.authState === "AUTHENTICATING";
	const dispatch = useAppDispatch();
	const [isChecked, setChecked] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const text = isLoading ? (
		<FontAwesomeIcon icon="spinner-third" spin={true} size="lg" />
	) : (
		<>Log in</>
	);
	const notification = (
		<div className={styles.notification}>
			<b>Error:</b>
			{user.error}
		</div>
	);

	return (
		<div className={styles.container}>
			{user.authState === "AUTH_FAILURE" && notification}
			<div className={styles.outerBox}>
				<h1 className={styles.title}>Login</h1>
				<div className={styles.divider}></div>
				<div className={styles.innerBox}>
					<LoginInput
						title="Username"
						disabled={isLoading}
						value={username}
						setValue={setUsername}
					/>
					<LoginInput
						title="Password"
						isSecure={true}
						disabled={isLoading}
						value={password}
						setValue={setPassword}
					/>

					<CheckBox
						disabled={isLoading}
						checked={isChecked}
						setChecked={setChecked}
					/>

					<button
						onClick={() => submit(username, password, isChecked)}
						disabled={isLoading}
						className={`${styles.button} ${
							isLoading ? styles.active : ""
						}`}
					>
						{text}
					</button>
				</div>
			</div>
		</div>
	);
	function submit(username: string, password: string, remember: boolean) {
		dispatch(actions.loginPending());
		const time = new Date().getTime();
		loginWithUsernamePasswordAPI(username, password, remember)
			.then((token) => {
				fetchUserData(token)
					.then((userData) => {
						if (new Date().getTime() - time < 500) {
							setTimeout(() => {
								dispatch(
									actions.loginSuccess({
										info: userData,
										token,
									})
								);
							}, 500 - (new Date().getTime() - time));
						} else {
							dispatch(
								actions.loginSuccess({
									info: userData,
									token,
								})
							);
						}
					})
					.catch((e) => {
						console.error(e);
						if (new Date().getTime() - time < 500) {
							setTimeout(() => {
								dispatch(
									actions.loginFailure(
										typeof e === "string" ? e : e.toString()
									)
								);
							}, 500 - (new Date().getTime() - time));
						} else {
							dispatch(
								actions.loginFailure(
									typeof e === "string" ? e : e.toString()
								)
							);
						}
					});
			})
			.catch((e) => {
				console.error(e);
				if (new Date().getTime() - time < 500) {
					setTimeout(() => {
						dispatch(
							actions.loginFailure(
								typeof e === "string" ? e : e.toString()
							)
						);
					}, 500 - (new Date().getTime() - time));
				} else {
					dispatch(
						actions.loginFailure(
							typeof e === "string" ? e : e.toString()
						)
					);
				}
			});
	}
}
