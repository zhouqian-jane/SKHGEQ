import React from 'react';
import './index.less';
import 'animate.css';
import CombInput from './combInput';
import CombSelect from './combSelect';


const queryItems = [
    {
        name:'报关单',
        title:'报关单',
        type:'Input'
    },
    {
        name:'提运单号',
        title:'提运单号',
        type:'Input'
    }, {
        name:'IMO号',
        title:'IMO号',
        type:'Input'
    },
    {
        name:'航次号',
        title:'航次号',
        type:'Input'
    },
    {
        name:'柜号',
        title:'柜号',
        type:'Input'
    }, {
        name:'船代',
        title:'船代',
        type:'DDL',
        selectValue:[
            {name:'测试111',value:'测试111'},
            {name:'测试222',value:'测试222'},
            {name:'测试333',value:'测试333'}
        ]
    }, {
        name:'报关行',
        title:'报关行',
        type:'DDL',
        selectValue:[
            {name:'测试444',value:'测试444'},
            {name:'测试555',value:'测试555'},
            {name:'测试666',value:'测试666'}
        ]
    }
]
export default class  CombinationQueryCard extends React.Component {
    state = {}
    query = {}
    valueChange = (item)=>{
        this.query[item.name] = item.value
    }

    queryClick = ()=>{
        console.log(this.query);
    }

    renderItemByType = (item)=>{
        if(item.type === 'DDL'){
            return <CombSelect item={item} onChange={this.valueChange} />
        } 

        return <CombInput item={item} onChange={this.valueChange}/>
    }

    renderItem = ()=>{
        const data = queryItems.map((item,i)=>{
            const itemKey = `item_${i}`;
            return (
                <div key={itemKey} style={{marginBottom: 132}}>
                    {this.renderItemByType(item)}
                </div>
            )
        })
        return data
    }
    render() {
        return (
           <div className="comb">
             <div className="comb-btn" onClick={this.queryClick}>
                 组合查询
             </div>
             <div className="comb-query">
                 {this.renderItem()}
             </div>
           </div>
        )
    }
} 