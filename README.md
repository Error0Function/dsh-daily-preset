# DSH Daily Mode

Daily Mode 为 Desktop/Web 保留原有 daily preset，为 Headless 提供同一事务语义所需的策略、工具、上下文裁剪和 Agent 控制层。Headless 组合直接复用这些插件，不改变事务处理逻辑。

插件声明兼容 DSH `>=0.1.7`，实际接口兼容性由 DSH 原生安装和启动流程判断。

## 工作区安装

源码位于 `F:\SN850\Code\AI\dsh-plugin-workspace\plugins\dsh-daily-mode`，由独立 Git 仓库管理。通过工作区脚本构建不可变快照并同步到三个 profile：

```powershell
cd F:\SN850\Code\AI\dsh-plugin-workspace
uv run workspace.py sync dsh-daily-mode --profiles=desktop,web,headless
```

同步安装 `.tgz` 快照，不把运行中的 Host 链接到开发源码。Desktop 返回 `restart-required` 时，从 Desktop 菜单重新启动应用及 Host；旧快照会保留，确认不再被 profile 引用后再执行 `uv run workspace.py clean`。
