
<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 个人信息
        f7-list(media-list)
            f7-list-item(@click="routeTo(`/alter-personal/${got('user.id')}/`)")
                .speaker-genre
                    div 头像
                    a.right
                        img( :src="vars.null_img",v-if="!got('user.headImg')")
                        img(:src="vars.oss_url_base + got('user.headImg')", v-if="got('user.headImg')")
        f7-list(media-list)
            f7-list-item(@click="routeTo(`/alter-name/${got('user.id')}/`)")
                .speaker-genre
                    div 姓名
                    a.right {{got('user.name')}}
            f7-list-item(@click="routeTo(`/alter-nick/${got('user.id')}/`)")
                .speaker-genre
                    div 昵称
                    a.right {{got('user.nick')}}
            f7-list-item(@click="routeTo(`/personal-address/${got('user.id')}/`)")
                .speaker-genre
                    div 我的地址
                    a.right
                        i.icon.i-lp_speaker

            f7-list-item(@click="routeTo(`/change-password/${got('user.id')}/`)")
                .speaker-genre
                    div 修改密码
                    a.right
                        i.icon.i-lp_speaker
        f7-list(media-list)
            f7-list-item(@click="routeTo(`/alter-gender/${got('user.id')}/`)")
                .speaker-genre
                    div 性别
                    a.right(v-if="!got('user.gender')") 男
                    a.right(v-if="got('user.gender') == 0") 男
                    a.right(v-if="got('user.gender') == 1" ) 女
            f7-list-item(@click="routeTo(`/alter-region/${got('user.id')}/`)")
                .speaker-genre
                    div 地区
                    a.right {{got('user.region')}}
            f7-list-item(@click="routeTo(`/alter-sign/${got('user.id')}/`)")
                .speaker-genre
                    div 个性签名
                    a.right {{got('user.sign')}}

</template>
<script type="text/ecmascript-6">
    import defaultImg from "../assets/tuxiang.jpg";
    export default {
        data () {
            return {
                name: "personal-information",
                defaultImg,
                id:"",
                noCache:true
            }
        },


        computed: {
            user:function(){
                return this.$store.getters.user;
            },
        },

        methods: {

        },

        mounted: function () {
            var m=this;
            m.id   =   m.$route.params.id;
        }
    }
</script>

<style lang="less"   rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    .toolClass();
    .personal-information{
        .list-block {
            align-items: center;
            margin: @page-edge 0;
            .tao-zhuan{
                display: flex;
                list-style-type: none;
                background-color: #fff;
                li{
                    width: 100%;

                    .item-inner{
                        >div{
                            width: 100%;
                            height: 2rem;
                            line-height: 2rem;
                            color: #000;
                            .right{
                                justify-content: flex-end;
                                float: right;
                                .icon{
                                    font-size: 1.6rem;
                                }
                            }
                        }
                    }
                }
            }
            .speaker-genre{
                display: flex;
                align-items: center;
                >div{
                    flex: 1;
                }
                .right{
                    color: #7f7f7f;
                    .icon{
                        color:@cl_flat_light;
                        font-size: 1.2rem;
                    }
                    img{
                        margin: @page-edge 0;
                        width: 3rem;
                        height:3rem;
                        border-radius: 50%;
                    }
                }
            }
        }
    }
</style>
