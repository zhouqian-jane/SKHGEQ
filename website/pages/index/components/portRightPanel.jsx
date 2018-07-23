import '../less';
import 'animate.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { publish } from '../../../frame/core/arbiter';
import { Panel, WordsContent, Vedios } from '../../../frame/componets/index';
import echarts from 'echarts';
import $ from 'jquery';
import _ from 'lodash';


/** 计算数量得到小数点和前面加0 */
function toArray(str) {
    let arr = [];
    if (str >= 10 || str === 0) {
        for (var i = 0, j = str.length; i < j; i++) { arr.push(str[i]) }
    } else {
        for (var i = 0, j = str.length; i < j; i++) {
            arr.push(0)
            arr.push(str[i])
        }
    }
    return arr;
}

function getNumberArr(num) {
    let nums = [], arrs = (num + '').split('.').map(toArray);
    if (arrs[0].length > 0) {
        let arr = arrs[0], m = arr.length % 3;
        for (var i = 0, j = arr.length; i < j; i++) { let n = i - m; if (i > 0 && n >= 0 && n % 3 === 0) nums.push('break'); nums.push(arr[i]); }
    }
    else nums.push('0');
    if (arrs[1] && arrs[1].length > 0) { nums.push('point'); nums = nums.concat(arrs[1]) }
    return nums;
}

/** 顶部的关区数据 */
class PortRightArea extends React.Component {
    render() {
        let { leftGQ, rightGQ } = this.props;
        let zgq = [];
        let ygq = [];
        zgq.push(getNumberArr(leftGQ.TAXATION));
        ygq.push(getNumberArr(rightGQ.TAXATION));
        return (
            <div className="Area">
                <div className="Area_left">
                    <div className="Area_left_v5304"></div>
                    <div className="Area_left_zsje">
                        <div className="Area_left_zsje_view"></div>
                        <div className="Area_left_zsje_num">
                            <div className='number-view'>
                                {zgq[0].map((num, i) => { return <div key={i} className={'number-' + num}></div> })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Area_right">
                    <div className="Area_right_v5304"></div>
                    <div className="Area_right_zsje">
                        <div className="Area_right_zsje_view"></div>
                        <div className="Area_right_zsje_num">

                            <div className='number-view'>
                                {ygq[0].map((num, i) => { return <div key={i} className={'number-' + num}></div> })}
                            </div></div>
                    </div>
                </div>
            </div>
        )
    }
}

/** 上中的报关单量 */
class PortRightBGDL extends React.Component {
    render() {
        let { leftGQ, rightGQ } = this.props;
        return (
            <div className="BGDL">
                <div className="BGDL_left">
                    <div className="BGDL_left_left">
                        <div className="BGDL_left_left_jkdl">
                            <div>{Number(leftGQ.DECLARATIONIN).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</div>
                            <div>进口报关单量</div>
                        </div>
                        <div className="BGDL_left_left_ckdl">
                            <div>{Number(leftGQ.DECLARATIONOUT).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</div>
                            <div>出口报关单量</div>
                        </div>
                    </div>
                    <div className="BGDL_left_right">
                        <div></div>
                        <span>{Number(leftGQ.DECLARATION).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</span>
                    </div>
                </div>

                <div className="BGDL_right">
                    <div className="BGDL_right_left">
                        <div></div>
                        <span>{Number(rightGQ.DECLARATION).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</span>
                    </div>
                    <div className="BGDL_right_right">
                        <div className="BGDL_right_right_jkdl">
                            <div>{Number(rightGQ.DECLARATIONIN).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</div>
                            <div>进口报关单量</div>
                        </div>
                        <div className="BGDL_right_right_ckdl">
                            <div>{Number(rightGQ.DECLARATIONOUT).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</div>
                            <div>出口报关单量</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

/** 底下的数据展示 */
class PortRightData extends React.Component {
    componentWillReceiveProps(nextpro) {
        let { leftGQ, rightGQ } = nextpro;
        const data = [{ 'value': leftGQ.CLEAREDEFFICIENCY || 0, 'name': '通关效率' }, { 'value': leftGQ.CHECKEFFICIENCY || 0, 'name': '查验时效' }];
        publish('port_pie_xl', { value: data[0] || 0 }).then((res) => {
            if (this.chart1) this.chart1.dispose();
            this.chart1 = echarts.init(ReactDOM.findDOMNode(this.refs.echart1));
            this.chart1.setOption(res[0]);
        });

        publish('port_pie_xl', { value: data[1] || 0 }).then((res) => {
            if (this.chart2) this.chart2.dispose();
            this.chart2 = echarts.init(ReactDOM.findDOMNode(this.refs.echart2));
            this.chart2.setOption(res[0]);
        });

        const data1 = [{ 'value': rightGQ.CLEAREDEFFICIENCY || 0, 'name': '通关效率' }, { 'value': rightGQ.CHECKEFFICIENCY || 0, 'name': '查验时效' }];
        publish('port_pie_xl', { value: data1[0] || 0 }).then((res) => {
            if (this.chart3) this.chart3.dispose();
            this.chart3 = echarts.init(ReactDOM.findDOMNode(this.refs.echart3));
            this.chart3.setOption(res[0]);
        });

        publish('port_pie_xl', { value: data1[1] || 0 }).then((res) => {
            if (this.chart4) this.chart4.dispose();
            this.chart4 = echarts.init(ReactDOM.findDOMNode(this.refs.echart4));
            this.chart4.setOption(res[0]);
        });
    }

    componentWillUnmount() {
        if (this.chart1) this.chart1.dispose();
        if (this.chart2) this.chart2.dispose();
        if (this.chart3) this.chart3.dispose();
        if (this.chart4) this.chart4.dispose();
    }

    render() {
        let { leftGQ, rightGQ } = this.props;
        return (
            <div className="Ched">
                <div className="Ched_left">
                    <div className="Ched_left_cys">
                        <div className="Ched_left_cys_gs">
                            <div>
                                <div>{Number(leftGQ.CHECKNUMOUT).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</div>
                                <span>查验完毕柜数</span>
                            </div>
                            <div>
                                <div>{Number(leftGQ.CHECKNUMYARD).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</div>
                                <span>在场待查柜数</span>
                            </div>
                            <div>
                                <div>{Number(leftGQ.CHECKNUMINCOME).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</div>
                                <span>待调拨入场柜数</span>
                            </div>
                        </div>
                        <div className="Ched_left_cys_ps">
                            <div className="Ched_left_cys_ps_view">查验票数</div>
                            <div className="Ched_left_cys_ps_num">{Number(leftGQ.CHECKNUM).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</div>
                            <div className="Ched_left_cys_ps_echt">
                                <div className="Ched_left_cys_ps_echt_c1">
                                    <div className='homeRightE-1' style={{ height: '100%', width: '100%' }} ref="echart1"></div>
                                </div>
                                <div className="Ched_left_cys_ps_echt_c2">
                                    <div className='homeRightE-1' style={{ height: '100%', width: '100%' }} ref="echart2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="Ched_left_lkzrs">
                        <div className="Ched_left_lkzrs_crjzrs">
                            <div className="Ched_left_lkzrs_crjzrs_view">出入境旅客总人数</div>
                            <div className="Ched_left_lkzrs_crjzrs_num">{Number(leftGQ.PERSONNUM).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</div>
                        </div>
                        <div className="Ched_left_lkzrs_crjrs">
                            <div className="Ched_left_lkzrs_crjrs_r">
                                <div className="Ched_left_lkzrs_crjrs_r_r1"></div>
                                <div className="Ched_left_lkzrs_crjrs_r_cjrs">
                                    <div>{Number(leftGQ.PERSONNUMIN).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</div>
                                    <span>出境旅客人数</span>
                                </div>
                            </div>
                            <div className="Ched_left_lkzrs_crjrs_r">
                                <div className="Ched_left_lkzrs_crjrs_r_r2"></div>
                                <div className="Ched_left_lkzrs_crjrs_r_rjrs">
                                    <div>{Number(leftGQ.PERSONNUMOUT).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</div>
                                    <span>入境旅客人数</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Ched_right">
                    <div className="Ched_right_cywb">
                        <div className="Ched_right_cywb_cygs">
                            <div>{Number(rightGQ.CHECKNUMOUT).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</div>
                            <span>查验完毕柜数</span>
                        </div>
                        <div className="Ched_right_cywb_cyps">
                            <div className="Ched_right_cywb_cyps_view">查验票数</div>
                            <div className="Ched_right_cywb_cyps_num">{Number(rightGQ.CHECKNUM).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</div>
                        </div>
                    </div>
                    <div className="Ched_right_dcy">
                        <div className="Ched_right_dcy_dcgs">
                            <div>{Number(rightGQ.CHECKNUMYARD).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</div>
                            <div>在场待查柜数</div>
                        </div>
                        <div className="Ched_right_dcy_dbrcgs">
                            <div>{Number(rightGQ.CHECKNUMINCOME).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</div>
                            <div>待调拨入场柜数</div>
                        </div>
                    </div>
                    <div className="Ched_right_echts">
                        <div className="Ched_right_echts_c1">
                            <div className='homeRightE-1' style={{ height: '100%', width: '100%' }} ref="echart3"></div>
                        </div>
                        <div className="Ched_right_echts_c2">
                            <div className='homeRightE-1' style={{ height: '100%', width: '100%' }} ref="echart4"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

// 第二页右侧组件
export default class PortRight extends React.Component {

    state = {
        leftGQ: [],
        rightGQ: [],
    }

    componentDidMount() {
        Promise.all([
            publish('webAction', { svn: 'skhg_loader_service', path: 'queryTableByWhere', data: { tableName: 'HZ2011', where: "EFFECTDATE=(SELECT MAX(EFFECTDATE) FROM HZ2011 WHERE CUSTOMSCODE='5304关区') AND CUSTOMSCODE='5304关区'" } }),
            publish('webAction', { svn: 'skhg_loader_service', path: 'queryTableByWhere', data: { tableName: 'HZ2011', where: "EFFECTDATE=(SELECT MAX(EFFECTDATE) FROM HZ2011 WHERE CUSTOMSCODE='5349关区') AND CUSTOMSCODE='5349关区'" } }),
            publish('webAction', { svn: 'skhg_loader_service', path: 'queryTableByWhere', data: { tableName: 'V_IMAP_CIC', where: '1=1' } }),
        ]).then((res) => {
            let leftGQ = res[0][0].data[0];
            let rightGQ = res[1][0].data[0];
            let temp = res[2][0].data[0];
            leftGQ.CHECKNUMINCOME = temp.INCOMINGCOUNT_5304;
            leftGQ.CHECKNUMYARD = temp.CHECKINGCOUNT_5304;
            leftGQ.CHECKNUMOUT = temp.OUTINGCOUNT_5304;
            rightGQ.CHECKNUMINCOME = temp.INCOMINGCOUNT_5349;
            rightGQ.CHECKNUMYARD = temp.CHECKINGCOUNT_5349;
            rightGQ.CHECKNUMOUT = temp.OUTINGCOUNT_5349;
            this.setState({ leftGQ: leftGQ, rightGQ: rightGQ });
        });
    }

    render() {
        let data = [
            { name: 'SCT 1# 2#堆场', url: 'http://www.cheluyun.com/javascript/zsg/?id=100031600&rtmp=rtmp://playrtmp.simope.com:1935/live/524622521d?liveID=100031600&hls=http://playhls.simope.com/live/524622521d/playlist.m3u8?liveID=100031600' },
            { name: 'SCT 1# 2#堆场', url: 'http://www.cheluyun.com/javascript/zsg/?id=100031600&rtmp=rtmp://playrtmp.simope.com:1935/live/524622521d?liveID=100031600&hls=http://playhls.simope.com/live/524622521d/playlist.m3u8?liveID=100031600' },
        ];
        return (
            <div className='portRight' style={{ marginLeft: 30 }}>
                < PortRightArea leftGQ={this.state.leftGQ} rightGQ={this.state.rightGQ} />
                < PortRightBGDL leftGQ={this.state.leftGQ} rightGQ={this.state.rightGQ} />
                < PortRightData leftGQ={this.state.leftGQ} rightGQ={this.state.rightGQ} />
            </div>
        )
    }
}