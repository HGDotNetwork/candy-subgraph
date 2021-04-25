import { BigInt } from "@graphprotocol/graph-ts"
import {
  Contract,
  Packetstarted,
  PacketClaimed,
  Packetended,
  ClaimedTokens,
  ClaimedPacketTokens,
  OwnershipTransferred
} from "../generated/Contract/Contract"
import { PackageEntity, PackageToken } from "../generated/schema"

export function handlePacketstarted(event: Packetstarted): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = PackageEntity.load(event.transaction.hash.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new PackageEntity(event.transaction.hash.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }
  let tokenEntity = PackageToken.load(event.params.tokenAddress.toHex())
  if(tokenEntity == null){
    tokenEntity = new PackageToken(event.params.tokenAddress.toHex())
    tokenEntity.total = BigInt.fromI32(0);
  }
  tokenEntity.total = tokenEntity.total.plus(event.params.total)
  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.total = event.params.total
  entity.tokenAddress = event.params.tokenAddress

  // Entities can be written to the store with `.save()`
  entity.save()
  tokenEntity.save()



  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.initialized(...)
  // - contract.getSecretPacketId(...)
  // - contract.version(...)
  // - contract.currentFee(...)
  // - contract.implementation(...)
  // - contract.upgradeabilityOwner(...)
  // - contract.isInBlackList(...)
  // - contract.getClaimedTimestamps(...)
  // - contract.getPacketAddresses(...)
  // - contract.owner(...)
  // - contract.packetLimit(...)
  // - contract.getUserPackets(...)
  // - contract.txCount(...)
  // - contract.packets(...)
  // - contract.getPacketAmounts(...)
  // - contract.getClaimedAmounts(...)
  // - contract.fee(...)
  // - contract.pendingOwner(...)
  // - contract.discountStep(...)
  // - contract.discountRate(...)
  // - contract.getSeedPacketId(...)
  // - contract.getMyAmount(...)
}

export function handlePacketClaimed(event: PacketClaimed): void {}

export function handlePacketended(event: Packetended): void {}

export function handleClaimedTokens(event: ClaimedTokens): void {}

export function handleClaimedPacketTokens(event: ClaimedPacketTokens): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
