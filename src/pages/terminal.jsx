import React, { useContext, useEffect, useState } from "react";
import Terminal, { ColorMode, LineType } from "react-terminal-ui";
import ConnectionContext from "../components/connectionContext";
import PageContainer from "../components/pageContainer";
import "../styles/terminal.css";
import emitter from "../tools/emitter";
import GETURL from "../tools/geturl";

export default function TerminalPage() {
  const [sentMessages, setSentMessages] = useState([]);
  let context = useContext(ConnectionContext);

  useEffect(() => {
    emitter.on("terminal.receive", receiveMessageHandler);
    return () => {
      emitter.removeListener("terminal.receive", receiveMessageHandler);
    };
  }, []);

  function receiveMessageHandler(content) {
    setSentMessages(sentMessages.filter((i) => i.id == content.id));
  }

  if (!context.terminalData) {
    return null;
  }
  let lineData = [];

  context.terminalData.forEach((i) => {
    i.data.split("\n").forEach((line) => {
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
    context.user.permissions["admin"] == true ||
    context.user.permissions["terminal.send"] === true;

  if (context.state != "Connected") {
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
      "auth-" + (localStorage.getItem("auth") || sessionStorage.getItem("auth"))
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
        let id = json.messageId;
        if (
          context.terminalData.filter((message) => message.id == id).length > 0
        ) {
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
