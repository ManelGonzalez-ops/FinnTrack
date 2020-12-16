export const convertHumanToUnix = (date) => {
    const actualDate = date.split("-")
    const formatedDate = new Date(
        actualDate[0],
        actualDate[1],
        actualDate[2]
    );
    return formatedDate.getTime();
}

export const convertUnixToHuman = (unix) => {
    const d = new Date(unix)
    const handleDoubleDigit = (num) => {
        return num.toString().length === 1 ?
            `0${num.toString()}`
            :
            num
    }
    const monthNum = handleDoubleDigit(d.getMonth())
    const dayNum = handleDoubleDigit(d.getDate())
    return d.getFullYear() + '-' + monthNum + '-' + dayNum
}