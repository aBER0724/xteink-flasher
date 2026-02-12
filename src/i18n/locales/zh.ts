import type en from './en';

const zh: Record<keyof typeof en, string> = {
  // Common
  'common.steps': '步骤',
  'common.flash': '刷写',
  'common.debug': '调试',
  'common.yes': '是',
  'common.no': '否',
  'common.active': '活动中',
  'common.viewRawData': '查看原始数据',
  'common.downloadRawData': '下载原始数据',
  'common.rawData': '原始数据',
  'common.progressHint': '开始操作后，进度将显示在此处',

  // Header
  'header.title': 'Xteink 刷写工具',
  'header.github': '前往 Github 仓库',

  // Flash page - Warning
  'flash.warning.title': '请谨慎操作',
  'flash.warning.desc1':
    '我已尽力使此工具安全可靠，虽然发生不可恢复错误的可能性极低，但并非为零。请谨慎操作，并确保在刷写设备前使用<b>保存完整闪存</b>进行备份。',
  'flash.warning.desc2':
    '一旦开始<b>从文件写入闪存</b>或<b>刷写英文固件</b>，请避免断开设备或关闭标签页，直到操作完成。从备份写入完整闪存应始终能恢复设备到之前的状态。',

  // Flash page - Full flash controls
  'flash.fullFlash.heading': '完整闪存控制',
  'flash.fullFlash.desc1':
    '这些操作允许您对 Xteink 设备进行完整备份，以便在出现任何问题时能够恢复。',
  'flash.fullFlash.desc2':
    '<b>保存完整闪存</b>将读取设备的闪存并保存为 <em>flash.bin</em>。这将需要大约25分钟完成。您可以使用该文件（或他人的文件）配合<b>从文件写入完整闪存</b>来覆盖设备的整个闪存。',
  'flash.saveFullFlash': '保存完整闪存',
  'flash.writeFullFlash': '从文件写入完整闪存',

  // Flash page - OTA fast flash controls
  'flash.otaFlash.heading': 'OTA 快速刷写控制',
  'flash.otaFlash.desc1':
    '在使用此功能之前，强烈建议使用上方的<b>保存完整闪存</b>备份您的设备。',
  'flash.otaFlash.desc2':
    '<b>刷写英文/中文固件</b>将下载固件，用新固件覆盖备份分区，并切换到使用该分区（将现有固件作为新备份）。这比完整闪存写入快得多，并保留所有设置。如果出错，重新运行即可。',
  'flash.flashEnglish': '刷写英文固件',
  'flash.flashChinese': '刷写中文固件',
  'flash.flashCrossPoint': '刷写 CrossPoint 固件',
  'flash.flashCrossPointCjk': '刷写 CrossPoint CJK 固件',
  'flash.flashFromFile': '从文件刷写固件',
  'flash.fakeWrite': '模拟写入完整闪存',

  // Flash page - Info alerts
  'flash.changeLanguage.title': '更改设备语言',
  'flash.changeLanguage.desc':
    '在开始操作之前，建议先将设备语言更改为英文。方法：选择"设置"图标，然后点击"确认"按钮，再次点击"确认"直到显示英文。否则刷写后语言仍为中文，您可能无法注意到变化。',
  'flash.restartDevice.title': '设备重启说明',
  'flash.restartDevice.desc':
    '完成写入操作后，您需要按下并释放右下方的小"Reset"按钮来重启设备，然后迅速按住主电源按钮约3秒。',

  // Step names
  'step.Connect to device': '连接设备',
  'step.Validate partition table': '验证分区表',
  'step.Download firmware': '下载固件',
  'step.Read otadata partition': '读取 otadata 分区',
  'step.Flash app partition': '刷写应用分区',
  'step.Flash otadata partition': '刷写 otadata 分区',
  'step.Reset device': '重置设备',
  'step.Read file': '读取文件',
  'step.Read flash': '读取闪存',
  'step.Disconnect from device': '断开设备连接',
  'step.Write flash': '写入闪存',
  'step.Read app0 partition': '读取 app0 分区',
  'step.Read app1 partition': '读取 app1 分区',
  'step.Identify firmware types': '识别固件类型',
  'step.Upgrade partition table': '升级分区表',

  // Debug page
  'debug.heading': '调试控制',
  'debug.desc':
    '这些工具用于调试和管理您的 Xtink 设备，适合有意探索设备功能的用户。',
  'debug.readOtadata.desc':
    '<b>读取 otadata 分区</b>将读取 <em>otadata</em> 分区的原始数据，允许您检查或下载内容。',
  'debug.readApp.desc':
    '<b>读取应用分区</b>将读取所选应用分区的原始数据，允许您检查或下载内容。',
  'debug.swapBoot.desc':
    '<b>交换启动分区</b>将从 <em>otadata</em> 检查当前启动分区（app0 或 app1），并重写数据以切换启动分区。',
  'debug.identifyFirmware.desc':
    '<b>识别两个分区的固件</b>将读取 app0 和 app1 分区，并自动识别每个分区安装的固件类型（官方英文、官方中文、CrossPoint 社区版或自定义固件）。',
  'debug.readOtadata': '读取 otadata 分区',
  'debug.readApp0': '读取 app0 分区',
  'debug.readApp1': '读取 app1 分区',
  'debug.swapBoot': '交换启动分区 (app0 / app1)',
  'debug.identifyFirmware': '识别两个分区的固件',
  'debug.otaData': 'OTA 数据',
  'debug.partition': '分区',
  'debug.bootPartition': '启动分区：',
  'debug.otaSequence': 'OTA 序列号：',
  'debug.otaState': 'OTA 状态：',
  'debug.crc32Bytes': 'CRC32 字节：',
  'debug.crc32Valid': 'CRC32 校验：',
  'debug.appPartitionData': '应用分区数据',
  'debug.firmwareInfo': '固件信息',
  'debug.firmware': '固件：',
  'debug.version': '版本：',
  'debug.type': '类型：',

  // Firmware identification display names
  'firmware.officialEnglish': '官方英文版',
  'firmware.officialChinese': '官方中文版',
  'firmware.crosspoint': 'CrossPoint 社区阅读器',
  'firmware.unknown': '自定义/未知固件',
};

export default zh;
