include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI support for Lokinet
LUCI_DEPENDS:=+luci-base +lokinet
LUCI_PKGARCH:=all

PKG_VERSION:=1.0.0
PKG_RELEASE:=1

# call BuildPackage - OpenWrt buildroot signature
include $(TOPDIR)/feeds/luci/luci.mk
