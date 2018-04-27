
<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 反馈
        f7-block.white-bg
            p.color-title 尊敬的客户：感谢您一直以来对我们平台的支持与厚爱，希望您提出宝贵的建议。
            f7-list.item-input
                f7-list-item  反馈类型
                f7-list-item.radio-input()
                    f7-list-item(name="tickling-radio",radio,checked)
                    b 投诉
                    f7-list-item(name="tickling-radio",radio)
                    b 建议
            f7-list.title-input
                f7-list-item(:class="{v_error:$v.form.phone.$error}")
                    f7-label 手机号码
                    f7-input(type="text",v-model.trim="form.phone",@click="$v.form.phone.$touch()")
            f7-list.title-input
                f7-list-item 问题描述
                f7-list-item
                    b.classify 程序bug
                    b.classify.active 改进建议
                    b.classify 投诉事项
                    b.classify 其他类别

                f7-list-item(:class="{v_error:$v.form.text_area.$error}")
                    f7-input(type="textarea",placeholder="请详细描述您的问题，将有助于我们快速了解您的情况请不要偷懒哦",v-model="form.text_area",@click="$v.form.text_area.$touch()")
            .button-style
                f7-button(big,fill="",type="submit",@click="submit") 提交

            f7-button.hidden(@click="showDebug")

</template>

<script type="text/ecmascript-6">
    import {required, minLength, between} from 'vuelidate/lib/validators';
    import PhoneCallIcon from "../components/phoneCallIcon.vue";
    export default {
        components: {PhoneCallIcon},
        mixins: [vars.mixin_1],
        data: function () {

            return {
                name: "my-bangzhu",
                null_img: vars.null_img,
                data: {},
                form:{
                    text_area:"",
                    phone:""
                }
            }
        },
        validations: {
            form:{
                text_area: {
                    required,
                    minLength: minLength(2)
                },
                phone: {
                    required,
                    withParams:vars.validator.phone
                },
            }

        },
        methods: {
            showDebug:function(){
                this.$store.commit("debugShowing",true)
            },
            //界面初始化
            submit: function () {
                var m = this;
                if (m.$v.form.$invalid) {
                    m.$v.form.$touch();
                    return;
                }
                var para = {
                    suggestion:m.form.text_area,
                    phone:m.form.phone,
                }
                m.req("suggestion/save", para)
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }

                        f7.alert("提交成功");
                        history.back();
                    })
                    .catch(function(err){
                        f7.alert(err,"提交失败")
                    })
                ;
            }
        },
        mounted: function () {
            var m = this;
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    .my-bangzhu{

        .hidden{
            opacity:0.001;
        }
        .comment-list {
            h3 {
                height: 30px;
            }
        }
        .white-bg{
            background-color: #fff;
            margin-top: 15px;
            height: calc(~"100vh" - (@page-edge + @top-bar-height) );;
        }
        .radio-input{

            label.label-radio{
                input[type="radio"]:checked ~ .item-inner {
                ;
                    background: no-repeat center;
                    background-image: url(../assets/markicon/radio-click.png);
                    background-position: calc(100% - 15px) center;
                    background-size: 16px 16px;
                    margin-right: 10px;
                }
                input[type="radio"]~ .item-inner {
                    background: no-repeat center;
                    background-image: url(../assets/markicon/radio.png);
                    background-position: calc(100% - 15px) center;
                    background-size: 16px 16px;
                    margin-right: 10px;
                }
            }
        }

        .list-block {
            font-size: 17px;
            list-style: none;
            margin: 0;
            background-color: #fff;
            ul:before,ul:after {
                background-color: transparent;
            }
            .item-inner:after {
                background-color: transparent;

            }
            span{
                font-size: 0.8rem;
            }
            textarea{
                margin:@page-edge 0 ;
                padding:@page-edge;
                margin-top: 0;
                background-color: @cl_flat_light;
            }
        }

        .button-style{
            .button{
                border: none;
                background-color: #4bad96;
                color: #fff;
            }
        }
        .color-title{
            color:#e8e8e8;
            font-size: 0.8rem;
            padding-top: 10px ;
        }
        .classify {
            display: inline-block;
            padding: 0.25rem 0.5em;
            margin-right: 7.5px;
            height: 1.3em;
            line-height: 1.3em;
            color: #6d6d72;
            font-size: 0.8rem;
            border: 1px solid #4bad96;
            &.active{
                background-color: #4bad96;
                color:#fff;
            }
        }
        .title-input{
            .item-input{
                input{

                    padding: @page-edge/2;
                    box-sizing: border-box;
                    width: 100%;
                    height: 2rem;
                    line-height: 2rem;

                    border-bottom: 1px solid @cl_flat_light;

                }
                textarea{
                    border: 1px solid @cl_flat_light;
                    height: 10rem;
                    background-color:  #f9f9f9;
                }
                ::-webkit-input-placeholder { color:@cl_flat_gray1;font-size: 0.8rem; }
                ::-moz-placeholder { color:@cl_flat_gray1; font-size: 0.8rem;} /* firefox 19+ */
                :-ms-input-placeholder { color:@cl_flat_gray1;font-size: 0.8rem; } /* ie */
                input:-moz-placeholder { color:@cl_flat_gray1;font-size: 0.8rem; }
            }

            .v_error {
                input {
                    background-color: #fff;
                    border-bottom: 1px solid @cl_flat_red1;
                }
                textarea{
                    border: 1px solid @cl_flat_red1;
                    background-color: #fff;
                }
                ::-webkit-input-placeholder { color:#f00; }
                ::-moz-placeholder { color:#f00; } /* firefox 19+ */
                :-ms-input-placeholder { color:#f00; } /* ie */
                input:-moz-placeholder { color:#f00; }
            }
        }
        .item-input{
            ul{
                display: flex;
                align-items: center;
                > li.radio-input{
                    align-content: space-around;
                    .item-inner:after {
                        background-color: transparent;
                    }
                }
            }



        }

    }


</style>



<!--


<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 地图导览
            f7-nav-right



        .map-container
            .map-el(ref="mapEl")


</template>

<script type="text/ecmascript-6">

    import {lazyAMapApiLoaderInstance} from 'vue-amap';
    import _ from "lodash";
    import $ from "jquery";
    export default {
        data () {
            return {
                name:"fankui",
                option:[33,106]
            }
        },

        computed: {
            geo:function(){
                var m = this;
                return  m.$store.getters.geo
            }
        },

        methods: {//查看详情

            //快速收缩
            shortSearch:function(it){
                var m = this;
                m.searchbar_value = it.label;
                m.aroundTypeVisible = false;
            },

            doSearch:function(key){
                console.log(key);
            },

            findClostPoi:function(){
                var m = this;

            },
        },

        watch: {
            "geo"(geo){
                var m = this;
                m.lonLat = new AMap.LngLat(geo.longitude,geo.latitude);
                m.myMaker.setPosition(m.lonLat);
            },
        },

        mounted: function () {
            var m = this;
            var geo = m.geo;
            m.id = m.$route.params.id;


            lazyAMapApiLoaderInstance.load().then(() => {
                m.lonLat = new AMap.LngLat(geo.longitude,geo.latitude);
                m.map = new AMap.Map(
                    m.$refs.mapEl,
                    {
                        scrollWheel:true,
                        resizeEnable:true,
                        center: m.lonLat
                    }
                );
                var marker = new AMap.Marker({
                    position:  m.lonLat
                });

                marker.setMap(m.map);
                marker.setTitle("设置位置");
                marker.setLabel({
                    offset: new AMap.Pixel(15, 15),
                    content: "武威"
                });
                var markers = new AMap.Marker({
                    position: [110.54,33.]
                });

                markers.setMap(m.map);


                m.map.setZoom(6);

                m.myMaker = vars.maptool.getMaker(undefined,"i-location",m.map);
            });
        },

        //实例被销毁之前
        beforeDestroy:function(){
            var m = this;
            //销毁地图
            m.map.destroy();
        },

        components: {
        },

        directives:{

        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:fankui;
    .@{name}{
        .page-content{
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
        }

        .map-container{
            flex: 1;
            background-color: @cl_flat_light;
            position: relative;
            display: flex;
            .map-el{
                flex: 1;
                //height: 600px;
            }
        }
    }

</style>


-->






