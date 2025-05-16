import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [input, setInput] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const generateQR = async () => {
    if (!input.trim()) {
      alert("Tolong isi teks atau URL dulu!");
      return;
    }

    try {
      const res = await fetch("https://h56-qr-generator-api.netlify.app/api/qr_scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: input }),
      });
      const data = await res.json();

      if (data.success) {
        setQrUrl(data.qr_data_url);

        const blobRes = await fetch(data.qr_data_url);
        const blob = await blobRes.blob();
        const objectUrl = URL.createObjectURL(blob);
        setDownloadUrl(objectUrl);
      } else {
        alert("Gagal generate QR. Coba lagi.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    }
  };

  return (
    <>
      <Head>
        <title>QR Generator Klasik</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </Head>

      <main className="d-flex justify-content-center align-items-center min-vh-100 text-light" style={{ background: "linear-gradient(135deg, #101820, #1c1c1e)" }}>
        <div className="container text-center p-4" style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "20px",
          boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
          maxWidth: "500px"
        }}>
          <h2><i className="fa-solid fa-qrcode"></i> QR Generator Klasik</h2>
          <input
            type="text"
            className="form-control my-3"
            placeholder="Masukkan URL atau teks..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              backgroundColor: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#f8f9fa",
              padding: "1rem",
              borderRadius: "12px"
            }}
          />
          <button onClick={generateQR} className="btn w-100 mb-4" style={{
            background: "#ffffff",
            color: "#000",
            padding: "0.75rem",
            borderRadius: "12px",
            fontWeight: "600"
          }}>
            <i className="fa-solid fa-magic me-2"></i> Generate QR
          </button>

          {qrUrl && (
            <div className="text-center">
              <h5 className="mb-3">Hasil QR:</h5>
              <img
                src={qrUrl}
                alt="QR Code"
                style={{
                  maxWidth: "100%",
                  border: "5px solid #ffffff",
                  borderRadius: "12px",
                  boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)"
                }}
              />
              <a
                href={downloadUrl}
                className="btn mt-3"
                style={{
                  background: "#28a745",
                  color: "white",
                  fontWeight: "600",
                  padding: "0.6rem 1rem",
                  borderRadius: "12px"
                }}
                download="qr-code-H56.png"
              >
                <i className="fa-solid fa-download me-2"></i> Download PNG
              </a>
            </div>
          )}
        </div>
      </main>
    </>
  );
    }
