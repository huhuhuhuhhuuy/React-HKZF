import React, { Component } from 'react'

import {BrowserRouter ,Route,Link,Switch,Redirect}from 'react-router-dom'
import {Button} from 'antd-mobile-v2'

//倒入页面组件
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
import News from'./pages/News'
import Index from './pages/Index'
import Profile from './pages/MY'
import List from './pages/List'
import 'antd-mobile-v2/dist/antd-mobile.css'
import './App.css'
export default class App extends Component {

  render() {
  
    return (

      <BrowserRouter>
      <div className='App'>
      {/* 根组件 <Button>登陆<Button/> */}
      
      {/* 配置导航菜单 */}
                        {/*  <ul>
                            <li><Link to='/home'>首页</Link></li>
                            <li><Link to='/citylist'>城市选择</Link></li>
                          </ul> 
                        */}

      {/* 配置路由  也就是跳转后的页面，由于是单页面应用所以一定要用路由*/}
      <Switch>   
       <Route path='/' exact render={()=><Redirect to='/home'/>}   />
        <Route path='/home'  component={Home}/>
        <Route path='/citylist'  component={CityList}/>
        <Route path='/map' component={Map}/>
        
      </Switch>
      </div>
      </BrowserRouter>
    )
  }
}

