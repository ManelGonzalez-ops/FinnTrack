const fetch = require("node-fetch")
const fs = require("fs")
const { convertUnixToHuman } = require("./dataUtils")

const fetcharS = async (search) => {

  const rawData = await fetch(`https://api.tiingo.com/tiingo/utilities/search/${search}?token=7ca717775ec5e7e407b361a789d639ce27dc8224`, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return await rawData.json()
}

const fetcharP = async (search) => {

  const rawData = await fetch(`https://api.tiingo.com/tiingo/daily/${search}/prices?token=7ca717775ec5e7e407b361a789d639ce27dc8224`)
  return await rawData.json()
}

const fetcharM = async (search) => {
  console.log(search, "que cojones")
  const rawData = await fetch(`https://api.tiingo.com/tiingo/daily/${search}?token=7ca717775ec5e7e407b361a789d639ce27dc8224`)
  return await rawData.json()


}

const fetcharN = async (search = null) => {
  let url = "https://api.tiingo.com/tiingo/news"
  let token = "&token=7ca717775ec5e7e407b361a789d639ce27dc8224"
  if (search) {
    url = url + "?tickers=" + search + token
  }
  else {
    url = url + "?" + token
  }
  const rawData = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return await rawData.json()
}
const fetcharH = async (search, startDate, endDate, returnkey = false) => {
  console.log(search, startDate, endDate, "fechas")
  const rawData = await fetch(`https://api.tiingo.com/tiingo/daily/${search}/prices?startDate=${startDate}&endDate=${endDate}&token=7ca717775ec5e7e407b361a789d639ce27dc8224`, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const data = await rawData.json()
  if (returnkey) {
    return { [search]: data }
  }
  return data
}

const fetchQuoteConstituents = async (arr) => {
  console.log("feeeeeeeeeeeeeetching be careful")
  return await Promise.all(arr.map(ticker =>
    fetch(`https://api.tiingo.com/tiingo/daily/${ticker}/prices?token=7ca717775ec5e7e407b361a789d639ce27dc8224`)
      .then(res => res.json())
      .then(res => ({ ...res[0], ticker }))
      .catch(err => { console.log(err.message) })
  ))
}

// const fetchAllIndexesPrices = async (arr) => {
//   console.log(arr)
//   return await Promise.all(arr.map(index => (
//     fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${index.symbol}?apikey=651d720ba0c42b094186aa9906e307b4`)
//       .then(prices => prices.json())
//       .catch(err => { console.log(err) })
//   )))
// }
const fetchAllIndexesPrices = async (arr) => {
  console.log(arr)
  let allData = []
  const arre = splitArr(arr, 5)
  let loopnum = 0
  for (let arri of arre) {
    console.log(loopnum)
    loopnum++
    // eslint-disable-next-line no-loop-func
    await new Promise(resolve => {
      setTimeout(async () => {
        const result = await Promise.all(arri.map(index => (
          fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${index.symbol}?apikey=651d720ba0c42b094186aa9906e307b4`)
            .then(prices => (prices.json()))
            .then(res => ({ symbol: res.symbol, prices: res.historical }))
            .catch(err => { console.log(err) })
        )))
        allData = [...allData, result]
        resolve()
      }, 5000)
    })
  }
  fs.writeFileSync("indices.json", JSON.stringify(allData))
  return allData
}

const splitArr = (arr, max_paralel_requests) => {
  //we can't loop throug decimal number
  const numCalls = Math.floor(arr.length / max_paralel_requests)
  const sobrantes = arr.length - numCalls * max_paralel_requests
  let arrCall = []
  let count = 0
  console.log(numCalls, "ka coll")
  Array.from(Array(numCalls).keys()).forEach(() => {
    arrCall = [...arrCall, arr.slice(count, count + max_paralel_requests)]
    count += max_paralel_requests
  });
  //keep track of the restant parts we could loop
  console.log(arrCall, "paaaaataaaaaaaaa")
  arrCall = [...arrCall, arr.slice(count, sobrantes)]
  console.log(arrCall, "puuuuuuuuuuuuuuuuuuuuta")
  return arrCall
}

const fetchAvailableIndexes = async () => {
  const rawData = await fetch("https://financialmodelingprep.com/api/v3/symbol/available-indexes?apikey=651d720ba0c42b094186aa9906e307b4")
  return await rawData.json()
}

const fetchCompanyAdditional = async (ticker) => {
  console.log(ticker, "tiiickerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
  const request = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=btm6dp748v6ud360stcg`)
  console.log(request, "reeeqe")
  const response = await request.json()
  console.log(response, "riiiimiii")
  //avoid getting ticker from finnhub, because can be problematic
  return { response, ticker }

}

const fetchEmptyLogo = async (info) => {
  const { domain } = info
  const request = await fetch(`https://logo.clearbit.com/:${domain}`)
  return await request.json()
}

const fetchAllQuotes = async (arr) => {
  return new Promise(resolve => {
    ((async () => {
      console.log(arr)
      let allData = []
      const arre = splitArr(arr, 20)
      let loopnum = 0
      for (let arri of arre) {
        console.log(loopnum)
        loopnum++
        //here we make each iteration to last 1s
        // eslint-disable-next-line no-loop-func
        await new Promise(resolve => {
          setTimeout(async () => {
            const result = await Promise.all(arri.map(ticker => (
              fetch(`https://api.tiingo.com/tiingo/daily/${ticker}/prices?token=7ca717775ec5e7e407b361a789d639ce27dc8224`)
                .then(prices => (prices.json()))
                .then(res => ({ priceInfo: { ...res[0] }, ticker }))
                .catch(err => { console.log(err) })
            )))
            allData = [...allData, result]
            resolve()
          }, 1000)
        })

      }
      resolve(allData)
    }))()

  })
}

const fetchDispatcher = async (query) => {
  console.log(query, "que cojones")
  switch (query) {
    case "topactives":
      return await fetchMostActives()
    case "gainers_losers":
      const data = await fetchGainersLosers()
      const tickers = data.map(item => item.ticker)
      console.log(data, "datttona")
      const historicPrices = await fetchHistoricalFromDate(tickers, 10)
      const mergedData = data.map(item => {
        const prices = historicPrices.find(itam => itam[item.ticker] !== undefined && itam[item.ticker].length > 0)
        if(prices){
          //we have to refactor easily fectcharH to avoid the Object.keys 
          item.prices = prices[Object.keys(prices)[0]]
        }
        return item
      })
      .filter(item=>item.prices !== undefined)
      return mergedData 
    default:
      break
  }
}


const fetchMostActives = () => {
  return fetch("https://financialmodelingprep.com/api/v3/actives?apikey=651d720ba0c42b094186aa9906e307b4")
    .then(res => res.json())
    .catch(err => err)
}
const fetchGainersLosers = async () => {
  const promiseArr = ["gainers", "losers"].map(field => fetch(`https://financialmodelingprep.com/api/v3/${field}?apikey=651d720ba0c42b094186aa9906e307b4`)
    .then(res => res.json())
    .then(res => res.slice(1, 6))
  )
  return await Promise.all(promiseArr)
    //.then(res => res.map(resp=>resp.json()))
    //.then(res=>{console.log(res, "wuju")})
    //.then(res=>res.json())
    //we will take 5 gainers and 5 winner ()
    .then(res => {
      console.log(res, "que ostia pasa")
      return res
    })

    .then(res => Array.prototype.concat.apply([], res))
    .catch(err => err)
}

const fetchHistoricalFromDate = async (tickers, range) => {

  const miliseconsInADay = 60 * 60 * 24 * 1000
  let previousMilisecons = Date.now()
  const endDate = convertUnixToHuman(previousMilisecons)
  Array.from(Array(range).keys()).forEach((item) => {
    previousMilisecons -= miliseconsInADay
  })
  const startDate = convertUnixToHuman(previousMilisecons)
  console.log(startDate, endDate, "las fuuchas")
  const promiseArr = tickers.map(ticker => fetcharH(ticker, startDate, endDate, true)
    .catch(err => { console.log(err, "irrorrr") })
  )
  const allPrices = await Promise.all(promiseArr)
    .then(res => Array.prototype.concat.apply([], res))
    console.log(allPrices, "todos precios")
  return allPrices
}

module.exports = { fetcharS, fetcharP, fetcharN, fetcharH, fetcharM, fetchQuoteConstituents, fetchAllIndexesPrices, fetchAvailableIndexes, fetchCompanyAdditional, fetchAllQuotes, fetchEmptyLogo, fetchMostActives, fetchGainersLosers, fetchDispatcher }