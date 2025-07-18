# 关于这个仓库

> [!NOTE]
> 自 1.19.4 版本始，官方开始原生支持 Thunderbird，本仓库迎来完结。

本仓库每日北京时间12点、18点、24点自动同步[官方 Releases 版本](https://github.com/immersive-translate/immersive-translate/releases)，并自动构建发布可用于 Thunderbird 的扩展包，请移步[本仓库 Releases](https://github.com/John-Wong/immersive-translate/releases) 页面查看下载名为`thunderbird-immersive-translate-x.x.x.xpi`的扩展包。
> [!IMPORTANT]
> 使用本 Thunderbird 插件请自行承担风险，担心个人隐私泄露的慎用！

## 常见问题

### 无法翻译？悬浮窗未显示？
请检查是否安装了会覆盖原始邮件阅读窗格的其他插件（如 Thunderbird Conversations），沉浸式翻译插件无法工作于这些插件之上。

### 扩展无法适用于纯文本邮件？
这是由于 Thunderbird 对于纯文本邮件正文使用`<pre></pre>`标签包裹，以保持原格式显示，而沉浸式翻译默认不处理`pre`标签内容。

解决办法就是前往插件的「设置 → 开发者设置 → Edit User Rules」里添加例外规则转换处理该`pre`标签内容：
```json
[
  {
    "selectorMatches": [
      ".moz-text-plain"
    ],
    "longBuildPageLength": 1000,
    "isTransformPreTagNewLine": 1,
    "excludeTags.remove": [
      "PRE"
    ],
    "buildContainerSelectors": [
      "pre"
    ]
  }
]
```

### 我想自己构建仓库中没有的历史版本
1. 克隆本仓库并进入仓库目录
  ```bash
  git clone https://github.com/John-Wong/immersive-translate.git && cd immersive-translate
  ```
2. 下载解压指定历史版本的官方源代码
  ```bash
  # 指定一个版本号
  VERSION=v1.16.12
  curl -sL "https://github.com/immersive-translate/immersive-translate/archive/refs/tags/${VERSION}.tar.gz" -o source.tar.gz
  tar -xzf source.tar.gz --exclude="immersive-translate-${VERSION#v}/README*" --strip-components=1
  ```
3. 复制 firefox 目录到 thunderbird 目录
  ```bash
  cp -r ./dist/firefox/* ./dist/thunderbird/
  ```
4. 运行移植脚本
  ```bash
  chmod +x ./scripts/firefox2thunderbird.sh && ./scripts/firefox2thunderbird.sh
  ```
5. 打包插件
  ```bash
  # 打包插件置于仓库根目录
  cd ./dist/thunderbird && zip -r "../../thunderbird-immersive-translate-${VERSION#v}.xpi" .
  ```

# 原仓库介绍

本仓库用于发布沉浸式双语网页翻译扩展的 [Release 版本](https://github.com/immersive-translate/immersive-translate/releases)以及使用 [Github Issues](https://github.com/immersive-translate/immersive-translate/issues)收集和跟进用户反馈。

[沉浸式翻译](https://immersivetranslate.com/) 并非开源软件，这个仓库并 **不包含** 沉浸式翻译的源代码。旧版的[沉浸式翻译开源项目](https://github.com/immersive-translate/old-immersive-translate)已于 2023 年 1 月 17 日被归档。

[**点此安装沉浸式翻译**](https://immersivetranslate.com/docs/installation/) 或 [查看文档](https://immersivetranslate.com/docs/)

以下为视频介绍：

https://github.com/immersive-translate/immersive-translate/assets/62473795/a0e9af51-4a18-45ef-9fc4-0a1509d56ab0
