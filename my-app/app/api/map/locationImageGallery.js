import React, { useState, useRef } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUser } from '@/app/context/UserContext';
import { storage, db } from '@/app/api/firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import './locationImageGalley.css';

const LocationImageGallery = ({ location, theme }) => {
  const [scrollPosition, setScrollPosition] = useState(0);   // horizontal scroll state/position
  const [isUploading, setIsUploading] = useState(false);    // image upload state/buffer
  const scrollContainerRef = useRef(null);                 // reference to the scroll container
  const fileInputRef = useRef(null);                      // reference to the file input element
  const user = useUser();                                // get the current user
  
  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;              // get the scroll container
    const scrollAmount = direction === 'left' ? -300 : 300;   // scroll amount on scroll - left : right (px)
    const newPosition = scrollPosition + scrollAmount;       // calculate new scroll position
    
    container.scrollTo({                                   // scroll to the new position smoothly
      left: newPosition,
      behavior: 'smooth'
    });
    setScrollPosition(newPosition);
  };

  const handleImageUpload = async (event) => {
    if (!user) {                                    // check if user is signed in b4 upload
      alert('Please sign in to upload images');
      return;
    }

    const file = event.target.files[0];     // get the file the user chooses to upload
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];         
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only JPG, PNG, or WEBP images');
      return;
    }

    setIsUploading(true);               // set the upload state to true

    try {                            // try to upload the image to firebase
      const filename = `locations/${location.id}/${Date.now()}-${file.name}`;     // create a unique filename for the image in firebase storage location
      const storageRef = ref(storage, filename);                                 // create a reference to the storage location 
    
      await uploadBytes(storageRef, file);                                     // upload the image to the storage location
      const imageUrl = await getDownloadURL(storageRef);                      // get the image URL of uploaded image from firebase 
      const locationRef = doc(db, 'locations', location.id);                 // get the location reference in firestore

      await updateDoc(locationRef, {                                       // update the location document in firestore with all the new info ^
        uploadedImages: arrayUnion({                                      // These will be added to the locations uploadedImages array, which starts empty []
          url: imageUrl,                                                  
          userId: user.uid,
          username: user.displayName || 'Anonymous',
          timestamp: Date.now()
        })
      });

      
      if (fileInputRef.current) {             // reset file input after successful upload
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const showLeftScroll = scrollPosition > 0;
  const showRightScroll = scrollPosition < ((location.uploadedImages?.length || 0) * 300);

  return (
    <div className={`location-image-gallery ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <div className="gallery-container">
        {showLeftScroll && (
          <button 
            onClick={() => handleScroll('left')}
            className="nav-button left"
            aria-label="Previous images"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        {showRightScroll && (
          <button 
            onClick={() => handleScroll('right')}
            className="nav-button right"
            aria-label="Next images"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Images Container */}
        <div 
          ref={scrollContainerRef}
          className="images-container"
        >
          {/* Existing Images */}
          {location.uploadedImages?.map((image, index) => (
            <div key={index} className="image-wrapper">
              <img
                src={image.url}
                alt={`Location image ${index + 1}`}
                className="gallery-image"
              />
              <div className="image-credit">
                by {image.username}
              </div>
            </div>
          ))}

          {/* Upload Image Button */}
          <div className="upload-wrapper">
            <div 
              className={`upload-button ${isUploading ? 'uploading' : ''}`}
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              <Plus size={32} />
              <span>{isUploading ? 'Uploading...' : 'Add Photo'}</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="hidden-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationImageGallery;