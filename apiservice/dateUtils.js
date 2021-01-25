module.exports = {
    convertUnixToHuman: (unix) => {
        const d = new Date(unix)
        console.log(unix, d.getFullYear(), "yiaaar")
        const handleDoubleDigit = (num, isMonth = false) => {
            //solve retard javascript month index starting at 0
            if (isMonth) {
                if (num === 11) {
                    return (num + 1).toString()
                }
                num++
            }
            return num.toString().length === 1 ?
                `0${num.toString()}`
                :
                num.toString()
        }
        console.log(d.getMonth(), "putisima")
        const monthNum = handleDoubleDigit(d.getMonth(), true)
        console.log(monthNum, "monthNumm")
        const dayNum = handleDoubleDigit(d.getDate())

        return d.getFullYear() + '-' + (monthNum) + '-' + dayNum
    },
    convertHumanToUnixInit: (date) => {
        const actualDate = date.split("-")
        const mongol = parseInt(actualDate[1]) - 1
        const formatedDate = new Date(
            actualDate[0],
            mongol.toString(),
            actualDate[2]
        );
        return formatedDate.getTime();
    }
}