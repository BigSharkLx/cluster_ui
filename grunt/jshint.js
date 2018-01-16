/**
 * Created by Domoke on 2017/4/11.
 */
/**
 * JSHint Options http://jshint.com/docs/options/
 *
 */
module.exports = {
    angular: ['src/js/controllers/*.js'],
    options: {
        node: true,
        asi: true, //允许省略分号（写上这条，规避检查出很多警告  可以去掉）
        bitwise: true, //禁止使用位运算符，比如经常把&&写错& 规避此错误
        eqeqeq: true, //禁止使用== 和 ！=  强制使用=== 和 ！==
        freeze: true, // 这个选项禁止覆盖本地对象的原型等 数组 , 日期 等等。
        undef: true, //禁止使用不在全局变量列表中的未定义变量
        //curly: true, //循环或者条件语句必须使用花括号包住
        predef: ['angular', 'app', 'alignContainers', 'echarts', 'Mustache'],
        globals: {$:true},
        browser: true, // 暴露浏览器属性的全局变量 如window document
        devel: true, //定义用于调试的全局变量：console,alert
    }
}
