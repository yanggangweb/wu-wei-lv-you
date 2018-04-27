<template type="text/html" lang="jade">
    f7-page(:class="[name,'jingdian-index-page']")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                .cl_white {{pageTitle}}
            f7-nav-right
                f7-link(icon="i-iconziti17",open-panel="right")

        //i(v-loding-in-view="", v-show="!list.length")

        f7-block.banner
            div.phone-link-cont(style="visibility:hidden")
                f7-link(icon="i-dianhua",@click="phoneCall('10086')")

            f7-button.thin.inline.albumn-btn(round="",fill="",color="black",style="visibility:hidden") 775
            h2.title-1.nowrap-ellipsis {{albumnName}}


        .body
            .photo-grid
                .img-cell.add-img(v-if="type!='$'")
                    .loginBtn(v-show="!logined",@click="doLogin")
                    i.icon.i-guanbi
                    vue-core-image-upload(
                        :class="['uploader']",
                        :crop="false",
                        @imageuploaded="imageuploaded",
                        @imageuploading="imageuploading",
                        @errorhandle="imageuploadError",
                        :max-file-size="5242880",
                        :data="uploadData",
                        :isXhr="true",
                        :url="uploadUrl"
                    )
                .img-cell(v-for="(ig,index) in list",@click="lookPhoto(index)")
                    img(v-if="!ig.pictureUrl", :src="vars.null_img")
                    img(v-if="ig.pictureUrl",  :src="vars.oss_url_base + ig.pictureUrl|ossResize(120)")

            f7-button(fill,color="orange",v-show="!listEof",@click="reqList") 加载更多图片
</template>

<script type="text/ecmascript-6">
    import PG from "../libs/ClassPG"
    import _ from "lodash";
    import VueCoreImageUpload  from 'vue-core-image-upload';

    var type_action_map = {
        0:{
            title:"商家相册",
            getList:function(m,mark,id,pagePara){
                if(!m.initPsomise) {
                    m.pageTitle = "商家相册";
                    m.initPsomise = m.req("detail/",{mark,id:id}).then(function(data){
                        m.setBg(vars.oss_url_base + _.get(data,"data.cover"),"auto-height black-mask")
                        m.albumnName = _.get(data,"data.name");
                        m.uploadData.sliderKey = _.get(data,"data.code");
                        return _.get(data,"data.code")
                    })
                }

                 return m.initPsomise.then(function (code) {
                         return m.req("picture/picstorage",{code,...pagePara,noCache:true})
                     })
                 ;
             }
        },
        "$":{
            title:"商品图库",
            getList:function(m,mark,id,pagePara){
                return m.req("product/productdetail",{id:id})
                    .then(function(data){
                        m.albumnName = _.get(data,"product.name");
                        return Promise.all([
                            Promise.resolve(_.get(data,"product.code")),
                            m.req("merchant/merchantdetail",{id:_.get(data,"product.merchantId")})
                        ])
                    })
                    .then(function([code,merch]){
                        m.setBg(merch.data.cover,"auto-height black-mask")
                        return code;
                    })
                    .then(function(code) {
                        return m.req("picture/picstorage",{code,...pagePara})
                    })
                ;
            }
        },
        "@":{
            title:"个人图库",
            getList:function(m,mark,id,pagePara){
                m.uploadData.sliderKey="ACCOUNT";
                return m.req("picture/mypicstorage",{...pagePara}).then(function(data){
                    m.albumnName = m.$store.state.user.nick;
                    return data;
                })
            }
        },
        "!":{
            title:"线路图库",
            getList:function(m,mark,id,pagePara){
                return m.req("line/detail",{id:m.id})
                    .then(function(data){

                        m.albumnName = _.get(data,"data.name");
                        m.setBg(data.data.cover,"auto-height black-mask")
                        return _.get(data,"data.code")
                    })
                    .then(function(code) {
                        return m.req("picture/picstorage",{code,...pagePara})
                    })
            }
        },

    }

    export default {
        mixins: [vars.mixin_1],
        data:function(){
            return {
                name:"image-grid",
                pageTitle:"",
                albumnName:"",
                //是否已经登录
                logined:false,
                id:"",
                type:"",
                list:[],
                ins:{},
                code:"",
                listEof:true,
                uploadData:{
                    mark:"",
                    sliderKey:"",
                    token:vars.store.state.userTooken
                },
                uploadUrl:(function(){
                    return vars.server_url_base + 'picture/upload';
                })(),            }
        },

        methods:{
            reqList:function(){
                var m = this;
                if(!m._pg) {
                    m._pg = new PG({
                        size:18,
                        onEofStatusChange:function(flag){
                            m.listEof = flag;
                        },
                        onReset:function(){
                            m.list = [];
                        }
                    })
                }

                //
               m.getReq()(
                   m,
                   m.type,
                   m.id,
                   {
                       ...m._pg.getPara()
                   }
               )
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }
                        if(data.end){
                            m._pg.forceEof();
                        }else{
                            m._pg.step();
                        }
                        m.list = m.list.concat(data.list);
                    })
                    .catch(function(err){
                        f7.alert("产品加载错误:",err)
                    })
                ;
            },

            getReq:function(){
                var m = this;
                if(m.type!="$" && m.type!="@"&& m.type!="!") {
                    return type_action_map[0].getList;
                }else{
                    return type_action_map[m.type].getList;
                }
            },

            lookPhoto:function(index){
                var m = this;
                var myPhotoBrowser = f7.photoBrowser({
                    zoom: 400,
                    backLinkText:"返回",
                    ofText:"/",
                    initialSlide:index,
                    photos: m.list.map(el=>{
                        return vars.oss_url_base + el.pictureUrl;
                    })
                });
                myPhotoBrowser.open(); // open photo browser
            },

            imageuploaded:function(res){
                var m = this;

                f7.hideProgressbar();
                if(res.resCode) {

                    //token原因上传失败
                    if(res.resCode==-1 || res.resCode ==-2) {
                        m.$store.commit("clearUserTooken");
                        m.__try_login().catch($=>{
                            vars.toast("用户取消登录");
                        });
                        //vars.toast(res.message,"上传失败,请重新登录");
                    //其他原因失败
                    }else{
                        vars.toast(res.message);
                    }
                    return;
                }
                vars.toast("图片已经上传，请等待管理员审核")
                //m.list.unshift({ pictureUrl: res.pictureUrl});
            },
            imageuploading(){
                var m = this;
                f7.showProgressbar();
            },
            imageuploadError(){
                var m = this;
                f7.hideProgressbar();
            },

            doLogin(){
                var m = this;
                m.__try_login().then($=>{
                    m.logined = true;
                })
            }

        },
        mounted:function(){
            var m = this;
            m.id = m.$route.params.id;

            /**
             * type $商品图库|@个人图库
             * 其他值说明是个mark
             */
            m.type = m.$route.params.type;

            m.uploadData.mark = m.type;
            m.reqList();


            m.logined = m.isLogined();

        },
        components:{
            VueCoreImageUpload
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:image-grid;
    .toolClass();
    .@{name}{
        .body{
            padding:@page-edge;
            padding-top: @page-edge/2;
        }

        div.page-content{
            .pageSettingFixedBg;
            .albumn-btn{
                background-color: fade(@cl_flat_black,50) !important;
            }
            background-color: transparent;
        }
        .nowrap-ellipsis{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .loginBtn{
            position: absolute;
            &:extend(.expandin);
            z-index: 9;
        }
    }
</style>
