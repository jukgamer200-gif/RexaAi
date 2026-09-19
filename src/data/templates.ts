import { BlueprintTemplate } from '../types';

export const BLUEPRINT_TEMPLATES: BlueprintTemplate[] = [
  {
    id: 'paper-26-custom-enchants',
    title: 'Paper 26.2 Mystic Enchants',
    category: 'Gameplay & Combat',
    description: 'Next-gen custom enchantments with visual particle effects, sound queues, and custom persistent data container storage.',
    prompt: 'Create a super best tier Paper 26.2 plugin called "MysticEnchants" that adds 3 custom enchantments (LightningStrike on sword hit, Lifesteal, and Telepathy mining straight to inventory). Use modern Paper Adventure Component MiniMessage formatting, PersistentDataContainer keys, and configurable trigger chances in config.yml.',
    version: '26.2 (Next-Gen Paper)',
    platform: 'paper',
    tag: 'Next-Gen 26.2'
  },
  {
    id: 'folia-rtp-teleport',
    title: 'Folia Region-Safe RTP',
    category: 'Folia Multithreading',
    description: 'High-performance random teleportation engine fully compatible with Folia region schedulers and Paper.',
    prompt: 'Create a professional high-tier plugin called "FoliaRTP" for Paper and Folia 1.21/26.2. It must use RegionScheduler and GlobalRegionScheduler for safe async world chunk searching, preventing server lag. Include cooldowns, sound effects, particle circles, and customizable safe radius in config.yml.',
    version: '26.2 (Next-Gen Paper)',
    platform: 'folia',
    tag: 'Folia Multi-thread'
  },
  {
    id: 'custom-gui-shop',
    title: 'UltraEconomy & Deluxe GUI Shop',
    category: 'Economy',
    description: 'Interactive virtual chest GUI shop with page navigation, Vault integration, sound feedback, and item buying/selling.',
    prompt: 'Create a top-level Minecraft plugin called "RexaShop" for Paper 1.21.4 with Vault economy hook. Build an interactive inventory GUI with custom item lore, categories (Minerals, Blocks, Farming), buy/sell price configuration in config.yml, and transaction confirmation sounds.',
    version: '1.21.4 (Latest Stable)',
    platform: 'paper',
    tag: 'Vault Economy'
  },
  {
    id: 'anti-grief-claim',
    title: 'AegisGuard Region Claims',
    category: 'Protection',
    description: 'Golden shovel claiming system with permission boundaries, explosion prevention, and chest protection.',
    prompt: 'Create a clean, optimized protection plugin called "AegisGuard" for Paper 1.21.4/26.2. Allow players to claim chunks using a claim tool, prevent TNT/Creeper griefing inside claims, protect containers from strangers, and show border particles when holding the claim tool.',
    version: '1.21.4 (Latest Stable)',
    platform: 'paper',
    tag: 'Land Protection'
  },
  {
    id: 'combat-tag-logger',
    title: 'PvPTag & Anti-Combat Log',
    category: 'PvP & Balance',
    description: 'Spawns an NPC or kills players if they disconnect during active combat, with action bar timer countdown.',
    prompt: 'Create a battle-tested "PvPTagX" plugin for Paper 1.21.4. Whenever players hit each other, tag them in combat for 15 seconds. Display an animated action bar countdown, block commands like /spawn or /tp, and drop their inventory if they disconnect while tagged.',
    version: '1.21.4 (Latest Stable)',
    platform: 'paper',
    tag: 'Competitive PvP'
  },
  {
    id: 'spigot-legacy-1-8',
    title: 'Legacy 1.8.8 Practice Knockback',
    category: 'Legacy Spigot',
    description: 'Faithful 1.8.8 combat physics tuner with customizable vertical/horizontal velocity modifiers.',
    prompt: 'Create a specialized Spigot 1.8.8 plugin called "LegacyKB" that lets server owners fine-tune horizontal and vertical player knockback, rod velocity, and hit delay for 1.8 practice PvP servers.',
    version: '1.8.8',
    platform: 'spigot',
    tag: 'Legacy 1.8.8'
  }
];

export const SAMPLE_ERROR_STACKTRACES = [
  {
    title: 'NullPointerException on PlayerJoinEvent',
    errorType: 'NullPointerException',
    log: `[14:23:05 ERROR]: Could not pass event PlayerJoinEvent to RexaPlugin v1.0.0
org.bukkit.event.EventException: null
	at org.bukkit.plugin.java.JavaPluginLoader$1.execute(JavaPluginLoader.java:310) ~[paper-1.21.4.jar:git-Paper-120]
	at org.bukkit.plugin.RegisteredListener.execute(RegisteredListener.java:70) ~[paper-1.21.4.jar:git-Paper-120]
	at org.bukkit.plugin.SimplePluginManager.fireEvent(SimplePluginManager.java:601) ~[paper-1.21.4.jar:git-Paper-120]
Caused by: java.lang.NullPointerException: Cannot invoke "org.bukkit.configuration.ConfigurationSection.getString(String)" because the return value of "org.bukkit.configuration.file.FileConfiguration.getConfigurationSection(String)" is null
	at com.rexa.plugin.listeners.JoinListener.onJoin(JoinListener.java:24) ~[RexaPlugin.jar:?]
	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:?]`
  },
  {
    title: 'plugin.yml InvalidPluginException: Main Class Not Found',
    errorType: 'InvalidPluginException',
    log: `[14:30:12 ERROR]: Could not load 'plugins/CustomEnchants.jar' in folder 'plugins'
org.bukkit.plugin.InvalidPluginException: java.lang.ClassNotFoundException: com.rexa.mystic.MysticEnchants
	at org.bukkit.plugin.java.JavaPluginLoader.loadPlugin(JavaPluginLoader.java:149) ~[paper-api-1.21.4-R0.1-SNAPSHOT.jar:?]
	at org.bukkit.plugin.SimplePluginManager.loadPlugin(SimplePluginManager.java:394) ~[paper-api-1.21.4-R0.1-SNAPSHOT.jar:?]
Caused by: java.lang.ClassNotFoundException: com.rexa.mystic.MysticEnchants
	at java.base/java.net.URLClassLoader.findClass(URLClassLoader.java:445) ~[?:?]
	at org.bukkit.plugin.java.PluginClassLoader.findClass0(PluginClassLoader.java:94) ~[paper-api-1.21.4-R0.1-SNAPSHOT.jar:?]`
  },
  {
    title: 'Folia Async Entity Interaction Thread Violation',
    errorType: 'IllegalStateException',
    log: `[14:35:44 ERROR]: Asynchronous entity track/teleport!
java.lang.IllegalStateException: Entity Teleport cannot be called asynchronously from thread: Thread-14
	at io.papermc.paper.threadedregions.RegionizedServer.checkThread(RegionizedServer.java:120) ~[folia-1.21.jar:git-Folia-52]
	at org.bukkit.craftbukkit.entity.CraftEntity.teleport(CraftEntity.java:598) ~[folia-1.21.jar:git-Folia-52]
	at com.rexa.folia.task.RtpTask.run(RtpTask.java:45) ~[FoliaRtp.jar:?]`
  }
];
