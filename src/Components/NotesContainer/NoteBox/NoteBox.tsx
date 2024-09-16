import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StatusColors } from "../../../Constants/StatusColor";
import { _1min, Times } from "../../../Constants/Time";
import EnNumTranslatorToFa from "../../../Utils/EnNumTranslatorToFa";
import { Note_T } from "../../../Utils/useNotes";
import DeleteModal from "../../Modal/DeleteModal";
import EditModal from "../../Modal/EditModal";
import ModalWrapper from "../../Modal/ModalWrapper";
import TimeBox from "../../NoteAppender/TimeBox";
import { NotesContainerProps } from "../NotesContainer";
import NoteHeaderText from "./NoteHeaderText";

const NoteBox = (props: NoteBox_T) => {
    const {
        id,
        createdAt,
        deadLine,
        text,
        Dispatchers,
        position,
        derecateStatus,
    } = props;
    const {
        deleteNoteHandler,
        editNoteHandler,
        deprecateNoteHandler,
        setNewNotePositionHandler,
    } = Dispatchers;

    const [ModalStatus, setModal] = useState<Modal>("IDLE");
    const [remaintime, setRemainTime] = useState({ unit: "", value: "" });
    const DeadLineTextContainer_Ref = useRef<HTMLDivElement>(null);
    const Note_Ref = useRef<HTMLDivElement>(null);
    const NoteHandle_Ref = useRef<HTMLDivElement>(null);

    const deadLineDate = useMemo(() => {
        return new Date(createdAt.getTime() + deadLine);
    }, [createdAt, deadLine]);

    // change note postion every time the position prop changes
    useEffect(() => {
        const Note = Note_Ref.current;
        if (!Note) return;

        Note.style.left = position.x + "px";
        Note.style.top = position.y + "px";
    }, [position]);

    const DeprecateNoteHandler = useCallback(() => {
        deprecateNoteHandler(id);
    }, [id, deprecateNoteHandler]);

    // Change DeadLineTextContainer border bottom color to show Note status
    // check the status every 15s
    useEffect(() => {
        const Element = DeadLineTextContainer_Ref.current;
        if (!Element) return;

        const StatusChecker = (
            deadlineDate: Date,
            deadlineInMs: Note_T["deadLine"],
        ) => {
            const remainTimeInMS =
                deadlineDate.getTime() - new Date().getTime();
            const precent = (remainTimeInMS / deadlineInMs) * 100;

            // check for the valie if within (the from number) and (to number)
            const isBetween = (from: number, to: number, value: number) => {
                if (value >= from && value <= to) {
                    return true;
                }
                return false;
            };

            // deprecate
            if (precent <= 0) {
                Element.style.borderBottomColor = "#7f1d1d";

                if (!derecateStatus) {
                    DeprecateNoteHandler();
                }
            }

            StatusColors.some(({ to, color, from }) => {
                if (isBetween(from, to, precent)) {
                    Element.style.borderBottomColor = color;
                    return true;
                }
            });
        };

        const checkerInterval = setInterval(
            StatusChecker,
            _1min / 4,
            deadLineDate,
            deadLine,
        );

        // (derecateStatus) is flag if its true means color changed to #7f1d1d
        // so this note dosent need to StatusChecker anymore
        // because its already has #7f1d1d and more check has the same result
        if (derecateStatus) {
            clearInterval(checkerInterval);
        }
        // check for the frist time before checkerInterval start runnig
        StatusChecker(deadLineDate, deadLine);

        return () => {
            clearInterval(checkerInterval);
        };
    }, [deadLineDate, deadLine, derecateStatus, DeprecateNoteHandler]);

    // estimate remaining time untill deadline
    // check the time every 20s
    useEffect(() => {
        const deadlineEstimator = (deadlineDate: Date) => {
            const nowInMs = new Date().getTime();
            const remainTimeInMS = deadlineDate.getTime() - nowInMs;

            const findUnit =
                [...Times].reverse().find((timeUnit) => {
                    return timeUnit.milliseconds < remainTimeInMS;
                }) ?? Times[0];

            const remainTime = (remainTimeInMS / findUnit.milliseconds).toFixed(
                1,
            );

            if (findUnit.unit === "دقیقه") {
                if (+remainTime <= 1 && +remainTime > 0.5) {
                    setRemainTime({
                        unit: findUnit.unit,
                        value: "کمتر از یک ",
                    });
                    return;
                } else if (+remainTime < 0.5) {
                    setRemainTime({
                        unit: `${EnNumTranslatorToFa(30)} ثانیه`,
                        value: "کمتر از ",
                    });
                    return;
                }
            }

            setRemainTime({ unit: findUnit.unit, value: remainTime });
        };

        const deadlineEstimatorInterval = setInterval(
            deadlineEstimator,
            _1min / 3,
            deadLineDate,
        );

        if (derecateStatus) {
            clearInterval(deadlineEstimatorInterval);
        } else {
            deadlineEstimator(deadLineDate);
        }

        return () => {
            clearInterval(deadlineEstimatorInterval);
        };
    }, [deadLineDate, derecateStatus]);

    // handle change note position by drag
    useEffect(() => {
        const Note = Note_Ref.current;
        const NoteHandle = NoteHandle_Ref.current;
        const NoteContainerElement = document.getElementById(
            "NoteContainer",
        ) as HTMLDivElement;

        if (!Note || !NoteHandle) return;

        // start tracking events
        // by mousedown event on noteHandle (three line on top left)
        const mouseDownHandler = () => {
            // calculate the max vertical & horizontal offset
            const max_x =
                NoteContainerElement.offsetWidth - Note.clientWidth - 2;
            const max_y =
                NoteContainerElement.offsetHeight - Note.clientHeight - 2;
            let offset_x: number;
            let offset_y: number;

            // tracking the mouse by mousemove event
            const mouseMoveHandler = (e: MouseEvent) => {
                // calculate the offset in NoteContainerElement element
                offset_x = e.pageX - NoteContainerElement.offsetLeft;

                // check for max horizontal offset if its exceeded use the max
                if (offset_x > max_x) {
                    offset_x = max_x;
                }

                offset_y = e.pageY - NoteContainerElement.offsetTop;
                if (offset_y > max_y) {
                    offset_y = max_y;
                }

                // change the note postion
                Note.style.left = offset_x + "px";
                Note.style.top = offset_y + "px";
            };

            const mouseMoveUpHandler = () => {
                // save note position to store(reucer)
                setNewNotePositionHandler(id, { x: offset_x, y: offset_y });

                // clear events
                NoteContainerElement.removeEventListener(
                    "mousemove",
                    mouseMoveHandler,
                );
                document.removeEventListener("mouseup", mouseMoveUpHandler);
            };

            NoteContainerElement.addEventListener(
                "mousemove",
                mouseMoveHandler,
            );
            document.addEventListener("mouseup", mouseMoveUpHandler);
        };

        NoteHandle.addEventListener("mousedown", mouseDownHandler);

        return () => {
            NoteHandle.removeEventListener("mousedown", mouseDownHandler);
        };
    }, [position, setNewNotePositionHandler, id]);

    const closeModalHandler = useCallback(() => {
        setModal("IDLE");
    }, []);

    const DeleteNoteHandler = useCallback(() => {
        deleteNoteHandler(id);
        closeModalHandler();
    }, [id, deleteNoteHandler, closeModalHandler]);

    const EditNoteHandler = useCallback(
        (text: Parameters<typeof editNoteHandler>["1"]) => {
            editNoteHandler(id, text);
            closeModalHandler();
        },
        [id, editNoteHandler, closeModalHandler],
    );

    return (
        <>
            <div
                key={id}
                ref={Note_Ref}
                className="bg-slate-700 absolute flex justify-between flex-col w-[300px] sm:w-[350px] md:w-[400px] lg:w-[450px] xl:w-[520px]"
            >
                <div
                    className="p-2 border-b-4 border-b-green-500 flex items-center justify-between"
                    ref={DeadLineTextContainer_Ref}
                >
                    <NoteHeaderText
                        isDeprecated={derecateStatus}
                        remaintime={remaintime}
                    />

                    <div
                        ref={NoteHandle_Ref}
                        className="cursor-move flex gap-1.5 flex-col"
                    >
                        <div className="bg-gray-300 w-8 h-1"></div>
                        <div className="bg-gray-300 w-8 h-1"></div>
                        <div className="bg-gray-300 w-8 h-1"></div>
                    </div>
                </div>

                <div className="p-2">
                    <p>متن:</p>
                    <p className="p-2 break-words text-justify px-3 overflow-y-auto h-32">
                        {text}
                    </p>
                </div>
                <div>
                    <TimeBox name="ثبت" Time={createdAt} />

                    <div className="grid items-center grid-cols-2 bg-slate-400 text-slate-700">
                        <button
                            className="p-2 hover:bg-slate-500 border-l border-l-slate-600"
                            onClick={() => {
                                setModal("DELETE");
                            }}
                        >
                            حذف
                        </button>
                        <button
                            className="p-2 hover:bg-slate-500 border-r border-r-slate-600"
                            onClick={() => {
                                setModal("EDIT");
                            }}
                        >
                            ویرایش
                        </button>
                    </div>
                </div>
            </div>
            {ModalStatus !== "IDLE" && (
                <ModalWrapper Close={closeModalHandler}>
                    {ModalStatus == "DELETE" ? (
                        <DeleteModal
                            Close={closeModalHandler}
                            Delete={DeleteNoteHandler}
                        />
                    ) : (
                        <EditModal
                            Close={closeModalHandler}
                            Edit={EditNoteHandler}
                            currentText={text}
                            Deprecate={DeprecateNoteHandler}
                            isDeprecated={derecateStatus}
                        />
                    )}
                </ModalWrapper>
            )}
        </>
    );
};
export default NoteBox;

type Modal = "IDLE" | "DELETE" | "EDIT";

interface NoteBox_T extends Note_T {
    Dispatchers: NotesContainerProps["Dispatchers"];
}
