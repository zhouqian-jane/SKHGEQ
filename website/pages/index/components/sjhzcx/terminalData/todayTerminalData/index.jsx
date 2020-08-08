import React from 'react';
import './index.less';
import 'animate.css';
import moment from 'moment';

const list = [
    {title:'CCT',color:'#c23531',name:['驳船', '班轮', '卸船', '装船', '匣口收箱'],value:[1,2,3,4,5]},
    {title:'MCT',color:'#c23531',name:['驳船', '班轮', '卸船', '装船', '匣口收箱'],value:[1,2,3,4,5]},
    {title:'SCT',color:'#c23531',name:['驳船', '班轮', '卸船', '装船', '匣口收箱'],value:[1,2,3,4,5]},
    {title:'OTH',color:'#c23531',name:['匣口收箱','匣口收箱'],value:[111,222]}
]
export default class TodayTerminalData extends React.Component {
    state = {
        value:'',
    }

    valueChange = (item)=>{
        const {value} = item.value
        this.setState({value})
    }

    queryData = ()=>{
        console.log(this.state.value)
    }

    renderBlock = ()=>{
        const data = list.map((ele,i)=>{
            const blockKey = `block_${i}`;
            return(
                <div key = {blockKey} className='tody-block-item'>
                    <div className="tody-block-item-name">{ele.title}</div>
                    <div className="tody-block-item-color" style={{backgroundColor:ele.color}}/>
                    {
                        ele.name.map((item,i)=>{
                            const itemKey = `Item_${i}`
                            const width = (1322 - (14*(ele.name.length-1)))/(ele.name.length);
                            const marginright = i===(ele.name.length-1) ? 0 :14
                            return (
                                <div key={itemKey} style={{width:width,marginRight:marginright}}className="tody-block-item-li">
                                    <div className="tody-block-item-li-name">{item}</div>
                                    <div className="tody-block-item-li-value">{ele.value[i] || 0}</div>
                                </div>
                            )
                        })
                    }
                </div>
            )
        })
        return data 
    }


    render() {
        return (
            <div className="tody">
             <div className="tody-title">
               <div className="tody-title-name">
                 当日实时作业量
               </div>
               <div className="tody-title-date">
                <span>{moment().format("YYYY年MM月DD日")}</span>
               </div>
            </div>
            <div className="tody-block">
                {this.renderBlock()}
            </div>
           </div>
        )
    }
} 