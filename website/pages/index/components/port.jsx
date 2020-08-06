import '../less';
import 'animate.css';
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import echarts from 'echarts';
import PortRightPanel from './portRightPanel';
import { publish } from '../../../frame/core/arbiter';
import { NoHornTip } from '../../../frame/componets/index';
import { Desc, Details } from '../../../frame/componets/details/index';
import BigShipIcon from '../../../res/mapIcon/bigShip.png';
import BargeIcon from '../../../res/mapIcon/Barge.png';
import yl from '../../../res/mapIcon/游轮.png';
import jzx from '../../../res/mapIcon/集装箱hd.png';
import qy from '../../../res/mapIcon/车位迁移.png';
import Znybj from './ZNYBJ';
import { Table } from '../../../frame/componets/index';

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

const CHECK_COUNT_TYPES = { '1': 'SCT码头待查', '2': 'SCT码头调往CIC查验', '3': 'CCT码头待查', '4': 'CCT调往CIC查验', '5': 'MCT码头待查', '6': 'MCT调往CIC查验', '7': 'CIC待查', '8': '到CIC查验，但箱在途' };

// 地图操作组件
class MapOperation extends React.Component {
    state = {
        showMT: false,      // 码头弹出框
        Amap: false,        // 园区、仓库等弹出框
        jiasuju: {},
        // 图标点击事件
        icon: {
            isShowDes: false,
            desTitle: '显示详情',
            desItem: {},
            desColumns: [],
        },
        // 替补框内容
        tip: {
            mtJson: [],     // 后台请求的码头数据
            mapDesc: [],   // 勾画出码头页面信息
            items: 1,
        },
        SHIP_CRUISE: true,
        SHIP_LAYER: true,
        BARGE_SHIP_LAYER: true,
        QUERY_BOX: true,
        box: {            // 查验集装箱
            tab: [],
            val: [],
            tit: '',
        },
        box_xq: {
            QUERY_BOX_XQ: false,
            tab: [],
            val: [],
            tit: '',
        },
        map: true,
    }

    componentDidMount() {

        /** 港口码头划分 */
        publish('webAction', { svn: 'skhg_service', path: 'getAreaByWhere', data: { where: 'LAYER=2' } }).then((res) => {

            /** 查验集装箱 */
            let o = [];
            publish('webAction', { svn: 'skhg_loader_service', path: 'queryTableByWhere', data: { tableName: 'V_IMAP_CHK_CHECK_COUNT', where: '1=1' } }).then((ors) => {
                let flds = Object.keys(ors[0].attr).map((e, i) => { return { title: ors[0].attr[e], dataIndex: e }; });
                ors[0].data.map((e, i) => e.CHECK_COUNT_TYPE = CHECK_COUNT_TYPES[e.CHECK_COUNT_TYPE]);
                this.setState({ box: { tab: flds, val: ors[0].data, tit: '查验集装箱总数' } });
                o.push(ors[0]);
                let color = {
                    1: [250, 22, 80, 1],       // 红色
                    2: [57, 255, 95, 1],       // 绿色
                    3: [255, 255, 255, 1],       // 蓝色
                    4: [251, 251, 0, 1],       // 黄色
                };
                res[0].data.forEach((data, i) => {
                    let dots = data.geom.rings[0].map((p) => { return { x: p[0], y: p[1] }; });
                    let fillColor = color[data.type];
                    let params = {
                        id: 'port_view_' + i,
                        linecolor: fillColor,
                        layerId: 'port_view',
                        dots: dots,
                        attr: { ...data },
                        click: (e) => publish('changeLayer', { index: 2, props: { datas: e.attributes, layerName: e.attributes.name } }),
                        linewidth: 6,
                        mouseover: (g) => {
                            this.toolTipIn(g)
                        },
                        mouseout: (g) => {
                            this.setState({
                                showMT: false,
                                Amap: false,
                            });
                            this.props.map.mapDisplay.clearLayer('port_view1');
                        },
                    }
                    this.props.map.mapDisplay.polygon(params);
                    this.handleCYbox([data, o[0]]);
                });
            })
        });

        /** 查验集装箱显示  */
        this.handleCYbox = (e) => {
            let maps = [{ name: 'SCT', x: '113.88888574283962', y: '22.45840389291108', dc: '0', dw: '1' },
            { name: 'CCT', x: '113.87693133074633', y: '22.46944459197813', dc: '2', dw: '3' },
            { name: 'MCT', x: '113.86825105699707', y: '22.48794728075947', dc: '4', dw: '5' },
            { name: 'CIC', x: '113.87068762506703', y: '22.50759211082361', dc: '6', dw: '7' }]
            maps.map((i) => {
                if (i.name == (e[0].ssdw)) {
                    // let y = points[0].y;
                    let mText = {
                        id: 'text' + Math.random(10000),
                        layerId: 'QUERY_BOX',
                        x: i.x,
                        y: i.y,
                        color: '#fff',
                        text: '待查箱数：' + e[1].data[i.dc].COUNT_NUM,
                        offsetX: 0,
                        offsetY: 0,
                        layerIndex: 10,
                    };
                    let param = {
                        id: 'box' + Math.random(10000),
                        layerId: 'QUERY_BOX_dc',
                        src: jzx,
                        width: 140,
                        height: 140,
                        x: (Number(i.x)) - 0.005,
                        y: Number(i.y) + 0.0005,
                    };
                    let dwxs = {
                        id: 'dwxs' + Math.random(10000),
                        layerId: 'QUERY_BOX_dwxs',
                        x: i.x,
                        y: Number(i.y) - 0.003,
                        color: '#fff',
                        text: '调往箱数：' + e[1].data[i.dw].COUNT_NUM,
                        offsetX: 0,
                        offsetY: 0,
                        layerIndex: 10,
                    };
                    let paramdw = {
                        id: 'box' + Math.random(10000),
                        layerId: 'QUERY_BOX_dw',
                        src: qy,
                        width: 140,
                        height: 140,
                        x: (Number(i.x)) - 0.005,
                        y: Number(i.y) - 0.0025,
                    };
                    this.props.map.mapDisplay.text(mText);
                    this.props.map.mapDisplay.hide('QUERY_BOX');

                    this.props.map.mapDisplay.text(dwxs);
                    this.props.map.mapDisplay.hide('QUERY_BOX_dwxs');

                    this.props.map.mapDisplay.image(param);
                    this.props.map.mapDisplay.hide('QUERY_BOX_dc');

                    this.props.map.mapDisplay.image(paramdw);
                    this.props.map.mapDisplay.hide('QUERY_BOX_dw');
                }
            })
        }


        // let insertArea = () => {// 插入区域信息
        //     $.ajax({ 
        //         dataType: 'json', url: '../test.json', async: false, success: (res) => {
        //             let a = res.features.map((e, i) => {
        //                 return {
        //                     attr: {
        //                         NAME: e.attributes.name,
        //                         CODE: e.name || '',
        //                         TYPE: '',
        //                         SSDW: '',
        //                         SSDWNAME: '',
        //                         XMIN: '',
        //                         XMAX: '',
        //                         YMIN: '',
        //                         YMAX: '',
        //                         LAYER: '',
        //                     },
        //                     geom: e.geometry
        //                 };
        //             });
        //             console.log(a);
        //             publish('webAction', { svn: 'skhg_service', type: 'post', path: 'insertArea', data: { datas: JSON.stringify(a) } }).then((res) => {
        //                 console.log(res);
        //             });
        //         }
        //     });
        // }

        // insertArea();

        /** 大船显示 */
        publish('webAction', { svn: 'skhg_loader_service', path: 'queryTableByWhere', data: { tableName: 'SKHG_VESSEL', where: '1=1' } }).then((res) => {
            this.handleBigship(res[0]);
        })

        /** 驳船显示 */
        publish('webAction', { svn: 'skhg_loader_service', path: 'queryTableByWhere', data: { tableName: 'SKHG_BARGE', where: '1=1' } }).then((res) => {
            this.handleBarge(res[0]);
        })

        /** 游轮显示 */
        publish('webAction', { svn: 'skhg_loader_service', path: 'queryTableByWhere', data: { tableName: 'YLMG_SHIP', where: '1=1' } }).then((res) => {
            this.handleCruise(res[0].data);
        })
    }

    handleCruise = (json) => {
        let that = this;
        for (let o in json) {
            json[o].name = '客轮详情';
            json[o].colname = 'cruise';
            let param = {
                id: 'SHIP_CRUISE' + o,
                layerId: 'SHIP_CRUISE',
                src: yl,
                width: 140,
                height: 140,
                // angle: (Number(json[o].HEADING) / 100) - 90,
                x: json[o].LONGITUDE,
                y: json[o].LATITUDE,
                attr: { ...json[o] },
                click: this.onIconClick,
                mouseover: function (g) {
                    let symbol = g.symbol;
                    if (symbol.setWidth) {
                        symbol.setWidth(140 + 9);
                        symbol.setHeight(140 + 36);
                    }
                    g.setSymbol(symbol);
                    let param2 = {
                        id: 'SHIP_CRUISE',
                        layerId: 'SHIP_CRUISE_HOVERTEXT',
                        x: g.geometry.x,
                        y: g.geometry.y,
                        text: g.attributes.SHIPNAME_EN || g.attributes.SHIPNAME_CN,
                        size: '10pt',
                        color: 'red',
                        offsetX: 0,
                        offsetY: 132,
                        visible: true,
                        layerIndex: 10,
                    }
                    that.props.map.mapDisplay.text(param2);
                },
                mouseout: function (g) {
                    let symbol = g.symbol;
                    if (symbol.setWidth) {
                        symbol.setWidth(140);
                        symbol.setHeight(140);
                    }
                    g.setSymbol(symbol);
                    that.props.map.mapDisplay.clearLayer('SHIP_CRUISE_HOVERTEXT');
                },
            }
            this.props.map.mapDisplay.image(param);
            this.props.map.mapDisplay.hide('SHIP_CRUISE');
        }
    }

    handleBigship = (jsons) => {
        let json = jsons.data;
        let that = this;
        for (let o in json) {
            // json[o].name = '班轮详情';
            json[o].name = [<div className='gjTitle' onClick={() => this.setState({ items: 1 })}>班轮详情</div>, <div className='gjTitle' onClick={() => this.clickTitle(json[o])}>历史轨迹</div>];
            json[o].colname = 'bigship';
            if (Number(json[o].LONGITUDE) !== 0 && Number(json[o].LATITUDE) !== 0) {
                let param = {
                    id: 'SHIP_LAYER' + o,
                    layerId: 'SHIP_LAYER',
                    src: BigShipIcon,
                    width: 70,
                    height: 140,
                    angle: (Number(json[o].HEADING) / 100) - 90,
                    x: json[o].LONGITUDE,
                    y: json[o].LATITUDE,
                    attr: { ...json[o] },
                    click: this.onIconClick,
                    mouseover: function (g) {
                        let symbol = g.symbol;
                        if (symbol.setWidth) {
                            symbol.setWidth(70 + 9);
                            symbol.setHeight(140 + 36);
                        }
                        g.setSymbol(symbol);
                        let param2 = {
                            id: 'BIG_SHIP_LAYER',
                            layerId: 'BIG_SHIP_LAYER_HOVERTEXT',
                            x: g.geometry.x,
                            y: g.geometry.y,
                            text: g.attributes.CSHIPNAME || g.attributes.SHIPNAME,
                            size: '10pt',
                            color: 'red',
                            offsetX: 0,
                            offsetY: 132,
                            visible: true,
                            layerIndex: 10,
                        }
                        that.props.map.mapDisplay.text(param2);
                    },
                    mouseout: function (g) {
                        let symbol = g.symbol;
                        if (symbol.setWidth) {
                            symbol.setWidth(70);
                            symbol.setHeight(140);
                        }
                        g.setSymbol(symbol);
                        that.props.map.mapDisplay.clearLayer('BIG_SHIP_LAYER_HOVERTEXT');
                    },
                }
                this.props.map.mapDisplay.image(param);
                this.props.map.mapDisplay.hide('SHIP_LAYER');
            }
        }
    }

    handleBarge = (jsons) => {
        let json = jsons.data;
        let that = this;
        for (let o in json) {
            json[o].name = '驳船详情';
            json[o].colname = 'bargeship';
            if (Number(json[o].LONGITUDE) !== 0 && Number(json[o].LATITUDE) !== 0) {
                let param = {
                    id: 'BARGE_SHIP_LAYER' + o,
                    layerId: 'BARGE_SHIP_LAYER',
                    src: BargeIcon,
                    width: 70,
                    height: 140,
                    angle: (Number(json[o].HEADING) / 100) - 90,
                    x: json[o].LONGITUDE,
                    y: json[o].LATITUDE,
                    attr: { ...json[o] },
                    click: this.onIconClick,
                    mouseover: function (g) {
                        let symbol = g.symbol;
                        if (symbol.setWidth) {
                            symbol.setWidth(70 + 9);
                            symbol.setHeight(140 + 36);
                        }
                        g.setSymbol(symbol);
                        console.log(g);
                        let param2 = {
                            id: 'BARGE_SHIP_LAYER',
                            layerId: 'BARGE_SHIP_HOVERTEXT',
                            x: g.geometry.x,
                            y: g.geometry.y,
                            text: g.attributes.CSHIPNAME || g.attributes.SHIPNAME,
                            size: '10pt',
                            color: 'red',
                            offsetX: 0,
                            offsetY: 132,
                            visible: true,
                            layerIndex: 10,
                        }
                        that.props.map.mapDisplay.text(param2);
                    },
                    mouseout: function (g) {
                        let symbol = g.symbol;
                        if (symbol.setWidth) {
                            symbol.setWidth(70);
                            symbol.setHeight(140);
                        }
                        g.setSymbol(symbol);
                        that.props.map.mapDisplay.clearLayer('BARGE_SHIP_HOVERTEXT');
                    },
                }
                this.props.map.mapDisplay.image(param);
                this.props.map.mapDisplay.hide('BARGE_SHIP_LAYER');
            }
        }
    }

    /** 图标点击事件 */
    onIconClick = (e) => {
        this.setState({ isShowDes: false });
        let attr = e.attributes;
        publish('tableName_find').then((res) => {
            let temp = {};
            res[0].features.forEach((value, key) => temp[value.type] = value.table);
            this.setState(temp);
            this.setState({
                desColumns: temp[attr.colname],
                desTitle: attr.name,
                desItem: attr,
                isShowDes: true,
                items: 1,
            });
        });
    }

    /** 鼠标移入事件 */
    toolTipIn = (e) => {
        let datajson = e.attributes;
        let dots = datajson.geom.rings[0].map((p) => { return { x: p[0], y: p[1] }; });
        let params = {
            id: 'port_view1',
            layerId: 'port_view1',
            fillcolor: [255, 133, 71, 1],
            dots: dots,
            linewidth: 6,
        }
        this.props.map.mapDisplay.polygon(params);

        let temp = { showMT: true, Amap: false, func: 'getData', param: { svn: 'skhg_stage', tableName: 'SCCT_2RD', data: { where: "TERMINALCODE='" + datajson.code + "'" } } };
        const mapper = {
            SCT: temp,
            CCT: temp,
            MCT: temp,
            CWGH: { showMT: true, Amap: false, func: 'getData', param: { svn: 'skhg_stage', tableName: 'SCCT_2RD', data: { where: "TERMINALCODE='SCT'" } } },
            ZSGW: { showMT: false, Amap: true, func: 'getData', param: { svn: 'skhg_stage', tableName: 'SCCT_2RD', data: { where: "TERMINALCODE='" + datajson.code + "'" } } },
            YLMG: { showMT: false, Amap: true, func: 'getData', param: { svn: 'skhg_loader', tableName: 'YLMG_DAY_PF_STAT', data: { where: 'trunc(d_date) =  trunc(sysdate - 1 )' } } },
            YTH: { showMT: false, Amap: true, func: 'getData', param: { svn: 'skhg_loader', tableName: 'YTH_2RD', data: { where: 'trunc(d_date) =  trunc(sysdate -1 )' } } },
            SZMS_CK: { showMT: false, Amap: true, func: 'getData', param: { svn: 'skhg_stage', tableName: 'SZMS_2RD', data: { where: '1=1' } } },
            ZGMS_CK: { showMT: false, Amap: true, func: 'getData', param: { svn: 'skhg_stage', tableName: 'ZGMS_2RD', data: { where: '1=1' } } },
            CIC: { showMT: false, Amap: true, func: 'getData', param: { svn: 'skhg_stage', tableName: 'CIC_2RD', data: { where: '1=1' } } },
            CMBL: { showMT: false, Amap: true, func: 'getData', param: { svn: 'skhg_stage', tableName: 'CMBL_2RD', data: { where: '1=1' } } },
        };

        const keys = {
            YLMG: { PF_ARR_D_TOT: '进港船舶', PF_DEP_D_TOT: '出港船舶' },
            YTH: { VF_ARR_TOT: '进港船舶', VF_DEP_TOT: '出港船舶' },
            SZMS_CK: { STORK_AMOUNT: '库存数量', OUT_STOR_NUM: '出库数量', IN_STOR_NUM: '入库数量', SECLARE_AMOUNT: '申报数量' },
            ZGMS_CK: { STORK_AMOUNT: '库存数量', OUT_STOR_NUM: '出库数量', IN_STOR_NUM: '入库数量', SECLARE_AMOUNT: '申报数量' },
            ZSGW: { a: '进港船舶', b: '出港船舶', c: '进闸车辆', d: '出闸车辆', e: '内外贸堆场间调拨车辆' },
            CIC: { INCOMINGCNTS: '待调拨入场', CHECKINGCNTRSSUMMARY: '在场待查柜', CHECKEDCNTROKS: '查验完正常', CHECKEDCNTRHOLDS: '查验完扣柜', OUTINGCNTRS: '待调拨出场' },
            CMBL: { I: '进闸车辆', E: '出闸车辆', SELFWAREHOUSENUM: '区内仓库', ENTERPRISENUM: '驻区企业', DECLAREDOCNUM: '申报的进出区单量' },
        };

        let code = datajson.code;
        publish(mapper[code].func, mapper[code].param).then((res) => {
            this.setState({
                showMT: mapper[code].showMT,
                Amap: mapper[code].Amap,
                tip: {
                    mtJson: mapper[code].showMT ? res[0].features : { data: Object.keys(keys[code]).map((key) => { return { name: keys[code][key], number: res[0].features.length > 0 ? res[0].features[0].attributes[key] : 123456 } }) },
                    mapDesc: datajson,
                },
            });
        });

    }

    /** 地图内容展示状态切换 */
    mapItemsDisplay = (key) => {
        let flag = !this.state[key];
        this.setState({ [key]: flag }, () => {
            flag ? this.props.map.mapDisplay.hide(key) : this.props.map.mapDisplay.show(key);
        });
        if (key == 'QUERY_BOX') {
            !this.state[key] ? [this.setState({ box_xq: { QUERY_BOX_XQ: false } }, this.props.map.mapDisplay.hide('QUERY_BOX_dwxs'), this.props.map.mapDisplay.hide('QUERY_BOX_dc'), this.props.map.mapDisplay.hide('QUERY_BOX_dw'))] : [this.props.map.mapDisplay.show('QUERY_BOX_dwxs'), this.props.map.mapDisplay.show('QUERY_BOX_dc'), this.props.map.mapDisplay.show('QUERY_BOX_dw')];
        }
    }


    /** 查验集装箱切换信息  */
    handleCYJZXXQ = (e) => {
        publish('webAction', { svn: 'skhg_loader_service', path: 'queryTableByWhere', data: { tableName: 'V_IMAP_CHK_CHECK_INFO', where: 'STATUS = ' + e.DETAILID } }).then((res) => {
            let flds = Object.keys(res[0].attr).map((e, i) => { return { title: res[0].attr[e], dataIndex: e }; });
            this.setState({ box_xq: { QUERY_BOX_XQ: true, tab: flds, val: res[0].data, tit: e.CHECK_COUNT_TYPE } });
        })
    }

    /** 班轮中途停泊靠船历史轨迹 */
    clickTitle = (key) => {
        console.log(key);
        // publish('webAction', { svn: 'eportapisct', path: 'GContainerHistoryInfo', data: { System: '', PageIndex: 1, PageSize: 30, SortBy: '', IsDescending: false, ContainerNo: key.CONTAINERNO } }).then((res) => {
        //     this.setState({ itemData: res[0].InnerList, items: 2 });
        // });
    }

    render() {
        let { tip = {}, items = 1 } = this.state;
        let descmsg = [];
        if (items === 1) {
            descmsg = <Details columns={this.state.desColumns} columnTotal={2} item={this.state.desItem}></Details>;
        } else {
            descmsg = <Table rowNo={true} style={{ width: '100%', height: 1740 }} id={id2} selectedIndex={null} flds={this.state.ShipTrackFlds} datas={this.state.itemData} trClick={null} trDbclick={null} />
        }
        let StyleView = {
            'bottom': '5%',
            'left': '0',
            'animation': 'showAnimete 0.5s ease',
            'transformOrigin': 'left center',
        };
        return (
            <div>
                <div className="mapbtn">
                    <div onClick={() => this.mapItemsDisplay('SHIP_CRUISE')} style={{ margin: '20px' }} className={this.state.SHIP_CRUISE ? 'mapbtn-noSelected' : 'mapbtn-btn1'}>客轮</div>
                    <div onClick={() => this.mapItemsDisplay('SHIP_LAYER')} style={{ margin: '20px' }} className={this.state.SHIP_LAYER ? 'mapbtn-noSelected' : 'mapbtn-btn2'}>班轮</div>
                    <div onClick={() => this.mapItemsDisplay('BARGE_SHIP_LAYER')} style={{ margin: '20px' }} className={this.state.BARGE_SHIP_LAYER ? 'mapbtn-noSelected' : 'mapbtn-btn3'}>驳船</div>
                    <div onClick={() => this.mapItemsDisplay('QUERY_BOX')} style={{ margin: '20px' }} className={this.state.QUERY_BOX ? 'mapbtn-noSelected' : 'mapbtn-btn4'} >查验集装箱</div>
                    {/* <div className={this.state.map ? 'mapbtn-btn4' : 'mapbtn-noSelected'}>地图</div> */}
                </div>
                {
                    this.state.showMT ?
                        <NoHornTip title={this.state.tip.mapDesc.name} style={{ position: 'absolute', bottom: '235px', right: '50px' }}>
                            {/** 内部信息 */}
                            <PortMsg msg={this.state.tip} />
                            <PortPie msg={this.state.tip} />
                        </NoHornTip> : null
                }
                {this.state.Amap ? <Tables flds={this.state.tip.mapDesc.name} datas={this.state.tip.mtJson}></Tables> : null}
                {this.state.isShowDes ? <Desc className='descTip' style={StyleView} title={this.state.desTitle} content={descmsg} close={() => this.setState({ isShowDes: false })} /> : null}
                {this.state.QUERY_BOX ? null : <div className='boxTs animated'>
                    <Table
                        rowNo={true}
                        title={{ name: this.state.box.tit, export: false, close: false }}
                        style={{ height: 965, width: 2400 }}
                        id={'qqq'}
                        selectedIndex={null}
                        flds={this.state.box.tab}
                        datas={this.state.box.val}
                        trClick={null}
                        trDbclick={(e) => this.handleCYJZXXQ(e)}
                        myTd={null}
                        hide={{ DETAILID: true }} />
                </div>}
                {
                    this.state.box_xq.QUERY_BOX_XQ ? <div className='boxQXTs animated'>
                        <Table
                            rowNo={true}
                            title={{ name: this.state.box_xq.tit, export: false, close: () => this.setState({ box_xq: { QUERY_BOX_XQ: false } }) }}
                            style={{ height: 2240, width: 4600 }}
                            id={'qqq2'}
                            selectedIndex={null}
                            flds={this.state.box_xq.tab}
                            datas={this.state.box_xq.val}
                            trClick={null}
                            trDbclick={null}
                            myTd={null}
                            hide={{ DETAILID: true }} />
                    </div> : null
                }
            </div>
        )
    }
}


/** 园区、仓库等信息 */
class Tables extends React.Component {
    render() {
        let { flds = [], datas = {} } = this.props;
        return (
            <div className='mtables animated' style={this.props.style}>
                <div className="mtables-top">{flds}</div>
                <div className='mtables-center'>
                    {
                        datas.data.map((e, a) => {
                            if (a % 2 != 0) {
                                return <div key={a} className="mtables-center-corner">
                                    <div className="mtables-center-corner-view">
                                        <div className="mtables-center-corner-view-1">
                                            <span>{datas.data[a - 1].name} :</span>
                                            <div className='number-view'>
                                                {(getNumberArr(Number(datas.data[a - 1].number) || 0)).map((num, i) => {
                                                    if (num === 'break' || num === 'point') {
                                                        return <div key={i} className={'number-' + num}></div>
                                                    } else return <div key={i} style={{ width: 85, height: 120 }} className={'number-' + num}></div>
                                                })
                                                }
                                            </div>
                                        </div>
                                        <div className="mtables-center-corner-view-1">
                                            <span>{datas.data[a].name} :</span>
                                            <div className='number-view'>
                                                {(getNumberArr(Number(datas.data[a].number) || 0)).map((num, i) => {
                                                    if (num === 'break' || num === 'point') {
                                                        return <div key={i} className={'number-' + num}></div>
                                                    } else return <div key={i} style={{ width: 85, height: 120 }} className={'number-' + num}></div>
                                                })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            } else if (a > datas.data.length - 2 && a % 2 == 0) {
                                return <div key={a} className="mtables-center-corner">
                                    <div className="mtables-center-corner-view">
                                        <div className="mtables-center-corner-view-2">
                                            <span>{datas.data[a].name} :</span>
                                            <span className="mtables-center-corner-view-2-lastNum">{datas.data[a].number}</span>
                                        </div>

                                    </div>
                                </div>
                            }
                        })
                    }
                </div>
                <div className="mtables-bot"></div>
            </div>
        )
    }
}

/** 内部信息 */
class PortMsg extends React.Component {

    render() {
        const { mtJson = [], mapDesc = [] } = this.props.msg;
        const sum = [];
        const bc = [];
        const dc = [];
        var json = {};
        for (var o in mtJson) {
            json[mtJson[o].attributes.TYPE1] = mtJson[o].attributes.AMOUNT;
        }
        json.datas = [{ 'harbor': '进港港口', 'shipname': '班轮驳船' }, { 'harbor': '出港港口', 'shipname': '班轮驳船' }]
        sum.push(getNumberArr((Number(json.BargeIn) || 0) + (Number(json.VesselIn)) || 0));
        sum.push(getNumberArr((Number(json.BargeOut) || 0) + (Number(json.VesselOut)) || 0))
        dc.push(getNumberArr(Number(json.VesselIn) || 0));
        dc.push(getNumberArr(Number(json.VesselOut) || 0));
        bc.push(getNumberArr(Number(json.BargeIn) || 0));
        bc.push(getNumberArr(Number(json.BargeOut) || 0));
        return (
            <div id="msgs" className="Msg">
                {json.datas.map((value, key) =>
                    <div key={key} className="Msg-corner">
                        <div id={'dsadsadsa' + key} className="Msg-corner-flex">
                            <div className="Msg-corner-flex-InShip">
                                <span>{value.harbor}</span>
                                <div className='number-view'>
                                    {sum[key].map((num, i) => { return <div key={i} className={'number-' + num}></div> })}
                                </div>
                            </div>
                            <div className="Msg-corner-flex-InBigShip">
                                <span>{value.shipname}</span>
                                <div className="Msg-corner-flex-InBigShip-val">
                                    <span>{dc[key]}</span>
                                    <span>{bc[key]}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

/** 饼状图 */
class PortPie extends React.Component {
    render() {
        const { mtJson = [] } = this.props.msg;
        var json = {};
        for (var o in mtJson) {
            json[mtJson[o].attributes.TYPE1] = mtJson[o].attributes.AMOUNT;
        }

        publish('port_pie_gk', { value: json.Loading || 0 }).then((res) => {
            if (this.chart) this.chart.dispose();
            this.chart = echarts.init(ReactDOM.findDOMNode(this.refs.echart1));
            this.chart.setOption(res[0]);
        });

        publish('port_pie_gk', { value: json.Discharge || 0 }).then((res) => {
            if (this.chart2) this.chart2.dispose();
            this.chart2 = echarts.init(ReactDOM.findDOMNode(this.refs.echart2));
            this.chart2.setOption(res[0]);
        });

        publish('port_pie_zk', { value: json.GateIn || 0 }).then((res) => {
            if (this.chart3) this.chart3.dispose();
            this.chart3 = echarts.init(ReactDOM.findDOMNode(this.refs.echart3));
            this.chart3.setOption(res[0]);
        });
        publish('port_pie_zk', { value: json.GateOut || 0 }).then((res) => {
            if (this.chart4) this.chart4.dispose();
            this.chart4 = echarts.init(ReactDOM.findDOMNode(this.refs.echart4));
            this.chart4.setOption(res[0]);
        });

        return (
            <div className="Pie">
                <div className='homeRightEcharts' >
                    <div className='homeRightEcharts-tip' style={{ width: 300, height: 400 }}>
                        <div className='homeRightE-1' style={{ height: '100%', width: '100%' }} ref="echart1"></div>
                        <div className='homeRightEcharts-span' ><span >装箱数量</span></div>
                    </div>

                    <div className='homeRightEcharts-tip' style={{ width: 300, height: 400 }}>
                        <div className='homeRightE-2' style={{ height: '100%', width: '100%' }} ref="echart2"></div>
                        <div className='homeRightEcharts-span'><span>卸箱数量</span></div>
                    </div>
                </div>
                <div className='homeRightEcharts' >
                    <div className='homeRightEcharts-tip' style={{ width: 300, height: 400 }}>
                        <div className='homeRightE-3' style={{ height: '100%', width: '100%' }} ref="echart3"></div>
                        <div className='homeRightEcharts-span'><span>进闸数量</span></div>
                    </div>

                    <div className='homeRightEcharts-tip' style={{ width: 300, height: 400 }}>
                        <div className='homeRightE-4' style={{ height: '100%', width: '100%' }} ref="echart4"></div>
                        <div className='homeRightEcharts-span'><span>出闸数量</span></div>
                    </div>
                </div>
            </div>
        )
    }
}

// 港口
export default class Port extends React.Component {

    state = { map: null }
    componentDidMount() {
        this.changeIframe($(ReactDOM.findDOMNode(this.refs.iframe)), '../map/index.html?mtype=two_layer');
    }

    /**
    * 
    * @param {*target} 地图参数  
    * @param {*} url   地图路径
    */
    changeIframe($target, url) {
        var $oIframe = $target.find('iframe');
        if ($oIframe.length > 0) {
            $target.addClass('zoomOut animated');
            $($oIframe[0].contentWindow).on('unload', () => {
                this.addIframe($target, url)
            });
            this.closeIframe($oIframe);
        } else {
            this.addIframe($target, url);
        }
    }

    /**
     * 
     * @param {*target}  地图参数
     * @param {*} url    地图路径
     */
    addIframe($target, url) {
        if (typeof url === 'string' && url.length > 0) {
            var $ifrme = $('<iframe scrolling="auto" frameborder="0" width="100%" height="100%" style="visibility: hidden" allowtransparency="true" src="' + url + '"></iframe>');
            $target.append($ifrme);
            $ifrme.on('load', () => {
                $ifrme.css({ visibility: '' });
                $target.removeClass('zoomOut animated').addClass('zoomIn animated');
                this.setState({ map: $ifrme['0'].contentWindow });
                let mapExtent = {
                    xmin: 113.821099658,
                    ymin: 22.444926626,
                    xmax: 113.963486604,
                    ymax: 22.495485413,
                };
                // console.log(this.props.map);
                $ifrme['0'].contentWindow.mapOper.setMapExtent(mapExtent);
            });
        }
    }

    /**
     * 
     * @param {*target}  地图参数
     * @param {*} url    地图路径
     */
    closeIframe($target, url) {
        let iframe = $iframe[0],
            fwin = $iframe[0].contentWindow;
        try {
            if (fwin.navigator.userAgent.indexOf('Chrome') > -1 ||
                fwin.navigator.userAgent.indexOf('Firefox') > -1) {
                var event = fwin.document.createEvent('HTMLEvents');
                event.initEvent('unload', true, true);
                event.eventType = 'm-sys-close';
                fwin.document.dispatchEvent(event);
            }
            fwin.document.write('');
            fwin.close();
        } catch (ex) {
            // 跨域问题
        }
        iframe.innerHTML = '';
        $($iframe).remove();
    }

    componentWillUnmount() {
        if (this.chart) this.chart.dispose();
    }
    render() {
        let { tview = [], idx = 0 } = this.state;
        const styles = {
            left: 7741,
            width: 3740,
            height: 2760,
            'position': 'absolute',
        }
        return (
            <div className='portMap' style={{ overflow: 'hidden', height: '100%' }}>
                <div className='portleft'>
                    <div ref="iframe"></div>
                    {this.state.map ? <MapOperation map={this.state.map} /> : null}
                </div>
                <Znybj ys={styles} xz={3} />
                {/* <PortRightPanel></PortRightPanel> */}
                {/* <div className='portRight'></div> */}
                {/* <div className='portRight' style={{ marginLeft: 30 }}>
                    <div className='portRight-1' onClick={() => publish('playVedio')}></div>
                    <div className='portRight-2' onClick={() => publish('playVedio')}></div>
                    <div className='portRight-3' onClick={() => publish('playVedio')}></div>
                    <div className='portRight-4' onClick={() => publish('playVedio')}></div>
                </div> */}


            </div>

        )
    }
}