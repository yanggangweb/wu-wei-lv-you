<template type="text/html" lang="jade">
    .bulletScreen(v-show="visible",:class="{halt:halt}")
        .container
</template>



<script type="text/ecmascript-6">

    import Vue from "vue";
    import _ from "lodash";
    import $ from "jquery";
    import "libs/jquery.wheninview.js"


    var visibleOnStage = function(dom){
        var rect = $(dom)[0].getBoundingClientRect();
        var rectd = document.body.getBoundingClientRect();

        return (
            true
            && $(dom).is(":visible")
            && rect.top + rect.height>0
            && rect.top + rect.height<rectd.height
            && rect.left + rect.width>0
            && rect.left + rect.width<rectd.width
        )
    }


    var ClassMsg = (function(){
        var msgCls;

        var tpl = "<span class='msg'></span>"

        var def = {
            speed:-0.5,
            speedScale:0.5,
            parent:undefined
        }

        msgCls = (function(data,config){this.init(data,config) })
        msgCls . prototype = {
            init:function(data,config){
                var m = this;
                m.sett = $.extend({},def,config);

                m.$$el = $(tpl);
                m.$el = m.$$el[0];

                m.rect2parent = {};

                m.reset(data);
            },
            reset:function(data){
                var m = this;
                m.data = data;
                m.speed = m.sett.speed + _.random(-m.sett.speedScale,m.sett.speedScale);
                m._positon(0);
                m.$$el.html(data.text).css("top",_.random(0,1,true)*100 + "%").css("color",data.color);
            },

            step:function(frameCount){
                var m = this;
                m._positon(m._positon() + m.speed);
                if(frameCount%5==0 && m.leave()) {
                    //已经离开
                    m.sett.parent.removeMsg(m);
                    m.destory();
                }
            },

            _positon:function(value){
                var m = this;
                if(m.__position===undefined) {
                    m.__position = 0;
                }

                if(value === undefined) {
                    return m.__position;
                }else{
                    m.__position=value;
                    m.$el.style.transform = `translate(${value}px,0)`;
                }
            },

            _boundOfParent:function(){
                var m = this;
                var prect = m.$el.parentElement.getBoundingClientRect()
                var mrect = m.$el.getBoundingClientRect();

                m.rect2parent.top       =       mrect.top - prect.top;
                m.rect2parent.left      =       mrect.left - prect.left;
                m.rect2parent.bottom    =       mrect.bottom - prect.bottom;
                m.rect2parent.right     =       mrect.right - prect.right;
                m.rect2parent.width     =       mrect.width;
                m.rect2parent.height    =       mrect.height;

                return m.rect2parent;
            },


            leave:function(){
                var m = this;
                var rect = m._boundOfParent();
                return rect.left + rect.width<0;
            },

            destory:function(){
                var m = this;
                m.sett.parent = undefined;
                m.$$el.remove();
            }
        };

        return msgCls;
    })()

    export default {
        name: 'bulletScreen',
        data () {
            return {
                currentList:[],
                items:[],

                //是否响应帧事件
                _openFraming:false,

                //保存帧状态
                _lastOpenFraming:false,

                //设定是否要挂起
                halt:false,

                arrayPoint:0,
                frameCount:0,

                visible:true,

                framing:false,

                _list:[]
            }
        },
        methods: {
            play:function(){
                var m = this;
                m._openFraming = true;
                m._frameHandler = m._frame;
                m._frameHandler();
            },
            pause:function(){
                var m = this;
                m._openFraming = false;
                m._frameHandler = _.noop;
            },



            pauseAndHide:function(){
                var m = this;
                m.pause();
                m.visible = false;
            },

            playAndShow:function(){
                var m = this;
                m.play();
                m.visible=true;
            },

            stop:function(){
                var m = this;
                m.pause();
            },

            next:function(){
                var m = this;
                m.addMsg(m._list[m.arrayPoint]);
                var nex = m.arrayPoint + 1;
                m.arrayPoint = nex%m._list.length;
            },

            _frameHandler:_.noop,


            /**
             * 每一帧
             */
            _frame:function(){
                var m = this;

                m.framing = true;

                m.frameCount++;
                m.$instanceList.forEach(el=>el.step(m.frameCount));
                if(m._openFraming) {
                    requestAnimationFrame(function(){
                        m._frameHandler();
                    })
                }
            },

            init:function(){
                var m = this;
                m.addInitText();
                m.$nextTick(function(){
                    m.play();
                })
            },


            /*
            * 添加弹幕
            * */
            addMsg:function(msgDataObject,isAppendToList){
                var m = this;
                var msg = new ClassMsg(msgDataObject,{
                    parent:m,
                    speed:m.speed,
                    speedScale:m.speedScale
                })
                msg.$$el.appendTo(m.$$cont);
                m.$instanceList.push(msg);
                if(isAppendToList) {
                    m._list.push(msgDataObject);
                }
            },



            /**
             * 删除一个弹幕
             **/
            removeMsg:function(msgInstance,disableNext){
                var m = this;
                var index = _.findIndex(m.$instanceList,el=>el==msgInstance);
                m.$instanceList.splice(index,1);
                msgInstance.destory();
                m.$nextTick(function(){
                    if(!disableNext) {
                        m.next();
                    }
                })
            },

            /**
             * 清除所有弹幕
             */
            clear:function(){
                var m = this;
                _.chain([])
                    .merge(m.$instanceList)
                    .each(el=>m.removeMsg(el,true))
                    .value()
                ;
            },

            /**
             * 刚开始显示时候的弹幕
             */
            addInitText:function () {
                var m = this;
                m.clear();
                m._list.step(function(el,index,next){
                    if(el && index<m.numberOfInView && next) {
                        m.next();
                        setTimeout(next,1000)
                    }
                })
            }
        },

        created:function(){
            var m = this;
            m.$instanceList = [];
        },

        mounted: function () {
            var m = this;
            m.$$cont = $(">.container",m.$el);

            m.$watch("list",function (list) {
                m._list=Object.assign([],list);
                m.addInitText();
            },{immediate:true})

            m.init();

            setInterval(function(){
                m.halt = !visibleOnStage(m.$$cont);
            },800)

            m.$watch("halt",function(isEnable){
                if(isEnable) {
                    m._lastOpenFraming = m._openFraming
                    m.pause();
                }else{
                    if(m._lastOpenFraming) {
                        m.$$cont.show();
                        m.play();
                    }
                }
            })

            m._lastOpenFraming = m._openFraming
        },
        computed: {},
        props: {
            list: {
                type:Array,
                default:function(){
                    return [
                        { text: "你好，我是谁1", color:"#f00"},
                        { text: "你好，我是谁2", color:"#fff"},
                        { text: "你好，我是谁3", color:"#f0e"},
                        { text: "你好，我是谁4", color:"#08c"}
                    ]
                }
            },
            numberOfInView:{
                type:Number,
                default:5
            },
            speed:{
                type:Number,
                default:-0.9
            },
            speedScale:{
                type:Number,
                default:0.5
            }
        },

        components:{

        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    .bulletScreen{
        display: block;
        overflow: hidden;
        min-height: 4em;
        position: relative;

        &.halt{
            position: absolute;
        }

        .container{
            position: absolute;
            height:calc(~"100%" - 1em);
            width: 100%;
            >.msg{
                position: absolute;
                left: 100%;
                white-space: nowrap;
            }
        }

    }
</style>
