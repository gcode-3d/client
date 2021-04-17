import React from "react";
import {
  faChartLineDown,
  faChartLine,
  faHourglassEnd,
  faPercent,
  faThermometerHalf,
} from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Duration } from "luxon";
export default function printStatusWidget(props) {
  let printTime = (
    <div>
      <h5 className="is-size-5">
        <span className="icon-text">
          <span className="icon">
            <FontAwesomeIcon icon={faHourglassEnd} />
          </span>
          Calculating time remaining..
        </span>
      </h5>
    </div>
  );
  if (!isNaN(props.printTime)) {
    printTime = (
      <div>
        <h5 className="is-size-5">
          <span className="icon-text">
            <span className="icon">
              <FontAwesomeIcon icon={faHourglassEnd} />
            </span>
            {
              Duration.fromMillis(
                props.startTime.getTime() +
                  props.printTime -
                  new Date().getTime()
              )
                .toISOTime({
                  suppressMilliseconds: true,
                  suppressSeconds: true,
                })
                .split(".")[0]
            }{" "}
            remaining
          </span>
        </h5>
      </div>
    );
  }

  return (
    <div className="printStatusWidget has-text-left">
      <h1 className="title">Print status</h1>
      <div className="spacedList">
        {printTime}
        <div>
          <h5 className="is-size-5">
            <span className="icon-text">
              <span className="icon">
                <FontAwesomeIcon
                  icon={faPercent}
                  className={"fa-swap-opacity"}
                />
              </span>
              {props.progress}% completed
            </span>
          </h5>
        </div>
        <div>
          <h5 className="is-size-5">
            <span className="icon-text">
              <span className="icon">
                <FontAwesomeIcon icon={faThermometerHalf} />
              </span>
              {getTemperatureLabels(props.tempInfo)}
            </span>
          </h5>
        </div>
      </div>
    </div>
  );
}

function getTemperatureLabels(temps) {
  if (!temps) {
    return "No temperatures reported";
  }
  let bed = null;
  let chamber = null;

  let tools = temps.tools.map((tool, index) => {
    return (
      <div key={"T_" + index} className="temperatureTag">
        <span
          className="tag"
          style={{ backgroundColor: "#B94C4C", color: "white" }}
        >
          E{tool.name ? tool.name : temps.tools.length == 1 ? null : index}
        </span>
        {tool.currentTemp.toFixed(2)}º
        {tool.targetTemp != 0 && (
          <span className="icon-text">
            <span className="icon">
              <FontAwesomeIcon
                icon={
                  tool.targetTemp >= tool.currentTemp
                    ? faChartLine
                    : faChartLineDown
                }
              />
            </span>
            {tool.targetTemp.toFixed(2)}º
          </span>
        )}
      </div>
    );
  });

  if (temps.bed) {
    bed = (
      <div key="bed" className="temperatureTag">
        <span
          className="tag"
          style={{ backgroundColor: "#424CEE", color: "white" }}
        >
          B
        </span>
        {temps.bed.currentTemp.toFixed(2)}º
        {temps.bed.targetTemp != 0 && (
          <div className="icon-text">
            <span className="icon">
              <FontAwesomeIcon
                icon={
                  temps.bed.targetTemp >= temps.bed.currentTemp
                    ? faChartLine
                    : faChartLineDown
                }
              />
            </span>
            {temps.bed.targetTemp.toFixed(2)}º
          </div>
        )}
      </div>
    );
  }
  if (temps.chamber) {
    chamber = (
      <div key="chamber" className="temperatureTag">
        <span
          className="tag"
          style={{ backgroundColor: "#00935E", color: "white" }}
        >
          C
        </span>
        {temps.chamber.currentTemp.toFixed(2)}º
        {temps.chamber.targetTemp != 0 && (
          <span className="icon-text">
            <span className="icon">
              <FontAwesomeIcon
                icon={
                  temps.chamber.targetTemp >= temps.chamber.currentTemp
                    ? faChartLine
                    : faChartLineDown
                }
              />
            </span>
            {temps.chamber.targetTemp.toFixed(2)}º
          </span>
        )}
      </div>
    );
  }

  return <div className="temperatureTags">{[...tools, bed, chamber]}</div>;
}
