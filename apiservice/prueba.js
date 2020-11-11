const fetch = require("node-fetch")


const fetcharS = async(search)=>{
    
    const rawData = await fetch(`https://api.tiingo.com/tiingo/utilities/search/${search}?token=7ca717775ec5e7e407b361a789d639ce27dc8224`, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return await rawData.json()
  } 

const fetcharP = async(search)=>{
    
  const rawData = await fetch(`https://api.tiingo.com/tiingo/daily/${search}/prices?token=7ca717775ec5e7e407b361a789d639ce27dc8224`, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return await rawData.json()
} 

const fetcharM = async(search)=>{

    const rawData = await fetch(`https://api.tiingo.com/tiingo/daily/${search}?token=7ca717775ec5e7e407b361a789d639ce27dc8224`)
    return await rawData.json()
  
 
}

const fetcharN = async(search = null)=>{
  let url = "https://api.tiingo.com/tiingo/news"
  let token = "&token=7ca717775ec5e7e407b361a789d639ce27dc8224"
  if (search){
    url = url + "?tickers=" + search + token
  }
  else{
    url = url + "?" + token
  }
  const rawData = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return await rawData.json()
} 
const fetcharH = async(search, startDate, endDate)=>{
    
  const rawData = await fetch(`https://api.tiingo.com/tiingo/daily/${search}/prices?startDate=${startDate}&endDate=${endDate}&token=7ca717775ec5e7e407b361a789d639ce27dc8224`, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return await rawData.json()
} 


module.exports = {fetcharS, fetcharP, fetcharN, fetcharH, fetcharM}