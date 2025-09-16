"use client"
import React, { useState, useRef, useEffect } from 'react';

// Default placeholder image
const defaultAvatar = "https://placehold.co/96x96/E2E8F0/4A5568?text=Upload";

// Verification Badge Component
const Badge = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-blue-400"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// Main App Component
export default function App() {
  const [userName, setUserName] = useState('Your Name');
  const [handle, setHandle] = useState('yourhandle');
  const [bio, setBio] = useState('Frontend developer & UI/UX enthusiast. Join me on this coding adventure!');
  const [followers, setFollowers] = useState(2340000);
  const [following, setFollowing] = useState(7);
  const [imageUrl, setImageUrl] = useState(defaultAvatar);
  const [hashtag, setHashtag] = useState('#FrontendDev');
  const [isVerified, setIsVerified] = useState(true);
  const [imageError, setImageError] = useState('');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
  const [bgImageError, setBgImageError] = useState('');
  
  const elementRef = useRef(null);

  // Dynamically load the html-to-image script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  // Formats large numbers into a more readable format (e.g., 1.2k, 3.4m)
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}m`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num;
  };

  // Handles image upload and converts it to a Base64 string
  const handleImageChange = (e, isBackground = false) => {
    const file = e.target.files[0];
    const setError = isBackground ? setBgImageError : setImageError;
    const setUrl = isBackground ? setBackgroundImageUrl : setImageUrl;

    if (!file) {
      return;
    }

    setError('');

    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Please select an image under 5MB.');
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
        setError('Invalid file type. Please select an image.');
        e.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setUrl(reader.result);
    };
    reader.onerror = () => {
        setError('There was an issue reading the file.');
    };
    reader.readAsDataURL(file);
  };
  
  // Downloads the generated profile card as a PNG image
  const downloadImage = () => {
    if (elementRef.current && window.htmlToImage) {
      window.htmlToImage.toPng(elementRef.current, { cacheBust: false, style: { fontFamily: 'Inter, sans-serif' } })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `profile-card-${handle}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error('Oops, something went wrong!', err);
        });
    } else {
      console.error('html-to-image library not loaded yet.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="container mx-auto max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Profile Card Preview */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Profile Preview</h2>
          <div 
            ref={elementRef} 
            className={`w-full max-w-sm font-sans rounded-2xl transition-all duration-300 ${backgroundImageUrl ? 'p-6 bg-cover bg-center shadow-lg' : ''}`}
            style={{ backgroundImage: `url(${backgroundImageUrl || ''})` }}
          >
              <div className={`p-6 w-full h-full rounded-xl transition-colors duration-300 ${backgroundImageUrl ? 'bg-black/40 backdrop-blur-sm' : 'bg-white shadow-lg'}`}>
                <div className="flex items-center">
                  <img
                    src={imageUrl}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-2 border-gray-200 object-cover"
                  />
                  <div className="ml-4">
                    <div className="flex items-center gap-1">
                      <h4 className={`text-lg font-bold leading-none ${backgroundImageUrl ? 'text-white' : 'text-gray-800'}`}>{userName}</h4>
                      {isVerified && <Badge />}
                    </div>
                    <h5 className={`text-sm ${backgroundImageUrl ? 'text-gray-300' : 'text-gray-500'}`}>@{handle.trim().toLowerCase()}</h5>
                  </div>
                </div>
                <div className="mt-4">
                  <p className={`text-sm ${backgroundImageUrl ? 'text-gray-200' : 'text-gray-600'}`}>{bio}</p>
                  <span className={`pt-2 text-sm font-semibold ${backgroundImageUrl ? 'text-blue-400' : 'text-blue-600'}`}>{hashtag}</span>
                </div>
                <div className="mt-4 flex gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <p className={`font-bold ${backgroundImageUrl ? 'text-white' : 'text-gray-800'}`}>{formatNumber(following)}</p>
                    <p className={`${backgroundImageUrl ? 'text-gray-300' : 'text-gray-500'}`}>Following</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className={`font-bold ${backgroundImageUrl ? 'text-white' : 'text-gray-800'}`}>{formatNumber(followers)}</p>
                    <p className={`${backgroundImageUrl ? 'text-gray-300' : 'text-gray-500'}`}>Followers</p>
                  </div>
                </div>
              </div>
          </div>
        </div>

        {/* Profile Information Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Customize Your Profile</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <label className="block">
                <span className="text-gray-700 text-sm font-medium">Profile Image</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageChange(e, false)} 
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imageError && <p className="mt-1 text-sm text-red-600">{imageError}</p>}
            </label>

            <label className="block">
                <span className="text-gray-700 text-sm font-medium">Background Image</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageChange(e, true)} 
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {bgImageError && <p className="mt-1 text-sm text-red-600">{bgImageError}</p>}
            </label>
            {backgroundImageUrl && (
                <button onClick={() => setBackgroundImageUrl('')} className="w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors -mt-2">
                    Remove Background
                </button>
            )}

            <input type="text" placeholder="User Name" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            <input type="text" placeholder="Handle" value={handle} onChange={(e) => setHandle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" rows="3"></textarea>
            <input type="text" placeholder="Hashtag" value={hashtag} onChange={(e) => setHashtag(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Following" value={following} onChange={(e) => setFollowing(Number(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              <input type="number" placeholder="Followers" value={followers} onChange={(e) => setFollowers(Number(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
             <button onClick={() => setIsVerified(!isVerified)} className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${isVerified ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              {isVerified ? 'Verified' : 'Unverified'}
            </button>
            <button onClick={downloadImage} className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
              Generate Image
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}



