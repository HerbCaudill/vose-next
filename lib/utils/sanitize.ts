// Sanitize windows filename
const sanitize = (s: string): string =>
  s.replace(/^\\.+/g, '').replace(/[\\\\/:*?"<>|]/g, '')

export default sanitize
