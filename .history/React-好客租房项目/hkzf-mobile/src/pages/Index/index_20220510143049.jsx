import React, { Component } from 'react'
import { Carousel,Flex ,Grid ,WingBlank} from 'antd-mobile-v2';
import axios from 'axios';

//导入菜单图片
import Nav1 from'../../assets/fonts/images/nav-1.png'
import Nav2 from'../../assets/fonts/images/nav-2.png'
import Nav3 from'../../assets/fonts/images/nav-3.png'
import Nav4 from'../../assets/fonts/images/nav-4.png'
import {getCurrentCity} from '../../utils'
//导入对应样式文件
import './index.scss'


//重构菜单栏
const flexItem=[
  {
    id:1,
    img:Nav1,
    title:'整租',
    path:'/home/list'
  },
  {
    id:2,
    img:Nav2,
    title:'合租',
    path:'/home/list'
  },
  {
    id:3,
    img:Nav3,
    title:'地图找房',
    path:'/map'
  },
  {
    id:4,
    img:Nav4,
    title:'出租',
    path:'/rent'
  }
]
//获取地理位置信息  navigator浏览器提供对象 geolocation属性 getCurrentPosition()方法

navigator.geolocation.getCurrentPosition(position=>{
  console.log("111")
  console.log("获取位置信息",position)

})

navigator.geolocation.getCurrentPosition((position) => {
  console.log('当前位置信息2：', position)
},error=>{
  console.log(error)
})




export default class Index extends Component {
  state = {
    //图片名称
    swipers:[],
    isSwiperLoaded:false,
    groups:[],
    news:[],
    curCity:[],
  }
  //利用接口拿到轮播图信息 axios信息请求
  async getSwipers(){
    const res= await axios.get('http://localhost:8080/home/swiper')
    console.log("轮播图的信息",res)
    this.setState(()=>{
      return {
        swipers:res.data.body,
        isSwiperLoaded:true
      }
    })
  }
  //获取租房小组数据的方法
  async getGroups(){
    const res= await axios.get('http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0',
      {params:{
        area:'AREA%7C88cff55c-aaa4-e2e0'
      }}
    )
    this.setState(()=>{
      return {
        groups:res.data.body
       
      }
    })
    
  }
  //获取最新资讯
  async getNews(){
    const res= await axios.get('http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0',
      {params:{
        area:'AREA%7C88cff55c-aaa4-e2e0'
      }}
    )
    this.setState(()=>{
      console.log('获取资讯',res)
      return {
       news:res.data.body
       
      }
    })
    
  }
  //渲染轮播图的方法
  renderSwipers(){
    return this.state.swipers.map(item => (
      <a
        key={item.id}
        href=""
        style={{ display: 'inline-block', width: '100%', height:212 }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
          onLoad={() => {
            // fire window resize event to change height
            window.dispatchEvent(new Event('resize'));
            window.addEventListener('touchmove', { passive: false })
            this.setState();
          }}
        />
      </a>
    ))
  }
  //重构菜单Item
  renderFlexItem(){
    return flexItem.map(item=>
      <Flex.Item key={item.id} onClick={()=>{this.props.history.push(item.path)}}>
      <img src={item.img} alt='菜单图标'/>
      <span>{item.title}</span>
    </Flex.Item>
  )
  }
  //重构资讯Item
  renderNewsItem(){
    return this.state.news.map(item=>(
      <div className='news-item' key={item.id}>
      
        <div className='imgwrap'>
          <img className='img' src={`http://localhost:8080${item.imgSrc}`} alt='资讯配图'/>
        </div>
        <div className='title-wrap'>
        <Flex className='content'direction='column' justify='between' >
          <h3 className='title'>{item.title}</h3>
        <Flex className='info' justify='between'>
          <span>{item.from}</span>
          <span>{item.date}</span>
        </Flex>
        </Flex>
        </div>
      
      </div>
    )


    )
  }
 //生命周期钩子 挂载时
  async componentDidMount() {
     this.getSwipers()
     this.getGroups()
     this.getNews()
    
      //利用百度接口 通过ip定位获取到当前城市名称
      // const myCity = new window.BMapGL.LocalCity();
      // myCity.get(async res=>{
      //   const result=await axios.get(
      //     `http://localhost:8080/area/info?name=${res.name}`
      //     )
      //   this.setState({
      //     curCity:result.data.body.label
      //   })
      // })
      
      const myCity = await getCurrentCity()
      this.setState({
            curCity:myCity.label
          })
  }
  



  render() {
    const data = Array.from(new Array(4)).map((_val, i) => ({
      icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
      text: `name${i}`,
    }));
    const PlaceHolder = ({ className = '', ...restProps }) => (
      <div className={`${className} placeholder`} {...restProps}>Block</div>
    );
    
    return (
      <div className='index'>
        {/* 轮播图 */}
        <div className='swiper '>
        <div className='swiper2'>
          {this.state.isSwiperLoaded ?
            (<Carousel autoplay={true} infinite autoplayInterval={3000} >
            {this.renderSwipers()}
          </Carousel>):("")
          }
        
          
          {/* 搜索框*/}
          <Flex className='search-box'>
          {/* 左侧白色*/}
          <Flex className='search'>
            <div className='location' onClick={()=>{this.props.history.push('/citylist')}}>
              <span className='name' >{this.state.curCity}</span>
              <i className='iconfont sanjiao icon-arrow'/>
            </div>
            <span className='hh'>|</span>
            <div className='form' onClick={()=>{this.props.history.push('/home/list')}}>
              <i className='iconfont fdj icon-seach'/>
              <span className='text'>请输入小区或地址</span>
            </div>
          </Flex>
          {/* 右侧地图图标*/}
          <Flex className='iconfont db icon-map' onClick={()=>{this.props.history.push('/map')}}></Flex>
          </Flex>
          </div>
        </div>
        {/* 导航菜单 */}
        <Flex className='nav'>
          {this.renderFlexItem()}
        </Flex>
        {/* 租房小组 */}
          <div className='group'>
          <h3 className='group-title'>
          租房小组<span className='more'>更多</span>
          </h3>
          {/* 租房小组宫格*/}
          <div className=''></div>
          <Grid  data={this.state.groups} columnNum={2} square={false} hasLine={false}
            renderItem={item=>(
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img className='img1' src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
          </div>
        {/* 最新资讯 */}
        <div className='news'>
        <h3 className='group-title'>最新资讯</h3>
        <WingBlank size='md'>{this.renderNewsItem()}</WingBlank>
        </div>
      </div>
    )
  }
}