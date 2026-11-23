# luci-app-lokinet

LuCI frontend and procd integration for Lokinet 0.9.14 on OpenWrt.

## Package layout

Copy this directory into a LuCI feed/package location, for example:

    package/luci-app-lokinet/

Then add it to the build:

    make menuconfig
    # LuCI -> Applications -> luci-app-lokinet
    make package/luci-app-lokinet/compile V=s

The package depends on `lokinet` and `luci-base`.

## Configuration model

`/etc/config/lokinet` is the source of truth. The init script generates
`/var/lib/lokinet/lokinet.ini` immediately before starting Lokinet.

Repeated Lokinet INI keys are represented as UCI `list` entries. UCI option
names use underscores where the INI key uses hyphens.

## First installation / migration

1. Stop any manually launched Lokinet process before enabling the service.
2. Back up the existing `/var/lib/lokinet/lokinet.ini`.
3. Install `luci-app-lokinet`.
4. Review `/etc/config/lokinet`; the shipped defaults reflect the active values
   in the supplied sample configuration.
5. Enable and start the service:

       /etc/init.d/lokinet enable
       /etc/init.d/lokinet start

Do not run a second `lokinet` process manually after enabling procd.

## Notes

- The generator emits only options explicitly present in UCI.
- Boolean UCI values `1`/`0` are emitted as `true`/`false`.
- `ip6_range` can be explicitly set to an empty string to emit `ip6-range=`.
- The package does not modify firewall zones or policy routing. Those remain
  separate OpenWrt network/firewall configuration tasks.
