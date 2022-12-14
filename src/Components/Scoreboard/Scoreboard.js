import React, {useEffect, useState} from "react";
import {Badge, Button, Col, Table} from "react-bootstrap";
import {MdCancel} from "react-icons/md";
import {IoEllipsisHorizontalSharp} from "react-icons/io5";

import './styles.css';

const Scoreboard = props => {
    const [highScore, setHighScore] = useState();

    const getScore = scores => {
        if (scores.length) {
            return scores.reduce((a, b) => a + b, 0);
        }

        return 0;
    }

    const getRowStyles = score => {
        let portion = score / highScore * 100;

        return {
            width: portion + '%'
        }
    }

    const addScore = (player, amount) => {
        props.addScore(player.name, parseInt(amount));
    }

    const removeScore = (player, score) => {
        props.removeScore(player.name, score);
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
        <Col>
            <Table className='score-table w-100 v-align-middle'>
                <tbody>
                {props.players.map(player => (
                    <React.Fragment key={player.name}>
                        <tr className='position-relative'>
                            <td rowSpan='2' className='table-cell-min display-6 px-3 text-center'>
                                <div className='score-bg-upper position-absolute'
                                     style={getRowStyles(getScore(player.scores))}></div>
                                {player.name}
                            </td>

                            <td className='p-1'>
                                {props.increments.map(num => (
                                    <Button variant='primary' className='m-1' key={Math.random()}
                                            onClick={() => addScore(player, num)}>+{num}</Button>
                                ))}
                            </td>

                            <td rowSpan='2' className='table-cell-min px-3 text-center'>
                                <span className='display-5'>{getScore(player.scores)}</span>
                            </td>
                        </tr>

                        <tr className='position-relative tr-border-bottom'
                            style={getRowStyles(getScore(player.scores))}>
                            <td>
                                <div className='score-bg-lower position-absolute'
                                     style={getRowStyles(getScore(player.scores))}></div>

                                {player.scores.length > 5 && <span><IoEllipsisHorizontalSharp/> </span>}

                                <span className='text-nowrap'>
                                    {player.scores.length < 1 &&
                                        <Badge className='opacity-0'>0</Badge>
                                    }

                                    {player.scores.length > 0 && player.scores.map((score, i) => (
                                        // Note: all but last few hidden with CSS
                                        <Badge bg='secondary'
                                               className='position-relative score-badge fw-normal me-2
                                                cursor-pointer'
                                               key={Math.random()}
                                               onClick={() => removeScore(player, i)}
                                        >
                                            <span>{score}</span>
                                            <span
                                                className='bg-danger position-absolute start-0 top-0 w-100 h-100 d-none'>
                                            <MdCancel color='white'/>
                                        </span>
                                        </Badge>
                                    ))}
                                </span>
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