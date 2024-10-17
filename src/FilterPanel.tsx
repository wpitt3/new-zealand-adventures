import React, {ReactNode, useState} from 'react';
import './FilterPanel.css';
import {Adventure, AdventureConfig, AllAdventures, Coordinate} from "./config/adventuresDefs";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';
import SaveIcon from '@mui/icons-material/Download';
import LoadIcon from '@mui/icons-material/UploadFile';
import SettingsIcon from '@mui/icons-material/Settings';
import {SvgIconProps} from "@mui/material";

interface FilterProps {
    onToggleLayer: (layerIndex:number) => void;
    allAdventures: AllAdventures
    selectedJourney: number;
    downloadState: () => void;
    addRoute: () => void;
    uploadState: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const icons = {
    "add": AddIcon,
    "edit": EditIcon,
    "remove": RemoveIcon,
    "save": SaveIcon,
    "load": LoadIcon,
    "settings": SettingsIcon,
} as Record<string, React.ComponentType<SvgIconProps>>;

interface ButtonProps {
    onClick: () => void;
    icon: string;
}

const ButtonWithIcon = (props: ButtonProps) => {
    const Icon = icons[props.icon]!;
    return (<button className="button" onClick={() => props.onClick()}><Icon/></button>);
}

const FilterPanelDetails = (props: {journey: Adventure}) => {
    if (props.journey === undefined) {
       return (<div className="filter-panel-details"></div>)
    }

    return (
        <div className="filter-panel-details">
            <div>{props.journey.name}</div>
            <div>{props.journey.fromDate}</div>
            <div>{props.journey.toDate}</div>
        </div>
    )
}

interface SidePanelSectionProps {
    child?: ReactNode;
    buttons?: ReactNode[];
    title?: string;
}

const SidePanelSection: React.FC<SidePanelSectionProps> = ({ title, buttons , child}) => {
    return (
        <div className="side-panel-section">
            {title && <div className="side-panel-title">{title}</div>}
            {buttons && <div className="side-panel-buttons">{buttons}</div>}
            {child && <div className="side-panel-content">{child}</div>}
        </div>
    )
}


const FilterPanel = (props: FilterProps) => {
    const [editMode, setEditMode] = useState<boolean> (false);

    const handleToggleLayer = (layerIndex: number) => {
        props.onToggleLayer(layerIndex);
    };

    return (
        <div className="filter-panel">
            <div className="filter-panel-left">
                <div className="filter-title">
                    <h2>Adventures</h2>
                </div>
                <SidePanelSection buttons={[
                    <ButtonWithIcon icon="save" onClick={props.downloadState}/>,
                    <label className="label-as-button">
                        <LoadIcon/>
                        <input
                            type="file"
                            accept=".json"
                            onChange={props.uploadState}
                            className="hidden"
                        />
                    </label>,
                    <ButtonWithIcon icon="settings" onClick={() => setEditMode(!editMode)} />
                ]}/>

                <SidePanelSection title={"Routes"} child={
                    Object.entries(props.allAdventures.routes).map((x) => <div>{x[0]}</div>)
                } buttons={[
                    <ButtonWithIcon icon="add" onClick={props.addRoute}/>,
                    // <ButtonWithIcon icon="remove" onClick={props.downloadState}/>,
                ]}
                />

                <SidePanelSection title={"Adventures"} child={
                    !editMode && <FilterPanelDetails journey={props.allAdventures.adventures[props.selectedJourney]}/>
                }/>

                {/*{editMode && <div className="filter-panel-modify-journeys">*/}
                {/*    <ButtonWithIcon icon="edit" onClick={() => ""} />*/}
                {/*    <ButtonWithIcon icon="add" onClick={() => ""} />*/}
                {/*    <ButtonWithIcon icon="remove" onClick={() => ""} />*/}
                {/*</div>}*/}

            </div>
            {!editMode && <div className="filter-panel-right">
                <div className="filter-panel-journeys">
                    {props.allAdventures.adventures.map((it, index) => <button className={props.selectedJourney === index ? "selected-button" : ""} onClick={() => handleToggleLayer(props.selectedJourney === index ? -1 : index)}>{it.name}</button>)}
                </div>
            </div>}
        </div>
    );
};

export default FilterPanel;
