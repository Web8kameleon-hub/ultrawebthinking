import { runCore } from "./core"
import assert from "assert"

const input = "Çfarë është Web8?"
const response = runCore(input)

assert.ok(response.includes("Web8"), "Pritet të përmbajë fjalën 'Web8'")
console.log("✅ core.test.ts kaloi me sukses.")
