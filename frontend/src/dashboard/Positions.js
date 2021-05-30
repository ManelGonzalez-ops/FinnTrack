/* eslint-disable import/no-anonymous-default-export */
import React, {
  useEffect, useReducer, useRef, useState,
} from 'react';
import SearchIcon from '@material-ui/icons/Search';
import {
  Divider, IconButton, Paper, TextField,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import { formatter } from '../utils/numFormatter';
import { useDataLayer } from '../Context';
import { Sorter } from './Sorter';
import { SearcherPositions } from './SearcherPositions';
import { CustomCircularProgress } from '../components/components/CustomCircularProgress';
import { Skeleton } from '@material-ui/lab';

const logoReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
      };
    case 'SET_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'SET_SUCCESS':
      return {
        ...state,
        loading: false,
        logos: action.payload,
        successLogo: true,
      };
    default:
      return state;
  }
};
export default () => {
  const { state } = useDataLayer();
  const { companiesChange } = state;
  const [readyState, setReadyState] = useState('');
  const [loading, setLoading] = useState(false);
  const [{ quotes }, setQuotes] = useState({ quotes: '' });
  const defaultData = useRef(null);
  const [{ logos, error, successLogo }, dispatch] = useReducer(logoReducer, {
    logos: [], loading: false, error: null, successLogo: false,
  });
  const [openSearcher, setOpenSearcher] = useState(false);
  const [openSorter, setOpenSorter] = useState(null);
  useEffect(() => {
    // init requests
    if (state.currentPossesions.stocks.length > 0) {
      console.log('axactua');
      requestAdditionalInfo(state.currentPossesions.stocks);
      const tickars = state.currentPossesions.stocks.map((item) => item.ticker);
      fetchQuotes(tickars);
    }
  }, [state.currentPossesions]);

  const getCompanyChange = (ticker) => {
    if (!companiesChange) {
      return 0;
    }
    const compChangeArr = companiesChange[ticker];
    if (compChangeArr.length) {
      return compChangeArr[compChangeArr.length - 1][1];
    }
    return 0;
  };
  useEffect(() => {
    console.log(successLogo, quotes, 'quee coja');

    if (successLogo && quotes) {
      const stocks = [...state.currentPossesions.stocks];
      const stocksWithLogos = stocks.map((asset) => {
        asset.change = getCompanyChange(asset.ticker);
        const theStockLogo = logos.find((stock) => asset.ticker.toUpperCase() === stock.ticker.toUpperCase());
        const { logourl, weburl } = theStockLogo;
        // if logo is missing will come as empty string


        asset.name = theStockLogo.company_name;
        if (asset.assetType === "peopleFund") {
          console.log(state.portfolioHistoryByCompany, state.areHistoricPricesReady, asset.ticker, "ka coñu")
          const fundPrices = state.portfolioHistoryByCompany[asset.ticker]
          console.log(fundPrices, "odsoidjwo")

          const lastPrice = fundPrices.length ? fundPrices[fundPrices.length - 1][1]
            :
            asset.unitaryCost

          asset.value = lastPrice * asset.amount
        }
        if (asset.assetType === "stock") {
          asset.logo = logourl || `https://logo.clearbit.com/${weburl}?size=50`;
          const theStockQuote = quotes.find((stock) => asset.ticker.toUpperCase() === stock.ticker.toUpperCase());
          asset.value = theStockQuote.priceInfo.close * asset.amount;
        }

        return asset;
      });
      defaultData.current = stocksWithLogos;
      setReadyState(stocksWithLogos);
      setLoading(false);
    }
  }, [successLogo,
    quotes,
    companiesChange]);

  const [selected, setSelected] = useState('');

  const sortState = (field) => {
    switch (field) {
      case 'alphabetical':
        setReadyState((prev) => prev.sort((a, b) => a - b));
        return;
      case 'Relevance':
        setReadyState((prev) => prev.sort((a, b) => a.value - b.value));
        return;
      case 'change':
        setReadyState((prev) => prev.sort((a, b) => a.change - b.change));
        break;
      default:
    }
  };
  const handleSelected = (what) => {
    if (selected === what) {
      setSelected('');
      setOpenSorter(null);
      return;
    }
    setSelected(what);
  };
  const handleSorting = (what) => {
    sortState(what);
    setOpenSorter(null);
  };


  const requestAdditionalInfo = (stocks) => {
    setLoading(true);
    dispatch({ type: 'SET_LOADING' });
    fetch(`${process.env.REACT_APP_API}/api/v1/recurringTasks/companiesInfo/companies_url`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ positions: stocks }),
    })
      .then((res) => res.json())
      .then((res) => { dispatch({ type: 'SET_SUCCESS', payload: res }); })
      .catch((err) => { dispatch({ type: 'SET_ERROR', payload: err.message }); });
  };

  const fetchQuotes = (tickers) => {
    fetch(`${process.env.REACT_APP_API}/api/v1/recurringTasks/companiesInfo/quotes`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ tickers }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res, 'ruuus');
        setQuotes((prev) => ({ ...prev, quotes: res[0] }));
      });
  };
  const [query, setQuery] = useState('');
  useEffect(() => {
    if (readyState) {
      const updatedList = defaultData.current.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) || item.ticker.toLowerCase().includes(query.toLowerCase()));
      setReadyState(updatedList);
    }
  }, [query]);
  const handleOpenSearcher = () => {
    setOpenSorter(null);
    setOpenSearcher(true);
  };
  const handleOpenSorter = (e) => {
    setOpenSearcher(false);
    setOpenSorter(e.currentTarget);
  };
  return (
    <Paper className="positions">
      {loading
        ? <Skeleton height="100%" variant="rect" animation="wave"/>
        : <>
          <header>
            <h3>My Assets</h3>
            <div className="header-actions">
              {openSearcher
                && <SearcherPositions {...{ query, setQuery }} />}
              {openSorter
                && <Sorter {...{
                  openSorter, setOpenSorter, setReadyState, handleSorting, handleSelected, selected,
                }} />}
              <IconButton
                onClick={handleOpenSearcher}
              >
                <SearchIcon />
              </IconButton>
              <IconButton
                onClick={handleOpenSorter}
              >
                <SortByAlphaIcon />
              </IconButton>
            </div>
          </header>
          {/* <ul>
                {logos.map(item => <li>
                    {item.logo}
                </li>)}
            </ul> */}
          <div className="positions-body">
            <ul>
              {readyState && readyState.map((asset) =>
                <StockItem {...{ asset }} />
              )}
            </ul>
          </div>
        </>}
    </Paper>
  );
};

const StockItem = ({ asset }) => {
  return (
    <li
      key={asset.ticker}
    >
      <Divider style={{ backgroundColor: 'white' }} />
      {asset.assetType === "stock" ? <img className="logo" src={asset.logo} alt={`${asset.ticker}-logo`} />
        :
        <ImageFund
          fundId={asset.fundId}
        />
      }
      <div className="additional-wrap">
        <p className="field-2">
          <h5>{asset.ticker} ({asset.name})</h5>
          <p>Qty: {asset.amount}</p>
        </p>
        <p className="field-3">
          <p>{formatter.format(asset.value)}</p>
          <p>{asset.change}%</p>
        </p>
      </div>
    </li>

  )
}

const ImageFund = ({ fundId }) => {
  const [imageUrl, setImageUrl] = useState(null)
  useEffect(() => {
    const getImageUrl = async (fundid) => {
      const reqe = await fetch(`${process.env.REACT_APP_API}/api/v1/people/image/${fundid}`)
      const kaka = await reqe.json()
      console.log("hooola gay")
      console.log(kaka, "funndi")
      return kaka
    }
    if (fundId) {
      getImageUrl(fundId)
        .then(image => {
          console.log(image, "wiejoiwh")
          if (image) {
            setImageUrl(image)
          }
        })
        .catch(err => {
          throw err
        })
    }
  }, [])

  return imageUrl && <img
    className="logo"
    src={`${process.env.REACT_APP_API}/` + imageUrl}
  />
}