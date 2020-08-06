import React from 'react';
import '../../less';
import 'animate.css';
import $ from 'jquery';
import { publish, subscribe, unsubscribe } from '../../../../frame/core/arbiter';
import { Vedio, ViwePager, Table, ImgDisplay, Panel, Vedios, QueryBox, QueryBoxs } from '../../../../frame/componets/index';
// import ppppp from '../../images/ppppp.jpg'
import bg1 from '../../images/sjzhcx/bg1.png'

import ExportSb from './export/export_sb';
import ExportCy from './export/export_cy';

class SjzhcxCard extends React.Component {
    render() {
        const {title, titleStyle, width, height, backgroundImage, children, style, ...others} = this.props;
        const targetStyle = {
            ...style,
            width: `${width}px`, 
            height: `${height}px`,
        }
        if (backgroundImage) {
            targetStyle.backgroundImage = `url(${backgroundImage})`
        }

        return (
            <div className="sjzhcx-card" style={targetStyle} {...others}>
                <p className="sjzhcx-card-title" style={titleStyle}>{title}</p>
                    <div style={{boxSizing: 'border-box', padding: '40px'}}>{children}</div>
            </div>
        )
    }
}

export default class sjzhcx extends React.Component {
    state = {}

    back = () => {
        publish('changeiframe', { index: 5, props: {} });
    }

    render() {
        return (
            <div className='ac' style={{display: 'flex'}}>
                {/* <img src={ppppp} style={{width: '11520px'}} /> */}
                <div className='ac-back' onClick={this.back}> <span style={{ 'position': 'relative', left: 120, 'whiteSpace': 'nowrap', 'fontSize': 80, top: '-5px' }}> 返回主页 </span></div>
                <div className='ac-ckbox' style={{width: '4600px', position: 'relative'}}>
                    <div className='ac-ckbox-title' style={{left: '300px'}}>数据综合查询</div>
                    <div style={{width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap'}}>
                        {/* <SjzhcxCard title="集装箱" titleStyle={{color: '#77f1f7'}} width="2600" height="1220" style={{margin: '300px 70px 120px'}}>
                            <div style={{color: '#fff', fontSize: '100px', lineHeight: '1000px', textAlign: 'center'}}>集装箱</div>
                        </SjzhcxCard>
                        <SjzhcxCard title="船舶" titleStyle={{color: '#77f1f7'}} width="2600" height="1220" style={{margin: '300px 70px 120px'}}>
                            <div style={{color: '#fff', fontSize: '100px', lineHeight: '1000px', textAlign: 'center'}}>船舶</div>
                        </SjzhcxCard>
                        <SjzhcxCard title="集装箱船舶组合查询" titleStyle={{color: '#77f1f7'}} width="2600" height="1220" style={{margin: '0 70px'}}>
                            <div style={{color: '#fff', fontSize: '100px', lineHeight: '1000px', textAlign: 'center'}}>集装箱船舶组合查询</div>
                        </SjzhcxCard>
                        <SjzhcxCard title="码头" titleStyle={{color: '#77f1f7'}} width="2600" height="1220" style={{margin: '0 70px'}}>
                            <div style={{color: '#fff', fontSize: '100px', lineHeight: '1000px', textAlign: 'center'}}>码头</div>
                        </SjzhcxCard> */}
                    </div>
                </div>
                <div className='ac-ckbox' style={{width: '6600px', position: 'relative'}}>
                    <div className='ac-back' onClick={() => publish('changeiframe', { index: 5, props: {} })}> <span style={{ 'position': 'relative', left: 120, 'whiteSpace': 'nowrap', 'fontSize': 80, top: '-5px' }}> 返回主页 </span></div>
                    <div className='ac-ckbox-title' style={{left: '300px'}}>EXPORT数据展示</div>
                    <div style={{ display: 'flex', width: '100%', height: '100%'}}>
                        <div style={{width: '4800px', height: '100%', margin: '0 70px', display: 'flex', flexWrap: 'wrap'}}>
                            <SjzhcxCard title="申报" titleStyle={{color: '#77f1f7'}} width="4800" height="1290" style={{margin: '250px 0 120px'}}>
                                <ExportSb />
                            </SjzhcxCard>
                            <SjzhcxCard title="查验" titleStyle={{color: '#77f1f7'}} width="4800" height="1360">
                                <ExportCy />
                            </SjzhcxCard>
                        </div>
                        <div style={{width: '1600px', height: '100%', overflow: 'hidden' }}>
                            <SjzhcxCard title="码头" titleStyle={{color: '#77f1f7'}} width="1600" height="2800" style={{margin: '250px 0 0'}} backgroundImage={bg1}>
                            </SjzhcxCard>    
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}