import '../less';
import 'animate.css';
import React from 'react';
import $ from 'jquery';
import Table from './table'; 

export default class ColorBlockTable extends React.Component {
    

    render() {
        let {columns = [], dataSource = [], width, height, lineHieght = 15} = this.props;

        columns = columns.map((item) => {
            if (!item.colorBlocktype) {
                return item;
            } else {
                const colorBlocktypeLength = item.colorBlocktype.length;
                const parseColumn = {
                    ...item,
                    title: () => (
                        <div>
                            {
                                item.colorBlocktype.map((item, index) => (
                                    <div style={{display: 'inline-block', marginRight: `${index === colorBlocktypeLength - 1 ? '0' : '50'}px`}}>
                                        <p style={{display: 'inline-block', margin: 0, width: 100, height: lineHieght + 5, background: `linear-gradient(to right, ${item.color[0]} , ${item.color[1]})`}}></p>
                                        <span style={{fontSize: '40px', color: '#208ec3', fontWeight: 'unset'}}>{item.title}</span>
                                    </div>
                                ))
                            }
                        </div>
                    ),
                    render: (text, record, index) => {
                        const allValues = [];
                        dataSource.forEach((dataSourceItem) => {
                            item.colorBlocktype.forEach((colorBlocktypeItem) => {
                                allValues.push(dataSourceItem[colorBlocktypeItem.dataIndex])
                            })
                        })
                        const maxValue = Math.max(...allValues)
                        return (
                            <div>
                                {
                                    item.colorBlocktype.map((item) => (
                                        <p style={{display: 'flex', alignItems: 'center', height: lineHieght, margin: '10px 0'}}>
                                            <p style={{display: 'inline-block', margin: 0, width: `${(record[item.dataIndex] / maxValue) * 0.8.toFixed(2) * 100}%`, height: lineHieght, background: `linear-gradient(to right, ${item.color[0]} , ${item.color[1]})`}}></p>
                                            <span style={{color: '#208ec3', display: 'inline-block', marginLeft: 20}}>{record[item.dataIndex]}</span>
                                        </p>
                                    ))
                                }
                            </div>
                            
                        )
                    },
                }
                delete parseColumn.colorBlocktype
                return parseColumn;
            }
        })

        return (
            <div>
                <Table columns={columns} dataSource={dataSource} zebraCrossing={false} classname="colorBlockTable" style={{width: width - 40, height: height - 40}} />
            </div>
        )
    }
}