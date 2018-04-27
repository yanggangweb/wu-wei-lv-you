<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                |我的图库
                //.no-bgcolor.no-h-padding(:placeholder="'搜索'")
            f7-nav-right
                //f7-link() 完成
        f7-block   　
            .body
                .photo-grid.with-dele
                    .img-cell.add-img()
                        i.icon.i-guanbi
                        vue-core-image-upload(
                        :class="['uploader']",
                        :crop="false",
                        @imageuploaded="imageuploaded",
                        :max-file-size="5242880",
                        :data="uploadData",
                        :isXhr="true",
                        :url="uploadUrl"
                        )
                    .img-cell(v-for="(ig,index) in list",)
                        i.icon.i-guanbi.dele(@click="lookPhoto(index)")
                        img(v-if="!ig.pictureUrl", :src="vars.null_img")
                        img(v-if="ig.pictureUrl",  :src="vars.oss_url_base + ig.pictureUrl|ossResize(200)")
                f7-button(fill,color="orange",v-show="!listEof",@click="reqList") 加载更多图片
</template>

<script type="text/ecmascript-6">
    import PG from "../libs/ClassPG";
    import _ from "lodash";
    import VueCoreImageUpload  from 'vue-core-image-upload';

    var type_action_map = {
        0:{
            title:"个人图库",
            getList:function(m,mark,id,pagePara){
                m.uploadData.sliderKey="ACCOUNT";
                return m.req("picture/mypicstorage",{...pagePara,noCache:true}).then(
                    function (data) {
                        m.albumnName = m.$store.state.user.nick;
                        return data;
                        if (data.resCode) {
                            throw data.message;
                        }
                    },
                    function (err) {
                        f7.hidePreloader();
                        console.error(err);
                    }
                )
            }
        }
    }

    export default {
        mixins: [vars.mixin_1],
        data:function(){
            return {
                name:"my-tuku",
                pageTitle:"",
                albumnName:"",
                id:"",
                data:"",
                type:"",
                list:[],
                ins:{},
                ind:"",
                code:"",
                listEof:true,
                uploadData:{
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
                        size:17,
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
                return type_action_map[0].getList;
            },

            lookPhoto:function(index){
                var m = this;
                var ind=index;

                m.req("picture/delete",{
                    noCache:true,
                    ids:m.list[ind].id,
                })
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }
                        vars.toast("图片删除成功")
                        m.list.splice(index,1);
                    })

                    .catch(function(err){
                        f7.alert(err)
                    })
                ;

                vars.root.$emit("picture-del",{id:m.list[ind].id,noCache:true});
              //  debugger
                //m.imageList.splice(index,1)
              /*  var myPhotoBrowser = f7.photoBrowser({
                    zoom: 400,
                    backLinkText:"返回",
                    ofText:"/",
                    initialSlide:index,
                    photos: m.list.map(el=>{
                        return vars.oss_url_base + el.pictureUrl;
                    })
                });
                myPhotoBrowser.open(); // open photo browser*/
            },

            imageuploaded:function(res){
                var m = this;
                if(res.resCode != 0) {
                    f7.alert(res.message,"图片上传失败")
                    return;
                }
                m.list.unshift({
                    pictureUrl: res.pictureUrl
                });
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
            m.reqList()

        },
        components:{
            VueCoreImageUpload,
        },
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:my-tuku;
    .toolClass();
    .@{name}{
        .body{
            padding:@page-edge;
        }
        .content-block {
             margin:0;
        }

        div.page-content{
            .albumn-btn{
                background-color: fade(@cl_flat_black,50) !important;
            }
            background-color: transparent;
        }
        .body{
            padding: 0;
            .photo-grid{
                >.img-cell {
                    text-align:left;
                    display: inline-block;
                    vertical-align: top;
                    font-size: 1rem;
                    margin: @page-edge/2;
                    width: calc(~"50%" - @page-edge);
                    position: relative;
                }
            }
        }
        .searchbar {
            width: 120px;
            padding: 0;
            margin-right: 10px;
            input[type="search"] {
                width: 100%;
                padding: 0;
                padding-left: 25px;
            }
        }



    }
</style>


