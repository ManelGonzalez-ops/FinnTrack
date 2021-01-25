import React from 'react'

export const Marcador = () => {
    return (
        <div className="marcador1-wrap">
          {[...Array(2).keys()].map(_=>(
            <div className="marcador">
                <header>
                    <select>
                        <option>EUR</option>
                        <option>Dollar</option>
                    </select>
                </header>
                <div className="marcador-item--body">
                    <h1>199.999 EUR</h1>
                    <p>1EUR=1.14071USD</p>
                </div>
            </div>
          ))}

        </div>
    )
}
