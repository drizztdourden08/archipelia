#!/bin/sh
# @layer tooling-scripts @kind build
set -e
mkdir -p /etc/archipelia
if [ ! -f /etc/archipelia/server.toml ]; then
  cat > /etc/archipelia/server.toml <<'TOML'
port = 38290
network = "lan"
publicLookup = true

[engine]
auto = true

[tls]
selfSigned = true
TOML
  chmod 0644 /etc/archipelia/server.toml
fi
ln -sf /opt/archipelia/bin/archipelia-server /usr/local/bin/archipelia-server
