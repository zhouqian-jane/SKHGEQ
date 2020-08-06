import React from 'react';
import '../../../less';
import 'animate.css';
import $ from 'jquery';
import { publish, subscribe, unsubscribe } from '../../../../../frame/core/arbiter';
import { Vedio, ViwePager, Table, ImgDisplay, Panel, Vedios, QueryBox, QueryBoxs } from '../../../../../frame/componets/index';
import {ColorBlockTable} from '../../../../../frame/componets/index'
import ExportCard from './exportCard.jsx'

let columns = [
    {
        title: '船舶名称',
        dataIndex: 'name',
        unFilter: true,
        width: 220,
    }, {
        title: '社保',
        dataIndex: 'shebao',
        unFilter: true,
        colorBlocktype: [
            {
                title: '进境申报',
                dataIndex: 'jjsb',
                color: ['#622d8e', '#e72878'],
            },
            {
                title: '出境申报',
                dataIndex: 'cjsb',
                color: ['#0139aa', '#158bfe'],
            },
        ],
    },
]

let columns2 = [
    {
        title: '船舶名称',
        dataIndex: 'name',
        unFilter: true,
        width: 220,
    }, {
        title: '社保',
        dataIndex: 'shebao',
        unFilter: true,
        colorBlocktype: [
            {
                title: '进境申报',
                dataIndex: 'jjsb',
                color: ['#0139aa', '#158bfe'],
            },
        ],
    },
]

let columns3 = [
    {
        title: '船舶名称',
        dataIndex: 'name',
        unFilter: true,
        width: 220,
    }, {
        title: '社保',
        dataIndex: 'shebao',
        unFilter: true,
        colorBlocktype: [
            {
                title: '进境申报',
                dataIndex: 'jjsb',
                color: ['#818ac4', '#222c7d'],
            },
            {
                title: '出境申报',
                dataIndex: 'cjsb',
                color: ['#0139aa', '#158bfe'],
            },
        ],
    },
]

let columns4 = [
    {
        title: '船舶名称',
        dataIndex: 'name',
        unFilter: true,
        width: 220,
    }, {
        title: '社保',
        dataIndex: 'shebao',
        unFilter: true,
        colorBlocktype: [
            {
                title: '进境申报',
                dataIndex: 'jjsb',
                color: ['#ff7200', '#d6b805'],
            },
            {
                title: '出境申报',
                dataIndex: 'cjsb',
                color: ['#0139aa', '#158bfe'],
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

export default class ExportSb extends React.Component {
    state = {}

    render() {
        return (
            <div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                    <ExportCard title="船舶申报" width='850' height='700'>
                        <ColorBlockTable columns={columns} dataSource={dataSource} width="850" height="700"/>
                    </ExportCard>
                    <ExportCard title="码头提单数" width='2000' height='700'></ExportCard>
                    <ExportCard title="码头集装箱申报数量" width='2000' height='700'></ExportCard>
                    <ExportCard title="相关行提单数" width='600' height='700'>
                        <ColorBlockTable columns={columns2} dataSource={dataSource} width="600" height="700"/>
                    </ExportCard>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '50px'}}>
                    <ExportCard title="船代申报提单数" width='1150' height='700'>
                        <ColorBlockTable columns={columns3} dataSource={dataSource} width="1150" height="700"/>
                    </ExportCard>
                    <ExportCard title="码头检查量" width='1600' height='700'>
                        <ColorBlockTable columns={columns4} dataSource={dataSource} width="1600" height="700"/>
                    </ExportCard>
                    <ExportCard title="出口提前申报后超时间未运抵" width='1350' height='700'></ExportCard>
                    <ExportCard title="船舶申报" width='1300' height='700'></ExportCard>
                </div>
            </div>
        )
    }
} 