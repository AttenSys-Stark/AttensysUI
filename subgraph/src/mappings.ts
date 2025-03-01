import { Protobuf } from "as-proto/assembly";
import { Events as protoEvents } from "./pb/starknet/v1/Events";
import { MyEntity } from "../generated/schema";
import { BigInt, log, crypto, Bytes } from "@graphprotocol/graph-ts";

export function handleTriggers(bytes: Uint8Array): void {
  const input = Protobuf.decode<protoEvents>(bytes, protoEvents.decode);

  // No ID field has been found in the proto input...
  // The input has been hashed to create a unique ID, replace it with the field you want to use as ID
  const inputHash = crypto.keccak256(Bytes.fromUint8Array(bytes)).toHexString();
  let entity = new MyEntity(inputHash);

  entity.save();
}

import { CourseCreated, Transaction } from "../generated/schema";
import { CourseCreated as CourseCreatedEvent } from "../generated/YourContract/YourContract";

export function handleCourseCreated(event: CourseCreatedEvent): void {
  // Create a unique ID for the event
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  // Create a new CourseCreated entity
  let courseCreated = new CourseCreated(id);

  // Populate the entity with event data
  courseCreated.courseIdentifier = event.params.course_identifier.toString();
  courseCreated.owner = event.params.owner_.toHex();
  courseCreated.accessment = event.params.accessment_.toString();
  courseCreated.baseUri = event.params.base_uri.toString();
  courseCreated.name = event.params.name_.toString();
  courseCreated.symbol = event.params.symbol.toString();
  courseCreated.courseIpfsUri = event.params.course_ipfs_uri.toString();

  // Link to the transaction
  let transaction = new Transaction(event.transaction.hash.toHex());
  transaction.blockNumber = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.save();

  courseCreated.transaction = transaction.id;
  courseCreated.blockNumber = event.block.number;
  courseCreated.timestamp = event.block.timestamp;

  // Save the entity
  courseCreated.save();
}
