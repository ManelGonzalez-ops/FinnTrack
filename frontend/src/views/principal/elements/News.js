import React, { useEffect, useState, useRef } from 'react'
import { useFetch } from '../../../utils/useFetch'
import { useFetchWithCors } from '../../../utils/useFetchWithCors'
import { useParams } from "react-router-dom"
import { GridComposition, NewsItem, NewsItemOver } from '../../../components/NewsItem'
import { useViewport } from '../../../utils/useViewport'
import { CompassCalibrationOutlined } from '@material-ui/icons'
import { useIntersection } from 'react-use';


export const News = ({ principal = false, title, classnames }) => {
    // const {data, loading, error} = useFetchWithCors("http://localhost:8001/news", "news", true)
    const { category } = useParams()
    const options = { explicitUrl: true }
    const { datos, loading, error } = useFetch(`https://finnhub.io/api/v1/news?category=${category}&token=btm6dp748v6ud360stcg`, category, "news", options)

    const [datosGrid, setDatosGrid] = useState("")
    const [newsPerPage, setNewsPerPage] = useState(4)
    const debounce = useRef(false)
    const { viewport } = useViewport()

    const intersectionRef = React.useRef(null);
    const intersection = useIntersection(intersectionRef, {
        root: null,
        rootMargin: '0px',
        threshold: 1
    });

    const isLoadingImgs = useRef()
    const arrangeDatos = (data) => {
        let gridArr = []
        let initialNum = 0
        let finalNum = 3
        Array(Math.round(data.length / 3)).fill(0).forEach(() => {
            let chunk = data.slice(initialNum, finalNum)
            gridArr = [...gridArr, chunk]
            initialNum += 3
            finalNum += 3
            console.log(finalNum, "xii")
        })
        console.log(gridArr, "xwww")
        setDatosGrid(gridArr)
    }
    useEffect(() => {
        if (datos.length > 0) {
            arrangeDatos(datos)
        }
    }, [datos])

    const [showingSkeletong, setShowingSkeleton] = useState(false)
console.log(intersection, "intersec")
let debounceTimer
    useEffect(() => { 
        if (intersection && intersection.intersectionRatio < 1.5 && !debounce.current) {
            setNewsPerPage(prev => prev + 1)
            debounce.current = true
            debounceTimer = setTimeout(()=>{
                debounce.current = false
                clearTimeout(debounceTimer)
            }, 500)
        }

    }, [intersection])

    console.log(datos.length, "ojones")
    return (
        <div className={classnames}>
            {   datos.length > 0 && principal ?
                <>
                    {loading && <p>loading...</p>}
                    {error && <p>{error}</p>}


                    <> {viewport < 1000 ?
                        datos.map(item => <NewsItem item={item} />)
                        :
                        (<>

                            { datosGrid && datosGrid.slice(1, newsPerPage).map((item, index) =>
                                <GridComposition
                                    key={index}
                                    chunk={item}
                                    index={index}
                                />)}
                            {/* { datos && datos.slice(3, datos.length).map(item => <NewsItemOver item={item} />)} */}
                        </>)
                    }
                    </>

                </>
                :
                <>
                    {datos.length > 0 && datos.map(item => <NewsItem item={item} />)}
                </>
            }
            {datos.length && <div
                ref={intersectionRef}
                style={{ height: "20px" }}
            ></div>}
        </div>
    )
}

News.defaultProps = {
    title: () => null
}