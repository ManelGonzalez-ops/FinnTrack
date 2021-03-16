import React from 'react'
import { PortfolioChartPeople } from './PortfolioChartPeople'
import { useCompaniesChangePersona } from './useCompaniesChangePersona'
import { PositionsPersonas } from "./charts/PositionsPersonas"
import { PerformanceStructurePeople } from './charts/PerformanceStructurePeople'
import { PerformanceStructureBPersonas } from './charts/PerformanceStructureBPersonas'
import { AssetStructurePeople } from './charts/AssetStructurePeople'
import { OperationList } from './OperationList'
export const ChartsSection = ({ data }) => {
    console.log(data, "datonata")
    const { prices, currentStocks, possesionsSeries, companiesImpact, readyOperations } = data
    const { companiesChange } = useCompaniesChangePersona(
        {
            generatedSeries: possesionsSeries,
            portfolioHistory: prices,
            currentPossesions: currentStocks
        })

    return (
        <>
            <main class="dasboard-grid--desktop">
                <div className="principal">
                    <PortfolioChartPeople datos={data?.portfolio} title={`${data?.user.username} Portfolio`} />
                    <PerformanceStructurePeople {...{ companiesChange }} />
                    <PerformanceStructureBPersonas {...{ companiesImpact }} />
                </div>
                <div className="secondary">
                    <PositionsPersonas {...{ companiesChange }}
                        currentPossesions={currentStocks}
                    />
                    <AssetStructurePeople
                        portfolioHistory={prices}
                        currentPossesions={currentStocks}
                    />
                </div>
            </main>
            <OperationList operations={readyOperations} />
        </>
    )
}
