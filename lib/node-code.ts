import { createHash } from "crypto"

// what3words-style node codes: three words derived from the slug, so a node keeps its code
// across builds and doesn't depend on publication order. Renaming the slug changes the code.
// 128 words → 7 bits per word, ~2 million combinations.
const WORDS = [
  "amber", "anchor", "apex", "arc", "argon", "atlas", "aurora", "axis",
  "beacon", "binary", "blaze", "bloom", "bolt", "breeze", "bridge", "cable",
  "canyon", "carbon", "cedar", "cipher", "circuit", "cobalt", "comet", "copper",
  "coral", "cosmos", "crystal", "current", "delta", "drift", "dune", "echo",
  "ember", "engine", "falcon", "fern", "fiber", "flare", "flux", "forge",
  "fractal", "frost", "galaxy", "garnet", "glacier", "glow", "granite", "graph",
  "harbor", "helix", "horizon", "hollow", "indigo", "ion", "iris", "jade",
  "jet", "kernel", "lantern", "laser", "lattice", "lens", "lichen", "lumen",
  "lunar", "magnet", "maple", "matrix", "meadow", "meteor", "mirror", "module",
  "nebula", "neon", "nexus", "noble", "nova", "oak", "oasis", "onyx",
  "orbit", "origin", "oxide", "pebble", "photon", "pilot", "pixel", "plasma",
  "prism", "pulse", "quartz", "quasar", "radar", "raven", "reef", "relay",
  "ridge", "river", "rocket", "saffron", "sensor", "shard", "signal", "silica",
  "silver", "solar", "sonic", "spark", "spiral", "static", "stellar", "summit",
  "tandem", "tensor", "thunder", "tide", "titan", "token", "vapor", "vector",
  "velvet", "vertex", "violet", "volt", "wave", "willow", "zenith", "zephyr",
] as const

export function nodeCodeFor(slug: string): string {
  const bytes = createHash("sha256").update(slug).digest()
  return [0, 1, 2].map((i) => WORDS[bytes[i] % WORDS.length]).join(".")
}
