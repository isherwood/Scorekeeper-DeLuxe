import React, {useEffect, useState} from "react";
import {Badge, Button, Col, Modal, OverlayTrigger, Popover, Table} from "react-bootstrap";
import {MdCancel} from "react-icons/md";
import {IoEllipsisHorizontalSharp} from "react-icons/io5";

import './styles.css';
import {RiQuestionMark} from "react-icons/ri";

const Scoreboard = props => {
    const [highScore, setHighScore] = useState();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deleteScorePlayer, setDeleteScorePlayer] = useState();
    const [deleteScoreIndex, setDeleteScoreIndex] = useState();

    const confirmScoreDelete = (player, index) => {
        setShowConfirmModal(true);
        setDeleteScorePlayer(player.name);
        setDeleteScoreIndex(index);
    }

    const handleConfirmModalClose = deleteScore => {
        if (deleteScore) {
            props.removeScore(deleteScorePlayer, deleteScoreIndex);
        }

        setShowConfirmModal(false);
    }

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

    const getRandomScore = () => {
        return props.increments[Math.floor(Math.random() * props.increments.length)];
    }

    const alphaSort = (a, b) => {
        if (props.sortPlayers) {
            return a.name.localeCompare(b.name);
        }
    }

    const scorePopover = scores => (
        <Popover id="score-popover">
            <Popover.Body>
                <b>Score count</b>: {scores.length}
                <br/>
                <b>Scores</b>: {scores.join(' ')}
            </Popover.Body>
        </Popover>
    );

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
                {[...props.players].sort(alphaSort).map(player => (
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

                                {props.includeRandomize &&
                                    <Button variant='primary' className='m-1'
                                            onClick={() => addScore(player, getRandomScore())}>
                                        +<RiQuestionMark/>
                                    </Button>
                                }
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

                                {player.scores.length > 5 &&
                                    <span className='pe-1'>
                                        <OverlayTrigger overlay={scorePopover(player.scores)}
                                                        trigger='click'
                                                        placement='auto'
                                                        rootClose='true'>
                                            <button className='btn btn-link p-0'>
                                                <IoEllipsisHorizontalSharp color='#333'/>
                                            </button>
                                        </OverlayTrigger>
                                    </span>}

                                <span className='text-nowrap'>
                                    {player.scores.length < 1 &&
                                        // layout height spacer
                                        <Badge className='opacity-0'>0</Badge>
                                    }

                                    {player.scores.length > 0 && player.scores.map((score, i) => (
                                        // Note: all but last few hidden with CSS
                                        <Button variant='secondary' size='sm'
                                                className='position-relative score-btn fw-normal me-2 py-0 border-0
                                                overflow-hidden'
                                                key={Math.random()}
                                                onClick={() => confirmScoreDelete(player, i)}
                                        >
                                            <span>{score}</span>
                                            <span
                                                className='bg-danger position-absolute start-0 top-0 w-100 h-100 d-none'>
                                            <MdCancel color='white'/>
                                        </span>
                                        </Button>
                                    ))}
                                </span>
                            </td>
                        </tr>
                    </React.Fragment>
                ))}
                </tbody>
            </Table>

            <Modal show={showConfirmModal} onHide={() => handleConfirmModalClose(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>For <em>realsies</em>?</Modal.Title>
                </Modal.Header>

                <Modal.Body>Are you sure you want to delete this score?</Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={() => handleConfirmModalClose(true)}>Yep!</Button>
                    <Button variant="secondary" onClick={() => handleConfirmModalClose(false)}>Nope</Button>
                </Modal.Footer>
            </Modal>
        </Col>
    )
}

export default Scoreboard;