// Takes hash of 24-character decimal form (8 * 3char) and outputs 16-character hex in reverse byte order
export function ChunkHashToReverseHexEncoding(chunkHash: string) {
  var out_hex = "";

  for (var i = 0; i < 8; ++i) {
    out_hex = ByteToHex(parseInt(chunkHash.substring(i * 3, i * 3 + 3))) + out_hex;
  }
  return out_hex;
}

var HexChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

export function ByteToHex(b: number) {
  return HexChars[(b >> 4) & 0x0f] + HexChars[b & 0x0f];
}

// Pads a string with leading zeros or passed in string, i.e. padLeft(4,2) = "04"
// http://stackoverflow.com/questions/5366849/convert-1-to-0001-in-javascript
export function padLeft(nr: number, n: number, str: string = "0") {
  return Array(n - String(nr).length + 1).join(str) + nr;
}
