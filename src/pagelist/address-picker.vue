<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",@click="_goback")
            f7-nav-center
                search-bar.list-page-searchbar.no-bgcolor.no-h-padding(placeholder="搜索",@dosearch="doSearch", :inNavbar="true",@click:cancel="cancelResult",ref="searchbar")
            f7-nav-right

        .choice-panel
            f7-list.no-margin.margin-top-1
                f7-list-item
                    span(@click="openAddrPicker(`city`,cur.provinceId)")
                        |   市：{{got("cur.cityName","所有地市")}}
                        i.icon.i-drop-down
                    a(@click="openAddrPicker(`county`,cur.cityId)",v-if='got("cur.cityId")')   {{got("cur.countyName","所有区县")}}
                        i.icon.i-drop-down
                f7-list-item
                    span   省：{{got("cur.provinceName","所有省")}}
                    a(@click="openAddrPicker(`province`)")   选择省份
                        i.icon.i-drop-down

        .list-panel
            f7-list.no-margin.margin-top-1
                f7-list-item
                    div
                        a   热门城市
                        .button-grid
                            f7-button(v-if="!got('geo.error')",@click="setCur(geoToAddr(geo))")  {{got("geo.city")}}(当前位置)
                            f7-button(v-for="it in hotList",@click="setCur(it)") {{it.name}}

            .v-list-cont(ref="vlistCont")
                virtualList.vl(:size="44",:remain="10")
                    .vl-item(
                        v-for="(it,index) in staticList",
                        :key="index",
                        @click="addrResultChoose(it)",
                        :class="{isWord:!it.type}"
                    )
                        |   {{it[it.type+"Name"] || it}}

        picker.addrChooser(ref="subAddrChooser",title="请选择")
            .a-panel
                f7-list.no-margin.margin-top-1
                    f7-list-item(v-for="it in subChoiceList",@click="doSubChoice(it)") {{it.name}}

        picker.addressSearchResultPanel(ref="searchResultPanel",:noMask="true")
            .a-panel
                .blank-placeholder(v-show="!searchRetList.length")
                    i.icon.i-zaishiyici
                    .label 没有相关内容
                f7-list.no-margin.margin-top-1
                    f7-list-item(v-for="(it,index) in searchRetList",@click="addrResultChoose(it)")
                        span(v-if="it.type=='province'" ,v-html="it.name||it.provinceName")
                        span(v-if="it.type=='city'"     ,v-html="it.provinceName + it.name||it.cityName")
                        span(v-if="it.type=='county'"   ,v-html="it.provinceName + it.cityName + it.name||it.cotyName")


</template>

<script type="text/ecmascript-6">
    import searchBar from "../components/search-bar.vue";

    //import Item from '../item.vue'
    import virtualList from 'vue-virtual-scroll-list'

    export default {
        data:function(){
            return {
                name:"address-picker",

                //搜索结果
                searchRetList:[],

                //热门
                hotList:[],

                //固定选取的数据
                staticList:[],


                //单独的区县，市，省候选词
                subChoiceList:[],

                //虚列表相关配置
                vlistSize:44,
                vlistRemain:8,

                cur:{
                    //type                    :   "city",
                    //provinceName            :   defaultGeo.province,
                    //provinceId              :   defaultGeo.adCode,
                    //cityName                :   defaultGeo.city,
                    //cityId                  :   defaultGeo.adCode,
                    //countyName              :   defaultGeo.adCode,
                    //countyId                :   defaultGeo.adCode,
                    //name                    :   defaultGeo.city
                }
            }
        },
        computed:{
            vlistCont(){return this.$refs.vlistCont;},
            vlist(){return this.$refs.vlist;},
            subAddrChooser(){return this.$refs.subAddrChooser;},
            srPanel(){return this.$refs.searchResultPanel},
            searchbar(){return this.$refs.searchbar},
            geo:function(){return this.$store.state.geo}
        },
        mounted(){
            var m = this;
            f7.showProgressbar();
            m.req("position/list::get")
                .then(resp=>{
                    if(resp.resCode) {
                        throw resp.message;
                    }
                    m.hotList = resp.hotList;
                    var sl = resp.list;
                    m.staticList = sl;
                    f7.hideProgressbar();

                })
                .catch(resp=>{
                    vars.toast(vars.trimErrorMessage(resp));
                    f7.hideProgressbar();
                })
            ;

            m.vlistRemain =parseInt(m.vlistCont.offsetHeight/m.vlistSize);

            m.cur = _.merge({},m.$store.getters.address);
        },
        methods:{
            geoToAddr:vars.geoToAddr,
            doSearch(key){
                var m = this;
                if(!key)    return;

                f7.showProgressbar();
                m.req(`es/_searchPosition?query=${key}&from=0&size=50`)
                    .then(resp=>{
                        if(resp.resCode) {
                            throw resp.message;
                        }
                        f7.hideProgressbar();

                        if(!resp.data.length) {
                            m.searchRetList=[];
                            return vars.toast("没有相关内容")
                        }

                        var data = resp.data.map(el=>{
                            var ret = el.object;
                            ret.type=el.type;
                            return ret;
                        })

                        console.log(data);
                        m.searchRetList = data;
                        m.srPanel.show();
                    })
                    .catch(resp=>{
                        f7.hideProgressbar();
                        vars.toast(vars.trimErrorMessage(resp))
                    })
                ;
            },

            openAddrPicker(levelName,superLevelId){
                var m = this;

                var promise;

                if(levelName=="province"){
                    promise = vars.getProvince();
                }else if(levelName=="city"){
                    promise = vars.getCity(superLevelId);
                }else if(levelName=="county"){
                    promise = vars.getCounty(superLevelId);
                }

                f7.showProgressbar();

                promise
                    .then(resp=>{
                        if(resp.resCode) {
                            throw resp.message;
                        }
                        f7.hideProgressbar();

                        if(!_.get(resp,"list.length")) {
                            return vars.toast("没有下级了")
                        }

                        m.subChoiceList = resp.list;
                        m.subAddrChooser.show();
                    })
                    .catch(resp=>{
                        f7.hideProgressbar();
                        vars.toast(vars.trimErrorMessage(resp))
                    })
                ;

            },

            doSubChoice(addr){
                var m = this;
                m.setCur(addr);
                m.subAddrChooser.hide();
            },

            setCur(addr){
                var m = this;

                _.map(addr,(value,key)=>{
                    if(typeof value=="string")
                        addr[key]=vars.html2text(value);
                })

                vars.fixAddressObject(addr);

                if(!addr.type) {
                    throw "type 字段缺失"
                }

                m.cur[addr.type + "Name"] = addr[addr.type + "Name"]||addr.name;
                m.cur[addr.type + "Id"] = addr[addr.type + "Id"];
                m.cur.type  =   addr.type;
                m.cur.id    =   addr[addr.type + "Id"];
                m.cur.name  =   addr[addr.type + "Name"];

                //重置和补充
                if(addr.type=="province") {
                    m.cur.cityName="所有地市";
                    m.cur.cityId="";
                    m.cur.countyName="所有区县";
                    m.cur.countyId="";
                }


                if(addr.type=="city") {
                    m.cur.countyName="所有区县";
                    m.cur.countyId="";

                    m.cur.provinceName = addr.provinceName;
                    m.cur.provinceId = addr.provinceId;
                }

                if(addr.type=="county") {
                    m.cur.provinceName = addr.provinceName;
                    m.cur.provinceId = addr.provinceId;

                    m.cur.cityName=addr.cityName;
                    m.cur.cityId=addr.cityId;
                }
            },

            cancelResult(){
                var m = this;
                m.hideSrResult();
            },

            addrResultChoose(addr){
                var m = this;
                vars.fixAddressObject(addr);
                m.setCur(addr);
                m.hideSrResult(1);
            },

            _goback(){
                var m = this;
                if(m.srPanel.visible) {
                    m.hideSrResult(1);
                }else{
                    m.$store.commit("setAddress",m.cur);
                    m.goback();
                }
            },


            hideSrResult(withClear){
                var m = this;
                m.srPanel.hide();
                if(withClear) {
                    m.searchbar.cancel();
                }
            },


            initVlist(data){
                var m = this;
                m.vlist.ins = f7.virtualList(`#vList_${m._uid}`, {
                    items: data,
                    height: 44,
                    template:
                        `<li class="item-content">
                            <div class="item-inner">
                                <div class="item-title">{{name}}</div>
                            </div>
                        </li>
                    `
                });
            }
        },
        components:{
            searchBar,
            virtualList
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:address-picker;
    .toolClass();
    .@{name}{

        .page-content{
            font-size: 0.9rem;
            display: flex;
            flex-direction: column;

            .item-inner{
                font-size: 0.9rem;
            }

            .choice-panel{
                background-color: #ffff00;
                position: relative;
                z-index: 9;
                //box-shadow: #eaeaea 0px 1px 7px 0px;
            }

            .list-panel{
                overflow-y: auto;
                flex: 1;

                display: flex;
                flex-direction: column;
                .v-list-cont{
                    flex: 1;
                    overflow: hidden;

                    .vl{
                        height: 100%;


                        .vl-item{
                            .lineh(44px);
                            padding-left:@page-edge;
                            background-color: #ffffff;
                            position: relative;

                            &:after{
                                content:"";
                                position: absolute;
                                bottom: 0;
                                left:@page-edge;
                                right:@page-edge;
                                height: 1px;
                                background-color: #f0f0f0;
                            }

                            &.isWord{
                                background-color: #f6f6f6;

                                font-weight: 700;
                                & + .vl-item{
                                    &:after{
                                        display: none;
                                    }
                                }
                            }

                        }
                    }
                }
            }
        }



        .button-grid{
            margin-top: 0.5em;
            white-space: normal;
            .button{
                margin-right: 0.5em;
                margin-bottom:0.5em;
                background-color: #f5f5f5;
                border-color: #ECECEC;
                color: #636363;
                display: inline-block;
            }

        }
    }

    .addrChooser{
        .a-panel{
            max-height:60vh;
            overflow-y: auto;
            font-size: 0.9rem;

            .item-inner{
                font-size: 0.9rem;
            }
        }
    }

    .addressSearchResultPanel{
        h4{
            display: none;
        }
        .a-panel{
            overflow-y: auto;
            height: calc(~"100vh" - (@top-bar-height));
            .ios &{
                height: calc(~"100vh" - (@top-bar-height + @ios-status-bar-height));
            }
            b{
                color: #FD5263;
            }

            .item-inner{
                font-size: 0.9rem;
            }

        }

    }
</style>
