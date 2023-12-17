// NOTE: This function intentionally does not check to see whether or not a
// filesystem path or `localStorage` key is valid. Its only job is to
// concatenate path parts.

const { replaceAll } = require("../../helpers")

function safePathJoin() {
  const parts = Array.from(arguments)

  return parts
    .map((p, i) => {
      p = replaceAll(p, /\/+/g, "/")

      if (i > 0) {
        p = p.replace(/^\//g, "")
      }

      p = p.replace(/\/$/g, "")
      return p.trim()
    })
    .filter((p, i) => (i > 0 ? !!p : true))
    .join("/")
}

module.exports = safePathJoin