import React from "react";
import QuickStats from "./QuickStats";
import ParticipationChart from "./ParticipationChart";

const AnalyticsSection = () => {
  return (
    <>
      <div className="p-6 bg-white shadow rounded">
        <QuickStats />
      </div>
      <div className="p-6 bg-white shadow rounded">
        <ParticipationChart />
      </div>
    </>
  );
};

export default AnalyticsSection;
