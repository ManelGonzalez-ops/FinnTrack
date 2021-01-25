import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { Cell } from "../../components/Cell";
import { useParams } from "react-router-dom"
import { camelCasePipe } from "../../utils/Pipes";

const useStyles = makeStyles({

  root: {
    background: "white",
    borderRadius: "10px",
    width: "90%",
    margin: "0 auto"
  }
})

export const TableUI = ({ income }) => {
  const [readyData, setReadyData] = useState("");
  let anualdata = useRef({});



  useEffect(() => {
    if (income) {
      console.log(income, "error tabla")
      income.annualReports.forEach((item) => {
        anualdata.current = {
          ...anualdata.current,
          [item.fiscalDateEnding]: item,
        };
      });

      console.log(anualdata.current, "first step");
      let structuredData = {};
      //every year has the same fields, so we take first index as a template
      Object.keys(income.annualReports[0]).forEach((field) => {
        console.log(field, "campo");
        structuredData[field] = {};
        Object.keys(anualdata.current).forEach((year) => {
          structuredData[field][year] = anualdata.current[year][field];
          console.log(anualdata.current[year]);
        });
      });
      setReadyData(structuredData);
    }
  }, [income]);

  useEffect(() => {
    console.log(readyData, "ready");
  }, [readyData]);
  //we need to loop each field, which is an object with the  values of 5 different years
  const classes = useStyles()
  return (
    <TableContainer
      classes={{
        root: classes.root
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>.</TableCell>
            {anualdata.current &&
              Object.keys(anualdata.current).map((year) => (
                <TableCell align="right">{year}</TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {readyData &&
            Object.keys(readyData).slice(1, -1).map((field, index) => {
              let data = Object.keys(readyData[field]);
              return (
                <TableRow key={index}>
                  <TableCell
                    style={{ fontWeight: "bold" }}
                    colSpan={2}>{camelCasePipe(field)}</TableCell>
                  {Array(data.length)
                    .fill(0)
                    .map((_, index) => (
                      <Cell data={readyData[field][data[index]]} align="right" key={index} />
                    ))}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
