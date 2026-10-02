# Claude Codeを残して通常のターミナルを使う

このコンソールはAIを起動せず、課金条件と見積をローカル表示します。既存のOrcaエージェント起動経路を変更・遮断するものではありません。

## 実行
Orcaリポジトリの通常シェルで:

```sh
node ai-organization/terminal/console.mjs
```

`costs`で各AIの請求先・条件、`shell`で独立したターミナルの作成コマンド、`exit`で終了。Node.js以外の追加依存なし。

Claude Codeの入力欄にはシェルコマンドを打たないでください。会話を残すなら既存タブを残し、新しい通常シェルのタブで実行します。Claude Codeを終了してよければ`/exit`でシェルに戻ります。アンインストールや履歴削除は不要です。

Windows実行ホストで、OrcaのCLIが接続できる場合:

```sh
orca terminal create --worktree active --title shell --shell powershell --json
```

Linux/macOS/WSL/SSH実行ホスト:

```sh
orca terminal create --worktree active --title shell --json
```

既定ターミナル設定に自動AI起動がある場合は、その設定を確認して通常シェルのタブを選んでください。CLIがない場合はOrcaから通常シェルの新規タブを開いてください。現在のClaudeセッションの問題が自動起動・拡張機能・PATH競合のどれかは未確認です。

## 料金
`billing.json`に使用する正確なモデル、公式入力/出力単価（USD/100万token）を設定すると、`estimate codex 100000 10000`等で概算できます。未設定は計算を拒否します。これは請求明細の自動取得ではありません。cache・検索・税・為替・月額料金は別です。契約枠内の0円とAPIの相当コストを混同しないでください。

公式確認先:
- https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan
- https://code.claude.com/docs/en/costs
- https://ai.google.dev/gemini-api/docs/pricing
- https://docs.x.ai/developers/pricing

## 検証範囲
Node構文チェック、料金表出力、独立シェルのコマンド表示、未知モデル/未設定単価の拒否を確認済み。ユーザーのPCのOrca実機起動・ログイン・請求明細照合は未確認。追加AI呼び出しなし。
