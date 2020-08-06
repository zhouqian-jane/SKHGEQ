import '../less';
import 'animate.css';
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import echarts from 'echarts';
import { publish, subscribe, unsubscribe } from '../../../frame/core/arbiter';
import { Table } from '../../../frame/componets/index';
import ZNYBJ from './ZNYBJ';
import exportImg from '../../../frame/images/导出.png'
import closeImg from '../../../frame/images/关闭表格.png'

var Mock = require('mockjs')

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
        param: (Number(new Date().getMonth() === 0 ? new Date().getMonth() + 1 : new Date().getMonth())) + '月',
        sx: false,
        selYear: new Date().getFullYear() - 1,

    }
    componentDidMount() {
        this.newUpdate();
    }


    newUpdate = () => {
        this.update = () => {
            let pjz = this.state.pjz;
            let jkData = [];
            let ckData = [];
            if (pjz.jk) {
                for (let i = 0; i < 12; i++) {
                    jkData.push(pjz.jk.DATAA);
                    ckData.push(pjz.ck.DATAA);
                }
            }
            let mbckData = ckData.map((e) => (e / 3 * 2).toFixed(2));
            let mbjkData = jkData.map((e) => (e / 3 * 2).toFixed(2));
            let otherMbcData = ckData.map((e) => (e / 2).toFixed(2));
            let otherMbjData = jkData.map((e) => (e / 2).toFixed(2));
            publish('getData', { svn: 'skhg_stage', tableName: 'imap_scct_sxfx_01', data: { where: `category='E' and EFFECTDATE LIKE ${this.state.selYear} ||'%' order by EFFECTDATE` } }).then((res) => {
                let data = res[0].features.map((e) => e.attributes.DATAA);
                for (let i = 0; i < 12 - data.length; i++) {
                    data.push(0);
                }
                console.log(data);
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
                            data: this.state.selYear > 2018 ? otherMbcData : mbckData,
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
                                            color: this.state.selYear > 2018 ? e < otherMbcData[0] ? '#1890ff' : e < ckData[0] ? '#dbcf01' : '#f00' : e < mbckData[0] ? '#1890ff' : e < ckData[0] ? '#dbcf01' : '#f00',
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
                this.chart1 = echarts.init(document.getElementById('echart1'));
                this.chart1.setOption(ops);
                this.chart1.on('click', (param) => {
                    if (param.seriesType == 'bar') this.setState({ layer: 'ck', param: param.name, sx: !this.state.sx });
                });
            });
            publish('getData', { svn: 'skhg_stage', tableName: 'imap_scct_sxfx_01', data: { where: `category='I' and EFFECTDATE LIKE ${this.state.selYear} ||'%' ORDER BY EFFECTDATE` } }).then((res) => {
                // publish('getData', { svn: 'skhg_stage', tableName: 'imap_scct_sxfx_01', data: { where: "category='I' and EFFECTDATE LIKE '2018'" } }).then((res) => {
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
                            data: this.state.selYear > 2018 ? otherMbjData : mbjkData,
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
                                            color: this.state.selYear > 2018 ? Number(e) < Number(otherMbjData[0]) ? '#1890ff' : Number(e) < Number(jkData[0]) ? '#dbcf00' : '#f00' : Number(e) < Number(mbjkData[0]) ? '#1890ff' : Number(e) < Number(jkData[0]) ? '#dbcf00' : '#f00',
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
                // this.chart2 = echarts.init(ReactDOM.findDOMNode(this.refs.echart2));
                this.chart2 = echarts.init(document.getElementById('echart2'));
                this.chart2.setOption(ops);
                this.chart2.on('click', (param) => {
                    if (param.seriesType == 'bar') this.setState({ layer: 'jk', param: param.name });
                });
            });
        }
        publish('getData', { svn: 'skhg_stage', tableName: 'imap_scct_sxfx', data: { where: `EFFECTYEAR = ${this.state.selYear - 1}` } }).then((res) => {
            let pjz = {};
            res[0].features.forEach((e) => pjz[e.attributes.CATEGORY == 'E' ? 'ck' : 'jk'] = e.attributes);
            this.setState({ pjz }, this.update);
        });
        // publish('getData', { svn: 'skhg_loader', tableName: 'imap_skhg_sxfx', data: { where: "EFFECTDATE LIKE to_char(sysdate,'yyyy')-1||'%' OR EFFECTDATE LIKE to_char(sysdate,'yyyy')||'%'" } }).then((res) => {
        publish('getData', { svn: 'skhg_loader', tableName: 'imap_skhg_sxfx', data: { where: `EFFECTDATE LIKE '${this.state.selYear - 1}%' or EFFECTDATE LIKE '${this.state.selYear}%'` } }).then((res) => {
            let year = this.state.selYear + '';
            let thisyear = {};
            let jk = 0;
            let ck = 0;
            let count = 0;
            res[0].features.forEach((e) => {
                if (e.attributes.EFFECTDATE.indexOf(year) >= 0) {
                    thisyear[e.attributes.EFFECTDATE] = { jk: e.attributes.CUSIN, ck: e.attributes.CUSOUT };
                } else {
                    count++;
                    jk = jk + Number(e.attributes.CUSIN);
                    ck = ck + Number(e.attributes.CUSOUT);
                }
            });
            jk = (jk / count).toFixed(2) || 0;
            ck = (ck / count).toFixed(2) || 0;
            this.setState({ hgpjz: { jk: jk, ck: ck, data: thisyear } });
        });
    }

    /** 下拉框==》按钮事件 */
    handleSel = (e) => {
        this.setState({
            selYear: e.target.value,
        }, () => this.newUpdate());
    }

    render() {
        const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028'];
        return (
            <div className='ac'>
                <div className="ac-find">
                    <div className='ac-find-na'>选择年份</div>
                    <select className="ac-find-year" onChange={this.handleSel.bind(this)} >
                        {
                            years.map((e) => {
                                if (Number(new Date().getFullYear()) >= Number(e)) {
                                    return <option key={e} value={e}>{e}</option>
                                }
                            })
                        }
                    </select>
                </div>
                <div>
                    <div className='ac-box'>
                        <div ref='echart1' id='echart1' className='ac-box-t'></div>
                        <div ref='echart2' id='echart2' className='ac-box-b'></div>
                    </div>
                </div>
                {
                    this.state.sx == true ? <CK selYear={this.state.selYear} layer={this.state.layer} data={this.state.param} hgpjz={this.state.hgpjz} pjz={this.state.pjz[this.state.layer]} /> : <CK selYear={this.state.selYear} layer={this.state.layer} data={this.state.param} hgpjz={this.state.hgpjz} pjz={this.state.pjz[this.state.layer]} />
                }
            </div>
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
        sjhxsj: [],
        showDiagnosisConclusionDialog: false,
    }

    componentDidMount() {
        this.showtab = (props) => {
            let layer = props.layer;
            let month = Number(props.data.replace('月', ''));
            let year = props.selYear;
            let time = year + (month < 10 ? '0' : '') + month;
            publish('getData', { svn: 'skhg_stage', tableName: 'imap_scct_sxfx_01', data: { where: "category = '" + (props.layer == 'ck' ? 'E' : 'I') + "' and EFFECTDATE='" + time + "'" } }).then((res) => {
                let e = {};
                if (res[0].features.length > 0) {
                    e = res[0].features[0].attributes;
                } else {
                    e.DATAA = 0;
                    e.DATAB = 0;
                    e.DATAC = 0;
                    e.DATAD = 0;
                    e.DATAE = 0;
                    e.DATAF = 0;
                }
                let xc_sb = (((Number(e.DATAB) * 24) - (props.hgpjz.data[time] ? Number(props.hgpjz.data[time].ck) : 0)) / 24).toFixed(2);
                // let xc_sb = '0.64';
                e.DATAA = Number(e.DATAA);
                e.DATAB = (Number(e.DATAB) - (props.hgpjz.data[time] ? Number(props.hgpjz.data[time].ck) : 0) / 24).toFixed(2);
                // e.DATAB = '0.88';
                e.DATAC = Number(e.DATAC);
                e.DATAD = Number(e.DATAD);
                e.DATAE = Number(e.DATAE);
                e.DATAF = Number(e.DATAF);
                let data206 = (data) => (data * 2 / 3).toFixed(2);
                let mdata = [];
                let temp = props.pjz || {};
                temp.DATAA = Number(props.pjz ? temp.DATAA : 0);
                temp.DATAB = Number(props.pjz ? temp.DATAB : 0);
                temp.DATAC = Number(props.pjz ? temp.DATAC : 0);
                temp.DATAD = Number(props.pjz ? temp.DATAD : 0);
                temp.DATAE = Number(props.pjz ? temp.DATAE : 0);
                temp.DATAF = Number(props.pjz ? temp.DATAF : 0);
                this.setState({ sjhxsj: [xc_sb, props.hgpjz.data[time] ? Number(props.hgpjz.data[time].ck) : 0, e.DATAC, e.DATAD, e.DATAE, e.DATAF > 0 ? e.DATAF : ''] });
                if (props.layer == 'ck') {
                    mdata = [
                        [
                            { layer: 'ck', name: '海关全口径（入闸到单证放行）', top10Table: 'v_imap_scct_sxfx_e_b', style: { width: 1090, height: 630 }, type: e.DATAB > temp.DATAB ? 0 : 1, time: e.DATAB, items: [{ name: (e.DATAB > temp.DATAB ? '超' : '低') + '去年均值', value: Math.abs(e.DATAB - temp.DATAB).toFixed(2), rate: (Math.abs(e.DATAB - temp.DATAB) / temp.DATAB * 100).toFixed(0) }, { name: (e.DATAB > data206(temp.DATAB) ? '超' : '低') + '目标值', value: Math.abs(e.DATAB - data206(temp.DATAB)).toFixed(2), rate: (Math.abs(e.DATAB - data206(temp.DATAB)) / data206(temp.DATAB) * 100).toFixed(0) }] },
                            { layer: 'ck', name: '货物提离', top10Table: 'v_imap_scct_sxfx_e_c', style: { width: 1090, height: 630 }, type: e.DATAC > temp.DATAC ? 0 : 1, time: e.DATAC, items: [{ name: (e.DATAC > temp.DATAC ? '超' : '低') + '去年均值', value: Math.abs(e.DATAC - temp.DATAC).toFixed(2), rate: (Math.abs(e.DATAC - temp.DATAC) / temp.DATAC * 100).toFixed(0) }, { name: (e.DATAC > data206(temp.DATAC) ? '超' : '低') + '目标值', value: Math.abs(e.DATAC - data206(temp.DATAC)).toFixed(2), rate: (Math.abs(e.DATAC - data206(temp.DATAC)) / data206(temp.DATAC) * 100).toFixed(0) }] },
                        ],
                        [
                            { layer: 'ck', name: '查验准备', top10Table: 'v_imap_scct_sxfx_e_d', style: { width: 1090, height: 630 }, type: e.DATAD > temp.DATAD ? 0 : 1, time: e.DATAD, items: [{ name: (e.DATAD > temp.DATAD ? '超' : '低') + '去年均值', value: Math.abs(e.DATAD - temp.DATAD).toFixed(2), rate: (Math.abs(e.DATAD - temp.DATAD) / temp.DATAD * 100).toFixed(0) }, { name: (e.DATAD > data206(temp.DATAD) ? '超' : '低') + '目标值', value: Math.abs(e.DATAD - data206(temp.DATAD)).toFixed(2), rate: (Math.abs(e.DATAD - data206(temp.DATAD)) / data206(temp.DATAD) * 100).toFixed(0) }] },
                            { layer: 'ck', name: '查验作业', top10Table: 'v_imap_scct_sxfx_e_e', style: { width: 1090, height: 630 }, type: e.DATAE > temp.DATAE ? 0 : 1, time: e.DATAE, items: [{ name: (e.DATAE > temp.DATAE ? '超' : '低') + '去年均值', value: Math.abs(e.DATAE - temp.DATAE).toFixed(2), rate: (Math.abs(e.DATAE - temp.DATAE) / temp.DATAE * 100).toFixed(0) }, { name: (e.DATAE > data206(temp.DATAE) ? '超' : '低') + '目标值', value: Math.abs(e.DATAE - data206(temp.DATAE)).toFixed(2), rate: (Math.abs(e.DATAE - data206(temp.DATAE)) / data206(temp.DATAE) * 100).toFixed(0) }] },
                            { layer: 'ck', name: '货物提离', top10Table: 'v_imap_scct_sxfx_e_f', style: { width: 1090, height: 630 }, type: e.DATAF > temp.DATAF ? 0 : 1, time: e.DATAF, items: [{ name: (e.DATAF > temp.DATAF ? '超' : '低') + '去年均值', value: Math.abs(e.DATAF - temp.DATAF).toFixed(2), rate: (Math.abs(e.DATAF - temp.DATAF) / temp.DATAF * 100).toFixed(0) }, { name: (e.DATAF > data206(temp.DATAF) ? '超' : '低') + '目标值', value: Math.abs(e.DATAF - data206(temp.DATAF)).toFixed(2), rate: (Math.abs(e.DATAF - data206(temp.DATAF)) / data206(temp.DATAF) * 100).toFixed(0) }] },
                        ],
                    ];
                }
                else {
                    mdata = [
                        [
                            { layer: 'jk', name: '海关全口径（卸船到实货放行）', top10Table: 'v_imap_scct_sxfx_i_b', style: { width: 1090, height: 630, marginRight: 50 }, type: e.DATAB > temp.DATAB ? 0 : 1, time: e.DATAB, items: [{ name: (e.DATAB > temp.DATAB ? '超' : '低') + '去年均值', value: Math.abs(e.DATAB - temp.DATAB).toFixed(2), rate: (Math.abs(e.DATAB - temp.DATAB) / temp.DATAB * 100).toFixed(0) }, { name: (e.DATAB > data206(temp.DATAB) ? '超' : '低') + '目标值', value: Math.abs(e.DATAB - data206(temp.DATAB)).toFixed(2), rate: (Math.abs(e.DATAB - data206(temp.DATAB)) / data206(temp.DATAB) * 100).toFixed(0) }] },
                            { layer: 'jk', name: '货物提离', top10Table: 'v_imap_scct_sxfx_i_c', style: { width: 1090, height: 630 }, type: e.DATAC > temp.DATAC ? 0 : 1, time: e.DATAC, items: [{ name: (e.DATAC > temp.DATAC ? '超' : '低') + '去年均值', value: Math.abs(e.DATAC - temp.DATAC).toFixed(2), rate: (Math.abs(e.DATAC - temp.DATAC) / temp.DATAC * 100).toFixed(0) }, { name: (e.DATAC > data206(temp.DATAC) ? '超' : '低') + '目标值', value: Math.abs(e.DATAC - data206(temp.DATAC)).toFixed(2), rate: (Math.abs(e.DATAC - data206(temp.DATAC)) / data206(temp.DATAC) * 100).toFixed(0) }] },
                        ],
                        [
                            { layer: 'jk', name: '查验准备', top10Table: 'v_imap_scct_sxfx_i_d', style: { width: 1090, height: 630 }, type: e.DATAD > temp.DATAD ? 0 : 1, time: e.DATAD, items: [{ name: (e.DATAD > temp.DATAD ? '超' : '低') + '去年均值', value: Math.abs(e.DATAD - temp.DATAD).toFixed(2), rate: (Math.abs(e.DATAD - temp.DATAD) / temp.DATAD * 100).toFixed(0) }, { name: (e.DATAD > data206(temp.DATAD) ? '超' : '低') + '目标值', value: Math.abs(e.DATAD - data206(temp.DATAD)).toFixed(2), rate: (Math.abs(e.DATAD - data206(temp.DATAD)) / data206(temp.DATAD) * 100).toFixed(0) }] },
                            { layer: 'jk', name: '查验作业', top10Table: 'v_imap_scct_sxfx_i_e', style: { width: 1090, height: 630 }, type: e.DATAE > temp.DATAE ? 0 : 1, time: e.DATAE, items: [{ name: (e.DATAE > temp.DATAE ? '超' : '低') + '去年均值', value: Math.abs(e.DATAE - temp.DATAE).toFixed(2), rate: (Math.abs(e.DATAE - temp.DATAE) / temp.DATAE * 100).toFixed(0) }, { name: (e.DATAE > data206(temp.DATAE) ? '超' : '低') + '目标值', value: Math.abs(e.DATAE - data206(temp.DATAE)).toFixed(2), rate: (Math.abs(e.DATAE - data206(temp.DATAE)) / data206(temp.DATAE) * 100).toFixed(0) }] },
                        ],
                    ];
                }
                this.updateTop10({ tab: 'v_imap_scct_sxfx_e_b', cjk: mdata, datas: e.DATAA })
            });
        };
        this.showtab(this.props);
    }

    componentWillReceiveProps(pro) {
        this.showtab(pro);
    }

    updateTop10 = (top10Table) => {
        let month = Number(this.props.data.replace('月', ''));
        let year = this.props.selYear;
        // let year = "2018";
        publish('getData', { svn: 'skhg_stage', tableName: top10Table.tab, data: { pageno: 1, pagesize: 10, where: "EFFECTDATE='" + year + (month < 10 ? '0' : '') + month + "' ORDER BY DIS DESC" } }).then((res) => {
            let top10 = res[0].features.map((e) => e.attributes);
            this.setState({ top10: [], containerNo: null, [this.props.layer]: top10Table.cjk, dataa: top10Table.datas }, () => this.setState({ top10: top10, containerNo: top10.length > 0 ? top10[0].CONTAINERNO : '' }));
        });
    }
    setPropsState = (selectIndex) => {
        this.setState({ selectIndex: selectIndex });
    }
    back = () => {
        publish('changeiframe', { index: 5, props: {} });
    }

    /** 环节时效  --》 预报警信息  -->打开报警面板 */
    handleYBJChange(e) {
        if (this.state.hthjsx < 1) {
            this.setState({ hthjsx: this.state.hthjsx + 1, htcysx: this.state.htcysx > 1 ? this.state.htcysx - 1 : this.state.htcysx });
        } else {
            this.setState({ hthjsx: 2, htcysx: this.state.htcysx > 1 ? this.state.htcysx - 1 : this.state.htcysx }, () => {
                $('.znybj').addClass('zoomIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => $('.znybj').removeClass('zoomIn animated'));
            });
        }
    }

    /** 查验时效  --》实时动态 -->实时查验作业数据 */
    handleCYSXChange() {
        if (this.state.htcysx < 1) {
            this.setState({ htcysx: this.state.htcysx + 1, hthjsx: this.state.hthjsx > 1 ? this.state.hthjsx - 1 : this.state.hthjsx });
        } else {
            this.setState({ htcysx: 2, hthjsx: this.state.hthjsx > 1 ? this.state.hthjsx - 1 : this.state.hthjsx }, () => {
                $('.sycyzyTab').addClass('zoomIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => $('.sycyzyTab').removeClass('zoomIn animated'));
            });
        }
    }

    handleShowDiagnosisConclusionDialog = () => {
        this.setState({
            showDiagnosisConclusionDialog: true,
        }, () => {
            $('#diagnosisConclusionDialog').addClass('zoomIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => $('#diagnosisConclusionDialog').removeClass('zoomIn animated'));
        })
    }   

    render() {
        const {showDiagnosisConclusionDialog, ck} = this.state;
        let datas = this.state[this.props.layer];
        const fldsTest1 = [
            {
                title: '海关全口径(入闸到单证放行)',
                children: [
                    {
                        title: '平均时间',
                        dataIndex: 'data1',
                    }, {
                        title: '比去年均值',
                        dataIndex: 'data2',
                    }, {
                        title: '比目标值',
                        dataIndex: 'data3',
                    }, 
                ],
            }, {
                title: '货物提离',
                children: [
                    {
                        title: '平均时间',
                        dataIndex: 'data4',
                    }, {
                        title: '比去年均值',
                        dataIndex: 'data5',
                    }, {
                        title: '比目标值',
                        dataIndex: 'data6',
                    },
                ],
            },
        ]
        const fldsTest2 = [
            {
                title: '',
                dataIndex: 'data1',
            },
            {
                title: '查验准备',
                dataIndex: 'data2',
            },
            {
                title: '与平均时间比',
                dataIndex: 'data3',
            },
            {
                title: '与目标值比',
                dataIndex: 'data4',
            },
        ]
        let dataTest1 = []
        let dataTest2 = []

        if (ck && ck[0] && ck[0][0] && ck[0][0].items) {
            dataTest1 = [{
                data1: `${ck[0][0].time}天`,
                data2: `${ck[0][0].items[0].name.slice(0, 1)}${ck[0][0].items[0].value}天 ${ck[0][0].items[0].rate}%`,
                data3: `${ck[0][0].items[1].name.slice(0, 1)}${ck[0][0].items[1].value}天 ${ck[0][0].items[1].rate}%`,
                data4: `${ck[0][1].time}天`,
                data5: `${ck[0][1].items[0].name.slice(0, 1)}${ck[0][1].items[0].value}天 ${ck[0][1].items[0].rate}%`,
                data6: `${ck[0][1].items[1].name.slice(0, 1)}${ck[0][1].items[1].value}天 ${ck[0][1].items[1].rate}%`,
            }]

            let month = this.props.data.replace('月', '');
            let time = this.props.selYear + (month < 10 ? '0' : '') + month;
            let data = this.props.hgpjz.data[time] ? this.props.hgpjz.data[time][this.props.layer] : 0;
            let pjz = this.props.hgpjz.data[time] ? this.props.hgpjz[this.props.layer] : 0;
            dataTest2 = [
                {
                    data1: '查验准备',
                    data2: `${ck[1][0].time}天`,
                    data3: `${ck[1][0].items[0].name.slice(0, 1)}${ck[1][0].items[0].value}天 ${ck[1][0].items[0].rate}%`,
                    data4: `${ck[1][0].items[1].name.slice(0, 1)}${ck[1][0].items[1].value}天 ${ck[1][0].items[1].rate}%`,
                }, {
                    data1: '查验作业',
                    data2: `${ck[1][1].time}天`,
                    data3: `${ck[1][1].items[0].name.slice(0, 1)}${ck[1][1].items[0].value}天 ${ck[1][1].items[0].rate}%`,
                    data4: `${ck[1][1].items[1].name.slice(0, 1)}${ck[1][1].items[1].value}天 ${ck[1][1].items[1].rate}%`,
                }, {
                    data1: '货物提离',
                    data2: `${ck[1][2].time}天`,
                    data3: `${ck[1][2].items[0].name.slice(0, 1)}${ck[1][2].items[0].value}天 ${ck[1][2].items[0].rate}%`,
                    data4: `${ck[1][2].items[1].name.slice(0, 1)}${ck[1][2].items[1].value}天 ${ck[1][2].items[1].rate}%`,
                }, {
                    data1: '申报到放行',
                    data2: `${data}小时`,
                    data3: `${data > pjz ? '高' : '低'}${Math.abs(data - pjz).toFixed(2)}小时`,
                    data4: `${data > pjz / 3 * 2 ? '高' : '低'} ${Math.abs(data - pjz / 3 * 2).toFixed(2)}小时`,
                },
            ]
        }
        const ys = {
            left: 7711,
            width: 3740,
            height: 2030,
        };

        return (
            <div className='ac-ckbox'>
                <div className='ac-back' onClick={this.back}> <span style={{ 'position': 'relative', left: 120, 'whiteSpace': 'nowrap', 'fontSize': 80, top: '-5px' }}> 返回主页 </span></div>
                {this.state.htcysx > 0 ? <div className='ac-lbackout' onClick={() => this.setState({ htcysx: 0 })}></div> : null}
                {this.state.hthjsx > 0 ? <div className='ac-rbackout' onClick={() => this.setState({ hthjsx: 0 })}></div> : null}
                <div className='ac-ckbox-title'>{this.props.data + (this.props.layer == 'ck' ? '出口' : '进口') + '通关时效分析'}</div>
                <div style={{ width: 3, height: 630, position: 'absolute', top: 360, left: 7705, background: '#1f9bff', zIndex: 999 }}></div>
                <div style={{ position: 'absolute', top: 180, left: 5700, zIndex: 999, color: 'white', fontSize: '65px' }}>{this.props.layer == 'ck' ? '出口' : '进口'}通关整体时效</div>
                <div className='ac-ckbox-hthjxs' onClick={() => this.handleYBJChange()}>{this.state.hthjsx < 1 ? '环节时效' : '预报警信息'}</div>
                <div style={{ position: 'absolute', top: 180, left: 8100, zIndex: 999, color: 'white', fontSize: '65px' }}>海关作业</div>
                <div className='ac-ckbox-htcysx' onClick={() => this.handleCYSXChange()}>{this.state.htcysx < 1 ? '查验时效' : '实时动态'}</div>
                <div className='ac-ckbox-t'>
                    <div style={{ background: "url('../agingControl/" + this.props.layer + ".png') no-repeat", backgroundSize: '100% 100%' }}></div>
                    <div>
                        <div>
                            {this.state.hthjsx > 0 ? <HT jck={this.props.layer} sj={this.state.sjhxsj} /> : datas[0].map((e, i) => <JD key={i} index={i + 1} datas={e} selected={this.state.selectIndex == e.top10Table} click={() => { this.setState({ selectIndex: e.top10Table }); this.updateTop10(e.top10Table); publish('noSelectCy'); }} />)}
                        </div>
                        <div>
                            {this.state.htcysx > 0 ? <Cysj da={datas[1]} datas={this.props.hgpjz} dataa={this.state.dataa} month={this.props.data} layer={this.props.layer} /> : <HG datas={this.props.hgpjz} dataa={this.state.dataa} selYear={this.props.selYear} month={this.props.data} layer={this.props.layer} />}
                        </div>
                        {/* <div>
                            <CY datas={datas[1]} setPropsState={this.setPropsState} updateTop10={this.updateTop10} />
                        </div> */}
                    </div>
                    {this.state.hthjsx > 1 ? <div className='ac-ckbox-znybjs' > <ZNYBJ ys={ys} xz={1} gb={() => this.setState({ hthjsx: 1 })} /> </div> : <div />}
                    {this.state.htcysx > 1 ? <div className='ac-ckbox-znybjs' > <Sycyzy gb={() => this.setState({ htcysx: 1 })} /> </div> : <div />}
                </div>
                <div className='ac-ckbox-c'><div>诊断结论：</div><div onClick={this.handleShowDiagnosisConclusionDialog}>{this.props.selYear}年{this.props.data}出口时效......</div></div>
                <div className='ac-ckbox-b'>
                    {this.state.top10.length > 0 ? <Top10 datas={this.state.top10} click={(containerNo) => this.setState({ containerNo: containerNo })} /> : null}
                    {this.state.containerNo ? <DataDesc containerNo={this.state.containerNo} /> : null}
                </div>
                {
                    showDiagnosisConclusionDialog && (
                        <div id="diagnosisConclusionDialog" style={{position: 'absolute', width: '1900px', height: '2700px', zIndex: 9999, background: '#000', left: '5400px', top: '300px', border: '10px solid #219bff', padding: '0 80px'}}>
                            <p style={{height: '150px', lineHeight: '150px', textAlign: 'right' }}>
                                <img src={exportImg} style={{width: '70px', height: '70px', margin: '0 50px'}} />
                                <img src={closeImg} style={{width: '70px', height: '70px'}} onClick={() => {this.setState({showDiagnosisConclusionDialog: false})}}/>
                            </p>
                            <p style={{color: '#fff', textAlign: 'center', fontSize: '80px', height: '200px', lineHeight: '200px'}}>通关时效诊断结论</p>
                    <p style={{fontSize: '60px', height: '100px', lineHeight: '100px', color: '#fff', textAlign: 'right', borderBottom: '10px solid #219bff'}}>时间：{this.props.selYear}年{this.props.data}</p>
                            <Table title={{name: '出口海关整体时效'}} multipleHeader style={{ width: 1900, height: 800 }} id={'a1'} flds={fldsTest1} datas={dataTest1} unFilter />
                            <Table title={{name: '海关作业'}} style={{ width: 1900, height: 1000, margin: '80px 0' }} id={'a1'} flds={fldsTest2} datas={dataTest2} />
                    <p style={{fontSize: '60px', height: '100px', lineHeight: '100px', marginTop: '80px', color: '#fff', textAlign: 'right', borderTop: '10px solid #219bff'}}>打印时间：{new Date().getFullYear()}/{new Date().getMonth()}/{new Date().getDate()} {new Date().getHours()}:{new Date().getMinutes()}:{new Date().getSeconds()}</p>
                        </div>
                    )
                }
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
        const { jck, sj } = this.props;
        return (
            <div className='ht'>
                <div className={'ht-' + jck}></div>
                <div className={'ht-sj' + jck}>
                    {
                        sj.map((e, i) => {
                            if (e !== '') {
                                return <span key={Math.random(100)} className={'ht-sj' + jck + '-' + i}>{e}{i == 1 ? '小时' : '天'}</span>
                            }
                        })
                    }
                </div>
            </div>
        )
    }
}

class Cysj extends React.Component {

    state = {
        json: [],
    }

    componentDidMount() {
        this.setState({
            json: {
                name: this.props.da[0].name,
                time: this.props.da[0].time,
                num: this.props.da[0].items,
                pjzys: this.props.da[0].items[0].name == '超目标值' ? '#ff0000' : this.props.da[0].items[0].name == '低目标值' ? '#70e100' : this.props.da[0].type == 1 ? '#70e100' : '#ff0000',
                mbzys: this.props.da[0].items[1].name == '超目标值' ? '#ff0000' : this.props.da[0].items[1].name == '低目标值' ? '#70e100' : this.props.da[0].type == 1 ? '#70e100' : '#ff0000',
            },
        })
        this.update = (props) => {
            let dt = [];
            let a = (props.da).sort((a, b) => a.time - b.time);
            for (let i in a) {
                dt.push({ name: a[i].name, value: a[i].time, num: i })
            }
            let month = props.month.replace('月', '');
            let time = (new Date().getFullYear() - 1) + (month < 10 ? '0' : '') + month;
            // let data = props.datas.data[time] ? Number(props.datas.data[time][props.layer]) : 0;
            let option = {
                color: ['#1890FF', '#0A3C77', '#70e100'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} :{c}%',
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
                        data: dt,
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
            this.chart.on('click', (param) => {
                if (param.seriesType === 'pie') this.setState({
                    json: {
                        name: this.props.da[param.data.num].name,
                        time: this.props.da[param.data.num].time,
                        num: this.props.da[param.data.num].items,
                        pjzys: this.props.da[param.data.num].items[0].name == '超目标值' ? '#ff0000' : this.props.da[param.data.num].items[0].name == '低目标值' ? '#70e100' : this.props.da[param.data.num].type == 1 ? '#70e100' : '#ff0000',
                        mbzys: this.props.da[param.data.num].items[1].name == '超目标值' ? '#ff0000' : this.props.da[param.data.num].items[1].name == '低目标值' ? '#70e100' : this.props.da[param.data.num].type == 1 ? '#70e100' : '#ff0000',
                    },
                })
            });
        }
        this.update(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.update(nextProps);
    }

    render() {
        let { json = {} } = this.state;
        let month = this.props.month.replace('月', '');
        let time = (new Date().getFullYear() - 1) + (month < 10 ? '0' : '') + month;
        let data = this.props.datas.data[time] ? this.props.datas.data[time][this.props.layer] : 0;
        let pjz = this.props.datas.data[time] ? this.props.datas[this.props.layer] : 0;
        return (
            <div className='ac-chg'>
                <div className='ac-chg-r'>
                    <div ref='echart'></div>
                </div>
                <div className='ac-chg-num'>
                    <div style={{ color: '#70E100' }} className='ac-chg-num-house'> <div className='ac-chg-num-house-name'>{json.name}</div> <div className='ac-chg-num-house-num'>{json.time}</div><div className='ac-chg-num-house-ti'>天</div></div>
                    <div>
                        <div><div>与平均值比：</div><div style={{ color: json.pjzys }}>{data > pjz ? '高' : '低'}</div><div style={{ color: json.pjzys }}>{json.num ? json.num[0].value : 0}天</div></div>
                        <div><div>与目标值比：</div><div style={{ color: json.mbzys }}>{data > pjz / 3 * 2 ? '高' : '低'}</div><div style={{ color: json.mbzys }}>{json.num ? json.num[1].value : 0}天</div></div>
                    </div>
                </div>
            </div>
        )
    }
}


/** 实验查验作业数据 */
class Sycyzy extends React.Component {
    state = {
        pageNum: 1,
        btn: {
            tab: [],
            val: [],
        },
    }

    componentDidMount() {
        let index = layer.load(1, { shade: [0.5, '#fff'] });
        publish('getData', { svn: 'skhg_loader', tableName: 'V_IMAP_CHK_CONTA_MEG', data: { pageno: 1, pagesize: 100, where: '1=1' } }).then((res) => {
            let flds = res[0].fields.map((e) => { return { title: e.alias, dataIndex: e.name }; });
            let datas = res[0].features.map((e) => e.attributes);
            this.setState({ btn: { tab: flds, val: datas } });
            layer.close(index);
        });
    }

    /** 上一页 */
    handleBtnUp = (e) => {
        if (this.state.pageNum > 1) {
            this.setState({ pageNum: this.state.pageNum - 1 }, () => {
                let index = layer.load(1, { shade: [0.5, '#fff'] });
                publish('getData', { svn: 'skhg_loader', tableName: 'V_IMAP_CHK_CONTA_MEG', data: { pageno: this.state.pageNum, pagesize: 100, where: '1=1' } }).then((res) => {
                    let flds = res[0].fields.map((e) => { return { title: e.alias, dataIndex: e.name }; });
                    let datas = res[0].features.map((e) => e.attributes);
                    this.setState({ btn: { tab: flds, val: datas } });
                    layer.close(index);
                });
            });
        }
    }

    /** 下一页 */
    handleBtnDown = (e) => {
        let a = (Number((this.state.btn.val).length) / 100);
        let b = (this.state.pageNum - 1);
        if ((Number((this.state.btn.val).length) / 100) >= 1) {
            this.setState({ pageNum: this.state.pageNum + 1 }, () => {
                let index = layer.load(1, { shade: [0.5, '#fff'] });
                publish('getData', { svn: 'skhg_loader', tableName: 'V_IMAP_CHK_CONTA_MEG', data: { pageno: this.state.pageNum, pagesize: 100, where: '1=1' } }).then((res) => {
                    let flds = res[0].fields.map((e) => { return { title: e.alias, dataIndex: e.name }; });
                    let datas = res[0].features.map((e) => e.attributes);
                    this.setState({ btn: { tab: flds, val: datas } });
                    layer.close(index);
                });
            });
        }
    }

    render() {
        return (
            <div className='sycyzyTab'>
                <div className='sycyzyTab-ti'>实时查验作业数据</div>
                <div className='sycyzyTab-btn'>
                    <div className='sycyzyTab-btn-up' onClick={this.handleBtnUp} >上一页</div>
                    <div className='sycyzyTab-btn-down' onClick={this.handleBtnDown} >下一页</div>
                </div>
                <div className='sycyzyTab-gb' onClick={this.props.gb}></div>
                <Table rowNo={true} title={null} style={{ width: 6200, height: 2160 }} id={'id5'} selectedIndex={null} flds={this.state.btn.tab} datas={this.state.btn.val} trClick={null} trDbclick={null} />
            </div>
        )
    }
}

// 海关作业时效
class HG extends React.Component {
    componentDidMount() {
        this.update = (props) => {
            let month = props.month.replace('月', '');
            let time = (new Date().getFullYear() - 1) + (month < 10 ? '0' : '') + month;
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
        let time = this.props.selYear + (month < 10 ? '0' : '') + month;
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