import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';

const policy = JSON.parse(readFileSync(new URL('./billing.json', import.meta.url), 'utf8'));
function costs() {
  console.log('\n追加課金監視 | このコンソールからのAI起動: なし | 請求実績: 未接続');
  console.table(policy.providers.map(p => ({
    AI: p.name, 請求先: p.biller, 条件: p.condition,
    単価: p.inputPerMillion == null ? '未設定' : `$${p.inputPerMillion}/$${p.outputPerMillion} (入力/出力100万token)`,
    追加請求: '未確認', 起動: '禁止'
  })));
  console.log('見積 = 入力token×入力単価/100万 + 出力token×出力単価/100万 + 検索・キャッシュ等。実請求は各社管理画面で確認。');
}
function estimate(id, input, output) {
  const p = policy.providers.find(p => p.id === id);
  const counts = [Number(input), Number(output)];
  if (!p || !counts.every(n => Number.isSafeInteger(n) && n >= 0)) throw new Error('estimate <AI-id> <入力token> <出力token>');
  if (p.inputPerMillion == null || p.outputPerMillion == null) throw new Error('モデル単価未設定。billing.jsonに公式単価とモデル名を記入してください。');
  console.log(`概算USD: $${((counts[0]*p.inputPerMillion+counts[1]*p.outputPerMillion)/1e6).toFixed(6)}（キャッシュ・ツール・税・為替は別）`);
}
function help() {
  console.log('\nOrca ターミナルコンソール（ローカル表示のみ）\ncosts: 請求条件一覧\nestimate <AI-id> <入力token> <出力token>: 概算\nshell: Claudeと独立した端末の作成コマンド\nhelp / exit\nAIの起動・API通信・資格情報の読み込みは行いません。');
}
async function main() {
  const args = process.argv.slice(2);
  if (args[0] === '--costs') return costs();
  if (args[0] === '--estimate') return estimate(...args.slice(1));
  help(); costs();
  const rl = createInterface({input: process.stdin, output: process.stdout});
  try {
    while (true) {
      const line = (await rl.question('orca-console> ')).trim();
      const [command, ...values] = line.split(/\s+/);
      if (command === 'exit') break;
      try {
        if (command === 'costs') costs();
        else if (command === 'estimate') estimate(...values);
        else if (command === 'shell') {
          console.log('Windowsホスト: orca terminal create --worktree active --title shell --shell powershell --json');
          console.log('Linux/macOS/WSL/SSH: orca terminal create --worktree active --title shell --json');
          console.log('実行前にプロジェクトの既定ターミナル設定の自動AI起動を確認してください。');
        } else if (command === 'help') help();
        else console.log('未対応。helpで操作一覧。AI起動は許可していません。');
      } catch (error) { console.error(error.message); }
    }
  } finally { rl.close(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
