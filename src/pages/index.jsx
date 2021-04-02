import React from "react";

import TemperatureChart from "../components/temperatureChart";

import PageContainer from "../components/pageContainer";
import PrintStatusWidget from "../components/printStatus";
export default function IndexPage() {
  return (
    <PageContainer page="home">
      <div className="container">
        <div className="columns">
          <div className="column is-half" style={{ height: "450px" }}>
            <TemperatureChart />
          </div>
          <div className="column is-half">
            <PrintStatusWidget />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
