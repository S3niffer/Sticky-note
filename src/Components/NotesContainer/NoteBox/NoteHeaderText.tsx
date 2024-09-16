const NoteHeaderText = ({ isDeprecated, remaintime }: props) => {
    return (
        <div className="line-clamp-1 flex items-center gap-2 select-none">
            <div className="line-clamp-1 flex items-center gap-2 select-none">
                {isDeprecated ? (
                    " منقضی شده"
                ) : (
                    <>
                        تا ددلاین:
                        <div className="flex items-center gap-1.5">
                            <span>{remaintime.value}</span>
                            <span>{remaintime.unit}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
export default NoteHeaderText;

interface props {
    isDeprecated: boolean;
    remaintime: {
        unit: string;
        value: string;
    };
}
