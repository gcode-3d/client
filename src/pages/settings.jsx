import React, { useEffect, useState } from "react";
import PageContainer from "../components/pageContainer";
import SettingRow from "../components/settingRow";
import GETURL from "../tools/geturl";
import "../styles/settings.scss";
let settingInfo = {
  S_devicePath: {
    name: "Printer path",
    description: "The serial port path used for connecting to your printer.",
    example: "/dev/ttyUSB0",
  },
  N_deviceBaud: {
    name: "Printer Baudrate",
    description:
      "The serial baud rate used for connecting to your printer. 0 is automatic",
    example: "250000",
  },
  B_startOnBoot: {
    name: "Connect on boot",
    description: "Automatically connect to selected printer on startup.",
  },
  N_adjustCorrectionF: {
    name: "CorrectionFactor",
    description:
      "Used to estimate time remaining. Recommended value between -1 and 1.",
    example: "Between -1 and 1.",
  },
  B_savePrinterNotifications: {
    name: "Save printer notifications",
    description: "Store printer messages in your notifications panel.",
  },
  N_deviceWidth: {
    name: "Printer build area (width)(mm)",
    description:
      "Set the build area width for your printer in mm.\nThese numbers are used to control your printer",
  },
  N_deviceHeight: {
    name: "Printer build area (height)(mm)",
    description:
      "Set the build area height for your printer in mm.\nThese numbers are used to control your printer",
  },
  N_deviceDepth: {
    name: "Printer build area (depth)(mm)",
    description:
      "Set the build area depth for your printer in mm.\nThese numbers are used to control your printer",
  },
  B_deviceHB: {
    name: "Printer has heated bed",
    description: "Enable this if your printer has installed a heated bed",
  },
  B_deviceHC: {
    name: "Printer has heated Chamber",
    description: "Enable this if your printer has installed a heated chamber",
  },
  N_clientTerminalAmount: {
    name: "Terminal amount",
    description:
      "How many messages should the page store in memory while opened?",
    example: "Around 400 recommended, more messages means more memory usage.",
  },
};

export default function SettingsPage() {
  const [loadedSettings, setLoadedSettings] = useState([]);

  useEffect(() => {
    let isMounted = true;
    fetchSettings().then((result) => {
      if (!isMounted) {
        return;
      }
      setLoadedSettings(result);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loadedSettings.length == 0) {
    return (
      <PageContainer page="settings">
        <div className="container has-text-left">
          <h1 className="title">Settings</h1>
          {Object.entries(settingInfo).map((i) => (
            <SettingRow
              key={i[0] + "-loading"}
              _name={"Loading"}
              name={i[1].name}
              example={i[1].example}
              description={i[1].description}
              loading={true}
            />
          ))}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer page="settings">
      <div className="container has-text-left">
        <h1 className="title">Settings</h1>
        {loadedSettings.map((i) => (
          <SettingRow
            key={i._name}
            _name={i._name}
            name={i.name}
            example={i.example}
            description={i.description}
            value={i.value}
            onValueChange={(value) =>
              setLoadedSettings(
                loadedSettings.map((setting) => {
                  if (setting._name == i._name) {
                    setting.value = value;
                  }
                  return setting;
                })
              )
            }
          />
        ))}
      </div>
    </PageContainer>
  );
}

function fetchSettings() {
  var headers = new Headers();
  headers.append(
    "Authorization",
    localStorage.getItem("auth") || sessionStorage.getItem("auth")
  );

  var requestOptions = {
    method: "GET",
    headers: headers,
  };
  return new Promise((resolve, reject) => {
    fetch(GETURL() + "/api/settings", requestOptions)
      .then(async (response) => {
        if (!response.ok) {
          let text = await response.text();
          try {
            let json = JSON.parse(text);
            if (json.error) {
              return reject(json.message);
            }
            return reject(text);
          } catch {
            return reject(text);
          }
        }
        let json = await response.json();
        let settings = Object.entries(json).map((entry) => {
          return {
            name: settingInfo[entry[0]]
              ? settingInfo[entry[0]].name
              : "Unknown setting (" + entry[0] + ")",
            description: settingInfo[entry[0]]
              ? settingInfo[entry[0]].description
              : "Unknown setting (" + entry[0] + ")",
            _name: entry[0],
            value: entry[1],
            example: settingInfo[entry[0]] ? settingInfo[entry[0]].example : "",
          };
        });
        return resolve(settings);
      })
      .catch(reject);
  });
}
