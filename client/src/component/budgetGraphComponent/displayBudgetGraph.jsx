import React, { useState, useEffect } from 'react';
import CreateBudgetGraphLine from './createBudgetGraphLine';
import CreateGraphAmountText from './createGraphAmountText';
import CreateGraphDateText from './createGraphDateText';
import CreateBar from './createBar';
import '../../css/graph.css';
import { datesGenerator } from 'dates-generator';

// https://medium.com/@ItsMeDannyZ/how-to-build-a-bar-graph-with-react-458a19ef0ba0

function DisplayBudgetGraph(props) {

    const [barData, setBarData] = useState({
        barWidth: "",
        barMaxHeight: "",
    })

    const [lineData, setLineData] = useState({
        lineDataArray: [],
        lineArray: []
    })

    useEffect(() => {

        const maxDays = findMaxDays(props.dateList);
        setWidthValue(maxDays);

        const maxHeight = setMaxHeightValue(props.dateList);
        setLineDataArray(maxHeight);
        setLineArray();

    }, [props.dateList])

    function setLineArray() {
        var lineArray = [];
        var lineValue = 0;

        for (var i = 1; i < 10; i++) {
            lineValue = 1 * i;
            lineArray.push(lineValue);
        }

        setLineData(previousValue => {
            return {
                ...previousValue,
                lineArray: lineArray
            };
        })
    }

    function setLineDataArray(barMaxHeight) {

        var lineData = [];
        var lineMultiplier = (barMaxHeight / 10);
        //console.log(lineMultiplier);
        var lineValue = 0;

        for (var i = 1; i < 10; i++) {
            lineValue = lineMultiplier * i;
            lineData.push(lineValue);
        }
        //console.log(lineData);

        setLineData(previousValue => {
            return {
                ...previousValue,
                lineDataArray: lineData
            };
        })
    }

    const findMaxDays = (dateList) => {

        var maxDays = 0;

        dateList.map((week) => {
            maxDays = week.length + maxDays;
        });

        return maxDays;
    }

    function setWidthValue(maxDays) {

        const width = 100 / maxDays;

        setBarData(previousValue => {
            return {
                ...previousValue,
                barWidth: width
            }
        })

    }

    function setMaxHeightValue(dateList) {

        var maxTotalValue = 0;
        var maxHeight = 1;

        dateList.map((week) => {
            week.map((each) => {
                maxTotalValue = Math.max(each.total, maxTotalValue);
            })
        })

        for (var i = 0; i < (maxTotalValue.toString().length); i++) {
            maxHeight = maxHeight + "0";
        }

        console.log(maxHeight);

        setBarData(previousValue => {
            return {
                ...previousValue,
                barMaxHeight: maxHeight
            }
        })

        return maxHeight;
    }

    return (
        <div className="budgetGraphBox">
            <div className="graph">

                <CreateGraphAmountText
                    lineDataArray={lineData.lineDataArray} />

                <div className="barContainer">
                    <div class="barDisplay">
                        {lineData.lineArray.map((line, index) => (
                            <CreateBudgetGraphLine key={index}
                                bottomValue={line}
                            />
                        ))}
                        {props.dateList.map((week) => (
                            week.map((each, index) => (
                                <CreateBar key={index}
                                    barWidth={barData.barWidth}
                                    barMaxHeight={barData.barMaxHeight}
                                    total={each.total}
                                    dateIndex={each.dateIndex}
                                />
                            ))
                        ))}
                    </div>

                    <CreateGraphDateText
                        dateList={props.dateList}
                        barWidth={barData.barWidth}
                    />

                </div>


            </div>
        </div>
    )
}

export default DisplayBudgetGraph;