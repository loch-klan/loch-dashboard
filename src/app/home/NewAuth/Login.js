import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import './_newAuth.scss'
import logo from "./../../../image/Loch.svg"
import { validateEmail } from '../../../utils/validators'

const Login = ({
    show,
    toggleModal,
    handleChangeEmail,
    email,
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
            <div className='new-auth' style={{paddingBottom:'80px'}}>
                <div className='new-auth-content'>
                    <img className='new-auth-content-logo' src={logo} alt="" />
                    <div className='new-auth-content-title-holder'>
                        <h4 className='new-auth-content-title'>
                        Sign in
                        </h4>
                        <p className='new-auth-content-subtitle'>
                        Get right back into your account
                        </p>
                    </div>
                    <div className='new-auth-content-input-holder'>
                        <input 
                        className='new-auth-content-input' 
                        type="text" 
                        placeholder='Your email address'
                        value={email}
                        onChange={(e)=>handleChangeEmail(e.target.value)}
                        />
                        <button
                        style={{opacity: validateEmail(email) ? 1 : 0.5}}
                            onClick={()=>{
                                if(validateEmail(email)) handleSubmitEmail()
                            }}
                        ref={submitRef}
                        className={`new-auth-content-button ${validateEmail(email)?'new-auth-content-button--hover':''}`}>
                            Sign in
                        </button>
                    </div>
                    {/* <div className='new-auth-content-bottom-cta-holder'>
                        <p className='new-auth-content-bottom-cta'>
                        Don’t have an account yet?
                        </p>
                    </div> */}
                </div>
            </div>
        </Modal.Body> 

    </Modal>
  )
}

export default Login