import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
//导入自定义API
import {API} from '../../../../../utils/api'
import styles from './index.module.css'

const titleSelectedStatus={
  area : false,
  mode : false,
  price : false,
  more : false
}
const selectedValues={
  area : ['area','null'],
  mode :['null'],
  price : ['null'],
  more : []
}




export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    //控制组件展示或隐藏
    openType:'',
    filtersData:{},
    //默认选中值
    selectedValues
  }

  componentDidMount(){
    this.getFiltersData();

   
  }


  




  //封装获取所有筛选条件的方法
  async getFiltersData(){
    //获取当前定位的城市
    const{value}=JSON.parse(localStorage.getItem('hkzf_city'))
    const res =await API.get(`http://localhost:8080/houses/condition?id=${value}`)
    this.setState({
      filtersData : res.data.body
    })
   
  }

  //点击标题菜单实现高亮
  onTitleClick=type=>{
    const {titleSelectedStatus,selectedValues}=this.state
    //创建新的标题选中状态对象
    const newTitleSelectedStatus={...titleSelectedStatus}
    //遍历标题中状态对象
    //["area","mode","price","more"]
    Object.keys(titleSelectedStatus).forEach(key=>{
      //key表示的是数组中的每一项，此处也就是每个标题的type值
      if(key===type){
        newTitleSelectedStatus[type]=true
        return 
      }
      //其它标题：
      if(key=='area'&&(selectedValues[key].length !==2||selectedValues[key][0]!=='area')){
        //高亮
        newTitleSelectedStatus[key]=true
      }else if(key=='mode'&&selectedValues[key][0]!=='null'){
        //高亮
        newTitleSelectedStatus[key]=true
      }else if(key=='price'&&selectedValues[key][0]!=='null'){
        //高亮
        newTitleSelectedStatus[key]=true
      }else if(key=='more'&&selectedValues[key].length!==0){
        newTitleSelectedStatus[key]=true
      }else{
        newTitleSelectedStatus[key]=false
      }
    })
    console.log('newTitleSelectedStatus',newTitleSelectedStatus)
    this.setState({
      openType:type,
      titleSelectedStatus:newTitleSelectedStatus
    })
    // this.setState(prevState=>{
    //   return {
    //     titleSelectedStatus:{
    //       //获取当前对象中所有属性的值
    //       ...prevState.titleSelectedStatus,
    //       [type]:true
    //     },
    //     //展示对话框
    //     openType:type

    //   }
    // })
  }
  //隐藏对话框
  onCancel=(type)=>{
    
    const {titleSelectedStatus}=this.state
    //创建新的标题选中状态对象
    const newTitleSelectedStatus={...titleSelectedStatus}
    //菜单高亮逻辑处理
    //其它标题：
    if(type=='area'&&(selectedValues[type].length !==2||selectedValues[type][0]!=='area')){
      //高亮
      newTitleSelectedStatus[type]=true
    }else if(type=='mode'&&selectedValues[type][0]!=='null'){
      //高亮
      newTitleSelectedStatus[type]=true
    }else if(type=='price'&&selectedValues[type][0]!=='null'){
      //高亮
      newTitleSelectedStatus[type]=true
    }else if(type=='more'&&selectedValues[type].length!==0){
      newTitleSelectedStatus[type]=true
    }else{
      newTitleSelectedStatus[type]=false
    }
    this.setState({
      openType:'',
      titleSelectedStatus:newTitleSelectedStatus,
    })
  }
  //确定之后隐藏对话框
  onSave=(type,value)=>{
    console.log(type,value)
    const {titleSelectedStatus}=this.state
    //创建新的标题选中状态对象
    const newTitleSelectedStatus={...titleSelectedStatus}
    //菜单高亮逻辑处理
    //其它标题：
    if(type=='area'&&(value.length !==2||value[0]!=='area')){
      //高亮
      newTitleSelectedStatus[type]=true
    }else if(type=='mode'&&value[0]!=='null'){
      //高亮
      newTitleSelectedStatus[type]=true
    }else if(type=='price'&&value[0]!=='null'){
      //高亮
      newTitleSelectedStatus[type]=true
    }else if(type=='more'&&value.length!==0){
      newTitleSelectedStatus[type]=true
    }else{
      newTitleSelectedStatus[type]=false
    }

    const newSelectedValues={
        ...this.state.selectedValues,
          [type]:value
      }
      console.log("最新的选中值",newSelectedValues)
      const{area,mode,price,more}=newSelectedValues
      //筛选条件数据
      const filters=[]
      //区域
      const areaKey=area[0]
      let areaValue='null'
      if(area.length===3){
        areaValue=area[2]!=='null'?area[2]:area[1]
      }
      filters[areaKey]=areaValue
      //方式和租金
      filters.mode=mode[0]
      filters.price=price[0]
      //更多筛选条件 more
      filters.more=more.join(',')
      //调用父组件的方法，来将筛选数据的条件传递给父组件～～传值操作 :
      //1.父组件中写好方法onFilter=filters=>{} 
      //2.父组件页面子组件插件处中留个调用接口 onFilter={this.onFilter}
      //3.子组件调用props上传来的方法，再传值filters就👌
      this.props.onFilter(filters)







    //隐藏对话框
    this.setState({
      openType:'',
      titleSelectedStatus:newTitleSelectedStatus,
      selectedValues:newSelectedValues
    })
  }

  //渲染FilterPicker组件的方法
  renderFilterPicker(){
    const {
      openType,
      filtersData:{area,subway,rentType,price},
      selectedValues,
    }=this.state
    if(openType!="area"&&openType!="mode"&&openType!="price"){return null}
    //根据openType来拿到当前筛选条件数据
    let data=[]
    let cols=''
    let defaultValues=selectedValues[openType]

    switch (openType) {
      case 'area':
        //获取区域数据
        data=[area,subway]
        cols=3
        break;
      case 'mode':
        //获取租赁数据
        data=rentType
        cols=1
        break;
      case 'price':
        //获取价格数据
        data=price
        cols=1
        break;
      default:
        break;
    }

    return  <FilterPicker
      key={openType}
     onCancel={this.onCancel} 
     onSave={this.onSave} 
     data={data} 
     cols={cols} 
     type={openType}
     defaultValues={defaultValues}
     />
   

  }
  //渲染FilterMore组件的方法
  renderFilterMore(){
    const {openType,filtersData:{roomType,floor,oriented,characteristic},selectedValues}=this.state
    if(openType!=='more'){
      return null
    }
    const data={
      roomType,floor,oriented,characteristic
    }
    const defaultValues=selectedValues.more
    return <FilterMore
     data={data}
     onCancel={this.onCancel} 
     onSave={this.onSave}
     type={openType}
     defaultValues={defaultValues}
     />
  }
  render() {
      const {titleSelectedStatus,openType}=this.state
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/* <div className={styles.mask} /> */}
        {(openType=="area"||openType=="mode"||openType=="price")
            ? <div className={styles.mask} onClick={()=>this.onCancel(openType)}/>
            : null}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle  titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick} />


          {this.renderFilterPicker()}
          {/* 前三个菜单对应的内容： */}
          {/*  <FilterPicker />  */}
          {this.renderFilterMore()}
          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
