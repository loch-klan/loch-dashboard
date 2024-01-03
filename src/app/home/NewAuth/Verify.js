import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import './_newAuth.scss'
import logo from "./../../../image/Loch.svg"

const Verify = ({
    show,
    toggleModal,
    handleChangeOTP,
    otp,
    handleSubmitOTP,
    handleSubmitEmail
}) => {

    const submitRef = React.useRef(null);

    useEffect(() => {
        const listener = (event) => {
          if (event.code === "Enter" || event.code === "NumpadEnter") {
            event.preventDefault();
            submitRef.current.click();
          }
        };
        document.addEventListener("keydown", listener);
        return () => {
          document.removeEventListener("keydown", listener);
        };
      }, []);


  return (
    <Modal
    size="lg"
    className="exit-overlay-form"
    dialogClassName={"exit-overlay-modal"}
    show={show}
    onHide={toggleModal}
    centered
    aria-labelledby="contained-modal-title-vcenter"
    backdropClassName="exitoverlaymodal"
    >

        <Modal.Body>
            <div className='new-auth verify-otp'>
                <div className='new-auth-content'>
                    <img className='new-auth-content-logo' src={logo} alt="" />
                    <div className='new-auth-content-title-holder'>
                        <h4 className='new-auth-content-title'>
                        Enter code
                        </h4>
                        <p className='new-auth-content-subtitle'>
                        The verification code is sent to your email
                        </p>
                    </div>
                    <div className='new-auth-content-input-holder new-auth-content-input-holder--otp'>
                        <input 
                        className='new-auth-content-input' 
                        type="text" 
                        placeholder='Enter OTP' 
                        value={otp}
                        onChange={e=>{
                            handleChangeOTP(e.target.value)
                        }}
                        />
                        <button 
                        style={{
                            opacity: otp ? 1 : 0.5
                        }}
                        onClick={()=>{
                            if(otp) handleSubmitOTP()
                        }}
                        ref={submitRef}
                        className={`new-auth-content-button ${otp?"new-auth-content-button--hover":''}`}>
                            Verify
                        </button>
                    </div>
                    <div className='new-auth-content-bottom-cta-holder'>
                        <p onClick={()=>{handleSubmitEmail(true)}} className='new-auth-content-bottom-cta'>
                        Send code again
                        </p>
                    </div>
                </div>
            </div>
        </Modal.Body> 

    </Modal>
  )
}

export default Verify