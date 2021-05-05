import { faSpinnerThird } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/loading.scss";
import React from "react";

export default function IndexPage() {
  return (
    <div className="loading-outside-container">
      <div className="loading-inside-box">
        <FontAwesomeIcon icon={faSpinnerThird} spin={true} />
        <h1>Loading..</h1>
      </div>
    </div>
  );
}
