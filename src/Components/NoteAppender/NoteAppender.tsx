import { useCallback, useEffect, useMemo, useState } from "react";
import { _1min } from "../../Constants/Time";
import { Note_T } from "../../Utils/useNotes";
import DeadLineConfigure from "./DeadLineConfigure";
import TimeBox from "./TimeBox";

const InitialState: newNote = {
    text: "",
    createdAt: new Date(),
    deadLine: 1,
};

const NoteAppender = ({ addNote }: Props) => {
    const [Note, setNote] = useState(InitialState);
    const [isAppended, setIsAppended] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const formSubmitHandler = (event?: React.FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault();
        }
        if (!Note.text) {
            setErrorMessage("متن نباید خالی باشد");
            return;
        }

        addNote(Note);
        // reset forms
        setNote({ ...InitialState, createdAt: new Date() });
        // active DeadLineConfig flag
        setIsAppended(true);
    };

    // update Note.createAt every 30 seconds
    useEffect(() => {
        const CreatedAtTimeReValidator = setInterval(() => {
            setNote((prv) => ({ ...prv, createdAt: new Date() }));
        }, _1min / 2);

        return () => {
            clearInterval(CreatedAtTimeReValidator);
        };
    }, [setNote]);

    const DeadLineDate = useMemo(() => {
        const CreateAtTime = Note.createdAt.getTime();
        return new Date(CreateAtTime + Note.deadLine);
    }, [Note.createdAt, Note.deadLine]);

    const RestoreDeadlineConfigFlag = useCallback(() => {
        setIsAppended(false);
    }, []);

    return (
        <div className="p-4">
            <div className="bg-slate-700 max-w-4xl w-full mx-auto xl:max-w-5xl py-2 ">
                <div className="border-b border-b-gray-500 py-3 px-2 mb-5">
                    اضافه کردن نوت
                </div>
                <form
                    onSubmit={formSubmitHandler}
                    className="p-2 pt-0 flex flex-col gap-2 lg:gap-3"
                >
                    {errorMessage && (
                        <p className="bg-red-700 px-2">{errorMessage}</p>
                    )}
                    <div className="flex flex-col">
                        <label htmlFor="Note_text">
                            متن:
                            <span className="text-[75%] font-VazirDG inline-block mr-1 text-">
                                (محدودیت 250 کارکتری)
                            </span>
                        </label>
                        <textarea
                            id="Note_text"
                            value={Note.text}
                            onChange={(event) => {
                                setNote((prv) => ({
                                    ...prv,
                                    text: event.target.value,
                                }));

                                if (errorMessage) {
                                    setErrorMessage("");
                                }
                            }}
                            // handle submit the form with enter key press
                            onKeyDown={(e) => {
                                if (e.key !== "Enter") return;
                                formSubmitHandler();
                                e.preventDefault();
                            }}
                            className="bg-slate-800 border-none outline-none resize-none p-1.5 h-[15em] min-[400px]:h-[10em] sm:h-[9em] md:h-[8em] lg:h-[8em]"
                            maxLength={250}
                        />
                    </div>
                    <TimeBox name="ایجاد" Time={Note.createdAt} />
                    <DeadLineConfigure
                        setNote={setNote}
                        Flag={isAppended}
                        restoreFlag={RestoreDeadlineConfigFlag}
                    />
                    <TimeBox name="ددلاین" Time={DeadLineDate} />

                    <button
                        type="submit"
                        className="bg-slate-500 w-full max-w-xs pb-1 p-2 hover:bg-slate-400 hover:text-gray-800 transition-colors mx-auto mt-5"
                    >
                        ثبت
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NoteAppender;

export type newNote = Omit<Note_T, "id" | "position" | "derecateStatus">;

interface Props {
    addNote: (payload: newNote) => void;
}
