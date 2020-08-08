import React from 'react';
import '../../less';
import 'animate.css';
import $ from 'jquery';
import { publish, subscribe, unsubscribe } from '../../../../frame/core/arbiter';
import { Vedio, ViwePager, Table, ImgDisplay, Panel, Vedios, QueryBox, QueryBoxs } from '../../../../frame/componets/index';
// import ppppp from '../../images/ppppp.jpg'
import bg1 from '../../images/sjzhcx/bg1.png';
import leftFirstBg from '../../images/sjzhcx/2左侧/里-左.png';
import leftSecondBg from '../../images/sjzhcx/2左侧/里右-上.png';
import rightBg from '../../images/sjzhcx/3右边/里-右.png';
import ExportSb from './export/export_sb';
import ExportCy from './export/export_cy';
import CombinationQueryCard from './integratedquery/CombinationQuery'
import SingQuery from './integratedquery/SingQuery'
import QueryTerminalData from './terminalData/queryTerminalData';
import TodayTerminalData from './terminalData/todayTerminalData';

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
                <div className='ac-ckbox-left' style={{width: '3700px', position: 'relative'}}>
                    <div className='ac-ckbox-title' style={{left: '186px',top: '25px',fontSize: '96px'}}>数据综合查询</div>
                    <div style={{width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap'}}>
                    <div style={{ display: 'flex', width: '100%', height: '100%'}}>
                    <div style={{width: '1728px', height: '100%', margin: '0 60px', display: 'flex', flexWrap: 'wrap'}}>
                        <SjzhcxCard title="报关单舱单组合查询" titleStyle={{color: '#77f1f7'}} width="1728" height="2783" style={{backgroundImage: `url(${leftFirstBg})`,margin: '290px 0px 85px'}}>
                         <CombinationQueryCard />
                        </SjzhcxCard>
                    </div>
                    <div style={{width: '1756px', height: '100%', margin: '0 42px', display: 'flex', flexWrap: 'wrap'}}>
                        <SjzhcxCard title="集装箱" titleStyle={{color: '#77f1f7'}} width="1756" height="1245" style={{ backgroundImage: `url(${leftSecondBg})`,margin: '290px 0 0px'}}>
                          <SingQuery img={44} name="集装箱"/>
                        </SjzhcxCard>
                         <SjzhcxCard title="船舶" titleStyle={{color: '#77f1f7'}} width="1756" height="1245" style={{backgroundImage: `url(${leftSecondBg})`, margin: '256px 0 0px'}}>
                          <SingQuery img={43} name="船舶"/>
                        </SjzhcxCard>
                    </div>
                    </div>
                    </div>
                </div>
                <div className='ac-ckbox' style={{width: '7584px', position: 'relative'}}>
                    <div className='ac-back' onClick={() => publish('changeiframe', { index: 5, props: {} })}> <span style={{ 'position': 'relative', left: 120, 'whiteSpace': 'nowrap', 'fontSize': 80, top: '-5px' }}> 返回主页 </span></div>
                    <div className='ac-ckbox-title' style={{left: '300px'}}>EXPORT数据展示</div>
                    <div style={{ display: 'flex', width: '100%', height: '100%'}}>
                        <div style={{width: '5600px', height: '100%', margin: '0 70px', display: 'flex', flexWrap: 'wrap'}}>
                            <SjzhcxCard title="申报" titleStyle={{color: '#77f1f7'}} width="5600" height="1290" style={{margin: '250px 0 120px'}}>
                                <ExportSb />
                            </SjzhcxCard>
                            <SjzhcxCard title="查验" titleStyle={{color: '#77f1f7'}} width="5600" height="1360">
                                <ExportCy />
                            </SjzhcxCard>
                        </div>
                        <div style={{width: '1700px', height: '100%', overflow: 'hidden' }}>
                            <SjzhcxCard title="码头数据" titleStyle={{color: '#77f1f7'}} width="1700" height="2800" style={{margin: '250px 0 0'}} backgroundImage={rightBg}>
                             <div>
                               <QueryTerminalData /> 
                             </div>
                             <div>
                               <TodayTerminalData />
                             </div>
                            </SjzhcxCard>    
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}