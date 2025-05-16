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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </Head>

      <main
        className="d-flex justify-content-center align-items-center min-vh-100 p-3"
        style={{
          background: "linear-gradient(135deg, #0d1117, #1f1f1f)",
          color: "#f8f9fa",
        }}
      >
        <div
          className="w-100"
          style={{
            maxWidth: "480px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
            padding: "2rem",
          }}
        >
          <div className="text-center mb-4">
            <h1 className="fw-bold mb-1" style={{ fontSize: "1.8rem" }}>
              <i className="fa-solid fa-qrcode me-2" /> QR Generator Klasik
            </h1>
            <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>
              Buat kode QR untuk link, teks, dan lainnya secara instan
            </p>
          </div>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Masukkan URL atau teks..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#fff",
              padding: "1rem",
              borderRadius: "14px",
              fontSize: "1rem",
            }}
          />

          <button
            onClick={generateQR}
            className="btn w-100 mb-4"
            style={{
              background: "#ffffff",
              color: "#000",
              padding: "0.8rem",
              borderRadius: "14px",
              fontWeight: "600",
              fontSize: "1rem",
              transition: "all 0.3s ease",
            }}
          >
            <i className="fa-solid fa-magic me-2" /> Generate QR
          </button>

          {qrUrl && (
            <div
              className="text-center mt-4"
              style={{
                animation: "fadeInUp 0.5s ease-out forwards",
                opacity: 0,
                transform: "translateY(20px)",
                animationDelay: "0.2s",
              }}
            >
              <h5 className="mb-3 fw-semibold">Hasil QR:</h5>
              <img
                src={qrUrl}
                alt="QR Code"
                className="img-fluid"
                style={{
                  border: "5px solid #ffffff",
                  borderRadius: "12px",
                  boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
                  marginBottom: "1rem",
                  maxWidth: "100%",
                }}
              />
              <a
                href={downloadUrl}
                className="btn"
                style={{
                  background: "#28a745",
                  color: "white",
                  fontWeight: "600",
                  padding: "0.6rem 1rem",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                }}
                download="qr-code.png"
              >
                <i className="fa-solid fa-download me-2"></i> Download PNG
              </a>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 576px) {
          h1 {
            font-size: 1.5rem !important;
          }

          input,
          button {
            font-size: 0.95rem !important;
          }
        }
      `}</style>
    </>
  );
        }
