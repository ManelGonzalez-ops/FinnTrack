const fetch = require("node-fetch")
const fs = require("fs")

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
  if(returnkey){
    return {[search]: data}
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
  const arre = splitArr(arr)
  let loopnum= 0
  for (let arri of arre) {
    console.log(loopnum)
    loopnum++
    // eslint-disable-next-line no-loop-func
    await new Promise(resolve => {
      setTimeout(async () => {
        const result = await Promise.all(arri.map(index => (
          fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${index.symbol}?apikey=651d720ba0c42b094186aa9906e307b4`)
            .then(prices =>( prices.json()))
            .then(res=>({symbol: res.symbol, prices: res.historical}))
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

const splitArr = (arr) => {
  const max_paralel_requests = 5
  //we can't loop throug decimal number
  const numCalls = Math.floor(arr.length / max_paralel_requests)
  const sobrantes = arr.length - numCalls * 5
  let arrCall = []
  let count = 0
  console.log(numCalls, "ka coll")
  Array.from(Array(numCalls).keys()).forEach(() => {
    arrCall = [...arrCall, arr.slice(count, count + 5)]
    count += 5
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


// .then(res => res.json())
// .then(res=>{console.log(res, "puta")})
// .catch(err=>{console.log(err.message)})
// .then(res => {
//   fs.writeFile("koko.json", JSON.stringify(res), (err) => {
//     if (err) throw (err)
//     fs.readFile("koko.json", (err, data) => {
//       if (err) throw (err)
//       return data
//     })
//   })
// })

module.exports = { fetcharS, fetcharP, fetcharN, fetcharH, fetcharM, fetchQuoteConstituents, fetchAllIndexesPrices, fetchAvailableIndexes }