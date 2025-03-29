import React, { useEffect } from "react";
import * as echarts from "echarts";

const ParticipationChart = () => {
  useEffect(() => {
    const chartDom = document.getElementById("participationChart");
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        animation: false,
        title: {
          text: "Event Participation Trends",
          textStyle: {
            fontSize: 14,
            fontWeight: "normal",
          },
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Participants",
            type: "line",
            smooth: true,
            data: [320, 450, 380, 580, 490, 600],
            itemStyle: {
              color: "#2563eb",
            },
          },
        ],
      };
      myChart.setOption(option);
    }
  }, []);

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Participation Trends</h2>
      <div id="participationChart" style={{ height: "300px" }}></div>
    </>
  );
};

export default ParticipationChart;
