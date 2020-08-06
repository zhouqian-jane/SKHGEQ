import React from 'react';
import '../../../less';
import 'animate.css';
import $ from 'jquery';
import { publish, subscribe, unsubscribe } from '../../../../../frame/core/arbiter';
import { Vedio, ViwePager, Table, ImgDisplay, Panel, Vedios, QueryBox, QueryBoxs } from '../../../../../frame/componets/index';
import {ColorBlockTable} from '../../../../../frame/componets/index'

export default class ExportSb extends React.Component {
    state = {}

    render() {
        return (
            <div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                    <div style={{width: '1000px', height: '600px', background: '#2c5273'}}>
                        <ColorBlockTable />
                    </div>
                    <div style={{width: '1550px', height: '600px', background: '#2c5273'}}></div>
                    <div style={{width: '1550px', height: '600px', background: '#2c5273'}}></div>
                    <div style={{width: '550px', height: '600px', background: '#2c5273'}}></div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '50px'}}>
                    <div style={{width: '1150px', height: '600px', background: '#2c5273'}}></div>
                    <div style={{width: '1200px', height: '600px', background: '#2c5273'}}></div>
                    <div style={{width: '1200px', height: '600px', background: '#2c5273'}}></div>
                    <div style={{width: '1100px', height: '600px', background: '#2c5273'}}></div>
                </div>
            </div>
        )
    }
} 