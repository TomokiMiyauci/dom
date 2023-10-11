/**
 * @throws {DOMException}
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/structured-data.html#structuredserializeinternal)
 */
export function StructuredSerializeInternal(
  value: unknown,
  forStorage: boolean,
  memory?: Map<unknown, unknown>,
) {
  // 1. If memory was not supplied, let memory be an empty map.
  memory ??= new Map();

  // 2. If memory[value] exists, then return memory[value].
  if (memory.has(value)) return memory.get(value);

  // 3. Let deep be false.
  let deep = false;

  // 4. If Type(value) is Undefined, Null, Boolean, Number, BigInt, or String, then return { [[Type]]: "primitive", [[Value]]: value }.

  // 5. If Type(value) is Symbol, then throw a "DataCloneError" DOMException.

  // 6. Let serialized be an uninitialized value.

  // 7. If value has a [[BooleanData]] internal slot, then set serialized to { [[Type]]: "Boolean", [[BooleanData]]: value.[[BooleanData]] }.

  // 8. Otherwise, if value has a [[NumberData]] internal slot, then set serialized to { [[Type]]: "Number", [[NumberData]]: value.[[NumberData]] }.

  // 9. Otherwise, if value has a [[BigIntData]] internal slot, then set serialized to { [[Type]]: "BigInt", [[BigIntData]]: value.[[BigIntData]] }.

  // 10. Otherwise, if value has a [[StringData]] internal slot, then set serialized to { [[Type]]: "String", [[StringData]]: value.[[StringData]] }.

  // 11. Otherwise, if value has a [[DateValue]] internal slot, then set serialized to { [[Type]]: "Date", [[DateValue]]: value.[[DateValue]] }.

  // 12. Otherwise, if value has a [[RegExpMatcher]] internal slot, then set serialized to { [[Type]]: "RegExp", [[RegExpMatcher]]: value.[[RegExpMatcher]], [[OriginalSource]]: value.[[OriginalSource]], [[OriginalFlags]]: value.[[OriginalFlags]] }.

  // 13. Otherwise, if value has an [[ArrayBufferData]] internal slot, then:
  // 1. If IsSharedArrayBuffer(value) is true, then:

  // 1. If the current settings object's cross-origin isolated capability is false, then throw a "DataCloneError" DOMException.
  // 2. If forStorage is true, then throw a "DataCloneError" DOMException.

  // 3. If value has an [[ArrayBufferMaxByteLength]] internal slot, then set serialized to { [[Type]]: "GrowableSharedArrayBuffer", [[ArrayBufferData]]: value.[[ArrayBufferData]], [[ArrayBufferByteLengthData]]: value.[[ArrayBufferByteLengthData]], [[ArrayBufferMaxByteLength]]: value.[[ArrayBufferMaxByteLength]], [[AgentCluster]]: the surrounding agent's agent cluster }.

  // 4. Otherwise, set serialized to { [[Type]]: "SharedArrayBuffer", [[ArrayBufferData]]: value.[[ArrayBufferData]], [[ArrayBufferByteLength]]: value.[[ArrayBufferByteLength]], [[AgentCluster]]: the surrounding agent's agent cluster }.

  // 2. Otherwise:

  // 1. If IsDetachedBuffer(value) is true, then throw a "DataCloneError" DOMException.

  // 2. Let size be value.[[ArrayBufferByteLength]].

  // 3. Let dataCopy be ? CreateByteDataBlock(size).

  // 4. Perform CopyDataBlockBytes(dataCopy, 0, value.[[ArrayBufferData]], 0, size).

  // 5. If value has an [[ArrayBufferMaxByteLength]] internal slot, then set serialized to { [[Type]]: "ResizableArrayBuffer", [[ArrayBufferData]]: dataCopy, [[ArrayBufferByteLength]]: size, [[ArrayBufferMaxByteLength]]: value.[[ArrayBufferMaxByteLength]] }.

  // 6. Otherwise, set serialized to { [[Type]]: "ArrayBuffer", [[ArrayBufferData]]: dataCopy, [[ArrayBufferByteLength]]: size }.

  // 14. Otherwise, if value has a [[ViewedArrayBuffer]] internal slot, then:

  // 1. If IsArrayBufferViewOutOfBounds(value) is true, then throw a "DataCloneError" DOMException.

  // 2. Let buffer be the value of value's [[ViewedArrayBuffer]] internal slot.

  // 3. Let bufferSerialized be ? StructuredSerializeInternal(buffer, forStorage, memory).

  // 4. Assert: bufferSerialized.[[Type]] is "ArrayBuffer", "ResizableArrayBuffer", "SharedArrayBuffer", or "GrowableSharedArrayBuffer".

  // 5. If value has a [[DataView]] internal slot, then set serialized to { [[Type]]: "ArrayBufferView", [[Constructor]]: "DataView", [[ArrayBufferSerialized]]: bufferSerialized, [[ByteLength]]: value.[[ByteLength]], [[ByteOffset]]: value.[[ByteOffset]] }.

  // 6. Otherwise:

  // 1. Assert: value has a [[TypedArrayName]] internal slot.

  // 2. Set serialized to { [[Type]]: "ArrayBufferView", [[Constructor]]: value.[[TypedArrayName]], [[ArrayBufferSerialized]]: bufferSerialized, [[ByteLength]]: value.[[ByteLength]], [[ByteOffset]]: value.[[ByteOffset]], [[ArrayLength]]: value.[[ArrayLength]] }.

  // 15. Otherwise, if value has [[MapData]] internal slot, then:

  // 1. Set serialized to { [[Type]]: "Map", [[MapData]]: a new empty List }.

  // 2. Set deep to true.

  // 16. Otherwise, if value has [[SetData]] internal slot, then:

  // 1. Set serialized to { [[Type]]: "Set", [[SetData]]: a new empty List }.

  // 2. Set deep to true.

  // 17. Otherwise, if value has an [[ErrorData]] internal slot and value is not a platform object, then:

  // 1. Let name be ? Get(value, "name").

  // 2. If name is not one of "Error", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", or "URIError", then set name to "Error".

  // 3. Let valueMessageDesc be ? value.[[GetOwnProperty]]("message").

  // 4. Let message be undefined if IsDataDescriptor(valueMessageDesc) is false, and ? ToString(valueMessageDesc.[[Value]]) otherwise.

  // 5. Set serialized to { [[Type]]: "Error", [[Name]]: name, [[Message]]: message }.

  // 6. User agents should attach a serialized representation of any interesting accompanying data which are not yet specified, notably the stack property, to serialized.
  // 18. Otherwise, if value is an Array exotic object, then:

  // 1. Let valueLenDescriptor be ? OrdinaryGetOwnProperty(value, "length").

  // 2. Let valueLen be valueLenDescriptor.[[Value]].

  // 3. Set serialized to { [[Type]]: "Array", [[Length]]: valueLen, [[Properties]]: a new empty List }.

  // 4. Set deep to true.

  // 19. Otherwise, if value is a platform object that is a serializable object:

  // 1. If value has a [[Detached]] internal slot whose value is true, then throw a "DataCloneError" DOMException.

  // 2. Let typeString be the identifier of the primary interface of value.

  // 3. Set serialized to { [[Type]]: typeString }.

  // 4. Set deep to true.

  // 20. Otherwise, if value is a platform object, then throw a "DataCloneError" DOMException.

  // 21. Otherwise, if IsCallable(value) is true, then throw a "DataCloneError" DOMException.

  // 22. Otherwise, if value has any internal slot other than [[Prototype]] or [[Extensible]], then throw a "DataCloneError" DOMException.

  // 23. Otherwise, if value is an exotic object and value is not the %Object.prototype% intrinsic object associated with any realm, then throw a "DataCloneError" DOMException.

  // 24. Otherwise:

  // 1. Set serialized to { [[Type]]: "Object", [[Properties]]: a new empty List }.

  // 2. Set deep to true.

  // 25. Set memory[value] to serialized.

  // 26. If deep is true, then:

  // 1. If value has a [[MapData]] internal slot, then:

  // 1. Let copiedList be a new empty List.

  // 2. For each Record { [[Key]], [[Value]] } entry of value.[[MapData]]:

  // 1. Let copiedEntry be a new Record { [[Key]]: entry.[[Key]], [[Value]]: entry.[[Value]] }.

  // 1. If copiedEntry.[[Key]] is not the special value empty, append copiedEntry to copiedList.

  // 3. For each Record { [[Key]], [[Value]] } entry of copiedList:

  // 1. Let serializedKey be ? StructuredSerializeInternal(entry.[[Key]], forStorage, memory).

  // 2. Let serializedValue be ? StructuredSerializeInternal(entry.[[Value]], forStorage, memory).

  // 3. Append { [[Key]]: serializedKey, [[Value]]: serializedValue } to serialized.[[MapData]].

  // 2. Otherwise, if value has a [[SetData]] internal slot, then:

  // 1. Let copiedList be a new empty List.

  // 2. For each entry of value.[[SetData]]:

  // 1. If entry is not the special value empty, append entry to copiedList.

  // 3. For each entry of copiedList:

  // 1. Let serializedEntry be ? StructuredSerializeInternal(entry, forStorage, memory).

  // 2. Append serializedEntry to serialized.[[SetData]].

  // 3. Otherwise, if value is a platform object that is a serializable object, then perform the serialization steps for value's primary interface, given value, serialized, and forStorage.

  // The serialization steps may need to perform a sub-serialization. This is an operation which takes as input a value subValue, and returns StructuredSerializeInternal(subValue, forStorage, memory). (In other words, a sub-serialization is a specialization of StructuredSerializeInternal to be consistent within this invocation.)

  // 4. Otherwise, for each key in ! EnumerableOwnProperties(value, key):

  // 1. If ! HasOwnProperty(value, key) is true, then:

  // 1. Let inputValue be ? value.[[Get]](key, value).

  // 2. Let outputValue be ? StructuredSerializeInternal(inputValue, forStorage, memory).

  // 3. Append { [[Key]]: key, [[Value]]: outputValue } to serialized.[[Properties]].

  // 27. Return serialized.
  return;
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/structured-data.html#structuredserialize)
 */
export function StructuredSerialize(value: unknown) {
  // 1. Return ? StructuredSerializeInternal(value, false).
  return StructuredSerializeInternal(value, false);
}

/**
 * @see [HTML Living Standard](https://html.spec.whatwg.org/multipage/structured-data.html#structuredserializeforstorage)
 */
export function StructuredSerializeForStorage(value: unknown) {
  // 1. Return ? StructuredSerializeInternal(value, true).
  return StructuredSerializeInternal(value, true);
}
