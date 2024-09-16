import { PropsWithChildren, useEffect } from "react";
import { createPortal } from "react-dom";

export interface Props {
    Close: () => void;
}

const ModalWrapper = ({ children, Close }: PropsWithChildren<Props>) => {
    const ModalDomElement = document.getElementById("modal") as HTMLDivElement;

    // Add event listener to window to closing modal
    // by press Escape key form keyboard
    useEffect(() => {
        const CloseModalHandler = ({ key }: KeyboardEvent) => {
            if (key == "Escape") {
                Close();
            }
        };

        window.addEventListener("keydown", CloseModalHandler);

        return () => {
            window.removeEventListener("keydown", CloseModalHandler);
        };
    }, [Close]);

    const Modal = (
        <div
            className="fixed top-0 left-0 h-dvh w-dvw z-[900] backdrop-blur-sm flex justify-center items-center px-3"
            onClick={({ target, currentTarget }) => {
                // Close modal when mouse clicked outside the children (Background)
                if (target !== currentTarget) return;
                Close();
            }}
        >
            {children}
        </div>
    );

    return createPortal(Modal, ModalDomElement);
};

export default ModalWrapper;
