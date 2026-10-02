# OrcaでCodex・Claude・Gemini・Grok・Hermes・Jevを利用する

Orcaの `src/shared/tui-agent-config.ts` は `codex`、`claude`、`gemini`、`grok`、`hermes` を既に起動できます。ChatGPTアカウントで使うOpenAIのエージェントはCodexです。この手順はChatGPTのWeb画面をOrcaに埋め込むものではありません。

## 実行するホストにインストール

ローカル作業ならOrcaを動かすPC、SSHなら接続先、WSLなら対象ディストリビューションにインストールしてください。このリポジトリを取得しただけではPCにCLIは入りません。Node.js 24とnpmを用意してください。

macOS / Linux / WSL:

```bash
bash config/scripts/install-ai-agents.sh
```

公式インストーラーを実行し、各CLIのPATH上での存在を確認します。失敗した項目があれば終了コード1になります。Hermesの追加ブラウザー・computer-use依存は省きます。再実行できます。

Windows PowerShell（Codex・Claude・Gemini）:

```powershell
npm install -g @openai/codex @anthropic-ai/claude-code @google/gemini-cli
```

Hermesの公式Windowsインストーラー:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

GrokはGit Bashで公式インストーラーを実行してください。WSLに入れる場合はOrcaでも同じWSLホストを選択してください。

```bash
curl -fsSL https://x.ai/cli/install.sh -o grok-install.sh
bash grok-install.sh
```

## 認証と起動

Orcaを再起動し、対象ホストのターミナルで次のコマンドを個別に起動して公式ログイン手順を完了します。

| サービス | コマンド | Orcaのエージェント |
| --- | --- | --- |
| ChatGPT / OpenAI | `codex` | Codex |
| Claude | `claude` | Claude |
| Gemini | `gemini` | Gemini |
| Grok | `grok` | Grok |
| Hermes Agent | `hermes --tui` | Hermes |

CLIが検出されない場合は同じOrcaターミナルで `command -v codex claude gemini grok hermes`（PowerShellは `Get-Command codex,claude,gemini,grok,hermes`）を確認してください。インストーラーが案内したbinディレクトリをそのホストのPATHに追加してください。アカウントやAPIキーはGitHubに保存しません。

## Jev

JevはTypeSafeの構造化判断モデルです。会話型TUIとして登録せず、Codex・Claudeなどから利用する公式TypeSafeスキルを `.agents/skills/typesafe-ai/SKILL.md` と `.claude/skills/typesafe-ai/SKILL.md` に収録しています。スキルの参考資料は公式リポジトリから取得します。

```bash
npx skills add typesafe-ai/skills --skill typesafe-ai
```

SDKを使うプロジェクトで以下を実行し、`TYPESAFE_API_KEY`を実行ホストの環境変数に設定してください。

```bash
npm install @typesafe-ai/sdk
```

公式SDKの利用例:

```js
import { choice, TypeSafeClient } from '@typesafe-ai/sdk'
const client = new TypeSafeClient()
const result = await client.systemOne({
  state: '料金が二重請求されました。',
  questions: {
    category: choice('問い合わせの分類', {
      billing: null,
      technical: null,
      other: null
    })
  }
})
console.log(result.answers.category.choice)
```

CLIのインストール、Orcaでの検出、ログイン、実際のモデル応答はそれぞれ別の確認です。APIキーや各サービスの利用権限がない状態では応答確認は完了しません。

## 公式資料

- https://developers.openai.com/codex/cli/
- https://code.claude.com/docs/en/setup
- https://geminicli.com/docs/get-started/installation/
- https://docs.x.ai/build/overview
- https://hermes-agent.nousresearch.com/docs/getting-started/installation/
- https://docs.typesafe.ai/introduction/coding-agents
- https://docs.typesafe.ai/sdk/javascript
