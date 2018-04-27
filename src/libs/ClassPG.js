import _ from "lodash"

var Class_PG = (function(config){
    var PG;

    var def = {

        size:10,
        /**
         * 第一页的时候
         */
        onBof:_.noop,

        /**
         * 最后一页
         */
        onEofStatusChange:_.noop,

        onReset:_.noop,

        pageField:"pageNum",

        sizeField:"pageSize",

        /**
         * 设置总共多少条
         */
        itemCount:Math.pow(2,53)-1,

    }

    PG = function(config){this.init(config) }
    PG . prototype = {
        init:function(config){
            var m = this;
            m._addData = {};
            m.sett = _.merge({},def,config);
            m.reset("init");
        },

        /**
         * 是否到末尾
         * @returns {boolean}
         */
        isEof:function(){
            var m = this;
            return m._eof;
        },

        /**
         * 重置当前页|初始化变量
         */
        reset:function(form){
            var m = this;
            m._index = 0;
            m._total = 1;
            m._eof = false;
            m.sett.onEofStatusChange(true);
            m.setItemCount(m.sett.itemCount);
            //不是在初始化中调用
            if(form!="init") {
                m.sett.onReset();
            }
        },

        /**
         * 步进，翻到下一页
         */
        step:function(){
            var m = this;
            if(m._index >= m._total -1) {
                m._eof = true;
                m.sett.onEofStatusChange(true);
            }else{
                m.sett.onEofStatusChange(false);
                m._index ++;
            }
        },


        /**
         * 强制eof
         */
        forceEof:function(){
            var m = this;
            m._eof = true;
            m.sett.onEofStatusChange(true);
        },


        /**
         * 设置条目总数
         * @param n
         */
        setItemCount:function(n){
            var m = this;
            var total = parseInt((n-1)/m.sett.size) + 1;
            m._total = total;

            if(m._index >= m._total -1) {
                m._eof = true;
                m.sett.onEofStatusChange(true);
            }else{
                m._eof = false;
                m.sett.onEofStatusChange(false);
            }
        },

        /**
         * 设置或者获取页码
         * @param page
         * @returns {*}
         */
        page:function(page){
            var m = this;
            if(page === undefined) {
                return m._index + 1;
            }else{
                if(page>=m._total-1) {
                    m._eof = true;
                    m.sett.onEofStatusChange(true);
                    page = m._total-1;
                }else{
                    m._eof = false;
                    m.sett.onEofStatusChange(false);
                }
                m._index = page - 1;
            }
        },

        /**
         * 获取分页参数
         * @returns {{}|*}
         */
        getPara:function(para){
            var m = this;
            var ac = m._addData;
            if(!ac.pa) {
                ac.pa = {};
            }
            ac.pa[m.sett.pageField] = m.page();
            ac.pa[m.sett.sizeField] = m.sett.size;

            if(para) {
                return _.merge(para,ac.pa);
            }else{
                return ac.pa;
            }
        }

    };
    return PG;
})()

export default Class_PG;
