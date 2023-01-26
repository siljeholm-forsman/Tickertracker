const numberFormatter = (num, digits=2, int=false) => {
  // eslint-disable-next-line
  num = new Number(num);
  if (num === Infinity) {
    return "∞"
  }
  let suffixes = ["", "k", "M", "B", "T"];
  let numZeros = Math.floor(Math.log10(Math.abs(num)) / 3);
  numZeros = numZeros > 4 ? 4 : numZeros;
  let retnum;

  if (num < 1 || numZeros === 0) {
    retnum = int ? Math.round(num) : num.toFixed(digits);
  } else {
    retnum = (num / Math.pow(10, 3*numZeros)).toFixed(digits) + suffixes[numZeros];
  }
  // eslint-disable-next-line
  return new String(retnum);
}

export default numberFormatter;