import React, { useState } from 'react';

const ImageUpload = () => {
    const [image, setImage] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (image) {
            // Handle image upload logic here
            console.log(image);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button type="submit">Upload Image</button>
        </form>
    );
};

export default ImageUpload;