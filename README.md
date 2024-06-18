<div align="center"> <a href="https://github.com/anncwb/vue-vben-admin"> <img alt="VbenAdmin Logo" width="200" height="200" src="https://anncwb.github.io/anncwb/images/logo.png"> </a> <br> <br>

[![license](https://img.shields.io/github/license/anncwb/vue-vben-admin.svg)](LICENSE)

<h1>RuoYi Plus Vben</h1>
</div>

## 简介

基于 [vben(ant-design-vue)](https://github.com/vbenjs/vue-vben-admin) 的 RuoYi-Vue-Plus 前端项目

对应后端项目: **(分布式 5.X 分支 微服务 2.分支)**

分布式 [RuoYi-Vue-Plus](https://gitee.com/dromara/RuoYi-Vue-Plus/tree/5.X/)

微服务 [RuoYi-Cloud-Plus](https://gitee.com/dromara/RuoYi-Cloud-Plus/tree/2.X/)

## 预览

~~admin 账号: admin admin123~~

~~spring-admin -账号: ruoyi 123456~~ ~~由于服务器太小 没有运行 powerjob 模块~~

**服务器到期 将就看预览图吧**

## 文档

[vben 文档地址](https://doc.vvbin.cn/)

[RuoYi-Plus 文档地址](https://plus-doc.dromara.org/#/)

[本框架文档](https://gitee.com/dapppp/ruoyi-plus-vben/blob/master/docs.md)

## 预览图

![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/master/preview/1.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/master/preview/2.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/master/preview/3.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/master/preview/4.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/master/preview/5.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/master/preview/6.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/master/preview/8.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/master/preview/9.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/master/preview/10.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/master/preview/11.png)

## 安装使用

- 获取项目代码

```bash
git clone https://github.com/dapeng0201/ruoyi-plus-vben.git
```

- 安装依赖

```bash
cd ruoyi-plus-vben

pnpm install
```

- 修改.env.development 配置文件

```properties
# vite代理 这里主要是适配cloud跨域 分布式可以直接在VITE_GLOB_API_URL配置地址
VITE_PROXY = [["/dev-api","这里修改为后端地址如http://localhost:8080"]]

# 设置为代理地址或者直接http地址
VITE_GLOB_API_URL=/dev-api

# 文件上传路径 不用修改
VITE_GLOB_UPLOAD_URL=/resource/oss/upload

# springadmin监控地址 默认为{VITE_GLOB_API_URL}/admin/applications 注意跨域问题
# cloud可以不配置
VITE_GLOB_ADMIN_MONITOR_URL=http://127.0.0.1:9090/admin/applications

# powerjob的后台地址 默认为{VITE_GLOB_API_URL}/powerjob
# cloud可以不配置
VITE_GLOB_POWERJOB_URL=http://127.0.0.1:7700/#/oms/home
```

**提示** 分布式和微服务版本 对于一些第三方监控(如 nacos, springadmin, powerjob 等)

|            | 链接如何显示/打开 |   路径如何获取   |
| :--------: | :---------------: | :--------------: |
| 分布式 5.X |    内嵌 iframe    | env.xxx 文件配置 |
| 微服务 2.x |     外链方式      |     后台返回     |

所以微服务版本不需要配置 env.xxxx 中的地址 是由后台返回 path 而分布式除了需要配置 env.xxx 文件中的路径 还需要通过 nginx 解决跨域问题 可参考[nginx.conf](https://gitee.com/dromara/RuoYi-Vue-Plus/blob/5.X/script/docker/nginx/conf/nginx.conf#LC87)配置

- 运行

```bash
pnpm serve
```

- 打包

```bash
pnpm build
```

## 项目地址

- [vue-vben-admin](https://github.com/anncwb/vue-vben-admin) - vben
- [ruoyi-plus-vben](https://gitee.com/dapppp/ruoyi-plus-vben/tree/master)

## Git 贡献提交规范

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `style` 代码风格相关无影响运行结果的
  - `perf` 优化/性能提升
  - `refactor` 重构
  - `revert` 撤销修改
  - `test` 测试相关
  - `docs` 文档/注释
  - `chore` 依赖更新/脚手架配置修改等
  - `workflow` 工作流改进
  - `ci` 持续集成
  - `types` 类型定义文件更改
  - `wip` 开发中

## 浏览器支持

本地开发推荐使用`Chrome 80+` 浏览器

支持现代浏览器, 不支持 IE

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :-: | :-: | :-: | :-: | :-: |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |
