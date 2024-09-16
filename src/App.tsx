import NoteAppender from "./Components/NoteAppender/NoteAppender";
import NotesContainer from "./Components/NotesContainer/NotesContainer";
import useNotes from "./Utils/useNotes";

function App() {
    const { Handlers, Notes } = useNotes();

    return (
        <div className="min-h-dvh bg-slate-800">
            <NoteAppender addNote={Handlers.addNoteHandler} />

            {/* I know this is props drilling (Dispatchers), 
            in this case using context just adding complexity */}
            <NotesContainer
                Notes={Notes}
                Dispatchers={{
                    deleteNoteHandler: Handlers.deleteNoteHandler,
                    editNoteHandler: Handlers.editNoteHandler,
                    deprecateNoteHandler: Handlers.deprecateNoteHandler,
                    setNewNotePositionHandler:
                        Handlers.setNewNotePositionHandler,
                }}
            />
        </div>
    );
}

export default App;
