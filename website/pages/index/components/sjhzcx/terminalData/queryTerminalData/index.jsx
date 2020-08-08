import React from 'react';
import './index.less';
import 'animate.css';
import moment from 'moment';
import { Checkbox } from 'antd';
import ReactEcharts from "echarts-for-react";

const plainOptions =['CCT', 'MCT', 'SCT']


export default class QueryTerminalData extends React.Component {
    state = {
        option: {
            tooltip: {
                trigger: 'axis', // axis|item
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'line', // 默认为直线，可选为：'line' | 'shadow'
                },
                textStyle: {
                  fontSize: 50,
                  color: '#fff',
                },
              },
            legend: {
                icon:'roundRect',
                textStyle: {
                    color: '#fff',
                    fontSize: 30,
                  },
                data: ['驳船', '班轮', '卸船', '装船', '收箱','提箱']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '7%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                axisLine: {
                    lineStyle: {
                      width: 5,
                      color: '#0E436E',
                    },
                  },
                  axisLabel: {
                    color: '#05b1c2',
                    fontSize: 36,
                  },
                data: ['1','2','3','4','5','6','7','8','9','10','11','12']
            },
            yAxis: {
                name: '单位：个',
                type: 'value',
                max: 100000,
                scale: true,
                axisLine: {
                    lineStyle: {
                    width: 5,
                    color: '#0E436E',
                    },
                },
                axisLabel: {
                    color: '#05b1c2',
                    fontSize: 36,
                    padding: [0, 5, 0, 0],
                  },
                  splitLine: {
                    show: true,
                    lineStyle: {
                      color: '#0E436E',
                      width: 5,
                      type: 'solid',
                    },
                  },
            },
            series: []
        },
    }

    onChange = (item)=>{
        console.log(item)
    }

    renderDate = ()=>{
        const newYear = Number(moment().format('YYYY'));
        const yearOption = [];
        for(let i=1900;i<=newYear;i++){
            const dateOptionKey = `dateOption_${i}`
            const option = <option key ={dateOptionKey} value={i}>{i}</option>
            yearOption.unshift(option);
        }
        return yearOption
    }
    
    dateChange =(e)=>{
        console.log(e.target.value)
    }


    render() {
        return (
           <div className="terminal">
             <div className="terminal-title">
               <div className="terminal-title-check">
                <Checkbox.Group options={plainOptions} defaultValue={plainOptions[0]} onChange={this.onChange} />
               </div>
               <div className="terminal-title-date">
                   <span>年</span>
                   <div className="terminal-title-date-select">
                    <select defaultValue={moment().format('YYYY')} onChange={this.dateChange}>
                        {this.renderDate()}
                    </select>
                   </div>
               </div>
            </div>
            <div>
                <ReactEcharts
                    style={{height:1436}}
                    option={this.state.option}
                    notMerge={true}
                    lazyUpdate={true} 
                    />
            </div>
           </div>
        )
    }
} 