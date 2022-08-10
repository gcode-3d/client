import React from "react";
import styles from "./topbar.module.css";
import { useAppSelector } from "../../redux/hooks";
import Tag from "../tag/tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TopBar() {
	const user = useAppSelector((state) => state.user.info);
	let userTag = null;
	// if (user != undefined) {
	// 	userTag = <Tag icon="test" text={user!.} />;
	// }
	userTag = <Tag icon="test" text="Tobias=-test" marginRight={200} />;
	return (
		<div className={styles.topbar}>
			<div className={styles.icon}>
				<FontAwesomeIcon icon="duck" className={styles.inner_icon} />
			</div>
			{userTag}
		</div>
	);
}
