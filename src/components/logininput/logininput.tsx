import React from "react";
import styles from "./logininput.module.css";

export default function LoginInput({
	title,
	isSecure = false,
	disabled = false,
	value = "",
	setValue,
}: {
	title: string;
	disabled?: boolean;
	isSecure?: boolean;
	value: string;
	setValue: (newValue: string) => void;
}) {
	return (
		<div className={styles.outer}>
			<label className={styles.label}>{title}</label>
			<input
				value={value}
				onInput={(e) => setValue(e.currentTarget.value)}
				className={styles.input}
				placeholder={title.toLowerCase()}
				disabled={disabled}
				autoComplete={"off"}
				type={isSecure ? "password" : "text"}
			/>
		</div>
	);
}

export function CheckBox({
	disabled,
	checked,
	setChecked,
}: {
	disabled?: boolean;
	checked: boolean;
	setChecked: (newValue: boolean) => void;
}) {
	return (
		<div className={styles.checkbox_outer}>
			<input
				type="checkbox"
				className={styles.checkbox}
				disabled={disabled}
				checked={checked}
				onChange={(e) => setChecked(e.currentTarget.checked)}
			/>
			<label>Remember me</label>
		</div>
	);
}
