import React from 'react';
import './FilterPanel.css';
import {Journey} from "./config/configMapper";

interface FilterProps {
    onToggleLayer: (layerIndex:number) => void;
    journeys: Journey[];
    selectedJourney: number;
}

const FilterPanel = (props: FilterProps) => {
    const handleToggleLayer = (layerIndex: number) => {
        props.onToggleLayer(layerIndex);
    };

    return (
        <div className="filter-panel">
            <div className="filter-title">
                <h2>Adventures</h2>
                <hr />
            </div>
            <div className="filter-panel-details">
            </div>
            <div className="filter-panel-journeys">
                {props.journeys.map((it, index) => <button className={props.selectedJourney === index ? "selected-button" : ""} onClick={() => handleToggleLayer(props.selectedJourney === index ? -1 : index)}>{it.name}</button>)}
            </div>
        </div>
    );
};

export default FilterPanel;
