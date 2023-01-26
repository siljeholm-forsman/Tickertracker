import React from "react";

const useStockList = (symbols, inpdata) => {
  const [data, setData] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState();

  React.useEffect(() => {
    setData(null);
    setLoading(true);
    let loads = [];
    let retdata = {};
    symbols.forEach(symbol => {
      if (inpdata && symbol in inpdata) {
        if (inpdata[symbol]?.error) {
          error = true;
          setError("Encountered an error. Please try again later.")
        } else if (inpdata[symbol].loading) {
          loads.push(true);
        } else if (inpdata[symbol].data) {
          loads.push(false);
          retdata[symbol] = inpdata[symbol].data;
        }
      } else {
        loads.push(true);
      }
    });

    if (!error) {
      let load = loads.includes(true);
      setLoading(load);
      if (!load) {
        setData(retdata);
      }
    }
  }, [symbols, inpdata])
  return [data, loading, error]
}
export default useStockList;