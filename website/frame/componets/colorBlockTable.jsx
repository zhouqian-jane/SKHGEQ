import '../less';
import 'animate.css';
import React from 'react';
import $ from 'jquery';
import Table from './table'; 

export default class ColorBlockTable extends React.Component {
    render() {
           
        let columns = [
            {
                title: '船舶名称',
                dataIndex: 'name',
                unFilter: true,
            }, {
                title: '社保',
                dataIndex: 'shebao',
                unFilter: true,
                width: 750,
                colorBlocktype: [
                    {
                        title: '进境申报',
                        dataIndex: 'jjsb',
                        color: ['#85b6e8', '#d0952b'],
                    },
                    {
                        title: '出境申报',
                        dataIndex: 'cjsb',
                        color: ['#b98686', '#ebef11'],
                    },
                ],
            },
        ]

        const dataSource = [
            {
                name: '胡彦斌',
                jjsb: 40,
                cjsb: 50,
            },
            {
                name: '胡彦斌',
                jjsb: 40,
                cjsb: 50,
            },
            {
                name: '胡彦斌',
                jjsb: 40,
                cjsb: 50,
            },
        ];

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
                                        <p style={{display: 'inline-block', margin: 0, width: 100, height: 30, background: `linear-gradient(to right, ${item.color[0]} , ${item.color[1]})`}}></p>
                                        <span style={{fontSize: '40px', color: '#76b3ff', fontWeight: 'unset'}}>{item.title}</span>
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
                                        <p style={{display: 'flex', alignItems: 'center', height: 20, margin: '10px 0'}}>
                                            <p style={{display: 'inline-block', margin: 0, width: `${(record[item.dataIndex] / maxValue) * 0.8.toFixed(2) * 100}%`, height: 20, background: `linear-gradient(to right, ${item.color[0]} , ${item.color[1]})`}}></p>
                                            <span style={{color: '#fff', display: 'inline-block', marginLeft: 20}}>{record[item.dataIndex]}</span>
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
                <Table columns={columns} dataSource={dataSource} zebraCrossing={false} classname="colorBlockTable" style={{width: '1000px', height: '600px'}} />
            </div>
        )
    }
}