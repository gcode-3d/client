import React from "react";

import TemperatureChart from "../components/temperatureChart";

import PageContainer from "../components/pageContainer";
export default function IndexPage() {
  return (
    <PageContainer page="home">
      <div className="container">
        <div className="columns">
          <div className="column is-half" style={{ height: "250px" }}>
            <TemperatureChart />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
