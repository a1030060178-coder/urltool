"use client";

import { useState } from "react";
import { Copy, Check, ArrowLeftRight, Trash2 } from "lucide-react";

export default function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode"|"decode">("encode");
  const [type, setType] = useState<"url"|"base64"|"html">("url");
  const [copied, setCopied] = useState(false);

  function convert() {
    try {
      const v = type==="url" ? (mode==="encode" ? encodeURIComponent(input) : decodeURIComponent(input))
        : type==="base64" ? (mode==="encode" ? btoa(input) : atob(input))
        : (mode==="encode" ? input.replace(/[&<>"']/g, (c: string) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c)) : input.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'"));
      setOutput(v);
    } catch { setOutput("Error: Invalid input for selected mode"); }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-2">URL Encoder / Decoder</h1>
      <p className="text-zinc-500 text-center mb-8">Encode and decode URLs, Base64, and HTML entities. Free, instant, private.</p>

      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {(["url","base64","html"] as const).map((t) => (
          <button key={t} onClick={() => { setType(t); setOutput(""); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${type===t?"bg-zinc-900 text-white border-zinc-900":"bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"}`}>
            {t==="url"?"URL":t==="base64"?"Base64":"HTML Entities"}
          </button>
        ))}
      </div>

      <textarea value={input} onChange={(e)=>{setInput(e.target.value);setOutput("");}} placeholder="Paste text to encode/decode..." rows={5}
        className="w-full border border-zinc-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-y mb-4" />

      <div className="flex justify-center gap-3 mb-6">
        <button onClick={()=>{setMode("encode");setOutput("");}} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode==="encode"?"bg-zinc-900 text-white":"bg-zinc-100 text-zinc-600"}`}>Encode ↓</button>
        <button onClick={()=>{setMode("decode");setOutput("");}} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode==="decode"?"bg-zinc-900 text-white":"bg-zinc-100 text-zinc-600"}`}>Decode ↑</button>
        <button onClick={convert} className="px-6 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">Convert</button>
        <button onClick={()=>{setInput("");setOutput("");}} className="px-3 py-2 rounded-lg text-red-500 text-sm hover:bg-red-50"><Trash2 className="w-4 h-4"/></button>
      </div>

      <textarea readOnly value={output} placeholder="Result appears here..." rows={5}
        className="w-full border border-zinc-300 rounded-xl p-4 text-sm bg-zinc-50 focus:outline-none resize-y" />

      {output && !output.startsWith("Error") && (
        <div className="mt-3 text-right">
          <button onClick={()=>{navigator.clipboard.writeText(output);setCopied(true);setTimeout(()=>setCopied(false),2000);}}
            className="inline-flex items-center gap-1.5 bg-zinc-900 text-white rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-zinc-800">
            {copied?<><Check className="w-3 h-3"/>Copied!</>:<><Copy className="w-3 h-3"/>Copy</>}
          </button>
        </div>
      )}

      <footer className="text-center mt-16 text-xs text-zinc-400">All processing in your browser. No data transmitted.</footer>
    </div>
  );
}
