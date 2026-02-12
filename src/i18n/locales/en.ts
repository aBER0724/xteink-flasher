const en = {
  // Common
  'common.steps': 'Steps',
  'common.flash': 'Flash',
  'common.debug': 'Debug',
  'common.yes': 'Yes',
  'common.no': 'No',
  'common.active': 'Active',
  'common.viewRawData': 'View Raw Data',
  'common.downloadRawData': 'Download Raw Data',
  'common.rawData': 'Raw Data',
  'common.progressHint':
    'Progress will be shown here once you start an operation',

  // Header
  'header.title': 'Xteink Flash Tools',
  'header.github': 'Go to Github repo',

  // Flash page - Warning
  'flash.warning.title': 'Proceed with caution',
  'flash.warning.desc1':
    "I've tried to make this foolproof and while the likelihood of unrecoverable things going wrong is extremely low, it's never zero. So proceed with care and make sure to grab a backup using <b>Save full flash</b> before flashing your device.",
  'flash.warning.desc2':
    'Once you start <b>Write flash from file</b> or <b>Flash English firmware</b>, you should avoid disconnecting your device or closing the tab until the operation is complete. Writing a full flash from your backup should always restore your device to its old state.',

  // Flash page - Full flash controls
  'flash.fullFlash.heading': 'Full flash controls',
  'flash.fullFlash.desc1':
    'These actions will allow you to take a full backup your Xteink device in order to be able to restore it in the case that anything goes wrong.',
  'flash.fullFlash.desc2':
    "<b>Save full flash</b> will read your device's flash and save it as <em>flash.bin</em>. This will take around 25 minutes to complete. You can use that file (or someone else's) with <b>Write full flash from file</b> to overwrite your device's entire flash.",
  'flash.saveFullFlash': 'Save full flash',
  'flash.writeFullFlash': 'Write full flash from file',

  // Flash page - OTA fast flash controls
  'flash.otaFlash.heading': 'OTA fast flash controls',
  'flash.otaFlash.desc1':
    "Before using this, I'd strongly recommend taking a backup of your device using <b>Save full flash</b> above.",
  'flash.otaFlash.desc2':
    '<b>Flash English/Chinese firmware</b> will download the firmware, overwrite the backup partition with the new firmware, and swap over to using this partition (leaving your existing firmware as the new backup). This is significantly faster than a full flash write and will retain all your settings. If it goes wrong, it should be fine to run again.',
  'flash.flashEnglish': 'Flash English firmware',
  'flash.flashChinese': 'Flash Chinese firmware',
  'flash.flashCrossPoint': 'Flash CrossPoint firmware',
  'flash.flashCrossPointCjk': 'Flash CrossPoint CJK firmware',
  'flash.flashFromFile': 'Flash firmware from file',
  'flash.fakeWrite': 'Fake write full flash',

  // Flash page - Info alerts
  'flash.changeLanguage.title': 'Change device language',
  'flash.changeLanguage.desc':
    'Before starting the process, it is recommended to change the device language to English. To do this, select "Settings" icon, then click "OK / Confirm" button and "OK / Confirm" again until English is shown. Otherwise, the language will still be Chinese after flashing and you may not notice changes.',
  'flash.restartDevice.title': 'Device restart instructions',
  'flash.restartDevice.desc':
    'Once you complete a write operation, you will need to restart your device by pressing and releasing the small "Reset" button near the bottom right, followed quickly by pressing and holding of the main power button for about 3 seconds.',

  // Step names (used as display translations for step keys)
  'step.Connect to device': 'Connect to device',
  'step.Validate partition table': 'Validate partition table',
  'step.Download firmware': 'Download firmware',
  'step.Read otadata partition': 'Read otadata partition',
  'step.Flash app partition': 'Flash app partition',
  'step.Flash otadata partition': 'Flash otadata partition',
  'step.Reset device': 'Reset device',
  'step.Read file': 'Read file',
  'step.Read flash': 'Read flash',
  'step.Disconnect from device': 'Disconnect from device',
  'step.Write flash': 'Write flash',
  'step.Read app0 partition': 'Read app0 partition',
  'step.Read app1 partition': 'Read app1 partition',
  'step.Identify firmware types': 'Identify firmware types',

  // Debug page
  'debug.heading': 'Debug controls',
  'debug.desc':
    "These are few tools to help debugging / administering your Xtink device. They're designed to be used by those who are intentionally messing around with their device.",
  'debug.readOtadata.desc':
    '<b>Read otadata partition</b> will read the raw data out of the <em>otadata</em> partition and allow you to inspect or download the contents.',
  'debug.readApp.desc':
    '<b>Read app partition</b> will read the raw data out of the selected app partition and allow you to inspect or download the contents.',
  'debug.swapBoot.desc':
    '<b>Swap boot partitions</b> will check the current boot partition (app0 or app1) from <em>otadata</em> and rewrite the data in the <em>otadata</em> to switch the boot partition.',
  'debug.identifyFirmware.desc':
    '<b>Identify firmware in both partitions</b> will read both app0 and app1 partitions and automatically identify which firmware is installed on each (Official English, Official Chinese, CrossPoint Community, or Custom).',
  'debug.readOtadata': 'Read otadata partition',
  'debug.readApp0': 'Read app0 partition',
  'debug.readApp1': 'Read app1 partition',
  'debug.swapBoot': 'Swap boot partitions (app0 / app1)',
  'debug.identifyFirmware': 'Identify firmware in both partitions',
  'debug.otaData': 'OTA data',
  'debug.partition': 'Partition',
  'debug.bootPartition': 'Boot Partition:',
  'debug.otaSequence': 'OTA Sequence:',
  'debug.otaState': 'OTA State:',
  'debug.crc32Bytes': 'CRC32 Bytes:',
  'debug.crc32Valid': 'CRC32 Valid:',
  'debug.appPartitionData': 'App partition data',
  'debug.firmwareInfo': 'Firmware Information',
  'debug.firmware': 'Firmware:',
  'debug.version': 'Version:',
  'debug.type': 'Type:',

  // Firmware identification display names
  'firmware.officialEnglish': 'Official English',
  'firmware.officialChinese': 'Official Chinese',
  'firmware.crosspoint': 'CrossPoint Community Reader',
  'firmware.unknown': 'Custom/Unknown Firmware',
} as const;

export default en;
