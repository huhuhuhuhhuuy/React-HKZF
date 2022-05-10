import React, { Component } from 'react'
import { Flex,WingBlank,WhiteSpace } from 'antd-mobile-v2'
import { Link } from 'react-router-dom'
import NavHeader from '../../components/NavHeader'
import styles from './index.module.css'


export default class Login extends Component {
  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size = 'xl' />
        {/* 登陆表单——填写账号密码 */}
        <WingBlank >
          <form>
            <div className={styles.formItem}>
              <input className={styles.input} name='userName' placeholder='请输入账号' />
            </div>
            {/* 账号为5～8位且只能出现数字字母下划线 */}
            <div className={styles.formItem}>
                <input className={styles.input} name='password' placeholder='请输入密码' />
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
