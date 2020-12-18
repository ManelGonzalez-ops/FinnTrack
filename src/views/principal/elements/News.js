import React, { useEffect, useState } from 'react'
import { useFetch } from '../../../utils/useFetch'
import { useFetchWithCors } from '../../../utils/useFetchWithCors'
import { useParams } from "react-router-dom"
import { GridComposition, NewsItem, NewsItemOver } from '../../../components/NewsItem'
import { useViewport } from '../../../utils/useViewport'
import { CompassCalibrationOutlined } from '@material-ui/icons'



export const News = ({ principal = false, title, classnames }) => {
    // const {data, loading, error} = useFetchWithCors("http://localhost:8001/news", "news", true)
    const { category } = useParams()
    const options = { explicitUrl: true }
    const { datos, loading, error } = useFetch(`https://finnhub.io/api/v1/news?category=${category}&token=btm6dp748v6ud360stcg`, category, "news", options)
    const [datosGrid, setDatosGrid] = useState("")
    const [newsPerPage, setNewsPerPage] = useState(4)
    const { viewport } = useViewport()
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



    useEffect(() => {
        const handleScrollBottom = () => {
            if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
                setNewsPerPage(prev => prev + 4)
            }
        }
        document.addEventListener("scroll", handleScrollBottom)
        return () => {
            document.removeEventListener("scroll", handleScrollBottom)
        }
    }, [])

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

                            { datosGrid && datosGrid.slice(1, newsPerPage).map(item => <GridComposition chunk={item} />)}
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
        </div>
    )
}

News.defaultProps = {
    title: ()=>null
}