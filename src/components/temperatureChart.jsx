import React, { useEffect, useState } from "react";
import emitter from "../tools/emitter";
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
export default function TemperatureChart(props) {
  const [temps, setTemps] = useState({ tempArray: [] });
  useEffect(() => {
    let handler = (data) => {
      handleTempUpdate(temps, data);
    };
    emitter.on("server.temperature_update", handler);
    return () => {
      emitter.removeListener("server.temperature_update", handler);
    };
  }, [temps]);

  if (temps.tempArray.length == 0) {
    return (
      <div>
        <h1 className="title">Loading temperature graph</h1>
      </div>
    );
  }
  return (
    <ResponsiveContainer height="100%" width="100%">
      <LineChart
        data={temps.tempArray}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        {temps.lines}
      </LineChart>
    </ResponsiveContainer>
  );

  function handleTempUpdate(currentTemps, data) {
    let currentData = {
      time: DateTime.now().toLocaleString(DateTime.TIME_24_WITH_SECONDS),
    };
    let lines = [];
    if (data.tools.length == 1) {
      currentData["Extruder (current)"] = data.tools[0].currentTemp;
      currentData["Extruder (target)"] = data.tools[0].targetTemp;
      lines.push(
        <Line
          type="monotone"
          dot={false}
          dataKey={"Extruder (current)"}
          key="Extruder (current)"
          stroke={"#ff6666"}
        />
      );
      lines.push(
        <Line
          type="monotone"
          dot={false}
          dataKey={"Extruder (target)"}
          key="Extruder (target)"
          stroke={"#ff0000"}
        />
      );
    } else {
      for (var i = 0; i < data.tools.length; i++) {
        currentData["Extruder [" + (i + 1) + "] (current)"] =
          data.tools[i].currentTemp;
        currentData["Extruder [" + (i + 1) + "] (target)"] =
          data.tools[i].targetTemp;
        lines.push(
          <Line
            type="monotone"
            dot={false}
            dataKey={"Extruder [" + (i + 1) + "] (current)"}
            key={"Extruder [" + (i + 1) + "] (current)"}
            stroke={"#ff6666"}
          />
        );
        lines.push(
          <Line
            type="monotone"
            dot={false}
            dataKey={"Extruder [" + (i + 1) + "] (target)"}
            key={"Extruder [" + (i + 1) + "] (target)"}
            stroke={"#ff0000"}
          />
        );
      }
    }
    if (data.chamber != null) {
      currentData["Chamber (current)"] = data.chamber.currentTemp;
      currentData["Chamber (target)"] = data.chamber.targetTemp;

      lines.push(
        <Line
          type="monotone"
          dot={false}
          dataKey={"Chamber (target)"}
          key={"Chamber (target)"}
          stroke={"#008000"}
        />
      );
      lines.push(
        <Line
          type="monotone"
          dot={false}
          dataKey={"Chamber (current)"}
          key={"Chamber (current)"}
          stroke={"#4ca64c"}
        />
      );
    }
    if (data.bed != null) {
      currentData["Bed (current)"] = data.bed.currentTemp;
      currentData["Bed (target)"] = data.bed.targetTemp;

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
    console.log(currentTemps);
    let copy = { tempArray: [...currentTemps.tempArray], lines };
    if (copy.tempArray.length > 30) {
      copy.tempArray.shift();
    } else {
      for (var i = 0; i < 30; i++) {
        copy.tempArray.push(currentData);
      }
    }
    copy.tempArray.push(currentData);
    setTemps(copy);
  }
}
