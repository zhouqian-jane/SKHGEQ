import '../less';
import 'animate.css';
import React from 'react';
import ICommand from './iCommand';

export default class App extends React.Component {
    render() {
        return (
            <div className='mbody'>
                <div className='mbody-content'>
                    <ICommand />
                </div>
            </div>
        )
    }
}