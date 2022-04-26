import React, { Component } from 'react'
import { NavBar, Icon ,Toast} from 'antd-mobile-v2';
import axios from 'axios';
import {List,AutoSizer} from 'react-virtualized'
import NavHeader from '../../components/NavHeader'
import './index.scss'
import { getCurrentCity } from '../../utils';

// //列表数据数据源
// const list = Array(100).fill("hhhhhhhhhhhhhhhh")
const Title_Height=36
const Name_Height=50
const House_City=["北京","上海","广州","深圳"]



export default class CityList extends Component {
  constructor(props){
    super(props)
    this.state={
      cityList:{},
      cityIndex:[],
      activeIndex:0,
    }

    //创建ref对象
    this.cityListComponent=React.createRef()
  }


  //数据格式化方法
    formatCityData(list){
    const cityList={}
      //遍历对获取数组进行分类
    list.forEach(item => {
      const first=item.short.substr(0,1)
      if(cityList[first]){
        cityList[first].push(item)
      }else{
        cityList[first]=[item]
      }
      
    });
    //拿到索引
    const cityIndex=Object.keys(cityList).sort()
    return {
      cityList,
      cityIndex
    }
  }

  //格式化最后的输出index
    formatCityIndex(letter){
      switch(letter){
        case '#':
          return "当前定位"
        case 'hot':
          return "🔥热门城市"
        default:
          return letter.toUpperCase()
      }
    }

  //获取城市列表数据的方法
  async getCityList(){
    const res=await axios.get('http://localhost:8080/area/city?level=1')
    const {cityList,cityIndex}=this.formatCityData(res.data.body)

     //获取热门城市数据
    const hotRes=await axios.get('http://localhost:8080/area/hot')
    cityList['hot']=hotRes.data.body;
    cityIndex.unshift('hot');

    //获取当前定位城市
    const curCity=await getCurrentCity()
    cityList['#']=[curCity];
    cityIndex.unshift('#');

    this.setState({
      //将拿到的数据全部添加到状态里
      cityList,
      cityIndex
    })
  
  }
  //用于获取组件中渲染行的信息
    onRowsRendered=({startIndex})=>{
    if(this.state.activeIndex!==startIndex){
      this.setState({
        activeIndex:startIndex
      })
    }
  }
  //点击城市后切换城市
  changeCity({label,value}){
    //判断当前城市是否有数据
    if(House_City.indexOf(label)>-1){
      //有
      localStorage.setItem('hkzf_city',JSON.stringify({label,value}))
      this.props.history.go(-1)
    }else{
      Toast.info(`sorry~暂无该城市数据!`,2,null,false)
    }

  }
  //长列表中每一行数据的渲染函数
   rowRenderer=({
      key, //列表key值
      index, // 行索引号
      isScrolling, // 当前项是否滚动中
      isVisible, // 当前项在list中可见
      style, //样式属性！！给每一行数据添加该数据
      
    })=>{
      //获取每一行的字母索引
      const{cityIndex,cityList}=this.state
      const letter=cityIndex[index]
     
    
      return (
        <div key={key} style={style} className='city'>
          <div className='title'>{this.formatCityIndex(letter)}</div>{
            cityList[letter].map(item=> 
              <div className='name' key={item.value} onClick={()=>{this.changeCity(item)}}>
              {item.label}
              </div>)
          }
        </div>
      );
  }
  //动态计算每一行的高度
  getRowHeight=({index})=>{
    const{cityIndex,cityList}=this.state
    return Title_Height+Name_Height*cityList[cityIndex[index]].length
    
  }
  //渲染右侧索引列表
  renderCityIndex(){
  return this.state.cityIndex.map((item,index)=>
    <li className='city-index-item' key={item} onClick={()=>{
      this.cityListComponent.current.scrollToRow(index)
    }}>
      <span className={this.state.activeIndex==index?'index-active':''}>{item==='hot'?"🔥":item.toUpperCase()}</span>
    </li>
  )
  }
  //渲染完成时获取数据
  async componentDidMount(){
    await this.getCityList();
    //调用measureAllows，提前计算list中每一行的高度，实现scrollToRow的精确跳转
    this.cityListComponent.current.measureAllRows();
  }

  render() {
    return (
      <div className='citylist'>
      
      {/* 顶部导航栏组件 */}
        {/* <NavBar
            className='navbar'
            mode="light"
            icon={<i className='iconfont icon-back' />}
            onLeftClick={() => this.props.history.replace('/home')}
           >
          城市选择
        </NavBar>  */}
        <NavHeader>城市选择</NavHeader>
      {/* 长列表组件 */}
        <AutoSizer>{
          ({width,height})=>
          <List
            ref={ this.cityListComponent}
            width={width}
            height={height}
            rowCount={this.state.cityIndex.length}
            rowHeight={this.getRowHeight}
            rowRenderer={this.rowRenderer}
            onRowsRendered={this.onRowsRendered}
            scrollToAlignment='start'
            
          />

        }
        </AutoSizer>
      {/* 右侧索引栏*/}  
      <ul className='city-index'>{this.renderCityIndex()}</ul>


        














      </div>
    )
  }
}
