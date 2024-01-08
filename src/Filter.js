import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const fileInputRef = useRef();
  const [selectedImage, setSelectedImage] = useState();
  const [originalImage, setOriginalImage] = useState();
  const [saturation, setSaturation] = useState(100);
  const [bAndW, setBAndW] = useState(false);
  const [contrast, setContrast] = useState(100);
  const [showGallery, setShowGallery] = useState(false);
  const [editedImages, setEditedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const savedImage = JSON.parse(localStorage.getItem('editedImage'));
    if (savedImage) setSelectedImage(savedImage.url);
    setSaturation(savedImage?.saturation || 100);
    setBAndW(savedImage?.bAndW || false);
    setContrast(savedImage?.contrast || 100);
  }, []);

  useEffect(() => {
    if (selectedImage) {
      localStorage.setItem(
        'editedImage',
        JSON.stringify({ url: selectedImage, saturation, bAndW, contrast })
      );
    }
  }, [selectedImage, saturation, bAndW, contrast]);

  useEffect(() => {
    localStorage.setItem('galleryImages', JSON.stringify(editedImages));
  }, [editedImages]);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setSelectedImage(imageUrl);
      setOriginalImage(imageUrl);
      setBAndW(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(originalImage);
    setSaturation(100);
    setBAndW(false);
    setContrast(100);
  };

  const handleSaveImage = () => {
    if (selectedImage) {
      const updatedImages = [...editedImages, { url: selectedImage, saturation, bAndW, contrast }];
      setCurrentImageIndex(updatedImages.length - 1);
      setEditedImages(updatedImages);
      alert('Image saved successfully!');
    }
    setShowGallery(false);
  };

  const handleShowImage = () => {
    if (selectedImage) {
      setShowGallery(!showGallery);
      setCurrentImageIndex(0);
    }
  };

  const handleDownloadFiltered = () => {
    const imageElement = new Image();
    imageElement.crossOrigin = 'anonymous';
    imageElement.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.filter = bAndW ? 'grayscale(100%)' : `saturate(${saturation}%) contrast(${contrast}%)`;
      canvas.width = imageElement.width;
      canvas.height = imageElement.height;
      context.drawImage(imageElement, 0, 0);
      const filteredImageDataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = filteredImageDataUrl;
      downloadLink.download = 'filtered_image.png';
      downloadLink.click();
    };
    imageElement.src = selectedImage;
    alert('Are you sure you want to download!');
  };

  const handleSaturationChange = (event) => setSaturation(event.target.value);
  const handleContrastChange = (event) => setContrast(event.target.value);
  const handleBAndWToggle = () => setBAndW(!bAndW);
  const handleHideGallery = () => setShowGallery(false);

  const buttonStyle = { backgroundColor: 'black', color: 'white', textDecoration: 'none', display: 'inline-block', fontSize: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px 20px', margin: '10px' };
  const containerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', backgroundColor: 'orange', minHeight: '100vh' };
  const boxContainerStyle = { display: 'flex', justifyContent: 'space-between', width: '80%' };
  const leftBoxStyle = { textAlign: 'center', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', padding: '20px', marginBottom: '20px' };
  const rightBoxStyle = { textAlign: 'center', width: '48%', overflow: 'hidden', marginTop: '20px' };
  const imageStyle = { width: '100%', height: 'auto', objectFit: 'contain', filter: bAndW ? 'grayscale(100%)' : `saturate(${saturation}%) contrast(${contrast}%)` };
  const galleryContainerStyle = { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', padding: '20px', backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '8px' };
  const galleryImageStyle = { width: '30%', marginBottom: '20px', cursor: 'pointer' };

  return (
    <div style={containerStyle}>
      <div style={boxContainerStyle}>
        <div style={leftBoxStyle}>
          <h1 style={{ fontFamily: 'cursive', color: 'black' }}>Image Editor</h1>
          <input ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} type='file' />
          <button onClick={() => fileInputRef.current.click()} style={{ ...buttonStyle }}>Upload Image</button>
          {selectedImage && (
            <>
              <div>
                <label style={{ color: 'black', marginBottom: '5px' }}>Saturation:</label>
                <input type='range' min='0' max='200' value={saturation} onChange={handleSaturationChange} style={{ width: '200px', marginTop: '5px' }} />
                <p>{saturation}</p>
              </div>
              <div>
                <label style={{ color: 'black', marginBottom: '5px' }}>Contrast:</label>
                <input type='range' min='0' max='200' value={contrast} onChange={handleContrastChange} style={{ width: '200px', marginTop: '5px' }} />
                <p>{contrast}</p>
              </div>
              <button onClick={handleBAndWToggle} style={{ ...buttonStyle, marginTop: '10px' }}>Black & White</button>
              <button onClick={handleDownloadFiltered} style={{ ...buttonStyle, marginTop: '10px' }}>Download</button>
            </>
          )}
          <button onClick={handleShowImage} style={{ ...buttonStyle, marginTop: '10px' }}>Show Gallery</button>
          <button onClick={handleHideGallery} style={{ ...buttonStyle, marginTop: '10px' }}>Hide Gallery</button>
        </div>
        <div style={rightBoxStyle}>
          {selectedImage && (
            <div>
              <img src={selectedImage} alt='Edited Image' style={imageStyle} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button onClick={handleReset} style={{ ...buttonStyle }}>Reset</button>
                <button onClick={handleSaveImage} style={{ ...buttonStyle }}>Save</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showGallery && (
        <div style={galleryContainerStyle}>
          {editedImages.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`edited-${index}`}
              style={{
                ...galleryImageStyle,
                filter: image.bAndW ? 'grayscale(100%)' : `saturate(${image.saturation}%) contrast(${image.contrast}%)`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
