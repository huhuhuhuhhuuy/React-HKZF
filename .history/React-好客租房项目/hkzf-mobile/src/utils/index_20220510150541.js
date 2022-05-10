import axios from "axios";
//获取当前定位城市
export const getCurrentCity=()=>{
    const localCity=JSON.parse(localStorage.getItem('hkzf_city'))
    //情况一：本地存储数据中没有
    if(!localCity){
        //如果没有的话，用首页中的方式再获取一次
        return new Promise((resolve,reject)=>{
            const myCity = new window.BMapGL.LocalCity();
            myCity.get(async res=>{
                try{
                const result=await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
                //存储到本地存储中
                localStorage.setItem('hkzf_city',JSON.stringify(result.data.body))
                resolve(result.data.body)
            }catch(e){
                //获取定位城市失败
                reject(e)

            }
            })
        })
    }
    //情况二：本地存储数据中有，为了配合结构也以promise形式返回
    return Promise.resolve(localCity)

}
export {API} from './api'
export {BASE_URL} from './url'
export * from './auth'
ex