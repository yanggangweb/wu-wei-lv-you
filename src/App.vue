<template>
    <!-- App -->
    <div id="app" >

        <!-- Statusbar -->
        <f7-statusbar></f7-statusbar>

        <!-- Left Panel -->
        <f7-panel left reveal layout="dark">
            <f7-view id="left-panel-view" navbar-through :dynamic-navbar="true">
                <f7-navbar v-if="$theme.ios" title="'Left Panel'" sliding></f7-navbar>
                <f7-pages>
                    <f7-page>
                        <f7-navbar v-if="$theme.material" title="Left Panel" sliding></f7-navbar>
                        <f7-block inner>
                            <p>Left panel content goes here</p>
                        </f7-block>
                        <f7-block-title>Load page in panel</f7-block-title>
                        <f7-list>
                            <f7-list-item link="/about/" title="About"></f7-list-item>
                            <f7-list-item link="/form/" title="Form"></f7-list-item>
                        </f7-list>
                        <f7-block-title>Load page in main view</f7-block-title>
                        <f7-list>
                            <f7-list-item link="/about/" title="About"
                                          link-view="#main-view"
                                          link-close-panel></f7-list-item>
                            <f7-list-item link="/form/" title="Form" link-view="#main-view"
                                          link-close-panel></f7-list-item>
                        </f7-list>
                    </f7-page>
                </f7-pages>
            </f7-view>
        </f7-panel>

        <!-- Right Panel -->
        <f7-panel right cover layout="light">
            <f7-view id="right-panel-view" navbar-through :dynamic-navbar="true">
                <f7-navbar v-if="$theme.ios" title="分享" sliding></f7-navbar>
                <f7-pages>
                    <share-view></share-view>
                </f7-pages>
            </f7-view>
        </f7-panel>

        <!-- Main Views -->
        <f7-views>
            <!--<f7-view id="main-view" navbar-through :dynamic-navbar="true" main>-->
            <f7-view id="main-view" navbar-through :dynamic-navbar="true" main>
                <!-- Pages -->
                <f7-pages>


                        <f7-page>
                            <f7-block>

                            </f7-block>
                        </f7-page>


                    <!--<home-page class="embed-in-app"></home-page>-->

                </f7-pages>
            </f7-view>
        </f7-views>

        <!-- Popup -->
        <f7-popup id="popup">
            <f7-view navbar-fixed>
                <f7-pages>
                    <f7-page>
                        <f7-navbar title="Popup">
                            <f7-nav-right>
                                <f7-link close-popup>Close</f7-link>
                            </f7-nav-right>
                        </f7-navbar>
                        <f7-block>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Neque, architecto. Cupiditate laudantium rem nesciunt numquam,
                            ipsam. Voluptates omnis, a inventore atque ratione aliquam.
                            Omnis iusto nemo quos ullam obcaecati, quod.
                        </f7-block>
                    </f7-page>
                </f7-pages>
            </f7-view>
        </f7-popup>

        <!-- Login Screen -->
        <f7-login-screen id="login-screen">
            <f7-view id="loginView">
                <f7-pages>
                    <login-page></login-page>
                </f7-pages>
            </f7-view>
        </f7-login-screen>

    </div>
</template>

<script type="text/ecmascript-6">
import loginPage from "./pagelist/login.vue"
import shareView from "./pagelist/share-view.vue"

export default {
    data(){
        return {
            started:false
        }
    },

    methods:{
        startup_layer_hide:function(){
            var m = this;
            m.started = true;
        },

        jump:function(path){
            var m = this;
            m.$store.commit("routeTo","/about/")
        }
    },

    mounted:function(){
        var m = this;
        setTimeout(function(){
            m.startup_layer_hide();
        },vars.startup_sreen_dura);

        //vars.defalut_router_link = "/home/";
    },
    watch:{
        app_init:function(v){
            var m = this;
            m.startup_layer_hide()
        }
    },

    props:{
        app_init:{type:Number}
    },

    components:{
        loginPage,
        shareView
    }
}
</script>


<style rel="text/less" lang="less">
    @import "styles/tool";
    .toolClass;

    #app{
        height: 100%;
    }

    .startup-layer{
        &:extend(.expandin);
        overflow:hidden;
        top: 0px;
        position: fixed;
        background:#f6f6f6 none 50% 50%;
        background-size:cover;
        z-index: 15000;

        transition: transform 0.3s @ExpoEaseOut;

        img{
            width:100%;
            height:100%;
            display:block;
            object-fit: cover;
        }

        &.started{
            transform: translate(-100%,0);
        }


    }
</style>
