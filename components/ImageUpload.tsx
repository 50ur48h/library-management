'use client';

import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import config from "@/lib/config";
import ImageKit from "imagekit";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast"


const { env: { imagekit: { publicKey, urlEndpoint } } } = config;

const authenticator = async () => {
    try {
        const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);
        if(!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request Failed with Status: ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const {signature, expire, token} = data;
        return {signature, expire, token};

    } catch (error) {
        throw new Error("Authentication Failed: ${error.message}");
    }
}

const ImageUpload = ({onFileChange}: { onFileChange : (filePath: string) => void}) => {
    const ikUploadRef = useRef(null);
    const [file, setFile] = useState<{filePath: string} | null>(null);
    const onError = (error: any) => {
        toast({
            title: "Image upload failed",
            description: `Your image can not be processed. ${console.log(error)}`,
            variant: "destructive",
          })
    }
    const onSuccess =(res: any) => {
        setFile(res);
        onFileChange(res.filePath);
        toast({
            title: "Image Uploaded",
            description: `${res.filePath}`,
        })
    }

    return (
        <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
            <IKUpload className="hidden" ref={ikUploadRef} onError={onError} onSuccess={onSuccess} fileName="test-upload.png"/>
            <button className="upload-btn" onClick={(e) => {
                e.preventDefault();
                if(ikUploadRef.current){
                    // @ts-ignore
                    ikUploadRef.current?.click();
                }
            }}>
                <Image src="/icons/upload.svg" width={20} height={20} alt="Upload Icon" className="object-contain"/>
                <p className="text-base, text-light-100">Upload ID Card</p>
                {file && <p className="upload-filename">{file.filePath}</p>}
            </button>
            {file && <IKImage path={file.filePath} alt={file.filePath} width={300} height={200} />}
        </ImageKitProvider>
    );
};

export default ImageUpload; 