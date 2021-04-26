import React from 'react';
import '../../css/graph.css';

function CreateGraphAmountText(props) {

    console.log(props);

    return (
        <div className="graphAmountTextDisplay" >
            {props.lineDataArray.map((line, index) => (
                <div className="AmountText" style={{ bottom: `${(8) + (10 * index)}%` }}>{line}</div>
            ))}
            <div id="dollarLabel">
                <h5>$</h5>
            </div>
        </div>
    )
}
// style={{bottom: `${(props.index)*10}%`}}
export default CreateGraphAmountText;