
this.onmessage = e => {
    const companiesPrices = e.data

    //this.postMessage({ culo: e.data })
    let portfolioHistoryByDate = {}
    let portfolioHistoryByCompanies = {};
    Array.prototype.forEach.call(companiesPrices, company => {
        //we take the unique key which is the ticker
        console.log(company, "webos")
        const ticker = Object.keys(company)[0]
        if (company[ticker].length > 0) {
            console.log(company[ticker, "pooouto"])
            company[ticker].forEach(register => {
                const isDateFormated = register.date.split("").find(char => char === "T")
                let date = isDateFormated ?
                    register.date.split("T")[0]
                    :
                    register.date

                portfolioHistoryByDate[date] = {
                    ...portfolioHistoryByDate[date],
                    //aqui podriamos poner close high y todos
                    [ticker]: {
                        close: register.close
                    }
                }
            })
        }
    })
    companiesPrices.forEach(({ ...company }) => {
        const ticker = Object.keys(company)[0]
        console.log(ticker, "weba")
        const companyHistory = company[ticker].map(register => {
            const date = register.date.split("T")[0]
            return (
                [convertHumanToUnixInit(date),
                register["adjClose"],
                register["adjHigh"],
                register["adjLow"],
                register["adjOpen"]])
        })
        portfolioHistoryByCompanies[ticker] = companyHistory
    })

    this.postMessage({portfolioHistoryByDate, portfolioHistoryByCompanies})
}

const convertHumanToUnixInit = (date) => {
    const actualDate = date.split("-")
    const mongol = parseInt(actualDate[1]) - 1
    const formatedDate = new Date(
        actualDate[0],
        mongol.toString(),
        actualDate[2]
    );
    return formatedDate.getTime();
}