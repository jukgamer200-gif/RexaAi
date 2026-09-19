import { PluginProject } from '../types';

export const INITIAL_PROJECT: PluginProject = {
  id: 'project-mystic-enchants-26',
  name: 'MysticEnchants',
  version: '1.0.0',
  apiVersion: '26.2',
  minecraftVersion: '26.2 (Next-Gen Paper)',
  platform: 'paper',
  javaVersion: '21',
  mainClass: 'com.rexa.enchants.MysticEnchants',
  packageName: 'com.rexa.enchants',
  description: 'Next-Gen Paper 26.2 custom enchantment suite featuring LightningStrike, Lifesteal, and Telepathy with MiniMessage formatting.',
  author: 'Rexa AI & You',
  buildStatus: 'ready',
  lastGeneratedAt: new Date().toISOString(),
  commands: [
    {
      name: 'mystic',
      description: 'Manage MysticEnchants custom gear and reload configurations',
      permission: 'mysticenchants.admin',
      usage: '/mystic <give|reload|list>'
    }
  ],
  permissions: [
    {
      node: 'mysticenchants.admin',
      description: 'Allows administration of MysticEnchants',
      default: 'op'
    },
    {
      node: 'mysticenchants.use',
      description: 'Allows triggering custom enchantments in combat/mining',
      default: 'true'
    }
  ],
  files: [
    {
      path: 'src/main/java/com/rexa/enchants/MysticEnchants.java',
      language: 'java',
      content: `package com.rexa.enchants;

import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.Bukkit;
import org.bukkit.NamespacedKey;
import org.bukkit.plugin.java.JavaPlugin;

/**
 * MysticEnchants - Architected by Rexa AI
 * Target: PaperMC 26.2 / 1.21+ (Java 21)
 */
public final class MysticEnchants extends JavaPlugin {

    private static MysticEnchants instance;
    private final MiniMessage miniMessage = MiniMessage.miniMessage();
    private NamespacedKey enchantKey;

    @Override
    public void onEnable() {
      instance = this;
      saveDefaultConfig();
      this.enchantKey = new NamespacedKey(this, "mystic_enchant_type");

      // Register Events
      getServer().getPluginManager().registerEvents(new EnchantListener(this), this);

      // Register Commands & Tab Completer
      MysticCommand commandExecutor = new MysticCommand(this);
      if (getCommand("mystic") != null) {
          getCommand("mystic").setExecutor(commandExecutor);
          getCommand("mystic").setTabCompleter(commandExecutor);
      }

      getLogger().info("=========================================");
      getLogger().info(" MysticEnchants v1.0.0 enabled successfully!");
      getLogger().info(" Running on Paper 26.2 (Next-Gen Adventure Engine)");
      getLogger().info(" Architected by Rexa AI");
      getLogger().info("=========================================");
    }

    @Override
    public void onDisable() {
      getLogger().info("MysticEnchants disabled cleanly.");
    }

    public static MysticEnchants getInstance() {
      return instance;
    }

    public MiniMessage getMiniMessage() {
      return miniMessage;
    }

    public NamespacedKey getEnchantKey() {
      return enchantKey;
    }
}
`
    },
    {
      path: 'src/main/java/com/rexa/enchants/EnchantListener.java',
      language: 'java',
      content: `package com.rexa.enchants;

import net.kyori.adventure.text.Component;
import org.bukkit.Location;
import org.bukkit.Material;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.block.Block;
import org.bukkit.entity.LivingEntity;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.block.BlockBreakEvent;
import org.bukkit.event.entity.EntityDamageByEntityEvent;
import org.bukkit.inventory.ItemStack;
import org.bukkit.persistence.PersistentDataContainer;
import org.bukkit.persistence.PersistentDataType;

import java.util.Collection;
import java.util.Random;

public class EnchantListener implements Listener {

    private final MysticEnchants plugin;
    private final Random random = new Random();

    public EnchantListener(MysticEnchants plugin) {
      this.plugin = plugin;
    }

    @EventHandler(priority = EventPriority.HIGH, ignoreCancelled = true)
    public void onEntityHit(EntityDamageByEntityEvent event) {
      if (!(event.getDamager() instanceof Player attacker)) return;
      if (!(event.getEntity() instanceof LivingEntity victim)) return;

      ItemStack weapon = attacker.getInventory().getItemInMainHand();
      if (weapon.getType() == Material.AIR || !weapon.hasItemMeta()) return;

      PersistentDataContainer pdc = weapon.getItemMeta().getPersistentDataContainer();
      String enchantType = pdc.get(plugin.getEnchantKey(), PersistentDataType.STRING);

      if ("LIGHTNING".equalsIgnoreCase(enchantType)) {
          int chance = plugin.getConfig().getInt("enchants.lightning.chance", 25);
          if (random.nextInt(100) < chance) {
              Location loc = victim.getLocation();
              victim.getWorld().strikeLightningEffect(loc);
              event.setDamage(event.getDamage() + 4.0);

              Component msg = plugin.getMiniMessage().deserialize(
                  plugin.getConfig().getString("messages.lightning_trigger", "<gradient:#facc15:#ca8a04>⚡ Lightning struck your foe!</gradient>")
              );
              attacker.sendMessage(msg);
              attacker.playSound(loc, Sound.ENTITY_LIGHTNING_BOLT_THUNDER, 1.0f, 1.2f);
          }
      } else if ("LIFESTEAL".equalsIgnoreCase(enchantType)) {
          int chance = plugin.getConfig().getInt("enchants.lifesteal.chance", 30);
          if (random.nextInt(100) < chance) {
              double healAmount = 2.0;
              double newHealth = Math.min(attacker.getHealth() + healAmount, attacker.getMaxHealth());
              attacker.setHealth(newHealth);
              attacker.spawnParticle(Particle.HEART, attacker.getLocation().add(0, 1.5, 0), 5, 0.3, 0.3, 0.3);
          }
      }
    }

    @EventHandler(priority = EventPriority.NORMAL, ignoreCancelled = true)
    public void onBlockBreak(BlockBreakEvent event) {
      Player player = event.getPlayer();
      ItemStack tool = player.getInventory().getItemInMainHand();
      if (!tool.hasItemMeta()) return;

      PersistentDataContainer pdc = tool.getItemMeta().getPersistentDataContainer();
      String enchantType = pdc.get(plugin.getEnchantKey(), PersistentDataType.STRING);

      if ("TELEPATHY".equalsIgnoreCase(enchantType)) {
          Block block = event.getBlock();
          Collection<ItemStack> drops = block.getDrops(tool);
          event.setDropItems(false);

          for (ItemStack drop : drops) {
              var overflow = player.getInventory().addItem(drop);
              for (ItemStack remaining : overflow.values()) {
                  block.getWorld().dropItemNaturally(player.getLocation(), remaining);
              }
          }
      }
    }
}
`
    },
    {
      path: 'src/main/java/com/rexa/enchants/MysticCommand.java',
      language: 'java',
      content: `package com.rexa.enchants;

import net.kyori.adventure.text.Component;
import org.bukkit.Material;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.ItemMeta;
import org.bukkit.persistence.PersistentDataType;

import java.util.ArrayList;
import java.util.List;

public class MysticCommand implements CommandExecutor, TabCompleter {

    private final MysticEnchants plugin;

    public MysticCommand(MysticEnchants plugin) {
      this.plugin = plugin;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
      if (args.length == 0 || "help".equalsIgnoreCase(args[0])) {
          sender.sendMessage(plugin.getMiniMessage().deserialize("<gradient:#a855f7:#6366f1><bold>MysticEnchants v1.0.0 by Rexa AI</bold></gradient>"));
          sender.sendMessage(plugin.getMiniMessage().deserialize("<gray>/mystic give <lightning|lifesteal|telepathy></gray>"));
          sender.sendMessage(plugin.getMiniMessage().deserialize("<gray>/mystic reload</gray>"));
          return true;
      }

      if ("reload".equalsIgnoreCase(args[0])) {
          if (!sender.hasPermission("mysticenchants.admin")) {
              sender.sendMessage(plugin.getMiniMessage().deserialize("<red>No permission.</red>"));
              return true;
          }
          plugin.reloadConfig();
          sender.sendMessage(plugin.getMiniMessage().deserialize("<gradient:#34d399:#059669>✔ Configuration reloaded successfully!</gradient>"));
          return true;
      }

      if ("give".equalsIgnoreCase(args[0]) && sender instanceof Player player) {
          if (!player.hasPermission("mysticenchants.admin")) {
              player.sendMessage(plugin.getMiniMessage().deserialize("<red>No permission.</red>"));
              return true;
          }
          String type = args.length > 1 ? args[1].toUpperCase() : "LIGHTNING";
          ItemStack sword = new ItemStack(Material.NETHERITE_SWORD);
          ItemMeta meta = sword.getItemMeta();
          meta.displayName(plugin.getMiniMessage().deserialize("<gradient:#f59e0b:#d97706><bold>⚡ Stormforged Blade</bold></gradient>"));
          meta.getPersistentDataContainer().set(plugin.getEnchantKey(), PersistentDataType.STRING, type);
          sword.setItemMeta(meta);

          player.getInventory().addItem(sword);
          player.sendMessage(plugin.getMiniMessage().deserialize("<green>Received custom " + type + " sword!</green>"));
          return true;
      }

      return true;
    }

    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args) {
      List<String> list = new ArrayList<>();
      if (args.length == 1) {
          list.add("give");
          list.add("reload");
          list.add("help");
      } else if (args.length == 2 && "give".equalsIgnoreCase(args[0])) {
          list.add("lightning");
          list.add("lifesteal");
          list.add("telepathy");
      }
      return list;
    }
}
`
    },
    {
      path: 'src/main/resources/plugin.yml',
      language: 'yaml',
      content: `name: MysticEnchants
version: '1.0.0'
main: com.rexa.enchants.MysticEnchants
api-version: '1.21'
prefix: MysticEnchants
authors: [RexaAI, TubeStudio]
description: Next-Gen Paper 26.2 Custom Enchantment Suite
website: https://ai.studio

commands:
  mystic:
    description: Master command for MysticEnchants
    permission: mysticenchants.admin
    usage: /<command> [give|reload|help]

permissions:
  mysticenchants.admin:
    description: Full administration access
    default: op
  mysticenchants.use:
    description: Trigger custom enchantments
    default: true
`
    },
    {
      path: 'src/main/resources/config.yml',
      language: 'yaml',
      content: `# MysticEnchants Configuration
# Generated by Rexa AI for Paper 26.2 / 1.21+

enchants:
  lightning:
    chance: 25 # Trigger percentage on hit
    damage_bonus: 4.0
  lifesteal:
    chance: 30
    heal_amount: 2.0
  telepathy:
    enabled: true

messages:
  lightning_trigger: "<gradient:#facc15:#ca8a04>⚡ Lightning struck your foe!</gradient>"
  lifesteal_trigger: "<gradient:#f43f5e:#be123c>♥ Lifesteal activated! Health restored.</gradient>"
`
    },
    {
      path: 'pom.xml',
      language: 'xml',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.rexa.enchants</groupId>
    <artifactId>MysticEnchants</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>MysticEnchants</name>
    <description>Paper 26.2 Custom Enchants Suite by Rexa AI</description>

    <properties>
        <java.version>21</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <repositories>
        <repository>
            <id>papermc-repo</id>
            <url>https://repo.papermc.io/repository/maven-public/</url>
        </repository>
    </repositories>

    <dependencies>
        <dependency>
            <groupId>io.papermc.paper</groupId>
            <artifactId>paper-api</artifactId>
            <version>1.21.4-R0.1-SNAPSHOT</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.13.0</version>
                <configuration>
                    <source>\${java.version}</source>
                    <target>\${java.version}</target>
                </configuration>
            </plugin>
        </plugins>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
            </resource>
        </resources>
    </build>
</project>
`
    },
    {
      path: 'README.md',
      language: 'markdown',
      content: `# MysticEnchants v1.0.0
> **Architected by Rexa AI** — The premier Minecraft Plugin Maker.

## Features
- **Lightning Strike:** 25% chance on sword hit to strike lightning effect and inflict bonus damage.
- **Lifesteal:** 30% chance to regenerate player hearts on hit.
- **Telepathy:** Mined block drops go directly into the player's inventory.
- **Paper 26.2 Ready:** Adventure MiniMessage text gradients & PersistentDataContainer (PDC) storage.

## Commands
- \`/mystic give <lightning|lifesteal|telepathy>\` - Gives a custom enchanted sword.
- \`/mystic reload\` - Reloads \`config.yml\`.

## Installation
1. Download \`MysticEnchants-1.0.0.jar\`.
2. Drag into your server's \`plugins/\` folder.
3. Restart or run \`/reload confirm\`.
`
    }
  ]
};
