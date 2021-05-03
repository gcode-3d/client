import React, { useEffect, useState } from "react";
import PageContainer from "../components/pageContainer";
import SettingRow from "../components/settings/settingRow";
import GETURL from "../tools/geturl";
import "../styles/settings.scss";
let settingInfo = {
  D_selectedDevice: {
    name: "Selected device",
    description: "The printer currently used for printing.",
    example: "Device name",
  },
  B_startOnBoot: {
    name: "Connect on boot",
    description: "Automatically connect to selected device on startup.",
  },
  N_adjustCorrectionF: {
    name: "CorrectionFactor",
    description:
      "Used to estimate time remaining. Recommended value between -1 and 1.",
    example: "Recommended value between -1 and 1.",
  },
  B_savePrinterNotifications: {
    name: "Save printer notifications",
    description: "Store printer messages in your notifications panel.",
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
    "auth-" + (localStorage.getItem("auth") || sessionStorage.getItem("auth"))
  );

  var requestOptions = {
    method: "GET",
    headers: headers,
  };
  return new Promise((resolve, reject) => {
    fetch(GETURL() + "/api/settings/", requestOptions)
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
