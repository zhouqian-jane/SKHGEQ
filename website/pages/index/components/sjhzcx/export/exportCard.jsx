import React from 'react';
import '../../../less';
import 'animate.css';


export default class ExportCard extends React.Component {
    state = {}

    render() {
        const {title, width, height, style, children, ...others} = this.props;
        const targetStyle = {
            width: `${width}px`, 
            height: `${height}px`,
            background: '#052c58',
            padding: '30px',
            ...style,
        }
        return (
            <div className="exportCard" style={targetStyle} {...others}>
                <p className="exportCard-title" style={{fontSize: '45px', color: '#fafafa', margin: '0px'}}>{title}</p>
                <div className="exportCard-content">
                   {children}
                </div>
            </div>
        )
    }
} 