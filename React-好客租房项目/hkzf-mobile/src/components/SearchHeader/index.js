import React from 'react'
import {Flex } from 'antd-mobile-v2';
import { withRouter } from 'react-router-dom';

import propTypes from 'prop-types';
import './index.scss'


 function SearchHeader({history,curCity,className}) {
    
  return (
    <Flex className={['search-box',className||''].join(' ')}>
    {/* 左侧白色*/}
    <Flex className='search'>
      <div className='location' onClick={()=>{history.push('/citylist')}}>
        <span className='name' >{curCity}</span>
        <i className='iconfont sanjiao icon-arrow'/>
      </div>
      <span className='hh'>|</span>
      <div className='form' onClick={()=>{history.push('/search')}}>
        <i className='iconfont fdj icon-seach'/>
        <span className='text'>请输入小区或地址</span>
      </div>
    </Flex>
    {/* 右侧地图图标*/}
    <Flex className='iconfont db icon-map' onClick={()=>{history.push('/map')}}></Flex>
    </Flex>
  )
  
}



//添加属性校验
SearchHeader.propTypes={
    curCity:propTypes.string.isRequired

}




export default withRouter(SearchHeader)