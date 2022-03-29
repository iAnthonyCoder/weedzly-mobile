import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateModalStatus } from '../store/actions'
import LoginModal from './Modals/LoginModal'
import SignupModal from './Modals/SignupModal'
import ReceiptModal from './Modals/Receipt'
import { TemporaryLocation } from './Modals/TemporaryLocation'

const ModalsController = () => {

    const dispatch = useDispatch()
    const modals = useSelector(state => state.modals)
    
    return (
        <>
            {
                <LoginModal
                    showModal={modals.login}
                    setShowModal={(value)=>dispatch(updateModalStatus({login:value}))}
                />
            }
            {
                <SignupModal
                    showModal={modals.signup}
                    setShowModal={(value)=>dispatch(updateModalStatus({signup:value}))}
                />
            }
            {
                <TemporaryLocation
                    showModal={modals.location}
                    setShowModal={(value)=>dispatch(updateModalStatus({location:value}))}
                />
            }
        </>
    )
}

export default ModalsController