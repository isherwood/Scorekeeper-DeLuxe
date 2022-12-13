import React from 'react';
import {Badge, Button, Col, Table} from "react-bootstrap";

import './styles.css';
import {useEffect, useState} from "react";

const Scoreboard = props => {
    const [highScore, setHighScore] = useState();

    const getScore = scores => {
        if (scores.length) {
            return scores.reduce((a, b) => a + b, 0);
        }

        return 0;
    }

    const getLatestScores = player => {
        return player.scores.slice(-5);
    }

    const getRowStyles = score => {
        const portion = score / highScore * 100;
        const color = 'rgba(146, 0, 170, 0.5)';

        return {
            background: 'linear-gradient(to right, #fff 0%, ' + color +' ' + portion + '%,'
            + '#fff ' + portion + '%)'
        }
    }

    const addToScores = (player, amount) => {
        props.incrementScore(player.name, parseInt(amount));
    }

    useEffect(() => {
        let highestVal = 0;

        props.players.forEach(player => {
            const score = getScore(player.scores);

            if (score > highestVal) {
                highestVal = score;
            }

            setHighScore(highestVal);
        });
    }, [props.players]);

    return (
        <Col className='mt-4'>
            <Table className='score-table v-align-middle'>
                <tbody>
                {props.players.map(player => (
                    <React.Fragment key={player.name}>
                        <tr style={getRowStyles(getScore(player.scores))}>
                            <td rowSpan='2' className='table-cell-min display-6 px-3 text-center'>{player.name}</td>

                            <td>
                                {props.increments.map(num => (
                                    <Button variant='primary' className='me-1' key={Math.random()}
                                            onClick={() => addToScores(player, num)}>+{num}</Button>
                                ))}
                            </td>

                            <td rowSpan='2' className='table-cell-min px-3 text-center'>
                                <span className='display-5'>{getScore(player.scores)}</span>
                            </td>
                        </tr>

                        <tr className='tr-border-bottom' style={getRowStyles(getScore(player.scores))}>
                            <td>
                                <span className='text-muted'>Latest scores: </span>

                                {player.scores.length > 0 && getLatestScores(player).map(score => (
                                    <Badge bg='secondary' className='ms-1' key={Math.random()}>{score}</Badge>
                                ))}
                            </td>
                        </tr>
                    </React.Fragment>
                ))}
                </tbody>
            </Table>
        </Col>
    )
}

export default Scoreboard;