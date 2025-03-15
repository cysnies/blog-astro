---
author: 白鼠Cysnies
pubDatetime: 2022-12-08T10:25:54.547Z
title: 部署 Cloudflare Argo Tunnel 实现零成本内网穿透
slug: argo-tunnel
featured: false
ogImage: https://p0.meituan.net/csc/fc0a2fe1b9fcae273668faa89cde579a15465.png
tags:
  - 内网穿透
  - Argo Tunnel
  - Cloudflare
description: "一种内网穿透的实现方式。"
---

众所周知，国内的运营商早在十多年前便封锁了家用宽带的 80、443 等端口，因此使用家宽建站需要改用其他端口。这样一来，用户在访问自建网络服务时就必须带端口号访问，不仅会使 URL 繁琐难看，而且有暴露源站引来攻击的风险。使用 Frp 等传统的内网穿透服务是常用的解决方案，但由于政策原因，国内的内网穿透服务只能绑定备案过的域名，况且长期购买稳定的内网穿透服务会是一笔不小的开支。此时，老牌云服务商 Cloudflare 提供的 Argo Tunnel 内网穿透服务就不失为一个好的选择。

> 本文部分内容参考了 [Hajeekn](https://blog.slqwq.cn/2021/posts/fktz6u/index.html) 和 [杰森](https://johnrosen1.com/2022/04/19/cloudflare/) 两位大佬的文章，在此表达感谢。

## 优点

- 完全免费的内网穿透服务
- 无需备案便可绑定域名
- 可免费申请和部署 HTTPS
- 良好的网络攻击防御能力
- 速度尚可，能满足一般中小型网站的需求

## 缺点

- 不支持 UDP 协议
- 服务器位于海外，访问延迟稍高
- 带宽有限，不能满足大流量、高并发的应用场景

## 准备

- 一台具有网络连接的 Linux 服务器（即需要内网穿透的服务所在的宿主机。Windows 系统请参阅 [Hajeekn](https://blog.slqwq.cn/2021/posts/fktz6u/index.html) 大佬的教程）
- 一个托管于 Cloudflare 的域名。如果域名托管在国内云服务商（如 DNSPod、万网 等），则需要修改 NS 记录使其指向 Cloudflare 分配的名称服务器以使用 Cloudflare 进行 DNS 解析。相关教程请参阅 [Cloudflare Docs](https://developers.cloudflare.com/fundamentals/get-started/setup/)

## 流程

### 安装Cloudflared

用于运行 Argo Tunnel 服务的 [Cloudflared](https://github.com/cloudflare/cloudflared/) 开源于 Github，可在 [Releases](https://github.com/cloudflare/cloudflared/releases) 处找到对应平台的二进制文件。

Linux 下使用以下命令来安装 Cloudflared：

```bash
curl -LO https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
dpkg -i cloudflared-linux-amd64.deb
```

### 登录 Cloudflared

```bash
cloudflared tunnel login
```

执行命令后会显示一个 URL，用浏览器打开，登录 Cloudflare 后选择用于内网穿透的域名。

成功后会自动生成证书，存放于`~/cloudflared/cert.pem`中。

### 新建隧道

下方命令里的 <Tunnel-NAME> 为隧道名称，可以随意起。

```bash
cloudflared tunnel create <Tunnel-NAME>
```

成功后会显示隧道的 UUID，同时提示相关凭证已放置于`~/.cloudflared/<Tunnel-UUID>.json`中。

### 新建 Tunnel 对应的 DNS 记录

`<SUBDOMAIN>`填你想用来做内网穿透的域名，可以使用二级域名（example.com）或三级域名（www.example.com） 等。

```bash
cloudflared tunnel route dns <Tunnel-NAME> <SUBDOMAIN>
```

成功后会自动在选定域名下创建指向 Argo Tunnel 内网穿透服务器的 CNAME 记录。

### 建立配置文件

新建 Cloudflared 配置文件

```bash
vim ~/.cloudflared/config.yml
```

写入以下内容并保存

```yaml
tunnel: <Tunnel-UUID>
credentials-file: /root/.cloudflared/<Tunnel-UUID>.json
protocol: h2mux
originRequest:
  connectTimeout: 30s
  noTLSVerify: false
ingress:
  - hostname: <SUBDOMAIN>
    service: http://localhost:80
  - service: http_status:404
```

受限于国内网络环境，无法使用默认的 `quic` 协议建立隧道，因此需指定协议为 `http2` 或 `h2mux`，以及本地服务地址`http://localhost:80`

### 配置 Cloudflared 服务

新建 Cloudflared 服务文件

`vim /etc/systemd/system/cloudflared.service`

写入以下内容并保存

```bash
[Unit]
Description=cloudflared
After=network.target

[Service]
TimeoutStartSec=0
Type=notify
ExecStart=/usr/bin/cloudflared --loglevel debug --transport-loglevel warn --config /root/.cloudflared/config.yml tunnel run <Tunnel-NAME>
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

### 启动 Cloudflared 服务

```bash
systemctl enable cloudflared --now
```

稍等一两分钟后即可通过刚才配置好的域名 `https://<SUBDOMAIN>` 访问你的服务。

## 参考资料

1. [Cloudflare 隧道内网穿透搭建记录](https://johnrosen1.com/2022/04/19/cloudflare/)
2. [Cloudflare 的 Argo Tunnel 使用](https://blog.slqwq.cn/2021/posts/fktz6u/index.html)
3. [Cloudflare Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
4. [Many services, one cloudflared](https://blog.cloudflare.com/many-services-one-cloudflared/)
