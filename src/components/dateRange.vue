<template type="text/html" lang="jade">
    .date-range
        .day-container(@click="pickDate('min')")
            .title 入住日期
            .day
                .day-number {{min.format('D')}}日
                .m-w-conatainer
                    .month-number {{min.format('M')}}月
                    .week-number {{min.format('dddd')}}
        .long
            span 共{{dateLong}}晚
        .day-container(@click="pickDate('max')")
            .title 离开日期
            .day
                .day-number {{max.format('D')}}日
                .m-w-conatainer
                    .month-number {{max.format('M')}}月
                    .week-number {{max.format('dddd')}}
</template>



<script type="text/ecmascript-6">
    import mo from "moment"
    import _ from "lodash";

    var dateFormaterMoment = "YYYY-M-D";
    var monthArray = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二"];
    var dayArray = ["周日","周一","周二","周三","周四","周五","周六"];
    var getCalendar = function(config){
        return f7.calendar(_.merge({
            monthNames:monthArray,
            monthNamesShort:monthArray,
            dayNames:dayArray,
            dayNamesShort:dayArray
        },config))
    }

    export default {
        name: 'date-range',
        data () {
            var m = this;
            return {
                min:mo(m.start),
                max:mo(m.end),
            }
        },
        methods: {
            pickDate:function(flag){
                var m = this;
                var path = flag;
                var date = m._get(m,path);
                m.dateSetPath=path;
                if(!date) return;
                if(!m.datePicker) {
                    m.datePicker = getCalendar({
                        onDayClick:function(p, dayContainer, year, month, day){
                            var moValue = mo(`${year}-${month*1+1}-${day}`,dateFormaterMoment);
                            m._set(m,m.dateSetPath,moValue)
                            m.datePicker.close()
                        }
                    });
                }

                setTimeout(function(){
                    m.datePicker.setValue([date._d])
                    m.datePicker.open();
                })
            },
        },
        mounted: function () {
            var m = this;
            m.$emit("change",{
                start:m.min,
                end:m.max,
                long:m.dateLong,
                mounted:true
            });

            m.$watch("start",function(v){
                if(!v)    return
                m.min = mo(v)
            },{immediate:true})

            m.$watch("end",function(v){
                if(!v)    return
                m.max = mo(v)
            },{immediate:true})
        },

        watch: {
            "min":function(v){
                var m = this;

                var min = v;
                if(min._d>=m.max._d) {
                    m.max = min.clone().add(1,"day");
                }

                m.$emit("change",{
                    start:m.min,
                    end:m.max,
                    long:m.dateLong
                });
            },
            "max":function(v){
                var m = this;
                var max = v;
                if(max._d<=m.min._d) {
                    m.min = max.clone().add(-1,"day");
                }
                m.$emit("change",{
                    start:m.min,
                    end:m.max,
                    long:m.dateLong
                });
            }
        },
        computed: {

            dateLong:function(){
                var m = this;
                return m.max.diff(m.min,"day");
            }
        },
        props: {
            start:{
                default(){
                    return new Date()
                }
            },
            end:{
                default(){
                    return new Date(new Date()*1+24*60*60*1000)
                }
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/vars";
    .date-range{
        color: #666666;
        display: flex;
        justify-content: center;
        .long{
            white-space: nowrap;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: 0 1rem;
            span{
                display: inline-block;
                border-bottom: 1px solid @cl_bd_light-2;
            }
        }
        .day-container{
            position: relative;

            .day{
                display: flex;
            }
            .day-number{
                white-space: nowrap;
                display: flex;
                align-items: center;
                font-size: 2rem;
                color: @main-color;
            }
            .m-w-conatainer{
                display: flex;
                flex-direction: column;
                font-size: 0.8rem;
                justify-content: center;
                align-items: center;
            }

            .week-number{
                white-space: nowrap;
            }
        }
    }
</style>
