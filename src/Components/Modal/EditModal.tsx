import { useState } from "react";
import { Props as ModalProps } from "./ModalWrapper";

type Props = ModalProps & {
    Edit: (text: string) => void;
    currentText: string;
    Deprecate: () => void;
    isDeprecated: boolean;
};

const EditModal = ({
    Edit: EditNote,
    Close,
    currentText,
    Deprecate,
    isDeprecated,
}: Props) => {
    const [text, setText] = useState(currentText);
    const [isChecked, setIsChecked] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    return (
        <form
            className="w-full max-w-md xl:max-w-xl bg-slate-700 border border-slate-950 flex flex-col gap-3 xl:gap-6"
            onSubmit={(e) => {
                e.preventDefault();
                if (text) {
                    EditNote(text);
                } else {
                    setErrorMessage("متن نباید خالی باشد.");
                }
                if (isChecked) {
                    Deprecate();
                }
            }}
        >
            <p
                onClick={Close}
                className="border-b p-4 py-3 text-3xl cursor-pointer"
            >
                X
            </p>
            {errorMessage && <p className="bg-red-700 px-2">{errorMessage}</p>}
            {!isDeprecated && (
                <div className="px-2 flex items-center gap-2">
                    <p
                        className="cursor-pointer"
                        onClick={() => {
                            setIsChecked((prv) => !prv);
                        }}
                    >
                        منقضی بشود؟
                    </p>
                    <span
                        onClick={() => {
                            setIsChecked(true);
                        }}
                        className={`cursor-pointer ${
                            isChecked ? "text-red-500" : ""
                        }`}
                    >
                        بله
                    </span>
                    -
                    <span
                        onClick={() => {
                            setIsChecked(false);
                        }}
                        className={`cursor-pointer ${
                            !isChecked ? "text-green-500" : " "
                        }`}
                    >
                        خیر
                    </span>
                </div>
            )}

            <div className="px-2">
                <label htmlFor="editNoteModal">متن:</label>
                <textarea
                    id="editNoteModal"
                    className="bg-slate-800 w-full resize-none p-1 mt-2 outline-none border-2 border-transparent focus:border-gray-500"
                    rows={5}
                    value={text}
                    maxLength={250}
                    onChange={(e) => {
                        setText(e.target.value);
                        if (errorMessage) {
                            setErrorMessage("");
                        }
                    }}
                    onKeyDown={({ key }) => {
                        if (key === "Enter") {
                            EditNote(text);
                        }
                    }}
                />
            </div>
            <div className="grid items-center grid-cols-2 text-slate-700">
                <button
                    className="p-2 bg-blue-500 hover:bg-blue-600 border-l border-l-slate-600 text-gray-300"
                    type="submit"
                >
                    ویرایش
                </button>
                <button
                    className="p-2 bg-slate-400 hover:bg-slate-500 border-r border-r-slate-600"
                    onClick={Close}
                    type="button"
                >
                    بیخیال
                </button>
            </div>
        </form>
    );
};
export default EditModal;
