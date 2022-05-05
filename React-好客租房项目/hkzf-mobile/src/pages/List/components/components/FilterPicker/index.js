import React, { Component } from 'react'

import { PickerView } from 'antd-mobile-v2'

import FilterFooter from '../../../../../components/FilterFooter'



export default class FilterPicker extends Component {
  state={
    value:this.props.defaultValues
  }
  render() {
    const {data,cols,onCancel,onSave,type}=this.props
    return (
      <>
        {/* 选择器组件：  onChange 切换时通过回调函数拿到切换的值*/}
        <PickerView   
        data={data}   
        value={this.state.value}   
        cols={cols}   
        onChange={val=>{this.setState({value:val })}} />

        {/* 底部按钮 */}
        <FilterFooter 
        onCancel={()=>onCancel(type)} 
        onOk={()=>onSave(type,this.state.value)}/>
      </>
    )
  }
}
