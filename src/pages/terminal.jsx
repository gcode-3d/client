import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Terminal, { ColorMode, LineType } from "react-terminal-ui";
import PageContainer from "../components/pageContainer";
import "../styles/terminal.css";
import GETURL from "../tools/geturl";

export default function TerminalPage() {
  const [sentMessages, setSentMessages] = useState([]);
  const terminalData = useSelector((state) => state.terminal);
  const user = useSelector((state) => state.user);
  const printerInfo = useSelector((state) => state.printer);

  useEffect(() => {
    receiveMessageHandler();
  }, [terminalData]);

  function receiveMessageHandler() {
    setSentMessages(
      sentMessages.filter((message) => {
        return !terminalData.map((i) => i.id).includes(message.id);
      })
    );
  }
  let lineData = [];

  terminalData.forEach((i) => {
    i.message.split("\n").forEach((line) => {
      lineData.push({
        value:
          i.amount > 1 ? (
            <>
              {line}
              <span className="amount">[{i.amount}]</span>
            </>
          ) : (
            line
          ),
        type: i.type == "OUTPUT" ? LineType.Output : LineType.Input,
      });
    });
  });

  let hasPermissionToSend =
    user.permissions["admin"] == true ||
    user.permissions["terminal.send"] === true;

  if (printerInfo.state != "Connected") {
    hasPermissionToSend = false;
  }
  let sentMessageBlock = null;
  if (sentMessages.length > 0) {
    sentMessageBlock = (
      <>
        <h1>Sent messages waiting on confirmation:</h1>
        <ul>
          {sentMessages.map((i) => {
            return (
              <li key={i.id} title={i.id}>
                {i.message}
              </li>
            );
          })}
        </ul>
      </>
    );
  }

  return (
    <PageContainer page="terminal">
      <div className="container has-text-left">
        <Terminal
          name={"Terminal [" + lineData.length + " lines loaded]"}
          colorMode={ColorMode.Dark}
          lineData={lineData}
          onInput={hasPermissionToSend ? handleTerminalInput : undefined}
        />
      </div>
      {sentMessageBlock}
    </PageContainer>
  );

  function handleTerminalInput(input) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      localStorage.getItem("auth") || sessionStorage.getItem("auth")
    );
    headers.append("Content-Type", "application/json");

    let json = JSON.stringify({
      message: input,
    });

    var requestOptions = {
      method: "POST",
      headers: headers,
      body: json,
    };

    fetch(GETURL() + "/api/terminal", requestOptions)
      .then(async (response) => {
        if (!response.ok && response.status == 500) {
          return console.error("Received status 500 for terminal send");
        }
        let json = await response.json();
        if (!response.ok) {
          return console.error(json.message);
        }
        let id = json.id;
        if (terminalData.filter((message) => message.id == id).length > 0) {
          return;
        }
        setSentMessages([
          ...sentMessages,
          {
            id,
            message: input,
          },
        ]);
      })
      .catch((error) => console.error(error));
  }
}
