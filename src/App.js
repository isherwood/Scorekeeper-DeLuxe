import {useState} from 'react';
import {Button, Col, Container, Offcanvas, Row} from 'react-bootstrap';
import {MdSettings} from "react-icons/md";

import Config from './Components/Config/Config';
import Scoreboard from './Components/Scoreboard/Scoreboard'

function App() {
    const [showOffCanvas, setShowOffCanvas] = useState(true);
    const [players, setPlayers] = useState([]);
    const [increments, setIncrements] = useState([1, 5]);
    const [includeRandomize, setIncludeRandomize] = useState(false);
    const [winScore, setWinScore] = useState(undefined);
    const [winner, setWinner] = useState(false);
    const [winnerLocked, setWinnerLocked] = useState(false);

    const handleCloseOffCanvas = () => setShowOffCanvas(false);
    const handleShowOffCanvas = () => setShowOffCanvas(true);

    const handleAddPlayer = name => {
        setPlayers(players => [...players, {name: name, scores: []}]);
    }

    const handleRemovePlayer = name => {
        setPlayers(players.filter(player => player.name !== name));
    }

    const handleAddIncrement = inc => {
        setIncrements(increments => [...increments, inc].sort(compareIntegers));
    }

    const handleRemoveIncrement = val => {
        setIncrements(increments.filter((el) => el !== val));
    }

    const compareIntegers = (a, b) => {
        return a - b;
    }

    const handleAddScore = (name, amount) => {
        const updatedPlayers = [...players];
        const updatedPlayer = updatedPlayers.filter(player => player.name === name)[0];

        updatedPlayer.scores = [...updatedPlayer.scores, amount];

        setPlayers(updatedPlayers);
    }

    const handleRemoveScore = (name, index) => {
        const updatedPlayers = [...players];
        const updatedPlayer = updatedPlayers.filter(player => player.name === name)[0];

        updatedPlayer.scores.splice(index, 1);

        setPlayers(updatedPlayers);
        setWinner(undefined);
        setWinnerLocked(false);
    }

    const handleSetWinScore = val => {
        setWinScore(parseInt(val));
    }

    const handleSetWinner = name => {
        setWinner(name);
    }

    return (
        <Container fluid className='app-container d-flex flex-column vh-100'>
            <Row className='align-items-center'>
                <Col className='col-12 col-sm-auto order-1'>
                    <div className='text-center py-3'>
                        <h1 className='display-5 fst-italic text-primary mb-0 text-nowrap'>Scorekeeper De Luxe</h1>
                        <span className='text-nowrap text-muted'>A SeaBee Software Production</span>
                    </div>
                </Col>

                <Col className='col-9 col-sm-12 col-md-auto order-2 order-sm-last order-md-2 ms-auto pb-sm-3 pb-md-0
                 text-start text-sm-center'>
                    {winScore > 0 && !winner && !showOffCanvas &&
                        <div className='display-6 text-secondary ms-3 ms-sm-0 text-nowrap'>
                            First to {winScore} wins
                        </div>
                    }

                    {winner &&
                        <div className='display-6 text-danger text-bold ms-3 ms-sm-0 text-nowrap'>
                            {winner} wins!
                        </div>
                    }
                </Col>

                <Col className='col-3 col-sm-auto order-3 ms-auto text-end'>
                    <Button variant='link' size='lg' onClick={handleShowOffCanvas}>
                        <MdSettings/>
                    </Button>

                    <Offcanvas placement='end' show={showOffCanvas} onHide={handleCloseOffCanvas}>
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title><h2 className='display-6'>Configuration</h2></Offcanvas.Title>
                        </Offcanvas.Header>

                        <Offcanvas.Body>
                            <Config
                                players={players}
                                addPlayer={handleAddPlayer}
                                removePlayer={handleRemovePlayer}
                                increments={increments}
                                addIncrement={handleAddIncrement}
                                removeIncrement={handleRemoveIncrement}
                                includeRandomize={includeRandomize}
                                setRandomize={val => setIncludeRandomize(val)}
                                winScore={winScore}
                                setWinScore={val => handleSetWinScore(val)}
                            />
                        </Offcanvas.Body>
                    </Offcanvas>
                </Col>
            </Row>

            <Row className='flex-fill'>
                {players.length > 0 && increments.length > 0 &&
                    <Scoreboard
                        configShown={showOffCanvas}
                        players={players}
                        increments={increments}
                        addScore={handleAddScore}
                        removeScore={handleRemoveScore}
                        includeRandomize={includeRandomize}
                        winScore={winScore}
                        setWinner={handleSetWinner}
                        winnerLocked={winnerLocked}
                        setWinnerLocked={val => setWinnerLocked(val)}
                    />
                }

                {players.length < 1 && !showOffCanvas &&
                    <div className='align-self-center text-center'>
                        Please <Button variant='link' className='px-0 pt-0' onClick={handleShowOffCanvas}>add a
                        player</Button> in the configuration panel.
                    </div>
                }

                {players.length > 0 && increments.length < 1 && !showOffCanvas &&
                    <div className='align-self-center text-center'>
                        Please <Button variant='link' className='px-0 pt-0' onClick={handleShowOffCanvas}>add a score
                        increment</Button> in the configuration panel.
                    </div>
                }
            </Row>
        </Container>
    );
}

export default App;
