module.exports = {
  convertUnixToHuman: (unix) => {
    const d = new Date(unix);
    const handleDoubleDigit = (num, isMonth = false) => {
      // solve retard javascript month index starting at 0
      if (isMonth) {
        if (num === 11) {
          return (num + 1).toString();
        }
        num++;
      }
      return num.toString().length === 1
        ? `0${num.toString()}`
        : num.toString();
    };
    const monthNum = handleDoubleDigit(d.getMonth(), true);
    const dayNum = handleDoubleDigit(d.getDate());

    return `${d.getFullYear()}-${monthNum}-${dayNum}`;
  },
  convertHumanToUnixInit: (date) => {
    const actualDate = date.split("-");
    const mongol = parseInt(actualDate[1]) - 1;
    const formatedDate = new Date(
      actualDate[0],
      mongol.toString(),
      actualDate[2],
    );
    return formatedDate.getTime();
  },
  unitaryCostMean: (posesions, amount, unitaryCost) => (posesions.unitaryCost * posesions.amount)
        / (posesions.amount + amount)
        + (unitaryCost * amount)
        / (posesions.amount + amount),
};
