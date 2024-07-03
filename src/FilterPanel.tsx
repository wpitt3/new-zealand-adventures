import React, {ReactNode} from 'react';
import './FilterPanel.css';
import {Adventure, AllAdventures} from "./config/adventuresDefs";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';
import {SvgIconProps} from "@mui/material";


interface FilterProps {
    onToggleLayer: (layerIndex:number) => void;
    allAdventures: AllAdventures
    selectedJourney: number;
}

const icons = {
    "add": AddIcon,
    "edit": EditIcon,
    "remove": RemoveIcon,
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

const FilterPanel = (props: FilterProps) => {
    const handleToggleLayer = (layerIndex: number) => {
        props.onToggleLayer(layerIndex);
    };

    return (
        <div className="filter-panel">
            <div className="filter-panel-left">
                <div className="filter-title">
                    <h2>Adventures</h2>
                    <hr />
                </div>
                <div className="filter-panel-modify-journeys">
                    <ButtonWithIcon icon="edit" onClick={() => ""} />
                    <ButtonWithIcon icon="add" onClick={() => ""} />
                    <ButtonWithIcon icon="remove" onClick={() => ""} />
                </div>
                <FilterPanelDetails journey={props.allAdventures.adventures[props.selectedJourney]}/>
            </div>
            <div className="filter-panel-right">
                <div className="filter-panel-journeys">
                    {props.allAdventures.adventures.map((it, index) => <button className={props.selectedJourney === index ? "selected-button" : ""} onClick={() => handleToggleLayer(props.selectedJourney === index ? -1 : index)}>{it.name}</button>)}
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
