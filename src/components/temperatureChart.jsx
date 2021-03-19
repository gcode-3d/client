import React, { useContext, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { DateTime } from "luxon";
import ConnectionContext from "./connectionContext";
export default function TemperatureChart(props) {
  const connectionContext = useContext(ConnectionContext);
  if (!["Connected", "Printing"].includes(connectionContext.state)) {
    return (
      <div>
        <h1 className="title">Connect your printer</h1>
        <h1 className="subtitle">
          Your printer needs to be connected to use the temperature chart
        </h1>
      </div>
    );
  }

  if (
    connectionContext.stateDescription == null ||
    connectionContext.stateDescription.tempData == null ||
    connectionContext.stateDescription.tempData.length == 0
  ) {
    return (
      <div>
        <h1 className="title">Loading temperature graph</h1>
        <h1 className="subtitle">
          Waiting on some datapoints, check if your printer auto-reports
          temperature
        </h1>
      </div>
    );
  }

  let temps = transFormTemperatureData(
    connectionContext.stateDescription.tempData
  );

  let lines = getLines(connectionContext.stateDescription.tempData[0]);

  return (
    <ResponsiveContainer height="100%" width="100%">
      <LineChart
        data={temps}
        margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
      >
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip
          contentStyle={{ backgroundColor: "#373737", border: "none" }}
        />
        <Legend />
        {lines}
      </LineChart>
    </ResponsiveContainer>
  );

  function getLines(data) {
    let lines = [];
    if (!data) {
      return lines;
    }

    if (data.tools.length == 1) {
      lines.push(
        <Line
          type="monotone"
          dot={false}
          dataKey={"Extruder (current)"}
          key="Extruder (current)"
          stroke={"#ff0000"}
        />
      );
      lines.push(
        <Line
          type="monotone"
          dot={false}
          dataKey={"Extruder (target)"}
          key="Extruder (target)"
          stroke={"#ff6666"}
        />
      );
    } else {
      for (var i = 0; i < data.tools.length; i++) {
        lines.push(
          <Line
            type="monotone"
            dot={false}
            dataKey={"Extruder [" + (i + 1) + "] (current)"}
            key={"Extruder [" + (i + 1) + "] (current)"}
            stroke={"#ff0000"}
          />
        );
        lines.push(
          <Line
            type="monotone"
            dot={false}
            dataKey={"Extruder [" + (i + 1) + "] (target)"}
            key={"Extruder [" + (i + 1) + "] (target)"}
            stroke={"#ff6666"}
          />
        );
      }
    }
    if (data.chamber != null) {
      lines.push(
        <Line
          type="monotone"
          dot={false}
          dataKey={"Chamber (target)"}
          key={"Chamber (target)"}
          stroke={"#4ca64c"}
        />
      );
      lines.push(
        <Line
          type="monotone"
          dot={false}
          dataKey={"Chamber (current)"}
          key={"Chamber (current)"}
          stroke={"#008000"}
        />
      );
    }
    if (data.bed != null) {
      lines.push(
        <Line
          type="monotone"
          dot={false}
          dataKey={"Bed (current)"}
          key={"Bed (current)"}
          stroke={"#0000ff"}
        />
      );
      lines.push(
        <Line
          type="monotone"
          dot={false}
          dataKey={"Bed (target)"}
          key={"Bed (target)"}
          stroke={"#4c4cff"}
        />
      );
    }
    return lines;
  }

  function transFormTemperatureData(temperatureArray) {
    if (temperatureArray.length == 0) {
      return temperatureArray;
    }

    let data = temperatureArray[0];

    return temperatureArray.map((temperatureData) => {
      let temperatureObject = {
        time: DateTime.fromMillis(temperatureData.time).toLocaleString(
          DateTime.TIME_24_WITH_SECONDS
        ),
      };

      if (temperatureData.tools.length == 1) {
        temperatureObject["Extruder (current)"] =
          temperatureData.tools[0].currentTemp;
        temperatureObject["Extruder (target)"] =
          temperatureData.tools[0].targetTemp;
      } else {
        for (var i = 0; i < data.tools.length; i++) {
          temperatureObject["Extruder [" + (i + 1) + "] (current)"] =
            temperatureData.tools[i].currentTemp;
          temperatureObject["Extruder [" + (i + 1) + "] (target)"] =
            temperatureData.tools[i].targetTemp;
        }
      }

      if (temperatureData.chamber !== null) {
        temperatureObject["Chamber (current)"] =
          temperatureData.chamber.currentTemp;
        temperatureObject["Chamber (target)"] =
          temperatureData.chamber.targetTemp;
      }

      if (temperatureData.bed !== null) {
        temperatureObject["Bed (current)"] = temperatureData.bed.currentTemp;
        temperatureObject["Bed (target)"] = temperatureData.bed.targetTemp;
      }

      return temperatureObject;
    });
  }
}
