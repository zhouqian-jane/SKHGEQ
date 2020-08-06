import '../less';
import 'animate.css';
import React from 'react';
import $ from 'jquery';
import { table2Excel } from '../core/table2Excel';
import {Table, Input, Button, Icon} from 'antd';
import Highlighter from 'react-highlight-words';

// tip组件
/**
 *      title           ：自定义标题
 *      id              : 表格的ID
 *      style           : 样式内容
 *      selectedIndex   : 当前被选中的
 *      flds            : 列名
 *      datas           : 接收的数据
 *      trClick         : 单击事件
 *      trDbclick       : 双击事件
 *      
 *      unFilter        : 不需要筛选
 *      zebraCrossing   : 是否显示斑马线底纹,默认为true
 *      classname       : 自定义类名
 *      @description 之前版本中table组件为项目上封装的，现改为antd的Table组件，之前的参数依旧支持
 */
 

export default class MTable extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
    }

    renderSelectedIndex = () => {
        if (this.props.selectedIndex != undefined) {
            $('#' + this.props.id + ' tbody tr td').removeClass('trSelected');
            $('#' + this.props.id + ' tbody tr:nth-of-type(' + (this.props.selectedIndex + 1) + ') td').addClass('trSelected');
        }
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.datas) != JSON.stringify(nextProps.datas) || JSON.stringify(this.props.dataSource) != JSON.stringify(nextProps.dataSource)) {
            $('#' + this.props.id).addClass('slideInUp animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => $('#' + this.props.id).removeClass('slideInUp animated'));
        }
    }

    componentDidUpdate() {
        if ((this.props.datas && this.props.datas.length > 0) || (this.props.dataSource && this.props.dataSource.length > 0)) this.renderSelectedIndex();
    }

    getColumnSearchProps = (dataIndex, item) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{width: '500px', padding: '50px 0', background: '#1464b3' }}>
            <Input
              ref={(node) => {
                this.searchInput = node;
              }}
              placeholder={`搜索 ${item.title}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 450, height: 100, margin: 25, display: 'block', border: 'none', background: '#000b33', color: '#fff' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              size="small"
              style={{ width: 200, height: 100, margin: '0 20px' }}
            >
              搜索
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 200, height: 100, margin: '0 20px', border: 'none', background: '#d0e8ff'}}>
              重置
            </Button>
          </div>
        ),
        filterIcon: (filtered) => (
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
        record[dataIndex] ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()) : false,
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
        render: (text) =>
          this.state.searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[this.state.searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
      });
    
      handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
          searchText: selectedKeys[0],
          searchedColumn: dataIndex,
        });
      };
    
      handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
      };
    

    render() {
        let {title, id, hide, columns, flds, dataSource, datas, rowNo, trClick, trDbclick, unFilter, zebraCrossing = true, classname, style, ...others } = this.props;
        flds = flds ? flds : columns ? columns : [];
        datas = datas ? datas : dataSource ? dataSource : [];
        flds = flds.map((item) => {
            if (item.title && !item.unFilter && !unFilter) {
                return {
                    ...item,
                    ...this.getColumnSearchProps(item.dataIndex, item),
                }
            } else {
                return item
            }
        })
        if (rowNo) {
            flds = [
                { title: '序号', 
                dataIndex: 'rowNo', 
                render: (text, record, index) => <span>{index + 1}</span>,
                }].concat(flds);
        }
        if (hide) {flds = flds.filter((e) => !hide[e.dataIndex])}
        let items = [];
        title && title.export ? items.push(<div key={-2} className='tableExport' onClick={() => table2Excel(this.props.id)}></div>) : '';
        title && title.close ? items.push(<div key={-1} className='tableClose' onClick={() => title.close()}></div>) : '';
        title && title.items ? items = (title.items || []).concat(items) : '';
        return (
            <div className={`mtable ${classname}` } style={this.props.style} ref='table'>
                {title ? <div className='mttitle'><div>{title.name}</div><div>{items}</div></div> : null}
                <div id={id + '_scrollbar'} className={`mttable scrollbar ${zebraCrossing ? 'mttable-zebraCrossing' : ''}`} style={this.props.style.height ? { height: this.props.style.height - 185 } : {}}>
                    <Table 
                        id={id}
                        columns={flds} 
                        dataSource={datas} 
                        pagination={false} 
                        onRow={(record, index) => {
                            return {
                                onClick: () => {
                                    if (trClick) trClick(record, index, datas);
                                }, 
                                onDoubleClick: () => {
                                    if (trDbclick) trDbclick(record, index, datas);
                                },
                            }
                        }} 
                        {...others} 
                    />
                </div>
            </div>
        )
    }
}