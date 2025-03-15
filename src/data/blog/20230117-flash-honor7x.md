---
author: 白鼠Cysnies
pubDatetime: 2023-01-17T10:25:54.547Z
title: 辞旧迎新——荣耀畅玩 7X（BND-AL10）刷机手记
slug: honor7x-flash
featured: false
ogImage: https://m.360buyimg.com/babel/jfs/t1/221156/11/14683/669884/63c69b14Fb5763414/3d20dbd73169c90d.jpg
tags:
  - Android
  - Flashing
  - Unlock
  - Honor 7X
  - Huawei
description: "刷机过程的简单记录。"
---

>由于系统崩坏等一系列原因，我在春节前夕准备彻底告别伴随我两年之久的旧的原厂系统。本文简单记录了我的刷机过程。

## 刷入原厂固件

### 备份数据

>**数据无价，备份数据是刷机前的首要准备工作。**

### 获取固件和TWRP Recovery

>如无必要，**强烈不建议使用奇兔刷机等刷机工具提供的固件以及一键刷机服务。**

如果想继续使用国行版系统的话，可以通过华为手机助手的升级或降级操作下载原厂固件。其下载的固件一般存储在 `C:\Users\用户名\Documents\HiSuite\ROM` 目录下。

但我此次想要尝鲜国际版固件，因此需要手动寻找匹配的固件。

在 Google 上以 `BND-AL10 firmware stock` 为关键字搜索，成功找到[所需固件](https://firmwarefile.com/honor-7x-bnd-al10)。

`Honor_7X_BND-AL10_9.1.0.140_C675E2R1P1T8_Firmware_9.0.0_R3_EMUI9.1.0_05015DEE_Dload.zip`

由文件名可知该固件为原厂固件，系统版本为 EMUI9.1（Android9.0），国家地区代码为 `C675`，[查表](https://onfix.cn/course/3836) 后确认为印度版固件，自带完整的 Google 服务。

在 [XDA论坛](https://forum.xda-developers.com/) 上以 `BND-AL10 TWRP` 为关键字搜索得到 [该机型的TWRP Recovery文件](https://forum.xda-developers.com/t/compilation-firmware-flash-emui-8-0-0-honor-7x-all-models.3833875/)。

>**该 Recovery 仅适配 Honor 7X 的出厂系统 EMUI 8.0.0，如果后续通过 OTA 升级到 EMUI 9.0/9.1，需要先通过华为手机助手降级到 EMUI 8.0.0，然后再刷入 TWRP Recovery。**

### 解锁 Bootloader

鉴于华为官方早在 2018 年就关闭了官方获取 Bootloader 解锁码的通道，现在只能通过非官方途径解锁 Bootloader。此处建议通过淘宝等平台远程租用猎人加密狗等工具进行解锁。如果对自己没有信心，也可以直接购买第三方解锁服务，但价格会高出不少。

我的设备已经解锁了 Bootloader，因此本次刷机无需进行这一步。

>**解锁 Bootloader 时会清除个人数据，请务必做好备份工作！**

### 刷入 TWRP Recovery

1. 在设备的开发者选项中启用 USB 调试，连接电脑后在手机弹出的对话框中授权 USB 调试。
2. 打开 adb 命令行，确认设备连接状态。
   ```
   adb devices
   ```
3. 通过 adb 重启设备到 fastboot 模式
   ```
   adb reboot fastboot
   ```
4. 刷入 TWRP
   ```
   fastboot flash recovery [TWRP 镜像文件的位置]
   ```
5. 重启设备
   ```
   fastboot reboot
   ```

### 刷入固件

1. 解压出固件中的卡刷包 `/Firmware/dload/update_sd.zip`。
2. 通过 adb 推送刷机包到设备存储。
   ```
   adb push [卡刷包的完整路径] /sdcard
   ```
3. 通过 adb 重启设备进入 TWRP Recovery
   ```
   adb reboot recovery
   ```
4. 在 TWRP 中进入 `安装` 界面，选中刚才推送的卡刷包，勾选 `完成后重启`，滑动滑块确认安装。
5. 等待安装完成，之后设备会自动重启进入新系统。

## 刷入 Magisk

### 修补 RAMDISK

1. 从卡刷包 `update_sd.zip` 中解压出 `UPDATE.APP` 文件。
2. 下载 `HuaweiUpdateExtractor` 并打开，在`Settings`选项卡中取消勾选`Verify header checksum`。
3. 将刚才解压得到的 `UPDATE.APP` 文件拖动到程序窗口中，找到 `RECOVERY_RAMDIS.img`，右键导出。
4. 使用 adb 将刚才导出的文件推送到设备存储。
   ```
   adb push [RECOVERY_RAMDIS.img的位置] /sdcard
   ```
5. 在设备上安装 `Magisk Manager`，点击`安装——安装到 Recovery——选择并修补一个文件`，然后选中刚才推送到设备存储中的 `RECOVERY_RAMDIS.img`，等待文件修补完成。
6. 文件修补完成后，将设备存储 `Downloads` 目录下生成的以 `magisk_patched` 为文件名开头的文件复制到电脑上。

### 刷入修补后的 RAMDISK

1. 使用 adb 重启到 fastboot 模式。
   ```
   adb reboot fastboot
   ```
2. 在 fastboot 模式下刷入修补后的 ramdisk 文件。
   ```
   fastboot flash recovery_ramdisk [magisk_patched-xxx.img 文件的位置]
   ```
3. 刷入完成后重启手机到正常系统。
   ```
   fastboot reboot
   ```
4. 在正常系统中通过 adb 重启到 Recovery。
   ```
   adb reboot recovery
   ```
>**此时的 Recovery 分区已经刷入了 Magisk，执行此命令后将进入带有 Magisk 环境的系统，而不是先前的 TWRP Recovery。**

5. 进入系统后打开 Magisk Manager，点击`安装——安装到 Recovery——直接安装（推荐）`，等待 Magisk 安装完成后重启手机，自动进入带有 Magisk 的系统。

>以这种方式安装的 Magisk 位于 Recovery 分区内，需要从 Recovery 分区引导启动系统。由于 Magisk和 Recovery 都在同一个分区，因此进入系统或 Recovery 取决于开机时按下音量键时间的长短。即：
>
>正常开机——进入到不含 Magisk 的系统；
>
>同时按下音量 + 键和电源键开机——第一屏出现——放开所有按键——进入到启用 Magisk 的系统；
>
>同时按下音量 + 键和电源键开机——第一屏出现——继续按音量+键——进入 Recovery。
>
>但是，由于 Magisk App 此时已经了解设备的状态，因此可以直接在 Magisk App 中普通重启到启用Magisk 的系统。

## 刷入 LSPosed

1. 在 Magisk Manager 的设置中启用 Zygisk 并重启。
2. 从 LSPosed 的 [官方仓库](https://github.com/LSPosed/LSPosed/releases) 中下载基于 Zygisk 的 LSPosed 模块压缩包（`LSPosed-xxx-xxxx-zygisk-release.zip`）。
3. 在 Magisk 中安装模块，重启后即可使用 LSPosed。

## 参考文章

[[新手必看]华为刷机你一定要知道的 - 某贼](https://zhuanlan.zhihu.com/p/416456337)

[华为EMUI、HarmonyOS 系统ROOT安装Magisk(面具) - 东山海岛](https://www.bilibili.com/read/cv16261842)

[Magisk 安装说明 - 锦夏挽秋（译）](https://blog.csdn.net/qq1337715208/article/details/115922514)