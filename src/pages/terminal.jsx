import React, { useContext, useState } from "react";
import Terminal, { ColorMode, LineType } from "react-terminal-ui";
import ConnectionContext from "../components/connectionContext";
import PageContainer from "../components/pageContainer";
import emitter from "../tools/emitter";
import "../styles/terminal.css";

export default function TerminalPage() {
  const [terminalLineData, setTerminalLineData] = useState([
    { type: LineType.Output, value: "Welcome to the React Terminal UI Demo!" },
    { type: LineType.Input, value: "Some previous input received" },
  ]);
  let context = useContext(ConnectionContext);

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
    </PageContainer>
  );
}

function handleTerminalInput(input) {
  emitter.emit("client.terminal.send", input);
}
