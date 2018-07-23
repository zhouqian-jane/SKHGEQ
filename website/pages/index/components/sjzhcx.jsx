import React from 'react';
import '../less';
import 'animate.css';
import $ from 'jquery';
import { publish, subscribe, unsubscribe } from '../../../frame/core/arbiter';
import { Vedio, ViwePager, Table, ImgDisplay, Panel, Vedios, QueryBox, QueryBoxs } from '../../../frame/componets/index';

/** 实能查询 */
class FastQuery extends React.Component {
    state = {
        index: 0,
        port: { datas1: [] },
        container: { datas1: [], datas2: [] },
        wareHouse: { datas1: [] },
        list: { datas1: [] },
        warning: { datas1: [] },
        flds: [],
    }

    chooseItem = (index) => {
        $('.query-t-b').addClass('magictime holeOut animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => { $('.query-t-b').removeClass('magictime holeOut animated'); this.setState({ index: index }, () => $('.query-t-b').addClass('magictime swashIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => $('.query-t-b').removeClass('magictime swashIn animated'))); });
    }

    render() {
        let items = ['码头信息', '集装箱', '提单信息', '预报警'];
        let content = [];
        let index = this.state.index;
        let id1 = 'a', id2 = 'b';
        let flds = [];
        let width = 1750, height = 1625;
        let h = 772;
        if (index === 0) {
            flds = [
                { 'title': '港区', 'dataIndex': 'TERMINALCODE' },
                { 'title': '船舶类型', 'dataIndex': 'VESSELTYPE' },
                { 'title': '泊位', 'dataIndex': 'BERTHNO' },
                { 'title': '船舶编码', 'dataIndex': 'EVESSELNAME' },
                { 'title': '船舶中文名', 'dataIndex': 'CVESSELNAME' },
                { 'title': '卸船箱量', 'dataIndex': 'DISCHARGE' },
                { 'title': '装船箱量', 'dataIndex': 'LOADING' },
                { 'title': '卸船空箱量', 'dataIndex': 'DISCHARGE_E' },
                { 'title': '卸船重箱量', 'dataIndex': 'DISCHARGE_F' },
                { 'title': '装船空箱量', 'dataIndex': 'LOADING_E' },
                { 'title': '装船重箱量', 'dataIndex': 'LOADING_F' },
            ];
            let query = (ops) => {
                let index = layer.load(1, { shade: [0.5, '#fff'] });
                publish('webAction', { svn: 'skhg_loader_service', path: 'queryTableByWhere', data: { tableName: 'V_IMAP_SCCT_BERTH', where: ops != '' ? "TERMINALCODE='" + ops + "'" : '1=1' } }).then((res) => {
                    res[0].data.forEach((e) => e.VESSELTYPE = e.VESSELTYPE == 'B' ? '大船' : '驳船');
                    this.setState({ port: { datas1: res[0].data } });
                    layer.close(index);
                });
            }
            let trClick = (data, index, datas) => {
                window.openLoading();
                publish('webAction', { svn: 'skhg_service', path: 'getAreaByWhere', data: { where: "CODE='" + data.TERMINALCODE + "'" } }).then((res) => {
                    publish('changeLayer', { index: 2, props: { datas: res[0].data[0], defaultLayer: { ship: data } } });
                });
            }
            content = [
                <Table key={1} rowNo={true} title={{ name: '泊位停靠船舶信息', export: false, items: [<QueryBox key={1} name='码头' query={query} />] }} style={{ width: '100%', height: height }} id={id1} selectedIndex={null} flds={flds} datas={this.state.port.datas1} trClick={null} trDbclick={trClick} />,
            ];
        }
        else if (index === 1) {
            let map = [
                { title: 'IMO号', dataIndex: 'IMO' },
                { title: '进口商业航次号', dataIndex: 'InBusinessVoy' },
                { title: '出口商业航次号', dataIndex: 'OutBusinessVoy' },
                { title: '船名航次', dataIndex: 'OutVesselVoyage' },
                { title: '作业码头', dataIndex: 'DbId' },
                { title: '总提运单号', dataIndex: 'BlNbr' },
                { title: '订舱号', dataIndex: 'BookingEdo' },
                { title: '箱号', dataIndex: 'ContainerNbr' },
                { title: '箱型尺寸高度', dataIndex: 'SzTpHt' },
                { title: '空重', dataIndex: 'Status' },
                { title: '进出口状态', dataIndex: 'Category' },
                { title: '箱主', dataIndex: 'LineId' },
                { title: '当前位置', dataIndex: 'Location' },
                { title: '装货港', dataIndex: 'PolAlias' },
                { title: '卸货港', dataIndex: 'PodAlias' },
                { title: '目的港', dataIndex: 'Destination' },
                { title: '海关放行时间', dataIndex: 'CUS' },
                // { title: '国检放行时间', dataIndex: 'CIQ' },
                { title: '集中查验时间', dataIndex: 'CicTime' },
                { title: '集中查验状态', dataIndex: 'CicStatus' },
                { title: '海关查验状态、国检查验状态、放行状态', dataIndex: 'ReleaseStatus' },
                { title: '进场时间', dataIndex: 'InTime' },
                { title: '离港时间', dataIndex: 'OutTime' },
            ];
            flds = [
                { title: '参数名', dataIndex: 'key' },
                { title: '参数值', dataIndex: 'value' },
            ];
            let flds2 = [
                { title: '港区', dataIndex: 'DbId' },
                { title: '船公司', dataIndex: 'ContainerOwner' },
                { title: '操作', dataIndex: 'OpType' },
                { title: '操作时间', dataIndex: 'OpTime' },
                { title: '操作服务', dataIndex: 'ColumnName' },
                { title: '从', dataIndex: 'OldValue' },
                { title: '到', dataIndex: 'NewValue' },
            ];
            let query = (no) => {
                if (no == '') {
                    layer.tips('箱号不能为空', '#qbInput', { tips: [3, '#F2AE4A'], area: ['350px', '60px'] });
                }
                else {
                    let index = layer.load(1, { shade: [0.5, '#fff'] });
                    Promise.all([
                        publish('webAction', { svn: 'eportapisct', path: 'GContainerInfo', data: { System: '', PageIndex: 1, PageSize: 30, SortBy: '', IsDescending: false, ContainerNo: no } }),
                        publish('webAction', { svn: 'eportapisct', path: 'GContainerHistoryInfo', data: { System: '', PageIndex: 1, PageSize: 30, SortBy: '', IsDescending: false, ContainerNo: no } }),
                    ]).then((res) => {
                        try {
                            let result = res[0][0].InnerList;
                            if (result.length > 0) {
                                let datas1 = map.map((e) => { return { key: e.title, value: result[0][e.dataIndex] } });
                                this.setState({ container: { datas1: datas1, datas2: res[1][0].InnerList } });
                                layer.close(index);
                            }
                            else {
                                layer.close(index);
                                layer.msg('没有查询到任何数据!');
                            }
                        }
                        catch (err) {
                            layer.close(index);
                            layer.msg('获取数据失败，请联系管理员！');
                        }
                    });
                }
            }
            let trClick = (data, index, datas) => {
                let zymt = datas.filter((e) => e.key == '作业码头')[0].value;
                let cno = datas.filter((e) => e.key == '箱号')[0].value;
                publish('webAction', { svn: 'skhg_service', path: 'getAreaByWhere', data: { where: "CODE='" + zymt + "'" } }).then((res) => {
                    publish('changeLayer', { index: 2, props: { datas: res[0].data[0], defaultLayer: { container: cno } } });
                })
            }
            content = [
                <div key={1} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: height }}>
                    <Table rowNo={true} title={{ name: '集装箱信息', export: false, items: [<QueryBox key={1} name='箱号' query={query} />] }} style={{ width: '100%', height: h }} id={id1} selectedIndex={null} flds={flds} datas={this.state.container.datas1} trClick={null} trDbclick={trClick} />
                    <Table rowNo={true} title={{ name: '集装箱历史轨迹', export: false }} style={{ width: '100%', height: h }} id={id2} selectedIndex={null} flds={flds2} datas={this.state.container.datas2} trClick={null} trDbclick={null} />
                </div>,
            ];
        }
        else if (index === 2) {
            flds = [
                { title: '仓库名', dataIndex: 'a' },
                { title: '当前库存量', dataIndex: 'b' },
                { title: '所属单位', dataIndex: 'c' },
            ];
            content = [
                <Table key={1} rowNo={true} title={{ name: '仓库信息', export: false, items: [<QueryBox key={1} name='' query={(e) => alert(e)} />] }} style={{ width: '100%', height: height }} id={id1} selectedIndex={null} flds={flds} datas={this.state.wareHouse.datas1} trClick={null} trDbclick={null} />,
            ];
        }
        else if (index === 3) {
            flds = [
                { title: '港口代码', dataIndex: 'TERMINALCODE' },
                { title: '提单号', dataIndex: 'BL_NBR' },
                { title: '柜号', dataIndex: 'CONTAINER_NBR' },
                { title: '箱主', dataIndex: 'LINE_ID' },
                { title: '箱属性', dataIndex: 'SZ_TP_HT' },
                { title: '放行状态', dataIndex: 'RELEASE_STATUS' },
                { title: '进港类型', dataIndex: 'CATEGORY' },
                { title: '进出口船或拖车', dataIndex: 'VES_VOY' },
                { title: '在场/离港', dataIndex: 'ISOUT' },
            ];
            let query = (no) => {
                if (no == '') {
                    layer.tips('提单号不能为空', '#qbInput', { tips: [3, '#F2AE4A'], area: ['350px', '60px'] });
                }
                else {
                    let index = layer.load(1, { shade: [0.5, '#fff'] });
                    publish('webAction', { svn: 'skhg_loader_service', path: 'queryTableByWhere', data: { tableName: 'V_IMAP_SCCT_RELEASE', where: "Bl_Nbr='" + no + "'" } }).then((res) => {
                        if (res[0].success) {
                            flds = Object.keys(res[0].attr).map((key) => { return { title: res[0].attr[key], dataIndex: key } });
                            this.setState({ list: { datas1: res[0].data } });
                            layer.close(index);
                        }
                        else {
                            layer.close(index);
                            layer.msg('获取数据失败，请联系管理员！');
                        }
                    });
                }
            }
            content = [
                <Table key={1} rowNo={true} title={{ name: '提单信息', export: false, items: [<QueryBox key={1} name='提单号' query={query} />] }} style={{ width: '100%', height: height }} id={id1} selectedIndex={null} flds={flds} datas={this.state.list.datas1} trClick={null} trDbclick={null} />,
            ];
        }
        else if (index === 4) {
            let query = (tableName, isHandled, dateFromTo) => {
                if (dateFromTo == '') {
                    layer.tips('日期范围不能为空', '#dateFromTo', { tips: [3, '#F2AE4A'], area: ['350px', '60px'] });
                }
                else {
                    let index = layer.load(1, { shade: [0.5, '#fff'] });
                    let temp = "TO_DATE(20||substr(WARNINGDATE, 8, 2)||'-'||replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(substr(WARNINGDATE, 4,3), 'JAN', '01'), 'FEB', '02'), 'MAR', '03'), 'APR', '04'), 'MAY', '05'), 'JUN', '06'), 'JUL', '07'), 'AUG', '08'), 'SEP', '09'), 'OCT', '10'), 'NOV', '11'), 'DEC', '12')||'-'||substr(WARNINGDATE, 0, 2), 'yy-MM-dd')";
                    let dates = dateFromTo.split(' - ');
                    let start = dates[0] + ' 00:00:00';
                    let end = dates[1] + ' 23:59:59';
                    let where = '1=1';
                    let type = Number(tableName.substr(tableName.length - 2));
                    let mp = ',1,2,6,7,8,9,10,11,16,17';
                    if (mp.indexOf(',' + type + ',') >= 0)
                        where = temp + ">=to_date('" + start + "','yyyy-mm-dd hh24:mi:ss') and " + temp + "<=to_date('" + end + "','yyyy-mm-dd hh24:mi:ss')";
                    else where = "WARNINGDATE>=to_date('" + start + "','yyyy-mm-dd hh24:mi:ss') and WARNINGDATE<=to_date('" + end + "','yyyy-mm-dd hh24:mi:ss')";
                    publish('webAction', { svn: 'skhg_stage_service', path: 'queryTableByWhere', data: { tableName: tableName, where: where + " AND ISHANDLED='" + isHandled + "'" } }).then((res) => {
                        if (res[0].success) {
                            let flds = Object.keys(res[0].attr).map((key) => { return { title: res[0].attr[key], dataIndex: key } });
                            this.setState({ warning: { datas1: res[0].data }, flds: flds });
                            layer.close(index);
                        }
                        else {
                            layer.close(index);
                            layer.msg('获取数据失败，请联系管理员！');
                        }
                    });
                }
            }
            content = [
                <Table key={1} rowNo={true} title={{ name: '报警信息', export: false, items: [<MySelect key={1} query={query} />] }} style={{ width: '100%', height: height }} id={id1} selectedIndex={null} flds={this.state.flds} datas={this.state.warning.datas1} trClick={null} trDbclick={null} />,
            ];
        }

        return (
            <div className='queryBox'>
                <div className='query' ref='target'>
                    <div className='query-t'>
                        <div className='query-t-t'>
                            {items.map((e, i) => <div key={i} className={'hvr-pulse-shrink query-t-t-item' + (i === this.state.index ? '-select' : '-noselect')} onClick={() => this.chooseItem(i)}>{e}</div>)}
                        </div>
                        {/* <div className='query-t-b'>
                            {content}
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }
}


/** 实能链接 */
class FastLink extends React.Component {
    state = {
        items: [
            { name: '旅检移泊确认', show: true },
            { name: '旅检到泊确认', show: false },
            { name: '整船换装确认', show: false },
            { name: '行政通道系统', show: false },
            { name: '调拨通道系统', show: false },
            { name: '远程抬闸系统', show: false },
        ],
        flds: [],
        datas: [],
    }
    clickTitle = (index) => {
        let items = this.state.items;
        items.forEach((e, i) => e.show = (i === index));
        if (index == 0) {
            publish('webAction', { svn: 'skhg_loader_service', path: 'queryTableByWhere', data: { tableName: 'SK_LJYBSQB', where: "VALID='Y' AND PERMIT IS NULL" } }).then((res) => {
                let f = res[0].attr;
                let flds = Object.keys(f).map((k) => { return { title: f[k], dataIndex: k } }).concat([{ title: '操作', dataIndex: 'cl' }]);
                let datas = res[0].data;
                this.setState({ items: items, flds: flds, datas: datas });
            });
        }
        else if (index == 1) {
            publish('webAction', { svn: 'skhg_loader_service', path: 'queryTableByWhere', data: { tableName: 'SK_LJDBSQB', where: "VALID='Y' AND PERMIT IS NULL" } }).then((res) => {
                let f = res[0].attr;
                let flds = Object.keys(f).map((k) => { return { title: f[k], dataIndex: k } }).concat([{ title: '操作', dataIndex: 'cl' }]);
                let datas = res[0].data;
                this.setState({ items: items, flds: flds, datas: datas });
            });
        }
        else {
            this.setState({ items: items, flds: [], datas: [] });
        }
    }
    cl = (data, fld) => {
        let index = 0;
        this.state.items.forEach((e, i) => e.show ? index = i : '');
        if (index == 0 || index == 1) {
            publish('webAction', { svn: 'skhg_loader_service', path: index == 0 ? 'ljybTy' : 'ljdbTy', data: { mmsi: data.MMSI } }).then((res) => {
                this.clickTitle(index);
            });
        }
    }
    qx = (data, fld) => {
        let index = 0;
        this.state.items.forEach((e, i) => e.show ? index = i : '');
        if (index == 0 || index == 1) {
            publish('webAction', { svn: 'skhg_loader_service', path: index == 0 ? 'ljybQx' : 'ljdbQx', data: { mmsi: data.MMSI } }).then((res) => {
                this.clickTitle(index);
            });
        }

    }
    myTd = (trIndex, data, fld, tdIndex) => {
        if (fld.dataIndex === 'cl') {
            return <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className='link-cl' onClick={() => this.cl(data, fld)}>接受信息</div>
                <div style={{ margin: '0 5px' }}>|</div>
                <div className='link-qx' onClick={() => this.qx(data, fld)}>取消</div>
            </div>
        }
        return data[fld.dataIndex];
    }
    componentDidMount() {
        this.clickTitle(0);
    }
    render() {
        return (
            <div className='warningTip' style={{ position: 'absolute', top: 50, left: 3926, zIndex: 99999 }}>
                {/* <div className='warningTip-t'></div> */}
                <div className='warningTip-b'>
                    <Panel style={{ padding: '20px 25px', width: 3365, height: 1071 }}>
                        <div className='warningTip-b-title'>
                            {this.state.items.map((e, i) => <div onClick={() => this.clickTitle(i)} className={e.show ? 'warningTip-b-title-1' : 'warningTip-b-title-2'} key={i}>{e.name}</div>)}
                        </div>
                        <div className='warningTip-b-body'>
                            <Table style={{ width: 3361, height: 954, overflow: 'auto' }} id={'bb'} selectedIndex={null} flds={this.state.flds} datas={this.state.datas} trClick={null} trDbclick={null} myTd={this.myTd} />
                        </div>
                    </Panel>
                </div>
            </div>
        );
    }
}

/** 监管态势监测 */
class EmbedIframe extends React.Component {

    render() {
        return (
            <div></div>
        )
    }
}

/** 智能指挥 */
class FastCommand extends React.Component {
    render() {
        return (
            <div className='ic' style={{ overflow: 'hidden' }}>
                <iframe src='../icommand/index.html'/>
                {/* <div className='ic-close' onClick={this.props.close}></div> */}
            </div>
        )
    }
}

export default class sjzhcx extends React.Component {
    state = {}

    render() {
        return (
            <div>
                <FastQuery />
                <div>
                    <FastLink />
                    <EmbedIframe />
                </div>
                <FastCommand />
            </div>
        )
    }
}