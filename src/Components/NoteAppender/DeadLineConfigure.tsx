import { useEffect, useState } from "react";
import { Times } from "../../Constants/Time";
import EnNumTranslatorToFa from "../../Utils/EnNumTranslatorToFa";
import FaNumTranslatorToEn from "../../Utils/FaNumTranslatorToEn";
import { newNote } from "./NoteAppender";

const InitialState: deadLineConfig_T = {
    unitID: Times["1"].id,
    count: 1,
};

const DeadLineConfigure = ({ setNote, Flag, restoreFlag }: Props) => {
    const [deadLineConfig, setDeadLineConfig] = useState(InitialState);

    const CountInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const Value = FaNumTranslatorToEn(event.target.value).toString();

        if (isNaN(Number(Value))) return;

        setDeadLineConfig((prv) => ({
            ...prv,
            // if smaller than 1 => 1
            // if bigger than 999 => 1000
            // others its ok
            count: +Value < 1 ? 1 : +Value > 999 ? 1000 : +Value,
        }));
    };

    const UnitInputHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const unitID = event.target.value as deadLineConfig_T["unitID"];
        setDeadLineConfig((prv) => ({ ...prv, unitID }));
    };

    // setDeadline time to Note state in NoteAppender component
    // every time deadLineConfig state changes
    useEffect(() => {
        // prevent setNew deadline when Flag is true
        if (Flag) return;

        const UnitTime = Times.find(
            (time) => time.id === deadLineConfig.unitID,
        )!;
        const deadLineConfigToMiliSeconds =
            UnitTime?.milliseconds * deadLineConfig.count;

        setNote((prv) => ({ ...prv, deadLine: deadLineConfigToMiliSeconds }));
    }, [setNote, deadLineConfig, Flag]);

    // reset configs when Flag became true
    // restore Flag to false
    useEffect(() => {
        if (!Flag) return;

        setDeadLineConfig(InitialState);
        restoreFlag();
    }, [Flag, restoreFlag]);

    return (
        <div className=" flex items-center justify-start gap-1.5 flex-wrap ">
            <p>زمان ددلاین در</p>

            <input
                className="flex-shrink-0 z-10 inline-flex items-center py-3 lg:py-3.5 px-4 font-medium text-center bg-slate-800 hover:bg-slate-800/80 outline-none max-w-24 xl:py-4 LTR"
                type="text"
                value={EnNumTranslatorToFa(deadLineConfig.count)}
                onChange={CountInputHandler}
            ></input>
            <select
                value={deadLineConfig.unitID}
                onChange={UnitInputHandler}
                className="bg-slate-800 block w-full py-2.5 outline-none max-w-40 lg:max-w-44 xl:max-w-56"
            >
                {Times.map(({ id, unit }) => (
                    <option value={id} key={id}>
                        {unit}
                    </option>
                ))}
            </select>

            <p>پس از زمان ایجاد، ثبت بشود.</p>
        </div>
    );
};
export default DeadLineConfigure;

interface deadLineConfig_T {
    unitID: (typeof Times)[number]["id"];
    count: number;
}

interface Props {
    setNote: React.Dispatch<React.SetStateAction<newNote>>;
    Flag: boolean;
    restoreFlag: () => void;
}
