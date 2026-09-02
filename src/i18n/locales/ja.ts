import type en from './en';

const ja: Record<keyof typeof en, string> = {
  // Common
  'common.steps': 'ステップ',
  'common.flash': '書き込み',
  'common.debug': 'デバッグ',
  'common.yes': 'はい',
  'common.no': 'いいえ',
  'common.active': 'アクティブ',
  'common.viewRawData': '生データを表示',
  'common.downloadRawData': '生データをダウンロード',
  'common.rawData': '生データ',
  'common.progressHint': '操作を開始すると、ここに進行状況が表示されます',
  'common.chooseFile': 'ファイルを選択',
  'common.noFileChosen': 'ファイルが選択されていません',
  'common.clearFile': '選択したファイルを解除',

  // Header
  'header.title': 'Xteink 書き込みツール',
  'header.github': 'Github リポジトリへ',
  'header.intro':
    '対応ブラウザから Xteink ファームウェアのバックアップ、インストール、復元を行えます。',
  'header.theme': 'サイトテーマ',
  'header.themeLight': 'ライト',
  'header.themeDark': 'ダーク',
  'header.themeSystem': 'システム',

  // Flash page - Warning
  'flash.warning.title': '注意して操作してください',
  'flash.warning.desc1':
    'このツールは安全に設計されていますが、回復不能なエラーが発生する可能性はゼロではありません。慎重に操作し、デバイスを書き込む前に<b>フルフラッシュを保存</b>でバックアップを取ってください。',
  'flash.warning.desc2':
    '<b>ファイルからフラッシュを書き込み</b>または<b>英語ファームウェアを書き込み</b>を開始したら、操作が完了するまでデバイスを切断したりタブを閉じたりしないでください。バックアップからフルフラッシュを書き込めば、デバイスを以前の状態に復元できます。',
  'flash.backupEyebrow': '復元用バックアップ',
  'flash.firmwareEyebrow': 'ファームウェア導入',
  'flash.progressEyebrow': '操作状況',

  // Flash page - Full flash controls
  'flash.fullFlash.heading': 'フルフラッシュ制御',
  'flash.fullFlash.desc1':
    'これらの操作により、問題が発生した場合に復元できるよう、Xteink デバイスの完全バックアップを取ることができます。',
  'flash.fullFlash.desc2':
    '<b>フルフラッシュを保存</b>はデバイスのフラッシュを読み取り、<em>flash.bin</em> として保存します。約25分かかります。そのファイル（または他の人のファイル）を<b>ファイルからフルフラッシュを書き込み</b>で使用して、デバイスのフラッシュ全体を上書きできます。',
  'flash.saveFullFlash': 'フルフラッシュを保存',
  'flash.writeFullFlash': 'ファイルからフルフラッシュを書き込み',

  // Flash page - OTA fast flash controls
  'flash.otaFlash.heading': 'OTA 高速書き込み制御',
  'flash.otaFlash.desc1':
    'この機能を使用する前に、上の<b>フルフラッシュを保存</b>でデバイスのバックアップを取ることを強くお勧めします。',
  'flash.otaFlash.desc2':
    '<b>英語/中国語ファームウェアを書き込み</b>はファームウェアをダウンロードし、バックアップパーティションを新しいファームウェアで上書きし、このパーティションに切り替えます（既存のファームウェアが新しいバックアップになります）。フルフラッシュ書き込みより大幅に高速で、すべての設定が保持されます。問題が発生した場合は、再実行してください。',
  'flash.flashEnglish': '英語ファームウェアを書き込み',
  'flash.flashChinese': '中国語ファームウェアを書き込み',
  'flash.flashCrossPoint': 'CrossPoint ファームウェアを書き込み',
  'flash.flashCrossPointCjkSc':
    'CrossPoint CJK ファームウェアを書き込み (簡体字)',
  'flash.flashCrossPointCjkTc':
    'CrossPoint CJK ファームウェアを書き込み (繁体字)',
  'flash.flashFromFile': 'ファイルからファームウェアを書き込み',
  'flash.fakeWrite': 'フルフラッシュ書き込みをシミュレート',

  // Flash page - Info alerts
  'flash.changeLanguage.title': 'デバイス言語の変更',
  'flash.changeLanguage.desc':
    '操作を開始する前に、デバイスの言語を英語に変更することをお勧めします。「設定」アイコンを選択し、「OK / 確認」ボタンをクリックして、英語が表示されるまで「OK / 確認」を繰り返してください。そうしないと、書き込み後も言語が中国語のままになり、変更に気づかない可能性があります。',
  'flash.restartDevice.title': 'デバイスの再起動手順',
  'flash.restartDevice.desc':
    '書き込み操作完了後、右下の小さな「Reset」ボタンを押して離し、すぐにメイン電源ボタンを約3秒間長押ししてデバイスを再起動してください。',

  // Step names
  'step.Connect to device': 'デバイスに接続',
  'step.Validate partition table': 'パーティションテーブルを検証',
  'step.Download firmware': 'ファームウェアをダウンロード',
  'step.Read otadata partition': 'otadata パーティションを読み取り',
  'step.Flash app partition': 'アプリパーティションを書き込み',
  'step.Flash otadata partition': 'otadata パーティションを書き込み',
  'step.Reset device': 'デバイスをリセット',
  'step.Read file': 'ファイルを読み取り',
  'step.Read flash': 'フラッシュを読み取り',
  'step.Disconnect from device': 'デバイスから切断',
  'step.Write flash': 'フラッシュを書き込み',
  'step.Read app0 partition': 'app0 パーティションを読み取り',
  'step.Read app1 partition': 'app1 パーティションを読み取り',
  'step.Identify firmware types': 'ファームウェアの種類を識別',
  'step.Upgrade partition table': 'パーティションテーブルをアップグレード',
  'step.Erase user data': 'ユーザーデータを消去',

  'debug.eyebrow': '高度なツール',
  'debug.progressEyebrow': '操作状況',
  'debug.outputEyebrow': '確認結果',

  // Debug page
  'debug.heading': 'デバッグ制御',
  'debug.desc':
    'これらは Xtink デバイスのデバッグと管理に役立つツールです。意図的にデバイスをいじりたい方向けです。',
  'debug.readOtadata.desc':
    '<b>otadata パーティションを読み取り</b>は <em>otadata</em> パーティションの生データを読み取り、内容を確認またはダウンロードできます。',
  'debug.readApp.desc':
    '<b>アプリパーティションを読み取り</b>は選択したアプリパーティションの生データを読み取り、内容を確認またはダウンロードできます。',
  'debug.swapBoot.desc':
    '<b>ブートパーティションを交換</b>は <em>otadata</em> から現在のブートパーティション（app0 または app1）を確認し、データを書き換えてブートパーティションを切り替えます。',
  'debug.identifyFirmware.desc':
    '<b>両パーティションのファームウェアを識別</b>は app0 と app1 パーティションを読み取り、それぞれにインストールされているファームウェアの種類（公式英語版、公式中国語版、CrossPoint コミュニティ版、カスタム）を自動識別します。',
  'debug.eraseUserData.desc':
    '<b>ユーザーデータを消去</b>は SPIFFS パーティションを消去し、ユーザーファイル（電子書籍、設定など）をすべて削除します。破損または大きすぎるファイルが原因の起動ループから復旧するために使用します。',
  'debug.readOtadata': 'otadata パーティションを読み取り',
  'debug.readApp0': 'app0 パーティションを読み取り',
  'debug.readApp1': 'app1 パーティションを読み取り',
  'debug.swapBoot': 'ブートパーティションを交換 (app0 / app1)',
  'debug.identifyFirmware': '両パーティションのファームウェアを識別',
  'debug.eraseUserData': 'ユーザーデータを消去 (SPIFFS)',
  'debug.otaData': 'OTA データ',
  'debug.partition': 'パーティション',
  'debug.bootPartition': 'ブートパーティション：',
  'debug.otaSequence': 'OTA シーケンス：',
  'debug.otaState': 'OTA 状態：',
  'debug.crc32Bytes': 'CRC32 バイト：',
  'debug.crc32Valid': 'CRC32 検証：',
  'debug.appPartitionData': 'アプリパーティションデータ',
  'debug.firmwareInfo': 'ファームウェア情報',
  'debug.firmware': 'ファームウェア：',
  'debug.version': 'バージョン：',
  'debug.type': 'タイプ：',

  // Firmware identification display names
  'firmware.officialEnglish': '公式英語版',
  'firmware.officialChinese': '公式中国語版',
  'firmware.crosspoint': 'CrossPoint コミュニティリーダー',
  'firmware.unknown': 'カスタム/不明ファームウェア',
};

export default ja;
