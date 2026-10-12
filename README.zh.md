# DSH Daily Mode

[English](README.md) | 中文

Daily Mode 是一个公开的 DeepSeek Harness 通用日用工作流 bundle，在 Desktop、Web 和 Headless profile 中保持相同的事务语义，并提供原生工具、上下文呈现、子 Agent 控制、归档过滤和会话清理。

项目声明兼容 DSH `>=0.1.7`。已安装 Host 的兼容性由 DSH 原生插件加载器检查。

## 从 Git 安装

使用 DSH 原生 profile 插件管理器安装公开仓库：

```powershell
dsh plugin --profile desktop add github:Error0Function/dsh-daily-preset
dsh plugin --profile web add github:Error0Function/dsh-daily-preset
dsh plugin --profile headless add github:Error0Function/dsh-daily-preset
```

在需要使用 Daily Mode 的每个 profile 中安装。仓库已经提交构建后的 `lib` 和 bundle 补丁，Git 安装不依赖额外工作区或开发源码链接。需要可复现部署时，可使用 `github:Error0Function/dsh-daily-preset#<commit>` 固定到经过审阅的提交。安装或替换后重启 DSH Host，使运行中的进程加载新包。

## 提供的功能

- 使用原生工具、权限、Goal、Skill 和模型路由的日用 preset。
- 为主 Agent 和子 Agent 提供上下文呈现规则。
- Agent 等待、归档和客户端归档过滤。
- Host 启动时执行已经确认的归档会话清理。
- Desktop 和 Web 的模式及子模型设置界面。
- 保持相同会话语义的 Headless 策略、上下文和 Agent 控制组件。

子 Agent 默认继承父 Agent 的模型和 effort，也可以通过 DSH 原生设置选择其他模型。设置由 DSH 保存；本包不要求额外的配置同步器或登录插件。

## 权限和作用域

日用 preset 请求 DSH 的 `danger-full-access` 权限，因为它面向通用本地开发和文件操作。启用 bundle 前请确认该权限策略符合预期。

客户端组件面向 Desktop 和 Web。Headless 加载模型可见的策略、上下文和 Agent 控制组件，不需要客户端 connection 服务。模型凭据、MCP 服务、全局指令和压缩策略仍由用户的 DSH 配置负责。

## 从源码构建

使用兼容的 DSH 源码工作树重新构建已提交产物：

```powershell
$env:DSH_REPO = '兼容的 DSH 源码目录'
node build.mjs
npm pack . --ignore-scripts --pack-destination <输出目录>
```

构建依据记录在 `package.json` 中。发布时应将生成的 `lib` 和 bundle 文件与源码放在同一个提交中，因为 DSH 的 Git 安装直接使用这些已提交产物。

## 许可证和声明

本项目使用 [MIT License](LICENSE)。[第三方声明](THIRD_PARTY_NOTICES.md) 记录了随包发布的上游代码及其许可证。
