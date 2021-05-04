// TODO: Rebrand page to connecting page

import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import BoxModal from "../components/boxModal";
import Emitter from "../tools/emitter";

export default function ConnectionError() {
  const [attempting, setAttempting] = useState(false);
  let interval;
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    []
  );

  const button = (
    <button
      className="button is-danger"
      onClick={() => {
        Emitter.emit("client.tryConnect");
        setAttempting(true);
        interval = setInterval(() => {
          setAttempting(false);
        }, 10000);
      }}
    >
      Retry
    </button>
  );
  const loadingButton = (
    <button className="button is-danger" disabled={true}>
      <FontAwesomeIcon spin={true} icon={faSpinnerThird} />
      Trying to connect
    </button>
  );
  return (
    <BoxModal header="The connection with the server has been lost">
      <p>The connection will be retried automatically every few seconds.</p>
      <p>To try to reconnect right now, click the button below:</p>
      {attempting ? loadingButton : button}
    </BoxModal>
  );
}
