import moment from "moment";
import React from "react";
import { Brush, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const timeFormatter = timeStr => moment(timeStr).format('D MMM YY');

const CustomTooltip = active => (
  <div className = "customTooltip">
    {active?.payload && <>
      <p>
        {timeFormatter(active?.payload[0]?.payload.x)} 
      </p>
      <p>
        {active?.payload[0]?.payload.y.toFixed(2)}
      </p>
    </>
    }
  </div>
);

const dateToIndex = (dates, findDate) => {
  let closestValue = Math.abs(dates[0].x-findDate);
  let closestIndex = 0;
  for (let i = 0; i < dates.length; i++) {
    let diff = Math.abs(dates[i].x-findDate);
    if (diff < closestValue) {
      closestIndex = i;
      closestValue = diff;
    }
  }
  return closestIndex
}

const StockGraphView = props => {
  const [start, setStart] = React.useState(0);
  const setNewStart = (val, unit) => setStart(dateToIndex(props.historicalData, moment(new Date()).subtract(val, unit).toDate()))
  return (
    <div id="graph">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart key={start} data={props.historicalData}>
        <CartesianGrid stroke="#2A2C4A" ></CartesianGrid>
          <Line type="monotone" dataKey="y" stroke="#6CCC57" dot={false}></Line>
          <XAxis stroke = "#6D80BE" tickFormatter={timeFormatter} dataKey="x" tick={{fontSize: 11}}> </XAxis>
          <YAxis stroke = "#6D80BE" tick={{fontSize: 11}}></YAxis>
          <Tooltip cursor={false} wrapperStyle={{width: 100, color: "#6D80BE"}} content={CustomTooltip}></Tooltip>
          {/*BUGG HÄR, OM MAN TRYCKER PÅ SAMMA TIDSPERIOD IGEN EFTER MAN HAR RÖRT BRUSHEN SÅ UPPDATERAS INTE BRUSH */}
          <Brush height={30} stroke="#6D80BE" startIndex={start} tickFormatter={timeStr => ""} dataKey="x" tick={{fontSize: 11}}></Brush>
        </LineChart>
      </ResponsiveContainer>
      <div className="controls">
        <button onClick={() => setNewStart(1, "week")}>1W</button>
        <button onClick={() => setNewStart(1, "month")}>1M</button>
        <button onClick={() => setNewStart(6, "month")}>6M</button>
        <button onClick={() => setNewStart(1, "year")}>1Y</button>
        <button onClick={() => setNewStart(3, "year")}>3Y</button>
        <button onClick={() => setNewStart(10, "year")}>MAX</button>
      </div>
    </div>
  )
}

export default StockGraphView