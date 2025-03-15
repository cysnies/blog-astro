---
author: 白鼠Cysnies
pubDatetime: 2023-10-01T10:25:54.547Z
title: 通过 NodeInject 和 Yporaject 激活 Typora
slug: typora-crack
featured: false
ogImage: https://z1.ax1x.com/2023/10/01/pPqb7Of.jpg
tags:
  - Typora
  - Crack
  - Rust
description: "一种激活 Typora 的方式。"
---

众所周知，Typora 是一款非常优秀的 Markdown 编辑器，而我日常撰写博文使用的也正是 Typora。然而，正版 Typora 高达 89 元的售价让不少像我这样的学生党望而却步，不得不通过其他技术手段来使用 Typora。

但是，在互联网上公开的破解手段中，大多数都是采用对 Typora 加密的核心 js 进行修改或直接 Patch 二进制的方式实现绕过授权校验的。这些方案当然可行，但仍存在版本针对性强、侵入性高等诸多缺陷。

在这种情况下，吾爱破解论坛的 [hlrlqy](https://www.52pojie.cn/home.php?mod=space&uid=300010) 大佬提出的 [通过对Node.js的相关实现进行Hook从而修改数据的方法](https://www.52pojie.cn/thread-1710146-1-1.html) 就成为了更加理想的破解方式。

本文仅记录我使用这一项目的过程，仍然**强烈推荐有经济能力的朋友 [支持正版](https://lizhi.shop/site/products/id/520)。**

用于进行注入的 [NodeInject ](https://github.com/DiamondHunters/NodeInject) 项目和用于生成 License Key 的 [NodeInject_Hook_example ](https://github.com/DiamondHunters/NodeInject_Hook_example)项目是这一方案的 Rust 实现。由 [hazukieq](https://github.com/hazukieq) 大佬 Fork 的版本 [Yporaject](https://github.com/hazukieq/Yporaject) 合并了上述两个项目并撰写了详细的教程。在此对二位大佬的所做的工作表示感谢。

注意：

1.根据 [Yporaject 项目的说明](https://github.com/hazukieq/Yporaject/blob/master/README.md)，由于 Typora 在 MacOS 上的打包方法和运行环境与其他平台存在差异，该方案**仅适用于 Windows 和 Linux 系统**。

2.由于 **Yporaject 与原项目代码不同步**，可能因为代码滞后导致对 Typora 的更新版本失效。如果遇到此问题，请查看 [NodeInject ](https://github.com/DiamondHunters/NodeInject)项目和 [NodeInject_Hook_example ](https://github.com/DiamondHunters/NodeInject_Hook_example) 项目。

### 环境信息

Manjaro Linux （Linux Kernel 6.5.3-1-MANGARO x64）

Windows 10 IoT 企业版 LTSC 21H2 （19044.3448）

cargo 1.72.1 (103a7ff2e 2023-08-15)

Typora 1.7.5

### 配置 Rust 编译环境

Linux：

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Windows：

参照 [官方教程](https://www.rust-lang.org/zh-CN/tools/install) 使用 `Rustup` 安装。

### 安装官方版 Typora

Linux：

```
flatpak install io.typora.Typora
```

Linux 下的其他安装方法详见 [Typora官网](https://typoraio.cn/#linux)。

Windows：官网下载 [安装包](https://download2.typoraio.cn/windows/typora-setup-x64.exe) 后直接安装。

### 克隆 Yporaject 项目

```
git clone https://github.com/hazukieq/Yporaject.git --depth=1
```

> 如果在克隆项目时遇到网络问题，可以使用 gitclone.com 提供的镜像加速：
>
> ```
> git clone https://gitclone.com/github.com/hazukieq/Yporaject.git --depth=1
> ```
>
> 也可以使用
> 
> ```
> git config --global http.proxy/https.proxy
> ```
> 
> 来为 Git 手动设置代理，本文不再赘述。

### 编译 Yporaject 项目

下面的命令适用于  Bash，Windows Powershell 需要略作调整。

```
# 进入 Yporaject 项目
cd Yporaject
# 运行编译命令
cargo build
# 查看二进制是否生成,程序名称为 node_inject
ls target/debug
```

### 复制二进制程序到安装目录下

```
# 记录当前目录路径
cur=`pwd`
# 复制二进制程序到相关目录下
sudo cp target/debug/node_inject /usr/share/typora
# 进入相关目录
cd /usr/share/typora
# 给予二进制程序执行权限
sudo chmod +x node_inject
# 运行二进制程序,请注意程序运行输出信息
sudo ./node_inject
```

### 获取 License Key

```
# 返回项目
cd $cur
# 进入 license-gen 文件夹
cd license-gen
# 编译代码
cargo build
# 运行二进制程序
cargo run
```

你将会得到下面这样的输出：

```
Finished dev [unoptimized + debuginfo] target(s) in 0.00s
Running `target/debug/license-gen`
License for you: xxxxxx-xxxxxx-xxxxxx-xxxxxx
```

复制 License for you 后面的那一串序列号备用。

### 激活 Typora

```
#运行 Typora (或直接在桌面上点击程序图标)
typora &
```

依次点击界面上方菜单栏的 `帮助 > 我的许可证...(Help > My license)` 打开激活界面，然后输入激活邮箱（可以任意填写）和上面复制的序列码。

如果遇到网络问题导致的“序列码激活软件失败，连接不上服务器”，可以在 `偏好设置 > 通用` 中勾选 **“使用 Typora 国内服务器”**。如果问题仍然没有解决，可以挂代理后使用国外激活服务器（不勾选 “使用 Typora 国内服务器”）重试。

### 参考资料

1.[[Linux/Windows]Typora 理论多版本兼容破解方案](https://www.52pojie.cn/thread-1710146-1-1.html)

2.[Typora最新版激发（Ubuntu）](https://zhuanlan.zhihu.com/p/636193675)