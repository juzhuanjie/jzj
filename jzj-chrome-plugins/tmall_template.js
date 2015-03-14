{
    "pretreatment": [
        {
            "url": "http://www.tmall.com/", 
            "desc": "搜索商品，关键字【@keyword】", 
            "define": "", 
            "script": "keywork = \"@keyword\";$(\"input#mq\").val(keywork);$(\"form.mallSearch-form button:submit\").click(function(){ callback({status:STATUS.UNKNOW});}).click();"
        }, 
        {
            "url": "#", 
            "desc": "选择类别【@category】", 
            "define": "", 
            "script": "category = \"@category\";$(\"a[title^='\" + category + \"']\").click(function(){ callback({status:STATUS.UNKNOW});}).get(0).click();"
        }, 
        {
            "url": "#", 
            "desc": "设定价格范围【@minprice】-【@maxprice】", 
            "define": "", 
            "script": "startPrice = @minprice;endPrice = @maxprice;if(startPrice>=0){ $(\"input[name='start_price']\").val(startPrice);}if(startPrice > 0){ $(\"input[name='end_price']\").val(endPrice);}$(\"#J_FPEnter\").click(function(){ callback({status:STATUS.UNKNOW});}).get(0).click();"
        }, 
        {
            "url": "#", 
            "desc": "随机访问4个商品，浏览时间大概3分钟", 
            "define": "", 
            "script": "var p = $(\"p.productTitle a\");p.each(function(){ $(this).attr(\"target\", \"_blank\");});var json = {};var jsList = [];var list = getRandom(p,4);for(var i=0; i<list.length; i++){ p.get(list[i]).click(); jsList.push(p.eq(list[i]).attr(\"href\"));sleep(3*(i+1));}json.url = jsList;run(5);"
        }, 
        {
            "url": "#", 
            "desc": "打开指定商品浏览，浏览时间大概3分钟", 
            "define": "", 
            "script": "var real_url = \"@productUrl\";callback({status:STATUS.UNKNOW});window.location.href = real_url;"
        }, 
        {
            "url": "#", 
            "desc": "进入店家店铺", 
            "define": "", 
            "script": "$(\"a.enterShop\").removeAttr(\"target\");$(\"a.enterShop\").click(function(){ sleep(8);callback({status:STATUS.UNKNOW});}).get(0).click();"
        }, 
        {
            "url": "http://@shopName.tmall.com/search.htm?spm=a1z10.5-b.w5842-9363500331.1.qThoFI&search=y", 
            "desc": "打开店内商品列表页", 
            "define": "", 
            "script": "/*$(\"div.navs a.navlist3\").removeAttr(\"target\");$(\"div.navs a.navlist3\").click(function(){ callback({status:STATUS.UNKNOW});}).get(0).click();*/"
        }, 
        {
            "url": "#", 
            "desc": "随机打开4个商品，浏览时间大概4分钟", 
            "define": "", 
            "script": "var p = $(\"a.item-name\");p.each(function(){ $(this).attr(\"target\", \"_blank\");});var json = {};var jsList = [];var list = getRandom(p,4);for(var i=0; i<list.length; i++){ p.get(list[i]).click(); jsList.push(p.eq(list[i]).attr(\"href\"));sleep(3*(i+1));}json.url = jsList;go(9);"
        }, 
        {
            "url": "#", 
            "desc": "购物流程已暂停。需要人工介入，请跟客服聊天，聊天完毕之后，请点击继续按钮，流程继续。", 
            "define": "", 
            "script": "pause(\"在线客服聊天\");"
        }
    ], 
    "product": [
        {
            "url": "@productUrl", 
            "desc": "打开要购买的商品", 
            "define": "", 
            "script": "document.cookie = \"cart=\" + $(\"a.sn-cart-link\").text().replace(/[^\\d]/g, \"\") + \";\";$(\"div.tb-btn-basket a\").click(function(){ callback({status:STATUS.UNKNOW,delay:5000});}).get(0).click();"
        }, 
        {
            "url": "#", 
            "desc": "加入购物车", 
            "define": "", 
            "script": "var list = document.cookie.split(\";\");for(var i=0; i<list.length; i++){ var str = list[i].split(\"=\"); if(str[0].replace(/(^\\s)*|(\\s$)*/g, \"\") == \"cart\"){ if($(\"a.sn-cart-link\").text().replace(/[^\\d]/g, \"\") > str[1].replace(/(^\\s)*|(\\s$)*/g, \"\")){ callback({status:STATUS.UNKNOW}); }else{ callback({status:STATUS.FAIL}); } }}"
        }
    ], 
    "steps": [
        {
            "url": "http://cart.tmall.com/cart.htm", 
            "desc": "查看购物车，准备结算。", 
            "define": "", 
            "script": "$(\"input.J_CheckBoxItem\").first().click();$.wait(function(){ return $(\"#J_Go\").is(\":enabled\"); }).done(function(){ $(\"#J_Go\").click(function(){ callback({statue:STATUS.UNKNOW}); }).get(0).click();}).fail(function(){ callback({status:STATUS.FAIL,message:\"Wait timeout\"});});"
        }, 
        {
            "url": "#", 
            "desc": "提交订单。", 
            "define": "", 
            "script": "$.wait(function(){return $(\"#J_Go\").is(\":enabled\"); }).done(function(){ $(\"#J_Go\").click(function(){ callback({statue:STATUS.UNKNOW}); }).get(0).click();}).fail(function(){callback({status:STATUS.FAIL,message:\"Wait timeout\"});});"
        }, 
        {
            "url": "#", 
            "desc": "购物流程已暂停。需要人工介入，请支付，支付完成后，请点击继续，流程自动结束完成。", 
            "define": "", 
            "script": "pause(\"支付\");"
        }
    ], 
    "local": "function getRandom(e,n){ var list = []; if(e.length < n){ n = e.length; } while(list.length < n){ var bl = true; var r = Math.floor(Math.random() * e.length); for(var i=0; i<list.length; i++){ if(list[i] == r){ bl = false; } } if(bl){ list.push(r); } } return list;}", 
    "flowDesc": [
        {
            "index": "0", 
            "desc": "搜索商品"
        }, 
        {
            "index": "1", 
            "desc": "按类别筛选商品"
        }, 
        {
            "index": "2", 
            "desc": "按价格筛选商品"
        }, 
        {
            "index": "3", 
            "desc": "随机浏览4个商品"
        }, 
        {
            "index": "4", 
            "desc": "浏览商品"
        }, 
        {
            "index": "5", 
            "desc": "进入店铺"
        }, 
        {
            "index": "6", 
            "desc": "打开店内商品列表页"
        }, 
        {
            "index": "7", 
            "desc": "随机浏览4个商品"
        }, 
        {
            "index": "8", 
            "desc": "在线客服聊天"
        }, 
        {
            "index": "9", 
            "desc": "添加购物车"
        }, 
        {
            "index": "10", 
            "desc": "查看购物车"
        }, 
        {
            "index": "11", 
            "desc": "提交订单"
        }, 
        {
            "index": "12", 
            "desc": "支付"
        }
    ]
}

