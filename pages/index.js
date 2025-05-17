import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [input, setInput] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateQR = async () => {
    if (!input.trim()) {
      alert("Tolong isi teks atau URL dulu!");
      return;
    }

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
            radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 100% 0%, rgba(124, 58, 237, 0.1) 0%, transparent 50%)
          `,
          color: "#f8f9fa",
        }}
      >
        <div
          className="w-100 animate-fade-in"
          style={{
            maxWidth: "480px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(25px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "28px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(79, 70, 229, 0.1)",
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

          <div className="input-wrapper mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Masukkan URL atau teks..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                color: "#fff",
                padding: "1.2rem",
                borderRadius: "16px",
                fontSize: "1rem",
                transition: "all 0.3s ease",
              }}
            />
          </div>

          <button
            onClick={generateQR}
            className={`btn w-100 mb-4 hover-effect ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
            style={{
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "#fff",
              padding: "1rem",
              borderRadius: "16px",
              fontWeight: "600",
              fontSize: "1.1rem",
              transition: "all 0.3s ease",
              border: "none",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin me-2" /> Generating...
              </>
            ) : (
              <>
                <i className="fa-solid fa-magic me-2" /> Generate QR
              </>
            )}
          </button>

          {qrUrl && (
            <div
              className="text-center mt-4 animate-fade-up"
              style={{
                opacity: 0,
                transform: "translateY(20px)",
                animation: "fadeInUp 0.5s ease-out forwards",
                animationDelay: "0.2s",
              }}
            >
              <h5 className="mb-3 fw-semibold">Hasil QR:</h5>
              <div 
                className="qr-container p-4" 
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "20px",
                  marginBottom: "1.5rem",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src={qrUrl}
                  alt="QR Code"
                  className="img-fluid"
                  style={{
                    borderRadius: "12px",
                    maxWidth: "100%",
                    transition: "transform 0.3s ease",
                  }}
                />
              </div>
              <a
                href={downloadUrl}
                className="btn hover-effect-green"
                style={{
                  background: "linear-gradient(135deg, #059669, #10b981)",
                  color: "white",
                  fontWeight: "600",
                  padding: "0.8rem 1.5rem",
                  borderRadius: "14px",
                  fontSize: "1rem",
                  border: "none",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                  transition: "all 0.3s ease",
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

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.3);
        }

        .hover-effect-green:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .hover-effect-green:active {
          transform: scale(0.98);
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.7) !important;
          font-weight: 500;
        }

        input:focus {
          border-color: rgba(79, 70, 229, 0.5) !important;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
          outline: none;
          transform: scale(1.01);
        }

        .loading {
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }

        .qr-container img:hover {
          transform: scale(1.02);
        }

        @media (max-width: 576px) {
          main {
            padding: 1rem;
          }
          
          div[style*="maxWidth: '480px'"] {
            padding: 1.5rem !important;
          }
          
          h1 {
            font-size: 1.5rem !important;
          }
          
          p {
            font-size: 0.9rem !important;
          }
          
          input {
            padding: 1rem !important;
            font-size: 0.9rem !important;
          }
          
          button {
            padding: 0.8rem !important;
            font-size: 1rem !important;
          }
          
          .qr-container {
            padding: 1rem !important;
          }
        }

        @media (max-width: 360px) {
          h1 {
            font-size: 1.3rem !important;
          }
          
          div[style*="maxWidth: '480px'"] {
            padding: 1.2rem !important;
          }
        }

        * {
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
}