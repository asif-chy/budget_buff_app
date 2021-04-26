import React from 'react';
import '../../css/graph.css';

function CreateBudgetGraphLine(props) {

    //console.log(props);

    return (
        <div className="line" style={{ bottom: `${(props.bottomValue) * 10}%` }}>
        </div>
    )
}

export default CreateBudgetGraphLine;