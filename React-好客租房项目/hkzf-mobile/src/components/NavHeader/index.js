import React from 'react'
import {NavBar} from 'antd-mobile-v2';
import { withRouter } from 'react-router-dom';
import propTypes from 'prop-types';
import './index.scss'

/* 默认情况下，只有路由Route直接渲染的组件才能拿到路由信息比如history.go()等，
其它有需要的可以通过route的高阶组件获取，但高阶组件只能用在函数组件里 */
function NavHeader({children,history,onLeftClick}) {

  //默认点击行为
  const defaultHandler=()=>history.replace('/home')
  return (
    <div>
    <NavBar
            className='navbar'
            mode="light"
            icon={<i className='iconfont icon-back' />}
            onLeftClick={onLeftClick||defaultHandler}
           >
         {children}
    </NavBar> 
    
    
    
    </div>
  )
}

  //添加props校验

NavHeader.propTypes={
  children:propTypes.string.isRequired,
  onLeftClick:propTypes.func
}

export default withRouter(NavHeader)







