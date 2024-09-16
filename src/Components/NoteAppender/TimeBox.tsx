import EnNumTranslatorToFa from "../../Utils/EnNumTranslatorToFa";

const TimeBox = ({ Time, name }: { name: string; Time: Date }) => {
    // Format Date to persian time
    const DateFormater = (Date: Date) => {
        const DateForm = String(new Intl.DateTimeFormat("fa-IR").format(Date));

        const Hour = EnNumTranslatorToFa(Date.getHours());
        const Minute = EnNumTranslatorToFa(Date.getMinutes());
        const AddFaZero = (time: string) => {
            const zero = EnNumTranslatorToFa(0);
            return time.padStart(2, zero);
        };
        const ClockForm = AddFaZero(Hour) + ":" + AddFaZero(Minute);

        return `${DateForm} - ${ClockForm}`;
    };
    return (
        <div className="grid grid-cols-2 items-center ">
            <p className="pr-1">زمان {name}:</p>
            <div className="overflow-hidden bg-[#172032] text-[#707682] text-center max-w-sm w-full mr-auto">
                <span className="LTR mb-0.5 mt-1 inline-block md:mt-2 md:mb-1 lg:mt-3 lg:mb-2 ">
                    {DateFormater(Time)}
                </span>
            </div>
        </div>
    );
};
export default TimeBox;
