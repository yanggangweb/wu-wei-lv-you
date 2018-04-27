<template type="text/jade" lang="jade">
    f7-page.jiaotong-cata
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",@click="goback()")
            f7-nav-center 交通


        .banner
            img(src="../assets/jiaotong-banner.png")

        f7-list.no-after-border.no-before-border.form-fix.form
            f7-list-item.input-item
                ico.em18(icon="i-chufadihedidian",slot="media")
                .item-input
                    input(type="text",placeholder="请输入始发地",v-model="source",@keydown.13="gjQuery")
            f7-list-item.input-item
                ico.em18(icon="i-zhongdian",slot="media")
                .item-input
                    input(type="text",placeholder="请输入目的地",v-model="target",@keydown.13="gjQuery")

            f7-list-item &nbsp;


            f7-button.submit-btn(fill,color="blue",title="搜索",@click="gjQuery") 搜索

        .arc-list(v-show="guildList.length")
            .row.flex(v-for="it in guildList",@click="jump(it)")
                ico.em18(icon="i-jiaotong1")
                span.flex1 {{it.name}}



</template>

<script type="text/ecmascript-6">

    var noCache = true;

    export default {
        name:"jiaotong-cata",
        data () {
            return {
                source:"朝阳公园",
                target:"渭南客运站",
                guildList:[]
            }
        },

        computed: {
            geo(){return this.$store.state.geo},
            addr(){return this.$store.getters.address}
        },

        methods: {
            gjQuery(){
                var m = this;

                if(!m.source) {
                    return vars.toast("请输入出发地");
                }
                if(!m.target) {
                    return vars.toast("请输入目的地");
                }



                var stopChain = false;
                var source,target;



                Promise.resolve()
                    .then($=>{
                        return m._autocomplete.promiseSearch(m.source);
                    })
                    .catch(function(err){
                        stopChain = true;
                        vars.toast("请在输入有效的起始地址");
                    })
                    .then(result=>{
                        if(stopChain)   return;
                        source = result.tips[0]
                        return m._autocomplete.promiseSearch(m.target)
                    })
                    .catch(function(err){
                        if(stopChain)   return;
                        vars.toast("请在输入有效的目的地址");
                    })
                    //

                    .then((result) => {
                        if(stopChain)   return;

                        target = result.tips[0];

                        var url = `http://uri.amap.com/navigation?from=${source.location.lng},${source.location.lat},${(source.name)}&to=${target.location.lng},${target.location.lat},${(target.name)}&via=&mode=bus&policy=1&src=mypage&coordinate=gaode&callnative=1`
                        console.log(url );
                        open(url, "_blank")
                    })

                ;





                //var url = `http://api.map.baidu.com/direction?region=西安&origin=${(m.source)}&destination=${(m.target)}&mode=walking&output=html&src=全域旅游`;
                //var url = `http://api.map.baidu.com/direction?region=西安&origin=${(m.source)}&destination=${(m.target)}&mode=transit&output=html&src=全域旅游`;
                var url = `http://uri.amap.com/navigation?from=,,${(m.source)}&to=-,-,${(m.target)}&via=&mode=bus&policy=1&src=mypage&coordinate=gaode&callnative=1`
                console.log(url );
                //open(url, "_blank")
            },
            loadGuideList(){
                var m = this;
                f7.showProgressbar();
                m.req("transportation/list",{
                    noCache,
                    longitude   :   m.geo.longitude,
                    latitude    :   m.geo.latitude,
                    mark        :   "JIAOTONG",
                    pageNum     :   1,
                    pageSize    :   60,
                    sorttype    :   0,
                    code        :   m.addr.id,
                }).then(resp=>{
                    if(resp.resCode) {
                        throw resp;
                    }
                    m.guildList = resp.list;
                    f7.hideProgressbar();

                }).catch(resp=>{
                    f7.hideProgressbar();
                    vars.toast(vars.trimErrorMessage(resp))
                })
            },

            jump(it){
                var m = this;
                vars.dic.idMark2Item(it.id,"JIAOTONG",it);
                m.routeTo(`/jiaotong-detail/${it.id}/JIAOTONG/`);
            }
        },



        mounted: function () {
            var m = this;

            AMap.service('AMap.PlaceSearch',$=>{//回调函数
                m._placeSearch= new AMap.PlaceSearch({});
            })
            AMap.plugin('AMap.Autocomplete',$=>{//回调函数
                m._autocomplete= new AMap.Autocomplete({
                    city:"渭南",//_.got("city","渭南")
                });
                m._autocomplete.promiseSearch = function(key){
                    return new Promise((resolve,reject)=>{
                        this.search(key,function(status, result){
                            if(status == "complete") {
                                resolve(result);
                            }else{
                                reject(status);
                            }
                        })
                    })
                }
            })

            m.loadGuideList();
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    .toolClass();


    .jiaotong-cata{

        &.page{
            background-color: #fff;
        }
        .banner{
            img{
                display: block;
                width: 100%;
            }
        }
        .input-item{
            .item-inner{
                &:after{
                    bottom: 1px;
                }
            }
        }

        .page-content{
            background-color: transparent;

            .form{
                 margin-right:@page-edge;
            }

            .submit-btn{
                margin-left:@page-edge;
            }
        }

        .arc-list{
            margin:@page-edge;

            .row{
                margin: 0.5em 0;
            }

            .icon{
                margin-right:@page-edge/2;
            }
        }
    }


</style>
