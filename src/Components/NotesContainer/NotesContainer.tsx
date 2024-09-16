import { Note_T, SET_NEW_NOTE_POSITION_ACTION_T } from "../../Utils/useNotes";
import NoteBox from "./NoteBox/NoteBox";

const NotesContainer = ({ Notes, Dispatchers }: NotesContainerProps) => {
    return (
        <div className="p-4 w-full sm:w-[calc(100%-2rem)] mx-auto">
            <p>دیوار:</p>
            <div
                id="NoteContainer"
                className="border border-slate-100 min-h-dvh relative"
            >
                {Notes.map((note) => (
                    <NoteBox
                        key={note.id}
                        {...note}
                        Dispatchers={Dispatchers}
                    />
                ))}
            </div>
        </div>
    );
};
export default NotesContainer;

export interface NotesContainerProps {
    Notes: Note_T[];
    Dispatchers: {
        deleteNoteHandler: (id: string) => void;
        editNoteHandler: (id: Note_T["id"], text: Note_T["text"]) => void;
        deprecateNoteHandler: (id: Note_T["id"]) => void;
        setNewNotePositionHandler: (
            id: SET_NEW_NOTE_POSITION_ACTION_T["payload"]["id"],
            position: SET_NEW_NOTE_POSITION_ACTION_T["payload"]["position"],
        ) => void;
    };
}
