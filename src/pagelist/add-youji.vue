<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                |写奇遇
            f7-nav-right.add-youji-right-style
                p(@click="draft_next()")
                    i.icon.i-baocun
                    b
                        span 保存
                        span 草稿
                p(@click="go_next()")
                    i.icon.i-iconfabiaopinglun
                    b
                        span 发表
                        span.line-font 游记
        .block()
            .title-textarea(:class="{v_error:$v.form.name.$error}")
                f7-input(type="input",placeholder="请输入标题",v-model.trim="form.name",@click="$v.form.name.$touch()")
            .coverplay
                img(v-if="!uploadedImageList.length",:src="coverplayImg")
                //img(v-if="_get(data,'cover')",  :src="vars.oss_url_base +_get(data,'cover')")
                img(v-if="uploadedImageList.length ",  :src="vars.oss_url_base +uploadedImageList")
                .button-img.thin
                    i  更换封面
                    vue-core-image-upload(
                    :class="['uploader']",
                    :crop="false",
                    @imageuploaded="imageuploaded",
                    :max-file-size="5242880",
                    :data="uploadData",
                    :isXhr="true",
                    :url="uploadUrl"
                    )
            .photo-grid.cover-photo(v-if="toopen")
                .img-cell.add-img()
                    i.icon.i-guanbi
                    vue-core-image-upload(
                    :class="['uploader']",
                    :crop="false",
                    @imageuploaded="imageuploadeds",
                    :max-file-size="5242880",
                    :data="uploadData",
                    :isXhr="true",
                    :url="uploadUrl"
                    )
                .img-cell.dele-img(v-if="uploadedMoreImageList.length" v-for="(imgData,index) in uploadedMoreImageList")
                    img( :src="vars.oss_url_base + imgData")
                    i.icon.i-guanbi.dele(@click="dele(index)")
                //.img-cell.dele-img(v-if="list.length" v-for="img in list.pictureUrl.split(',')")
                    img(:src="vars.oss_url_base + img")
                    i.icon.i-guanbi.dele(@click="dele(index)")
            //div {{uploadedMoreImageList}}
        picker.filter-gp-picker.title-youji-picker(ref="qiyuTitle" ,title="奇遇内容")
            f7-list.form
                f7-list-item(:class="{v_error:$v.form.content.$error}")
                    textarea(placeholder="分享您的奇遇......",v-model.trim="form.content",@click="$v.form.content.$touch()")
            .toggle-button
                f7-button(fill="",color="green",@click="hidecontent") 取消
                f7-button(fill="",color="red",@click="hidecontent") 确定
        f7-toolbar(bottom)
            f7-link(icon="i-wenzishibie",@click="showcontent") 添加文字
            f7-link(icon="i-tupian8",@click="toggle") 上传图片
            <!--f7-link.open-about1(icon="i-tupian")-->
            <!--f7-link(icon="i-biaoqing")-->
            <!--f7-link(icon="i-youji")-->



</template>
<script type="text/ecmascript-6">
    import defaultImg from "../assets/default.jpg";
    import coverplayImg from "../assets/coverplay.jpg";
    import PG from "../libs/ClassPG"
    import _ from "lodash";
    import $ from "jquery";
    import VueCoreImageUpload  from 'vue-core-image-upload';
    import filterBar from "../components/filter-bar.vue"
    import {required, minLength, between} from 'vuelidate/lib/validators'
    var maxImageNumber = 9;
    var maxCover =1;
    export default {
        mixins: [vars.mixin_1],
        data: function () {
            return {
                name: "add-youji",
                pageTitle: "",
                albumnName: "",
                id: "",
                data:[],
                defaultImg,
                coverplayImg,
                type: "",
                list: {
                    cover:"",
                    pictureUrl:null,
                },
                imageList:[],
                bgimg:[],
                comm:{
                    pictureUrl:[],

                },
                toopen: true,
                ins: {},
                ind:"",
                code: "",
                form: {
                    name: "",
                    content: "",
                },
                listEof: true,
                uploadData: {
                    sliderKey: "",
                    token: vars.store.state.userTooken
                },
                uploadUrl: (function () {
                    return vars.server_url_base + 'picture/upload';
                })(),

                uploadedImageList:[],
                uploadedMoreImageList:[],
                str:[],
            }
        },
        validations: {
            form: {
                name:{
                    required,
                    minLength: minLength(2)
                },
                content: {
                    required,
                    minLength: minLength(2)
                },
            }

        },

        methods: {
            initReqList:function () {
                var m=this;
                m.uploadData.sliderKey = "ACCOUNT";
                if( m.isadd=='1'){
                    m.list = {
                            cover:"",
                            pictureUrl:null,
                            };
                    m.req("travelnote/detail", {id: m.id }).then(function (data) {
                        // m.data = data.data;
                        m.list=data.data;
                        m.form.name=m.list.name;
                        m.form.content=m.list.content;
                        m.uploadedImageList=m.list.cover;
                       if(m.list.pictureUrl){

                            var str =m.list.pictureUrl.split(",")
                        }
                        m.str =str;

                        //console.log("类型是："+typeof(str)+"，字符串是："+str)
                        //["ACCOUNT/201801221346545760.jpg","ACCOUNT/201801221346352481.jpg"];
                        console.log(str);
                        m.uploadedMoreImageList=str;
                        //m.uploadedMoreImageList=[{"pictureUrl":"ACCOUNT/201801221346545760.jpg"},{"pictureUrl":"ACCOUNT/201801221346352481.jpg"}];
                        //return m.list;
                    })
                }else if(m.isadd=='0'){
                    m.uploadedImageList=[];
                    m.uploadedMoreImageList=[];

                }
            },
            dele:function(index){

                var m = this;
                console.log(index);
                var ind=index;
                m.str.splice(index,1);
                /*m.req("picture/delete",{
                    noCache:true,
                    ids:m.list[ind].id,
                })
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }
                        f7.alert("图片删除成功")
                    })

                    .catch(function(err){
                    })
                ;*/
            },
            imageuploaded:function(coverPicture){
                var m = this;
                if(coverPicture.resCode != 0) {
                    f7.alert(coverPicture.message,"图片上传失败")
                    return;
                }
                //m.list.unshift(res.pictureUrl);
                m.uploadedImageList=coverPicture.pictureUrl;
                // m._get(uploadedImageList,'cover') = m.uploadedImageList;
            },

            imageuploadeds:function(morePicture){
                var m = this;
                if(morePicture.resCode != 0) {
                    f7.alert(morePicture.message,"图片上传失败")
                    return;
                }

                var mewMorePicture=morePicture.pictureUrl
                if(m.uploadedMoreImageList){
                    m.uploadedMoreImageList.unshift(mewMorePicture);
                }else{
                    m.uploadedMoreImageList=[];
                    m.uploadedMoreImageList.unshift(mewMorePicture);
                }




            },
            toggle: function () {

                this.toopen = !this.toopen;

                if (this.toopen == true) {
                    this.toopen == false;
                }
            },
            draft_next: function (coverPicture,morePictureurl) {

                //草稿游记

                var m = this;
                if (m.$v.form.$invalid) {
                    m.$v.form.$touch();
                    return;
                }
//                //name:m.form.name,


                let imgList = m.uploadedImageList;
                let imgListMore = m.uploadedMoreImageList.map(el=>el).join(",")
                console.log(m.uploadedMoreImageList);

                /* if(!m.bgimg[0]){
                     f7.alert("请添加背景图片")
                     return
                 }*/
                /*if(!m.list[0]){
                    m.list.unshift({
                        cover: null
                    });
                }*/

                if(m.isadd=='0'){
                    m.req("travelnote/saveorupdate", {publishStatus:0,noCache: true,pictureUrl:imgListMore,cover:imgList , content: m.form.content,name: m.form.name,code:m.addr.id})
                        .then(function (data) {

                            if (data.resCode) {
                                throw data.message;
                            }
                            vars.root.$emit("youjiList-fresh", {publishStatus:0});
                            //m.$router.back();
                            m.routeTo(`/my-youji/${m.accountId}`)
                            f7.alert("提交成功");

                        })
                        .catch(function (err) {
                        })
                    ;

                }else if(m.isadd=='1'){
                    m.req("travelnote/saveorupdate", {id:m.id,publishStatus:0,noCache: true,pictureUrl:imgListMore,cover:imgList , content: m.form.content,name: m.form.name,code:m.addr.id})
                        .then(function (data) {

                            if (data.resCode) {
                                throw data.message;
                            }
                            vars.root.$emit("youjiList-fresh", {publishStatus:1});
                            //m.$router.back();
                            m.routeTo(`/my-youji/${m.accountId}`)
                            f7.alert("提交成功");

                        })
                        .catch(function (err) {
                        })
                    ;

                }



                //vars.root.$emit("youji-fresh",{noCache: true,accountId: m.accountId})
            },
            go_next: function (coverPicture,morePictureurl) {

                //发表游记

                var m = this;
                if (m.$v.form.$invalid) {
                    m.$v.form.$touch();
                    return;
                }
                //name:m.form.name,
                let imgList = m.uploadedImageList;
                let imgListMore = m.uploadedMoreImageList.map(el=>el).join(",")
                console.log(m.uploadedMoreImageList);

                /* if(!m.bgimg[0]){
                     f7.alert("请添加背景图片")
                     return
                 }*/
                /* if(!m.bgimg[0]){
                     f7.alert("请添加背景图片")
                     return
                 }*/


                if(m.isadd=='0'){
                    m.req("travelnote/saveorupdate", {publishStatus:1,noCache: true,pictureUrl:imgListMore,cover:imgList , content: m.form.content,name: m.form.name,addCode:m.addr.id,longitude:m.$store.state.geo.longitude,latitude:m.$store.state.geo.latitude})
                        .then(function (data) {

                            if (data.resCode) {
                                throw data.message;
                            }
                            vars.root.$emit("youjiList-fresh", {publishStatus:1});
                            //m.$router.back();
                            m.routeTo(`/my-youji/${m.accountId}`)
                            f7.alert("提交成功");

                        })
                        .catch(function (err) {
                        })
                    ;
                }
                if(m.isadd=='1'){
                    m.req("travelnote/saveorupdate", {id:m.id,publishStatus:1,noCache: true,pictureUrl:comment.pictureUrl,cover:m.bgimg[0].cover, content: m.form.content,name: m.form.name,addCode:m.addr.id,longitude:m.$store.state.geo.longitude,latitude:m.$store.state.geo.latitude})
                        .then(function (data) {

                            if (data.resCode) {
                                throw data.message;
                            }
                            vars.root.$emit("youjiList-fresh", {publishStatus:1});
                            //m.$router.back();
                            m.routeTo(`/my-youji/${m.accountId}`)
                            f7.alert("提交成功");

                        })
                        .catch(function (err) {
                        })
                    ;
                }



                //vars.root.$emit("youji-fresh",{noCache: true,accountId: m.accountId})
            },
            hidecontent:function(){
                var m =this;

                m.$refs.qiyuTitle.hide();
            },
            showcontent:function () {
                var m=this;
                m.$refs.qiyuTitle.show();
            },


        },
        mounted: function () {
            var m = this;
            m.id = m.$route.params.id;
            m.isadd = m.$route.params.isadd;

            m.initReqList();
        },
        computed: {
            addr(){return this.$store.getters.address}
        },
        components: {
            filterBar,
            VueCoreImageUpload,
        },
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    .toolClass();
    .title-youji-picker{
        .item-content{
            border: 1px solid #b2b2b2;
            background-color: #ECF0F1;
        }
        .v_error {
            .item-content{
                border: 1px solid @cl_flat_red1;
                background-color: #fff;
            }
        }
        .item-content {
            border: 1px solid #b2b2b2;
            background-color: @cl_flat_gray3;
            textarea {
                box-sizing: border-box;
                padding: 7.5px;
                width: 100%;
                height: 6rem;

            }
        }

        .toggle-button{
            margin: @page-edge 0;
            display: flex;
            justify-content: space-around;
        }
    }

    .add-youji {
        .dele-img{
            .dele{
                position: absolute;
                top: 0;
                right: 0;
                display: block;
                z-index: 9;
                width: 22.5px;
                height: 22.5px;
                line-height: 22.5px;
                text-align: center;
                font-size: 0.8rem;
                background-color: #FB3B46;
                color: #ffffff;
            }
        }
        .form{
            margin: 0;
            padding: @page-edge/2;
            textarea {
                box-sizing: border-box;
                width: 100%;
                font-size: 1rem;
                height: 6rem;

            }
            .item-content{
                border: 1px solid #b2b2b2;
                background-color: #f7f7f7;
            }
            .v_error {
                .item-content{
                    border: 1px solid @cl_flat_red1;
                    background-color: #fff;
                }
            }

        }


        .toolbar {
            .toolbar-inner {
                .button {
                    margin-left: 1em;
                    margin-right: 1em;
                    border-radius: 1rem;
                    height: 2rem;
                    line-height: 2rem;
                    border: none;
                    background-color: @cl_flat_greenn;
                    color: #fff;
                    display: block;
                    width: 100%;

                }
                a {
                    .icon {
                        position: relative;
                        top: 0px;
                        font-size: 2rem;
                    }
                }
            }

        }
        .page-content {
            background-color: #fff;
        }
        .coverplay{
            position: relative;
            img{
                display: block;
                object-fit: fill;
                width: 100%;
                height: 100%;
                height: 180px;
            }
            .button-img{
                position: absolute;
                bottom: @page-edge;
                right: @page-edge;
                padding: @page-edge/2;
                border: 1px solid #fff;
                color: #fff;
                border-radius: 4px;
                .uploader{
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    color: transparent;

                }

            }

        }
        .title-textarea {
            /* */
            padding: @page-edge/2;
            input {
                //margin:@page-edge;
                padding: @page-edge/2;
                box-sizing: border-box;
                width: 100%;
                height: 2rem;
                line-height: 2rem;
                border: 1px solid #b2b2b2;
                background-color:  #f7f7f7;

            }
            .v_error {
                input {
                    background-color: #fff;
                    border: 1px solid @cl_flat_red1;
                }
            }
        }
        .cover-photo{
            width: calc(~"100%" - @page-edge);
            margin: @page-edge/2;
        }
        .toolbar-inner {

            justify-content: space-around;
            i{
                color:#4bad96;
            }

        }
        .photo-grid {
            .add-img {
                background-color: #f9f9f9;
                position: relative;
                .icon {
                    font-size: 3rem;
                    color: #ddd;
                }
            }

        }

    }

    .add-youji-right-style{
        &.right{
            p{
                display: flex;
                i{
                    flex: 1;
                    font-size: 1.6rem;
                    align-content: center;
                    color: #01BF9D;

                }
                >b{
                    span{
                        display: flex;
                        font-size: 0.6rem;
                        color: #6d6d72;
                        margin-right: 10px;
                        align-content: center;
                        &.line-font{
                            flex: 1;

                        }
                    }
                }

            }

        }

    }






</style>



