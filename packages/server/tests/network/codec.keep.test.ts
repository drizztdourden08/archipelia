/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { broadcastTargets } from '../../src/network/discovery/broadcast-targets';
import { gatewayCandidates } from '../../src/network/mapping/gateway-candidates';
import { assessCgnat } from '../../src/network/mapping/assess-cgnat';
import { buildNatpmpMapRequest } from '../../src/network/mapping/natpmp/build-natpmp-map-request';
import { readNatpmpMapping } from '../../src/network/mapping/natpmp/read-natpmp-mapping';
import { buildPcpMapRequest } from '../../src/network/mapping/pcp/build-pcp-map-request';
import { readPcpMapping } from '../../src/network/mapping/pcp/read-pcp-mapping';
import { readMdnsRecords } from '../../src/network/ports/read-mdns-records';

const NONCE = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

describe('the NAT-PMP wire format', () => {
  test('builds the exact NAT-PMP TCP mapping request', () => {
    expect([...buildNatpmpMapRequest('tcp', 38290, 38290, 3600)]).toEqual([0, 2, 0, 0, 0x95, 0x92, 0x95, 0x92, 0, 0, 0x0e, 0x10]);
    expect(buildNatpmpMapRequest('udp', 1, 2, 0)[1]).toBe(1);
  });

  test('reads a NAT-PMP mapping reply and refuses damaged ones', () => {
    const reply = new Uint8Array([0, 130, 0, 0, 0, 0, 0, 0, 0x95, 0x92, 0x95, 0x93, 0, 0, 0x0e, 0x10]);
    expect(readNatpmpMapping(reply, 'tcp', 38290)).toEqual({ ok: true, internalPort: 38290, externalPort: 38291, lifetime: 3600 });
    expect(readNatpmpMapping(reply, 'udp', 38290)).toBeNull();
    expect(readNatpmpMapping(reply, 'tcp', 1)).toBeNull();
    expect(readNatpmpMapping(reply.slice(0, 15), 'tcp', 38290)).toBeNull();
    expect(readNatpmpMapping(new Uint8Array(0), 'tcp', 38290)).toBeNull();
    expect(readNatpmpMapping(new Uint8Array([1, 130, 0, 0, 0, 0, 0, 0]), 'tcp', 38290)).toBeNull();
    expect(readNatpmpMapping(new Uint8Array([0, 130, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), 'tcp', 38290)).toEqual({ ok: false, code: 2 });
  });

});

describe('the PCP wire format', () => {
  test('builds the exact PCP MAP request', () => {
    const request = buildPcpMapRequest({ clientAddress: '192.168.1.20', nonce: NONCE, protocol: 'tcp', internalPort: 38290, externalPort: 38290, lifetime: 3600 });
    expect(request).toHaveLength(60);
    expect([...request.slice(0, 8)]).toEqual([2, 1, 0, 0, 0, 0, 0x0e, 0x10]);
    expect([...request.slice(18, 24)]).toEqual([0xff, 0xff, 192, 168, 1, 20]);
    expect([...request.slice(24, 36)]).toEqual([...NONCE]);
    expect([...request.slice(36, 44)]).toEqual([6, 0, 0, 0, 0x95, 0x92, 0x95, 0x92]);
  });

  test('reads a PCP reply only when the nonce, protocol and port match', () => {
    const request = buildPcpMapRequest({ clientAddress: '192.168.1.20', nonce: NONCE, protocol: 'tcp', internalPort: 38290, externalPort: 0, lifetime: 3600 });
    const reply = new Uint8Array(request);
    reply[1] = 0x81;
    new DataView(reply.buffer).setUint16(42, 40000);
    reply.set([0xff, 0xff, 203, 0, 113, 9], 54);
    expect(readPcpMapping(reply, NONCE, 'tcp', 38290)).toEqual({ ok: true, externalPort: 40000, externalAddress: '203.0.113.9', lifetime: 3600 });
    expect(readPcpMapping(reply, new Uint8Array(12), 'tcp', 38290)).toBeNull();
    expect(readPcpMapping(reply, NONCE, 'udp', 38290)).toBeNull();
    expect(readPcpMapping(reply, NONCE, 'tcp', 1)).toBeNull();
    expect(readPcpMapping(reply.slice(0, 59), NONCE, 'tcp', 38290)).toBeNull();
    expect(readPcpMapping(request, NONCE, 'tcp', 38290)).toBeNull();
    const refused = new Uint8Array(24);
    refused.set([2, 0x81, 0, 2]);
    expect(readPcpMapping(refused, NONCE, 'tcp', 38290)).toEqual({ ok: false, code: 2 });
    expect(readPcpMapping(new Uint8Array([0, 129, 0, 1, 0, 0, 0, 0]), NONCE, 'tcp', 38290)).toEqual({ ok: false, code: 1 });
    expect(readPcpMapping(new Uint8Array([9, 9, 9]), NONCE, 'tcp', 38290)).toBeNull();
  });

});

describe('addresses and records', () => {
  test('computes broadcast targets and gateway candidates from the interfaces', () => {
    const lan = [{ address: '192.168.1.20', netmask: '255.255.255.0' }, { address: '10.0.4.9', netmask: '255.255.0.0' }];
    expect(broadcastTargets(lan)).toEqual(['192.168.1.255', '10.0.255.255', '255.255.255.255']);
    expect(broadcastTargets([{ address: 'nope', netmask: '255.255.255.0' }])).toEqual(['255.255.255.255']);
    expect(gatewayCandidates(lan)).toEqual(['192.168.1.1', '192.168.1.254', '10.0.0.1', '10.0.255.254']);
    expect(gatewayCandidates([{ address: '192.168.1.1', netmask: '255.255.255.0' }])).toEqual(['192.168.1.254']);
    expect(gatewayCandidates([{ address: '192.168.1.2', netmask: '255.255.255.252' }])).toEqual(['192.168.1.1']);
    expect(gatewayCandidates([{ address: '192.168.1.2', netmask: '255.255.255.254' }])).toEqual([]);
  });

  test('classifies external addresses', () => {
    expect(assessCgnat('100.64.0.1', null)?.kind).toBe('shared-range');
    expect(assessCgnat('100.127.255.254', null)?.kind).toBe('shared-range');
    expect(assessCgnat('100.128.0.1', null)).toBeNull();
    expect(assessCgnat('172.20.0.1', null)?.kind).toBe('private-range');
    expect(assessCgnat('172.32.0.1', null)).toBeNull();
    expect(assessCgnat('203.0.113.9', null)).toBeNull();
    expect(assessCgnat(null, '203.0.113.9')).toBeNull();
  });

  test('bounds and filters mDNS records taken from the wire', () => {
    const flood = Array.from({ length: 200 }, (_, index) => ({ name: `h${index}.local`, type: 'A', ttl: 1, data: '10.0.0.1' }));
    expect(readMdnsRecords({ answers: flood })).toHaveLength(64);
    const mixed = readMdnsRecords({
      answers: [
        { name: 'a.local', type: 'AAAA', data: '::1' },
        { name: 'b.local', type: 'TXT', ttl: 5, data: [Buffer.from('k=v'), 'x'.repeat(300), 42] },
        { name: 'c.local', type: 'SRV', data: { port: 'x', target: 'y' } },
        { name: 'd'.repeat(300), type: 'A', data: '10.0.0.1' },
        null,
      ].filter((entry) => entry !== null),
      additionals: 'not a list',
    });
    expect(mixed).toEqual([{ name: 'b.local', type: 'TXT', ttl: 5, flush: false, data: ['k=v'] }]);
  });
});
