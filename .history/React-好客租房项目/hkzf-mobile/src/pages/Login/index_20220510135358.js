import React, { Component } from 'react'
import { Flex,WingBlank,WhiteSpace, Toast } from 'antd-mobile-v2'
import { Link } from 'react-router-dom'
import {withFormik} from 'formik'
import {API} from '../../utils'
import NavHeader from '../../components/NavHeader'
import styles from './index.module.css'









 class Login extends Component {
  state = {
    username:'',
    password:''
  }

  getUserName=(e)=>{
    this.setState({
      username:e.target.value
    })
  }
  getPassWord=(t)=>{
    this.setState({
      password:t.target.value
    })
  }
  

  render() {
    const {username,password} = this.state
    //通过props拿到高阶组件传递进来的属性
    const {values,handleSubmit,handleChange}=this.props
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <div className={styles.navHeader}>
        <NavHeader>账号登录</NavHeader>

        </div>
        
        <WhiteSpace size = 'xl' />
        {/* 登陆表单——填写账号密码 */}
        <WingBlank >
          <form onSubmit={this.handleSubmit}>
            <div className={styles.formItem}>
              <input className={styles.input} value={values.username} onChange={this.getUserName} name='userName' placeholder='请输入账号' />
            </div>
            {/* 账号为5～8位且只能出现数字字母下划线 */}
            <div className={styles.formItem}>
                <input className={styles.input} value={values.password} onChange={this.getPassWord} name='password' type='password' placeholder='请输入密码' />
            </div>
            {/* 账号为8～12位且只能出现数字字母下划线 */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type='submit'>登录</button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to='/registe'>还没有账号？速速注册～</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}
Login = withFormik({
  //提供状态
  mapPropsToValues:()=>({username:'',password:''}),
  handleSubmit:async values=>{
      //阻止表单提交时的默认刷新行为
      values.preventDefault();
      //获取账号和密码
      const {username , password} = values
      // console.log("表单提交")
      //发送请求
  
      const res= await API.post('/user/login',{
        username,
        password
      })
      console.log('登录结果' , res)
      const {status , body , description} = res.data
      if(status === 200){
        //登录成功
        localStorage.setItem('hkzf_token', body.token)
        //返回上个页面
        this.props.history.go(-1)
      }else{
        //登录失败
        Toast.info(description,2,null,false)
      }
  
    
  }
})(Login)
export default Login