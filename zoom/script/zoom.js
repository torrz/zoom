/**
 * Created by Home on 2015/9/23.
 */
var t;
var windowView;
var isRight = true;
var speedtime = 10;
var speed = 2;

$(document).ready(function () {

    var mouseX = 0;		//鼠标移动的位置X
    var mouseY = 0;		//鼠标移动的位置Y
    var maxLeft = 0;	//最右边
    var maxTop = 0;		//最下边
    var markLeft = 0;	//放大镜移动的左部距离
    var markTop = 0;	//放大镜移动的顶部距离
    var perX = 0;	//移动的X百分比
    var perY = 0;	//移动的Y百分比
    var bigLeft = 0;	//大图要移动left的距离
    var bigTop = 0;		//大图要移动top的距离

    //放大镜代码开始
    //改变放大镜的位置
    function updataMark($mark) {
        //通过判断，让小框只能在小图区域中移动
        if (markLeft < 0) {
            markLeft = 0;
        } else if (markLeft > maxLeft) {
            markLeft = maxLeft;
        }


        if (markTop < 0) {
            markTop = 0;
        } else if (markTop > maxTop) {
            markTop = maxTop;
        }

        //获取放大镜的移动比例，即这个小框在区域中移动的比例
        perX = markLeft / $(".imgShow").outerWidth();
        perY = markTop / $(".imgShow").outerHeight();

        bigLeft = -perX * $(".big").outerWidth();
        bigTop = -perY * $(".big").outerHeight();
        //设定小框的位置
        $mark.css({ "left": markLeft, "top": markTop, "display": "block" });
    }

    //改变大图的位置
    function updataBig() {
        $(".big").css({ "display": "block", "left": bigLeft, "top": bigTop });
    }

    //鼠标移出时
    function cancle() {
        $(".big").css({ "display": "none" });
        $(".mark").css({ "display": "none" });
    }

    //鼠标小图上移动时
    function imgMouseMove(event) {

        var $this = $(this);
        var $mark = $(this).children(".mark");

        //鼠标在小图的位置
        mouseX = event.pageX - $this.offset().left - $mark.outerWidth() / 2;
        mouseY = event.pageY - $this.offset().top - $mark.outerHeight() / 2;

        //最大值
        maxLeft = $this.width() - $mark.outerWidth();
        maxTop = $this.height() - $mark.outerHeight();
        markLeft = mouseX;
        markTop = mouseY;

        updataMark($mark);
        updataBig();
    }

    $(".small").bind("mousemove", imgMouseMove).bind("mouseleave", cancle);
    //放大镜代码结束


    //底部工具代码
    var leftBtn = $("#leftBtn");
    var rightBtn = $("#rightBtn");
    windowView = $(".Window");

    var imgCount = $(".imageContainer img").length;//图片个数
    var imgContainer = $(".imageContainer");

    var windowwidth = parseInt($(".Window").css("width"));

    var containerWidth = imgCount * 75;//设置图片窗口宽度
    //console.log(windowwidth, containerWidth);
    imgContainer.css("width", containerWidth + "px");

    /*当图片容器宽度少于窗口宽度的时候，隐藏滚动图标*/
    if (containerWidth < windowwidth) {
        $("#leftBtn").css("opacity", 0);
        $("#rightBtn").css("opacity", 0);
    }

    //为图片绑定mouseenter事件
    for (var count = 0; count <= imgCount - 1; count++) {
        $(".imageContainer img:eq(" + count + ")").mouseenter(function () {
            var imgSrc = $(this).attr("src");
            $(".imgShow img").attr("src", imgSrc);
            $(".big img").attr("src", imgSrc);
        });
    }


    //点击图片展示大图,原始尺寸
    $(".mark").click(function () {
        var src = $(".imgShow img").attr("src");
        /*console.log(src);*/
        var bigImg = $("<img>").addClass("bigImgShow").attr("src", src);

        $(".mask").css({ "display": "block", "opacity": 0.5 });
        $("body").append(bigImg);
        $(".bigImgShow").animate({ opacity: "1" });
    });

    //点击遮罩层 大图和遮罩层消失
    $(".mask").click(function () {
        $(".bigImgShow").animate({
            opacity: '0',
            height: '0',
            width: '0'
        }, "fast", function () {
            $(".bigImgShow").remove();
            $(".mask").animate({ opacity: '0' }, "fast", function () {
                $(".mask").css("display", "none");
            });
        });

    });

    leftBtn.hover(
        function () {
            isRight = false;
            scorllMove();
        },
        function () {
            clearTimeout(t);
        });
    rightBtn.hover(
        function () {
            isRight = true;
            scorllMove();
        },
        function () {
            clearTimeout(t);
        });
});

function scorllMove() {
    var i = windowView[0].scrollLeft;
    /*console.log(i);*/
    if (isRight) {
        windowView[0].scrollLeft += speed;
    }
    else {
        windowView[0].scrollLeft -= speed;
    }
    t = setTimeout("scorllMove()", speedtime);
}

