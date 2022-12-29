import {useRef, useState} from "react";
import {Form, FloatingLabel, InputGroup, Button} from "react-bootstrap";
import {FaPlus, FaUserPlus} from "react-icons/fa";
import {MdCancel} from "react-icons/md";

import './styles.css';

const Config = props => {
    const [name, setName] = useState('');
    const [num, setNum] = useState('');

    const nameInputRef = useRef(null);
    const numInputRef = useRef(null);

    const gamePresets = [
        {
            name: "Cribbage",
            scores: [1, 5, 10]
        }, {
            name: "Dice / 10,000 / Farkle",
            scores: [50, 100, 500]
        }, {
            name: "Football",
            scores: [1, 2, 3, 6]
        }, {
            name: "Shanghai Rummy",
            scores: [5, 10, 50, 100]
        }
    ];

    const handleAddIncrement = () => {
        if (num && !props.increments.includes(parseInt(num))) {
            props.addIncrement(parseInt(num));

            numInputRef.current.value = '';
        }
    }

    const handleRemoveIncrement = val => {
        props.removeIncrement(val);
    }

    const handleIncrementInputChange = event => {
        if (event.currentTarget.checkValidity()) {
            setNum(event.target.value);
        }
    }

    const handleIncrementInputKeyup = event => {
        if (event.currentTarget.checkValidity() && event.key === 'Enter') {
            handleAddIncrement();
        }
    }

    const handlePresetChange = event => {
        const selectedPreset = gamePresets.find(el => el.name === event.currentTarget.value);

        props.setSelectedPreset(selectedPreset);
        props.replaceIncrements(selectedPreset.scores);
    }

    const handleAddPlayer = () => {
        if (name && !props.players.filter(player => player.name === name).length) {
            props.addPlayer(name);

            nameInputRef.current.value = '';
            nameInputRef.current.focus();
        }
    }

    const handlePlayerInputKeyup = event => {
        if (event.key === 'Enter') {
            handleAddPlayer();
        }
    }

    const handleRandomScoreChange = event => {
        if (event.currentTarget.checked) {
            props.setRandomize(true);
        } else if (event.currentTarget.classList.contains('badge')) {
            props.setRandomize(false);
        } else {
            props.setRandomize(false);
        }
    }

    const handleSubscoreChange = event => {
        props.setShowSubscore(event.currentTarget.checked);
    }

    const handlePlayerSortChange = event => {
        props.setSortPlayers(event.currentTarget.checked);
    }

    const handleRandomPlayers = () => {
        props.randomizePlayers();
        props.setSortPlayers(false);
    }

    const alphaSort = (a, b) => {
        if (props.sortPlayers) {
            return a.name.localeCompare(b.name);
        }
    }

    return (
        <>
            <h3 className='display-7'>Players</h3>

            <InputGroup>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Enter a name"
                >
                    <Form.Control type="text" placeholder="Enter a name"
                                  ref={nameInputRef}
                                  onChange={event => setName(event.target.value)}
                                  onKeyUp={handlePlayerInputKeyup}/>
                </FloatingLabel>

                <Button variant='secondary' onClick={handleAddPlayer}>
                    <FaUserPlus className='lead'/>
                </Button>
            </InputGroup>

            {props.players.length > 1 &&
                <div className='d-flex justify-content-between align-items-center mt-2'>
                    <Form.Group>
                        <Form.Check
                            type="checkbox"
                            label='Alphabetize players'
                            onChange={handlePlayerSortChange}
                            checked={props.sortPlayers}
                            id='sortPlayers'
                        />
                    </Form.Group>

                    <Button variant='outline-primary' size='sm' onClick={handleRandomPlayers}>Randomize players</Button>
                </div>
            }

            {props.players.length > 0 && <p className='form-text mb-0'>Click to remove.</p>}

            {[...props.players].sort(alphaSort).map(player => (
                <span
                    className='badge bg-primary position-relative inc-badge fw-normal me-2 my-1 px-3 cursor-pointer overflow-hidden'
                    key={player.name}
                    onClick={() => props.removePlayer(player.name)}>
                    <span className='lead'>{player.name}</span>
                    <span className='lead bg-danger position-absolute start-0 top-0 w-100 h-100 d-none'>
                        <MdCancel color='white'/>
                    </span>
                </span>
            ))}

            <h3 className='display-7 mt-3 pt-3 border-top'>Scoring</h3>

            <FloatingLabel controlId="gameConfigs" label="Select a game preset (optional)" className='mb-2'>
                <Form.Select aria-label="Game presets (optional)"
                             value={props.selectedPreset.name}
                             onChange={handlePresetChange}>
                    <option value=''>None</option>
                    {gamePresets.map(preset => (
                        <option key={preset.name}>{preset.name}</option>
                    ))}
                </Form.Select>
            </FloatingLabel>

            <InputGroup className="mb-2">
                <FloatingLabel
                    controlId="floatingInput"
                    label="Enter a unique whole number"
                >
                    <Form.Control type="number" placeholder="Enter a unique whole number"
                                  min="0" step="1" pattern="\d*"
                                  ref={numInputRef}
                                  onChange={handleIncrementInputChange}
                                  onKeyUp={handleIncrementInputKeyup}/>
                </FloatingLabel>

                <Button variant='secondary' onClick={handleAddIncrement}>
                    <FaPlus className='lead'/>
                </Button>
            </InputGroup>

            {props.increments.length > 1 &&
                <Form.Group className='mb-2'>
                    <Form.Check
                        type="checkbox"
                        label='Include random score button'
                        onChange={handleRandomScoreChange}
                        checked={props.includeRandomize}
                        id='randomScore'
                    />
                </Form.Group>
            }

            {props.increments.length > 0 && <p className='form-text m-0'>Click to remove.</p>}

            {props.increments.map(inc => (
                <span
                    className='badge bg-primary position-relative inc-badge fw-normal me-2 my-1 px-3 cursor-pointer overflow-hidden'
                    key={inc}
                    onClick={() => handleRemoveIncrement(inc)}>
                    <span className='lead'>{inc}</span>
                    <span className='lead bg-danger position-absolute start-0 top-0 w-100 h-100 d-none'>
                        <MdCancel color='white'/>
                    </span>
                </span>
            ))}

            {props.includeRandomize &&
                <span
                    className='badge bg-primary position-relative inc-badge fw-normal me-2 my-1 px-3 cursor-pointer overflow-hidden'
                    onClick={handleRandomScoreChange}>
                    <span className='lead'>?</span>
                    <span className='lead bg-danger position-absolute start-0 top-0 w-100 h-100 d-none'>
                        <MdCancel color='white'/>
                    </span>
                </span>
            }

            <h3 className='display-7 mt-3 pt-3 border-top'>Display</h3>

            <Form.Group className='mb-2'>
                <Form.Check
                    type="checkbox"
                    label='Show turn score total'
                    onChange={handleSubscoreChange}
                    checked={props.showSubscore}
                    id='subscore'
                />
            </Form.Group>

            {props.players.length > 0 && props.increments.length > 0 &&
                <div className='d-grid border-top mt-3 pt-3'>
                    <Button variant='outline-primary' size='lg' onClick={props.hideOffCanvas}>Play!</Button>
                </div>
            }
        </>
    )
}

export default Config;