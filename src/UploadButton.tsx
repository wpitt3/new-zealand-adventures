import React, {useRef} from "react";
import {
    Button,
    IconButton
} from "@mui/material";
import LoadIcon from "@mui/icons-material/UploadFile";

interface UploadButtonProps {
    accept: string,
    upload: (content: string) => void,
    label?: string
}

const UploadButton: React.FC<UploadButtonProps> = ({ upload, accept, label }) => {

    const uploadState = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    upload(e.target?.result as string);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    alert('Invalid JSON file');
                }
            };
            reader.readAsText(file);
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileUploadClick = () => {
        fileInputRef.current?.click();
    };
    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={uploadState}
                className="hidden"
                style={{ display: 'none' }}
            />

            { !!label || <IconButton size="large" aria-label="upload" onClick={handleFileUploadClick}>
                <LoadIcon />
            </IconButton> }
            { !label || <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<LoadIcon />}
                onClick={handleFileUploadClick}
            >
                Upload files
            </Button> }
        </>)
}

export default UploadButton;