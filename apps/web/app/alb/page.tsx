"use client";
import React, { useState } from "react";
import { getConnection, pubkeyFrom } from "@euroweb/utt/albion-connection";
import { connectPhantom, signAndSendWithPhantom } from "@euroweb/utt/phantom-integration";
import { buildAlbTransferTx } from "@euroweb/utt/utt-bridge";

export default function Page() {
  const [sig, setSig] = useState<string>("");

  async function send() {
    const dest = prompt("Dest publicKey (base58)?");
    if (!dest) return;
    const conn = getConnection();
    const me = (await connectPhantom())?.publicKey;
    if (!me) { alert("Phantom not connected"); return; }
    const tx = await buildAlbTransferTx(conn, me, pubkeyFrom(dest), 0.1);
    const s = await signAndSendWithPhantom(conn, tx);
    setSig(s);
  }

  return (
    <div style={{padding:24}}>
      <h1>Send ALB (0.1)</h1>
      <button onClick={send} style={{padding:10,borderRadius:8}}>Connect + Send</button>
      {sig && <p>Signature: {sig}</p>}
    </div>
  );
}
