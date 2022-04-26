import React from 'react';
import ReactDOM from 'react-dom/client';
//导入antd-mobile样式文件
//import 'antd-mobile/dist/antd-mobile.css';
import 'react-virtualized/styles.css';
//导入字体图标库的样式文件
import './assets/fonts/iconfont.css';


//自己写的组件样式都要放在最后导入，防止被覆盖
import './index.css';


import App from './App';






const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <App />
 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

