import { useParams } from "wouter";
import { SharedDocumentView } from "@/components/SharedDocumentView";

export default function SharedDocumentPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token;

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Invalid Share Link</h1>
          <p className="text-slate-300">This share link appears to be malformed.</p>
        </div>
      </div>
    );
  }

  return <SharedDocumentView token={token} />;
}