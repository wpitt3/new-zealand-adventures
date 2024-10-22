import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Box,
    styled,
} from '@mui/material';
import UploadButton from "./UploadButton";

// Styled component for the text area
const StyledTextArea = styled(TextField)({
    '& .MuiInputBase-root': {
        height: 'auto',
    },
    '& .MuiInputBase-input': {
        minHeight: '300px',
    },
});

interface TextModalProps {
    onSubmit: (text: string) => void;
    onClose: () => void;
    isOpen: boolean;
}

const TextModal: React.FC<TextModalProps> = ({ onSubmit, isOpen, onClose }) => {
    const [text, setText] = useState('');

    const handleClose = () => {
        onClose();
        setText('');
    };

    const handleSubmit = () => {
        onSubmit(text);
        handleClose();
    };

    const handleUpload = (content: string) => {
        onSubmit(content);
        handleClose();
    }

    const handleClear = () => {
        setText('');
    };

    return (
        <Box>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Upload or Paste a New Route</DialogTitle>

                <DialogContent>
                    <StyledTextArea
                        autoFocus
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        multiline
                        variant="outlined"
                        fullWidth
                        placeholder="Paste route data here..."
                        margin="normal"
                    />
                </DialogContent>

                <DialogActions sx={{ padding: 2, gap: 1 }}>
                    <Button
                        onClick={handleClear}
                        variant="outlined"
                    >
                        Clear
                    </Button>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        color="error"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                    >
                        Submit
                    </Button>
                    <UploadButton accept=".gpx, .csv, .kml" upload={handleUpload} label="Upload File"/>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TextModal;