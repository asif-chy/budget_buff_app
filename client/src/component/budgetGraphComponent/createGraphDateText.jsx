import React from 'react';
import '../../css/graph.css';

function CreateGraphDateText(props) {

    console.log(props);

    return (
        <div className="graphDateTextDisplay">
            {props.dateList.map((week) => (
                week.map((each, index) => (
                    <div className="DateText" style={{ width: `${(props.barWidth)}%`, left: `${((each.dateIndex) * (props.barWidth))}%` }}>{each.date}</div>
                ))
            ))}
            <div>
                <h5>DAY</h5>
            </div>
        </div>
    )
}

export default CreateGraphDateText;