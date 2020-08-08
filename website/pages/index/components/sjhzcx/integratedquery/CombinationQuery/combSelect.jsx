import React from 'react';
import './index.less';
import 'animate.css';

export default class  CombSelect extends React.Component {
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
           <div className="combselect">
            <div className="combselect-prex">{item.title}</div>
            <div className="combselect-select">
            <select onChange={this.valueChange}>
                 <option value="none" selected disabled hidden>请选择选项</option> 
                {
                   item.selectValue.map((ele,i)=>{
                       const optionKey = `option_${i}`;
                   return  <option key={optionKey} value={ele.value}>{ele.name}</option>
                   }) 
                }
            </select>
            </div>
           </div>
        )
    }
} 