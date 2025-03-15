---
author: 白鼠Cysnies
pubDatetime: 2023-11-05T10:25:54.547Z
title: 轻松解除网页复制与粘贴限制
slug: copy-and-paste
featured: false
ogImage: https://z1.ax1x.com/2023/11/05/piQ6pn0.jpg
tags:
  - Web
  - JavaScript
  - Console
description: "简单分享几种常用的解除网页复制粘贴限制的方法。"
---

简单分享几种常用的解除网页复制粘贴限制的方法。

## 通用方法——禁用 JavaScript

部分网站通过简单禁用 JavaScript 即可解除复制或者粘贴限制。

PC端以 Chrome 为例，在开发者工具中的 `Settings—Preferences`（快捷键为 `F12 `& `F1`）里的 `Debugger` 区域内勾选 `Disable JavaScript` 选项即可。

Tips: 用完记得关掉。

## 解除复制限制

### 小书签法（推荐）

通过浏览器书签在页面内执行 JavaScript 代码进而解除限制。

在浏览器内新建书签后将 URL 改为下面的 JavaScript 代码并保存。在需要解除复制限制的网页中点击该书签即可解除限制。

```javascript
javascript:(function(bookmarklets)%7Bfor(var i=0;i<bookmarklets.length;i++)%7Bvar code=bookmarklets%5Bi%5D.url;if(code.indexOf("javascript:")!=-1)%7Bcode=code.replace("javascript:","");eval(code)%7Delse%7Bcode=code.replace(/%5Es+%7Cs+$/g,"");if(code.length>0)%7Bwindow.open(code)%7D%7D%7D%7D)(%5B%7Btitle:"破除右键菜单限制",url:"javascript:function applyWin(a)%7Bif(typeof a.__nnANTImm__===%5Cx22undefined%5Cx22)%7Ba.__nnANTImm__=%7B%7D;a.__nnANTImm__.evts=%5B%5Cx22mousedown%5Cx22,%5Cx22mousemove%5Cx22,%5Cx22copy%5Cx22,%5Cx22contextmenu%5Cx22%5D;a.__nnANTImm__.initANTI=function()%7Ba.__nnantiflag__=true;a.__nnANTImm__.evts.forEach(function(c,b,d)%7Ba.addEventListener(c,this.fnANTI,true)%7D,a.__nnANTImm__)%7D;a.__nnANTImm__.clearANTI=function()%7Bdelete a.__nnantiflag__;a.__nnANTImm__.evts.forEach(function(c,b,d)%7Ba.removeEventListener(c,this.fnANTI,true)%7D,a.__nnANTImm__);delete a.__nnANTImm__%7D;a.__nnANTImm__.fnANTI=function(b)%7Bb.stopPropagation();return true%7D;a.addEventListener(%5Cx22unload%5Cx22,function(b)%7Ba.removeEventListener(%5Cx22unload%5Cx22,arguments.callee,false);if(a.__nnantiflag__===true)%7Ba.__nnANTImm__.clearANTI()%7D%7D,false)%7Da.__nnantiflag__===true?a.__nnANTImm__.clearANTI():a.__nnANTImm__.initANTI()%7DapplyWin(top);var fs=top.document.querySelectorAll(%5Cx22frame, iframe%5Cx22);for(var i=0,len=fs.length;i<len;i++)%7Bvar win=fs%5Bi%5D.contentWindow;try%7Bwin.document%7Dcatch(ex)%7Bcontinue%7DapplyWin(fs%5Bi%5D.contentWindow)%7D;void 0;"%7D,%7Btitle:"破除选择复制限制",url:"javascript:(function()%7Bvar doc=document;var bd=doc.body;bd.onselectstart=bd.oncopy=bd.onpaste=bd.onkeydown=bd.oncontextmenu=bd.onmousemove=bd.onselectstart=bd.ondragstart=doc.onselectstart=doc.oncopy=doc.onpaste=doc.onkeydown=doc.oncontextmenu=null;doc.onselectstart=doc.oncontextmenu=doc.onmousedown=doc.onkeydown=function ()%7Breturn true;%7D;with(document.wrappedJSObject%7C%7Cdocument)%7Bonmouseup=null;onmousedown=null;oncontextmenu=null;%7Dvar arAllElements=document.getElementsByTagName(%5Cx27*%5Cx27);for(var i=arAllElements.length-1;i>=0;i--)%7Bvar elmOne=arAllElements;with(elmOne.wrappedJSObject%7C%7CelmOne)%7Bonmouseup=null;onmousedown=null;%7D%7Dvar head=document.getElementsByTagName(%5Cx27head%5Cx27)%5B0%5D;if(head)%7Bvar style=document.createElement(%5Cx27style%5Cx27);style.type=%5Cx27text/css%5Cx27;style.innerHTML=%5Cx22html,*%7B-moz-user-select:auto!important;%7D%5Cx22;head.appendChild(style);%7Dvoid(0);%7D)();"%7D%5D)
```

*注：此段代码来自 [奔跑中的奶酪](https://www.runningcheese.com/) 大佬的博客。也可自行搜索使用其他具有相同效果的代码。*

### Console 调试法（推荐）

在开发者工具（F12）的 Console（控制台）内粘贴如下代码后回车执行即可解除大部分网页的复制限制。下列代码中任选其一即可。

#### 代码一

```
document.oncopy=function(){
event.returnValue=true;
};
document.onselectstart=function(){
event.returnValue=true;
};
document.oncontextmenu=function(){
event.returnValue=true;
}; 
```

#### 代码二

```
document.write($("#contentText").html().replace(new RegExp("script","gi"),""));
```

### 脚本/扩展法（推荐）

浏览器安装油猴/暴力猴等脚本管理器后到 Greasy Fork 等平台下载安装 [Remove web limits(modified)](https://greasyfork.org/en/scripts/28497-%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4-%E6%94%B9) 等脚本。

或自行查找适配所用浏览器的相应浏览器扩展。譬如适配 Chromium 系的 [Simple Allow Copy](https://microsoftedge.microsoft.com/addons/detail/simple-allow-copy/kgbbdjcmpohcaenffbhklfclogghhodm?url=hot.copypasteads.com%2Fgirls) 和 [SuperCopy 超级复制](https://microsoftedge.microsoft.com/addons/detail/supercopy-%E8%B6%85%E7%BA%A7%E5%A4%8D%E5%88%B6/knfljblelkpjabapdbcgocjaolkfpklp?hl=zh-CN) 以及适配 Firefox 的 [Absolute Enable Right Click & Copy](https://addons.mozilla.org/zh-CN/firefox/addon/absolute-enable-right-click/)。

### 删除事件监听器法（推荐）

打开开发者工具（F12），点击“选取页面中的元素”按钮（或快捷键 Ctrl+Shift+C），找到源文本所在的页面元素，单击选中。然后打开右侧的事件监听器（Event Listeners）选项卡，找到对应的 copy 事件，右键选择 Remove 即可。

### 保存/打印网页法

在浏览器内将网页保存为本地文件，然后打开复制。推荐搭配 [SingleFile](https://github.com/gildas-lormeau/SingleFile) 扩展使用

或在浏览器内按 Ctrl+P 调用浏览器的网页打印功能，将网页转换为 PDF 文件后再复制。

### OCR 识别法

截图后通过 OCR 识别所需文本。在某些情况下不失为一种解决方案。

QQ自带的文字识别和白描网页版都可以一试。

### OLE 拖放法

选中要复制的文本后直接拖动到记事本等文本编辑器中，通过 OLE 获取源文本。该方法平台依赖性较大，适用范围窄，不推荐。

### 源代码查看法

#### 方法一（推荐）

在开发者工具（F12）的 Console（控制台）中粘贴下面的代码后回车运行。代码运行后会以控制台输出的方式打印页面中的文字，复制控制台输出即可。

```
var a = document.getElementsByTagName('p');
for(var i=0;i<a.length;i++){console.log(a[i].innerText)};
```

#### 方法二

浏览器内右键空白区域选择“查看网页源代码”（或快捷键 Ctrl+P），在 HTML 源代码页面中使用 Ctrl+F 查找需要复制的内容。

### 切换内核法

将浏览器切换为 IE 内核。对某些在 IE 模式下能正常加载内容的网页可能有效。不推荐。

### 搜索引擎快照法

在百度等搜索引擎中搜索该网页，找到并打开搜索引擎生成的相应网页快照，在网页快照页面中复制所需文本。不推荐。

## 解除粘贴限制

### 删除事件监听器法（推荐）

同上所述，选中相应输入框元素后在事件监听器（Event Listeners）选项卡中找到对应的 Paste 事件，右键 Remove 即可。

## 参考

[【总结】解除网页文本禁止复制限制的六种方法](https://www.zhihu.com/tardis/sogou/art/370708102)

[解除网页复制限制的几种方法](https://blog.csdn.net/tonglingtou1875/article/details/111993444)

[网页内容禁止复制怎么办？教你8种方法轻松搞定，全网最全！](https://cloud.tencent.com/developer/news/483965)

[秘技 | 一个小书签，帮你解除网页禁止复制和右键限制的问题](https://zhuanlan.zhihu.com/p/165647416)

[网页解除复制粘贴限制的一些小技巧](https://www.zwn2001.space/posts/%E7%BD%91%E9%A1%B5%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%E7%9A%84%E4%B8%80%E4%BA%9B%E5%B0%8F%E6%8A%80%E5%B7%A7)