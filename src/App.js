import {useEffect, useState} from 'react';
import {Button, Col, Container, Modal, Offcanvas, Row} from 'react-bootstrap';
import {MdSettings} from "react-icons/md";

import Config from './Components/Config/Config';
import Scoreboard from './Components/Scoreboard/Scoreboard'

function App() {

    // get property from local storage object
    const getItem = key => {
        const data = JSON.parse(localStorage.getItem('ScorekeeperDeLuxe'));
        return data ? data[key] : null;
    }

    const [showOffCanvas, setShowOffCanvas] = useState(true);
    const [players, setPlayers] = useState(getItem('players') || []);
    const [sortPlayers, setSortPlayers] = useState(getItem('sortPlayers') || false);
    const [increments, setIncrements] = useState(getItem('increments') || [1, 5]);
    const [includeRandomize, setIncludeRandomize] = useState(getItem('includeRandomize') || false);
    const [showContinueModal, setShowContinueModal] = useState(false);
    const [continueGame, setContinueGame] = useState(false);

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
    }

    const handleRandomizePlayers = () => {
        setPlayers(shuffle([...players]));
    }

    // randomize array element order
    const shuffle = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    const handleContinueModalYes = () => {
        setContinueGame(true);
        setShowContinueModal(false);
        setShowOffCanvas(false);
    }

    const handleContinueModalNo = () => {
        setShowContinueModal(false);
        localStorage.removeItem('ScorekeeperDeLuxe');
        window.location.reload();
    }

    // set state data in local storage
    useEffect(() => {
        window.localStorage.setItem('ScorekeeperDeLuxe', JSON.stringify({
            players: players,
            sortPlayers: sortPlayers,
            increments: increments,
            includeRandomize: includeRandomize
        }))
    }, [players, sortPlayers, increments, includeRandomize]);

    useEffect(() => {
        // check for saved game and prompt for continuation
        if (getItem('players').length) {
            setShowContinueModal(true);
        }
    }, []);

    // check local storage for app data
    useEffect(() => {
        if (continueGame) {
            if (getItem('players')) setPlayers(getItem('players'));
            if (getItem('sortPlayers')) setSortPlayers(getItem('sortPlayers'));
            if (getItem('increments')) setIncrements(getItem('increments'));
            if (getItem('includeRandomize')) setIncludeRandomize(getItem('includeRandomize'));
        }
    }, [continueGame]);

    return (
        <Container fluid className='app-container d-flex flex-column vh-100'>
            <Row className='align-items-center'>
                <Col>
                    <div className='text-center py-3'>
                        <h1 className='display-5 fst-italic text-primary mb-0 text-nowrap'>Scorekeeper De Luxe</h1>
                        <span className='text-nowrap text-muted'>A SeaBee Software Production</span>
                    </div>
                </Col>

                <Col className='flex-grow-1 text-end'>
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
                                sortPlayers={sortPlayers}
                                setSortPlayers={val => setSortPlayers(val)}
                                randomizePlayers={handleRandomizePlayers}
                                increments={increments}
                                addIncrement={handleAddIncrement}
                                removeIncrement={handleRemoveIncrement}
                                includeRandomize={includeRandomize}
                                setRandomize={val => setIncludeRandomize(val)}
                            />
                        </Offcanvas.Body>
                    </Offcanvas>
                </Col>
            </Row>

            <Row className='flex-fill'>
                {players.length > 0 && increments.length > 0 &&
                    <Scoreboard
                        players={players}
                        sortPlayers={sortPlayers}
                        increments={increments}
                        addScore={handleAddScore}
                        removeScore={handleRemoveScore}
                        includeRandomize={includeRandomize}
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

            <Modal show={showContinueModal} onHide={handleContinueModalNo}>
                <Modal.Header closeButton>
                    <Modal.Title>Score Data Found</Modal.Title>
                </Modal.Header>

                <Modal.Body>Would you like to continue where you left off?</Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={handleContinueModalYes}>Yes</Button>
                    <Button variant="secondary" onClick={handleContinueModalNo}>No</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default App;
