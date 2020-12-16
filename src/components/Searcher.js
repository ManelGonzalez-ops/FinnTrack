import { Button, Chip, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";

import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useDataLayer } from "../Context";


export const Searcher = ({ setSelection }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const [{ data, loading, error }, setRequest] = useState({
    data: [],
    loading: false,
    error: "",
  });

  const { state, dispatch } = useDataLayer()
  const fetchar = async (query) => {
    try {
      setRequest((prev) => ({ ...prev, loading: true }));
      const rawData = await fetch(`http://localhost:8001/search/${query}`);
      const { data } = await rawData.json();
      const dataOnlyStocks = data.filter(item => item.assetType === "Stock")
      setRequest((prev) => ({ ...prev, data: dataOnlyStocks, loading: false }));
    } catch (err) {
      setRequest((prev) => ({
        ...prev,
        loading: false,
        error: err.message,
      }));
    }
  };

  const handleSearch = () => {
    if (query) {
      fetchar(query);
    }
  };

  const handleAutocomplete = (e) => {
    console.log(e.key, "va o que");
    // if (query && e.key === " ")
    if (query) fetchar(query.slice(0, query.length - 1));
  };

  const handleSelection = (value, reason) => {
    if (reason === "select-option") {
      console.log(value, "valueeee")
      setSelection(value);
    }
  };

  return (
    <>
      <div className="search-section">
        {loading && <p>cargando...</p>}
        {data && data.map((item) => <p>{item.name}</p>)}
        {error && <p>{error}</p>}
        {/* <Chip
        size="medium"
        label={<h3>Search for company</h3>}
    style={{marginBottom: "0.5rem"}}
      /> */}
      <h2>Search company data</h2>
        <Autocomplete
          id="asynchronous-demo"
          style={{ width: 300 }}
          open={true}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          noOptionsText
          // getOptionSelected={(option, value) => {
          //   console.log(value.name, option.name, "hooolabeeeeeeee");
          //   return (value.name = option.name);
          // }}
          getOptionLabel={(option) => option.name}
          options={data}
          loading={loading}
          filterOptions={(options) => query && options}
          onChange={(e, value, reason) => {
            handleSelection(value, reason);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Asynchronous"
              variant="outlined"
              onKeyUp={handleAutocomplete}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              value={query}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </div>
      {/* {selection && JSON.stringify(selection, null, 2)} */}

    </>
  );
};
