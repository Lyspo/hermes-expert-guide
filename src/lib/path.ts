/**
 * Normalises a content-collections `_meta.path` to forward slashes.
 *
 * content-collections reports paths using the host's separator, so the same file
 * arrives as `hermes/01-first-contact/01-intro` on macOS and
 * `hermes\01-first-contact\01-intro` on Windows. Every id, slug and URL in this
 * project is derived from that string, so without normalising first the build
 * fails outright on Windows — and, worse, would have produced back-slashed lesson
 * ids that silently never match the forward-slashed prerequisites authors write.
 *
 * Lives in its own module so it can be tested without importing the content
 * config, which needs a built collection to load.
 */
export function posixPath(value: string): string {
  return value.split(/[\\/]/).join('/')
}
