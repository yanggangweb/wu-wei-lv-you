<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 修改头像
            f7-nav-right
                f7-button()  保存


        f7-block.block()
            .photo-grid(form="")
                .img-cell.add-img()
                    i.icon.i-caozuobar-tihuantupian
                    vue-core-image-upload(
                    :class="['uploader']",
                    :crop="false",
                    @imageuploaded="imageuploaded",
                    :max-file-size="5242880",
                    :data="uploadData",
                    :isXhr="true",
                    :url="uploadUrl"
                    )
                .img-cell()
                    img(v-if="!account.headImg", :src="vars.null_img")
                    img(v-if="account.headImg",  :src=" vars.oss_url_base +_get(account,'headImg')")

</template>
<script type="text/ecmascript-6">
    import PG from "../libs/ClassPG"
    import _ from "lodash";
    import VueCoreImageUpload  from 'vue-core-image-upload';
    var maxImageNumber = 1;

    var type_action_map = {
        0:{
            title:"个人图库",
            getList:function(m,mark,id,pagePara){
                m.uploadData.sliderKey="ACCOUNT";
                return m.req("account/accountinfo",{...pagePara,noCache:true}).then(
                    function (data) {
                        m.albumnName = m.$store.state.user.nick;
                        console.log(data);
                        return data;
//                        return data.list;
                        if (data.resCode) {
                            throw data.message;
                        }
                    },
                    function (err) {
                        f7.hidePreloader();
                        f7.alert("列表信息获取失败")
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
                name:"alter-personal",
                max: maxImageNumber,
                pageTitle:"",
                albumnName:"",
                account:"",
                id:"",
                data:"",
                type:"",
                ins:{},
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

                m.getReq()(
                    m,
                    m.id,
                )
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }

                        m.account=data.account;

//                        有问题
//                      m.account = m.account.concat(account.headImg);
                        console.log(m.list);
                    })
                    .catch(function(err){
                        f7.alert("产品加载错误:",err)
                    })
                ;
            },

            getReq:function(){
                return type_action_map[0].getList;
            },

            imageuploaded:function(res){
                var m = this;
                if(res.resCode != 0) {
                    f7.alert(res.message,"图片上传失败")
                    return;
                }

                m.req("account/update",{headImg:res.pictureUrl}).then(function(data){
                    m.$store.state.user.headImg = res.pictureUrl;
                    m.goback(true);
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

    .toolClass();
    .alter-personal {
        .content-block{
            margin: @page-edge 0;
            padding: 0;
            .list-block{
                margin: 0;
            }
        }
        .photo-grid {
            .img-cell {
                display: inline-block;
                vertical-align: top;
                font-size: 1rem;
                margin: @page-edge;
                width: calc(38%);
                position: relative;
                i{
                    img{
                        float: left;
                    }
                }
            }
        }
        .photo-grid {
            .add-img{
                .icon {
                    transform: translate(-50%, -50%) rotate(0deg);
                }
            }
        }

    }
</style>
