import React from 'react';
import './index.less';
import 'animate.css';
import img43Src from '../../../../images/sjzhcx/1x/资源 43mdpi.png'
import img44Src from '../../../../images/sjzhcx/1x/资源 44mdpi.png'

const imgs = {
    43:img43Src,
    44:img44Src
}

export default class SingQuery extends React.Component {
    state = {
        value:'',
    }

    valueChange = (item)=>{
        console.log(item);
        const {value} = item.target
        this.setState({value})
    }

    queryData = ()=>{
        console.log(this.state.value)
    }


    render() {
        const {img,name} = this.props;
        return (
           <div className="sing">
             <div className="sing-input">
             <input placeholder={name} className="sing-input-input" onChange={this.valueChange} value={this.state.value}></input>
             <div className="sing-input-icon" onClick={this.queryData}/>
           </div>
        <div className="sing-img">
            <img src={imgs[img]} alt="" /> 
        </div>
           </div>
        )
    }
} 