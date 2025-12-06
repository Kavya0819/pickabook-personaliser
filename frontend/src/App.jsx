import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setResultImage(null); // clear old result

    const url = URL.createObjectURL(selected);
    setPreview(url);
  };

  const handleGenerate = async () => {
    if (!file) {
      alert("Please upload a photo first.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/personalize", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await res.json();
      // backend should return: { image_url: "https://..." } OR { image_base64: "data:image/png;base64,..." }

      if (data.image_url) {
        setResultImage(data.image_url);
      } else if (data.image_base64) {
        setResultImage(data.image_base64);
      } else {
        alert("No image in response");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;

    const a = document.createElement("a");
    a.href = resultImage;
    a.download = "personalised_illustration.png";
    a.click();
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1>Pickabook – Photo Personaliser</h1>

      <div style={{ marginBottom: 16 }}>
        <label>Upload child photo:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      {preview && (
        <div style={{ marginBottom: 16 }}>
          <p>Preview:</p>
          <img
            src={preview}
            alt="Preview"
            style={{ maxWidth: "100%", borderRadius: 8 }}
          />
        </div>
      )}

      <button onClick={handleGenerate} disabled={loading || !file}>
        {loading ? "Generating..." : "Generate Illustration"}
      </button>

      {resultImage && (
        <div style={{ marginTop: 24 }}>
          <p>Result:</p>
          <img
            src={resultImage}
            alt="Result"
            style={{ maxWidth: "100%", borderRadius: 8 }}
          />
          <br />
          <button onClick={handleDownload} style={{ marginTop: 8 }}>
            Download
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
