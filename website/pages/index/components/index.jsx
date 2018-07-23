
import $ from 'jquery';
import React from 'react';

/** 引入页面 ： */
import Login from './login';
import AgingControl from './agingControl';//  通关时效
import Home from './home';// 地图首页
import Sjzhcx from './sjzhcx';// 数据查询综合
import Port from './port';
import Pier from './pier';
import WareHouse from './wareHouse';
import IWarning from './iWarning';
import IWarningNew from './iWarningNew';
import ZNYBJ from './ZNYBJ';
import ICommand from './iCommand';

/** 引入订阅 */
import { publish, subscribe, unsubscribe } from '../../../frame/core/arbiter';

/** 引入样式 */
import '../../../frame/less/magic.less';    // animations.css 3D效果
import '../../../frame/less/xcConfirm.less'; // jquery 弹出窗口插件
import '../less';
import 'animate.css';


class Logins extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this._jgcsjk = this._jgcsjk.bind(this);
    //     this._tgsxjk = this._tgsxjk.bind(this);
    //     this._sjzhcx = this._sjzhcx.bind(this);
    // }
    jgcsjk() {
        console.log('1')
        publish('changeiframe', { index: 1, props: {} });
    }

    tgsxjk() {
        console.log('2')
        publish('changeiframe', { index: 1, props: {} });
    }

    sjzhcx() {
        console.log('3')
        publish('changeiframe', { index: 1, props: {} });
    }

    render() {
        return (
            <div className='iframe'>
                <div onClick={() => this.jgcsjk()} className='iframe-jg' ></div>
                <div onClick={() => this.tgsxjk()} className='iframe-tg' ></div>
                <div onClick={() => this.sjzhcx()} className='iframe-sj' ></div>
            </div>
        )
    }
}

export default class App extends React.Component {
    state = {
        index: 0,
        curLayer: null,
        curProps: {},
        dtindex: 0,
    }

    layers = {}
    componentDidMount() {
        this.sub_changeLayer = subscribe('changeLayer', this.changeLayer);
        this.sub_changeiframe = subscribe('changeiframe', this.changeiframe);
        publish('changeiframe', { index: 4, props: {} });
    }

    componentWillUnmount() {
        if (this.sub_changeLayer) unsubscribe(this.sub_changeLayer);
        if (this.sub_changeiframe) unsubscribe(this.sub_changeiframe);
    }

    changeLayer = (ops) => {
        let idx = this.state.dtindex;
        let curProps = ops.props;
        let index = ops.index;
        if (index != idx || curProps.defaultLayer) {
            let curLayer = null;
            switch (index) {
                case 1:
                    curLayer = <Port {...curProps} />;
                    break;
                case 2:
                    curLayer = <Pier {...curProps} />;
                    break;
                case 3:
                    curLayer = <WareHouse {...curProps} />;
                    break;
                case 4:
                    curLayer = <IWarning {...curProps} />;
                    break;
                default:
                    curLayer = <Home {...curProps} />;
            }
            this.layers[index] = { layerIndex: index, props: curProps };
            $('.mbody-content').addClass('zoomIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => $('.mbody-content').removeClass('zoomIn animated'));
            this.setState({ curLayer: null });
            this.setState({ dtindex: index, curLayer: curLayer, curProps: curProps });
        }
    }

    changeiframe = (ops) => {
        let idx = this.state.index;
        let curProps = ops.props;
        let index = ops.index;
        if (index != idx || curProps.defaultLayer) {
            let curLayer = null;
            switch (index) {
                case 1:
                    curLayer = <Home {...curProps} />;
                    break;
                case 2:
                    curLayer = <AgingControl {...curProps} />;
                    break;
                case 3:
                    curLayer = <Sjzhcx {...curProps} />;
                    break;
                default:
                    curLayer = <Logins {...curProps} />;
            }
            this.layers[index] = { layerIndex: index, props: curProps };
            $('.mbody-btn').addClass('fadeIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => $('.mbody-btn').removeClass('fadeIn animated'));
            $('.mbody-content').addClass('zoomIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => $('.mbody-content').removeClass('zoomIn animated'));
            this.setState({ curLayer: null });
            this.setState({ index: index, curLayer: curLayer, curProps: curProps });
        }
    }

    handeBack() {
        console.log('123');
        publish('changeiframe', { index: 4, props: {} });
    }

    render() {
        return (
            <div className='mbody'>
                {
                    this.state.index < 4 ? <div className="mbody-btn" onClick={() => this.handeBack()}> 主页 </div> : <div />
                }
                <div className='mbody-content'>
                    {this.state.curLayer}
                </div>
            </div>
        )
    }
}