import {useRef, useState} from "react";
import {Form, FloatingLabel, InputGroup, Button} from "react-bootstrap";
import {FaPlus, FaUserPlus} from "react-icons/fa";
import {MdCancel} from "react-icons/md";

import './styles.css';

const Config = props => {
    const [name, setName] = useState('');
    const [num, setNum] = useState('');
    // const [time, setTime] = useState('');

    const nameInputRef = useRef(null);
    const numInputRef = useRef(null);

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

    const handleWinInputChange = event => {
        if (event.currentTarget.checkValidity()) {
            props.setWinScore(event.target.value);
        }
    }

    // const handleTimeInputChange = event => {
    //     if (event.currentTarget.checkValidity()) {
    //         setTime(event.target.value);
    //     }
    // }

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

    const handleRandomizeChange = event => {
        if (event.currentTarget.checked) {
            props.setRandomize(true);
        } else if (event.currentTarget.classList.contains('badge')) {
            props.setRandomize(false);
        } else {
            props.setRandomize(false);
        }
    }

    return (
        <>
            <h3 className='lead'>Players</h3>

            <InputGroup className="mb-3">
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

            {props.players.length > 0 && <p className='form-text m-0'>Click to remove.</p>}

            {props.players.map(player => (
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

            <h3 className='lead mt-4'>Score Increments</h3>

            <InputGroup className="mb-3">
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
                    onClick={handleRandomizeChange}>
                    <span className='lead'>?</span>
                    <span className='lead bg-danger position-absolute start-0 top-0 w-100 h-100 d-none'>
                        <MdCancel color='white'/>
                    </span>
                </span>
            }

            {props.increments.length > 0 &&
                <Form.Check
                    type="checkbox"
                    label='Include random score button'
                    onChange={handleRandomizeChange}
                    checked={props.includeRandomize}
                />
            }

            <h3 className='lead mt-4'>Optional Features</h3>

            <FloatingLabel
                controlId="floatingInput"
                label="Enter a game-winning score"
            >
                <Form.Control type="number" placeholder="Enter a game-winning score"
                              min="0" step="1" pattern="\d*"
                              defaultValue={props.winScore}
                              onChange={handleWinInputChange}/>
            </FloatingLabel>

            {/*<FloatingLabel*/}
            {/*    controlId="floatingInput"*/}
            {/*    label="Enter a game time in minutes"*/}
            {/*>*/}
            {/*    <Form.Control type="number" placeholder="Enter a game time in minutes"*/}
            {/*                  min="0" step="1" pattern="\d*"*/}
            {/*                  ref={timeInputRef}*/}
            {/*                  onChange={handleTimeInputChange}/>*/}
            {/*</FloatingLabel>*/}
        </>
    )
}

export default Config;