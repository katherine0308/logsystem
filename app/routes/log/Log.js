import React, { Component } from 'react'
import { Input, Button, Icon, DatePicker, Dropdown, Menu, Alert, notification } from 'antd'
const { RangePicker } = DatePicker;
import moment from 'moment'

import LogActions from './LogActions'
import LogStore from './LogStore'
import './Log.css'

class Log extends Component {
    constructor(props) {
        super(props);
        this.state = LogStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        LogStore.listen(this.onChange);
    }

    componentWillUnmount() {
        LogStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    handleSubmit() {
        if(new Date(this.state.dateRange.to).getTime() - new Date(this.state.dateRange.from).getTime() > 86400000 * this.state.dateLimit) {
			notification.warn({message: '日期应在3天以内'});
			return false;
		}

        LogActions.fetchLogs(this.state.dateRange, this.state.system, this.state.level.toLowerCase(), this.state.url, this.state.mark)
    }

    render() {
        const systemMenu = (
            <Menu>
                {this.state.systemInput.map(i => (
                    <Menu.Item key={i}>
                        <a onClick={e => {LogActions.getSystem(i)}}>{i}</a>
                    </Menu.Item>
                ))}
            </Menu>
        )

        const levelMenu = (
            <Menu>
                {this.state.levelInput.map(i => (
                    <Menu.Item key={i}>
                        <a onClick={e => {LogActions.getLevel(i)}}>{i}</a>
                    </Menu.Item>
                ))}
            </Menu>
        )

        return (
            <div className="container">
                <div className={this.state.searchClassName}>
                    <h1 className={this.state.titleClassName}>日志系统</h1>
                    <RangePicker
                        className="interval"
                        size="large"
                        disabledDate={current => {
                            if(current) {
                                return current && current.valueOf() > new Date(moment().format('YYYY-MM-DD') + ' 23:59') || current.valueOf() < new Date(moment().subtract(1, "months").format("YYYY-MM-DD"));
                            }
                        }}
                        //ranges={{ '今天': [moment(), moment()], '昨天': [moment(), moment().endOf('month')], '最近三天': [moment(), moment()] }}
                        defaultValue={[moment(moment().format('YYYY-MM-DD') + ' 00:00', 'YYYY-MM-DD HH:mm'), moment(moment().format('YYYY-MM-DD') + ' 23:59', 'YYYY-MM-DD HH:mm')]}
                        format="YYYY-MM-DD HH:mm"
                        showTime={{ format: 'HH:mm' }}
                        renderExtraFooter={() => <small>建议选择日期范围在三天内</small>}
                        onChange={(value, dateString) => { LogActions.pickDateRange(dateString) }}
                        onOk={value => {}}
                    />
                    <span onClick={e => {LogActions.showSelf()}}>.</span>
                    <Dropdown className="interval" overlay={systemMenu} placement="bottomCenter">
                        <Button>{this.state.system}</Button>
                    </Dropdown>
                    <Dropdown className="interval" size="large" overlay={levelMenu} placement="bottomCenter">
                        <Button>{this.state.level}</Button>
                    </Dropdown>
                    <span onClick={e => {LogActions.showInput()}}>.</span>
                    <Input className="interval input-inline" style={{display: this.state.urlShow? '': 'none'}} size="large" placeholder="URL" onChange={e => {LogActions.changeUrl(e.target.value)}} />
                    <Input className="interval input-inline" style={{display: this.state.markShow? '': 'none'}} size="large" placeholder="MARK" onChange={e => {LogActions.changeMark(e.target.value)}} />
                    <Button type="primary" size="large" className="interval" onClick={this.handleSubmit.bind(this)}>搜索</Button>
                </div>
                <div className="body">
                    <Alert style={{display: this.state.total > 0? '': 'none'}} message={`共计${this.state.total}条数据。${this.state.total > this.state.logLimit? '数据量超过' + this.state.logLimit + '，仅显示' + this.state.logLimit + '条，如需全面显示，请缩小时间范围': ''}`} type="info" />
                    <div>
                        {this.state.logData.map(i => (
                            <pre key={i._id} className="item">{JSON.stringify(i, null, 2)}</pre>
                        ))}
                    </div>
                    <div className="nothing" style={{display: this.state.total == 0? '': 'none'}}>
                        没有找到任何数据
                    </div>
                </div>
            </div>
        )
    }
}

export default Log