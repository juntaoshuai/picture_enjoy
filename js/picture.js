$(function() {
    //tab选项卡
    jQuery.tab = function(tabs, tabscon, shijian) {
        $(tabscon).children().filter(":not(:first)").hide();
        shijian = shijian || "click";
        $(tabs).children().on(shijian, function() {
            var index = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $(tabscon).children().hide().eq(index).show();
        });
    }

    $.tab("#tabs1", "#tabs-con1");

    //搜索框
    $(".search-txt").focus(function() {
        var $this = $(this);
        if ($this.val() == "请输入您查找的图赏名称") {
            $this.val("");
        }
    }).blur(function() {
        var $this = $(this);
        if ($this.val() == "") {
            $this.val("请输入您查找的图赏名称");
        }
    });


    //圆角
    if ($.browser.msie && $.browser.version < 9) {
        $.getScript("js/PIE.js", function() {
            $('#img-slide .play-bar span').each(function() {
                PIE.attach(this);
            });
            $('#img-slide .play-bar span.active').each(function() {
                PIE.attach(this);
            });  
            
            $('.have-word-say .publish-btn').each(function() {
                PIE.attach(this);
            });  
        });
    }
//评论
//发布按钮
 $(".publish-btn").click(function() {
        var txt = $(".comment-text").val();
        if ($.trim($(".comment-text").val()) == "") {
            alert("评论不能为空");
            return false;
        } else {
            $.post('/index.php?m=reward&c=ajax&a=postComment', { content: txt }, function(data) {
                if (data.code == -10) {
                    common.showPopup(".login-popup",common.showlogin());
                } else {
                    alert(data.message);

                }
                $(".comment-text").val("");

            });
        }

    });

    function loadComment(page) {
        $.post('/index.php?m=reward&c=ajax&a=commentList', { t: Math.random(), page: page }, function(data) {
            var html = "";
            if (data.is_more == 0) {
                $("#more-comment").hide();
            }
            if (data.data.length) {
                $(".comment .c-hd p span").html(data.count);

                $.each(data.data, function(i) {
                    html += '<div class="comment-item">';
                    html += '<div class="comment-level1 clearfix">';
                    html += '<img src="' + common.randomAvator(this.username) + '" class="avator fl">';
                    html += '<div class="comment-item-r">';
                    html += '<p class="nick-name">' + this.username + '</p>';
                    html += '<p class="say-con">' + this.content + '</p>';
                    html += '<div class="opera clearfix">';
                    html += '<span class="comment-time fl">' + this.creat_at + '</span>';
                    html += '<p class="message fr">';
                    html += '<span class="likes" data-id="' + this.id + '"><span class="support-num">' + this.support + '</span><i></i></span>|';
                    html += '<span class="reply-ico" data-id="' + this.id + '"></span>';
                    html += '</p>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    if (this.child) {
                        html += '<div class="comment-level2-wrap">'
                        $.each(this.child, function() {

                            html += '<div class="comment-level2 clearfix">';
                            html += '<img src="' + common.randomAvator(this.username) + '" class="avator fl">'
                            html += '<div class="comment-item-r">'
                            html += '<p class="nick-name">' + this.username + '</p>'

                            html += '<p class="say-con">' + this.content + '</p>';

                            html += '<div class="c-opera clearfix">'
                            html += '<span class="comment-time fl">' + this.creat_at + '</span>';
                            html += '<p class="message">'
                            html += '<span class="reply-word fr"></span>'
                            html += '</p>'
                            html += '</div>'
                            html += '</div>'
                            html += '</div>'
                        });
                        html += '</div>';
                    }

                    html += '</div>';
                });

                 $(".comment").append(html);
            }
        });
    }

    loadComment(1);

    $("#more-comment").click(function() {
        var page = $(this).attr("data-page");
        loadComment(++page);
        $(this).attr("data-page", page);
    });


    //回复
    $(".comment").on('click', '.reply-ico', function() {
        var id = $(this).data("id");
        if ($(this).closest(".comment-level1").next("#reply-form").length) {
            $("#reply-form").remove();
            return;
        }
        $("#reply-form").remove();
        var html = '<form class="clearfix" id="reply-form">\
                            <label class="fl"><img src="' + common.randomAvator() + '"></label>\
                            <textarea class="replytxt fr" placeholder="我想说两句..."></textarea>\
                            <input type="button" id="publish-btn" class="fr" data-id="' + id + '" value="发表">\
                        </form>';
        $(html).insertAfter($(this).closest(".comment-level1")).hide().slideDown();




    });

    $(".comment").on('click', '#publish-btn', function() {
        $.post('/index.php?m=reward&c=ajax&a=postComment', { content: $(".replytxt").val(), id: $(this).data("id") }, function(data) {
            if (data.code == -10) {
                common.showPopup(".login-popup",common.showlogin());
            } else {
                if(data.code==1){
                    alert("回复成功!");
                }else{
                    alert(data.message);
                    
                }
                $("#reply-form").remove();
            }
            $(".replytxt").val("");

        });

    });

    //点赞
    $(".comment").on('click','.likes',function(){
        var $this=$(this),
            $num=$this.find(".support-num");
         $.post('/index.php?m=reward&c=ajax&a=supportComment', {id: $(this).data("id") }, function(data) {
            if(data.code==1){
                $num.html(parseInt($num.html())+1);
            }else{
              alert(data.message);
           }

        });

    })






});
