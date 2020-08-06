
import $ from 'jquery';
import React from 'react';
import 'antd/dist/antd.css';

/** 引入页面 ： */
import Login from './login';
import AgingControl from './agingControl';//  通关时效
import Sjzhcx from './sjhzcx/inedx';// 数据查询综合


/** 引入订阅 */
import { publish, subscribe, unsubscribe } from '../../../frame/core/arbiter';

/** 引入样式 */
import '../../../frame/less/magic.less';    // animations.css 3D效果
import '../../../frame/less/xcConfirm.less'; // jquery 弹出窗口插件
import '../less';
import 'animate.css';


class Logins extends React.Component {
    jgcsjk() {
        publish('changeiframe', { index: 1, props: {} });
    }

    tgsxjk() {
        publish('changeiframe', { index: 2, props: {} });
    }

    sjzhcx() {
        publish('changeiframe', { index: 3, props: {} });
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
        this.sub_changeiframe = subscribe('changeiframe', this.changeiframe);
        publish('changeiframe', { index: 4, props: {} });
    }

    componentWillUnmount() {
        if (this.sub_changeiframe) unsubscribe(this.sub_changeiframe);
    }

    changeiframe = (ops) => {
        let idx = this.state.index;
        let curProps = ops.props;
        let index = ops.index;
        if (index != idx || curProps.defaultLayer) {
            let curLayer = <Sjzhcx {...curProps} />;
            // switch (index) {
            //     case 1:
            //         curLayer = <Login {...curProps} />;
            //         break;
            //     case 2:
            //         curLayer = <AgingControl {...curProps} />;
            //         break;
            //     case 3:
            //         curLayer = <Sjzhcx {...curProps} />;
            //         break;
            //     case 5 : 
            //         window.location.reload();
            //         break;
            //     default:
            //         // window.location.reload();
            //         curLayer = <Logins {...curProps} />;
            // }
            this.layers[index] = { layerIndex: index, props: curProps };
            $('.mbody-btn').addClass('fadeIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => $('.mbody-btn').removeClass('fadeIn animated'));
            $('.mbody-content').addClass('zoomIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => $('.mbody-content').removeClass('zoomIn animated'));
            this.setState({ curLayer: null });
            this.setState({ index: index, curLayer: curLayer, curProps: curProps });
        }
    }
    
    render() {
        return (
            <div className='mbody' style={{height: '100%'}}>
                <div className='mbody-content' style={{width: '100%'}}>
                    {this.state.curLayer}
                </div>
            </div>
        )
    }
}

