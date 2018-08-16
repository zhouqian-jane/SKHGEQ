import '../less';
import 'animate.css';
import $ from 'jquery';
import moment from 'moment';
import React from 'react';
import { Vedio} from '../../../frame/componets/index';
import { publish, subscribe, unsubscribe } from '../../../frame/core/arbiter';
import Home from './home';
import Port from './port';
import Pier from './pier';
import WareHouse from './wareHouse';
import IWarning from './iWarning';
import '../../../frame/less/magic.less';
import '../../../frame/less/xcConfirm.less';

class Timer extends React.Component {
    state = { msg: '' }
    componentDidMount() {
        const week = { '1': '星期一', '2': '星期二', '3': '星期三', '4': '星期四', '5': '星期五', '6': '星期六', '7': '星期日' };
        let tq = '';
        let postData = {
            key: 'dfb9a576fbcb2c9a13a65ab736e47004',
            city: '深圳',
            extensions: 'all',
        };
        $.ajax({
            url: 'http://restapi.amap.com/v3/weather/weatherInfo',
            type: 'post',
            data: postData,
            success: function (status) {
                tq = status.forecasts[0].casts[0].dayweather;
            },
        })
        function initWeather() {
            publish('webAction', { svn: 'sojson', path: 'weather/json.shtml', data: { city: '深圳' } }).then((res) => {
                if (res[0].message === 'Success !') { tq = res[0].data.forecast[0].type; }
            });
        }
        // initWeather();
        setInterval(() => {
            let msg = moment().format('YYYY年MM月DD日 ') + week[moment().format('e')] + moment().format(' HH:mm:ss') + '           ' + tq;
            this.setState({ msg });
        }, 1000);
        setInterval(initWeather, 1000 * 60 * 60);
    }
    render() {
        return <div className='mheader-time'>{this.state.msg}</div>
    }
}

export default class App extends React.Component {
    state = {
        index: null,
        curLayer: null,
        curProps: {},
        viwePager: null,
        layerName: null,
        agingControl: false,
        cv: {},
    }
    layers = {}
    componentDidMount() {
        this.sub_changeLayer = subscribe('changeLayer', this.changeLayer);
        this.sub_playVedio = subscribe('playVedio', this.playVedio);
        this.sub_viwePager = subscribe('playImgs', this.playImgs);
        this.sub_playImg = subscribe('playImg', this.playImg);
        this.sub_closeAC = subscribe('closeAC', (flag) => this.setState({ agingControl: flag }));
        this.sub_setLayerName = subscribe('setLayerName', (name) => this.setState({ layerName: name }));
        publish('changeLayer', { index: 0, props: {} });
    }
    componentWillUnmount() {
        if (this.sub_changeLayer) unsubscribe(this.sub_changeLayer);
        if (this.sub_playVedio) unsubscribe(this.sub_playVedio);
        if (this.sub_viwePager) unsubscribe(this.sub_viwePager);
        if (this.sub_playImg) unsubscribe(this.sub_playImg);
        if (this.sub_setLayerName) unsubscribe(this.sub_setLayerName);
    }
    changeLayer = (ops) => {
        let idx = this.state.index;
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
            this.setState({ index: index, curLayer: curLayer, curProps: curProps, layerName: curProps && curProps.layerName ? curProps.layerName : '海关监管区域' });
        }
    }

    gologin = () => {
        publish('changeiframe', { index: 4, props: {} });
    }

    playVedio = (vedio) => {

        let data = [
            { name: 'SCT大楼12F大厅', url: 'http://www.cheluyun.com/javascript/zsg/?id=100032172&rtmp=rtmp://playrtmp.simope.com:1935/live/07f39deff1?liveID=100032172&hls=http://playhls.simope.com/live/07f39deff1/playlist.m3u8?liveID=100032172' },
            { name: 'SCT4号泊位', url: 'http://www.cheluyun.com/javascript/zsg/?id=100032166&rtmp=rtmp://playrtmp.simope.com:1935/live/e4b0c82c15?liveID=100032166&hls=http://playhls.simope.com/live/e4b0c82c15/playlist.m3u8?liveID=100032166' },
            { name: 'SCT工程部维修车间', url: 'http://www.cheluyun.com/javascript/zsg/?id=100032170&rtmp=rtmp://playrtmp.simope.com:1935/live/89619ada51?liveID=100032170&hls=http://playhls.simope.com/live/89619ada51/playlist.m3u8?liveID=100032170' },
            { name: 'SCT大楼1F监控室', url: 'http://www.cheluyun.com/javascript/zsg/?id=100032167&rtmp=rtmp://playrtmp.simope.com:1935/live/105c2009a0?liveID=100032167&hls=http://playhls.simope.com/live/105c2009a0/playlist.m3u8?liveID=100032167' },
            { name: 'CCT操作部中控室', url: 'http://www.cheluyun.com/javascript/zsg/?id=100032173&rtmp=rtmp://playrtmp.simope.com:1935/live/ee2e705054?liveID=100032173&hls=http://playhls.simope.com/live/ee2e705054/playlist.m3u8?liveID=100032173' },
            { name: 'CCT工程部维修车间', url: 'http://www.cheluyun.com/javascript/zsg/?id=100032171&rtmp=rtmp://playrtmp.simope.com:1935/live/d37820f07a?liveID=100032171&hls=http://playhls.simope.com/live/d37820f07a/playlist.m3u8?liveID=100032171' },
            { name: 'MCT闸口安保室', url: 'http://www.cheluyun.com/javascript/zsg/?id=100032174&rtmp=rtmp://playrtmp.simope.com:1935/live/28110b959b?liveID=100032174&hls=http://playhls.simope.com/live/28110b959b/playlist.m3u8?liveID=100032174' },
            { name: 'SCT 1# 2#堆场', url: 'http://www.cheluyun.com/javascript/zsg/?id=100031600&rtmp=rtmp://playrtmp.simope.com:1935/live/524622521d?liveID=100031600&hls=http://playhls.simope.com/live/524622521d/playlist.m3u8?liveID=100031600' },
        ];
        try {
            if (vedio) {
                this.setState({ cv: {} }, () => this.setState({ cv: vedio }));
            }
            else {
                this.setState({ cv: {} }, () => this.setState({ cv: data[7] }));
            }
        } catch (e) {
            alert('没有接入到视频信息');
        }
    }
    closeVedio = () => {
        this.setState({ cv: {} });
    }

    goBack = () => {
        let index = this.state.index;
        if (index >= 1) this.changeLayer({ index: index - 1, props: this.layers[index - 1].props });
    }

    playImgs = (imgs) => {
        this.setState({ viwePager: { imgs: imgs } }, () => $('#imgsDisplay').addClass('bounceInLeft animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => $('#imgsDisplay').removeClass('bounceInLeft animated')));
    }

    render() {
        return (
            <div className='mframe'>
                <div className='mheader'>
                    <div className='mheader-title'></div>
                    <div className='mheader-top'>
                        <div className='mheader-home' onClick={this.gologin} />
                        <div className='mheader-back' onClick={this.goBack} />
                        <div className='mheader-nt'>
                            <div className='mheader-name'>{this.state.layerName}</div>
                            <Timer />
                        </div>
                    </div>
                </div>
                <div className='mbody'><div className='mbody-content'>{this.state.curLayer}</div></div>
                <div className='mfooter' />
                {this.state.cv.url ? <Vedio close={this.closeVedio} video={this.state.cv} scale={this.scaleCv} style={this.state.scaleCv ? { width: 3022, height: 1070, top: 460, left: 98 } : { width: 3026, height: 1075, top: 1265, left: 98, transform: 'scale(2.5)' }} /> : null}
            </div>
        )
    }
}