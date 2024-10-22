import React, { useState } from 'react';
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    Box,
    Collapse,
    styled,
    Divider
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SaveIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import TextModal from "./TextModel";
import {AllAdventures} from "./config/adventuresDefs";
import UploadButton from "./UploadButton";

// Custom styled components
const SidebarTitle = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(2),
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
}));

const Section = styled(Box)(() => ({
}));

interface AdventureSidebarProps {
    allAdventures: AllAdventures
    downloadState: () => void;
    uploadState: (content: string) => void;
    addRoute: (content: string) => void;
    removeRoute: (name: string) => void;
}

const AdventureSidebar: React.FC<AdventureSidebarProps> = ({ allAdventures, downloadState , uploadState, removeRoute, addRoute}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<string>("");
    const [openSections, setOpenSections] = useState({routes: true});

    const routes = Object.entries(allAdventures.routes).map((x) => x[0]);

    const handleSectionToggle = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleItemSelection = (index: number) => {
        setSelectedRoute(routes[index] === selectedRoute ? "" : routes[index])
    };

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: 280,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 280,
                    boxSizing: 'border-box',
                },
            }}
        >
            <SidebarTitle variant="h5">
                Adventures
            </SidebarTitle>
            <Section>
                <IconButton size="large" aria-label="save" onClick={downloadState}>
                    <SaveIcon />
                </IconButton>
                <UploadButton accept=".json" upload={uploadState}/>
                <IconButton size="large" aria-label="settings">
                    <SettingsIcon />
                </IconButton>
            </Section>
            <Divider />

            {/* Routes Section */}
            <Section>
                <ListItemButton onClick={() => handleSectionToggle('routes')}>
                    <ListItemText primary="Routes" />
                    {openSections.routes ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openSections.routes} timeout="auto">
                    <Divider variant={"middle"} sx={{ opacity: 0.6 }}/>
                    <IconButton size="large" aria-label="add" onClick={() => setModalOpen(true)}>
                        <AddIcon />
                    </IconButton>
                    <IconButton size="large" aria-label="remove" onClick={() => removeRoute(selectedRoute)}>
                        <RemoveIcon />
                    </IconButton>
                    {/*<IconButton size="large" aria-label="edit">*/}
                    {/*    <EditIcon />*/}
                    {/*</IconButton>*/}
                    <Divider variant={"middle"} sx={{ opacity: 0.6 }}/>
                    <List>
                        {routes.map((quest, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton selected={quest === selectedRoute} onClick={() => handleItemSelection(index)}>
                                    <ListItemText primary={quest} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            </Section>
            <Divider />
            <TextModal isOpen={modalOpen} onSubmit={addRoute} onClose={() => setModalOpen(false)}/>

        </Drawer>
    );
};

export default AdventureSidebar;