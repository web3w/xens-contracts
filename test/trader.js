const ENS = artifacts.require('./registry/ENSRegistry');
const BaseRegistrar = artifacts.require('./registrar/BaseRegistrarImplementation');

const namehash = require('eth-ens-namehash');
const sha3 = require('web3-utils').sha3;
const toBN = require('web3-utils').toBN;

const { evm, exceptions } = require("./test-utils");


const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";

contract('Trader BaseRegistrar', function (accounts) {
	const ownerAccount = accounts[0];
	const controllerAccount = accounts[1];
	const registrantAccount = accounts[2];
	const otherAccount = accounts[3];

	let ens;
	let registrar;

	before(async () => {
		ens = await ENS.new();
        console.log("Test ens",ens.address)
		registrar = await BaseRegistrar.new("name", "N", ens.address, namehash.hash('eth'), {from: ownerAccount});
		await registrar.addController(controllerAccount, {from: ownerAccount});
		await ens.setSubnodeOwner('0x0', sha3('eth'), registrar.address);
	});

	it('should allow new registrations', async () => {
		var tx = await registrar.register(sha3("newname"), registrantAccount, 86400, {from: controllerAccount});
		var block = await web3.eth.getBlock(tx.receipt.blockHash);
		assert.equal(await ens.owner(namehash.hash("newname.eth")), registrantAccount);
		assert.equal(await registrar.ownerOf(sha3("newname")), registrantAccount);
		assert.equal((await registrar.nameExpires(sha3("newname"))).toNumber(), block.timestamp + 86400);
	});

	it('should allow registrations without updating the registry', async () => {
		var tx = await registrar.registerOnly(sha3("silentname"), registrantAccount, 86400, {from: controllerAccount});
		var block = await web3.eth.getBlock(tx.receipt.blockHash);
		assert.equal(await ens.owner(namehash.hash("silentname.eth")), ZERO_ADDRESS);
		assert.equal(await registrar.ownerOf(sha3("silentname")), registrantAccount);
		assert.equal((await registrar.nameExpires(sha3("silentname"))).toNumber(), block.timestamp + 86400);
	});

	it('should allow renewals', async () => {
		var oldExpires = await registrar.nameExpires(sha3("newname"));
		await registrar.renew(sha3("newname"), 86400, {from: controllerAccount});
		assert.equal((await registrar.nameExpires(sha3("newname"))).toNumber(), oldExpires.add(toBN(86400)).toNumber());
	});

	it('should only allow the controller to register', async () => {
		await exceptions.expectFailure(registrar.register(sha3("foo"), otherAccount, 86400, {from: otherAccount}));
	});

	 
});
