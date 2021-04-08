import React from "react";

import TemperatureChart from "../components/temperatureChart";

import PageContainer from "../components/pageContainer";
import StateWidget from "../components/stateWidget";
export default function IndexPage() {
  return (
    <PageContainer page="home">
      <div className="container">
        <div className="columns is-multiline ">
          <div className="column is-full" style={{ height: "300px" }}>
            <StateWidget />
          </div>
          <div className="column is-half" style={{ height: "400px" }}>
            <TemperatureChart />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
