# 日用模式维护

## 设计目标

日用模式面向通用任务。评价整套组合的完成质量、协作自然度、模型理解成本、上下文占用和耗时；提示词优化同时考虑效率与表达协调，不设最低压缩收益门槛。

通过插件组合复用 DSH 的工具、Goal、Skill、权限、模型解析和会话生命周期。扩展只负责明确需要的模型路由、上下文呈现、等待及归档管理，适配上游时优先使用语义等价的官方能力。

主、子 Persona 的前段分别定义角色职责，后段共享任务范围、自主判断、取证、验证和交付原则。日用提示词服务当前任务，不依赖模式名称、界面身份、端口或构建环境；DSH 创作开发指导属于其他模式。

## 组件与作用域

根包是唯一的 DSH bundle。`package.json` 的 `dsh.bundle.patch` 依次加载模式、归档过滤和会话清理；内部组件保留各自的 Host 或客户端入口，随根包安装。

| 组件 | 职责 | 作用域 |
|---|---|---|
| 模式与策略 | 原生工具组合、完全访问、子模型路由 | 日用模式及其子 Agent；模型选择通过全局设置保存 |
| DCT | 明确指定的提示词、输入包装和工具目录适配 | 挂载它的模式及其子 Agent |
| Agent Control | 等待、归档及隐藏归档项的 Agent 列表 | 日用模式；子角色的工具可见性由模式配置限定 |
| 归档过滤 | 主会话目录和子会话面包屑中过滤归档项 | Host 的客户端会话界面 |
| 会话清理 | 用户确认后在冷启动时永久删除已归档会话 | 整个 Host，入口位于日用模式设置页 |

Web 与 Desktop 加载同一套客户端实现，可分别部署；本项目不依赖共享 Host 或 `dsh-shared-config`。模型登录、MCP 服务、全局指令和压缩策略由使用者配置，项目不安装 STS/STSS 或写入全局指令，也不依赖 Codex 登录插件。

Exa 是可选 MCP 服务。缺少对应工具时专属 DCT 规则不生效，其他提示词不依赖 Exa；服务作用域和目录刷新沿用 DSH 原生机制。Windows 使用 PowerShell，Linux/macOS 使用 Bash。

## 程序机制

以下行为由配置与实现提供。当前参数及提示词正文以 [模式配置](cordis.patch.yml)、各组件的 `Config`、类型定义和 Host 用户覆盖为准。

### 模型与子 Agent

子 Agent 默认继承父模型及 effort；用户可在设置页选择原生目录中的模型及其支持的 effort。选定其他模型时，输出上限和上下文大小沿用该模型的原生配置。模型路由在每次开始运行时采样并保持到该次运行结束；设置修改在下一次运行生效，已有会话也遵守此规则。

模式配置限制子 Agent 最大深度为 1，使用 fresh 创建，隐藏子角色的编排和 Goal 工具，保留 `send_message`。原生机制在可继续子 Agent 的运行结束时将最终回复送给父 Agent。

### 上下文呈现

DCT 只适配明确指定的内容，未指定内容原样通过，工具执行结果保持原样。提示词和输入包装在首次进入模型前处理，模型可见内容必须能从会话日志重建。

工具规则可修改说明、参数说明、可选参数可见性和参数顺序；保留参数名称、类型、必填、枚举及执行定义。隐藏必填参数会报错，显式调用隐藏工具或传入隐藏参数会被拒绝。遇到 `run_code` 时拒绝组装，PTC 和 both 呈现方式不受支持。

段落、动态上下文、子角色覆盖、工具可见性和活动 Goal 规则由 DCT 配置指定。消息包装改写保留任务、Skill 和项目指令正文、路径、父 ID、Goal 目标与轮数，以及消息身份和来源。

### 等待与归档

`wait_agent` 支持 OR/AND，按新消息或运行结束信号唤醒；运行结束也包括失败或中断。默认配置以分钟计时，等待 10 分钟，可指定 10–60 分钟；信号满足条件时立即返回，超时不停止子 Agent。

消息正文由原生 Inbox 交付，等待结果仅引用消息 ID。已消费的消息和运行结束位置保存在结果 metadata，恢复会话后也用于避免重复唤醒；停止等待或卸载插件会释放监听器和计时器。

`archive_agent` 只接受调用者自己的直接、可继续子 Agent，停止活动、持久归档并释放实例，保留会话历史。归档后的条目从 Agent 列表和客户端子 Agent 目录中隐藏；客户端沿用原生导航和统计语义。

### 永久清理

设置页的两次点击将确认时的归档集合加入持久队列，下一次 Host 冷启动执行。热重载不执行删除，执行前已取消归档的条目跳过，失败项保留以供后续重试。

清理在会话服务激活前执行，使用原生写入锁，限制删除路径并拒绝链接会话目录。清理同时移除相关投影缓存、工作区关联和固定项；保留已删除 ID 的归档标记，使父会话的历史子目录继续隐藏这些条目。

清理范围不包含共享附件、溢出文件、工作目录，以及其他会话中复制的历史。

## 模型指导

以下要求通过提示词引导 Agent，并不构成工具执行器的授权检查。

- 协作指导适用于各类任务。主 Agent 根据剩余工作衡量委派的时间或质量收益，以及建立背景、沟通和整合的成本；明确子任务的预期结果、责任范围、完成条件和使用方式，提供必要背景与已有成果，保留清楚的自身职责。责任调整与共享资源修改需要协调。
- 主 Agent 承接满足要求且有充分依据的子结果，继续推进未完成的工作；复核和返工针对具体缺口、矛盾、重要风险或约定的独立评估，范围与用途和影响相称。下一步依赖子结果且独立工作已耗尽时使用等待工具。
- 子 Agent 围绕分配的结果和完成条件开展工作，补齐影响交付的缺口，满足要求后通过最终回复交付父 Agent 继续工作所需的内容。
- 双方为最终交付前所需的行动或决定发送协调消息，并说明所需行动；其他发现与常规进度随结果交付，收到消息后按需行动，无需例行确认或重复报告。向空闲 Agent 发消息会启动新一轮运行。
- Agent 只有在用户授权归档相应子 Agent 时才使用归档工具；完成或空闲本身不构成授权。
- Goal 用于用户要求的跨轮自主续跑；普通任务的长度和复杂度不自动构成启用 Goal 的请求。
- 根据用户指定及当前活动的适用范围加载 Skill，复用仍可用且有效的全文；进度与最终回复围绕用户需要的信息组织。

## 实现入口

| 内容 | 文件 |
|---|---|
| 模式、角色提示词与 DCT 规则 | [cordis.patch.yml](cordis.patch.yml) |
| 模型设置页与设置服务 | [src/client.tsx](src/client.tsx)、[src/index.ts](src/index.ts) |
| 完全访问与子模型路由 | [src/policy.ts](src/policy.ts) |
| DCT 配置、事件及转换 | [config.ts](plugins/dsh-context-trim/src/config.ts)、[index.ts](plugins/dsh-context-trim/src/index.ts)、[tools.ts](plugins/dsh-context-trim/src/tools.ts)、[messages.ts](plugins/dsh-context-trim/src/messages.ts) |
| Agent 工具与等待状态 | [index.ts](plugins/dsh-agent-control/src/index.ts)、[wait.ts](plugins/dsh-agent-control/src/wait.ts) |
| 归档过滤与目录视图 | [client.tsx](plugins/dsh-agent-archive-filter/src/client.tsx)、[catalog.tsx](plugins/dsh-agent-archive-filter/src/catalog.tsx)；统计、翻译和样式由同目录模块提供 |
| 永久清理与文件删除 | [index.ts](plugins/dsh-session-cleanup/src/index.ts)、[session-files.ts](plugins/dsh-session-cleanup/src/session-files.ts) |
| 共用客户端通知与样式注册 | [src/client-effects.tsx](src/client-effects.tsx) |
| 构建助手及总入口 | [build-support.mjs](build-support.mjs)、[build.mjs](build.mjs) |

模块按配置、纯转换、状态管理、事件注册和视图职责组织。构建助手统一 SDK 依赖链接、Host/Client 类型检查、打包及客户端模块包装；组件脚本声明入口和 CSS、JSONL 的构建特例。

## 安装、构建与发布

在 DSH 插件页使用 GitHub 仓库地址或根包 tarball 安装。Git 安装加载已提交的产物，不执行本项目构建。

`package.json` 的 `dshDailyMode.targetDshVersion` 与 `sourceCommit` 记录构建所依据的 DSH 版本和源码提交。DSH peer 范围采用 `>=0.1.7` 的最低版本策略；更新构建基准不自动收紧 peer 范围，只有实际接口需求改变时调整最低支持版本。

修改源码后，在本项目根目录指定构建基准对应的 DSH 源码目录：

```powershell
$env:DSH_REPO = '同版本 DSH 源码目录'
node build.mjs
```

同次提交源码与对应的 `lib`。修改已加载的运行模块后，重启应用及 Host。

生成 tarball 时将输出放在项目外：

```powershell
npm pack . --ignore-scripts --pack-destination <输出目录>
```

运行状态默认保存在 DSH Home。`.gitignore` 覆盖数据目录、凭据、会话记录、数据库、锁、日志、依赖目录和临时文件；本机个人指令和编辑器设置放入 `.git/info/exclude`。分发跟踪预构建 `lib` 与本项目维护 Skill，排除用户数据和开发记录。

[LICENSE](LICENSE) 保留本项目许可，[第三方声明](THIRD_PARTY_NOTICES.md) 记录所包含的上游代码来源和许可；更新构建来源时同步相关声明。

## 维护方法

本文件集中记录项目事实与设计要求；[维护 Skill](.agents/skills/maintain-dsh-daily-mode/SKILL.md) 说明如何调查改动、同步上游和选择验证证据。具体接口细节由源码与类型定义维护，提示词正文由模式配置维护。
