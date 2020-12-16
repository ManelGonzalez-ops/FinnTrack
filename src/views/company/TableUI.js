import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { Cell } from "../../components/Cell";
import {useParams} from "react-router-dom"

export const TableUI = ({income}) => {
  const [readyData, setReadyData] = useState("");
  let anualdata= useRef({});
  
 

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

  return (
    <TableContainer>
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
            Object.keys(readyData).map((field, index) => {
              let data = Object.keys(readyData[field]);
              return (
                <TableRow key={index}>
                  <TableCell colSpan={3}>{field}</TableCell>
                  {Array(data.length)
                    .fill(0)
                    .map((_, index) => (
                      <Cell data={readyData[field][data[index]]} align="right" key={index}/>
                    ))}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
