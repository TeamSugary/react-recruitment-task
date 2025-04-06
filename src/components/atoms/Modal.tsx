import React from "react"


const Modal = ({ text, showModal, SetShowModal }: { text: string, SetShowModal: React.Dispatch<React.SetStateAction<boolean>>, showModal: boolean }) => {
    return (
        <>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <span className="modal-close" onClick={() => SetShowModal(false)}>×</span>
                        <div className="error-dialog">
                            <span>{text}</span>
                        </div>
                    </div>
                </div>
            )}

        </>

    )
}

export default Modal