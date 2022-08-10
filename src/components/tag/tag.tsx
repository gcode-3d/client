import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "./tag.module.css";

export default function Tag({
	icon,
	text,
	marginRight,
}: {
	icon: string;
	text: string;
	marginRight: number;
}) {
	return (
		<div
			className={styles.tag}
			style={{ marginRight: marginRight || undefined }}
		>
			<div className={styles.icon}>
				<FontAwesomeIcon icon="user" />
			</div>
			<span className={styles.content} title={text}>
				{text}
			</span>
		</div>
	);
}
