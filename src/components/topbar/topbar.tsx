import React from "react";
import styles from "./topbar.module.css";
import { useAppSelector } from "../../redux/hooks";
import Tag from "../tag/tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TopBar() {
	const username = useAppSelector((state) => state.user.info?.name);
	let userTag = null;
	if (username !== undefined) {
		userTag = <Tag icon="test" text={username} marginRight={200} />;
	}
	return (
		<div className={styles.topbar}>
			<div className={styles.icon}>
				<FontAwesomeIcon icon="duck" className={styles.inner_icon} />
			</div>
			{userTag}
		</div>
	);
}
