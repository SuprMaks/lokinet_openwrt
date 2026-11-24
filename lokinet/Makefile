include $(TOPDIR)/rules.mk

PKG_NAME:=lokinet
PKG_VERSION:=0.9.15
PKG_RELEASE:=1

PKG_LICENSE:=MIT

PKG_SOURCE_URL:=https://github.com/oxen-io/lokinet.git
PKG_SOURCE_PROTO:=git
PKG_SOURCE_VERSION:=b29ca9773a14c3c6d46ab6be833c64699e66f227

#PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)

PKG_BUILD_DEPENDS:=libsodium libunbound libevent2 zstd

include $(INCLUDE_DIR)/package.mk

#CMAKE_BINARY_DIR:=$(PKG_BUILD_DIR)/build
CMAKE_BINARY_SUBDIR:=build

include $(INCLUDE_DIR)/cmake.mk

CMAKE_OPTIONS += \
	-DCMAKE_BUILD_TYPE=Release \
	-DCMAKE_POLICY_VERSION_MINIMUM=3.5 \
	-DBUILD_DAEMON=ON \
	-DBUILD_GUI=OFF \
	-DBUILD_LIBLOKINET=ON \
	-DNATIVE_BUILD=OFF \
	-DWITH_TESTS=OFF \
	-DWITH_HIVE=OFF \
	-DWITH_PEERSTATS=OFF \
	-DBUILD_PACKAGE=OFF \
	-DUSE_JEMALLOC=OFF \
	-DWITH_SYSTEMD=OFF \
	-DWITH_BOOTSTRAP=ON \
	-DBUILD_STATIC_DEPS=OFF \
	-DSTATIC_LINK=OFF \
	-DBUILD_SHARED_LIBS=OFF \
	-DSUBMODULE_CHECK=OFF \
	-DLOKINET_STRIP=ON

define Package/lokinet
	SECTION:=net
	CATEGORY:=Network
	TITLE:=$(PKG_NAME)
	URL:=https://github.com/oxen-io/lokinet
	DEPENDS:=+libstdcpp +libsodium +libunbound +libevent2 +libzstd +libcurl +libuv
endef

define Package/lokinet/description
	Lokinet is an anonymous decentralized IP-based overlay network.
endef

define Build/Prepare
	$(Build/Prepare/Default)
endef

define Package/lokinet/install
	$(CP) $(PKG_INSTALL_DIR)/* $(1)/
endef

$(eval $(call BuildPackage,lokinet))
