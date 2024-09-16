import { Reducer as ReducerT, useCallback, useMemo, useReducer } from "react";
import { newNote } from "../Components/NoteAppender/NoteAppender";

const Reducer: ReducerT<Note_T[], Action_T> = (state, action) => {
    const presist: typeof Reducer = (state, action) => {
        switch (action.type) {
            case "ADD_NOTE": {
                const newNote: Note_T = {
                    id: crypto.randomUUID(),
                    ...action.payload,
                };

                return [...state, newNote];
            }
            case "DELETE_NOTE": {
                return state.filter((note) => note.id !== action.payload);
            }
            case "EDIT_NOTE": {
                return state.map((note) => {
                    if (note.id !== action.payload.id) return note;
                    return {
                        ...note,
                        text: action.payload.text,
                    };
                });
            }
            case "DEPRECATE_NOTE": {
                return state.map((note) => {
                    if (note.id !== action.payload) return note;
                    const NowInMS = new Date().getTime();
                    return {
                        ...note,
                        deadLine: NowInMS - note.createdAt.getTime(),
                        derecateStatus: true,
                    };
                });
            }
            case "SET_NEW_NOTE_POSITION": {
                return state.map((note) => {
                    if (note.id !== action.payload.id) return note;
                    return {
                        ...note,
                        position: action.payload.position,
                    };
                });
            }
            default:
                return state;
        }
    };

    // save data to local storage its kinda like a middleware
    const store = presist(state, action);
    localStorage.setItem("store", JSON.stringify(store));
    return store;
};

// get data from local and ReFormat it to correct form
const localStore = localStorage.getItem("store");
const initalStateFormater = (localStore: string | null) => {
    if (!localStore) return [];

    type localNotes_T = Omit<Note_T, "createdAt"> & {
        createdAt: string;
    };
    const notes = JSON.parse(localStore) as localNotes_T[];
    const formatedNotes = notes.map((note) => {
        return {
            ...note,
            createdAt: new Date(note.createdAt),
        };
    }) as Note_T[];

    return formatedNotes;
};

const useNotes = () => {
    const [Notes, Dispatch] = useReducer(
        Reducer,
        initalStateFormater(localStore),
    );

    const generatePosition = useCallback<() => Note_T["position"]>(() => {
        const NoteContainerElement = document.getElementById(
            "NoteContainer",
        ) as HTMLDivElement;
        const max_w = NoteContainerElement.offsetWidth;
        const max_h = NoteContainerElement.offsetHeight;

        // remove note width and height from max_w and max_height
        // to be sure always note position is on the NoteContainerElement
        if (window.innerWidth < 640) {
            return {
                x: Math.floor(Math.random() * (max_w - 300)),
                y: Math.floor(Math.random() * (max_h - 282)),
            };
        }
        if (window.innerWidth >= 640 && window.innerWidth <= 768) {
            return {
                x: Math.floor(Math.random() * (max_w - 350)),
                y: Math.floor(Math.random() * (max_h - 298)),
            };
        }
        if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
            return {
                x: Math.floor(Math.random() * (max_w - 400)),
                y: Math.floor(Math.random() * (max_h - 304)),
            };
        }
        if (window.innerWidth >= 1024 && window.innerWidth <= 1280) {
            return {
                x: Math.floor(Math.random() * (max_w - 450)),
                y: Math.floor(Math.random() * (max_h - 328)),
            };
        }
        if (window.innerWidth >= 1280) {
            return {
                x: Math.floor(Math.random() * (max_w - 520)),
                y: Math.floor(Math.random() * (max_h - 345)),
            };
        }

        // otherwise :/
        return {
            x: 0,
            y: 0,
        };
    }, []);

    const addNoteHandler = useCallback(
        (payload: newNote) => {
            const position = generatePosition();
            Dispatch({
                type: "ADD_NOTE",
                payload: { ...payload, position, derecateStatus: false },
            });
        },
        [generatePosition],
    );

    const deleteNoteHandler = useCallback((id: Note_T["id"]) => {
        Dispatch({ type: "DELETE_NOTE", payload: id });
    }, []);

    const editNoteHandler = useCallback(
        (id: Note_T["id"], text: Note_T["text"]) => {
            Dispatch({ type: "EDIT_NOTE", payload: { id, text } });
        },
        [],
    );

    const deprecateNoteHandler = useCallback((id: Note_T["id"]) => {
        Dispatch({ type: "DEPRECATE_NOTE", payload: id });
    }, []);

    const setNewNotePositionHandler = useCallback(
        (
            id: SET_NEW_NOTE_POSITION_ACTION_T["payload"]["id"],
            position: SET_NEW_NOTE_POSITION_ACTION_T["payload"]["position"],
        ) => {
            Dispatch({
                type: "SET_NEW_NOTE_POSITION",
                payload: { id, position },
            });
        },
        [],
    );

    const Handlers = useMemo(() => {
        return {
            addNoteHandler,
            deleteNoteHandler,
            editNoteHandler,
            deprecateNoteHandler,
            setNewNotePositionHandler,
        };
    }, [
        addNoteHandler,
        deleteNoteHandler,
        editNoteHandler,
        deprecateNoteHandler,
        setNewNotePositionHandler,
    ]);

    return { Notes, Handlers };
};

export default useNotes;

export interface Note_T {
    id: string;
    text: string;
    createdAt: Date;
    deadLine: number;
    position: {
        x: number;
        y: number;
    };
    derecateStatus: boolean;
}

export interface ADD_NOTE_ACTION_T {
    type: "ADD_NOTE";
    // omit id property this one will added at reducer
    payload: Omit<Note_T, "id">;
}

export interface DELETE_NOTE_ACTION_T {
    type: "DELETE_NOTE";
    payload: Note_T["id"];
}

export interface EDIT_NOTE_ACTION_T {
    type: "EDIT_NOTE";
    payload: {
        id: Note_T["id"];
        text: Note_T["text"];
    };
}

export interface DEPRECATE_NOTE_ACTION_T {
    type: "DEPRECATE_NOTE";
    payload: Note_T["id"];
}

export interface SET_NEW_NOTE_POSITION_ACTION_T {
    type: "SET_NEW_NOTE_POSITION";
    payload: {
        id: Note_T["id"];
        position: Note_T["position"];
    };
}

type Action_T =
    | ADD_NOTE_ACTION_T
    | DELETE_NOTE_ACTION_T
    | EDIT_NOTE_ACTION_T
    | DEPRECATE_NOTE_ACTION_T
    | SET_NEW_NOTE_POSITION_ACTION_T;
