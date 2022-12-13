import './App.css';
import {Button, Col, Container, Offcanvas, Row} from 'react-bootstrap';
import {MdSettings} from "react-icons/md";

import Config from './Components/Config/Config';
import {useState} from 'react';

function App() {
    const [showOffCanvas, setShowOffCanvas] = useState(true);
    const [players, setPlayers] = useState([]);
    const [increments, setIncrements] = useState([1, 5]);
    // const [randomizeIncrement, setRandomizeIncrement] = useState(false);

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

    return (
        <Container fluid className='app-container d-flex flex-column vh-100'>
            <Row className='align-items-center'>
                <Col>
                    <div className='text-center'>
                        <h1 className='display-5 fst-italic text-primary mb-0 text-nowrap'>Scorekeeper DeLuxe</h1>
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
                                increments={increments}
                                addIncrement={handleAddIncrement}
                                removeIncrement={handleRemoveIncrement}
                                // randomizeIncrement={randomizeIncrement}
                                // setRandomizeIncrement={val => setRandomizeIncrement(val)}
                            />
                        </Offcanvas.Body>
                    </Offcanvas>
                </Col>
            </Row>

            <Row className='flex-fill'>

            </Row>
        </Container>
    );
}

export default App;
