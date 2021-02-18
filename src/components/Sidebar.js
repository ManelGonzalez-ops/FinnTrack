/* tslint:disable */

import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  makeStyles,
  Typography,
  useTheme,
} from "@material-ui/core";
import clsx from "clsx";
import React, { useEffect } from "react";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { TreeItem, TreeView } from "@material-ui/lab";
import { StyledTreeItem } from "./components/treeItem";
import DeleteIcon from '@material-ui/icons/Delete';
import Label from '@material-ui/icons/Label';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import InfoIcon from '@material-ui/icons/Info';
import ForumIcon from '@material-ui/icons/Forum';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import { useHistory } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import { useUILayer } from "../ContextUI";
import { useDataLayer } from "../Context";
import { useViewport } from "../utils/useViewport";

const drawerWidth = 240;


const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.down("sm")]:{
      width: 0
    },
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    height: "112px"
  },
  listItemText: {
    width: "100%",
    overflow: "hidden"
    //necesary to make textOverflow work
  },
  textSpan: {
    display: "block",
    whiteSpace: "nowrap",
    width: "100%",
    textOverflow: "ellipsis",
    overflow: "hidden"
  }
}));

//ad open if not works
export const Sidebar = ({ handleDrawerClose, handleDrawerOpen, expanded, handleSidebarToggle }) => {
  const history = useHistory()
  
  const theme = useTheme();
  const {viewport} = useViewport()
  const { sidebarOpen } = useUILayer()
  const { state } = useDataLayer()
  const classes = useStyles({viewport});

  const [selected, setSelected] = React.useState("");

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };


  return (
    <Drawer
    variant={viewport > 600 ? "permanent":"temporary"}
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: sidebarOpen,
        [classes.drawerClose]: !sidebarOpen,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: sidebarOpen,
          [classes.drawerClose]: !sidebarOpen,
        }),
      }}
      //this is for the movile version
      open={sidebarOpen}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
              <ChevronLeftIcon />
            )}
        </IconButton>
      </div>
      <Divider />
      <TreeView
        style={{ margin: "1rem 0" }}

        // defaultCollapseIcon={<ArrowDropDownIcon />}
        // defaultExpandIcon={<ArrowRightIcon />}
        defaultEndIcon={<div style={{ width: 24 }} />}
        expanded={expanded}
        selected={selected}
        onMouseEnter={handleDrawerOpen}
        onMouseLeave={handleDrawerClose}
        onNodeToggle={handleSidebarToggle}
        onNodeSelect={handleSelect}
      >
        <StyledTreeItem nodeId="13" labelText="Search" labelIcon={SearchIcon} isTitle
          ariaLabel="search"
          onLabelClick={() => { history.push("/") }}
        />
        <StyledTreeItem nodeId="14" labelText="People" labelIcon={SearchIcon} isTitle
          ariaLabel="People"
          onLabelClick={() => { history.push("/people") }}
        />
        <StyledTreeItem nodeId="1" labelText="Indexes" labelIcon={MailIcon} isTitle

        >
          <StyledTreeItem
            nodeId="2"
            labelText="S&P 500"
            labelIcon={SupervisorAccountIcon}
            labelInfo="90"
            color="#1a73e8"
            bgColor="#e8f0fe"
            onLabelClick={() => { history.push("/indexes/sp500") }}

          />
          <StyledTreeItem
            nodeId="3"
            labelText="NASDAQ"
            labelIcon={InfoIcon}
            labelInfo="2,294"
            color="#e3742f"
            bgColor="#fcefe3"
            onLabelClick={() => { history.push("/indexes/nasdaq") }}

          />
          <StyledTreeItem
            nodeId="4"
            labelText="Major INDEXES"
            labelIcon={ForumIcon}
            labelInfo="3,566"
            color="#a250f5"
            bgColor="#f3e8fd"
            onLabelClick={() => { history.push("/indexes/general") }}
          />
        </StyledTreeItem>

        {/* <StyledTreeItem nodeId="7" labelText="Sectors" labelIcon={DeleteIcon} isTitle /> */}
        <StyledTreeItem nodeId="8" labelText="News" labelIcon={Label} isTitle>
          <StyledTreeItem
            nodeId="9"
            labelText="General"
            labelIcon={SupervisorAccountIcon}
            labelInfo="90"
            color="#1a73e8"
            bgColor="#e8f0fe"
            onLabelClick={() => { history.push("/news/general") }}
          />
          <StyledTreeItem
            nodeId="10"
            labelText="Forex"
            labelIcon={InfoIcon}
            labelInfo="2,294"
            color="#e3742f"
            bgColor="#fcefe3"
            onLabelClick={() => { history.push("/news/forex") }}
          />
          <StyledTreeItem
            nodeId="11"
            labelText="Crypto"
            labelIcon={ForumIcon}
            labelInfo="3,566"
            color="#a250f5"
            bgColor="#f3e8fd"
            onLabelClick={() => { history.push("/news/crypto") }}
          />
          <StyledTreeItem
            nodeId="12"
            labelText="Merger"
            labelIcon={LocalOfferIcon}
            labelInfo="733"
            color="#3c8039"
            bgColor="#e6f4ea"
            onLabelClick={() => { history.push("/news/merger") }}
          />
        </StyledTreeItem>
        <StyledTreeItem nodeId="14" labelText="Covid-19" labelIcon={DeleteIcon}
          isTitle
          onClick={(e) => { history.push("/covid19") }}
        />
      </TreeView>
      <Divider />
      <List
      >

        {state.visitedCompanies.length > 0 && state.visitedCompanies.map((company, index) => (
          <ListItem button key={company.ticker}
          >
            {/* <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon> */}
            <ListItemIcon>
              <Typography>{company.ticker}</Typography>
            </ListItemIcon>

            <ListItemText
              primary={company.name}
              classes={{
                root: classes.listItemText,
                primary: classes.textSpan
              }}
            />
          </ListItem>

        ))}

      </List>
    </Drawer>
  );
};
