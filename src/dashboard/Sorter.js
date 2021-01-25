import { Button, Menu, MenuItem, withStyles } from '@material-ui/core';
import React, {useState, useEffect, useRef} from 'react'

export const Sorter = ({ openSorter, setOpenSorter, handleSorting, handleSelected, selected}) => {

  const firstRender = useRef(true)
  useEffect(()=>{
    if(selected && !firstRender.current){
      handleSorting(selected)
    }
    firstRender.current = false
  },[selected])

  const StyledMenuItem = withStyles({
    root: {
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  })(MenuItem);


  return (
    <div>
      <Menu
        id="simple-menu"
        anchorEl={openSorter}
        keepMounted
        open={Boolean(openSorter)}
        onClose={() => { setOpenSorter(null) }}
        disableScrollLock={true}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <StyledMenuItem>Sort By:</StyledMenuItem>
        <MenuItem onClick={() => { handleSelected("alphabetical") }}
        className={selected === "alphabetical" ? "menu-item--selected": null}
        >Alphabetical</MenuItem>
        <MenuItem onClick={() => { handleSelected("Relevance") }}
        className={selected === "Relevance" ? "menu-item--selected": null}
        >Relevance</MenuItem>
        <MenuItem onClick={() => { handleSelected("change") }}
        className={selected === "change" ? "menu-item--selected": null}
        >Change %</MenuItem>
      </Menu>
    </div>
  );
}

