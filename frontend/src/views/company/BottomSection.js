import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { Linechart } from "../../charts/linechart";
import { StackedColumn } from "../../charts/StackedColumn";
import { useDataLayer } from "../../Context";
import { DetailsSquare } from "./DetailsSquare";
import { PeersSquare } from "./PeersSquare";

export const BottomSection = ({ ticker }) => {


  return (
    <>
      <>
        <Paper
          className="detail1"
        >
          <StackedColumn
          ticker={ticker}
          />
        </Paper>
        <div
          className="detail3"
        >
          <PeersSquare
            ticker={ticker}
          />
        </div>
      </>


    </>
  );
};
