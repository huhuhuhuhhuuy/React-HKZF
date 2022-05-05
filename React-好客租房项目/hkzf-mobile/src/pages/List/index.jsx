import React, { Component } from 'react'
import {Flex} from 'antd-mobile-v2';
import {List,AutoSizer,WindowScroller,InfiniteLoader} from 'react-virtualized'
//引入自己封装的api
import {API} from '../../utils/api.js'
import {axios} from 'axios'
//导入搜索栏顶组件
import SearchHeader from '../../components/SearchHeader'
import Filter from './components/components/Filter'
//导入查找组件
import FilterMore from './components/components/FilterMore'
import FilterPicker from './components/components/FilterPicker'
import FilterTitle from './components/components/FilterTitle'
import './index.scss'
import HouseItem from '../../components/HouseItem/index.js';
import {BASE_URL} from '../../utils/url'

//获取当前定位城市名称
const {label,value}=JSON.parse(localStorage.getItem('hkzf_city'))
 export default class Profile extends Component {


  state={
    list:[],
    count:0
  }

  //初始化实例属性
  filters={}

  componentDidMount(){
    this.searchHouseList()
   
  }

  //获取房屋列表数据
  async searchHouseList(){
    //获取当前城市ID
    //我服了这个取法真的太常见了 const {value}=JSON.prase(localStorage.getItem('hkzf_city))
    // const {value}=JSON.parse(localStorage.getItem('hkzf_city'))
    // const res=await axios.get('http://localhost:8080/area/city?level=1')
    const res = await API.get('http://localhost:8080/houses',{
      params:{
        cityId:value,
        ...this.filters,
        start:1,
        end:200
      }
    })
    const {list,count}=res.data.body
    this.setState({
      list,
      count
    })
  }


  //接收Filter传来的参数
  onFilter=(filters)=>{
    //将filters这个值存储到了this中
    this.filters=filters
    //调用获取房屋数据的方法
    this.searchHouseList()
  }

  //长列表中每一行数据的渲染函数
  rowRenderList=({
    key, //列表key值
    index, // 行索引号
    style, //样式属性！！给每一行数据添加该数据
    
  })=>{
    const {list}=this.state
    const house=list[index]

    //判断house是否存在
    if(!house){
      return <div key={key} style={style}>
        <p className='loading'></p>
      
      </div>
    }

    return (
      <HouseItem 
      key={key} 
      style={style} 
      src={`http://localhost:8080${house.houseImg}`} 
      title={house.title} 
      desc={house.desc} 
      tags={house.tags} 
      price={house.price}
      />
    )
}
  //判断列表中每一行是否加载完成
  isRowLoaded=({index})=>{
    return !!this.state.list[index];
  }


  //用来获取更多房屋列表数据
  loadMoreRows=({startIndex,stopIndex})=>{
    // return fetch(`path/to/api?startIndex=${startIndex}&stopIndex=${stopIndex}`).then(response=>{
    // })
    
    return new Promise(resolve=>{
      API.get('http://localhost:8080/houses',{
        params:{
          cityId:value,
          ...this.filters,
          start:startIndex,
          end:stopIndex,
        }
      }).then(res=>{
       
        this.setState({
          list:[...this.state.list,...res.data.body.list]
        })
        resolve()
      })
      
    })
    
  }

 







  render() {
    
    return (
      <div className="list">
        <Flex className='Header'>
          <i className='iconfont ic icon-back' onClick={()=>this.props.history.go(-1)}/>
          <SearchHeader className='searchHeader' curCity={label}></SearchHeader>
        </Flex>

        {/* 条件选择栏 */}
        <Filter onFilter={this.onFilter}/>

        {/* 房屋列表 */}
        <div className='houseItems'>{/* 房屋列表内容 */}
        
        <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={this.state.count}
        >
        {(onRowsRendered,registerChild)=>
          <WindowScroller>
            {({height,isScrolling,scrollTop})=>
              <AutoSizer>
              {({width})=>(
              
                <List
                // onRowsRendered={onRowsRendered}
                ref={registerChild}
                autoHeight//设置高度为windowScroller最终渲染的列表高度
                width={width}//视口的宽度
                height={height}//视口的高度
                rowCount={this.state.count}//List列表的行数
                rowHeight={120}//每一行的高度
                rowRenderer={this.rowRenderList}//渲染列表项中的每一行
                isScrolling={isScrolling}
                scrollTop={scrollTop}
              />)}
              </AutoSizer>}
            </WindowScroller>
        }
        </InfiniteLoader>


        
        
        
        </div>
      </div>
    )
  }
}







