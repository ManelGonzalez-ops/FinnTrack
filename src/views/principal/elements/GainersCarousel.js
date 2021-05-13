import React, { useEffect, useState, useRef } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { CustomAreaChart } from '../../../charts/CustomAreaChart';



const responsive = {
  0: { items: 1 },
  568: { items: 2 },
  1024: { items: 5 },
};


export const GainersCarousel = () => {
  const [data, setData] = useState("")
  const allData = useRef(null)
  useEffect(() => {
    const fechar = () => {
      fetch("http://localhost:8001/api/v1/recurringTasks/direct_json?field=gainers_losers")
        .then(res => res.json())
        .then(res => {
          console.log(res, "respaaa")
          const readyData =
            JSON.parse(res.alldata).map(item => {
              console.log(item, "itom")
              item.prices = item.prices.map(prices => prices.adjClose)
              return item
            })
          console.log(readyData, "respaaa2")
          setData(readyData.slice(1, 7))
        })
        .catch(err=>{console.log(err)})

      // //if there's error,won't show
      //.then(res => { console.log(res, "alldauta") })
      //.catch(err => { throw new Error(err) })
    }
    fechar()
  }, [])

  console.log(data, "la duuuura")
  const chartItems = data && data.map(item =>
    <div className="spacer">
      <div className="gl-wrapper">
        <div className="info">
          <h6>{item.companyName}</h6>
          <p>{item.changes}</p>
          <p>{item.price}</p>
        </div>
        <div className="chart">
          <CustomAreaChart ticker={item.ticker} datos={item.prices} />
        </div>
        </div>
      </div>
  )


  return (
    <>
      {data && <AliceCarousel
      animationDuration={800}
       // mouseTracking
        disableDotsControls
        infinite
        //responsive={responsive}
        items={chartItems}
        // onSlideChanged={() => { }}
        autoWidth
      />}
    </>
  )
}