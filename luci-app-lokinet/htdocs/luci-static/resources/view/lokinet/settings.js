'use strict';
'require view';
'require form';
'require uci';

function addValue(s, key, title, description, datatype) {
	var o = s.option(form.Value, key, title, description);
	if (datatype)
		o.datatype = datatype;
	return o;
}

function addFlag(s, key, title, description, defaultValue) {
	var o = s.option(form.Flag, key, title, description);
	o.rmempty = false;
	if (defaultValue !== undefined)
		o.default = defaultValue;
	return o;
}

function addList(s, key, title, description) {
	var o = s.option(form.DynamicList, key, title, description);
	o.rmempty = true;
	return o;
}

function addSelect(s, key, title, values, description) {
	var o = s.option(form.ListValue, key, title, description);
	values.forEach(function(v) { o.value(v[0], v[1]); });
	return o;
}

return view.extend({
	load: function() {
		return Promise.all([uci.load('lokinet'), uci.load('network')]);
	},

	render: function() {
		var m = new form.Map('lokinet',
			_('Lokinet'),
			_('Lokinet configuration. Settings are stored in UCI and rendered to /var/lib/lokinet/lokinet.ini.'));

		var s = m.section(form.NamedSection, 'router', 'router', _('Router'));
		s.anonymous = true;
		addSelect(s, 'netid', _('Network ID'), [
			['lokinet', 'lokinet (mainnet)'],
			['gamma', 'gamma (testnet)']
		]);
		addValue(s, 'min_connections', _('Minimum connections'), null, 'uinteger');
		addValue(s, 'max_connections', _('Maximum connections'), null, 'uinteger');
		addValue(s, 'data_dir', _('Data directory'));
		addValue(s, 'worker_threads', _('Worker threads'),
			_('0 means use the number of logical CPU cores.'), 'uinteger');

		s = m.section(form.NamedSection, 'network', 'network', _('Network'));
		s.anonymous = true;
		addList(s, 'strict_connect', _('Strict first-hop routers'),
			_('Pinned router public keys. Lokinet requires at least two entries.'));
		addValue(s, 'keyfile', _('Persistent private key file'));
		addSelect(s, 'auth', _('Endpoint authentication'), [
			['none', 'none'], ['whitelist', 'whitelist'], ['lmq', 'lmq'], ['file', 'file']
		]);
		addValue(s, 'auth_lmq', _('Authentication LMQ endpoint'));
		addValue(s, 'auth_lmq_method', _('Authentication LMQ method'));
		addList(s, 'auth_whitelist', _('Authentication whitelist'));
		addList(s, 'auth_file', _('Authentication files'));
		addSelect(s, 'auth_file_type', _('Authentication file type'), [
			['hashes', 'hashes'], ['plaintext', 'plaintext']
		]);
		addList(s, 'auth_static', _('Static authentication tokens'));
		addFlag(s, 'reachable', _('Publish introset as reachable'));
		addValue(s, 'hops', _('Path hops'), _('Allowed range: 1–8.'), 'range(1,8)');
		addValue(s, 'paths', _('Number of paths'), null, 'uinteger');
		addFlag(s, 'exit', _('Operate as an exit node'));
		addValue(s, 'owned_range', _('Owned IP range'), null, 'cidr4');
		addList(s, 'traffic_whitelist', _('Traffic whitelist'));
		addList(s, 'exit_node', _('Exit nodes'),
			_('One entry per line; optionally append :IP/CIDR to map a range.'));
		addList(s, 'exit_auth', _('Exit authentication'));
		addFlag(s, 'auto_routing', _('Automatic route configuration'), null, '0');
		addFlag(s, 'blackhole_routes', _('Blackhole routes'));
		addValue(s, 'ifname', _('Tunnel interface name'));
		addValue(s, 'ifaddr', _('Tunnel interface address'), null, 'cidr4');
		addValue(s, 'ip6_range', _('IPv6 exit range'),
			_('Set an empty value to disable IPv6 tunnelling. Disabling it while IPv6 routes exist can leak traffic.'));
		addList(s, 'mapaddr', _('Static .loki address mappings'));
		addList(s, 'blacklist_snode', _('Service nodes to avoid'));
		addList(s, 'srv', _('DNS SRV records'));
		addValue(s, 'path_alignment_timeout', _('Path alignment timeout'), null, 'uinteger');
		addValue(s, 'persist_addrmap_file', _('Persistent address map file'));

		s = m.section(form.NamedSection, 'paths', 'paths', _('Path selection'));
		s.anonymous = true;
		addValue(s, 'unique_range_size', _('Unique IPv4 range size'),
			_('Netmask size used to keep routers in distinct IPv4 subnets.'), 'range(0,32)');

		s = m.section(form.NamedSection, 'dns', 'dns', _('DNS'));
		s.anonymous = true;
		addList(s, 'upstream', _('Upstream resolvers'));
		addFlag(s, 'l3_intercept', _('Intercept DNS on the tunnel interface'));
		addValue(s, 'bind', _('DNS listen address'), _('For example: 127.3.2.1:53'));
		addList(s, 'add_hosts', _('Additional hosts files'));
		addFlag(s, 'no_resolvconf', _('Do not modify resolvconf'));

		s = m.section(form.NamedSection, 'bind', 'bind', _('Socket binding'));
		s.anonymous = true;
		addSelect(s, 'outbound_mode', _('Outbound binding mode'), [
			['manual', _('Manual address')],
			['interface', _('Use interface IPv4 address')]
		]);
		var outbound = addValue(s, 'outbound', _('Outbound bind address'),
			_('IP address and optional port, for example 192.0.2.10:9000.'));
		outbound.depends('outbound_mode', 'manual');
		var outboundInterface = s.option(form.ListValue, 'outbound_interface',
			_('Outbound network interface'),
			_('Select a logical OpenWrt interface, such as wan. Its current IPv4 address is used.'));
		outboundInterface.depends('outbound_mode', 'interface');
		outboundInterface.rmempty = false;
		uci.sections('network', 'interface').forEach(function(iface) {
			var name = iface['.name'];
			outboundInterface.value(name, name);
		});

		s = m.section(form.NamedSection, 'api', 'api', _('JSON API'));
		s.anonymous = true;
		addFlag(s, 'enabled', _('Enable API'));
		addValue(s, 'bind', _('API bind URI'),
			_('Prefer a localhost-only address unless remote access is required.'));

		s = m.section(form.NamedSection, 'bootstrap', 'bootstrap', _('Bootstrap'));
		s.anonymous = true;
		addFlag(s, 'seed_node', _('Run as a seed node'));
		addList(s, 'add_node', _('Bootstrap files'));

		s = m.section(form.NamedSection, 'logging', 'logging', _('Logging'));
		s.anonymous = true;
		addSelect(s, 'type', _('Log output type'), [
			['print', 'print'], ['system', 'system'], ['file', 'file']
		]);
		addSelect(s, 'level', _('Log level'), [
			['trace', 'trace'], ['debug', 'debug'], ['info', 'info'],
			['warn', 'warn'], ['error', 'error'], ['critical', 'critical'], ['none', 'none']
		]);
		addValue(s, 'file', _('Log file path'));

		return m.render();
	},

});
