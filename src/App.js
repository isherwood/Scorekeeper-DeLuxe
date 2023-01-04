import {useState} from 'react';
import {Button, Col, Container, Offcanvas, Row} from 'react-bootstrap';
import {MdSettings} from "react-icons/md";

import Utilities from './Services/Utilities';
import Config from './Components/Config/Config';
import Scoreboard from './Components/Scoreboard/Scoreboard'

function App() {
    const [showOffCanvas, setShowOffCanvas] = useState(true);
    const [players, setPlayers] = useState([]);
    const [sortPlayers, setSortPlayers] = useState(false);
    const [increments, setIncrements] = useState([]);
    const [includeRandomize, setIncludeRandomize] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState();
    const [subscore, setSubscore] = useState(0);
    const [showSubscore, setShowSubscore] = useState(true);
    const [selectedPreset, setSelectedPreset] = useState({});

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
        setIncrements(increments.filter(el => el !== val));
    }

    const compareIntegers = (a, b) => {
        return a - b;
    }

    const handleAddScore = (name, amount) => {
        const updatedPlayers = [...players];
        const player = updatedPlayers.filter(player => player.name === name)[0];
        const updatedPlayer = player;
        const samePlayer = player === currentPlayer;

        if (samePlayer) {
            setSubscore(subscore + amount);
        } else {
            setCurrentPlayer(player);
            setSubscore(amount);
        }

        updatedPlayer.scores = [...updatedPlayer.scores, amount];
        setPlayers(updatedPlayers);
    }

    const handleRemoveScore = (name, index) => {
        const updatedPlayers = [...players];
        const player = updatedPlayers.filter(player => player.name === name)[0];
        const updatedPlayer = player;
        const samePlayer = player === currentPlayer;

        if (samePlayer) {
            setSubscore(subscore - updatedPlayer.scores[index]);
        } else {
            setCurrentPlayer(player);
            setSubscore(0 - updatedPlayer.scores[index]);
        }

        updatedPlayer.scores.splice(index, 1);
        setPlayers(updatedPlayers);
    }

    const handleRandomizePlayers = () => {
        setPlayers(Utilities.shuffleArray([...players]));
    }

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
                                replaceIncrements={scores => setIncrements(scores)}
                                includeRandomize={includeRandomize}
                                setRandomize={val => setIncludeRandomize(val)}
                                showSubscore={showSubscore}
                                setShowSubscore={val => setShowSubscore(val)}
                                selectedPreset={selectedPreset}
                                setSelectedPreset={val => setSelectedPreset(val)}
                                hideOffCanvas={() => setShowOffCanvas(false)}
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
                        currentPlayer={currentPlayer}
                        increments={increments}
                        addScore={handleAddScore}
                        removeScore={handleRemoveScore}
                        subscore={subscore}
                        includeRandomize={includeRandomize}
                        showSubscore={showSubscore}
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
