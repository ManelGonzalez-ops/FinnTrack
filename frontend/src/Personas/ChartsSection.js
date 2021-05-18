import React, { useRef } from 'react';
import { PortfolioChartPeople } from './PortfolioChartPeople';
import { useCompaniesChangePersona } from './useCompaniesChangePersona';
import { PositionsPersonas } from "./charts/PositionsPersonas";
import { PerformanceStructurePeople } from './charts/PerformanceStructurePeople';
import { PerformanceStructureBPersonas } from './charts/PerformanceStructureBPersonas';
import { AssetStructurePeople } from './charts/AssetStructurePeople';
import { OperationList } from './OperationList';

export const ChartsSection = ({ data }) => {
  console.log(data, "datonata");
  const chart1Wrapper = useRef(null)
  const {
    prices, currentStocks, possesionsSeries, companiesImpact, readyOperations,
  } = data;
  const { companiesChange } = useCompaniesChangePersona(
    {
      generatedSeries: possesionsSeries,
      portfolioHistory: prices,
      currentPossesions: currentStocks,
    },
  );

  return (
    <>
      <main className="dasboard-grid--desktop">
        <div className="principal">
          <div ref={chart1Wrapper}>
            <PortfolioChartPeople datos={data?.portfolio} title={`${data?.user.username} Portfolio`}
              ref={chart1Wrapper}
            />
          </div>
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
  );
};
