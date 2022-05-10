import React, { Component } from 'react'
import axios from 'axios';
import {Link}from 'react-router-dom'
import './index.scss'
 //import styles from './index.module.css'
import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem';
import { BASE_URL } from '../../utils/url';

export default class Map extends Component {
    constructor(props) {
	    super(props);
		/* 动态改变元素样式 */
		this.state = {
			hhh:'houseList',
            houseList:[]
		}
	}





    //初始化地图
    initMap(){
        //初始化地图实例 脚手架中要求全局对象必须使用window才可以访问
        //1、在调用此构造函数时应确保容器元素已经添加到地图上；
        // 2、命名空间 API GL版使用BMapGL作为命名空间，所有类均在该命名空间之下，比如：BMapGL.Map、BMapGL.Control、BMapGL.Overlay；
        const map = new window.BMapGL.Map("container");
        // const point = new window.BMapGL.Point(116.404, 39.915);
        // map.centerAndZoom(point, 15); 
        //获取当前定位城市
        const {label,value}=JSON.parse(localStorage.getItem('hkzf_city'))
        //创建一个map方法，使得在其它方法中也可以调用map
        this.map=map;

        console.log(label,value)
        //地址解析器转换
        //创建地址解析器实例
        var myGeo = new window.BMapGL.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(
            label,async point=>{
            if(point){
                map.centerAndZoom(point, 11);
                //map.addOverlay(new window.BMapGL.Marker(point, {title: {label}}))
                // 添加比例尺控件
                map.addControl(new window.BMapGL.ScaleControl());
                // 添加缩放控件
                map.addControl(new window.BMapGL.ZoomControl());


                this.renderOverlays(value);

            }else{
                alert('您选择的地址没有解析到结果！');
            }
        }, label)
            //给地图绑定移动事件
            map.addEventListener('mousestart',()=>{
                this.setState({hhh:'houseList'})
            })
        }
       //hhhhh
    //渲染覆盖物入口
    async renderOverlays(id){
        const res = await axios.get(`http://localhost:8080/area/map?id=${id}`)
        // console.log('渲染了覆盖物入口',res)
        const data=res.data.body
        //获取地图级别和类型
        const{nextZoom,type}=this.getTypeAndZoom()
        data.forEach(item=>{
            //创建覆盖物
            this.createOverlays(item,nextZoom,type)
        })
    }
    //计算绘制覆盖物类型及缩放级别
    getTypeAndZoom(){
        const zoom=this.map.getZoom()
        let  nextZoom,type
        console.log('当前地图缩放级别：',zoom)
        if(zoom==11){
            //  区
            console.log('区')
            nextZoom=13
            type='circle'
        }else if(zoom>=11&&zoom<=13){
            //镇
            console.log('镇')
            nextZoom=15
            type='circle'
        }else if(zoom>=13){
            //小区
            console.log('镇')
            type='rect'
        }
        return {
            nextZoom,type
        }

    }
    //创建覆盖物
    createOverlays(item,nextZoom,type){
        const {coord:{longitude,latitude},label:areaLabel,count,value}=item
        const areaPoint=new window.BMapGL.Point(longitude,latitude)

        if(type=='circle'){
            //区
            this.createCircle(areaPoint,areaLabel,count,value,nextZoom)
        }else if(type=='rect'){
            //小区
            this.createRect(areaPoint,areaLabel,count,value)
        }
    }

    createCircle(areaPoint,areaLabel,count,value,nextZoom){

        //创建label对象
        const opts={
            position:areaPoint,
            offset:new window.BMapGL.Size(-60,-15)
        }
        const label=new window.BMapGL.Label('',opts);

        //给label标签添加唯一标识
        label.id=value
        //设置房源覆盖物内容
        label.setContent(
            `<div class=overText>
                <p class=overTextName>${areaLabel}</p>
                <p> ${count}套</p>
            </div>`
        )

        //设置样式
        label.setStyle({
            cursor:'pointer',
            color: 'blue',
            borderRadius: '40px',
            borderColor: 'green',
            backgroundColor:'orange',
            whiteSpace:'nowrap',
            fontSize: '13px',
            height: '40px',
            width:'40px',
            padding:'5px',
            fontFamily: '微软雅黑'
        });
        //文本添加单击事件
        label.addEventListener('click',()=>{
            console.log('房源覆盖物被点击啦',label.id)
            
            
            //获取下一级房源数据
            this.renderOverlays(value)
            //以当前点击物为中心放大地图
            this.map.centerAndZoom(areaPoint, nextZoom);
            //清除当前覆盖物信息
            this.map.clearOverlays()
        })
        //添加覆盖物到地图中
        this.map.addOverlay(label)
        
            
    }
    createRect(areaPoint,areaLabel,count,value){

        //创建label对象
            const opts={
                position:areaPoint,
                offset:new window.BMapGL.Size(-20,-20)
            }
            const label=new window.BMapGL.Label('',opts);

            //给label标签添加唯一标识
            label.id=value
            //设置房源覆盖物内容
            label.setContent(
                `<div class=overText>
                    <p class=overTextName>${areaLabel}</p>
                    <p> ${count}套</p>
                </div>`
            )

            //设置样式
            label.setStyle({
                cursor:'pointer',
                color: 'white',
                borderRadius: '10px',
                borderColor: 'green',
                backgroundColor:'blue',
                whiteSpace:'wrap',
                fontSize: '13px',
                height: '40px',
                width:'120px',
                padding:'5px',
                fontFamily: '微软雅黑'
            });
            //文本添加单击事件
            label.addEventListener('click',(e)=>{
                
                this.getHousesList(label.id)
                //获取当前被点击项
                console.log(e)
                const target=e.domEvent.changedTouches[0]
                this.map.panBy(window.innerWidth/2-target.clientX,(window.innerHeight-330)/2-target.clientY)

                this.setState({
                    hhh:'show',
                    

                })
                //以当前点击物为中心放大地图
                this.map.centerAndZoom(areaPoint);
               
            })
            //添加覆盖物到地图中
            this.map.addOverlay(label)
            
    }

    //获取小区房源数据
    async getHousesList(id){
        const res=await axios.get(`http://localhost:8080/houses?cityId=${id}`)
        console.log("小区的房源数据：",res,this.state.hhh)
        this.setState(
            {houseList:res.data.body.list}
        )
        return res.data.body;
        
    }


    //渲染完成后才调用的钩子函数
    componentDidMount(){ 
        this.initMap();
     
    }

    //封装渲染房屋列表的方法
    renderHousesList(){
        return this.state.houseList.map(item=>{
            <HouseItem
            key={item.houseCode}
            src={BASE_URL+item.houseImg}
            title={item.title}
            desc={item.desc}
            tags={item.tags}
            price={item.price}/>
        })
    }

    //className={styles.map}
    render() {
        return (
        <div className="map">
            {/* 顶部导航条组件 */}
            <NavHeader className='navHeader'>
            地图找房
            </NavHeader>
            {/* 地图容器 */}
            <div id='container' ></div>
              

            {/* 房源列表 */}
            <div className={this.state.hhh}>
                <div className='titleWrap'>
                <i className='iconfont icon-back'  />
                <h1 className='listTitle'>房屋列表</h1>
                <Link className='titleMore' to='/home/list'>更多房源</Link>
                </div>
                <div className='houseItems'>
                {/* 房屋结构 */}
                 {this.state.houseList.map(item=> 
                 <div className='house' key={item.houseCode}>
                 <div className='imgWrap'>
                 <img className='img'
                    src={`http://localhost:8080${item.houseImg}`}
                    alt=''/>
                 </div>
                 <div className='content'>
                   <h3 className='title'>{item.title}</h3>
                   <div className='desc'>{item.desc}</div>
                 <div>
                    {
                        item.tags.map((tags,index)=><span className={`tag tag${index+1}`} key={tags}>{tags}</span>)
                    }
                   
                 </div>
                   <div className='price'>
                   <span className='priceNum'>{item.price}</span>元/月
                 </div>
                 </div>
                 
             </div>)}
              </div>
                
            </div>



          




            




           
        </div>
        )
    }
}
