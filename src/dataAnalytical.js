import Ctimer from "./libs/ctimer.js"
import {net,vars} from "./config"

class DataAnalytical {
    constructor(){
        var m = this;
        m.timer = new Ctimer({
            autoStart:false,
            delay:30000,
            callback:function(){
                m.send();
            }
        });

        m._firstStart = true;

        m._waitGeo = false;
    }

    getData(){
        var m = this;
        var getInfo = _.get(window,"device.getInfo");


        if(!getInfo) {
            return Promise.reject("获取设备信息失败")
        }

        var store = vars.store;
        var geo = m.geo = store.getters.geo;

        if(!geo) {
            return Promise.reject({
                resCode:-5,
                message:"位置正在获取，一段时间后重试"
            })
        }

        return vars.callbackToPromise.call(getInfo)
            .then(device=>{
                device = _.merge({},device);
                device.phoneModel   =   device.model;
                device.longitude    =   geo.longitude;
                device.latitude     =   geo.latitude;
                device.addCode      =   geo.adCode||geo.adcode;

                return device;
            })
        ;
    }


    send(){
        var m = this;

        Promise.resolve()
            .then($=>m.getData())
            .then(device=>{
                return net("dataAnalysis/dataInfo",device)
            })
            .then(resp=>{
                if(resp.errorCode) {
                    throw resp;
                }
            })
            .catch(resp=>{
                //无效登录状态
                if(resp.resCode == -1 || resp.resCode == -2) {
                    m.stop();
                //重试
                }else if(resp.resCode == -5) {
                    if(!m._waitGeo) {
                        setTimeout($=>{
                            m.send()
                        },3000)
                    }
                    m._waitGeo = true;
                }

                console.log(vars.trimErrorMessage(resp));
            })
        ;
    }

    start(){
        var m = this;
        if(m._firstStart) {
            m.timer.start_immediate();
            m._firstStart=false;
        }else{
            m.timer.start();
        }
    }

    stop(){
        var m = this;
        m._firstStart = true;
        m.timer.stop();
    }
}


export default new DataAnalytical;