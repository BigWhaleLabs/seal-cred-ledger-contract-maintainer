export default function addZerosToHex(givenHex: string) {
  let hex = givenHex.slice(2)
  while (hex.length < 64) hex = '0' + hex

  return '0x' + hex
}
