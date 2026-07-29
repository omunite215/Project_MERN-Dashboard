// Bun runtime compatibility shim — import FIRST at every entry point (before
// anything that pulls in mongoose/bson).
//
// Why: bson@7.3.1 (a mongoose transitive dependency) runs a static initializer
// in its `ObjectId` class that calls
//   process.getBuiltinModule("v8").startupSnapshot.isBuildingSnapshot()
// to detect Node's startup-snapshot build. Bun (1.3.5) exposes
// `node:v8` startupSnapshot but stubs `isBuildingSnapshot` to throw
// `ERR_NOT_IMPLEMENTED`, so merely importing mongoose crashes under the Bun
// runtime (and `bun test`). We are never building a V8 snapshot, so we replace
// that one method with a truthful `() => false`, leaving the rest of `node:v8`
// untouched. `require("node:v8") === process.getBuiltinModule("v8")` in Bun, so
// patching the module object here is what bson observes.
//
// Remove this shim once Bun implements `node:v8` startupSnapshot (or bson
// guards the call). It is a no-op on runtimes where the method already exists
// and does not throw.
import v8 from "node:v8";

const startupSnapshot = (v8 as unknown as { startupSnapshot?: Record<string, unknown> }).startupSnapshot;
if (startupSnapshot) {
  try {
    Object.defineProperty(startupSnapshot, "isBuildingSnapshot", {
      value: () => false,
      configurable: true,
      writable: true,
    });
  } catch {
    // If the property is locked down we can't patch it; the original import
    // error (if any) will surface with a clear message.
  }
}
