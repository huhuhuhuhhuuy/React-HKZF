import React, { Component } from 'react'
import { Flex,WingBlank,WhiteSpace } from 'antd-mobile-v2'
import { Link } from 'react-router-dom'
import NavHeader from '../../components/NavHeader'
import styles from './index.module.css'









export default class Login extends Component {
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
  handleSubmit=(e)=>{
    //阻止表单提交时的默认刷新行为
    e.preventDefault()
    console.log("表单提交")
  }

  render() {
    const {username,password} = this.state
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
              <input className={styles.input} value={username} onChange={this.getUserName} name='userName' placeholder='请输入账号' />
            </div>
            {/* 账号为5～8位且只能出现数字字母下划线 */}
            <div className={styles.formItem}>
                <input className={styles.input} value={password} onChange={this.getPassWord} name='password' type='password' placeholder='请输入密码' />
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
