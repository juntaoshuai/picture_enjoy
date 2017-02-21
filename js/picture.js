$(function(){
    //tab选项卡
jQuery.tab=function(tabs,tabscon,shijian){
     $(tabscon).children().filter(":not(:first)").hide();
    shijian=shijian || "click";
   $(tabs).children().on(shijian,function(){
      var index=$(this).index();
      $(this).addClass('active').siblings().removeClass('active');
      $(tabscon).children().hide().eq(index).show();   
    });
}   

$.tab("#tabs1","#tabs-con1");

//搜索框
$(".search-txt").focus(function(){
    var $this=$(this);
    if($this.val()=="请输入您查找的图赏名称"){
        $this.val("");
    }
}).blur(function(){
    var $this=$(this);
    if($this.val()==""){
        $this.val("请输入您查找的图赏名称");
    }
});


});