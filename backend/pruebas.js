const convertHumanToUnix = (date) => {
    const actualDate = date.split("-")
    const formatedDate = new Date(
        actualDate[0],
        actualDate[1],
        actualDate[2]
    );
    return formatedDate.getTime();
}

const milisencondsInADay = 24 * 60 * 60 * 1000

const getTotalDaysElapsed = (initialTime) => {
    const d = new Date(Date.now())
    const date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    const todayUnix00 = convertHumanToUnix(date)
    const totalMilisecons = todayUnix00 - initialTime
    return totalMilisecons / milisencondsInADay
}

console.log(getTotalDaysElapsed(convertHumanToUnix("2019-11-27")))

