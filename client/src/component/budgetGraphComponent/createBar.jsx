import React from 'react';
import '../../css/graph.css';

function CreateBar(props) {

    //console.log(props);

    return (
        // <div className = "bar" style={{width: `${(props.barWidth)}%`, height: `${((props.total*100)/props.barMaxHeight)}%`, left:`${((props.dateIndex)*(props.barWidth))}%`}}>
        <div className="bar" style={{ height: `${((props.total * 100) / props.barMaxHeight)}%`, width: `${(props.barWidth)}%`, left: `${((props.dateIndex) * (props.barWidth))}%` }}>
        </div>
    )
}

export default CreateBar;