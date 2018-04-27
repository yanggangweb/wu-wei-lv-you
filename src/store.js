import Vuex from "vuex";
import _ from "lodash";
import lockr from "lockr"

export default function(){
    return new Vuex.Store({
        state: {
            address:null,
            /**
             * user tooken 用户令牌，如果不存在表示用户没有登录，否则就是登录
             */
            userTooken:"",

            user:{},

            //调试元素可见性
            debugShowing:false,


            //登录窗口可见性
            loginPanelVisible:false,

            current_router_link:"",

            /**
             * 存放登录resolve,reject,每次请求登录都会创建一个Promise
             */
            loginPromise:{resolve:"",reject:""},


            /**
             * 存放当前设备的位置信息
             */
            geo:vars.defaultGeo,

            geoWatcherId:-1
        },

        getters:{
            geo:function(state){
                var m = this;
                if(_.size(state.geo) == 0) {
                    return vars.defaultGeo
                }

                return state.geo;
            },
            ut:function(state){
                if(!state.userTooken) {
                    state.userTooken = vars.lockr.get("userTooken");
                }
                return state.userTooken;
            },
            user:function(state){
                var loUser = vars.lockr.get("user");
                if(!_.size(state.user)) {
                    if(loUser) {
                        state.user = loUser;
                    }else{
                        return {}
                    }
                }
                return state.user || {};
            },
            address(state){

                var defAddr = vars.defAddr;

                //中际版本，使用默认地址
                if(vars.varsionPrefix==".zj") {
                    return defAddr;
                }

                //内存
                var addr = state.address;

                if(addr) {
                    return addr;
                }
                //缓存
                var cachedAdd = lockr.get("address");

                if(cachedAdd) {
                    state.address = cachedAdd;
                    return cachedAdd;
                }

                //默认
                state.address = defAddr;
                return defAddr;
            }

        },
        mutations: {
            debugShowing:function(state,visible){
                state.debugShowing = visible;
            },

            loginPanelVisible:function(state,visible){
                state.loginPanelVisible = visible;
            },

            /**
             * 位置更改
             * @param state
             * @param newGeo
             */
            setGeo:function(state,newGeo){
                state.geo = newGeo;
            },

            /**
             * 设置用户tooken
             * @param state
             * @param tooken
             */
            saveUserTooken:function(state,tooken){
                state.userTooken = tooken;
                vars.lockr.set("userTooken",tooken);
            },

            /**
             * 清空用户tooken
             * @param state
             */
            clearUserTooken:function(state){
                state.userTooken = "";
                vars.lockr.set("userTooken","");
                vars.store.commit("saveUser",{});
            },


            /**
             * 设置用户
             * @param state
             * @param user
             */
            saveUser:function(state,user){
                state.user = user;
                vars.lockr.set("user",user);
            },


            /**
             * 改变rooter路径
             * @param state
             * @param link
             */
            changeRouterLink:function(state,link){
                state.current_router_link = link;
            },


            /**
             * 保存登录的promise
             * @param state
             * @param resolve
             * @param reject
             */
            saveLoginPromise:function(state,resolve_reject){
                state.loginPromise = resolve_reject;
            },


            setAddress(state,addrObject){
                state.address = addrObject;
                lockr.set("address",addrObject)
            }
        },
        actions:{

        }
    });
};
