import React from 'react'
import { GraphHeader } from './GraphHeader'
import CoinBadges from './CoinBadges';
import { BarGraphFooter } from './BarGraphFooter';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
export const BarGraphSection = (props) => {


    return (
        <div className='bar-graph-section'>
            <GraphHeader
                title={props.headerTitle}
                subtitle={props.headerSubTitle}
            />
            <CoinBadges 
                handleFunction={props.handleCoin}
                activeBadge = {props.activeCoin}
            />

            <Bar
                options={props.options}
                data={props.data}
            />

            <BarGraphFooter
                handleFooterClick={props.handleFooter}
                active={props.activeFooter}
            />

        </div>
    )
}
