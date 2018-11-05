Skills tracker for [The Crime Factory](http://www.crime.ee) - browser-based online role-playing game.

[Live instance](http://keijo.ee/tcf-stats)


# Installation

Quick start on Ubuntu 18.04:

```
apt install nodejs npm build-essential libsystemd-dev couchdb

npm install https://github.com/keijokapp/tcf-stats

tcf-stats /path/to/config.json
```

You can use [config_sample.json](config_sample.json) as a base configuration file.

 | Option | Description |
 |--------|-------------|
 | `listen` | Listener configuration - `"systemd"` in case of Systemd socket |
 | `listen.port`, `listen.address` | Listen address (optional) and port |
 | `listen.path`, `listen.mode` | UNIX socket path and mode (optional) |
 | `appUrl` | Public (related to other components) URL prefix of the application |
 | `database` | Database URL (CouchDB) or location on disk (LevelDB) |



Install as Systemd service:
```
[ -e /etc/tcf-stats/config.json ] || \
    install -D "$(npm root -g)"/tcf-stats/config_sample.json \
    /etc/tcf-stats/config.json
install -D "$(npm root -g)/tcf-stats/tcf-stats.service" /usr/local/lib/systemd/system/tcf-stats.service
systemctl daemon-reload
systemctl enable tcf-stats
systemctl start tcf-stats

```


# Licence

Mainly MIT. However, UI theme is probably property of NetFly OÜ - the company running the game.
