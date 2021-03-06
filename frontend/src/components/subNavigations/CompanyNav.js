import { AppBar, Button, Chip, makeStyles, Tab, Tabs } from '@material-ui/core';
import React, { forwardRef, useEffect, useState } from 'react'
import { Transition } from 'react-transition-group';
import { useMesure } from '../../utils/useMesure';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import { useDataLayer } from '../../Context';
import { useUILayer } from '../../ContextUI';
import { useHistory, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { useUserLayer } from '../../UserContext';
import { CurrentPriceRP } from '../../portfolio/CurrentPriceRP';
import { StockShop } from '../../portfolio/StockShop2';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  appBarCompany: {
    flexDirection: "row",
    alignItems: "center",
    transition: theme.transitions.create(["top", "transform"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    transform: "translateX(0px)",
  },
  appBarCompanyShift: {
    transform: `translateX(${drawerWidth}px)`
  },
  tab: {
    marginLeft: "60px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0px"
    }
  },
  white: {
    borderColor: "white"
  },
  tabItem: {
    fontSize: "12px",
    [theme.breakpoints.up("sm")]: {
      minWidth: "auto",
    },
    [theme.breakpoints.up("md")]: {
      minWidth: "120px",
      fontSize: "0.88rem",
    },
    [theme.breakpoints.up("lg")]: {
      minWidth: "160px"
    },
  },
  scrollButtons: {
    width: "30px",
    [theme.breakpoints.up("sm")]:{
      display: "none"
    }
  }
}));

export const CompanyNav = ({ menuCompaniesOpen, topNavigation }) => {

  const { state: { currentCompany, following }, dispatch } = useDataLayer()
  const { sidebarOpen, setMountApproval } = useUILayer()
  const { userState: { info } } = useUserLayer()
  const { height } = useMesure(topNavigation)
  const history = useHistory()
  const [tabValue, setTabValue] = useState(0);

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  console.log(currentCompany, following, "muuuuwwww")

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

  const handleChange = (e, val) => {
    setTabValue(val)
  }
  const classes = useStyles();

  const navigate = (url) => {
    history.push(`${url}/${currentCompany.ticker}`)
  }

  const handleFollow = () => {
    fetch(`${process.env.REACT_APP_API}/api/v1/interests/interests?email=${info.email}&interest=${currentCompany.ticker}`)
      .then(res => res.json())
      .then(interest => {
        if (typeof interest === "string") {
          interest = [interest]
        }
        dispatch({ type: "STORE_USER_INTEREST", payload: interest })
      })
      .catch(err => { console.log(err.message, "can't update interest") })
  }

  const [isFollowing, setIsFollowing] = useState(false)
  useEffect(() => {
    if (!following.length) {
      setIsFollowing(false)
      return
    }
    //hay que tener en cuenta si esta logeao o no
    const _isFollowing = following.find(tag => tag === currentCompany.ticker)
    setIsFollowing(!!_isFollowing)

  }, [following])
  return (
    <Transition
      in={menuCompaniesOpen}
      timeout={300}
      // mountOnEnter
      // unmountOnExit
      onExited={() => { setMountApproval(true) }}
    >
      {animationState => (
        <AppBar
          className={clsx(classes.appBarCompany, {
            [classes.appBarCompanyShift]: sidebarOpen
          })}
          style={menu2transitions[animationState]}
        >
          <Tabs value={tabValue} onChange={handleChange} aria-label="simple tabs example"
            classes={{ root: classes.tab, scrollButtons: classes.scrollButtons }}
            variant="scrollable"
            scrollButtons="on"
            //scroll auto not working as expected
            
          >
            <Tab label="Overview" {...a11yProps(0)} onClick={() => { navigate("/companies/overview") }} classes={{ root: classes.tabItem }} />
            <Tab label="Financials" {...a11yProps(1)} onClick={() => { navigate("/companies/financials") }} classes={{ root: classes.tabItem }} />
            <Tab label="Key metrics" {...a11yProps(2)} onClick={() => { navigate("/companies/keymetrics") }} classes={{ root: classes.tabItem }} />
            <Tab label="News" {...a11yProps(2)} onClick={() => { history.push(`/news`) }} classes={{ root: classes.tabItem }} />
          </Tabs>
          {/* <FollowingControl {...{ handleFollow, isFollowing }} /> */}
          {/* <Chip label="not owned" size="small" variant="outlined" style={{ color: "white" }}
            classes={{
              outlined: classes.white
            }}
          /> */}
        </AppBar>
      )}
    </Transition>
  )
}

const FollowingControl = ({ handleFollow, isFollowing }) => {
  return isFollowing ?
    <Button
      startIcon={<LibraryAddCheckIcon />}
      onClick={handleFollow}
    >
      Following
    </Button>
    :
    <Button
      startIcon={<BookmarksIcon />}
      onClick={handleFollow}
    >Follow</Button>

}