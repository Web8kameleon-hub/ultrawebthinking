declare module 'cbor-js' {
  export function encode(data: any): ArrayBuffer;
  export function decode(data: ArrayBuffer): any;
  
  const CBOR: {
    encode: (data: any) => ArrayBuffer;
    decode: (data: ArrayBuffer) => any;
  };
  
  export default CBOR;
}
