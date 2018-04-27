/**
 * 根据action和para缓存网络请求响应的数据
 */
export default {
    dic:new Map(),
    _getKey:function(action,para){
        return action + "::" + JSON.stringify(para);
    },
    cache:function(action,para,data){
        var m = this;
        m.dic.set(m._getKey(action,para),data)
    },
    get:function(action,para){
        var m = this;
        return m.dic.get(m._getKey(action,para))
    }
}
