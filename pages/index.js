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
          backgroundColor: "#0d1117",
          opacity: 0.9,
          backgroundImage: `
            radial-gradient(circle, transparent 20%, #0d1117 20%, #0d1117 80%, transparent 80%, transparent),
            radial-gradient(circle, transparent 20%, #0d1117 20%, #0d1117 80%, transparent 80%, transparent) 25px 25px,
            linear-gradient(#2d3748 2px, transparent 2px) 0 -1px,
            linear-gradient(90deg, #2d3748 2px, #0d1117 2px) -1px 0
          `,
          backgroundSize: "50px 50px, 50px 50px, 25px 25px, 25px 25px",
          color: "#f8f9fa",
        }}
      >
        <div
          className="w-100"
          style={{
            maxWidth: "480px",
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            padding: "2.5rem",
          }}
        >
          <div className="text-center mb-4">
            <h1 className="fw-bold mb-2" style={{ fontSize: "2rem" }}>
              <i className="fa-solid fa-qrcode me-2" /> QR Generator Klasik
            </h1>
            <p className="text-secondary mb-0" style={{ fontSize: "1rem" }}>
              Buat kode QR untuk link, teks, dan lainnya secara instan
            </p>
          </div>

          <input
            type="text"
            className="form-control mb-4"
            placeholder="Masukkan URL atau teks..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "2px solid rgba(255, 255, 255, 0.1)",
              color: "#fff",
              padding: "1.2rem",
              borderRadius: "16px",
              fontSize: "1rem",
              transition: "all 0.3s ease",
            }}
          />

          <button
            onClick={generateQR}
            className="btn w-100 mb-4 hover-effect"
            style={{
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "#fff",
              padding: "1rem",
              borderRadius: "16px",
              fontWeight: "600",
              fontSize: "1.1rem",
              transition: "all 0.3s ease",
              border: "none",
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
              <div className="qr-container p-4" style={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "20px",
                marginBottom: "1.5rem"
              }}>
                <img
                  src={qrUrl}
                  alt="QR Code"
                  className="img-fluid"
                  style={{
                    borderRadius: "12px",
                    maxWidth: "100%",
                  }}
                />
              </div>
              <a
                href={downloadUrl}
                className="btn"
                style={{
                  background: "linear-gradient(135deg, #059669, #10b981)",
                  color: "white",
                  fontWeight: "600",
                  padding: "0.8rem 1.5rem",
                  borderRadius: "14px",
                  fontSize: "1rem",
                  border: "none",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
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

        .hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.3);
        }

        input:focus {
          border-color: rgba(79, 70, 229, 0.5) !important;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
          outline: none;
        }

        @media (max-width: 576px) {
          h1 {
            font-size: 1.6rem !important;
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
