import React, { Component } from 'react'
import{Link, Outlet, Route,Routes} from 'react-router-dom'
import{createBrowserHistory}from 'history'
import { TabBar } from 'antd-mobile-v2';

import Index from '../Index';
import News from '../News';
import List from '../List';
import Profile from '../MY';
//组件自己的样式文件
import './index.css'

//重构tabBar
const tabItems=[
  {
    title:'首页',
    icon:'icon-ind',
    path:'/home'
  },
  {
    title:'找房',
    icon:'icon-findHouse',
    path:'/home/list'
  },
  {
    title:'咨讯',
    icon:'icon-infom',
    path:'/home/news'
  },
  {
    title:'我的',
    icon:'icon-my',
    path:'/home/profile'
  }
]






export default class Home extends Component{
   
    state = {
        selectedTab: this.props.location.pathname,  
      };
      //渲染页面
      renderContent(pageText) 
        {
            return (
                
              <div  style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
                <div style={{ paddingTop: 60 }}>Clicked “{pageText}” tab， show “{pageText}” information</div>
                <a style={{ display: 'block', marginTop: 40, marginBottom: 20, color: '#108ee9' }}
                  onClick={(e) => {
                    e.preventDefault();
                   
                  }}
                >
                  Click to show/hide tab-bar
                </a>
                <a style={{ display: 'block', marginBottom: 600, color: '#108ee9' }}
                  onClick={(e) => {
                   e.preventDefault();
                   
                  }}
                >
                  Click to switch fullscreen
                </a>
              </div>
            );
          }
      //渲染子组件切换键
      renderTabBarItem(){
        return tabItems.map(item=><TabBar.Item
          title={item.title}
          key={item.title}
          icon={
              <i className={`iconfont ${item.icon}`}/>
          }
          selectedIcon={<i className={`iconfont ${item.icon}`}/>
          }
          selected={this.state.selectedTab ===item.path }
         
          
          onPress={() => {
              this.setState({
              selectedTab:item.path,
              });
              //路由切换
            this.props.history.push(item.path);
          }}
          data-seed="logId"
          >


          </TabBar.Item>)
      }
      //切换路由时对地址进行判断
      componentDidUpdate(prevProps){
        if(prevProps.location.pathname!==this.props.location.pathname){
          this.setState({ selectedTab:this.props.location.pathname });
        }
        
      }
      


  render(){
      
    return (
      <div className='home'>
        {/* 注册子路由 */}
        <Route path='/home' exact component={Index}/>
        <Route path='/home/news' component={News}/>
        <Route path='/home/list' component={List}/>
        <Route path='/home/profile' component={Profile}/>
        {/* TabBar */}

        <TabBar
            tintColor="#21b97a"
            barTintColor="white"
            hidden={this.state.hidden}
            noRenderContent={true}
        >
          {this.renderTabBarItem()}
        </TabBar>
        </div>
   


      
   
    )
  }
}
