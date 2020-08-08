import React from 'react';
import './index.less';
import 'animate.css';

export default class  CombInput extends React.Component {
    state = {
        value:'',
    }
    constructor(props){
        super(props)
    }

    valueChange = (e)=>{
        const {value} = e.target
        this.setState({value});
        const {onChange,item} = this.props;
        onChange&&onChange({name:item.name,value});
    }
    render() {
        const {item} = this.props;
        return (
           <div className="combinput">
            <div className="combinput-prex">{item.title}</div>
            <input className="combinput-input" onChange={this.valueChange} value={this.state.value}></input>
           </div>
        )
    }
} 