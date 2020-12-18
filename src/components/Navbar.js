import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import { Tab, Tabs } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom"
import { useDataLayer } from "../Context";
import { useUILayer } from "../ContextUI";
import { useParams } from "react-router-dom";
import { useMesure } from "../utils/useMesure";
import { Transition } from "react-transition-group";
import { formatter } from "../utils/numFormatter";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  menuButton: {
    marginRight: 36,
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: 'none',
  },
  appBarCompany: {
    transition: theme.transitions.create(["top", "transform"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    transform: "translateX(0px)"
  },
  appBarCompanyShift: {
    transform: `translateX(${drawerWidth}px)`
  },
  tab: {
    marginLeft: "60px",

  }

}));

export const Navbar = ({ handleDrawerOpen }) => {

  const [tabValue, setTabValue] = React.useState(0);
  const topNavigation = useRef(null)
  const history = useHistory()
  const { state } = useDataLayer()
  const { sidebarOpen } = useUILayer()
  const location = useLocation()
  const [menuCompaniesOpen, setMenuCompaniesOpen] = useState(false)

  useEffect(() => {
    if (location.pathname !== "/") {
      const masterRoute = location.pathname.split("/").filter(item => item !== "")
      console.log(masterRoute[0], "first pathname query")
      if (masterRoute[0] === "companies") {
        setMenuCompaniesOpen(true)
      }
      else {
        setMenuCompaniesOpen(false)
      }
    }
    
  }, [location])

  // console.log(location, "location")
  const { height } = useMesure(topNavigation)

  const classes = useStyles({ height });
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (e, val) => {
    setTabValue(val)
  }

  const menu2transitions = {
    entering: {
      top: `${height}px`,
    },
    entered: {
      top: `${height}px`,
    },
    exiting: {
      top: "0px",
    },
    exited: {
      top: "0px"
    }
  }

  return (
    <div>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: sidebarOpen,
        })}
        ref={topNavigation}
      >
        <Toolbar>
          <IconButton

            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: sidebarOpen,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {state.currentCompany.name}
          </Typography>
          <Button
          onClick={()=>{history.push("/portfolio")}}
          variant="contained"
          >
            request ticker history
          </Button>
          <div
          style={{marginLeft: "auto"}}
          >
            <Button
            onClick={()=>{history.push("/portfoliof")}}
            variant="contained"
            >
              Investment Dashboard
            </Button>
            <Typography>
            {formatter.format(state.currentPossesions.userCash)} $
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
      <Transition
        in={menuCompaniesOpen}
      >
        {animationState => (
          <AppBar
            className={clsx(classes.appBarCompany, {
              [classes.appBarCompanyShift]: sidebarOpen
            })}
            style={menu2transitions[animationState]}
          >
            <Tabs value={tabValue} onChange={handleChange} aria-label="simple tabs example"
              classes={{ root: classes.tab }}
            >
              <Tab label="Overview" {...a11yProps(0)} onClick={() => { history.push(`/companies/overview/${state.currentCompany.ticker}`) }} />
              <Tab label="Financials" {...a11yProps(1)} onClick={() => { history.push(`/companies/financials/${state.currentCompany.ticker}`) }} />
              <Tab label="Key metrics" {...a11yProps(2)} onClick={() => { history.push(`/companies/keymetrics/${state.currentCompany.ticker}`) }} />
              <Tab label="News" {...a11yProps(2)} onClick={() => { history.push(`/news/${state.currentCompany.ticker}`) }} />
            </Tabs>
          </AppBar>
        )}
      </Transition>
    </div>
  );
};

