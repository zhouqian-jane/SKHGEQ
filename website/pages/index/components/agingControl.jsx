import '../less';
import 'animate.css';
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import echarts from 'echarts';
import { publish, subscribe, unsubscribe } from '../../../frame/core/arbiter';
import { Table } from '../../../frame/componets/index';
import ZNYBJ from './ZNYBJ';

// tip组件
export default class AgingControl extends React.Component {
    state = {
        layer: 'ck',
        hgpjz: {
            ck: 0,
            data: {},
            jk: 0,
        },
        pjz: {},
        param: (Number(new Date().getMonth())) + '月',
        sx: false,

    }
    componentDidMount() {
        this.update = () => {
            let pjz = this.state.pjz;
            let jkData = [];
            let ckData = [];
            for (let i = 0; i < 12; i++) {
                jkData.push(pjz.jk.DATAA);
                ckData.push(pjz.ck.DATAA);
            }
            let mbckData = ckData.map((e) => (e / 3 * 2).toFixed(2));
            let mbjkData = jkData.map((e) => (e / 3 * 2).toFixed(2));
            publish('getData', { svn: 'skhg_stage', tableName: 'imap_scct_sxfx_01', data: { where: "category='E' and EFFECTDATE LIKE to_char(sysdate,'yyyy')||'%'" } }).then((res) => {
                let data = res[0].features.map((e) => e.attributes.DATAA);
                for (let i = 0; i < 12 - data.length; i++) {
                    data.push(0);
                }
                let ops = {
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            axisLabel: {
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 50,
                                },
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#1890ff',
                                    width: 5,
                                },
                            },
                            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                        },
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '天',
                            nameTextStyle: {
                                fontSize: 50,
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 50,

                                },
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#1890ff',
                                    width: 5,
                                },
                            },
                            boundaryGap: [0, 0.1],
                            splitLine: {
                                show: false,
                            },
                        },
                    ],
                    series: [
                        {
                            name: '去年完成值',
                            type: 'line',
                            data: ckData,
                            symbolSize: 15,
                            itemStyle: {
                                normal: {
                                    color: '#70e100',
                                    lineStyle: {
                                        width: 6,
                                        color: '#70e100',
                                    },
                                },
                            },
                            markLine: {
                                data: [
                                    { type: 'average', name: '平均值' },
                                ],
                                label: {
                                    normal: {
                                        show: true,
                                        fontSize: 50,
                                    },
                                },
                            },
                        },
                        {
                            name: '目标值',
                            type: 'line',
                            data: mbckData,
                            symbolSize: 15,
                            itemStyle: {
                                normal: {
                                    color: '#f00',
                                    lineStyle: {
                                        width: 6,
                                        type: 'dotted',
                                        color: '#f00',
                                    },
                                },
                            },
                            markLine: {
                                data: [
                                    { type: 'average', name: '平均值' },
                                ],
                                label: {
                                    normal: {
                                        show: true,
                                        fontSize: 50,
                                    },
                                },
                            },
                        },
                        {
                            name: '城北所',
                            type: 'bar',
                            stack: 'sum',
                            barWidth: '60%',
                            barCategoryGap: '50%',
                            data: data.map((e, i) => {
                                return {
                                    name: (i + 1) + '月',
                                    value: e,
                                    itemStyle: {
                                        normal: {
                                            color: e < mbckData[0] ? '#1890ff' : e < ckData[0] ? '#dbcf01' : '#f00',
                                            label: {
                                                textStyle: {
                                                    color: '#fff',
                                                    fontSize: 50,
                                                },
                                                show: Number(e) > 0,
                                                position: 'insideTop',
                                                formatter: (param) => Number(param.value) > 0 ? Number(param.value) : '',
                                            },

                                        },
                                    },
                                };
                            }),
                        },
                    ],
                };
                if (this.chart1) this.chart1.dispose();
                this.chart1 = echarts.init(ReactDOM.findDOMNode(this.refs.echart1));
                this.chart1.setOption(ops);
                this.chart1.on('click', (param) => {
                    if (param.seriesType == 'bar') this.setState({ layer: 'ck', param: param.name, sx: !this.state.sx });
                });
            });
            publish('getData', { svn: 'skhg_stage', tableName: 'imap_scct_sxfx_01', data: { where: "category='I' and EFFECTDATE LIKE to_char(sysdate,'yyyy')||'%'" } }).then((res) => {
                let data = res[0].features.map((e) => e.attributes.DATAA);
                for (let i = 0; i < 12 - data.length; i++) {
                    data.push(0);
                }
                let ops = {
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            axisLabel: {
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 50,
                                },
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#1890ff',
                                    width: 5,
                                },
                            },
                            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                        },
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '天',
                            nameTextStyle: {
                                fontSize: 50,
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 50,

                                },
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#1890ff',
                                    width: 5,
                                },
                            },
                            boundaryGap: [0, 0.1],
                            splitLine: {
                                show: false,
                            },
                        },
                    ],
                    series: [
                        {
                            name: '去年完成值',
                            type: 'line',
                            data: jkData,
                            symbolSize: 15,
                            itemStyle: {
                                normal: {
                                    color: '#70e100',
                                    lineStyle: {
                                        width: 6,
                                        color: '#70e100',
                                    },
                                },
                            },
                            markLine: {
                                data: [
                                    { type: 'average', name: '平均值' },
                                ],
                                label: {
                                    normal: {
                                        show: true,
                                        fontSize: 50,
                                    },
                                },
                            },
                        },
                        {
                            name: '目标值',
                            type: 'line',
                            data: mbjkData,
                            symbolSize: 15,
                            itemStyle: {
                                normal: {
                                    color: '#f00',
                                    lineStyle: {
                                        width: 6,
                                        type: 'dotted',
                                        color: '#f00',
                                    },
                                },
                            },
                            markLine: {
                                data: [
                                    { type: 'average', name: '平均值' },
                                ],
                                label: {
                                    normal: {
                                        show: true,
                                        fontSize: 50,
                                    },
                                },
                            },
                        },
                        {
                            name: '城北所',
                            type: 'bar',
                            stack: 'sum',
                            barWidth: '60%',
                            barCategoryGap: '50%',
                            data: data.map((e, i) => {
                                return {
                                    name: (i + 1) + '月',
                                    value: e,
                                    itemStyle: {
                                        normal: {
                                            color: e < mbjkData[0] ? '#1890ff' : e < jkData[0] ? '#dbcf01' : '#f00',
                                            label: {
                                                textStyle: {
                                                    color: '#fff',
                                                    fontSize: 50,
                                                },
                                                show: Number(e) > 0,
                                                position: 'insideTop',
                                                formatter: (param) => Number(param.value) > 0 ? Number(param.value) : '',
                                            },

                                        },
                                    },
                                };
                            }),
                        },
                    ],
                };
                if (this.chart2) this.chart2.dispose();
                this.chart2 = echarts.init(ReactDOM.findDOMNode(this.refs.echart2));
                this.chart2.setOption(ops);
                this.chart2.on('click', (param) => {
                    if (param.seriesType == 'bar') this.setState({ layer: 'jk', param: param.name });
                });
            });
        }
        publish('getData', { svn: 'skhg_stage', tableName: 'imap_scct_sxfx', data: { where: "EFFECTYEAR=to_char(sysdate,'yyyy')-1" } }).then((res) => {
            let pjz = {};
            res[0].features.forEach((e) => pjz[e.attributes.CATEGORY == 'E' ? 'ck' : 'jk'] = e.attributes);
            this.setState({ pjz: pjz }, this.update);
        });
        publish('getData', { svn: 'skhg_stage', tableName: 'imap_skhg_sxfx', data: { where: "EFFECTDATE LIKE to_char(sysdate,'yyyy')-1||'%' OR EFFECTDATE LIKE to_char(sysdate,'yyyy')||'%'" } }).then((res) => {
            console.log(res);
            let year = new Date().getFullYear() + '';
            let thisyear = {};
            let jk = 0;
            let ck = 0;
            let count = 0;
            res[0].features.forEach((e) => {
                if (e.attributes.EFFECTDATE.indexOf(year) >= 0) thisyear[e.attributes.EFFECTDATE] = { jk: e.attributes.CUSIN, ck: e.attributes.CUSOUT };
                else {
                    count++;
                    jk = jk + Number(e.attributes.CUSIN);
                    ck = ck + Number(e.attributes.CUSOUT);
                }
            });
            jk = (jk / count).toFixed(2);
            ck = (ck / count).toFixed(2);
            this.setState({ hgpjz: { jk: jk, ck: ck, data: thisyear } });
        });
    }
    render() {
        return (
            this.state.pjz.ck ? <div className='ac'>
                <div>
                    <div className='ac-box'>
                        <div ref='echart1' className='ac-box-t'></div>
                        <div ref='echart2' className='ac-box-b'></div>
                    </div>
                </div>
                {
                    this.state.sx == true ? <CK layer={this.state.layer} data={this.state.param} hgpjz={this.state.hgpjz} pjz={this.state.pjz[this.state.layer]} /> : <CK layer={this.state.layer} data={this.state.param} hgpjz={this.state.hgpjz} pjz={this.state.pjz[this.state.layer]} />
                }
            </div> : <div />
        )
    }
}

// 出口组件
class CK extends React.Component {
    state = {
        selectIndex: 'v_imap_scct_sxfx_e_b',
        ck: [[], []],
        jk: [[], []],
        top10: [],
        containerNo: '',
        dataa: 0,
        hthjsx: 0,
        htcysx: 0,
    }

    componentWillReceiveProps(pro) {
        console.log('123');
        let layer = pro.layer;
        let month = Number(pro.data.replace('月', ''));
        let year = new Date().getFullYear();
        let time = year + (month < 10 ? '0' : '') + month;
        publish('getData', { svn: 'skhg_stage', tableName: 'imap_scct_sxfx_01', data: { where: "category='" + (pro.layer == 'ck' ? 'E' : 'I') + "' and EFFECTDATE='" + time + "'" } }).then((res) => {
            let e = res[0].features[0].attributes;
            e.DATAA = Number(e.DATAA);
            e.DATAB = (Number(e.DATAB) - Number(pro.hgpjz.data[time][pro.layer]) / 24).toFixed(2);
            e.DATAC = Number(e.DATAC);
            e.DATAD = Number(e.DATAD);
            e.DATAE = Number(e.DATAE);
            e.DATAF = Number(e.DATAF);
            let data206 = (data) => (data * 2 / 3).toFixed(2);
            let mdata = [];
            let temp = pro.pjz;
            temp.DATAA = Number(temp.DATAA);
            temp.DATAB = Number(temp.DATAB);
            temp.DATAC = Number(temp.DATAC);
            temp.DATAD = Number(temp.DATAD);
            temp.DATAE = Number(temp.DATAE);
            temp.DATAF = Number(temp.DATAF);
            if (pro.layer == 'ck') {
                mdata = [
                    [
                        { layer: 'ck', name: '通关准备', top10Table: 'v_imap_scct_sxfx_e_b', style: { width: 1090, height: 630 }, type: e.DATAB > temp.DATAB ? 0 : 1, time: e.DATAB, items: [{ name: (e.DATAB > temp.DATAB ? '超' : '低') + '去年均值', value: Math.abs(e.DATAB - temp.DATAB).toFixed(2), rate: (Math.abs(e.DATAB - temp.DATAB) / temp.DATAB * 100).toFixed(0) }, { name: (e.DATAB > data206(temp.DATAB) ? '超' : '低') + '目标值', value: Math.abs(e.DATAB - data206(temp.DATAB)).toFixed(2), rate: (Math.abs(e.DATAB - data206(temp.DATAB)) / data206(temp.DATAB) * 100).toFixed(0) }] },
                        { layer: 'ck', name: '货物提离', top10Table: 'v_imap_scct_sxfx_e_c', style: { width: 1090, height: 630 }, type: e.DATAC > temp.DATAC ? 0 : 1, time: e.DATAC, items: [{ name: (e.DATAC > temp.DATAC ? '超' : '低') + '去年均值', value: Math.abs(e.DATAC - temp.DATAC).toFixed(2), rate: (Math.abs(e.DATAC - temp.DATAC) / temp.DATAC * 100).toFixed(0) }, { name: (e.DATAC > data206(temp.DATAC) ? '超' : '低') + '目标值', value: Math.abs(e.DATAC - data206(temp.DATAC)).toFixed(2), rate: (Math.abs(e.DATAC - data206(temp.DATAC)) / data206(temp.DATAC) * 100).toFixed(0) }] },
                    ],
                    [
                        // { layer: 'ck', name: '查验准备', top10Table: 'v_imap_scct_sxfx_e_d', style: { width: 1090, height: 630 }, type: e.DATAD > temp.DATAD ? 0 : 1, time: e.DATAD, items: [{ name: (e.DATAD > temp.DATAD ? '超' : '低') + '去年均值', value: Math.abs(e.DATAD - temp.DATAD).toFixed(2), rate: (Math.abs(e.DATAD - temp.DATAD) / temp.DATAD * 100).toFixed(0) }, { name: (e.DATAD > data206(temp.DATAD) ? '超' : '低') + '目标值', value: Math.abs(e.DATAD - data206(temp.DATAD)).toFixed(2), rate: (Math.abs(e.DATAD - data206(temp.DATAD)) / data206(temp.DATAD) * 100).toFixed(0) }] },
                        // { layer: 'ck', name: '查验作业', top10Table: 'v_imap_scct_sxfx_e_e', style: { width: 1090, height: 630 }, type: e.DATAE > temp.DATAE ? 0 : 1, time: e.DATAE, items: [{ name: (e.DATAE > temp.DATAE ? '超' : '低') + '去年均值', value: Math.abs(e.DATAE - temp.DATAE).toFixed(2), rate: (Math.abs(e.DATAE - temp.DATAE) / temp.DATAE * 100).toFixed(0) }, { name: (e.DATAE > data206(temp.DATAE) ? '超' : '低') + '目标值', value: Math.abs(e.DATAE - data206(temp.DATAE)).toFixed(2), rate: (Math.abs(e.DATAE - data206(temp.DATAE)) / data206(temp.DATAE) * 100).toFixed(0) }] },
                        // { layer: 'ck', name: '货物提离', top10Table: 'v_imap_scct_sxfx_e_f', style: { width: 1090, height: 630 }, type: e.DATAF > temp.DATAF ? 0 : 1, time: e.DATAF, items: [{ name: (e.DATAF > temp.DATAF ? '超' : '低') + '去年均值', value: Math.abs(e.DATAF - temp.DATAF).toFixed(2), rate: (Math.abs(e.DATAF - temp.DATAF) / temp.DATAF * 100).toFixed(0) }, { name: (e.DATAF > data206(temp.DATAF) ? '超' : '低') + '目标值', value: Math.abs(e.DATAF - data206(temp.DATAF)).toFixed(2), rate: (Math.abs(e.DATAF - data206(temp.DATAF)) / data206(temp.DATAF) * 100).toFixed(0) }] },
                    ],
                ];
            }
            else {
                mdata = [
                    [
                        { layer: 'jk', name: '通关准备', top10Table: 'v_imap_scct_sxfx_i_b', style: { width: 1090, height: 630, marginRight: 50 }, type: e.DATAB > temp.DATAB ? 0 : 1, time: e.DATAB, items: [{ name: (e.DATAB > temp.DATAB ? '超' : '低') + '去年均值', value: Math.abs(e.DATAB - temp.DATAB).toFixed(2), rate: (Math.abs(e.DATAB - temp.DATAB) / temp.DATAB * 100).toFixed(0) }, { name: (e.DATAB > data206(temp.DATAB) ? '超' : '低') + '目标值', value: Math.abs(e.DATAB - data206(temp.DATAB)).toFixed(2), rate: (Math.abs(e.DATAB - data206(temp.DATAB)) / data206(temp.DATAB) * 100).toFixed(0) }] },
                        { layer: 'jk', name: '货物提离', top10Table: 'v_imap_scct_sxfx_i_c', style: { width: 1090, height: 630 }, type: e.DATAC > temp.DATAC ? 0 : 1, time: e.DATAC, items: [{ name: (e.DATAC > temp.DATAC ? '超' : '低') + '去年均值', value: Math.abs(e.DATAC - temp.DATAC).toFixed(2), rate: (Math.abs(e.DATAC - temp.DATAC) / temp.DATAC * 100).toFixed(0) }, { name: (e.DATAC > data206(temp.DATAC) ? '超' : '低') + '目标值', value: Math.abs(e.DATAC - data206(temp.DATAC)).toFixed(2), rate: (Math.abs(e.DATAC - data206(temp.DATAC)) / data206(temp.DATAC) * 100).toFixed(0) }] },
                    ],
                    [
                        // { layer: 'jk', name: '查验准备', top10Table: 'v_imap_scct_sxfx_i_d', style: { width: 1090, height: 630 }, type: e.DATAD > temp.DATAD ? 0 : 1, time: e.DATAD, items: [{ name: (e.DATAD > temp.DATAD ? '超' : '低') + '去年均值', value: Math.abs(e.DATAD - temp.DATAD).toFixed(2), rate: (Math.abs(e.DATAD - temp.DATAD) / temp.DATAD * 100).toFixed(0) }, { name: (e.DATAD > data206(temp.DATAD) ? '超' : '低') + '目标值', value: Math.abs(e.DATAD - data206(temp.DATAD)).toFixed(2), rate: (Math.abs(e.DATAD - data206(temp.DATAD)) / data206(temp.DATAD) * 100).toFixed(0) }] },
                        // { layer: 'jk', name: '查验作业', top10Table: 'v_imap_scct_sxfx_i_e', style: { width: 1090, height: 630 }, type: e.DATAE > temp.DATAE ? 0 : 1, time: e.DATAE, items: [{ name: (e.DATAE > temp.DATAE ? '超' : '低') + '去年均值', value: Math.abs(e.DATAE - temp.DATAE).toFixed(2), rate: (Math.abs(e.DATAE - temp.DATAE) / temp.DATAE * 100).toFixed(0) }, { name: (e.DATAE > data206(temp.DATAE) ? '超' : '低') + '目标值', value: Math.abs(e.DATAE - data206(temp.DATAE)).toFixed(2), rate: (Math.abs(e.DATAE - data206(temp.DATAE)) / data206(temp.DATAE) * 100).toFixed(0) }] },
                    ],
                ];
            }
            this.updateTop10({ tab: 'v_imap_scct_sxfx_e_b', cjk: mdata, datas: e.DATAA })
        });
    }

    componentDidMount() {
        console.log('456');
        let layer = this.props.layer;
        let month = Number(this.props.data.replace('月', ''));
        let year = new Date().getFullYear();
        let time = year + (month < 10 ? '0' : '') + month;
        publish('getData', { svn: 'skhg_stage', tableName: 'imap_scct_sxfx_01', data: { where: "category='" + (this.props.layer == 'ck' ? 'E' : 'I') + "' and EFFECTDATE='" + time + "'" } }).then((res) => {
            let e = res[0].features[0].attributes;
            e.DATAA = Number(e.DATAA);
            e.DATAB = (Number(e.DATAB) - Number(this.props.hgpjz.data[time][this.props.layer]) / 24).toFixed(2);
            e.DATAC = Number(e.DATAC);
            e.DATAD = Number(e.DATAD);
            e.DATAE = Number(e.DATAE);
            e.DATAF = Number(e.DATAF);
            let data206 = (data) => (data * 2 / 3).toFixed(2);
            let mdata = [];
            let temp = this.props.pjz;
            temp.DATAA = Number(temp.DATAA);
            temp.DATAB = Number(temp.DATAB);
            temp.DATAC = Number(temp.DATAC);
            temp.DATAD = Number(temp.DATAD);
            temp.DATAE = Number(temp.DATAE);
            temp.DATAF = Number(temp.DATAF);
            if (this.props.layer == 'ck') {
                mdata = [
                    [
                        { layer: 'ck', name: '通关准备', top10Table: 'v_imap_scct_sxfx_e_b', style: { width: 1090, height: 630 }, type: e.DATAB > temp.DATAB ? 0 : 1, time: e.DATAB, items: [{ name: (e.DATAB > temp.DATAB ? '超' : '低') + '去年均值', value: Math.abs(e.DATAB - temp.DATAB).toFixed(2), rate: (Math.abs(e.DATAB - temp.DATAB) / temp.DATAB * 100).toFixed(0) }, { name: (e.DATAB > data206(temp.DATAB) ? '超' : '低') + '目标值', value: Math.abs(e.DATAB - data206(temp.DATAB)).toFixed(2), rate: (Math.abs(e.DATAB - data206(temp.DATAB)) / data206(temp.DATAB) * 100).toFixed(0) }] },
                        { layer: 'ck', name: '货物提离', top10Table: 'v_imap_scct_sxfx_e_c', style: { width: 1090, height: 630 }, type: e.DATAC > temp.DATAC ? 0 : 1, time: e.DATAC, items: [{ name: (e.DATAC > temp.DATAC ? '超' : '低') + '去年均值', value: Math.abs(e.DATAC - temp.DATAC).toFixed(2), rate: (Math.abs(e.DATAC - temp.DATAC) / temp.DATAC * 100).toFixed(0) }, { name: (e.DATAC > data206(temp.DATAC) ? '超' : '低') + '目标值', value: Math.abs(e.DATAC - data206(temp.DATAC)).toFixed(2), rate: (Math.abs(e.DATAC - data206(temp.DATAC)) / data206(temp.DATAC) * 100).toFixed(0) }] },
                    ],
                    [
                        // { layer: 'ck', name: '查验准备', top10Table: 'v_imap_scct_sxfx_e_d', style: { width: 1090, height: 630 }, type: e.DATAD > temp.DATAD ? 0 : 1, time: e.DATAD, items: [{ name: (e.DATAD > temp.DATAD ? '超' : '低') + '去年均值', value: Math.abs(e.DATAD - temp.DATAD).toFixed(2), rate: (Math.abs(e.DATAD - temp.DATAD) / temp.DATAD * 100).toFixed(0) }, { name: (e.DATAD > data206(temp.DATAD) ? '超' : '低') + '目标值', value: Math.abs(e.DATAD - data206(temp.DATAD)).toFixed(2), rate: (Math.abs(e.DATAD - data206(temp.DATAD)) / data206(temp.DATAD) * 100).toFixed(0) }] },
                        // { layer: 'ck', name: '查验作业', top10Table: 'v_imap_scct_sxfx_e_e', style: { width: 1090, height: 630 }, type: e.DATAE > temp.DATAE ? 0 : 1, time: e.DATAE, items: [{ name: (e.DATAE > temp.DATAE ? '超' : '低') + '去年均值', value: Math.abs(e.DATAE - temp.DATAE).toFixed(2), rate: (Math.abs(e.DATAE - temp.DATAE) / temp.DATAE * 100).toFixed(0) }, { name: (e.DATAE > data206(temp.DATAE) ? '超' : '低') + '目标值', value: Math.abs(e.DATAE - data206(temp.DATAE)).toFixed(2), rate: (Math.abs(e.DATAE - data206(temp.DATAE)) / data206(temp.DATAE) * 100).toFixed(0) }] },
                        // { layer: 'ck', name: '货物提离', top10Table: 'v_imap_scct_sxfx_e_f', style: { width: 1090, height: 630 }, type: e.DATAF > temp.DATAF ? 0 : 1, time: e.DATAF, items: [{ name: (e.DATAF > temp.DATAF ? '超' : '低') + '去年均值', value: Math.abs(e.DATAF - temp.DATAF).toFixed(2), rate: (Math.abs(e.DATAF - temp.DATAF) / temp.DATAF * 100).toFixed(0) }, { name: (e.DATAF > data206(temp.DATAF) ? '超' : '低') + '目标值', value: Math.abs(e.DATAF - data206(temp.DATAF)).toFixed(2), rate: (Math.abs(e.DATAF - data206(temp.DATAF)) / data206(temp.DATAF) * 100).toFixed(0) }] },
                    ],
                ];
            }
            else {
                mdata = [
                    [
                        { layer: 'jk', name: '通关准备', top10Table: 'v_imap_scct_sxfx_i_b', style: { width: 1090, height: 630, marginRight: 50 }, type: e.DATAB > temp.DATAB ? 0 : 1, time: e.DATAB, items: [{ name: (e.DATAB > temp.DATAB ? '超' : '低') + '去年均值', value: Math.abs(e.DATAB - temp.DATAB).toFixed(2), rate: (Math.abs(e.DATAB - temp.DATAB) / temp.DATAB * 100).toFixed(0) }, { name: (e.DATAB > data206(temp.DATAB) ? '超' : '低') + '目标值', value: Math.abs(e.DATAB - data206(temp.DATAB)).toFixed(2), rate: (Math.abs(e.DATAB - data206(temp.DATAB)) / data206(temp.DATAB) * 100).toFixed(0) }] },
                        { layer: 'jk', name: '货物提离', top10Table: 'v_imap_scct_sxfx_i_c', style: { width: 1090, height: 630 }, type: e.DATAC > temp.DATAC ? 0 : 1, time: e.DATAC, items: [{ name: (e.DATAC > temp.DATAC ? '超' : '低') + '去年均值', value: Math.abs(e.DATAC - temp.DATAC).toFixed(2), rate: (Math.abs(e.DATAC - temp.DATAC) / temp.DATAC * 100).toFixed(0) }, { name: (e.DATAC > data206(temp.DATAC) ? '超' : '低') + '目标值', value: Math.abs(e.DATAC - data206(temp.DATAC)).toFixed(2), rate: (Math.abs(e.DATAC - data206(temp.DATAC)) / data206(temp.DATAC) * 100).toFixed(0) }] },
                    ],
                    [
                        // { layer: 'jk', name: '查验准备', top10Table: 'v_imap_scct_sxfx_i_d', style: { width: 1090, height: 630 }, type: e.DATAD > temp.DATAD ? 0 : 1, time: e.DATAD, items: [{ name: (e.DATAD > temp.DATAD ? '超' : '低') + '去年均值', value: Math.abs(e.DATAD - temp.DATAD).toFixed(2), rate: (Math.abs(e.DATAD - temp.DATAD) / temp.DATAD * 100).toFixed(0) }, { name: (e.DATAD > data206(temp.DATAD) ? '超' : '低') + '目标值', value: Math.abs(e.DATAD - data206(temp.DATAD)).toFixed(2), rate: (Math.abs(e.DATAD - data206(temp.DATAD)) / data206(temp.DATAD) * 100).toFixed(0) }] },
                        // { layer: 'jk', name: '查验作业', top10Table: 'v_imap_scct_sxfx_i_e', style: { width: 1090, height: 630 }, type: e.DATAE > temp.DATAE ? 0 : 1, time: e.DATAE, items: [{ name: (e.DATAE > temp.DATAE ? '超' : '低') + '去年均值', value: Math.abs(e.DATAE - temp.DATAE).toFixed(2), rate: (Math.abs(e.DATAE - temp.DATAE) / temp.DATAE * 100).toFixed(0) }, { name: (e.DATAE > data206(temp.DATAE) ? '超' : '低') + '目标值', value: Math.abs(e.DATAE - data206(temp.DATAE)).toFixed(2), rate: (Math.abs(e.DATAE - data206(temp.DATAE)) / data206(temp.DATAE) * 100).toFixed(0) }] },
                    ],
                ];
            }
            this.updateTop10({ tab: 'v_imap_scct_sxfx_e_b', cjk: mdata, datas: e.DATAA })
        });
    }

    updateTop10 = (top10Table) => {
        let month = Number(this.props.data.replace('月', ''));
        let year = new Date().getFullYear();
        publish('getData', { svn: 'skhg_stage', tableName: top10Table.tab, data: { pageno: 1, pagesize: 10, where: "EFFECTDATE='" + year + (month < 10 ? '0' : '') + month + "' ORDER BY DIS DESC" } }).then((res) => {
            let top10 = res[0].features.map((e) => e.attributes);
            this.setState({ top10: [], containerNo: null, [this.props.layer]: top10Table.cjk, dataa: top10Table.datas }, () => this.setState({ top10: top10, containerNo: top10[0].CONTAINERNO }));
        });
    }
    setPropsState = (selectIndex) => {
        this.setState({ selectIndex: selectIndex });
    }
    back = () => {
        publish('changeiframe', { index: 4, props: {} });
    }

    /** 环节时效  --》 预报警信息  -->打开报警面板 */
    handleYBJChange(e) {
        if (this.state.hthjsx < 3) {
            this.setState({ hthjsx: this.state.hthjsx + 1 });
        } else {
            this.setState({ hthjsx: 3, htcysx: 0 });
        }
    }

    /** 查验时效  --》实时动态 -->实时查验作业数据 */
    handleCYSXChange() {
        console.log('1')
        if (this.state.htcysx < 3) {
            this.setState({ htcysx: this.state.htcysx + 1 });
        } else {
            this.setState({ htcysx: 3, hthjsx: 0 });
        }
    }

    render() {
        let datas = this.state[this.props.layer];
        return (
            <div className='ac-ckbox'>
                <div className='ac-back' onClick={this.back}> <span style={{ 'position': 'relative', left: 120, 'whiteSpace': 'nowrap', 'fontSize': 80, top: '-5px' }}> 返回主页 </span></div>
                <div className='ac-backout' onClick={ () => this.setState({ htcysx: 0, hthjsx: 0 })}></div>
                {/* <div className='ac-close' onClick={() => publish('closeAC', false)}></div> */}
                <div className='ac-ckbox-title'>{this.props.data + (this.props.layer == 'ck' ? '出口' : '进口') + '通关时效分析'}</div>
                <div style={{ width: 3, height: 630, position: 'absolute', top: 360, left: 7705, background: '#1f9bff', zIndex: 999 }}></div>
                {/* <div style={{ width: 3, height: 630, position: 'absolute', top: 360, left: 9580, background: '#1f9bff', zIndex: 999 }}></div> */}
                <div style={{ position: 'absolute', top: 180, left: 5700, zIndex: 999, color: 'white', fontSize: '65px' }}>{this.props.layer == 'ck' ? '出口' : '进口'}通关整体时效</div>
                <div className='ac-ckbox-hthjxs' onClick={() => this.handleYBJChange()}>环节时效</div>
                <div style={{ position: 'absolute', top: 180, left: 8100, zIndex: 999, color: 'white', fontSize: '65px' }}>海关作业</div>
                <div className='ac-ckbox-htcysx' onClick={() => this.handleCYSXChange()}>查验时效</div>
                {/* <div style={{ position: 'absolute', top: 180, left: 9770, zIndex: 999, color: 'white', fontSize: '65px' }}>海关查验</div> */}
                <div className='ac-ckbox-t'>
                    <div style={{ background: "url('../agingControl/" + this.props.layer + ".png') no-repeat", backgroundSize: '100% 100%' }}></div>
                    <div>
                        <div>
                            {this.state.hthjsx > 0 ? <HT jck={this.props.layer} /> : datas[0].map((e, i) => <JD key={i} index={i + 1} datas={e} selected={this.state.selectIndex == e.top10Table} click={() => { this.setState({ selectIndex: e.top10Table }); this.updateTop10(e.top10Table); publish('noSelectCy'); }} />)}
                        </div>
                        <div>
                            {this.state.htcysx > 0 ? <Cysj datas={this.props.hgpjz} dataa={this.state.dataa} month={this.props.data} layer={this.props.layer} /> : <HG datas={this.props.hgpjz} dataa={this.state.dataa} month={this.props.data} layer={this.props.layer} />}
                        </div>
                        <div>
                            <CY datas={datas[1]} setPropsState={this.setPropsState} updateTop10={this.updateTop10} />
                        </div>
                    </div>
                    {this.state.hthjsx > 1 ? <div className='ac-ckbox-znybjs' onClick={() => this.setState({ hthjsx: 1 })}> <div className='ac-ckbox-znybjs-btn' /> <ZNYBJ /> </div> : <div />}
                    {this.state.htcysx > 1 ? <div className='ac-ckbox-znybjs' onClick={() => this.setState({ htcysx: 1 })}> <div className='ac-ckbox-znybjs-btn' /> <ZNYBJ /> </div> : <div />}
                </div>
                <div className='ac-ckbox-c'><div>诊断结论：</div><div>2018年{this.props.data}出口时效......</div></div>
                <div className='ac-ckbox-b'>
                    {this.state.top10.length > 0 ? <Top10 datas={this.state.top10} click={(containerNo) => this.setState({ containerNo: containerNo })} /> : null}
                    {this.state.containerNo ? <DataDesc containerNo={this.state.containerNo} /> : null}
                </div>
            </div>
        )
    }
}

// 进度组件
class JD extends React.Component {
    render() {
        let type = this.props.datas.type;
        return (
            <div className={'jd' + (this.props.selected ? ' jd-select' : '')} style={this.props.datas.style} onClick={this.props.click}>
                <div>{this.props.datas.name}</div>
                <div style={{ background: "url('../agingControl/" + this.props.datas.layer + '_' + this.props.index + '_' + type + ".png') no-repeat", backgroundSize: '100% 100%' }}></div>
                <div>
                    <div>平均时间：</div>
                    <div style={{ color: type == 1 ? '#70e100' : '#ff0000' }}>{this.props.datas.time}</div>
                    <div style={{ color: type == 1 ? '#70e100' : '#ff0000' }} >天</div>
                </div>
                <div>
                    {this.props.datas.items.map((e, i) => <JDEC key={i} type={this.props.datas.type} datas={e} />)}
                </div>
            </div>
        )
    }
}

/** 出进口环节时效 */
class HT extends React.Component {
    render() {
        return (
            <div className='ht'>
                <div className={'ht-' + this.props.jck}></div>
            </div>
        )
    }
}

class Cysj extends React.Component {
    componentDidMount() {
        this.update = (props) => {
            let month = props.month.replace('月', '');
            let time = new Date().getFullYear() + (month < 10 ? '0' : '') + month;
            let data = props.datas.data[time] ? Number(props.datas.data[time][props.layer]) : 0;
            let option = {
                color: ['#70e100', '#1890FF', '#0A3C77'],
                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        return '时效占比：10%'
                    },
                    textStyle: {
                        fontSize: 50,
                        color: '#70E100',
                    },
                },
                series: [
                    {
                        name: '作业时间占比',
                        type: 'pie',
                        radius: '90%',
                        center: ['50%', '50%'],
                        data: [
                            { value: 10, name: '时效' },
                            { value: 20, name: '1' },
                            { value: 30, name: '2' },
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                        label: {
                            normal: {
                                textStyle: {
                                    fontSize: 23,
                                },
                            },
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    width: 2,
                                },
                            },
                        },
                    },
                ],
            };
            if (this.chart) this.chart.dispose();
            this.chart = echarts.init(ReactDOM.findDOMNode(this.refs.echart));
            this.chart.setOption(option);
        }
        this.update(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.update(nextProps);
    }

    render() {
        let month = this.props.month.replace('月', '');
        let time = new Date().getFullYear() + (month < 10 ? '0' : '') + month;
        let data = this.props.datas.data[time] ? this.props.datas.data[time][this.props.layer] : 0;
        let pjz = this.props.datas.data[time] ? this.props.datas[this.props.layer] : 0;
        return (
            <div className='ac-chg'>
                <div className='ac-chg-r'>
                    <div ref='echart'></div>
                </div>
                <div className='ac-chg-num'>
                    <div style={{ color: '#70E100' }} className='ac-chg-num-house'><div className='ac-chg-num-house-num'>{data}</div><div className='ac-chg-num-house-ti'>小时</div></div>
                    <div>
                        <div><div>与平均值比：</div><div style={{ color: data > pjz ? '#FE0000' : '#70E100' }}>{data > pjz ? '高' : '低'}</div><div style={{ color: data > pjz ? '#FE0000' : '#70E100' }}>{Math.abs(data - pjz).toFixed(2)}小时</div></div>
                        <div><div>与目标值比：</div><div style={{ color: data > pjz / 3 * 2 ? '#FE0000' : '#70E100' }}>{data > pjz / 3 * 2 ? '高' : '低'}</div><div style={{ color: data > pjz / 3 * 2 ? '#FE0000' : '#70E100' }}>{Math.abs(data - pjz / 3 * 2).toFixed(2)}小时</div></div>
                    </div>
                </div>
            </div>
        )
    }
}


// 海关作业时效
class HG extends React.Component {
    componentDidMount() {
        this.update = (props) => {
            let month = props.month.replace('月', '');
            let time = new Date().getFullYear() + (month < 10 ? '0' : '') + month;
            let data = props.datas.data[time] ? Number(props.datas.data[time][props.layer]) : 0;
            let option = {
                color: ['#70e100', '#0A3C77'],
                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        return '海关作业时间占比：' + (params.name == '海关作业时间' ? params.percent : 100 - params.percent).toFixed(2) + '%'
                    },
                    textStyle: {
                        fontSize: 50,
                        color: '#70E100',
                    },
                },
                series: [
                    {
                        name: '作业时间占比',
                        type: 'pie',
                        radius: '90%',
                        center: ['50%', '50%'],
                        data: [
                            { value: data, name: '海关作业时间' },
                            { value: props.dataa * 24 - data, name: '其他作业时间' },
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                        label: {
                            normal: {
                                textStyle: {
                                    fontSize: 23,
                                },
                            },
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    width: 2,
                                },
                            },
                        },
                    },
                ],
            };
            if (this.chart) this.chart.dispose();
            this.chart = echarts.init(ReactDOM.findDOMNode(this.refs.echart));
            this.chart.setOption(option);
        }
        this.update(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.update(nextProps);
    }
    render() {
        let month = this.props.month.replace('月', '');
        let time = new Date().getFullYear() + (month < 10 ? '0' : '') + month;
        let data = this.props.datas.data[time] ? this.props.datas.data[time][this.props.layer] : 0;
        let pjz = this.props.datas.data[time] ? this.props.datas[this.props.layer] : 0;
        return (
            <div className='ac-hg'>
                <div className='ac-hg-l'>
                    <div>申报到放行</div>
                    <div style={{ color: '#70E100' }}><div>{data}</div><div>小时</div></div>
                </div>
                <div className='ac-hg-r'>
                    <div ref='echart'></div>
                </div>
                <div className='ac-hg-num'>
                    <div>
                        <div><div>与平均值比：</div><div style={{ color: data > pjz ? '#FE0000' : '#70E100' }}>{data > pjz ? '高' : '低'}</div><div style={{ color: data > pjz ? '#FE0000' : '#70E100' }}>{Math.abs(data - pjz).toFixed(2)}小时</div></div>
                        <div><div>与目标值比：</div><div style={{ color: data > pjz / 3 * 2 ? '#FE0000' : '#70E100' }}>{data > pjz / 3 * 2 ? '高' : '低'}</div><div style={{ color: data > pjz / 3 * 2 ? '#FE0000' : '#70E100' }}>{Math.abs(data - pjz / 3 * 2).toFixed(2)}小时</div></div>
                    </div>
                </div>
                <div className='ac-hg-ti'>
                    <div>海关作业时间在货物通关时间中的占比</div>
                </div>
            </div>
        )
    }
}

// 查验时效
class CY extends React.Component {
    state = {
        index: 0,
        selected: false,
        data: null,
    }
    componentDidMount() {
        this.sub_noSelectCy = subscribe('noSelectCy', () => this.setState({ selected: false }));
    }
    componentWillUnmount() {
        if (this.sub_noSelectCy) unsubscribe(this.sub_noSelectCy);
    }
    onClick = () => {
        let index = this.state.index;
        if (this.state.selected) index++;
        if (index >= this.props.datas.length) index = 0;
        this.setState({ index: index, selected: true }, () => {
            let data = this.props.datas[this.state.index];
            this.props.setPropsState(data.top10Table); this.props.updateTop10(data.top10Table);
        });
    }
    render() {
        let data = this.props.datas.length > 0 ? this.props.datas[this.state.index] : null;
        return (
            <div>
                {data ? <JD datas={data} selected={this.state.selected} click={this.onClick} /> : null}
            </div>
        )
    }
}

// echarts组件
class JDEC extends React.Component {
    state = {
        color: '#70e100',
    }
    componentDidMount() {
        this.update = (props) => {
            let data = Number(props.datas.rate);
            data = data <= 100 ? data : 100;
            let color = props.datas.name == '超目标值' ? '#ff0000' : props.datas.name == '低目标值' ? '#70e100' : props.type == 1 ? '#70e100' : '#ff0000';
            this.setState({ color: color });
            let ops = {
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['70%', '90%'],
                        avoidLabelOverlap: false,
                        labelLine: {
                            normal: {
                                show: false,
                            },
                        },
                        data: [
                            {
                                value: data,
                                itemStyle: {
                                    normal: {
                                        color: color,
                                    },
                                },
                                label: {
                                    normal: {
                                        formatter: () => Number(props.datas.rate) + '%',
                                        position: 'center',
                                        show: true,
                                        textStyle: {
                                            fontSize: '50',
                                            fontWeight: 'normal',
                                            color: color,
                                        },
                                    },
                                },
                            },
                            {
                                value: 100 - data, itemStyle: {
                                    normal: {
                                        color: '#ccc',
                                    },
                                },
                            },
                        ],
                    },
                ],
            };
            if (this.chart) this.chart.dispose();
            this.chart = echarts.init(ReactDOM.findDOMNode(this.refs.echart));
            this.chart.setOption(ops);
        }
        this.update(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.update(nextProps);
    }
    render() {
        let type = this.props.type;
        return (
            <div className='jd-ec'>
                <div ref='echart'></div>
                <div>
                    <div style={{ color: this.state.color }}>{this.props.datas.value}</div>
                    <div style={{ color: this.state.color }}>天</div>
                </div>
                <div>{this.props.datas.name}</div>
            </div>
        )
    }
}

// Top10组件
class Top10 extends React.Component {
    state = {
        select: 0,
    }
    render() {
        let items = this.props.datas;
        let maxDIS = items.length > 0 ? Number(items[0].DIS) : 0;
        return (
            <div className='top10'>
                <div className='top10-title'>前10名-TOP10</div>
                <div className='top10-l'></div>
                <div className='top10-r'>
                    {items.map((e, i) => <div className='hvr-bounce-to-right' key={i} onClick={() => { this.props.click(e.CONTAINERNO); this.setState({ select: i }); }} style={{ width: 100 - i * 2 + '%', fontSize: 50, color: i == 0 ? '#ff0000' : i == 1 ? '#ee7622' : i == 2 ? '#ffad29' : 'white', background: this.state.select == i ? '#062361' : '' }}>
                        <div>{e.CONTAINERNO}</div>
                        <div>{e.DIS}</div>
                        <div className={i <= 2 ? 'top-icon1-3' : 'top-icon4-10'}></div>
                    </div>)}
                </div>
            </div>
        )
    }
}

// 详细数据组件
class DataDesc extends React.Component {

    state = {
        jzxxx: {},
        jzxlsgj: [],
    }

    componentWillReceiveProps(nextProps) {
        this.update(nextProps.containerNo);
    }

    componentDidMount() {
        this.update = (containerNo) => {
            Promise.all([
                publish('webAction', { svn: 'eportapisct', path: 'GContainerInfo', data: { System: '', PageIndex: 1, PageSize: 30, SortBy: '', IsDescending: false, ContainerNo: containerNo } }),
                publish('webAction', { svn: 'eportapisct', path: 'GContainerHistoryInfo', data: { System: '', PageIndex: 1, PageSize: 30, SortBy: '', IsDescending: false, ContainerNo: containerNo } }),
            ]).then((res) => {
                this.setState({ jzxxx: res[0][0].InnerList[0], jzxlsgj: res[1][0].InnerList })
            });
        }
        this.update(this.props.containerNo);
    }

    render() {
        return (
            <div className='dd'>
                <div className='dd-t'>详情数据</div>
                <div className='dd-b scrollbar'>
                    <OneRecordTable jzxxx={this.state.jzxxx} />
                    <div className='dd-b-line'></div>
                    <TwoRecordTable jzxlsgj={this.state.jzxlsgj} />
                </div>
            </div>
        )
    }
}

// 单条数据详情组件
class OneRecordTable extends React.Component {
    render() {
        let map = [
            { title: 'IMO号', dataIndex: 'IMO' },
            { title: '箱主', dataIndex: 'LineId' },
            { title: '船名航次', dataIndex: 'OutVesselVoyage' },
            { title: '作业码头', dataIndex: 'DbId' },
            { title: '总提运单号', dataIndex: 'BlNbr' },
            { title: '出口商业航次号', dataIndex: 'OutBusinessVoy' },
            { title: '订舱号', dataIndex: 'BookingEdo' },
            { title: '箱号', dataIndex: 'ContainerNbr' },
            { title: '箱型尺寸高度', dataIndex: 'SzTpHt' },
            { title: '空重', dataIndex: 'Status' },
            { title: '进出口状态', dataIndex: 'Category' },
            { title: '进口商业航次号', dataIndex: 'InBusinessVoy' },
            { title: '当前位置', dataIndex: 'Location' },
            { title: '装货港', dataIndex: 'PolAlias' },
            { title: '海关放行时间', dataIndex: 'CUS' },
            { title: '目的港', dataIndex: 'Destination' },
            { title: '卸货港', dataIndex: 'PodAlias' },
            // { title: '国检放行时间', dataIndex: 'CIQ' },
            { title: '集中查验时间', dataIndex: 'CicTime' },
            { title: '集中查验状态', dataIndex: 'CicStatus' },
            { title: '进场时间', dataIndex: 'InTime' },
            { title: '离港时间', dataIndex: 'OutTime' },
            { title: '海关查验状态、国检查验状态、放行状态', dataIndex: 'ReleaseStatus' },
        ];
        let json = this.props.jzxxx;
        let datas1 = map.map((e) => { return { key: e.title, value: json[e.dataIndex] } });
        return (
            <div className='ort scrollbar'>
                {
                    datas1.length > 0 ? datas1.map((e, i) => {
                        return <div className="ort_ty" key={'xx' + i}>
                            <div title={e.key} className="ort_ty_key">{e.key}：</div>
                            <div title={e.value} className="ort_ty_val">{e.value}</div>
                        </div>
                    }) : <div />
                }
            </div>
        )
    }
}

// 第二栏展示内容
class TwoRecordTable extends React.Component {
    render() {
        let flds2 = [
            { title: '港区', dataIndex: 'DbId' },
            { title: '船公司', dataIndex: 'ContainerOwner' },
            { title: '操作', dataIndex: 'OpType' },
            { title: '操作时间', dataIndex: 'OpTime' },
            { title: '操作服务', dataIndex: 'ColumnName' },
            { title: '从', dataIndex: 'OldValue' },
            { title: '到', dataIndex: 'NewValue' },
        ];
        return (
            <Table rowNo={true} title={null} style={{ width: 3860, height: 720 }} id={'id2'} selectedIndex={null} flds={flds2} datas={this.props.jzxlsgj} trClick={null} trDbclick={null} />
        )
    }
}