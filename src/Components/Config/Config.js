import {Form, FloatingLabel, InputGroup, Button} from "react-bootstrap";
import {useRef, useState} from "react";
import {FaPlus, FaUserPlus} from "react-icons/fa";
import {MdCancel} from "react-icons/md";

import './styles.css';

const Config = props => {
    const [name, setName] = useState('');
    const [num, setNum] = useState('1');

    const nameInputRef = useRef(null);
    const numInputRef = useRef(null);

    const handleAddIncrement = () => {
        if (num && !props.increments.includes(num)) {
            props.addIncrement(num);
        }

        numInputRef.current.value = null;
    }

    const handleRemoveIncrement = val => {
        props.removeIncrement(val);
    }

    const handleIncrementInputKeyup = event => {
        if (event.key === 'Enter') {
            handleAddIncrement();
        }
    }

    const handleAddPlayer = () => {
        if (name && !props.players.filter(player => player.name === name).length) {
            props.addPlayer(name);
            setName('');
            nameInputRef.current.focus();
        }
    }

    const handlePlayerInputKeyup = event => {
        if (event.key === 'Enter') {
            handleAddPlayer();
        }
    }

    return (
        <>
            <h3 className='lead'>Score Increments</h3>

            <InputGroup className="mb-3">
                <FloatingLabel
                    controlId="floatingInput"
                    label="Enter a number"
                >
                    <Form.Control type="number" placeholder="Enter a number"
                                  value={num}
                                      ref={numInputRef}
                                      onChange={event => setNum(event.target.value)}
                                  onKeyUp={handleIncrementInputKeyup}/>
                </FloatingLabel>

                <Button variant='secondary' onClick={handleAddIncrement}>
                    <FaPlus className='lead'/>
                </Button>
            </InputGroup>

            {props.increments.length > 0 && <p className='form-text m-0'>Click to remove.</p>}

            {props.increments.map(inc => (
                <span className='badge bg-primary position-relative inc-badge fw-normal me-2 my-1 px-3 cursor-pointer overflow-hidden'
                      key={inc}
                      onClick={() => handleRemoveIncrement(inc)}>
                    <span className='lead'>{inc}</span>
                    <span className='lead bg-danger position-absolute start-0 top-0 w-100 h-100 d-none'>
                        <MdCancel color='white'/>
                    </span>
                </span>
            ))}

            <h3 className='lead mt-4'>Players</h3>

            <InputGroup className="mb-3">
                <FloatingLabel
                    controlId="floatingInput"
                    label="Enter a name"
                >
                    <Form.Control type="text" placeholder="Enter a name"
                                  value={name}
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
                <span className='badge bg-primary position-relative inc-badge fw-normal me-2 my-1 px-3 cursor-pointer overflow-hidden'
                      key={player.name}
                      onClick={() => props.removePlayer(player.name)}>
                    <span className='lead'>{player.name}</span>
                    <span className='lead bg-danger position-absolute start-0 top-0 w-100 h-100 d-none'>
                        <MdCancel color='white'/>
                    </span>
                </span>
            ))}
        </>
    )
}

export default Config;