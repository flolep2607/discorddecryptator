/**
 * @name CRYPTATOR
 * @author Flo
 * @authorId 566580404279181341
 */

var script1 = document.createElement("script");
script1.type = "text/javascript";
script1.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js";
document.head.appendChild(script1);

module.exports = (_ => {
    const config = {
        "info": {
            "name": "CRYPTATOR",
            "author": "Flo",
            "version": "0.0.1",
            "description": "Decrypt message"
        }
    };
    return !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
        getName() {
            return config.info.name;
        }
        getAuthor() {
            return config.info.author;
        }
        getVersion() {
            return config.info.version;
        }
        getDescription() {
            return config.info.description;
        }

        load() {
            if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, {
                pluginQueue: []
            });
            if (!window.BDFDB_Global.downloadModal) {
                window.BDFDB_Global.downloadModal = true;
                BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click "Download Now" to install it.`, {
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onCancel: _ => {
                        delete window.BDFDB_Global.downloadModal;
                    },
                    onConfirm: _ => {
                        delete window.BDFDB_Global.downloadModal;
                        require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
                            if (!e && b && b.indexOf(`* @name BDFDB`) > -1) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => {});
                            else BdApi.alert("Error", "Could not download BDFDB library plugin, try again some time later.");
                        });
                    }
                });
            }
            if (!window.BDFDB_Global.pluginQueue.includes(config.info.name)) window.BDFDB_Global.pluginQueue.push(config.info.name);
        }
        start() {
            this.load();
        }
        stop() {}
        getSettingsPanel() {
            let template = document.createElement("template");
            template.innerHTML = `<div style="color: var(--header-primary); font-size: 16px; font-weight: 300; white-space: pre; line-height: 22px;">The library plugin needed for ${config.info.name} is missing.\nPlease click <a style="font-weight: 500;">Download Now</a> to install it.</div>`;
            template.content.firstElementChild.querySelector("a").addEventListener("click", _ => {
                require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
                    if (!e && b && b.indexOf(`* @name BDFDB`) > -1) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => {});
                    else BdApi.alert("Error", "Could not download BDFDB library plugin, try again some time later.");
                });
            });
            return template.content.firstElementChild;
        }
    } : (([Plugin, BDFDB]) => {
        return class CryptonaTor extends Plugin {
            onLoad() {
                this.patchedModules = {
                    before: {
                        ChannelTextAreaForm: "render",
                        ChannelEditorContainer: "render"
                        // ChannelTextAreaContainer: "render"
                    },
                    after: {
                        Messages: "type",
                        ChannelTextAreaForm: "render",
                        ChannelTextAreaContainer: "render",
                        Attachment: "default",
                        MessageContextMenu: "render"
                    }
                };
                this.defaults = {
                    settings: {
                        autocrypt: []
                    }
                };
            }
            onStop() {
                BDFDB.PatchUtils.forceAllUpdates(this);
            }
            decrypt(msg, key) {
                var code = CryptoJS.AES.decrypt(msg, key);
                try {
                    var decryptedMessage = code.toString(CryptoJS.enc.Utf8);
                    return decryptedMessage;
                } catch (err) {
                    return "🔓ENCRYPTED MESSAGE WITHOUT THE GOOD KEY HUMM🔓"
                }
            }
            processMessages(e) {
                let messagesIns = e.returnvalue.props.children;
                if (BDFDB.ObjectUtils.is(messagesIns.props.messages) && BDFDB.ArrayUtils.is(messagesIns.props.messages._array)) {
                    let messages = messagesIns.props.messages;
                    messages._array.forEach((msg, index) => {
                        if (msg.content.startsWith("🔒")) {
                            let decrypted = this.decrypt(msg.content.substring(2), msg.author.id);
                            messages._array[index].content = "🔓 :+1: " + decrypted;
                        }
                    });
                }
            }
            onStart() {
                BDFDB.PatchUtils.forceAllUpdates(this);
            }
        };
    })(window.BDFDB_Global.PluginUtils.buildPlugin(config));
})();
